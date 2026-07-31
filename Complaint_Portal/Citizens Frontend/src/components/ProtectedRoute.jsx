import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export default function ProtectedRoute({ children }) {
    const [status, setStatus] = useState("checking"); // "checking" | "ok" | "unauth"

    useEffect(() => {
        axios
            .get(`${API}/auth/me`, { withCredentials: true })
            .then(() => setStatus("ok"))
            .catch(() => setStatus("unauth"));
    }, []);

    if (status === "checking") {
        return (
            <main className="min-h-screen flex items-center justify-center bg-white">
                <span className="text-sm text-gray-400 animate-pulse">Loading…</span>
            </main>
        );
    }

    if (status === "unauth") {
        return <Navigate to="/" replace />;
    }

    return children;
}
