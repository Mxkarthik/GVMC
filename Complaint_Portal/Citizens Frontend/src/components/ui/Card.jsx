export default function Card({ title, description, children, className = "" }) {
    return (
        <div className={`bg-white border border-gray-100 rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] overflow-hidden ${className}`}>
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
