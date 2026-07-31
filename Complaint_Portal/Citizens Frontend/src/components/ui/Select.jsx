export default function Select({ name, value, onChange, options, placeholder, error, disabled }) {
    return (
        <select
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(name, e.target.value)}
            className={`
                w-full min-h-[44px] px-3.5 py-2.5 text-sm text-gray-900
                bg-white border rounded-xl outline-none cursor-pointer
                transition-colors duration-150
                focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400
                disabled:opacity-50 disabled:cursor-not-allowed
                ${error ? "border-red-400 bg-red-50/40" : "border-gray-200"}
            `}
        >
            {placeholder && (
                <option value="" disabled>{placeholder}</option>
            )}
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    );
}
