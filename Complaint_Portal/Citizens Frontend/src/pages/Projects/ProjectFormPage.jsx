import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjectForm, CATEGORIES, STATUSES } from "../../hooks/useProjectForm";
import Card from "../../components/ui/Card";
import Field from "../../components/ui/Field";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Select from "../../components/ui/Select";
import ImageUpload from "../../components/ui/ImageUpload";
import ProjectGalleryUpload from "../../components/Projects/ProjectGalleryUpload";
import ProjectPreview from "../../components/Projects/ProjectPreview";
import { HiOutlineArrowPath, HiOutlineArrowLeft } from "react-icons/hi2";

const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({ label: c, value: c }));
const STATUS_OPTIONS   = STATUSES.map((s)   => ({ label: s, value: s }));

function SkeletonCard({ height = 160 }) {
    return <div className="bg-gray-100 rounded-2xl animate-pulse w-full" style={{ height }} />;
}

export default function ProjectFormPage() {
    const { id } = useParams(); // undefined on /new
    const navigate = useNavigate();

    const {
        form, setField, errors,
        thumbnailFile, setThumbnailFile,
        thumbnailUrl, setThumbnailUrl,
        galleryFiles, galleryUrls,
        addGalleryFiles, removeGalleryFile,
        loading, saving, uploadProgress,
        save, reset, isEdit,
    } = useProjectForm(id);

    const isBusy = saving || loading;

    // Stable blob URL — only recreated when the File object itself changes.
    // Without this, URL.createObjectURL is called on every render, producing a
    // new string each time, which causes ImageUpload to remount the <img> via
    // key= before it can finish loading, resulting in a broken image icon.
    const thumbnailBlobUrl = useMemo(() => {
        if (!thumbnailFile) return null;
        return URL.createObjectURL(thumbnailFile);
    }, [thumbnailFile]);

    // unsaved changes warning
    useEffect(() => {
        const guard = (e) => { e.preventDefault(); e.returnValue = ""; };
        window.addEventListener("beforeunload", guard);
        return () => window.removeEventListener("beforeunload", guard);
    }, []);

    const handleSave = async () => {
        const result = await save();
        if (result && !isEdit) {
            // Navigate to the edit route. Pass the saved thumbnail URL in
            // location state so the remounted form can show it immediately
            // without waiting for the GET /api/projects/:id fetch to complete.
            navigate(`/dashboard/projects/${result._id}/edit`, {
                replace: true,
                state: { thumbnailUrl: result.thumbnail?.url ?? "" },
            });
        }
    };

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
                {saving ? `Saving… ${uploadProgress > 0 ? uploadProgress + "%" : ""}` : isEdit ? "Save Changes" : "Create Project"}
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
                        onClick={() => navigate("/dashboard/projects")}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-150"
                        aria-label="Back to projects"
                    >
                        <HiOutlineArrowLeft className="text-base" aria-hidden="true" />
                    </button>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-sm font-semibold text-gray-900 truncate">
                            {isEdit ? `Edit: ${form.title || "Project"}` : "New Project"}
                        </h1>
                    </div>
                    <ActionBar />
                </div>
            </div>

            {/* ── mobile title ── */}
            <div className="sm:hidden flex items-center gap-3 px-4 pt-5 pb-2">
                <button
                    type="button"
                    onClick={() => navigate("/dashboard/projects")}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
                    aria-label="Back to projects"
                >
                    <HiOutlineArrowLeft className="text-base" />
                </button>
                <div>
                    <h1 className="text-base font-semibold text-gray-900">
                        {isEdit ? "Edit Project" : "New Project"}
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

                            {/* general */}
                            <Card title="General Information">
                                <div className="flex flex-col gap-4">
                                    <Field label="Title" required error={errors.title}>
                                        <Input name="title" value={form.title} onChange={setField}
                                            placeholder="e.g. Riverside Apartment Complex" error={errors.title} maxLength={120} />
                                    </Field>
                                    <Field label="Description" required error={errors.description}>
                                        <Textarea name="description" value={form.description} onChange={setField}
                                            placeholder="Brief overview of the project…" error={errors.description} rows={4} maxLength={1000} />
                                    </Field>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field label="Location" required error={errors.location}>
                                            <Input name="location" value={form.location} onChange={setField}
                                                placeholder="e.g. Dubai, UAE" error={errors.location} />
                                        </Field>
                                        <Field label="Client Name" error={errors.clientName}>
                                            <Input name="clientName" value={form.clientName} onChange={setField}
                                                placeholder="e.g. Al Noor Group" />
                                        </Field>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field label="Category" required error={errors.category}>
                                            <Select name="category" value={form.category} onChange={setField}
                                                options={CATEGORY_OPTIONS} placeholder="Select category…" error={errors.category} />
                                        </Field>
                                        <Field label="Status" required error={errors.status}>
                                            <Select name="status" value={form.status} onChange={setField}
                                                options={STATUS_OPTIONS} placeholder="Select status…" error={errors.status} />
                                        </Field>
                                    </div>
                                    <Field label="Completion Date" error={errors.completionDate}>
                                        <Input name="completionDate" value={form.completionDate} onChange={setField}
                                            type="date" />
                                    </Field>
                                    {/* featured toggle */}
                                    <label className="flex items-center gap-3 cursor-pointer select-none">
                                        <div
                                            role="checkbox"
                                            aria-checked={form.isFeatured}
                                            tabIndex={0}
                                            onClick={() => setField("isFeatured", !form.isFeatured)}
                                            onKeyDown={(e) => e.key === " " && setField("isFeatured", !form.isFeatured)}
                                            className={`
                                                relative w-10 h-6 rounded-full transition-colors duration-200
                                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900
                                                ${form.isFeatured ? "bg-gray-900" : "bg-gray-200"}
                                            `}
                                        >
                                            <span className={`
                                                absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
                                                ${form.isFeatured ? "translate-x-5" : "translate-x-1"}
                                            `} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Featured project</span>
                                    </label>
                                </div>
                            </Card>

                            {/* thumbnail */}
                            <Card title="Thumbnail" description="Main project card image. Best at 16:9.">
                                <Field error={errors.thumbnail}>
                                    <ImageUpload
                                        imageUrl={thumbnailBlobUrl ?? thumbnailUrl}
                                        onFileSelect={(f) => setThumbnailFile(f)}
                                        onRemove={() => { setThumbnailFile(null); setThumbnailUrl(""); }}
                                        error={errors.thumbnail}
                                        label="Upload thumbnail"
                                        aspectRatio="16/9"
                                    />
                                </Field>
                            </Card>

                            {/* gallery */}
                            <Card title="Gallery" description="Up to 10 additional project images.">
                                <ProjectGalleryUpload
                                    existingImages={galleryUrls}
                                    newFiles={galleryFiles}
                                    onAddFiles={addGalleryFiles}
                                    onRemoveNew={removeGalleryFile}
                                />
                            </Card>

                            {/* preview inline on mobile/tablet */}
                            <div className="lg:hidden">
                                <ProjectPreview
                                    form={form}
                                    previewSrc={thumbnailBlobUrl ?? thumbnailUrl}
                                />
                            </div>
                        </div>

                        {/* ── preview column (desktop) ── */}
                        <div className="hidden lg:block min-w-0 lg:sticky lg:top-[65px]">
                            <ProjectPreview
                                form={form}
                                previewSrc={thumbnailBlobUrl ?? thumbnailUrl}
                            />
                        </div>

                    </div>
                )}
            </div>

            {/* ── mobile sticky bottom bar ── */}
            <div className="sm:hidden fixed bottom-0 inset-x-0 z-20 bg-white border-t border-gray-100 px-4 py-3">
                <ActionBar mobile />
            </div>
        </div>
    );
}
