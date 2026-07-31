const jwt = require("jsonwebtoken");

const googleCallback = (req, res) => {
    const token = jwt.sign(
        {
            id: req.user._id,
            email: req.user.email,
            role: req.user.role,
            name: req.user.name,
            profilePicture: req.user.profilePicture,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect("http://localhost:5173/dashboard");
};

const getMe = (req, res) => {
    res.status(200).json({
        success: true,
        user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            profilePicture: req.user.profilePicture,
        },
    });
};

const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });

    res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { googleCallback, getMe, logout };
