import { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlinePlus, HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { useServices } from "../../hooks/useServices";
import ServiceCard from "../../components/Service/ServiceCard";
import ServiceFilters from "../../components/Service/ServiceFilters";
import DeleteDialog from "../../components/ui/DeleteDialog";

function SkeletonCard() {
    return <div className="bg-gray-100 rounded-2xl animate-pulse" style={{ height: 280 }} />;
}

export default function ServicesPage() {
    const {
        services, total, loading, deleting,
        search, setSearch,
        filter, setFilter,
        sort,   setSort,
        remove,
    } = useServices();

    // delete confirmation state
    const [pendingDelete, setPendingDelete] = useState(null); // service object

    const handleDeleteRequest = (service) => setPendingDelete(service);

    const handleDeleteConfirm = async () => {
        if (!pendingDelete) return;
        await remove(pendingDelete._id);
        setPendingDelete(null);
    };

    return (
        <div className="flex flex-col min-h-full">
            {/* page header */}
            <div className="px-4 sm:px-6 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-lg font-bold text-gray-900">Services</h1>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {loading
                            ? "Loading…"
                            : `${total} service${total !== 1 ? "s" : ""} total`
                        }
                    </p>
                </div>
                <Link
                    to="/dashboard/services/new"
                    className="
                        inline-flex items-center gap-2
                        min-h-[44px] px-5 py-2.5 text-sm font-medium
                        text-white bg-gray-900 rounded-xl
                        hover:bg-gray-700 transition-colors duration-150
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900
                        shrink-0
                    "
                >
                    <HiOutlinePlus className="text-base" aria-hidden="true" />
                    Add Service
                </Link>
            </div>

            {/* filters */}
            <div className="px-4 sm:px-6 pb-4">
                <ServiceFilters
                    search={search} setSearch={setSearch}
                    filter={filter} setFilter={setFilter}
                    sort={sort}     setSort={setSort}
                />
            </div>

            {/* grid */}
            <div className="flex-1 px-4 sm:px-6 pb-8">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : services.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <HiOutlineWrenchScrewdriver className="text-4xl text-gray-300" aria-hidden="true" />
                        <p className="text-sm text-gray-400">
                            {total === 0
                                ? "No services yet. Add your first one."
                                : "No services match your search or filter."}
                        </p>
                        {total === 0 && (
                            <Link
                                to="/dashboard/services/new"
                                className="text-sm font-medium text-gray-900 underline underline-offset-4"
                            >
                                Add service
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                        {services.map((s) => (
                            <ServiceCard
                                key={s._id}
                                service={s}
                                deleting={deleting}
                                onDeleteRequest={handleDeleteRequest}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* delete confirmation dialog */}
            <DeleteDialog
                open={Boolean(pendingDelete)}
                title="Delete Service"
                message={
                    pendingDelete
                        ? `Are you sure you want to delete "${pendingDelete.title}"? This action cannot be undone and will remove the service from your website.`
                        : ""
                }
                loading={deleting === pendingDelete?._id}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setPendingDelete(null)}
            />
        </div>
    );
}
