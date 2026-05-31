require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

require("./passportSetup"); // Setup Google strategy

const authRoutes = require("./routes/authRoutes");

const app = express(); // ✅ app initialized here

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,       // set to true in production with HTTPS
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ Auth Routes
app.use("/api/auth", authRoutes);

// ✅ College Routes (require after app is created)
const collegeRoutes = require("./routes/collegeRoutes");
app.use("/api/colleges", collegeRoutes);

//contact route
const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contact", contactRoutes);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected");
  app.listen(8000, () => console.log("✅ Server running on port 8000"));
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});
