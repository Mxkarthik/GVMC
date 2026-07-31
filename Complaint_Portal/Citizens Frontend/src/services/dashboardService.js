import axios from "axios";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export const getDashboardSummary = async () => {
    const { data } = await axios.get(`${API}/api/dashboard/summary`, {
        withCredentials: true,
    });
    return data.data;
};
