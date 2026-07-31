const express = require("express");
const passport = require("passport");
const { googleCallback, getMe, logout } = require("../controllers/authController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "http://localhost:5173/?error=auth_failed",
        session: false,
    }),
    googleCallback
);

// Express 5 passes Passport OAuth errors (TokenError, InternalOAuthError) to next(err)
// instead of triggering failureRedirect. Catch them here and redirect gracefully.
router.use("/google/callback", (err, req, res, next) => {
    console.error("OAuth callback error:", err.message);
    res.redirect("http://localhost:5173/?error=auth_failed");
});

router.get("/me", authenticate, getMe);

router.post("/logout", logout);

module.exports = router;
