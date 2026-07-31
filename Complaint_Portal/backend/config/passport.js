const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {

                const googleId = profile.id;
                const name = profile.displayName;
                const email = profile.emails[0].value;
                const profilePicture = profile.photos[0].value;

                const totalUsers = await User.countDocuments();

                // Bootstrap the first SUPER_ADMIN
                if (totalUsers === 0) {

                    if (email !== process.env.INITIAL_SUPER_ADMIN_EMAIL) {
                        return done(null, false);
                    }

                    const firstAdmin = await User.create({
                        name,
                        email,
                        googleId,
                        profilePicture,
                        role: "SUPER_ADMIN",
                        isActive: true,
                        lastLogin: new Date(),
                    });

                    return done(null, firstAdmin);
                }

                // Existing user login
                const user = await User.findOne({ email });

                if (!user) {
                    return done(null, false);
                }

                if (!user.isActive) {
                    return done(null, false);
                }

                user.googleId = googleId;
                user.profilePicture = profilePicture;
                user.lastLogin = new Date();

                await user.save();

                return done(null, user);

            } catch (error) {
                return done(error, false);
            }
        }
    )
);

module.exports = passport;