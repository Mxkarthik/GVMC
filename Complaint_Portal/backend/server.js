require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const passport = require("./config/passport");

const connectDatabase = require("./config/database");

const projectRoutes   = require("./routes/projectRoutes");
const heroRoutes      = require("./routes/heroRoutes");
const authRoutes      = require("./routes/authRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const serviceRoutes   = require("./routes/serviceRoutes");
const publicRoutes    = require("./routes/publicRoutes");

const app = express();

connectDatabase();

app.use(
    cors({
        origin: [
            "http://localhost:5173", // Admin CMS
            "http://localhost:5174", // Portfolio (dev fallback)
        ],
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.use(
    session({
        secret: process.env.SESSION_SECRET || "fallback_secret_change_in_prod",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.send("CMS Backend is Running Successfully!");
});

app.use("/auth", authRoutes);

app.use("/api/projects",  projectRoutes);
app.use("/api/hero",      heroRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/services",  serviceRoutes);
app.use("/api/public",    publicRoutes);

// 404 handler — must be LAST, after all routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found.",
    });
});

const PORT = process.env.PORT;
// l
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});