export default function Textarea({
    name, value, onChange, placeholder,
    error, rows = 3, maxLength,
}) {
    return (
        <textarea
            rows={rows}
            value={value}
            maxLength={maxLength}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder={placeholder}
            className={`
                w-full px-3.5 py-2.5 text-sm text-gray-900
                bg-white border rounded-xl outline-none resize-none
                transition-colors duration-150 placeholder:text-gray-400
                focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400
                ${error ? "border-red-400 bg-red-50/40" : "border-gray-200"}
            `}
        />
    );
}
