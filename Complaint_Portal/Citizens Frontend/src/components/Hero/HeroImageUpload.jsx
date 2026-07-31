import { useState, useRef } from "react";
import { HiOutlinePhoto, HiOutlineArrowUpTray, HiOutlinePencil } from "react-icons/hi2";
import { uploadHeroImage } from "../../services/heroService";
import toast from "react-hot-toast";

export default function HeroImageUpload({
    imageUrl,
    onUpload,
    onUploadStart,
    onUploadEnd,
    error,
}) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef(null);

    const handleFile = async (file) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Only image files are allowed.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be under 5 MB.");
            return;
        }

        // snapshot current url so we can restore on failure
        const previousUrl = imageUrl;

        setUploading(true);
        setProgress(0);
        onUploadStart?.();

        try {
            const url = await uploadHeroImage(file, setProgress);
            // append cache-buster so browsers don't serve a stale cached version
            // when the same Cloudinary public_id is overwritten
            const busted = `${url}?t=${Date.now()}`;
            onUpload(busted);
            toast.success("Background image updated.");
        } catch (err) {
            // restore previous image — never leave the form in a broken state
            onUpload(previousUrl);
            toast.error(err?.response?.data?.message ?? "Upload failed. Previous image kept.");
        } finally {
            setUploading(false);
            setProgress(0);
            onUploadEnd?.();
            // reset file input so the same file can be re-selected if needed
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files?.[0]);
    };

    const triggerPicker = () => !uploading && inputRef.current?.click();

    return (
        <div className="flex flex-col gap-3">
            {imageUrl ? (
                <div
                    className="relative w-full rounded-2xl overflow-hidden group cursor-pointer"
                    style={{ aspectRatio: "16/7" }}
                    onClick={triggerPicker}
                    onDrop={onDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    role="button"
                    tabIndex={0}
                    aria-label="Replace background image"
                    onKeyDown={(e) => e.key === "Enter" && triggerPicker()}
                >
                    {/* use key= to force React to remount <img> when url changes,
                        guaranteeing the browser fetches the new resource          */}
                    <img
                        key={imageUrl}
                        src={imageUrl}
                        alt="Hero background preview"
                        className="w-full h-full object-cover"
                    />

                    {/* hover / drag overlay */}
                    <div className={`
                        absolute inset-0 bg-black/45
                        flex flex-col items-center justify-center gap-2
                        transition-opacity duration-200
                        ${dragging ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus:opacity-100"}
                    `}>
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <HiOutlinePencil className="text-white text-lg" aria-hidden="true" />
                        </div>
                        <span className="text-white text-xs font-medium">
                            {dragging ? "Drop to replace" : "Click or drag to replace"}
                        </span>
                    </div>

                    {/* upload progress overlay */}
                    {uploading && (
                        <div className="absolute inset-0 bg-black/65 flex flex-col items-center justify-center gap-3 px-8">
                            <p className="text-white text-sm font-medium tabular-nums">
                                Uploading {progress}%
                            </p>
                            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white rounded-full transition-all duration-200"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* empty drop zone */
                <div
                    onClick={triggerPicker}
                    onDrop={onDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    style={{ aspectRatio: "16/7" }}
                    role="button"
                    tabIndex={0}
                    aria-label="Upload background image"
                    onKeyDown={(e) => e.key === "Enter" && triggerPicker()}
                    className={`
                        flex flex-col items-center justify-center gap-3
                        w-full rounded-2xl border-2 border-dashed
                        transition-colors duration-150 cursor-pointer
                        outline-none focus-visible:ring-2 focus-visible:ring-gray-900
                        ${dragging
                            ? "border-gray-700 bg-gray-100"
                            : error
                                ? "border-red-300 bg-red-50/40"
                                : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                        }
                        ${uploading ? "pointer-events-none opacity-70" : ""}
                    `}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2 w-full px-8 sm:px-12">
                            <p className="text-xs text-gray-500 tabular-nums">Uploading {progress}%</p>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gray-900 rounded-full transition-all duration-200"
                                    style={{ width: `${progress}%` }}
                                />
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
                                    {dragging ? "Drop your image here" : "Upload background image"}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Drag & drop or click · PNG, JPG, WebP · max 5 MB
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {error && !imageUrl && (
                <p className="text-xs text-red-500 mt-0.5">{error}</p>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
            />
        </div>
    );
}
