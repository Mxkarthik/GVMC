import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
    HiOutlineXMark,
    HiOutlineSquares2X2,
    HiOutlinePhoto,
    HiOutlineFolderOpen,
    HiOutlineWrenchScrewdriver,
} from "react-icons/hi2";
import { RiLogoutBoxLine } from "react-icons/ri";
import { useSidebar } from "../context/SidebarContext";

const NAV = [
    { to: "/dashboard",          label: "Overview", icon: HiOutlineSquares2X2, end: true },
    { to: "/dashboard/hero",     label: "Hero",     icon: HiOutlinePhoto },
    { to: "/dashboard/projects", label: "Projects", icon: HiOutlineFolderOpen },
    { to: "/dashboard/services", label: "Services", icon: HiOutlineWrenchScrewdriver },
];

export default function MobileDrawer({ user, onLogout }) {
    const { open, closeDrawer } = useSidebar();
    const firstLinkRef = useRef(null);

    // close on ESC
    useEffect(() => {
        if (!open) return;
        const handler = (e) => { if (e.key === "Escape") closeDrawer(); };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, closeDrawer]);

    // lock body scroll + move focus into drawer when open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
            setTimeout(() => firstLinkRef.current?.focus(), 50);
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    return (
        <>
            {/* backdrop */}
            <div
                aria-hidden="true"
                onClick={closeDrawer}
                className={`
                    fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]
                    transition-opacity duration-300
                    ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
                `}
            />

            {/* drawer panel */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Navigation"
                className={`
                    fixed top-0 left-0 z-50
                    h-full w-72 max-w-[85vw]
                    bg-white border-r border-gray-100
                    flex flex-col
                    shadow-[4px_0_32px_-4px_rgba(0,0,0,0.15)]
                    transition-transform duration-300 ease-out
                    ${open ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shrink-0">
                            <span className="text-white text-sm font-black select-none">N</span>
                        </div>
                        <span className="font-semibold text-gray-900 tracking-tight">NSK ETECH</span>
                    </div>
                    <button
                        type="button"
                        onClick={closeDrawer}
                        aria-label="Close navigation"
                        className="
                            w-9 h-9 flex items-center justify-center rounded-xl text-gray-400
                            hover:bg-gray-100 hover:text-gray-700
                            transition-colors duration-150
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900
                        "
                    >
                        <HiOutlineXMark className="text-xl" aria-hidden="true" />
                    </button>
                </div>

                {/* nav links */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
                    {NAV.map(({ to, label, icon: Icon, end }, idx) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            ref={idx === 0 ? firstLinkRef : undefined}
                            onClick={closeDrawer}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-xl
                                text-sm font-medium transition-colors duration-150
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900
                                ${isActive
                                    ? "bg-gray-900 text-white"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }
                            `}
                        >
                            <Icon className="text-lg shrink-0" aria-hidden="true" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* user + logout */}
                <div className="px-3 py-4 border-t border-gray-100 shrink-0 space-y-2">
                    {user && (
                        <div className="flex items-center gap-3 px-4 py-2.5">
                            {user.profilePicture ? (
                                <img
                                    src={user.profilePicture}
                                    alt={user.name}
                                    className="w-8 h-8 rounded-full object-cover shrink-0"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                                    <span className="text-white text-xs font-bold">{user.name?.[0]}</span>
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => { closeDrawer(); onLogout(); }}
                        className="
                            w-full flex items-center gap-3 px-4 py-3 rounded-xl
                            text-sm font-medium text-gray-600
                            hover:bg-gray-100 hover:text-gray-900
                            transition-colors duration-150
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900
                        "
                    >
                        <RiLogoutBoxLine className="text-lg shrink-0" aria-hidden="true" />
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}
