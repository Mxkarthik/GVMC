import { Link } from "react-router-dom";
import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlineStar } from "react-icons/hi2";

const STATUS_STYLES = {
    Completed: "bg-green-50 text-green-700 border-green-200",
    Ongoing:   "bg-blue-50  text-blue-700  border-blue-200",
    Upcoming:  "bg-amber-50 text-amber-700 border-amber-200",
};

export default function ProjectCard({ project, onDelete, deleting }) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] flex flex-col">
            {/* thumbnail */}
            <div className="relative w-full bg-gray-100" style={{ aspectRatio: "16/9" }}>
                {project.thumbnail?.url ? (
                    <img
                        src={project.thumbnail.url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-gray-400">No thumbnail</span>
                    </div>
                )}

                {/* featured badge */}
                {project.isFeatured && (
                    <span className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-semibold bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full">
                        <HiOutlineStar className="text-xs" aria-hidden="true" />
                        Featured
                    </span>
                )}

                {/* status badge */}
                <span className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLES[project.status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                    {project.status}
                </span>
            </div>

            {/* body */}
            <div className="flex flex-col flex-1 p-4 gap-3">
                <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                        {project.category} · {project.location}
                    </p>
                    <h3 className="text-sm font-semibold text-gray-900 mt-1 line-clamp-2">
                        {project.title}
                    </h3>
                    {project.clientName && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{project.clientName}</p>
                    )}
                </div>

                {/* actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <Link
                        to={`/dashboard/projects/${project._id}/edit`}
                        className="
                            flex-1 flex items-center justify-center gap-1.5
                            min-h-[36px] text-xs font-medium text-gray-600
                            border border-gray-200 rounded-xl
                            hover:bg-gray-50 hover:text-gray-900
                            transition-colors duration-150
                        "
                    >
                        <HiOutlinePencilSquare className="text-sm" aria-hidden="true" />
                        Edit
                    </Link>
                    <button
                        type="button"
                        onClick={() => onDelete(project._id)}
                        disabled={deleting === project._id}
                        className="
                            flex items-center justify-center
                            w-9 h-9 rounded-xl
                            text-gray-400 border border-gray-200
                            hover:bg-red-50 hover:text-red-600 hover:border-red-200
                            disabled:opacity-40 disabled:pointer-events-none
                            transition-colors duration-150
                        "
                        aria-label={`Delete ${project.title}`}
                    >
                        <HiOutlineTrash className="text-sm" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    );
}
