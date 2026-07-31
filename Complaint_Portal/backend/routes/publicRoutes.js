const express = require("express");
const {
    getHome,
    getPublicServices,
    getPublicServiceBySlug,
    getPublicProjects,
    getPublicProjectById,
} = require("../controllers/publicController");

const router = express.Router();

// Landing page — all homepage data in one request
router.get("/home", getHome);

// Services
router.get("/services",       getPublicServices);
router.get("/services/:slug", getPublicServiceBySlug);

// Projects — paginated list + detail by id
router.get("/projects",     getPublicProjects);
router.get("/projects/:id", getPublicProjectById);

// ── future-ready stubs ────────────────────────────────────────────────────
// Uncomment and implement when the corresponding models exist:
// router.get("/about",        getPublicAbout);
// router.get("/testimonials", getPublicTestimonials);
// router.get("/contact",      getPublicContactInfo);

module.exports = router;
