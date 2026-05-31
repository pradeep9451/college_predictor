const express = require("express");
const router = express.Router();
const College = require("../models/College");
const User = require("../models/User"); 

// Get logged-in user profile
router.get("/profile", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not logged in" });
    }

    // req.user now works for Google or normal login
    res.json({ name: req.user.name, email: req.user.email, _id: req.user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// 🔹 Add a college (admin only - add auth if needed)
router.post("/", async (req, res) => {
  try {
    console.log("📥 Incoming College Data:", req.body); // ✅ Log request data
    const college = new College(req.body);
    await college.save();
    res.status(201).json({ message: "College added successfully" });
  } catch (error) {
    console.error("❌ College Save Error:", error); // ✅ Log full error
    res.status(500).json({ error: "Failed to add college" });
  }
});

// 👉 ADD THIS before `router.get("/:id")`
router.get("/search", async (req, res) => {
  const query = req.query.q || "";
  try {
    const colleges = await College.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
      ],
    }).limit(5); // optional limit

    res.json({ colleges });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to search colleges" });
  }
});

// 🔹 Get all colleges
router.get("/", async (req, res) => {
  try {
    const colleges = await College.find();
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch colleges" });
  }
});



// 🔹 Get college by ID
router.get("/:id", async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }
    res.json(college);
  } catch (error) {
    res.status(404).json({ error: "College not found" });
  }
});

// 🔹 Update college by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedCollege = await College.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // ✅ return updated doc & validate
    );
    if (!updatedCollege) {
      return res.status(404).json({ error: "College not found" });
    }
    res.json({ message: "College updated successfully", updatedCollege });
  } catch (error) {
    console.error("❌ Update Error:", error);
    res.status(500).json({ error: "Failed to update college" });
  }
});

// 🔹 Delete college by ID (optional - admin only)
router.delete("/:id", async (req, res) => {
  try {
    const deletedCollege = await College.findByIdAndDelete(req.params.id);
    if (!deletedCollege) {
      return res.status(404).json({ error: "College not found" });
    }
    res.json({ message: "College deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete college" });
  }
});


// POST /api/colleges/:id/reviews
router.post("/:id/reviews", async (req, res) => {
  try {
    const { author, rating, text } = req.body;
    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ error: "College not found" });

    college.reviews.push({ author, rating, text });
    await college.save();

    res.status(201).json({ message: "Review added successfully", reviews: college.reviews });
  } catch (error) {
    res.status(500).json({ error: "Failed to add review" });
  }
});


module.exports = router;
