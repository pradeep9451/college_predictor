exports.signup = async (req, res) => {
  console.log("📥 Incoming signup request:", req.body); // 👈 ADD THIS
  const { fullName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ User already exists:", email);
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("✅ Signup successful for:", email);
    res.json({ token, fullName: user.fullName });

  } catch (err) {
    console.error("❌ Signup error:", err); // 👈 Check your terminal for this
    res.status(500).json({ error: "Server error" });
  }
};
