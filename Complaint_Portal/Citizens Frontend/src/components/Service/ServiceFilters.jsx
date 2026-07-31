import { HiOutlineMagnifyingGlass, HiOutlineXMark } from "react-icons/hi2";

const FILTER_OPTIONS = [
    { value: "all",      label: "All" },
    { value: "featured", label: "Highlighted on Homepage" },
    { value: "active",   label: "Visible on Website" },
    { value: "inactive", label: "Hidden" },
];

const SORT_OPTIONS = [
    { value: "order",  label: "Display Order" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "alpha",  label: "Alphabetical" },
];

const SELECT_CLASS = `
    min-h-[44px] px-3.5 py-2.5 text-sm text-gray-700
    bg-white border border-gray-200 rounded-xl outline-none cursor-pointer
    focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400
    transition-colors duration-150
`;

export default function ServiceFilters({
    search, setSearch,
    filter, setFilter,
    sort,   setSort,
}) {
    const hasFilter = search || filter !== "all" || sort !== "order";

    return (
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            {/* search */}
            <div className="relative flex-1 min-w-0">
                <HiOutlineMagnifyingGlass
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                    aria-hidden="true"
                />
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search services…"
                    className="
                        w-full min-h-[44px] pl-9 pr-3.5 py-2.5
                        text-sm text-gray-900 bg-white
                        border border-gray-200 rounded-xl outline-none
                        placeholder:text-gray-400
                        focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400
                        transition-colors duration-150
                    "
                />
            </div>

            {/* filter */}
            <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={SELECT_CLASS}
                aria-label="Filter services"
            >
                {FILTER_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>

            {/* sort */}
            <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className={SELECT_CLASS}
                aria-label="Sort services"
            >
                {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>

            {/* clear */}
            {hasFilter && (
                <button
                    type="button"
                    onClick={() => { setSearch(""); setFilter("all"); setSort("order"); }}
                    className="
                        flex items-center gap-1.5 min-h-[44px] px-4
                        text-sm font-medium text-gray-500
                        border border-gray-200 rounded-xl
                        hover:bg-gray-50 hover:text-gray-700
                        transition-colors duration-150 shrink-0
                    "
                >
                    <HiOutlineXMark className="text-base" aria-hidden="true" />
                    Clear
                </button>
            )}
        </div>
    );
}
