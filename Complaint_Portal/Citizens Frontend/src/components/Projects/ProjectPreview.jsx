import { HiOutlineMapPin, HiOutlineCalendarDays, HiOutlineStar } from "react-icons/hi2";

const STATUS_STYLES = {
    Completed: "bg-green-400/20 text-green-300",
    Ongoing:   "bg-blue-400/20  text-blue-300",
    Upcoming:  "bg-amber-400/20 text-amber-300",
};

/**
 * Live preview panel for the project editor.
 *
 * Receives `previewSrc` — a stable URL already resolved by the parent
 * (ProjectFormPage) via useMemo. This component never calls
 * URL.createObjectURL; it is a pure display component.
 *
 * Props:
 *   form       — current editable form state (single source of truth)
 *   previewSrc — resolved thumbnail URL: blob URL when a new file is
 *                selected, Cloudinary URL after save, empty string when
 *                no thumbnail exists
 */
export default function ProjectPreview({ form, previewSrc }) {
    const hasContent = form.title || form.description || form.location;

    return (
        <div className="flex flex-col gap-2 min-w-0">
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider shrink-0">
                    Live Preview
                </span>
                <span className="text-[11px] text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                    Portfolio · Project
                </span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10)] min-w-0">
                {/* mock browser bar */}
                <div className="bg-gray-100 px-3 py-2 flex items-center gap-2 border-b border-gray-200">
                    <div className="flex gap-1.5 shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                    </div>
                    <div className="flex-1 min-w-0 bg-white rounded-md px-2.5 py-1 text-[10px] text-gray-400 font-mono truncate">
                        yoursite.com/projects
                    </div>
                </div>

                {/* card preview */}
                <div className="bg-gray-900 p-3">
                    <div className="bg-gray-800 rounded-xl overflow-hidden">
                        {/* thumbnail */}
                        <div className="relative w-full bg-gray-700" style={{ aspectRatio: "16/9" }}>
                            {previewSrc ? (
                                <img
                                    key={previewSrc}
                                    src={previewSrc}
                                    alt=""
                                    aria-hidden="true"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-[10px] text-gray-500">No thumbnail</span>
                                </div>
                            )}

                            {/* gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                            {form.isFeatured && (
                                <span className="absolute top-2 left-2 flex items-center gap-1 text-[9px] font-semibold bg-yellow-400 text-gray-900 px-1.5 py-0.5 rounded-full">
                                    <HiOutlineStar className="text-[9px]" aria-hidden="true" />
                                    Featured
                                </span>
                            )}

                            {form.status && (
                                <span className={`absolute top-2 right-2 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${STATUS_STYLES[form.status] ?? "bg-gray-500/20 text-gray-300"}`}>
                                    {form.status}
                                </span>
                            )}
                        </div>

                        {/* card body */}
                        <div className="p-3 flex flex-col gap-1.5">
                            {hasContent ? (
                                <>
                                    {form.category && (
                                        <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">
                                            {form.category}
                                        </p>
                                    )}
                                    {form.title && (
                                        <h3 className="text-[clamp(10px,1.5vw,13px)] font-bold text-white line-clamp-2 leading-tight">
                                            {form.title}
                                        </h3>
                                    )}
                                    {form.description && (
                                        <p className="text-[9px] text-gray-400 line-clamp-2 leading-relaxed">
                                            {form.description}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-3 mt-1">
                                        {form.location && (
                                            <span className="flex items-center gap-1 text-[9px] text-gray-400">
                                                <HiOutlineMapPin className="text-[9px]" aria-hidden="true" />
                                                {form.location}
                                            </span>
                                        )}
                                        {form.completionDate && (
                                            <span className="flex items-center gap-1 text-[9px] text-gray-400">
                                                <HiOutlineCalendarDays className="text-[9px]" aria-hidden="true" />
                                                {new Date(form.completionDate).getFullYear()}
                                            </span>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <p className="text-[10px] text-gray-500 text-center py-2">
                                    Start filling the form to see the preview
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-[11px] text-gray-400 text-center">
                Preview updates as you edit. Save to publish.
            </p>
        </div>
    );
}
