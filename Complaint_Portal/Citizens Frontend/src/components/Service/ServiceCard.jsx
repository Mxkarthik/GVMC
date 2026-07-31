import { Link } from "react-router-dom";
import {
    HiOutlinePencilSquare,
    HiOutlineTrash,
    HiOutlineStar,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlinePhoto,
} from "react-icons/hi2";

/**
 * Service card displayed in the Services list grid.
 * Mirrors ProjectCard patterns exactly.
 */
export default function ServiceCard({ service, onDelete, deleting, onDeleteRequest }) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] flex flex-col">
            {/* cover image */}
            <div className="relative w-full bg-gray-100" style={{ aspectRatio: "16/9" }}>
                {service.coverImage?.url ? (
                    <img
                        src={service.coverImage.url}
                        alt={service.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                        <HiOutlinePhoto className="text-2xl text-gray-300" aria-hidden="true" />
                        <span className="text-[10px] text-gray-300">No cover image</span>
                    </div>
                )}

                {/* featured badge */}
                {service.isFeatured && (
                    <span className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-semibold bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full">
                        <HiOutlineStar className="text-xs" aria-hidden="true" />
                        Highlighted
                    </span>
                )}

                {/* active / inactive badge */}
                <span className={`absolute top-2 right-2 flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border
                    ${service.isActive
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-gray-100 text-gray-500 border-gray-200"}`}
                >
                    {service.isActive
                        ? <><HiOutlineCheckCircle className="text-xs" aria-hidden="true" />Visible</>
                        : <><HiOutlineXCircle    className="text-xs" aria-hidden="true" />Hidden</>
                    }
                </span>
            </div>

            {/* body */}
            <div className="flex flex-col flex-1 p-4 gap-3">
                <div className="flex-1 min-w-0">
                    {/* display order chip */}
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">
                        Order #{service.displayOrder ?? 0}
                    </p>

                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {service.title}
                    </h3>

                    {service.shortDescription && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                            {service.shortDescription}
                        </p>
                    )}
                </div>

                {/* actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <Link
                        to={`/dashboard/services/${service._id}/edit`}
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
                        onClick={() => onDeleteRequest(service)}
                        disabled={deleting === service._id}
                        className="
                            flex items-center justify-center
                            w-9 h-9 rounded-xl
                            text-gray-400 border border-gray-200
                            hover:bg-red-50 hover:text-red-600 hover:border-red-200
                            disabled:opacity-40 disabled:pointer-events-none
                            transition-colors duration-150
                        "
                        aria-label={`Delete ${service.title}`}
                    >
                        <HiOutlineTrash className="text-sm" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    );
}
