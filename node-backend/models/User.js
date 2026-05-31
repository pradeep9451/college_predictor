const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // using bcryptjs for consistency

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google login
  googleId: { type: String }, // For Google OAuth
});

// Method to compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
