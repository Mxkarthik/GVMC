import { useEffect, useRef } from "react";
import { HiOutlineExclamationTriangle, HiOutlineXMark } from "react-icons/hi2";

/**
 * Generic delete confirmation dialog.
 * Reusable for Services (and future modules like Testimonials, Team, etc.)
 *
 * Props:
 *   open       — boolean
 *   title      — dialog headline, e.g. "Delete Service"
 *   message    — body text describing what will be deleted
 *   onConfirm  — called when the user clicks "Delete"
 *   onCancel   — called when the user cancels or presses Escape
 *   loading    — shows spinner on confirm button
 */
export default function DeleteDialog({ open, title, message, onConfirm, onCancel, loading }) {
    const cancelRef = useRef(null);

    // focus cancel button when opened; close on Escape
    useEffect(() => {
        if (!open) return;
        setTimeout(() => cancelRef.current?.focus(), 50);
        const handler = (e) => { if (e.key === "Escape") onCancel(); };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, onCancel]);

    // lock body scroll
    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else       document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    if (!open) return null;

    return (
        <>
            {/* backdrop */}
            <div
                aria-hidden="true"
                onClick={onCancel}
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
            />

            {/* dialog */}
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-desc"
                className="
                    fixed inset-0 z-50 flex items-center justify-center p-4
                    pointer-events-none
                "
            >
                <div className="
                    w-full max-w-md bg-white rounded-2xl shadow-[0_24px_48px_-8px_rgba(0,0,0,0.20)]
                    pointer-events-auto flex flex-col overflow-hidden
                    animate-[fadeScaleIn_0.15s_ease-out]
                ">
                    {/* header */}
                    <div className="flex items-start justify-between gap-3 px-6 pt-5 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                                <HiOutlineExclamationTriangle className="text-red-500 text-xl" aria-hidden="true" />
                            </div>
                            <h2
                                id="delete-dialog-title"
                                className="text-base font-semibold text-gray-900"
                            >
                                {title}
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            aria-label="Close dialog"
                            className="
                                w-8 h-8 flex items-center justify-center rounded-lg
                                text-gray-400 hover:bg-gray-100 hover:text-gray-700
                                disabled:opacity-40 disabled:pointer-events-none
                                transition-colors duration-150 shrink-0
                            "
                        >
                            <HiOutlineXMark className="text-lg" aria-hidden="true" />
                        </button>
                    </div>

                    {/* body */}
                    <div className="px-6 pb-5">
                        <p
                            id="delete-dialog-desc"
                            className="text-sm text-gray-600 leading-relaxed"
                        >
                            {message}
                        </p>
                    </div>

                    {/* footer */}
                    <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50">
                        <button
                            ref={cancelRef}
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="
                                min-h-[40px] px-4 py-2 text-sm font-medium text-gray-600
                                border border-gray-200 rounded-xl
                                hover:bg-gray-100 hover:text-gray-800
                                disabled:opacity-40 disabled:pointer-events-none
                                transition-colors duration-150
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900
                                cursor-pointer
                            "
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={loading}
                            className="
                                min-h-[40px] px-4 py-2 text-sm font-medium
                                text-white bg-red-600 rounded-xl
                                hover:bg-red-700
                                disabled:opacity-50 disabled:pointer-events-none
                                transition-colors duration-150
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600
                                cursor-pointer
                            "
                        >
                            {loading ? "Deleting…" : "Delete"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
