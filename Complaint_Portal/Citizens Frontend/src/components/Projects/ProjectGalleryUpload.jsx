import { useRef, useState } from "react";
import { HiOutlinePhoto, HiOutlineArrowUpTray, HiOutlineXMark } from "react-icons/hi2";
import toast from "react-hot-toast";

export default function ProjectGalleryUpload({
    existingImages = [], // { url, publicId }[]
    newFiles = [],       // File[]
    onAddFiles,          // (File[]) => void
    onRemoveNew,         // (index) => void
}) {
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef(null);

    const handleFiles = (files) => {
        const valid = [];
        for (const f of files) {
            if (!f.type.startsWith("image/")) {
                toast.error(`${f.name} is not an image.`);
                continue;
            }
            if (f.size > 5 * 1024 * 1024) {
                toast.error(`${f.name} exceeds 5 MB.`);
                continue;
            }
            valid.push(f);
        }
        if (valid.length) onAddFiles(valid);
    };

    const totalCount = existingImages.length + newFiles.length;

    return (
        <div className="flex flex-col gap-3">
            {/* existing images from server */}
            {existingImages.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {existingImages.map((img) => (
                        <div key={img.publicId ?? img.url} className="relative rounded-xl overflow-hidden bg-gray-100" style={{ aspectRatio: "1" }}>
                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20" />
                            <span className="absolute bottom-1 left-1 text-[10px] text-white bg-black/40 rounded px-1">Saved</span>
                        </div>
                    ))}
                </div>
            )}

            {/* new files queued for upload */}
            {newFiles.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {newFiles.map((f, i) => (
                        <div key={i} className="relative rounded-xl overflow-hidden bg-gray-100 group" style={{ aspectRatio: "1" }}>
                            <img
                                src={URL.createObjectURL(f)}
                                alt={f.name}
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => onRemoveNew(i)}
                                className="
                                    absolute top-1 right-1 w-6 h-6
                                    flex items-center justify-center
                                    bg-black/50 text-white rounded-full
                                    opacity-0 group-hover:opacity-100
                                    transition-opacity duration-150
                                "
                                aria-label="Remove image"
                            >
                                <HiOutlineXMark className="text-xs" aria-hidden="true" />
                            </button>
                            <span className="absolute bottom-1 left-1 text-[10px] text-white bg-black/40 rounded px-1">New</span>
                        </div>
                    ))}
                </div>
            )}

            {/* drop zone — only show if under limit */}
            {totalCount < 10 && (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles([...e.dataTransfer.files]); }}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    role="button"
                    tabIndex={0}
                    aria-label="Add gallery images"
                    onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
                    className={`
                        flex flex-col items-center justify-center gap-2 py-6
                        w-full rounded-2xl border-2 border-dashed cursor-pointer
                        outline-none focus-visible:ring-2 focus-visible:ring-gray-900
                        transition-colors duration-150
                        ${dragging ? "border-gray-700 bg-gray-100" : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"}
                    `}
                >
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                        {dragging
                            ? <HiOutlineArrowUpTray className="text-gray-600" aria-hidden="true" />
                            : <HiOutlinePhoto className="text-gray-400" aria-hidden="true" />
                        }
                    </div>
                    <p className="text-xs text-gray-500">
                        {dragging ? "Drop images here" : `Add images (${totalCount}/10)`}
                    </p>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => { handleFiles([...e.target.files]); e.target.value = ""; }}
            />
        </div>
    );
}
