import { Field, Input } from "./HeroForm";
import { LINK_PRESETS, resolvePreset } from "../../hooks/useHero";

function DestinationPicker({ textName, linkName, label, form, setField, errors }) {
    const preset = resolvePreset(form[linkName]);
    const isCustom = preset === "__custom__";

    const handlePresetChange = (e) => {
        const val = e.target.value;
        if (val === "__custom__") {
            // Keep whatever was there, or clear to let user type
            setField(linkName, isCustom ? form[linkName] : "");
        } else {
            setField(linkName, val);
        }
    };

    return (
        <div className="bg-gray-50/70 border border-gray-100 rounded-2xl p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-gray-900 flex items-center justify-center shrink-0">
                    <span className="text-white text-[9px] font-black leading-none select-none">CTA</span>
                </div>
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">{label}</span>
            </div>

            <Field label="Button Label" error={errors[textName]}>
                <Input
                    name={textName}
                    value={form[textName]}
                    onChange={setField}
                    placeholder="e.g. Our Services"
                    error={errors[textName]}
                    maxLength={40}
                />
            </Field>

            <Field label="Button Destination" error={errors[linkName]}>
                <select
                    value={isCustom ? "__custom__" : (preset || "")}
                    onChange={handlePresetChange}
                    className={`
                        w-full px-3.5 py-2.5 text-sm text-gray-900
                        bg-white border rounded-xl outline-none
                        transition-colors duration-150
                        focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400
                        cursor-pointer
                        ${errors[linkName] ? "border-red-400 bg-red-50/40" : "border-gray-200"}
                    `}
                >
                    <option value="" disabled>Choose a page…</option>
                    {LINK_PRESETS.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                </select>
            </Field>

            {isCustom && (
                <Field label="Custom URL" error={errors[linkName]}>
                    <Input
                        name={linkName}
                        value={form[linkName]}
                        onChange={setField}
                        placeholder="https://example.com/page"
                        error={errors[linkName]}
                    />
                </Field>
            )}
        </div>
    );
}

export default function HeroButtons({ form, setField, errors }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DestinationPicker
                label="Primary Button"
                textName="ourServicesButtonText"
                linkName="ourServicesButtonLink"
                form={form}
                setField={setField}
                errors={errors}
            />
            <DestinationPicker
                label="Secondary Button"
                textName="viewProjectsButtonText"
                linkName="viewProjectsButtonLink"
                form={form}
                setField={setField}
                errors={errors}
            />
        </div>
    );
}
