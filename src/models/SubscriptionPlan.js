const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    duration: {
        type: String,
        enum: ['monthly', 'quarterly', 'yearly'],
        default: 'monthly'
    },
    features: [{
        type: String,
        required: true
    }],
    maxTables: {
        type: Number,
        default: 10
    },
    maxMenuItems: {
        type: Number,
        default: 50
    },
    maxStaff: {
        type: Number,
        default: 5
    },
    supportLevel: {
        type: String,
        enum: ['basic', 'priority', 'dedicated'],
        default: 'basic'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    sortOrder: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);