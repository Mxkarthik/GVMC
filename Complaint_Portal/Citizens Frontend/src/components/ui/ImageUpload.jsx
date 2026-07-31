/**
 * Generic single-image upload zone.
 * Accepts a File object via onFileSelect — the parent handles
 * the actual upload call so this stays service-agnostic.
 */
import { useRef, useState } from "react";
import { HiOutlinePhoto, HiOutlineArrowUpTray, HiOutlinePencil } from "react-icons/hi2";

export default function ImageUpload({
    imageUrl,         // currently stored URL (string | null)
    uploading = false,
    progress = 0,
    onFileSelect,     // (File) => void
    onRemove,         // () => void  (optional)
    error,
    label = "Upload image",
    aspectRatio = "16/7",
}) {
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef(null);

    const trigger = () => !uploading && inputRef.current?.click();

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFileSelect(file);
    };

    const sharedDropHandlers = {
        onDrop: handleDrop,
        onDragOver: (e) => { e.preventDefault(); setDragging(true); },
        onDragLeave: () => setDragging(false),
    };

    return (
        <div className="flex flex-col gap-2">
            {imageUrl ? (
                <div
                    {...sharedDropHandlers}
                    onClick={trigger}
                    onKeyDown={(e) => e.key === "Enter" && trigger()}
                    role="button"
                    tabIndex={0}
                    aria-label="Replace image"
                    className="relative w-full rounded-2xl overflow-hidden group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
                    style={{ aspectRatio }}
                >
                    <img
                        key={imageUrl}
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />

                    {/* hover overlay */}
                    <div className={`
                        absolute inset-0 bg-black/45 flex flex-col items-center justify-center gap-2
                        transition-opacity duration-200
                        ${dragging ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus:opacity-100"}
                    `}>
                        <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <HiOutlinePencil className="text-white" aria-hidden="true" />
                        </div>
                        <span className="text-white text-xs font-medium">
                            {dragging ? "Drop to replace" : "Click or drag to replace"}
                        </span>
                    </div>

                    {/* upload overlay */}
                    {uploading && (
                        <div className="absolute inset-0 bg-black/65 flex flex-col items-center justify-center gap-3 px-8">
                            <p className="text-white text-sm font-medium tabular-nums">Uploading {progress}%</p>
                            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div
                    {...sharedDropHandlers}
                    onClick={trigger}
                    onKeyDown={(e) => e.key === "Enter" && trigger()}
                    role="button"
                    tabIndex={0}
                    aria-label={label}
                    style={{ aspectRatio }}
                    className={`
                        flex flex-col items-center justify-center gap-3 w-full
                        rounded-2xl border-2 border-dashed cursor-pointer
                        outline-none focus-visible:ring-2 focus-visible:ring-gray-900
                        transition-colors duration-150
                        ${dragging ? "border-gray-700 bg-gray-100"
                            : error ? "border-red-300 bg-red-50/40"
                            : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"}
                        ${uploading ? "pointer-events-none opacity-70" : ""}
                    `}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2 w-full px-8">
                            <p className="text-xs text-gray-500 tabular-nums">Uploading {progress}%</p>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gray-900 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                {dragging
                                    ? <HiOutlineArrowUpTray className="text-gray-600" aria-hidden="true" />
                                    : <HiOutlinePhoto className="text-gray-400" aria-hidden="true" />
                                }
                            </div>
                            <div className="text-center px-4">
                                <p className="text-sm font-medium text-gray-700">
                                    {dragging ? "Drop to upload" : label}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP · max 5 MB</p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {error && !imageUrl && <p className="text-xs text-red-500">{error}</p>}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) onFileSelect(e.target.files[0]); e.target.value = ""; }}
            />
        </div>
    );
}
