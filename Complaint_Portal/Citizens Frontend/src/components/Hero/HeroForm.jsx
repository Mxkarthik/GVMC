// Shared primitive components used only within Hero feature
export function Field({ label, hint, error, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {label}
                </label>
                {hint && <span className="text-[11px] text-gray-400">{hint}</span>}
            </div>
            {children}
            {error && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                    {error}
                </p>
            )}
        </div>
    );
}

export function Input({ name, value, onChange, placeholder, error, maxLength }) {
    return (
        <input
            type="text"
            value={value}
            maxLength={maxLength}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder={placeholder}
            className={`
                w-full px-3.5 py-2.5 text-sm text-gray-900
                bg-white border rounded-xl outline-none
                transition-colors duration-150
                placeholder:text-gray-400
                focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400
                ${error ? "border-red-400 bg-red-50/40" : "border-gray-200"}
            `}
        />
    );
}

export function Textarea({ name, value, onChange, placeholder, error, rows = 3, maxLength }) {
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
                transition-colors duration-150
                placeholder:text-gray-400
                focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400
                ${error ? "border-red-400 bg-red-50/40" : "border-gray-200"}
            `}
        />
    );
}

export default function HeroForm({ form, setField, errors }) {
    return (
        <div className="flex flex-col gap-5">
            <Field label="Subtitle" hint={`${form.subtitle.length}/80`} error={errors.subtitle}>
                <Input
                    name="subtitle"
                    value={form.subtitle}
                    onChange={setField}
                    placeholder="e.g. We Build Excellence"
                    error={errors.subtitle}
                    maxLength={80}
                />
            </Field>

            <Field label="Headline" hint={`${form.title.length}/100`} error={errors.title}>
                <Input
                    name="title"
                    value={form.title}
                    onChange={setField}
                    placeholder="e.g. Premier Construction Company"
                    error={errors.title}
                    maxLength={100}
                />
            </Field>

            <Field label="Description" hint={`${form.description.length}/300`} error={errors.description}>
                <Textarea
                    name="description"
                    value={form.description}
                    onChange={setField}
                    placeholder="A short description shown beneath the headline on your homepage…"
                    error={errors.description}
                    rows={4}
                    maxLength={300}
                />
            </Field>
        </div>
    );
}
