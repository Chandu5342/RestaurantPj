const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');

// Get all subscription plans
router.get('/plans', async (req, res) => {
    try {
        const plans = await Plan.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: plans
        });
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch plans'
        });
    }
});

// Create new subscription plan
router.post('/plans', async (req, res) => {
    try {
        const plan = new Plan(req.body);
        await plan.save();
        res.status(201).json({
            success: true,
            message: 'Plan created successfully',
            data: plan
        });
    } catch (error) {
        console.error('Error creating plan:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create plan'
        });
    }
});

// Update subscription plan
router.put('/plans/:id', async (req, res) => {
    try {
        const plan = await Plan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!plan) {
            return res.status(404).json({
                success: false,
                error: 'Plan not found'
            });
        }
        res.json({
            success: true,
            message: 'Plan updated successfully',
            data: plan
        });
    } catch (error) {
        console.error('Error updating plan:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update plan'
        });
    }
});

// Delete subscription plan
router.delete('/plans/:id', async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);
        if (!plan) {
            return res.status(404).json({
                success: false,
                error: 'Plan not found'
            });
        }
        await plan.deleteOne();
        res.json({
            success: true,
            message: 'Plan deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting plan:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete plan'
        });
    }
});

module.exports = router;