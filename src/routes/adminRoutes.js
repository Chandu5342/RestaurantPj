const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// Admin dashboard stats
router.get('/dashboard', protect, roleMiddleware('admin'), async (req, res) => {
    try {
        const user = req.user;

        // Get restaurant data
        const Restaurant = require('../models/Restaurant');
        const restaurant = await Restaurant.findOne({ owner: user._id });

        const stats = {
            totalOrders: restaurant?.totalOrders || 0,
            totalRevenue: restaurant?.totalRevenue || 0,
            restaurantName: restaurant?.name || user.restaurantName,
            status: restaurant?.status || 'active',
            subscriptionStatus: restaurant?.subscriptionStatus || 'active',
        };

        res.json({ success: true, stats });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;