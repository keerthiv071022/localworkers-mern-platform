
const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const {protect }= require("../middleware/authMiddleware");

const router = express.Router();

// Only customers can manage saved workers
const customerOnly = (req, res, next) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({
      message: "Only customers can save workers.",
    });
  }

  next();
};

// GET ALL SAVED WORKERS
router.get("/", protect, customerOnly, async (req, res) => {
  try {
    const customer = await User.findById(req.user._id)
      .populate({
        path: "savedWorkers",
        select:
          "name skills location experience availability isVerified",
        match: { role: "worker" },
      });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found.",
      });
    }

    res.json({
      count: customer.savedWorkers.length,
      workers: customer.savedWorkers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch saved workers.",
    });
  }
});

// SAVE A WORKER
router.post(
  "/:workerId",
  protect,
  customerOnly,
  async (req, res) => {
    try {
      const { workerId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(workerId)) {
        return res.status(400).json({
          message: "Invalid worker ID.",
        });
      }

      const worker = await User.findOne({
        _id: workerId,
        role: "worker",
      });

      if (!worker) {
        return res.status(404).json({
          message: "Worker not found.",
        });
      }

      const customer = await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { savedWorkers: worker._id } },
        { new: true }
      );

      if (!customer) {
        return res.status(404).json({
          message: "Customer not found.",
        });
      }

      res.json({
        message: "Worker saved successfully.",
        savedWorkers: customer.savedWorkers,
      });
    } catch (error) {
      res.status(500).json({
        message: "Unable to save worker.",
      });
    }
  }
);

// REMOVE A SAVED WORKER
router.delete(
  "/:workerId",
  protect,
  customerOnly,
  async (req, res) => {
    try {
      const { workerId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(workerId)) {
        return res.status(400).json({
          message: "Invalid worker ID.",
        });
      }

      const customer = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { savedWorkers: workerId } },
        { new: true }
      );

      if (!customer) {
        return res.status(404).json({
          message: "Customer not found.",
        });
      }

      res.json({
        message: "Worker removed from saved workers.",
        savedWorkers: customer.savedWorkers,
      });
    } catch (error) {
      res.status(500).json({
        message: "Unable to remove saved worker.",
      });
    }
  }
);

module.exports = router;
