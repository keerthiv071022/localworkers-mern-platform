
const express = require("express");
const mongoose = require("mongoose");
const Review = require("../models/Review");
const ServiceRequest = require("../models/ServiceRequest");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE REVIEW - CUSTOMER ONLY
router.post("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        message: "Only customers can submit reviews",
      });
    }

    const { serviceRequestId, rating, comment } = req.body;

    if (!mongoose.isValidObjectId(serviceRequestId)) {
      return res.status(400).json({
        message: "Invalid service request ID",
      });
    }

    if (
      typeof rating !== "number" ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    if (
      comment !== undefined &&
      (typeof comment !== "string" ||
        comment.length > 500)
    ) {
      return res.status(400).json({
        message: "Comment must be 500 characters or fewer",
      });
    }

    const serviceRequest = await ServiceRequest.findOne({
      _id: serviceRequestId,
      customer: req.user._id,
      status: "completed",
    });

    if (!serviceRequest) {
      return res.status(404).json({
        message: "Completed service request not found",
      });
    }

    const existingReview = await Review.findOne({
      serviceRequest: serviceRequestId,
    });

    if (existingReview) {
      return res.status(409).json({
        message: "You have already reviewed this job",
      });
    }

    const review = await Review.create({
      customer: req.user._id,
      worker: serviceRequest.worker,
      serviceRequest: serviceRequest._id,
      rating,
      comment: comment?.trim() || "",
    });

    res.status(201).json({
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already reviewed this job",
      });
    }

    console.error("Create review error:", error.message);

    res.status(500).json({
      message: "Failed to submit review",
    });
  }
});

// GET REVIEWS FOR A WORKER
router.get("/worker/:workerId", async (req, res) => {
  try {
    const { workerId } = req.params;

    if (!mongoose.isValidObjectId(workerId)) {
      return res.status(400).json({
        message: "Invalid worker ID",
      });
    }

    const reviews = await Review.find({
      worker: workerId,
    })
      .populate("customer", "name")
      .sort({ createdAt: -1 });

    const averageRating = reviews.length
      ? reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        ) / reviews.length
      : 0;

    res.status(200).json({
      count: reviews.length,
      averageRating: Number(averageRating.toFixed(1)),
      reviews,
    });
  } catch (error) {
    console.error("Fetch reviews error:", error.message);

    res.status(500).json({
      message: "Failed to fetch worker reviews",
    });
  }
});

 // GET REVIEWS SUBMITTED BY THE LOGGED-IN CUSTOMER
router.get("/my", protect, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        message: "Only customers can view their reviews",
      });
    }

    const reviews = await Review.find({
      customer: req.user._id,
    }).select("serviceRequest rating comment createdAt");

    res.status(200).json({
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Fetch my reviews error:", error.message);

    res.status(500).json({
      message: "Failed to fetch your reviews",
    });
  }
});

module.exports = router;
