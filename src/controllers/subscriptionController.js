const SubscriptionPlan = require('../models/SubscriptionPlan');

// Get all subscription plans
exports.getAllPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find({ isActive: true }).sort('sortOrder');
        res.json(plans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get plan by ID
exports.getPlanById = async (req, res) => {
    try {
        const plan = await SubscriptionPlan.findById(req.params.id);
        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }
        res.json(plan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create subscription plan
exports.createPlan = async (req, res) => {
    try {
        const { name, price, duration, features, maxTables, maxMenuItems, maxStaff, supportLevel } = req.body;

        const existingPlan = await SubscriptionPlan.findOne({ name });
        if (existingPlan) {
            return res.status(400).json({ error: 'Plan with this name already exists' });
        }

        const plan = new SubscriptionPlan({
            name,
            price: parseFloat(price),
            duration,
            features: Array.isArray(features) ? features : features.split(',').map(f => f.trim()),
            maxTables: parseInt(maxTables) || 10,
            maxMenuItems: parseInt(maxMenuItems) || 50,
            maxStaff: parseInt(maxStaff) || 5,
            supportLevel
        });

        await plan.save();
        res.status(201).json({
            message: 'Subscription plan created successfully',
            plan
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update subscription plan
exports.updatePlan = async (req, res) => {
    try {
        const updates = req.body;

        if (updates.features && typeof updates.features === 'string') {
            updates.features = updates.features.split(',').map(f => f.trim());
        }

        const plan = await SubscriptionPlan.findByIdAndUpdate(
            req.params.id,
            { ...updates, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        res.json({
            message: 'Plan updated successfully',
            plan
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete subscription plan
exports.deletePlan = async (req, res) => {
    try {
        const plan = await SubscriptionPlan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        // Check if any restaurant is using this plan
        const Restaurant = require('../models/Restaurant');
        const restaurantsUsingPlan = await Restaurant.countDocuments({ subscriptionPlan: plan._id });

        if (restaurantsUsingPlan > 0) {
            return res.status(400).json({
                error: `Cannot delete plan. ${restaurantsUsingPlan} restaurant(s) are using this plan.`
            });
        }

        await plan.deleteOne();
        res.json({ message: 'Plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Toggle plan status
exports.togglePlanStatus = async (req, res) => {
    try {
        const plan = await SubscriptionPlan.findByIdAndUpdate(
            req.params.id,
            { isActive: req.body.isActive, updatedAt: Date.now() },
            { new: true }
        );

        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        res.json({
            message: `Plan ${plan.isActive ? 'activated' : 'deactivated'} successfully`,
            plan
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};