const STATS = [
    { name: "projectsCompleted", label: "Projects Completed", suffix: "+" },
    { name: "happyClients",      label: "Happy Clients",      suffix: "+" },
    { name: "yearsExperience",   label: "Years of Experience", suffix: "" },
    { name: "clientSatisfaction",label: "Client Satisfaction", suffix: "%" },
];

function StatCard({ stat, value, onChange, error }) {
    return (
        <div className={`
            flex flex-col gap-3 p-4 rounded-2xl border
            bg-white transition-colors duration-150
            ${error ? "border-red-300 bg-red-50/20" : "border-gray-100"}
        `}>
            {/* live display */}
            <div className="flex items-end gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900 leading-none tabular-nums">
                    {value !== "" ? Number(value).toLocaleString() : "—"}
                </span>
                {value !== "" && (
                    <span className="text-base sm:text-lg font-semibold text-gray-400 leading-none mb-0.5">
                        {stat.suffix}
                    </span>
                )}
            </div>

            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {stat.label}
            </label>

            {/* number input */}
            <input
                type="number"
                min="0"
                value={value}
                onChange={(e) => onChange(stat.name, e.target.value)}
                placeholder="0"
                className={`
                    w-full px-3 py-2 text-sm text-gray-900
                    bg-gray-50 border rounded-xl outline-none
                    transition-colors duration-150
                    focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400
                    ${error ? "border-red-400" : "border-gray-200"}
                `}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

export default function HeroStats({ form, setField, errors }) {
    return (
        <div className="grid grid-cols-2 gap-3">
            {STATS.map((stat) => (
                <StatCard
                    key={stat.name}
                    stat={stat}
                    value={form[stat.name]}
                    onChange={setField}
                    error={errors[stat.name]}
                />
            ))}
        </div>
    );
}
