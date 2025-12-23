const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        pincode: String,
        fullAddress: String
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'
    },
    subscriptionPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubscriptionPlan'
    },
    status: {
        type: String,
        enum: ['active', 'trial', 'suspended', 'inactive'],
        default: 'trial'
    },
    trialEndsAt: Date,
    orders: {
        type: Number,
        default: 0
    },
    revenue: {
        type: Number,
        default: 0
    },
    qrCode: String,
    settings: {
        currency: {
            type: String,
            default: 'INR'
        },
        timezone: {
            type: String,
            default: 'Asia/Kolkata'
        },
        language: {
            type: String,
            default: 'en'
        }
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

module.exports = mongoose.model('Restaurant', restaurantSchema);