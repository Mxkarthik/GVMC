const Project   = require("../models/Project");
const Hero      = require("../models/Hero");
const Analytics = require("../models/Analytics");

/**
 * GET /api/dashboard/summary
 * Single aggregated response — no N+1 queries, all counts run in parallel.
 * Future modules (Services, Testimonials, etc.) can be added here without
 * touching the frontend architecture.
 */
const getDashboardSummary = async (req, res) => {
    try {
        const [
            totalProjects,
            featuredProjects,
            heroDoc,
            analytics,
            recentProjects,
        ] = await Promise.all([
            Project.countDocuments(),
            Project.countDocuments({ isFeatured: true }),
            Hero.findOne({}, { _id: 1 }).lean(),   // just existence check
            Analytics.findOne().lean(),
            Project.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select("title category status thumbnail createdAt")
                .lean(),
        ]);

        return res.status(200).json({
            success: true,
            data: {
                totalProjects,
                featuredProjects,
                totalHeroSlides: heroDoc ? 1 : 0,   // Hero is a singleton
                pageViews:       analytics?.totalVisitors     ?? 0,
                projectViews:    analytics?.totalProjectViews ?? 0,
                recentProjects,
                lastUpdated:     new Date().toISOString(),
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { getDashboardSummary };
