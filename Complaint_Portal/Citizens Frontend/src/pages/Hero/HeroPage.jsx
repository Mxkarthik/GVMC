import { useEffect } from "react";
import { useHero } from "../../hooks/useHero";
import HeroForm from "../../components/Hero/HeroForm";
import HeroButtons from "../../components/Hero/HeroButtons";
import HeroStats from "../../components/Hero/HeroStats";
import HeroImageUpload from "../../components/Hero/HeroImageUpload";
import HeroPreview from "../../components/Hero/HeroPreview";
import { HiOutlineArrowPath } from "react-icons/hi2";

function Card({ title, description, children }) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] overflow-hidden">
            {(title || description) && (
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                    {title && <h2 className="text-sm font-semibold text-gray-900">{title}</h2>}
                    {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
                </div>
            )}
            <div className="p-4 sm:p-6">{children}</div>
        </div>
    );
}

function SkeletonCard({ height = 160 }) {
    return <div className="bg-gray-100 rounded-2xl animate-pulse w-full" style={{ height }} />;
}

export default function HeroPage() {
    const {
        form, setField, errors,
        loading, saving, uploading,
        setUploading, save, reset,
    } = useHero();

    const isBusy = saving || loading || uploading;

    useEffect(() => {
        const guard = (e) => { e.preventDefault(); e.returnValue = ""; };
        window.addEventListener("beforeunload", guard);
        return () => window.removeEventListener("beforeunload", guard);
    }, []);

    const SaveButton = ({ fullWidth = false }) => (
        <button
            type="button"
            onClick={save}
            disabled={isBusy}
            className={`
                ${fullWidth ? "w-full" : "flex-1 sm:flex-none"}
                min-h-[44px] flex items-center justify-center gap-2
                px-5 py-2.5 text-sm font-medium
                text-white bg-gray-900 rounded-xl
                hover:bg-gray-700
                disabled:opacity-50 disabled:pointer-events-none
                transition-colors duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900
                cursor-pointer
            `}
        >
            {saving && <HiOutlineArrowPath className="text-sm animate-spin" aria-hidden="true" />}
            {saving ? "Saving…" : uploading ? "Upload in progress…" : "Save Changes"}
        </button>
    );

    const DiscardButton = ({ fullWidth = false }) => (
        <button
            type="button"
            onClick={reset}
            disabled={isBusy}
            className={`
                ${fullWidth ? "w-full" : "flex-1 sm:flex-none"}
                min-h-[44px] px-4 py-2.5 text-sm font-medium text-gray-500
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
    );

    return (
        // pb-[80px] on mobile reserves space for the fixed bottom bar
        <div className="flex flex-col min-h-full pb-[80px] sm:pb-0">

            {/* ── desktop/tablet sticky top bar (hidden on mobile) ──── */}
            <div className="hidden sm:block sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-100">
                <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3">
                    <div className="min-w-0">
                        <h1 className="text-sm font-semibold text-gray-900">Hero Section</h1>
                        <p className="text-xs text-gray-400 mt-0.5">Changes go live when you save.</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {uploading && (
                            <span className="text-xs text-gray-400 hidden md:inline">Uploading image…</span>
                        )}
                        <DiscardButton />
                        <SaveButton />
                    </div>
                </div>
            </div>

            {/* ── mobile page title (no action buttons) ─────────────── */}
            <div className="sm:hidden px-4 pt-5 pb-2">
                <h1 className="text-base font-semibold text-gray-900">Hero Section</h1>
                <p className="text-xs text-gray-400 mt-0.5">Changes go live when you save.</p>
            </div>

            {/* ── main content ──────────────────────────────────────── */}
            <div className="flex-1 px-4 sm:px-6 py-4 sm:py-6">
                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-4">
                            <SkeletonCard height={220} />
                            <SkeletonCard height={180} />
                            <SkeletonCard height={200} />
                        </div>
                        <div className="hidden lg:block space-y-4">
                            <SkeletonCard height={260} />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">

                        {/* ── form column ── */}
                        <div className="space-y-4 min-w-0">
                            {/* mobile order: Content → Buttons → Stats → Image → Preview */}
                            <Card
                                title="Content"
                                description="The main text displayed on your homepage."
                            >
                                <HeroForm form={form} setField={setField} errors={errors} />
                            </Card>

                            <Card
                                title="Call-to-Action Buttons"
                                description="The two buttons visitors can click on your homepage."
                            >
                                <HeroButtons form={form} setField={setField} errors={errors} />
                            </Card>

                            <Card
                                title="Statistics"
                                description="Numbers shown to build credibility with visitors."
                            >
                                <HeroStats form={form} setField={setField} errors={errors} />
                            </Card>

                            <Card
                                title="Background Image"
                                description="Shown behind the hero text. Best at 1920×1080px."
                            >
                                <HeroImageUpload
                                    imageUrl={form.backgroundImage}
                                    onUpload={(url) => setField("backgroundImage", url)}
                                    onUploadStart={() => setUploading(true)}
                                    onUploadEnd={() => setUploading(false)}
                                    error={errors.backgroundImage}
                                />
                            </Card>

                            {/* Live Preview inline on mobile/tablet, hidden on lg (shown in right col) */}
                            <div className="lg:hidden">
                                <HeroPreview form={form} />
                            </div>
                        </div>

                        {/* ── preview column (desktop only) ── */}
                        <div className="hidden lg:block min-w-0 lg:sticky lg:top-[65px]">
                            <HeroPreview form={form} />
                        </div>

                    </div>
                )}
            </div>

            {/* ── mobile sticky bottom action bar ──────────────────── */}
            <div className="sm:hidden fixed bottom-0 inset-x-0 z-20 bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-2">
                {uploading && (
                    <p className="text-xs text-gray-400 text-center">Uploading image, please wait…</p>
                )}
                <SaveButton fullWidth />
                <DiscardButton fullWidth />
            </div>

        </div>
    );
}
