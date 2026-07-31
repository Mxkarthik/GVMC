import axios from "axios";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
const BASE = `${API}/api/hero`;

export const getHero = async () => {
    const { data } = await axios.get(BASE, { withCredentials: true });
    return data.hero;
};

export const updateHero = async (payload) => {
    const { data } = await axios.put(BASE, payload, { withCredentials: true });
    return data.hero;
};

export const uploadHeroImage = async (file, onProgress) => {
    const form = new FormData();
    form.append("image", file);

    const { data } = await axios.post(`${BASE}/upload-image`, form, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
            if (onProgress && e.total) {
                onProgress(Math.round((e.loaded * 100) / e.total));
            }
        },
    });

    return data.imageUrl;
};
