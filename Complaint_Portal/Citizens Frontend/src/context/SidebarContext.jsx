import { createContext, useContext, useState, useCallback } from "react";

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
    const [open, setOpen] = useState(false);
    const openDrawer  = useCallback(() => setOpen(true),  []);
    const closeDrawer = useCallback(() => setOpen(false), []);
    const toggleDrawer = useCallback(() => setOpen((v) => !v), []);
    return (
        <SidebarContext.Provider value={{ open, openDrawer, closeDrawer, toggleDrawer }}>
            {children}
        </SidebarContext.Provider>
    );
}

export const useSidebar = () => {
    const ctx = useContext(SidebarContext);
    if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
    return ctx;
};
