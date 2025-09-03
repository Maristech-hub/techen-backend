const express = require('express');
const {
  createRequest,
  getRequests,
  getUserRequests,
  approveRequest,
  completeRequest,
  updateRequestStatus,
  deleteRequest
} = require('../Controllers/serviceRequestController.js');

const adminProtect = require('../middleware/adminMiddleware');
const protect = require('../middleware/authMiddleware');
const Request = require('../models/requestModel');

const router = express.Router();

/**
 * ✅ Public: Anyone can submit a service request
 */
router.post('/', createRequest);

/**
 * 🔐 Authenticated Users: Can view only their requests
 */
router.get('/my-requests', protect, getUserRequests);

/**
 * 🔍 Fetch requests by email (optional, public)
 */
router.get("/user/:email", async (req, res) => {
  try {
    const requests = await Request.find({ email: req.params.email }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching requests" });
  }
});

/**
 * 🛡️ Admin Only: Manage all service requests
 */
router.get('/', adminProtect, getRequests);
router.patch('/:id/approve', adminProtect, approveRequest);
router.patch('/:id/complete', adminProtect, completeRequest);
router.patch('/:id/status', adminProtect, updateRequestStatus);
router.delete('/:id', adminProtect, deleteRequest);

module.exports = router;