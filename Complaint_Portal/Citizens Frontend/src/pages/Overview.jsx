import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
    HiOutlineEye,
    HiOutlineFolderOpen,
    HiOutlinePhoto,
    HiOutlineStar,
} from "react-icons/hi2";
import { getDashboardSummary } from "../services/dashboardService";

// ── stat card ─────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, loading, linkTo }) {
    const inner = (
        <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] transition-colors duration-150 hover:border-gray-200">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                <Icon className="text-gray-500 text-lg" aria-hidden="true" />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider truncate">
                    {label}
                </p>
                {loading ? (
                    <div className="mt-1.5 h-5 w-10 bg-gray-100 rounded-md animate-pulse" />
                ) : (
                    <p className="text-xl font-semibold text-gray-900 mt-0.5 tabular-nums">
                        {value}
                    </p>
                )}
            </div>
        </div>
    );

    return linkTo ? (
        <Link to={linkTo} className="block">{inner}</Link>
    ) : (
        inner
    );
}

// ── recent projects list ───────────────────────────────────────────────────
const STATUS_PILL = {
    Completed: "bg-green-50 text-green-700",
    Ongoing:   "bg-blue-50  text-blue-700",
    Upcoming:  "bg-amber-50 text-amber-700",
};

function RecentProjects({ projects, loading }) {
    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (!projects?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
                <HiOutlineFolderOpen className="text-3xl text-gray-300" aria-hidden="true" />
                <p className="text-sm text-gray-400">No projects yet.</p>
                <Link
                    to="/dashboard/projects/new"
                    className="text-sm font-medium text-gray-900 underline underline-offset-4"
                >
                    Create your first project
                </Link>
            </div>
        );
    }

    return (
        <ul className="space-y-2">
            {projects.map((p) => (
                <li key={p._id}>
                    <Link
                        to={`/dashboard/projects/${p._id}/edit`}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors duration-150 group"
                    >
                        {p.thumbnail?.url ? (
                            <img
                                src={p.thumbnail.url}
                                alt=""
                                aria-hidden="true"
                                className="w-10 h-10 rounded-lg object-cover shrink-0 bg-gray-100"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                <HiOutlinePhoto className="text-gray-400 text-base" aria-hidden="true" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate group-hover:text-gray-700">
                                {p.title}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{p.category}</p>
                        </div>
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${STATUS_PILL[p.status] ?? "bg-gray-100 text-gray-600"}`}>
                            {p.status}
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}

// ── page ──────────────────────────────────────────────────────────────────
export default function Overview() {
    const { user } = useOutletContext();
    const [summary, setSummary]   = useState(null);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(false);

    useEffect(() => {
        getDashboardSummary()
            .then(setSummary)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, []);

    const STAT_CARDS = [
        {
            icon:  HiOutlineEye,
            label: "Page Views",
            value: summary?.pageViews?.toLocaleString() ?? "—",
            linkTo: null,
        },
        {
            icon:  HiOutlineFolderOpen,
            label: "Projects",
            value: summary?.totalProjects?.toLocaleString() ?? "—",
            linkTo: "/dashboard/projects",
        },
        {
            icon:  HiOutlineStar,
            label: "Featured",
            value: summary?.featuredProjects?.toLocaleString() ?? "—",
            linkTo: "/dashboard/projects",
        },
        {
            icon:  HiOutlinePhoto,
            label: "Hero Configured",
            value: summary ? (summary.totalHeroSlides > 0 ? "Yes" : "No") : "—",
            linkTo: "/dashboard/hero",
        },
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-10">

            {/* profile */}
            <section aria-label="Profile" className="flex items-center gap-4">
                {user.profilePicture ? (
                    <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shadow-sm shrink-0"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shrink-0">
                        <span className="text-white text-xl sm:text-2xl font-bold">{user.name?.[0]}</span>
                    </div>
                )}
                <div className="min-w-0">
                    <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                        Welcome, {user.name}
                    </h1>
                    <p className="text-sm text-gray-400 mt-0.5 truncate">{user.email}</p>
                    <span className="inline-block mt-1.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2.5 py-0.5">
                        {user.role}
                    </span>
                </div>
            </section>

            {/* error state */}
            {error && !loading && (
                <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
                    <p className="text-sm text-red-600">
                        Could not load dashboard data. Please refresh the page.
                    </p>
                </div>
            )}

            {/* stat cards */}
            <section aria-label="Statistics">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 sm:mb-4">
                    Overview
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {STAT_CARDS.map((c) => (
                        <StatCard
                            key={c.label}
                            icon={c.icon}
                            label={c.label}
                            value={c.value}
                            loading={loading}
                            linkTo={c.linkTo}
                        />
                    ))}
                </div>
            </section>

            {/* recent projects */}
            <section aria-label="Recent Projects">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Recent Projects
                    </h2>
                    <Link
                        to="/dashboard/projects"
                        className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors duration-150"
                    >
                        View all
                    </Link>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] px-2 py-2">
                    <RecentProjects
                        projects={summary?.recentProjects}
                        loading={loading}
                    />
                </div>
            </section>

        </div>
    );
}
