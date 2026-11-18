
const express = require("express");
const mongoose = require("mongoose");
const ServiceRequest = require("../models/ServiceRequest");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE a service request (customers only)
router.post("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        message: "Only customers can request services",
      });
    }

    const {
      workerId,
      service,
      description,
      location,
      preferredDate,
    } = req.body;

    if (!mongoose.isValidObjectId(workerId)) {
      return res.status(400).json({
        message: "Invalid worker ID",
      });
    }

    if (
      [service, description, location].some(
        (value) =>
          typeof value !== "string" || !value.trim()
      )
    ) {
      return res.status(400).json({
        message: "Please fill in all required fields",
      });
    }

    const date = new Date(preferredDate);

    if (
      !preferredDate ||
      Number.isNaN(date.getTime()) ||
      date.getTime() < Date.now()
    ) {
      return res.status(400).json({
        message: "Please select a valid future date",
      });
    }

    const worker = await User.findOne({
      _id: workerId,
      role: "worker",
    });

    if (!worker) {
      return res.status(404).json({
        message: "Worker not found",
      });
    }

    if (!worker.availability) {
      return res.status(400).json({
        message: "This worker is currently unavailable",
      });
    }

    const request = await ServiceRequest.create({
      customer: req.user._id,
      worker: worker._id,
      service: service.trim(),
      description: description.trim(),
      location: location.trim(),
      preferredDate: date,
    });

    res.status(201).json({
      message: "Service request submitted successfully",
      request,
    });
  } catch (error) {
    console.error("Create service request error:", error.message);

    res.status(500).json({
      message: "Failed to submit service request",
    });
  }
});

// GET requests belonging to the logged-in user
router.get("/my", protect, async (req, res) => {
  try {
    const filter =
      req.user.role === "worker"
        ? { worker: req.user._id }
        : { customer: req.user._id };

    const requests = await ServiceRequest.find(filter)
      .populate("customer", "name")
      .populate("worker", "name skills location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Service requests fetched successfully",
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Fetch service requests error:", error.message);

    res.status(500).json({
      message: "Failed to fetch service requests",
    });
  }
});

// UPDATE service request status (assigned worker only)
router.patch("/:id/status", protect, async (req, res) => {
  try {
    if (req.user.role !== "worker") {
      return res.status(403).json({
        message: "Only workers can update request status",
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid request ID",
      });
    }

    if (!["accepted", "rejected", "completed"].includes(status)) {
  return res.status(400).json({
    message: "Invalid request status",
  });
}

  const currentStatus =
  status === "completed" ? "accepted" : "pending";

const request = await ServiceRequest.findOneAndUpdate(
  {
    _id: id,
    worker: req.user._id,
    status: currentStatus,
  },
  { $set: { status } },
  { new: true, runValidators: true }
);

    if (!request) {
      return res.status(404).json({
        message:
          "Pending request not found or not assigned to you",
      });
    }

    res.status(200).json({
      message: `Service request ${status} successfully`,
      request,
    });
  } catch (error) {
    console.error(
      "Update request status error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to update request status",
    });
  }
});

module.exports = router;
