import { HiOutlineMagnifyingGlass, HiOutlineXMark } from "react-icons/hi2";
import { CATEGORIES, STATUSES } from "../../hooks/useProjectForm";

export default function ProjectFilters({ search, setSearch, category, setCategory, status, setStatus }) {
    const hasFilter = search || category || status;

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            {/* search */}
            <div className="relative flex-1 min-w-0">
                <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" aria-hidden="true" />
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search projects…"
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

            {/* category filter */}
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="
                    min-h-[44px] px-3.5 py-2.5 text-sm text-gray-700
                    bg-white border border-gray-200 rounded-xl outline-none cursor-pointer
                    focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400
                    transition-colors duration-150
                "
            >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* status filter */}
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="
                    min-h-[44px] px-3.5 py-2.5 text-sm text-gray-700
                    bg-white border border-gray-200 rounded-xl outline-none cursor-pointer
                    focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400
                    transition-colors duration-150
                "
            >
                <option value="">All Statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* clear */}
            {hasFilter && (
                <button
                    type="button"
                    onClick={() => { setSearch(""); setCategory(""); setStatus(""); }}
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
