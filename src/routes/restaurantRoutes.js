const express = require('express');
const router = express.Router();
const { auth, requireSuperAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const restaurantController = require('../controllers/restaurantController');

// All routes require Super Admin authentication
router.use(auth, requireSuperAdmin);

// Get all restaurants
router.get('/', restaurantController.getAllRestaurants);

// Get restaurant stats
router.get('/stats', restaurantController.getRestaurantStats);

// Get single restaurant
router.get('/:id', restaurantController.getRestaurantById);

// Create restaurant
router.post('/', upload.single('image'), restaurantController.createRestaurant);

// Update restaurant
router.put('/:id', upload.single('image'), restaurantController.updateRestaurant);

// Delete restaurant
router.delete('/:id', restaurantController.deleteRestaurant);

// Toggle status
router.patch('/:id/status', restaurantController.toggleRestaurantStatus);

module.exports = router;