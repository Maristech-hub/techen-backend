const Request = require('../models/requestModel');

// Create a new service request (Public + Authenticated)
const createRequest = async (req, res) => {
  try {
    const { name, email, service, message } = req.body;

    // ✅ Validation
    if (!name || !email || !service || !message) {
      return res
        .status(400)
        .json({ error: "Name, email, service and message are required" });
    }

    // ✅ Save request
    const newRequest = new Request({
      name,
      email,
      service,
      message,
      status: "pending",
      // attach user id only if logged in
      user: req.user ? req.user._id : undefined,
    });

    await newRequest.save();

    res.status(201).json({
      success: true,
      message: "Request submitted successfully",
      request: newRequest,
    });
  } catch (error) {
    console.error("❌ Error creating request:", error.message);
    res
      .status(500)
      .json({ success: false, error: "Server error. Please try again." });
  }
};

// Get all service requests (Admin only)
const getRequests = async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error("❌ Error fetching requests:", error.message);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// Get requests for the logged-in user
const getUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      $or: [
        { user: req.user._id },   // requests tied to account
        { email: req.user.email } // fallback: guest requests
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("❌ Error fetching user requests:", error.message);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// Update request status
const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.status(200).json({
      message: "Status updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("❌ Error updating status:", error.message);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// Delete a request
const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRequest = await Request.findByIdAndDelete(id);

    if (!deletedRequest) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting request:", error.message);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// Approve a request
const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );
    if (!updatedRequest)
      return res.status(404).json({ error: "Request not found" });

    res.status(200).json({
      message: "Request approved successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("❌ Error approving request:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Complete a request
const completeRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { status: "completed" },
      { new: true }
    );
    if (!updatedRequest)
      return res.status(404).json({ error: "Request not found" });

    res.status(200).json({
      message: "Request completed successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("❌ Error completing request:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createRequest,
  getRequests,
  getUserRequests,
  approveRequest,
  completeRequest,
  updateRequestStatus,
  deleteRequest,
};