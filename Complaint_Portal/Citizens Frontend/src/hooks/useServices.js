import { useState, useEffect, useCallback } from "react";
import { getAllServices, deleteService } from "../services/serviceService";
import toast from "react-hot-toast";

export const useServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [deleting, setDeleting] = useState(null); // id currently being deleted

    // search / filter / sort state
    const [search, setSearch]   = useState("");
    const [filter, setFilter]   = useState("all");   // "all" | "featured" | "active" | "inactive"
    const [sort, setSort]       = useState("order"); // "order" | "newest" | "oldest" | "alpha"

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllServices();
            setServices(data);
        } catch {
            toast.error("Failed to load services.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const remove = async (id) => {
        setDeleting(id);
        try {
            await deleteService(id);
            setServices((prev) => prev.filter((s) => s._id !== id));
            toast.success("Service deleted.");
        } catch {
            toast.error("Failed to delete service.");
        } finally {
            setDeleting(null);
        }
    };

    // client-side filtering + sorting
    const processed = services
        .filter((s) => {
            const q = search.toLowerCase();
            const matchSearch = !q ||
                s.title?.toLowerCase().includes(q) ||
                s.shortDescription?.toLowerCase().includes(q);
            const matchFilter =
                filter === "all"      ? true :
                filter === "featured" ? s.isFeatured === true :
                filter === "active"   ? s.isActive   === true :
                filter === "inactive" ? s.isActive   === false :
                true;
            return matchSearch && matchFilter;
        })
        .sort((a, b) => {
            if (sort === "order")  return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
            if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
            if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
            if (sort === "alpha")  return a.title.localeCompare(b.title);
            return 0;
        });

    return {
        services: processed,
        total: services.length,
        loading, deleting,
        search, setSearch,
        filter, setFilter,
        sort, setSort,
        remove, reload: load,
    };
};
