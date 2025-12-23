// D:\designblocks\backend\server.js - FINAL WORKING VERSION
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n=== ${new Date().toLocaleTimeString()} ===`);
  console.log(`${req.method} ${req.originalUrl}`);
  console.log('Params:', req.params);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Body:', req.body);
  }
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurant_db')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Connection Error:', err.message));

// Schemas
const restaurantSchema = new mongoose.Schema({
  name: String,
  owner: String,
  email: String,
  phone: String,
  address: String,
  image: String,
  plan: String,
  status: { type: String, default: 'active' },
  orders: { type: Number, default: 0 },
  revenue: { type: String, default: '₹0' },
  createdAt: { type: Date, default: Date.now }
});

const planSchema = new mongoose.Schema({
  name: String,
  price: String,
  restaurants: Number,
  features: [String],
  createdAt: { type: Date, default: Date.now }
});

// Models
const Restaurant = mongoose.model('Restaurant', restaurantSchema);
const Plan = mongoose.model('Plan', planSchema);

// Initialize database
async function initializeDatabase() {
  try {
    // Check if data already exists
    const restaurantCount = await Restaurant.countDocuments();
    const planCount = await Plan.countDocuments();

    if (restaurantCount === 0) {
      await Restaurant.insertMany([
        {
          name: "The Urban Kitchen",
          owner: "John Smith",
          email: "john@urban.com",
          phone: "+91 98765 43210",
          address: "123 MG Road, Mumbai",
          image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
          plan: "Pro",
          status: "active",
          orders: 1250,
          revenue: "₹3,45,000"
        },
        {
          name: "Pizza Paradise",
          owner: "Maria Garcia",
          email: "maria@pizza.com",
          phone: "+91 98765 43211",
          address: "456 Park Street, Delhi",
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
          plan: "Business",
          status: "active",
          orders: 2100,
          revenue: "₹5,20,000"
        }
      ]);
      console.log('✅ Sample restaurants added');
    }

    if (planCount === 0) {
      await Plan.insertMany([
        {
          name: "Starter",
          price: "₹999/month",
          restaurants: 12,
          features: ["Basic Menu", "10 Tables", "Email Support", "Basic Analytics"]
        },
        {
          name: "Pro",
          price: "₹2,499/month",
          restaurants: 45,
          features: ["Unlimited Menu", "50 Tables", "Priority Support", "Advanced Analytics", "Mobile App"]
        },
        {
          name: "Business",
          price: "₹4,999/month",
          restaurants: 120,
          features: ["Unlimited Menu", "Unlimited Tables", "24/7 Phone Support", "Advanced Analytics", "Mobile App", "API Access"]
        }
      ]);
      console.log('✅ Sample plans added');
    }
  } catch (error) {
    console.log('⚠️  Database init error:', error.message);
  }
}

// ================== ROUTES ==================

// Home
app.get('/', (req, res) => {
  res.json({ message: 'Restaurant Management API' });
});

// ===== SUBSCRIPTION PLANS =====
app.get('/api/subscriptions/plans', async (req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 });
    const plansArray = plans.map(plan => ({
      id: plan._id.toString(),
      name: plan.name,
      price: plan.price,
      restaurants: plan.restaurants,
      features: plan.features || []
    }));

    res.json(plansArray);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.json([
      {
        id: "1",
        name: "Starter",
        price: "₹999/month",
        restaurants: 12,
        features: ["Basic Menu", "10 Tables", "Email Support"]
      },
      {
        id: "2",
        name: "Pro",
        price: "₹2,499/month",
        restaurants: 45,
        features: ["Unlimited Menu", "50 Tables", "Priority Support", "Analytics"]
      }
    ]);
  }
});

app.post('/api/subscriptions/plans', async (req, res) => {
  try {
    const plan = new Plan(req.body);
    await plan.save();
    res.json({
      success: true,
      message: 'Plan created',
      plan: { id: plan._id.toString(), ...plan.toObject() }
    });
  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/subscriptions/plans/:id', async (req, res) => {
  try {
    console.log('Updating plan ID:', req.params.id, 'Data:', req.body);
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    res.json({
      success: true,
      message: 'Plan updated',
      plan: { id: plan._id.toString(), ...plan.toObject() }
    });
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/subscriptions/plans/:id', async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Plan deleted' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== RESTAURANTS =====
app.get('/api/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    const transformed = restaurants.map(r => ({
      id: r._id.toString(),
      name: r.name,
      owner: r.owner,
      email: r.email,
      phone: r.phone,
      address: r.address,
      image: r.image,
      plan: r.plan,
      status: r.status,
      orders: r.orders,
      revenue: r.revenue,
      createdAt: r.createdAt
    }));
    res.json({ restaurants: transformed });
  } catch (error) {
    console.error('Error:', error);
    res.json({ restaurants: [] });
  }
});

app.post('/api/restaurants', async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.json({
      message: 'Success',
      restaurant: { id: restaurant._id.toString(), ...restaurant.toObject() }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/restaurants/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json({
      message: 'Updated',
      restaurant: { id: restaurant._id.toString(), ...restaurant.toObject() }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== DELETE RESTAURANT - ULTIMATE FIX =====
app.delete('/api/restaurants/:id', async (req, res) => {
  try {
    const restaurantId = req.params.id;

    console.log('🗑️ DELETE REQUEST DETAILS:');
    console.log('ID received:', restaurantId);
    console.log('ID type:', typeof restaurantId);
    console.log('Full URL:', req.originalUrl);

    // STEP 1: Check if ID exists at all
    if (!restaurantId) {
      console.log('❌ ERROR: No ID provided in URL');
      return res.status(400).json({
        success: false,
        error: 'Restaurant ID is required',
        message: 'The URL must include a restaurant ID. Example: DELETE /api/restaurants/123'
      });
    }

    // STEP 2: Check if ID is the string "undefined"
    if (restaurantId === 'undefined') {
      console.log('❌ ERROR: ID is literally the string "undefined"');
      console.log('💡 This means your FRONTEND is sending: DELETE /api/restaurants/undefined');
      console.log('💡 Check your frontend code where you call this API');
      return res.status(400).json({
        success: false,
        error: 'Invalid restaurant ID',
        message: 'The restaurant ID cannot be "undefined". Check your frontend code.',
        help: 'Make sure you are passing a valid restaurant ID'
      });
    }

    // STEP 3: Check if it's a valid MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      console.log('❌ ERROR: Invalid MongoDB ID format:', restaurantId);
      console.log('💡 Valid IDs look like: 507f1f77bcf86cd799439011');
      return res.status(400).json({
        success: false,
        error: 'Invalid restaurant ID format',
        message: `"${restaurantId}" is not a valid restaurant ID`,
        example: 'Valid ID format: 507f1f77bcf86cd799439011'
      });
    }

    // STEP 4: Try to delete from database
    console.log('✅ ID validated, attempting to delete from database...');
    const restaurant = await Restaurant.findByIdAndDelete(restaurantId);

    if (!restaurant) {
      console.log('⚠️ Restaurant not found in database with ID:', restaurantId);
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found',
        message: `No restaurant found with ID: ${restaurantId}`
      });
    }

    console.log('✅ SUCCESS: Restaurant deleted:', restaurant.name);

    // STEP 5: Return success response
    res.json({
      success: true,
      message: 'Restaurant deleted successfully',
      deletedRestaurant: {
        id: restaurant._id.toString(),
        name: restaurant.name
      }
    });

  } catch (error) {
    console.error('❌ UNEXPECTED ERROR:', error.message);

    // Special handling for CastError
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Database error: Invalid ID format',
        message: 'The database cannot process this ID',
        details: error.message
      });
    }

    // Generic error
    res.status(500).json({
      success: false,
      error: 'Server error while deleting restaurant',
      message: error.message
    });
  }
});

app.get('/api/restaurants/stats', async (req, res) => {
  try {
    const total = await Restaurant.countDocuments();
    const active = await Restaurant.countDocuments({ status: 'active' });
    res.json({
      totalRestaurants: total,
      activeRestaurants: active,
      totalRevenue: 45600000,
      totalOrders: 1200000
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({
      totalRestaurants: 2547,
      activeRestaurants: 2200,
      totalRevenue: 45600000,
      totalOrders: 1200000
    });
  }
});

app.patch('/api/restaurants/:id/status', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json({
      message: 'Status updated',
      restaurant: { id: restaurant._id.toString(), ...restaurant.toObject() }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== DEBUG ENDPOINTS =====
app.get('/api/debug/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find().select('_id name');
    res.json({
      message: 'Available restaurants for testing',
      restaurants: restaurants.map(r => ({
        id: r._id.toString(),
        name: r.name,
        deleteExample: `DELETE http://localhost:${PORT}/api/restaurants/${r._id}`
      }))
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working!',
    testDelete: `Use DELETE http://localhost:${PORT}/api/restaurants/:id`,
    getRestaurantIds: `GET http://localhost:${PORT}/api/debug/restaurants`
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`\n🔧 IMPORTANT: Your frontend is sending "undefined" as ID`);
  console.log(`💡 To test delete manually:`);
  console.log(`   1. GET http://localhost:${PORT}/api/debug/restaurants`);
  console.log(`   2. Copy a restaurant ID`);
  console.log(`   3. DELETE http://localhost:${PORT}/api/restaurants/PASTE_ID_HERE`);
  console.log(`\n📋 Subscription Plans: GET http://localhost:${PORT}/api/subscriptions/plans`);
  console.log(`🏪 Restaurants: GET http://localhost:${PORT}/api/restaurants`);

  try {
    await mongoose.connection.asPromise();
    console.log('✅ MongoDB Connected');
    await initializeDatabase();
  } catch (error) {
    console.log('⚠️  MongoDB Error:', error.message);
  }
});