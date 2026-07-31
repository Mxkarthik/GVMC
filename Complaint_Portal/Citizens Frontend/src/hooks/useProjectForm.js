import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { getProjectById, createProject, updateProject } from "../services/projectService";
import toast from "react-hot-toast";

export const CATEGORIES = ["Residential", "Commercial", "Industrial", "Infrastructure"];
export const STATUSES   = ["Completed", "Ongoing", "Upcoming"];

const EMPTY = {
    title: "",
    description: "",
    location: "",
    category: "",
    status: "",
    clientName: "",
    completionDate: "",
    isFeatured: false,
};

export const useProjectForm = (id) => {
    const isEdit = Boolean(id);
    const location = useLocation();

    const [form, setFormState]              = useState(EMPTY);
    const [original, setOriginal]           = useState(EMPTY);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    // Pre-populate thumbnailUrl from navigation state (passed when redirecting
    // from /new to /edit after first save) so the preview doesn't go blank
    // while the GET /api/projects/:id fetch is in flight.
    const [thumbnailUrl, setThumbnailUrl]   = useState(
        location.state?.thumbnailUrl ?? ""
    );
    const [galleryFiles, setGalleryFiles]   = useState([]);
    const [galleryUrls, setGalleryUrls]     = useState([]);
    const [loading, setLoading]             = useState(isEdit);
    const [saving, setSaving]               = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errors, setErrors]               = useState({});

    const load = useCallback(async () => {
        if (!isEdit) { setLoading(false); return; }
        setLoading(true);
        try {
            const project = await getProjectById(id);
            const values = {
                title:          project.title          ?? "",
                description:    project.description    ?? "",
                location:       project.location       ?? "",
                category:       project.category       ?? "",
                status:         project.status         ?? "",
                clientName:     project.clientName     ?? "",
                completionDate: project.completionDate
                    ? project.completionDate.split("T")[0]
                    : "",
                isFeatured: project.isFeatured ?? false,
            };
            setFormState(values);
            setOriginal(values);
            setThumbnailUrl(project.thumbnail?.url ?? "");
            setGalleryUrls(project.images ?? []);
        } catch {
            toast.error("Failed to load project.");
        } finally {
            setLoading(false);
        }
    }, [id, isEdit]);

    useEffect(() => { load(); }, [load]);

    const setField = (name, value) => {
        setFormState((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const validate = () => {
        const e = {};
        if (!form.title.trim())       e.title       = "Title is required.";
        if (!form.description.trim()) e.description = "Description is required.";
        if (!form.location.trim())    e.location    = "Location is required.";
        if (!form.category)           e.category    = "Category is required.";
        if (!form.status)             e.status      = "Status is required.";
        if (!thumbnailUrl && !thumbnailFile) e.thumbnail = "Thumbnail is required.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const save = async () => {
        if (!validate()) return false;
        setSaving(true);
        setUploadProgress(0);
        try {
            const saved = isEdit
                ? await updateProject(id, form, thumbnailFile, galleryFiles, setUploadProgress)
                : await createProject(form, thumbnailFile, galleryFiles, setUploadProgress);

            // update local state from server response
            setThumbnailUrl(saved.thumbnail?.url ?? "");
            setGalleryUrls(saved.images ?? []);
            setThumbnailFile(null);
            setGalleryFiles([]);
            const next = {
                title:          saved.title          ?? "",
                description:    saved.description    ?? "",
                location:       saved.location       ?? "",
                category:       saved.category       ?? "",
                status:         saved.status         ?? "",
                clientName:     saved.clientName     ?? "",
                completionDate: saved.completionDate
                    ? saved.completionDate.split("T")[0]
                    : "",
                isFeatured: saved.isFeatured ?? false,
            };
            setFormState(next);
            setOriginal(next);
            toast.success(isEdit ? "Project updated." : "Project created.");
            return saved;
        } catch (err) {
            toast.error(err?.response?.data?.message ?? "Failed to save project.");
            return false;
        } finally {
            setSaving(false);
            setUploadProgress(0);
        }
    };

    const reset = () => {
        setFormState(original);
        setThumbnailFile(null);
        setGalleryFiles([]);
        setErrors({});
    };

    const addGalleryFiles = (files) => {
        const valid = files.filter(
            (f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024
        );
        setGalleryFiles((prev) => [...prev, ...valid].slice(0, 10));
    };

    const removeGalleryFile = (idx) =>
        setGalleryFiles((prev) => prev.filter((_, i) => i !== idx));

    return {
        form, setField, errors,
        thumbnailFile, setThumbnailFile,
        thumbnailUrl, setThumbnailUrl,
        galleryFiles, galleryUrls,
        addGalleryFiles, removeGalleryFile,
        loading, saving, uploadProgress,
        save, reset, isEdit,
    };
};
