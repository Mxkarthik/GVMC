const Hero    = require("../models/Hero");
const Project = require("../models/Project");
const Service = require("../models/Service");

// Fields safe to expose publicly — strips Cloudinary publicIds and internal flags
const PROJECT_PUBLIC_FIELDS = "title description location category status clientName completionDate thumbnail images isFeatured createdAt";
const SERVICE_PUBLIC_FIELDS = "title shortDescription fullDescription icon coverImage slug displayOrder isFeatured";

// ── home ──────────────────────────────────────────────────────────────────

/**
 * GET /api/public/home
 * Single aggregated response for the landing page.
 * Runs all three queries in parallel for minimal latency.
 */
const getHome = async (req, res) => {
    try {
        const [hero, services, featuredProjects] = await Promise.all([
            Hero.findOne({}).lean(),

            Service
                .find({ isActive: true })
                .sort({ displayOrder: 1, createdAt: 1 })
                .select(SERVICE_PUBLIC_FIELDS)
                .lean(),

            Project
                .find({ isFeatured: true })
                .sort({ createdAt: -1 })
                .limit(6)
                .select(PROJECT_PUBLIC_FIELDS)
                .lean(),
        ]);

        return res.status(200).json({
            success: true,
            data: {
                hero:             hero             ?? null,
                services,
                featuredProjects,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ── services ──────────────────────────────────────────────────────────────

/**
 * GET /api/public/services
 * Active services sorted by displayOrder.
 */
const getPublicServices = async (req, res) => {
    try {
        const services = await Service
            .find({ isActive: true })
            .sort({ displayOrder: 1, createdAt: 1 })
            .select(SERVICE_PUBLIC_FIELDS)
            .lean();

        return res.status(200).json({
            success: true,
            count:   services.length,
            data:    services,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * GET /api/public/services/:slug
 * Single service by slug.
 */
const getPublicServiceBySlug = async (req, res) => {
    try {
        const service = await Service
            .findOne({ slug: req.params.slug, isActive: true })
            .select(SERVICE_PUBLIC_FIELDS)
            .lean();

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data:    service,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ── projects ──────────────────────────────────────────────────────────────

/**
 * GET /api/public/projects
 * Paginated project listing with optional category filter.
 * Query params: page (default 1), limit (default 9), category
 */
const getPublicProjects = async (req, res) => {
    try {
        const page     = Math.max(1, parseInt(req.query.page,  10) || 1);
        const limit    = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 9));
        const skip     = (page - 1) * limit;
        const filter   = {};

        if (req.query.category) {
            filter.category = req.query.category;
        }

        if (req.query.status) {
            filter.status = req.query.status;
        }

        const [projects, total] = await Promise.all([
            Project
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select(PROJECT_PUBLIC_FIELDS)
                .lean(),

            Project.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1,
            },
            data: projects,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * GET /api/public/projects/:id
 * Single project by MongoDB _id.
 * Project model has no slug field — _id is the stable identifier.
 */
const getPublicProjectById = async (req, res) => {
    try {
        const project = await Project
            .findById(req.params.id)
            .select(PROJECT_PUBLIC_FIELDS)
            .lean();

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data:    project,
        });
    } catch (error) {
        // Handle malformed ObjectId gracefully
        if (error.name === "CastError") {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getHome,
    getPublicServices,
    getPublicServiceBySlug,
    getPublicProjects,
    getPublicProjectById,
};
