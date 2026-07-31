import axios from "axios";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
const BASE = `${API}/api/projects`;

export const getAllProjects = async () => {
    const { data } = await axios.get(BASE, { withCredentials: true });
    return data.data; // array
};

export const getProjectById = async (id) => {
    const { data } = await axios.get(`${BASE}/${id}`, { withCredentials: true });
    return data.data;
};

/**
 * Build a FormData payload from the project form state.
 * thumbnailFile  — File object or null
 * galleryFiles   — File[] (new files to append to gallery)
 */
const buildFormData = (fields, thumbnailFile, galleryFiles = []) => {
    const fd = new FormData();

    const textFields = [
        "title", "description", "location",
        "category", "status", "clientName",
        "completionDate", "isFeatured",
    ];
    textFields.forEach((k) => {
        if (fields[k] !== undefined && fields[k] !== null) {
            fd.append(k, fields[k]);
        }
    });

    if (thumbnailFile) fd.append("thumbnail", thumbnailFile);
    galleryFiles.forEach((f) => fd.append("images", f));

    return fd;
};

export const createProject = async (fields, thumbnailFile, galleryFiles, onProgress) => {
    const fd = buildFormData(fields, thumbnailFile, galleryFiles);
    const { data } = await axios.post(BASE, fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
            if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
        },
    });
    return data.data;
};

export const updateProject = async (id, fields, thumbnailFile, galleryFiles, onProgress) => {
    const fd = buildFormData(fields, thumbnailFile, galleryFiles);
    const { data } = await axios.put(`${BASE}/${id}`, fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
            if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
        },
    });
    return data.data;
};

export const deleteProject = async (id) => {
    const { data } = await axios.delete(`${BASE}/${id}`, { withCredentials: true });
    return data;
};
