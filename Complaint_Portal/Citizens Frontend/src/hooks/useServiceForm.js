import { useState, useEffect, useCallback } from "react";
import {
    getServiceById,
    createService,
    updateService,
    uploadServiceImage,
} from "../services/serviceService";
import toast from "react-hot-toast";

const EMPTY = {
    title:            "",
    shortDescription: "",
    fullDescription:  "",
    coverImageUrl:    "",
    coverImagePublicId: "",
    displayOrder:     0,
    isFeatured:       false,
    isActive:         true,
};

/**
 * Hook for the Service create / edit form.
 *
 * Image flow (two-step, matches backend design):
 *  1. User picks a file → stored in coverImageFile state (local preview via blob URL)
 *  2. On save → image is uploaded first via POST /api/services/upload-image
 *  3. Returned {imageUrl, publicId} is merged into the JSON payload for
 *     POST/PUT /api/services (or /:id)
 */
export const useServiceForm = (id) => {
    const isEdit = Boolean(id);

    const [form, setFormState]    = useState(EMPTY);
    const [original, setOriginal] = useState(EMPTY);

    // cover image
    const [coverImageFile, setCoverImageFile]   = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(""); // blob or saved URL

    const [loading, setLoading]       = useState(isEdit);
    const [saving, setSaving]         = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errors, setErrors]         = useState({});

    const load = useCallback(async () => {
        if (!isEdit) { setLoading(false); return; }
        setLoading(true);
        try {
            const s = await getServiceById(id);
            const values = {
                title:              s.title            ?? "",
                shortDescription:   s.shortDescription ?? "",
                fullDescription:    s.fullDescription  ?? "",
                coverImageUrl:      s.coverImage?.url  ?? "",
                coverImagePublicId: s.coverImage?.publicId ?? "",
                displayOrder:       s.displayOrder ?? 0,
                isFeatured:         s.isFeatured   ?? false,
                isActive:           s.isActive     ?? true,
            };
            setFormState(values);
            setOriginal(values);
            setCoverImagePreview(s.coverImage?.url ?? "");
        } catch {
            toast.error("Failed to load service.");
        } finally {
            setLoading(false);
        }
    }, [id, isEdit]);

    useEffect(() => { load(); }, [load]);

    const setField = (name, value) => {
        setFormState((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleCoverImageSelect = (file) => {
        setCoverImageFile(file);
        // show instant local preview
        const blobUrl = URL.createObjectURL(file);
        setCoverImagePreview(blobUrl);
        setErrors((prev) => ({ ...prev, cover: undefined }));
    };

    const handleCoverImageRemove = () => {
        setCoverImageFile(null);
        setCoverImagePreview("");
        setFormState((prev) => ({ ...prev, coverImageUrl: "", coverImagePublicId: "" }));
    };

    const validate = () => {
        const e = {};
        if (!form.title.trim())            e.title            = "Title is required.";
        if (!form.shortDescription.trim()) e.shortDescription = "Short description is required.";
        if (!form.fullDescription.trim())  e.fullDescription  = "Full description is required.";
        if (!coverImagePreview)            e.cover            = "Cover image is required.";
        const ord = Number(form.displayOrder);
        if (isNaN(ord) || ord < 0)        e.displayOrder     = "Display order must be 0 or greater.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const save = async () => {
        if (!validate()) return false;
        setSaving(true);
        setUploadProgress(0);

        try {
            let coverUrl      = form.coverImageUrl;
            let coverPublicId = form.coverImagePublicId;

            // step 1 — upload new image if one was selected
            if (coverImageFile) {
                const res = await uploadServiceImage(coverImageFile, setUploadProgress);
                coverUrl      = res.imageUrl;
                coverPublicId = res.publicId;
            }

            const payload = {
                title:              form.title.trim(),
                shortDescription:   form.shortDescription.trim(),
                fullDescription:    form.fullDescription.trim(),
                coverImageUrl:      coverUrl,
                coverImagePublicId: coverPublicId,
                displayOrder:       Number(form.displayOrder),
                isFeatured:         form.isFeatured,
                isActive:           form.isActive,
            };

            const saved = isEdit
                ? await updateService(id, payload)
                : await createService(payload);

            // sync local state from server response
            const next = {
                title:              saved.title            ?? "",
                shortDescription:   saved.shortDescription ?? "",
                fullDescription:    saved.fullDescription  ?? "",
                coverImageUrl:      saved.coverImage?.url  ?? "",
                coverImagePublicId: saved.coverImage?.publicId ?? "",
                displayOrder:       saved.displayOrder ?? 0,
                isFeatured:         saved.isFeatured   ?? false,
                isActive:           saved.isActive     ?? true,
            };
            setFormState(next);
            setOriginal(next);
            setCoverImageFile(null);
            setCoverImagePreview(saved.coverImage?.url ?? "");

            toast.success(isEdit ? "Service updated." : "Service created.");
            return saved;
        } catch (err) {
            toast.error(err?.response?.data?.message ?? "Failed to save service.");
            return false;
        } finally {
            setSaving(false);
            setUploadProgress(0);
        }
    };

    const reset = () => {
        setFormState(original);
        setCoverImageFile(null);
        setCoverImagePreview(original.coverImageUrl);
        setErrors({});
    };

    return {
        form, setField, errors,
        coverImageFile,
        coverImagePreview,
        handleCoverImageSelect,
        handleCoverImageRemove,
        loading, saving, uploadProgress,
        save, reset, isEdit,
    };
};
