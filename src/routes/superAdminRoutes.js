const express = require('express');
const router = express.Router();
const {
    getAdminRequests,
    approveAdminRequest,
    rejectAdminRequest,
    getAllAdmins,
    getAllRestaurants,
    updateAdminStatus,
    deleteAdmin
} = require('../controllers/superAdminController');
const { protect } = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// Protect all routes and require super-admin role
router.use(protect);
router.use(roleMiddleware('super-admin'));

router.get('/admin-requests', getAdminRequests);
router.put('/admin-requests/:requestId/approve', approveAdminRequest);
router.put('/admin-requests/:requestId/reject', rejectAdminRequest);
router.get('/admins', getAllAdmins);
router.get('/restaurants', getAllRestaurants);
router.put('/admins/:adminId/status', updateAdminStatus);
router.delete('/admins/:adminId', deleteAdmin);

module.exports = router;