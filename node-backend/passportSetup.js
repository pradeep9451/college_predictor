const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/User");

passport.serializeUser((user, done) => {
  done(null, user.id); // Saves user ID to session
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user); // Attaches full user object to req.user
});


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) return done(null, existingUser);

        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
        });

        done(null, newUser);
      } catch (err) {
        done(err);
      }
    }
  )
);
