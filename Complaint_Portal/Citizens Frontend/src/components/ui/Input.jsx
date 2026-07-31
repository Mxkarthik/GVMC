export default function Input({
    name, value, onChange, placeholder,
    error, type = "text", maxLength, disabled,
}) {
    return (
        <input
            type={type}
            value={value}
            maxLength={maxLength}
            disabled={disabled}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder={placeholder}
            className={`
                w-full min-h-[44px] px-3.5 py-2.5 text-sm text-gray-900
                bg-white border rounded-xl outline-none
                transition-colors duration-150 placeholder:text-gray-400
                focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400
                disabled:opacity-50 disabled:cursor-not-allowed
                ${error ? "border-red-400 bg-red-50/40" : "border-gray-200"}
            `}
        />
    );
}
