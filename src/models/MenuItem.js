const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['all', 'pizza', 'burger', 'pasta', 'salad', 'dessert', 'drinks', 'appetizer', 'main-course']
    },
    image: {
        type: String,
        default: ''
    },
    isVeg: {
        type: Boolean,
        default: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    isPopular: {
        type: Boolean,
        default: false
    },
    isRecommended: {
        type: Boolean,
        default: false
    },
    isTodaySpecial: {
        type: Boolean,
        default: false
    },
    isNew: {
        type: Boolean,
        default: false
    },
    hasOffer: {
        type: Boolean,
        default: false
    },
    spicyLevel: {
        type: String,
        enum: [null, 'mild', 'medium', 'hot', 'extra-hot'],
        default: null
    },
    ingredients: [String],
    preparationTime: {
        type: Number,
        default: 15
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 4.5
    },
    reviews: {
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

module.exports = mongoose.model('MenuItem', menuItemSchema);