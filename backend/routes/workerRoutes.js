
const express = require("express");
const User = require("../models/User");
const { protect,workerOnly } = require("../middleware/authMiddleware");

const router = express.Router();
const skillAliases = {
  plumber: ["plumber", "plumbers", "plumbing", "pipe repair"],
  electrician: ["electrician", "electricians", "electrical"],
  carpenter: ["carpenter", "carpenters", "carpentry"],
  painter: ["painter", "painters", "painting"],
  cleaner: ["cleaner", "cleaners", "cleaning"],
};

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getSkillSearchTerms = (search) => {
  const normalized = search.trim().toLowerCase();

  for (const aliases of Object.values(skillAliases)) {
    if (aliases.includes(normalized)) {
      return aliases;
    }
  }

  return [normalized];
};
// GET logged-in worker's profile
router.get("/profile", protect, workerOnly, async (req, res) => {
  try {
    const worker = await User.findById(req.user._id);

    if (!worker) {
      return res.status(404).json({
        message: "Worker not found",
      });
    }

    res.status(200).json({
      message: "Worker profile fetched successfully",
      worker,
    });
  } catch (error) {
    console.error("Fetch worker profile error:", error.message);

    res.status(500).json({
      message: "Failed to fetch worker profile",
    });
  }
});

// UPDATE logged-in worker's profile
router.put("/profile", protect, workerOnly, async (req, res) => {
  try {
    const {
      name,
      phone,
      location,
      skills,
      experience,
      availability,
    } = req.body;

    const updates = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          message: "A valid name is required",
        });
      }
      updates.name = name.trim();
    }

    if (phone !== undefined) {
      if (typeof phone !== "string") {
        return res.status(400).json({
          message: "Phone must be text",
        });
      }
      updates.phone = phone.trim();
    }

    if (location !== undefined) {
      if (typeof location !== "string") {
        return res.status(400).json({
          message: "Location must be text",
        });
      }
      updates.location = location.trim();
    }

    if (skills !== undefined) {
      if (
        !Array.isArray(skills) ||
        !skills.every(
          (skill) =>
            typeof skill === "string" && skill.trim()
        )
      ) {
        return res.status(400).json({
          message: "Skills must be a list of valid names",
        });
      }
      updates.skills = skills.map((skill) => skill.trim());
    }

    if (experience !== undefined) {
      if (
        typeof experience !== "number" ||
        !Number.isFinite(experience) ||
        experience < 0
      ) {
        return res.status(400).json({
          message: "Experience must be a valid number",
        });
      }
      updates.experience = experience;
    }

    if (availability !== undefined) {
      if (typeof availability !== "boolean") {
        return res.status(400).json({
          message: "Availability must be true or false",
        });
      }
      updates.availability = availability;
    }

    const worker = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Worker profile updated successfully",
      worker,
    });
  } catch (error) {
    console.error("Update worker profile error:", error.message);

    res.status(500).json({
      message: "Failed to update worker profile",
    });
  }
});

 // GET all workers with optional search filters
router.get("/", async (req, res) => {
  try {
    const { skill, location, availability } = req.query;

    const filter = {
      role: "worker",
    };

    // Filter by skill
  // Filter by skill, including related skill names
if (typeof skill === "string" && skill.trim()) {
  const searchTerms = getSkillSearchTerms(skill);

  filter.skills = {
    $in: searchTerms.map(
      (term) => new RegExp(escapeRegex(term), "i")
    ),
  };
}

    // Filter by location
    if (typeof location === "string" && location.trim()) {
      filter.location = {
        $regex: location.trim(),
        $options: "i",
      };
    }

    // Filter by availability
    if (availability === "true") {
      filter.availability = true;
    } else if (availability === "false") {
      filter.availability = false;
    }

    const workers = await User.find(filter)
      .select(
        "name skills location experience availability isVerified"
      )
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      message: "Workers fetched successfully",
      count: workers.length,
      workers,
    });
  } catch (error) {
    console.error("Worker search error:", error.message);

    res.status(500).json({
      message: "Failed to fetch workers",
    });
  }
});

const mongoose = require("mongoose");

// GET a worker's public profile by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid worker ID",
      });
    }

    const worker = await User.findOne({
      _id: id,
      role: "worker",
    }).select(
      "name skills location experience availability isVerified"
    );

    if (!worker) {
      return res.status(404).json({
        message: "Worker not found",
      });
    }

    res.status(200).json({
      message: "Worker profile fetched successfully",
      worker,
    });
  } catch (error) {
    console.error("Worker details error:", error.message);

    res.status(500).json({
      message: "Failed to fetch worker details",
    });
  }
});

module.exports = router;
