import { useState, useEffect, useCallback } from "react";
import { getHero, updateHero } from "../services/heroService";
import toast from "react-hot-toast";

// Predefined destinations — maps display label to URL value
export const LINK_PRESETS = [
    { label: "Home",     value: "/" },
    { label: "About",    value: "/about" },
    { label: "Services", value: "/services" },
    { label: "Projects", value: "/projects" },
    { label: "Contact",  value: "/contact" },
    { label: "Blog",     value: "/blog" },
    { label: "Custom URL", value: "__custom__" },
];

// Resolve a stored URL back to a preset key (or "__custom__" if no match)
export const resolvePreset = (url) => {
    if (!url) return "";
    const match = LINK_PRESETS.find(
        (p) => p.value !== "__custom__" && p.value === url
    );
    return match ? match.value : "__custom__";
};

const EMPTY = {
    subtitle: "",
    title: "",
    description: "",
    ourServicesButtonText: "",
    ourServicesButtonLink: "",
    viewProjectsButtonText: "",
    viewProjectsButtonLink: "",
    projectsCompleted: "",
    happyClients: "",
    yearsExperience: "",
    clientSatisfaction: "",
    backgroundImage: "",
};

export const useHero = () => {
    const [form, setForm] = useState(EMPTY);
    const [original, setOriginal] = useState(EMPTY);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false); // true while image upload is in flight
    const [errors, setErrors] = useState({});

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const hero = await getHero();
            const values = {
                subtitle:               hero.subtitle               ?? "",
                title:                  hero.title                  ?? "",
                description:            hero.description            ?? "",
                ourServicesButtonText:  hero.ourServicesButtonText  ?? "",
                ourServicesButtonLink:  hero.ourServicesButtonLink  ?? "",
                viewProjectsButtonText: hero.viewProjectsButtonText ?? "",
                viewProjectsButtonLink: hero.viewProjectsButtonLink ?? "",
                projectsCompleted:      hero.projectsCompleted      ?? "",
                happyClients:           hero.happyClients           ?? "",
                yearsExperience:        hero.yearsExperience        ?? "",
                clientSatisfaction:     hero.clientSatisfaction     ?? "",
                backgroundImage:        hero.backgroundImage        ?? "",
            };
            setForm(values);
            setOriginal(values);
        } catch {
            // 404 — hero not seeded yet, empty form is fine
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const setField = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const validate = () => {
        const e = {};

        ["subtitle", "title", "description",
         "ourServicesButtonText", "viewProjectsButtonText",
         "backgroundImage"].forEach((k) => {
            if (!String(form[k]).trim()) e[k] = "This field is required.";
        });

        // Link validation — must be non-empty and if custom must be a full URL
        ["ourServicesButtonLink", "viewProjectsButtonLink"].forEach((k) => {
            if (!form[k].trim()) {
                e[k] = "Please choose a destination.";
            } else if (
                form[k] !== "/" &&
                !/^(\/[^\s]*|https?:\/\/.+)$/.test(form[k])
            ) {
                e[k] = "Must be a page path (/services) or full URL (https://…).";
            }
        });

        const numFields = [
            "projectsCompleted", "happyClients",
            "yearsExperience",   "clientSatisfaction",
        ];
        numFields.forEach((k) => {
            const v = Number(form[k]);
            if (form[k] === "" || isNaN(v) || v < 0) {
                e[k] = "Enter a valid number (0 or above).";
            }
        });

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const save = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            const payload = {
                ...form,
                projectsCompleted:  Number(form.projectsCompleted),
                happyClients:       Number(form.happyClients),
                yearsExperience:    Number(form.yearsExperience),
                clientSatisfaction: Number(form.clientSatisfaction),
            };
            const updated = await updateHero(payload);
            const saved = {
                ...updated,
                projectsCompleted:  updated.projectsCompleted  ?? "",
                happyClients:       updated.happyClients        ?? "",
                yearsExperience:    updated.yearsExperience     ?? "",
                clientSatisfaction: updated.clientSatisfaction  ?? "",
            };
            setOriginal(saved);
            toast.success("Hero content saved successfully.");
        } catch (err) {
            toast.error(err?.response?.data?.message ?? "Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    const reset = () => {
        setForm(original);
        setErrors({});
    };

    return { form, setField, errors, loading, saving, uploading, setUploading, save, reset };
};
