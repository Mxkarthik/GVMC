import { useEffect, useState } from "react";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import axios from "axios";
import { HiOutlineBars3, HiOutlineSquares2X2, HiOutlinePhoto, HiOutlineFolderOpen, HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { RiLogoutBoxLine } from "react-icons/ri";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import MobileDrawer from "../components/MobileDrawer";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

const NAV = [
    { to: "/dashboard",           label: "Overview",  icon: HiOutlineSquares2X2,         end: true },
    { to: "/dashboard/hero",      label: "Hero",      icon: HiOutlinePhoto },
    { to: "/dashboard/projects",  label: "Projects",  icon: HiOutlineFolderOpen },
    { to: "/dashboard/services",  label: "Services",  icon: HiOutlineWrenchScrewdriver },
];

// ── mobile top bar (only rendered < lg) ──────────────────────────────────
function MobileTopBar({ user }) {
    const { toggleDrawer } = useSidebar();

    return (
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-100 shrink-0">
            <div className="flex items-center justify-between px-4 h-14">
                {/* hamburger */}
                <button
                    type="button"
                    onClick={toggleDrawer}
                    aria-label="Open navigation menu"
                    aria-expanded="false"
                    className="
                        w-10 h-10 flex items-center justify-center
                        rounded-xl text-gray-600
                        hover:bg-gray-100 hover:text-gray-900
                        transition-colors duration-150
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900
                    "
                >
                    <HiOutlineBars3 className="text-xl" aria-hidden="true" />
                </button>

                {/* brand */}
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                        <span className="text-white text-xs font-black select-none">N</span>
                    </div>
                    <span className="font-semibold text-gray-900 tracking-tight text-sm">NSK ETECH</span>
                </div>

                {/* avatar */}
                {user?.profilePicture ? (
                    <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{user?.name?.[0] ?? "…"}</span>
                    </div>
                )}
            </div>
        </header>
    );
}

// ── desktop sidebar (only rendered >= lg) ────────────────────────────────
function DesktopSidebar({ user, onLogout }) {
    return (
        <aside className="hidden lg:flex w-56 shrink-0 flex-col bg-white border-r border-gray-100">
            {/* logo */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                    <span className="text-white text-sm font-black select-none">N</span>
                </div>
                <span className="font-semibold text-gray-900 tracking-tight">NSK ETECH</span>
            </div>

            {/* nav */}
            <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
                {NAV.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) => `
                            flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                            text-sm font-medium transition-colors duration-150
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900
                            ${isActive
                                ? "bg-gray-900 text-white"
                                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                            }
                        `}
                    >
                        <Icon className="text-base shrink-0" aria-hidden="true" />
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* user + logout */}
            <div className="px-3 py-4 border-t border-gray-100 shrink-0 space-y-1">
                {user && (
                    <div className="flex items-center gap-2.5 px-3 py-2.5">
                        {user.profilePicture ? (
                            <img
                                src={user.profilePicture}
                                alt={user.name}
                                className="w-7 h-7 rounded-full object-cover shrink-0"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                                <span className="text-white text-[10px] font-bold">{user.name?.[0]}</span>
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-gray-900 truncate">{user.name}</p>
                            <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                        </div>
                    </div>
                )}
                <button
                    type="button"
                    onClick={onLogout}
                    className="
                        w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                        text-sm font-medium text-gray-500
                        hover:bg-gray-100 hover:text-gray-900
                        transition-colors duration-150
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900
                        cursor-pointer
                    "
                >
                    <RiLogoutBoxLine className="text-base shrink-0" aria-hidden="true" />
                    Logout
                </button>
            </div>
        </aside>
    );
}

// ── inner shell (needs sidebar context) ──────────────────────────────────
function DashboardShell({ user, onLogout }) {
    return (
        <div className="min-h-screen bg-gray-50/60 flex flex-col">
            {/* mobile top bar */}
            <MobileTopBar user={user} />

            {/* mobile drawer */}
            <MobileDrawer user={user} onLogout={onLogout} />

            {/* body */}
            <div className="flex flex-1 overflow-hidden">
                {/* desktop sidebar */}
                <DesktopSidebar user={user} onLogout={onLogout} />

                {/* page content */}
                <main className="flex-1 overflow-y-auto min-w-0">
                    <Outlet context={{ user }} />
                </main>
            </div>
        </div>
    );
}

// ── exported component ────────────────────────────────────────────────────
export default function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`${API}/auth/me`, { withCredentials: true })
            .then((res) => setUser(res.data.user))
            .catch(() => navigate("/", { replace: true }));
    }, [navigate]);

    const handleLogout = async () => {
        await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
        navigate("/", { replace: true });
    };

    if (!user) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-white">
                <span className="text-sm text-gray-400 animate-pulse">Loading…</span>
            </main>
        );
    }

    return (
        <SidebarProvider>
            <DashboardShell user={user} onLogout={handleLogout} />
        </SidebarProvider>
    );
}
