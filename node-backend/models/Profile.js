// models/Profile.js
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assuming your user model is called "User"
    required: true,
    unique: true
  },
  name: String,
  email: String,
  phone: String,
  dateOfBirth: String,
  currentClass: String,
  stream: String,

  // Academic Scores
  tenthPercentage: Number,
  tenthBoard: String,           // new field
  twelfthPercentage: Number,
  twelfthBoard: String,         // new field
  jeeMainScore: Number,
  mhtcetScore: Number,
  university: String,           // new field
  graduationPercentage: Number, // new field
  category: String,
  branch: String,

  careerInterests: String,
  preferredLocation: String
});

module.exports = mongoose.model("Profile", profileSchema);
