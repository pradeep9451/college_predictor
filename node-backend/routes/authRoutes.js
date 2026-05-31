const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Profile = require("../models/Profile");

const router = express.Router();

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Not authenticated" });
};


// ✅ Sign Up Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (!existingUser.password) {
        return res.status(409).json({
          error: "Account already exists with Google. Please sign in with Google.",
        });
      }

      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("👉 Email:", email);
    console.log("👉 Password (entered):", password);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ No user found");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(400).json({
        error: "This account uses Google login. Please sign in with Google.",
      });
    }

    const isMatch = await user.comparePassword(password);
    console.log("🧪 Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.login(user, (err) => {
      if (err) {
        console.error("Login session error:", err);
        return res.status(500).json({ error: "Login failed" });
      }

      res.status(200).json({ message: "Login successful", user });
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});
// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
    session: true, // ✅ Important: This triggers session creation
  }),
 (req, res) => {
  // ✅ Add this debug line
  console.log("✅ Session created:", req.sessionID);
  
  // ✅ Redirect to your React frontend
  res.redirect("http://localhost:3000/");
});



// ✅ Logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });

    req.session.destroy(() => {
      res.clearCookie("connect.sid", {
        path: "/",
        httpOnly: true,
        sameSite: "lax", // or "none" if you're using HTTPS
        secure: false,   // true if on HTTPS
      });

      return res.status(200).json({ message: "Logged out" });
    });
  });
});


// ✅ Check session (Google or normal login)


router.get("/me", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const profile = await Profile.findOne({ userId: req.user._id });

      // Return either full profile or fallback to just basic user data
      if (profile) {
        res.json({ user: profile });
      } else {
        // No profile yet — fallback to minimal session info (like name/email from req.user)
        res.json({ user: { name: req.user.name, email: req.user.email, userId: req.user._id } });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      res.status(500).json({ error: "Server error while fetching profile" });
    }
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});


// Save or update profile
router.put("/update-profile", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id; // from passport
    const update = req.body;

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { ...update, userId },
      { upsert: true, new: true }
    );

    res.json({ user: profile });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Profile update failed" });
  }
});

// DELETE account route
router.delete("/delete-account", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete profile (if exists)
    await Profile.deleteOne({ userId });

    // Delete user
    await User.deleteOne({ _id: userId });

    // Logout and destroy session
    req.logout(() => {
      req.session.destroy();
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Account deleted successfully" });
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete account" });
  }
});



module.exports = router;
