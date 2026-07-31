// Generic form field wrapper — used across Hero and Projects modules
export default function Field({ label, hint, error, required, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {label}
                    {required && <span className="text-red-400 ml-0.5">*</span>}
                </label>
                {hint && <span className="text-[11px] text-gray-400 shrink-0">{hint}</span>}
            </div>
            {children}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
