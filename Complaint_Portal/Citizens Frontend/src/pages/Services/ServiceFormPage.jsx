import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useServiceForm } from "../../hooks/useServiceForm";
import Card from "../../components/ui/Card";
import Field from "../../components/ui/Field";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import ImageUpload from "../../components/ui/ImageUpload";
import ServicePreview from "../../components/Service/ServicePreview";
import { HiOutlineArrowPath, HiOutlineArrowLeft } from "react-icons/hi2";

function SkeletonCard({ height = 160 }) {
    return <div className="bg-gray-100 rounded-2xl animate-pulse w-full" style={{ height }} />;
}

/** Reusable toggle switch component */
function Toggle({ id, checked, onChange, label, hint }) {
    return (
        <label htmlFor={id} className="flex items-start gap-3 cursor-pointer select-none">
            <div
                id={id}
                role="checkbox"
                aria-checked={checked}
                tabIndex={0}
                onClick={() => onChange(!checked)}
                onKeyDown={(e) => e.key === " " && onChange(!checked)}
                className={`
                    relative w-10 h-6 rounded-full transition-colors duration-200 shrink-0
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900
                    ${checked ? "bg-gray-900" : "bg-gray-200"}
                `}
            >
                <span className={`
                    absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
                    ${checked ? "translate-x-5" : "translate-x-1"}
                `} />
            </div>
            <div className="pt-0.5">
                <p className="text-sm font-medium text-gray-700">{label}</p>
                {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
            </div>
        </label>
    );
}

export default function ServiceFormPage() {
    const { id } = useParams(); // undefined on /new
    const navigate = useNavigate();

    const {
        form, setField, errors,
        coverImageFile,
        coverImagePreview,
        handleCoverImageSelect,
        handleCoverImageRemove,
        loading, saving, uploadProgress,
        save, reset, isEdit,
    } = useServiceForm(id);

    const isBusy = saving || loading;

    // Stable blob URL — only recreated when the File object itself changes.
    // Same pattern as ProjectFormPage to prevent remount flicker.
    const blobPreview = useMemo(() => {
        if (!coverImageFile) return null;
        return URL.createObjectURL(coverImageFile);
    }, [coverImageFile]);

    const previewSrc = blobPreview ?? coverImagePreview;

    // unsaved changes warning
    useEffect(() => {
        const guard = (e) => { e.preventDefault(); e.returnValue = ""; };
        window.addEventListener("beforeunload", guard);
        return () => window.removeEventListener("beforeunload", guard);
    }, []);

    const handleSave = async () => {
        const result = await save();
        if (result && !isEdit) {
            navigate(`/dashboard/services/${result._id}/edit`, { replace: true });
        }
    };

    // ── action bar ────────────────────────────────────────────────────────
    const ActionBar = ({ mobile = false }) => (
        <div className={`flex items-center gap-2 ${mobile ? "w-full" : "shrink-0"}`}>
            {saving && uploadProgress > 0 && (
                <span className="text-xs text-gray-400 hidden sm:inline tabular-nums">
                    {uploadProgress}%
                </span>
            )}
            <button
                type="button"
                onClick={reset}
                disabled={isBusy}
                className={`
                    ${mobile ? "flex-1" : ""}
                    min-h-[44px] px-4 py-2 text-sm font-medium text-gray-500
                    border border-gray-200 rounded-xl
                    hover:bg-gray-50 hover:text-gray-700
                    disabled:opacity-40 disabled:pointer-events-none
                    transition-colors duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900
                    cursor-pointer
                `}
            >
                Discard
            </button>
            <button
                type="button"
                onClick={handleSave}
                disabled={isBusy}
                className={`
                    ${mobile ? "flex-1" : ""}
                    min-h-[44px] flex items-center justify-center gap-2
                    px-5 py-2 text-sm font-medium
                    text-white bg-gray-900 rounded-xl
                    hover:bg-gray-700
                    disabled:opacity-50 disabled:pointer-events-none
                    transition-colors duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900
                    cursor-pointer
                `}
            >
                {saving && <HiOutlineArrowPath className="text-sm animate-spin" aria-hidden="true" />}
                {saving
                    ? `Saving… ${uploadProgress > 0 ? uploadProgress + "%" : ""}`
                    : isEdit ? "Save Changes" : "Create Service"}
            </button>
        </div>
    );

    return (
        <div className="flex flex-col min-h-full pb-[80px] sm:pb-0">

            {/* ── sticky top bar (sm+) ── */}
            <div className="hidden sm:block sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-100">
                <div className="flex items-center gap-3 px-4 sm:px-6 py-3">
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard/services")}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-150"
                        aria-label="Back to services"
                    >
                        <HiOutlineArrowLeft className="text-base" aria-hidden="true" />
                    </button>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-sm font-semibold text-gray-900 truncate">
                            {isEdit ? `Edit: ${form.title || "Service"}` : "New Service"}
                        </h1>
                    </div>
                    <ActionBar />
                </div>
            </div>

            {/* ── mobile title ── */}
            <div className="sm:hidden flex items-center gap-3 px-4 pt-5 pb-2">
                <button
                    type="button"
                    onClick={() => navigate("/dashboard/services")}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
                    aria-label="Back to services"
                >
                    <HiOutlineArrowLeft className="text-base" />
                </button>
                <div>
                    <h1 className="text-base font-semibold text-gray-900">
                        {isEdit ? "Edit Service" : "New Service"}
                    </h1>
                </div>
            </div>

            {/* ── content ── */}
            <div className="flex-1 px-4 sm:px-6 py-4 sm:py-6">
                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-4">
                            {[200, 160, 180, 120].map((h, i) => <SkeletonCard key={i} height={h} />)}
                        </div>
                        <div className="hidden lg:block space-y-4">
                            <SkeletonCard height={320} />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">

                        {/* ── form column ── */}
                        <div className="space-y-4 min-w-0">

                            {/* general information */}
                            <Card title="General Information">
                                <div className="flex flex-col gap-4">
                                    <Field label="Service Name" required error={errors.title}>
                                        <Input
                                            name="title"
                                            value={form.title}
                                            onChange={setField}
                                            placeholder="e.g. Residential Construction"
                                            error={errors.title}
                                            maxLength={120}
                                        />
                                    </Field>

                                    <Field
                                        label="Short Description"
                                        hint={`${form.shortDescription.length}/200`}
                                        required
                                        error={errors.shortDescription}
                                    >
                                        <Textarea
                                            name="shortDescription"
                                            value={form.shortDescription}
                                            onChange={setField}
                                            placeholder="One-liner shown on the services list…"
                                            error={errors.shortDescription}
                                            rows={2}
                                            maxLength={200}
                                        />
                                    </Field>

                                    <Field
                                        label="Full Description"
                                        hint={`${form.fullDescription.length}/2000`}
                                        required
                                        error={errors.fullDescription}
                                    >
                                        <Textarea
                                            name="fullDescription"
                                            value={form.fullDescription}
                                            onChange={setField}
                                            placeholder="Detailed description shown on the service page…"
                                            error={errors.fullDescription}
                                            rows={5}
                                            maxLength={2000}
                                        />
                                    </Field>
                                </div>
                            </Card>

                            {/* cover image */}
                            <Card
                                title="Cover Image"
                                description="Main image shown on the service card and detail page. Best at 16:9."
                            >
                                <Field error={errors.cover}>
                                    <ImageUpload
                                        imageUrl={previewSrc}
                                        onFileSelect={handleCoverImageSelect}
                                        onRemove={handleCoverImageRemove}
                                        error={errors.cover}
                                        label="Upload cover image"
                                        aspectRatio="16/9"
                                        uploading={saving && uploadProgress > 0}
                                        progress={uploadProgress}
                                    />
                                </Field>
                            </Card>

                            {/* settings */}
                            <Card title="Settings" description="Control how this service appears on your website.">
                                <div className="flex flex-col gap-5">
                                    <Toggle
                                        id="svc-featured"
                                        checked={form.isFeatured}
                                        onChange={(v) => setField("isFeatured", v)}
                                        label="Highlight on Homepage"
                                        hint="Pins this service to your website's featured section."
                                    />

                                    <Toggle
                                        id="svc-active"
                                        checked={form.isActive}
                                        onChange={(v) => setField("isActive", v)}
                                        label="Visible on Website"
                                        hint="Toggle off to hide this service without deleting it."
                                    />

                                    <Field
                                        label="Display Order"
                                        hint="Lower numbers appear first"
                                        error={errors.displayOrder}
                                    >
                                        <Input
                                            name="displayOrder"
                                            value={String(form.displayOrder)}
                                            onChange={(name, val) => setField(name, val === "" ? 0 : Number(val))}
                                            type="number"
                                            placeholder="0"
                                            error={errors.displayOrder}
                                        />
                                    </Field>
                                </div>
                            </Card>

                            {/* inline preview on mobile/tablet */}
                            <div className="lg:hidden">
                                <ServicePreview form={form} previewSrc={previewSrc} />
                            </div>

                        </div>

                        {/* ── preview column (desktop sticky) ── */}
                        <div className="hidden lg:block min-w-0 lg:sticky lg:top-[65px]">
                            <ServicePreview form={form} previewSrc={previewSrc} />
                        </div>

                    </div>
                )}
            </div>

            {/* ── mobile sticky bottom action bar ── */}
            <div className="sm:hidden fixed bottom-0 inset-x-0 z-20 bg-white border-t border-gray-100 px-4 py-3">
                <ActionBar mobile />
            </div>
        </div>
    );
}
