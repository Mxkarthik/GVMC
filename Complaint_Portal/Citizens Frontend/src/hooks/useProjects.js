import { useState, useEffect, useCallback } from "react";
import { getAllProjects, deleteProject } from "../services/projectService";
import toast from "react-hot-toast";

export const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [deleting, setDeleting] = useState(null); // id being deleted

    // search + filter state
    const [search, setSearch]     = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus]     = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllProjects();
            setProjects(data);
        } catch {
            toast.error("Failed to load projects.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const remove = async (id) => {
        setDeleting(id);
        try {
            await deleteProject(id);
            setProjects((prev) => prev.filter((p) => p._id !== id));
            toast.success("Project deleted.");
        } catch {
            toast.error("Failed to delete project.");
        } finally {
            setDeleting(null);
        }
    };

    // client-side filtering
    const filtered = projects.filter((p) => {
        const q = search.toLowerCase();
        const matchSearch = !q ||
            p.title?.toLowerCase().includes(q) ||
            p.location?.toLowerCase().includes(q) ||
            p.clientName?.toLowerCase().includes(q);
        const matchCategory = !category || p.category === category;
        const matchStatus   = !status   || p.status   === status;
        return matchSearch && matchCategory && matchStatus;
    });

    return {
        projects: filtered,
        total: projects.length,
        loading, deleting,
        search, setSearch,
        category, setCategory,
        status, setStatus,
        remove, reload: load,
    };
};
