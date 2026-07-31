import axios from "axios";

const API  = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
const BASE = `${API}/api/services`;

// ── image upload (separate endpoint, field name "image") ─────────────────
export const uploadServiceImage = async (file, onProgress) => {
    const fd = new FormData();
    fd.append("image", file);
    const { data } = await axios.post(`${BASE}/upload-image`, fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
            if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
        },
    });
    // { success, imageUrl, publicId }
    return data;
};

// ── reads ─────────────────────────────────────────────────────────────────
export const getAllServices = async () => {
    const { data } = await axios.get(BASE, { withCredentials: true });
    return data.data; // array
};

export const getServiceById = async (id) => {
    const { data } = await axios.get(`${BASE}/${id}`, { withCredentials: true });
    return data.data;
};

// ── writes — JSON body (images already uploaded, only pass URLs) ──────────
export const createService = async (fields) => {
    const { data } = await axios.post(BASE, fields, { withCredentials: true });
    return data.data;
};

export const updateService = async (id, fields) => {
    const { data } = await axios.put(`${BASE}/${id}`, fields, { withCredentials: true });
    return data.data;
};

export const deleteService = async (id) => {
    const { data } = await axios.delete(`${BASE}/${id}`, { withCredentials: true });
    return data;
};
