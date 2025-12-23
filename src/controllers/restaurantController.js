const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, status, plan } = req.query;

        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { 'address.fullAddress': { $regex: search, $options: 'i' } }
            ];
        }

        if (status) query.status = status;

        const restaurants = await Restaurant.find(query)
            .populate('owner', 'name email phone')
            .populate('subscriptionPlan', 'name price')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Restaurant.countDocuments(query);

        res.json({
            restaurants,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalRestaurants: count
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get restaurant by ID
exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id)
            .populate('owner', 'name email phone avatar')
            .populate('subscriptionPlan');

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create restaurant
exports.createRestaurant = async (req, res) => {
    try {
        const { name, email, phone, address, ownerEmail, ownerName, ownerPhone, plan } = req.body;

        // Check if restaurant already exists
        const existingRestaurant = await Restaurant.findOne({ email });
        if (existingRestaurant) {
            return res.status(400).json({ error: 'Restaurant with this email already exists' });
        }

        // Check if owner exists or create new
        let owner = await User.findOne({ email: ownerEmail });
        if (!owner) {
            const tempPassword = Math.random().toString(36).slice(-8);
            owner = new User({
                name: ownerName,
                email: ownerEmail,
                phone: ownerPhone,
                password: tempPassword,
                role: 'restaurant_owner'
            });
            await owner.save();
            // TODO: Send email with credentials
        }

        const restaurant = new Restaurant({
            name,
            email,
            phone,
            address: {
                fullAddress: address,
                ...JSON.parse(address || '{}')
            },
            owner: owner._id,
            image: req.file?.path || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
            status: 'trial',
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days trial
        });

        await restaurant.save();

        res.status(201).json({
            message: 'Restaurant created successfully',
            restaurant
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update restaurant
exports.updateRestaurant = async (req, res) => {
    try {
        const updates = req.body;

        if (updates.address && typeof updates.address === 'string') {
            updates.address = { fullAddress: updates.address };
        }

        if (req.file) {
            updates.image = req.file.path;
        }

        const restaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            { ...updates, updatedAt: Date.now() },
            { new: true, runValidators: true }
        ).populate('owner subscriptionPlan');

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        res.json({
            message: 'Restaurant updated successfully',
            restaurant
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete restaurant
exports.deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        // Also delete associated user if no other restaurants
        const otherRestaurants = await Restaurant.countDocuments({ owner: restaurant.owner });
        if (otherRestaurants === 0) {
            await User.findByIdAndDelete(restaurant.owner);
        }

        res.json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Toggle restaurant status
exports.toggleRestaurantStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['active', 'suspended', 'inactive'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const restaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: Date.now() },
            { new: true }
        );

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        res.json({
            message: `Restaurant ${status} successfully`,
            restaurant
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get restaurant stats
exports.getRestaurantStats = async (req, res) => {
    try {
        const total = await Restaurant.countDocuments();
        const active = await Restaurant.countDocuments({ status: 'active' });
        const trial = await Restaurant.countDocuments({ status: 'trial' });
        const suspended = await Restaurant.countDocuments({ status: 'suspended' });
        const totalRevenue = await Restaurant.aggregate([
            { $group: { _id: null, total: { $sum: '$revenue' } } }
        ]);

        res.json({
            totalRestaurants: total,
            activeRestaurants: active,
            trialRestaurants: trial,
            suspendedRestaurants: suspended,
            totalRevenue: totalRevenue[0]?.total || 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};