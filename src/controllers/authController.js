const User = require('../models/User');
const AdminRequest = require('../models/AdminRequest');
const { sendEmail } = require('../config/email');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Register User
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, restaurantName, location, profileImage } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role,
            restaurantName: role === 'admin' ? restaurantName : undefined,
            location: role === 'admin' ? location : undefined,
            profileImage: role === 'admin' ? profileImage : undefined,
            status: role === 'super-admin' ? 'approved' : 'pending',
        });

        // If admin, create admin request
        if (role === 'admin') {
            await AdminRequest.create({
                userId: user._id,
                name,
                email,
                restaurantName,
                location,
                profileImage,
                status: 'pending',
            });

            // Notify super admin
            const superAdmins = await User.find({ role: 'super-admin' });
            for (const admin of superAdmins) {
                await sendEmail(
                    admin.email,
                    'New Admin Registration Request',
                    `
            <h2>New Admin Registration Request</h2>
            <p>A new restaurant admin has registered and needs approval:</p>
            <ul>
              <li><strong>Name:</strong> ${name}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Restaurant:</strong> ${restaurantName}</li>
              <li><strong>Location:</strong> ${location}</li>
              <li><strong>Date:</strong> ${new Date().toLocaleString()}</li>
            </ul>
            <p>Please review and approve/reject the request in the Super Admin Dashboard.</p>
          `
                );
            }
        }

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            success: true,
            message: role === 'admin'
                ? 'Registration successful! Waiting for super admin approval.'
                : 'Registration successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check status
        if (user.status !== 'approved') {
            return res.status(403).json({
                error: 'Account not approved yet. Please wait for super admin approval.'
            });
        }

        // Generate token
        const token = generateToken(user._id, user.role);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                restaurantName: user.restaurantName,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        // Send email
        const resetUrl = `${process.env.FRONTEND_URL}/admin/reset-password?token=${resetToken}`;

        await sendEmail(
            user.email,
            'Password Reset Request',
            `
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the link below:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
        );

        res.json({
            success: true,
            message: 'Password reset instructions sent to email'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get Current User
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ success: true, user });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};