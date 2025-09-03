const express = require('express');
const { registerUser, loginUser } = require('../Controllers/authController');
const {
  getUserProfile,
  updateUserProfile,
  getMe,
  updateProfile,
  changePassword,
} = require('../Controllers/userController');
const protect = require('../middleware/authMiddleware');
const adminRoutes = require('./adminRoutes'); // ✅ include admin routes

const router = express.Router();

// =================== Auth Routes ===================
// router.post('/register', registerUser);
// router.post('/login', loginUser);

// =================== User Routes ===================
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

router.get('/me', protect, getMe);
router.put('/update', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// =================== Admin Routes ===================
router.use('/admin', adminRoutes); // ✅ mount admin routes under /api/users/admin

module.exports = router;