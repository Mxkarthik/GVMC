import { Link } from "react-router-dom";
import { HiOutlinePlus, HiOutlineFolderOpen } from "react-icons/hi2";
import { useProjects } from "../../hooks/useProjects";
import ProjectCard from "../../components/Projects/ProjectCard";
import ProjectFilters from "../../components/Projects/ProjectFilters";

function SkeletonCard() {
    return <div className="bg-gray-100 rounded-2xl animate-pulse" style={{ height: 280 }} />;
}

export default function ProjectsPage() {
    const {
        projects, total, loading, deleting,
        search, setSearch,
        category, setCategory,
        status, setStatus,
        remove,
    } = useProjects();

    return (
        <div className="flex flex-col min-h-full">
            {/* page header */}
            <div className="px-4 sm:px-6 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-lg font-bold text-gray-900">Projects</h1>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {loading ? "Loading…" : `${total} project${total !== 1 ? "s" : ""} total`}
                    </p>
                </div>
                <Link
                    to="/dashboard/projects/new"
                    className="
                        inline-flex items-center gap-2
                        min-h-[44px] px-5 py-2.5 text-sm font-medium
                        text-white bg-gray-900 rounded-xl
                        hover:bg-gray-700 transition-colors duration-150
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900
                        shrink-0
                    "
                >
                    <HiOutlinePlus className="text-base" aria-hidden="true" />
                    New Project
                </Link>
            </div>

            {/* filters */}
            <div className="px-4 sm:px-6 pb-4">
                <ProjectFilters
                    search={search} setSearch={setSearch}
                    category={category} setCategory={setCategory}
                    status={status} setStatus={setStatus}
                />
            </div>

            {/* grid */}
            <div className="flex-1 px-4 sm:px-6 pb-8">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <HiOutlineFolderOpen className="text-4xl text-gray-300" aria-hidden="true" />
                        <p className="text-sm text-gray-400">
                            {total === 0 ? "No projects yet. Create your first one." : "No projects match your filters."}
                        </p>
                        {total === 0 && (
                            <Link
                                to="/dashboard/projects/new"
                                className="text-sm font-medium text-gray-900 underline underline-offset-4"
                            >
                                Create project
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                        {projects.map((p) => (
                            <ProjectCard
                                key={p._id}
                                project={p}
                                onDelete={remove}
                                deleting={deleting}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
