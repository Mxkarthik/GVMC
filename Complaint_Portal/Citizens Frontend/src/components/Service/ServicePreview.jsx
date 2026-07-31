import { HiOutlineStar, HiOutlineCheckCircle } from "react-icons/hi2";

/**
 * Live preview panel for the Service editor.
 *
 * Receives previewSrc (already resolved blob or saved URL) from the parent.
 * This is a pure display component — no side-effects.
 */
export default function ServicePreview({ form, previewSrc }) {
    const hasContent = form.title || form.shortDescription;

    return (
        <div className="flex flex-col gap-2 min-w-0">
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider shrink-0">
                    Live Preview
                </span>
                <span className="text-[11px] text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                    Portfolio · Services
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
                        yoursite.com/services
                    </div>
                </div>

                {/* service card preview */}
                <div className="bg-gray-900 p-3">
                    <div className="bg-gray-800 rounded-xl overflow-hidden">
                        {/* cover image */}
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
                                    <span className="text-[10px] text-gray-500">No cover image</span>
                                </div>
                            )}

                            {/* gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                            {/* featured badge */}
                            {form.isFeatured && (
                                <span className="absolute top-2 left-2 flex items-center gap-1 text-[9px] font-semibold bg-yellow-400 text-gray-900 px-1.5 py-0.5 rounded-full">
                                    <HiOutlineStar className="text-[9px]" aria-hidden="true" />
                                    Highlighted
                                </span>
                            )}

                            {/* active badge */}
                            {form.isActive && (
                                <span className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-semibold bg-green-400/20 text-green-300 px-1.5 py-0.5 rounded-full">
                                    <HiOutlineCheckCircle className="text-[9px]" aria-hidden="true" />
                                    Visible
                                </span>
                            )}
                        </div>

                        {/* card body */}
                        <div className="p-3 flex flex-col gap-1.5">
                            {hasContent ? (
                                <>
                                    {form.title && (
                                        <h3 className="text-[clamp(10px,1.5vw,13px)] font-bold text-white line-clamp-2 leading-tight">
                                            {form.title}
                                        </h3>
                                    )}
                                    {form.shortDescription && (
                                        <p className="text-[9px] text-gray-400 line-clamp-2 leading-relaxed">
                                            {form.shortDescription}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[9px] text-gray-500">
                                            Order #{form.displayOrder ?? 0}
                                        </span>
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
