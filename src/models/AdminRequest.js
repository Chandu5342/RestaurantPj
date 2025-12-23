const mongoose = require('mongoose');

const adminRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    restaurantName: { type: String, required: true },
    location: String,
    profileImage: String,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminRequest', adminRequestSchema);