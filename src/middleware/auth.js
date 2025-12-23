// D:\designblocks\backend\server.js - COMPLETE WORKING VERSION
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import your middleware
const { protect, admin } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
    if (req.method === 'POST' && req.path === '/api/auth/login') {
        console.log('Login attempt for:', req.body.email);
    }
    next();
});

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/restaurant_db', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:', error.message);
        console.log('\n💡 Start MongoDB first:');
        console.log('   Command: mongod');
        console.log('   Or on Windows: net start MongoDB');
        process.exit(1);
    }
};

// User Schema (simplified version to match your middleware)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['super-admin', 'admin', 'pending-admin'], default: 'pending-admin' },
    restaurantName: String,
    location: String,
    profileImage: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'active', 'suspended'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add virtual 'id' field to match your middleware (decoded.id)
userSchema.virtual('id').get(function () {
    return this._id.toString();
});

const User = mongoose.model('User', userSchema);

// Initialize Database
const initializeDatabase = async () => {
    try {
        console.log('\n🔄 Initializing Database...');

        // Check if super admin exists
        const superAdmin = await User.findOne({ email: 'superadmin@restaurant.com' });

        if (!superAdmin) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 10);

            const newSuperAdmin = new User({
                name: 'Super Admin',
                email: 'superadmin@restaurant.com',
                password: hashedPassword,
                role: 'super-admin',
                status: 'active'
            });

            await newSuperAdmin.save();
            console.log('✅ Super Admin created successfully');
            console.log('   📧 Email: superadmin@restaurant.com');
            console.log('   🔑 Password: admin123');
        } else {
            console.log('✅ Super Admin already exists');
        }

        // Count all users
        const userCount = await User.countDocuments();
        console.log(`📊 Total users in database: ${userCount}`);

    } catch (error) {
        console.error('❌ Database initialization error:', error.message);
    }
};

// ==================== ROUTES ====================

// Health Check
app.get('/', (req, res) => {
    res.json({
        message: 'Restaurant Management API',
        status: 'running',
        version: '2.0',
        timestamp: new Date().toISOString()
    });
});

// Debug endpoint - Get all users
app.get('/api/debug/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.json({
            success: true,
            count: users.length,
            users: users.map(user => ({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                restaurantName: user.restaurantName
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Test MongoDB connection
app.get('/api/test/db', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.json({
            success: true,
            message: 'Database is working',
            userCount,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: 'Database error: ' + error.message });
    }
});

// ==================== AUTH ROUTES ====================

// LOGIN ENDPOINT - FIXED TO MATCH YOUR MIDDLEWARE
app.post('/api/auth/login', async (req, res) => {
    try {
        console.log('\n🔐 Login Request Received');
        console.log('Email:', req.body.email);

        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email and password'
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            console.log('❌ User not found in database');
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        console.log('✅ User found:', {
            id: user._id,
            email: user.email,
            role: user.role,
            status: user.status
        });

        // Check password
        const bcrypt = require('bcryptjs');
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('❌ Password incorrect');
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check account status
        if (user.status !== 'active' && user.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                error: `Account is ${user.status}. Please contact administrator.`
            });
        }

        // Create token (MATCHING YOUR MIDDLEWARE)
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            {
                id: user._id,  // MUST be 'id' to match your middleware (decoded.id)
                email: user.email,
                role: user.role,
                name: user.name
            },
            process.env.JWT_SECRET || 'restaurant-secret-key',
            { expiresIn: '30d' }
        );

        console.log('✅ Login successful, token generated');

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                restaurantName: user.restaurantName,
                profileImage: user.profileImage
            }
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error during login'
        });
    }
});

// REGISTER ENDPOINT
app.post('/api/auth/register', async (req, res) => {
    try {
        console.log('\n📝 Registration Request:', req.body);

        const { name, email, password, restaurantName, location, profileImage, plan } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide name, email, and password'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters'
            });
        }

        // Check if user exists
        const userExists = await User.findOne({ email: email.toLowerCase().trim() });
        if (userExists) {
            return res.status(400).json({
                success: false,
                error: 'User already exists with this email'
            });
        }

        // Hash password
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: restaurantName ? 'pending-admin' : 'admin',
            restaurantName: restaurantName || '',
            location: location || '',
            profileImage: profileImage || '',
            status: 'pending'
        });

        console.log('✅ User registered:', user.email);

        res.status(201).json({
            success: true,
            message: 'Registration successful. Account pending admin approval.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            error: 'Registration failed'
        });
    }
});

// ==================== PROTECTED ROUTES ====================

// Test protected route
app.get('/api/auth/test', protect, (req, res) => {
    res.json({
        success: true,
        message: 'Protected route accessed successfully',
        user: req.user
    });
});

// Get pending registrations (Super Admin only)
app.get('/api/admin/pending-registrations', protect, admin, async (req, res) => {
    try {
        // Only super-admin can access
        if (req.user.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                error: 'Super admin access required'
            });
        }

        const pendingUsers = await User.find({
            role: 'pending-admin',
            status: 'pending'
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: pendingUsers.length,
            users: pendingUsers.map(user => ({
                id: user._id,
                name: user.name,
                email: user.email,
                restaurantName: user.restaurantName,
                location: user.location,
                profileImage: user.profileImage,
                createdAt: user.createdAt
            }))
        });

    } catch (error) {
        console.error('Error fetching pending registrations:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch pending registrations'
        });
    }
});

// Approve registration
app.post('/api/admin/approve/:id', protect, admin, async (req, res) => {
    try {
        // Only super-admin can approve
        if (req.user.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                error: 'Super admin access required'
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        if (user.status !== 'pending') {
            return res.status(400).json({
                success: false,
                error: `User is already ${user.status}`
            });
        }

        // Update user status
        user.status = 'approved';
        user.role = 'admin';
        await user.save();

        res.json({
            success: true,
            message: 'User approved successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                status: user.status
            }
        });

    } catch (error) {
        console.error('Error approving user:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to approve user'
        });
    }
});

// Get current user profile
app.get('/api/auth/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch profile'
        });
    }
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('🔥 Server Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start Server
const startServer = async () => {
    try {
        await connectDB();
        await initializeDatabase();

        app.listen(PORT, () => {
            console.log(`\n🚀 Server running on http://localhost:${PORT}`);
            console.log(`\n📋 Available Endpoints:`);
            console.log(`   GET  /                         - Health check`);
            console.log(`   POST /api/auth/login           - Login`);
            console.log(`   POST /api/auth/register        - Register`);
            console.log(`   GET  /api/auth/me              - Get profile (protected)`);
            console.log(`   GET  /api/admin/pending-registrations - Pending users (super admin)`);
            console.log(`   GET  /api/debug/users          - Debug: List all users`);
            console.log(`   GET  /api/test/db              - Test database connection`);
            console.log(`\n🔧 Test Credentials:`);
            console.log(`   Email: superadmin@restaurant.com`);
            console.log(`   Password: admin123`);
            console.log(`\n⚠️  Make sure your frontend is running on http://localhost:3000`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();