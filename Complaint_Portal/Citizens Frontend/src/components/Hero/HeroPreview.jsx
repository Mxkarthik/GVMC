const STATS_CONFIG = [
    { key: "projectsCompleted",  suffix: "+", label: "Projects" },
    { key: "happyClients",       suffix: "+", label: "Clients" },
    { key: "yearsExperience",    suffix: "",  label: "Years" },
    { key: "clientSatisfaction", suffix: "%", label: "Satisfaction" },
];

export default function HeroPreview({ form }) {
    const {
        subtitle, title, description,
        ourServicesButtonText, viewProjectsButtonText,
        backgroundImage,
    } = form;

    const hasContent = title || subtitle || description;
    const hasStats = STATS_CONFIG.some(({ key }) => form[key] !== "");

    return (
        /* min-w-0 prevents the preview from blowing out its grid cell */
        <div className="flex flex-col gap-2 min-w-0">
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider shrink-0">
                    Live Preview
                </span>
                <span className="text-[11px] text-gray-400 bg-gray-100 rounded-full px-2 py-0.5 truncate">
                    Homepage · Hero
                </span>
            </div>

            {/* browser chrome mock */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10)] min-w-0">
                {/* mock address bar */}
                <div className="bg-gray-100 px-3 py-2 flex items-center gap-2 border-b border-gray-200">
                    <div className="flex gap-1.5 shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                    </div>
                    <div className="flex-1 min-w-0 bg-white rounded-md px-2.5 py-1 text-[10px] text-gray-400 font-mono truncate">
                        yoursite.com
                    </div>
                </div>

                {/* hero canvas — fixed 16:9 aspect ratio */}
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
                    {/* background layer */}
                    {backgroundImage ? (
                        /* key= forces remount when URL changes — beats browser cache */
                        <img
                            key={backgroundImage}
                            src={backgroundImage}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-600" />
                    )}

                    {/* dark scrim */}
                    <div className="absolute inset-0 bg-black/50" />

                    {/* content layer */}
                    <div className="relative h-full flex flex-col justify-center px-[5%] py-[4%] gap-[2%]">
                        {hasContent ? (
                            <>
                                {subtitle && (
                                    <p className="text-[clamp(7px,1.1vw,11px)] font-semibold text-yellow-400 uppercase tracking-widest leading-none">
                                        {subtitle}
                                    </p>
                                )}
                                {title && (
                                    <h2 className="text-[clamp(10px,1.8vw,18px)] font-bold text-white leading-tight line-clamp-2">
                                        {title}
                                    </h2>
                                )}
                                {description && (
                                    <p className="text-[clamp(7px,1.1vw,11px)] text-white/70 leading-relaxed line-clamp-2">
                                        {description}
                                    </p>
                                )}

                                {(ourServicesButtonText || viewProjectsButtonText) && (
                                    <div className="flex items-center gap-[2%] mt-[1%]">
                                        {ourServicesButtonText && (
                                            <span className="px-[2.5%] py-[1%] text-[clamp(7px,1.05vw,10px)] font-semibold bg-yellow-400 text-gray-900 rounded-[4px] leading-none whitespace-nowrap">
                                                {ourServicesButtonText}
                                            </span>
                                        )}
                                        {viewProjectsButtonText && (
                                            <span className="px-[2.5%] py-[1%] text-[clamp(7px,1.05vw,10px)] font-semibold border border-white/50 text-white rounded-[4px] leading-none whitespace-nowrap">
                                                {viewProjectsButtonText}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {hasStats && (
                                    <div className="flex items-center gap-[4%] mt-[2%] pt-[2%] border-t border-white/10">
                                        {STATS_CONFIG.map(({ key, suffix, label }) =>
                                            form[key] !== "" ? (
                                                <div key={key} className="flex flex-col shrink-0">
                                                    <span className="text-[clamp(8px,1.3vw,13px)] font-bold text-white tabular-nums leading-none">
                                                        {Number(form[key]).toLocaleString()}{suffix}
                                                    </span>
                                                    <span className="text-[clamp(6px,0.9vw,9px)] text-white/50 leading-tight mt-[10%]">
                                                        {label}
                                                    </span>
                                                </div>
                                            ) : null
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-[clamp(8px,1.1vw,11px)] text-white/40 text-center w-full">
                                Start typing to see your hero preview
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <p className="text-[11px] text-gray-400 text-center">
                Preview updates as you edit. Save to publish.
            </p>
        </div>
    );
}
