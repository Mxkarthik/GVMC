const Service     = require("../models/Service");
const uploadImage = require("../services/uploadServices");
const deleteImage = require("../services/deleteImageService");

// ── slug helpers ─────────────────────────────────────────────────────────

const slugify = (text) =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

/**
 * Generate a unique slug.
 * If "residential-construction" exists, tries "residential-construction-2",
 * "residential-construction-3", … until a free slot is found.
 */
const generateUniqueSlug = async (title, excludeId = null) => {
    const base = slugify(title);
    let slug    = base;
    let counter = 2;

    while (true) {
        const query = { slug };
        if (excludeId) query._id = { $ne: excludeId };

        const existing = await Service.findOne(query).lean();
        if (!existing) break;

        slug = `${base}-${counter}`;
        counter++;
    }

    return slug;
};

// ── upload image ─────────────────────────────────────────────────────────

const uploadServiceImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file provided.",
            });
        }

        const result = await uploadImage(req.file, {
            folder: "services",
        });

        return res.status(200).json({
            success:  true,
            message:  "Image uploaded successfully.",
            imageUrl: result.url,
            publicId: result.publicId,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ── get all services ─────────────────────────────────────────────────────

const getAllServices = async (req, res) => {
    try {
        const services = await Service
            .find()
            .sort({ displayOrder: 1, createdAt: 1 })
            .lean();

        return res.status(200).json({
            success: true,
            count:   services.length,
            data:    services,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ── get service by id ─────────────────────────────────────────────────────

const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findById(id).lean();

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data:    service,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ── create service ────────────────────────────────────────────────────────

const createService = async (req, res) => {
    try {
        const {
            title,
            shortDescription,
            fullDescription,
            icon,
            coverImageUrl,
            coverImagePublicId,
            slug: rawSlug,
            displayOrder,
            isFeatured,
            isActive,
        } = req.body;

        const slug = rawSlug
            ? await generateUniqueSlug(rawSlug)
            : await generateUniqueSlug(title);

        const service = await Service.create({
            title,
            shortDescription,
            fullDescription,
            icon:         icon         || "",
            coverImage: {
                url:      coverImageUrl       || "",
                publicId: coverImagePublicId  || "",
            },
            slug,
            displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
            isFeatured:   isFeatured === true || isFeatured === "true",
            isActive:     isActive   === false || isActive === "false" ? false : true,
        });

        return res.status(201).json({
            success: true,
            message: "Service created successfully.",
            data:    service,
        });
    } catch (error) {
        // Duplicate slug guard (race condition fallback)
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "A service with this slug already exists.",
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ── update service ────────────────────────────────────────────────────────

const updateService = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found.",
            });
        }

        const {
            title,
            shortDescription,
            fullDescription,
            icon,
            coverImageUrl,
            coverImagePublicId,
            slug: rawSlug,
            displayOrder,
            isFeatured,
            isActive,
        } = req.body;

        // Re-generate slug only if the title changed and no custom slug provided
        let slug = service.slug;
        if (rawSlug && rawSlug !== service.slug) {
            slug = await generateUniqueSlug(rawSlug, id);
        } else if (title && title !== service.title && !rawSlug) {
            slug = await generateUniqueSlug(title, id);
        }

        const oldCoverPublicId = service.coverImage?.publicId;

        service.title            = title            ?? service.title;
        service.shortDescription = shortDescription ?? service.shortDescription;
        service.fullDescription  = fullDescription  ?? service.fullDescription;
        service.icon             = icon             !== undefined ? icon : service.icon;
        service.slug             = slug;
        service.displayOrder     = displayOrder !== undefined ? Number(displayOrder) : service.displayOrder;
        service.isFeatured       = isFeatured   !== undefined
            ? (isFeatured === true || isFeatured === "true")
            : service.isFeatured;
        service.isActive         = isActive !== undefined
            ? (isActive === true || isActive === "true")
            : service.isActive;

        // Update cover image only when a new URL was provided
        if (coverImageUrl !== undefined) {
            service.coverImage = {
                url:      coverImageUrl      || "",
                publicId: coverImagePublicId || "",
            };
        }

        await service.save();

        // Delete old Cloudinary asset when a new image replaced it
        if (
            coverImageUrl !== undefined &&
            coverImageUrl !== oldCoverPublicId &&
            oldCoverPublicId
        ) {
            await deleteImage(oldCoverPublicId).catch(() => {});
        }

        return res.status(200).json({
            success: true,
            message: "Service updated successfully.",
            data:    service,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "A service with this slug already exists.",
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ── delete service ────────────────────────────────────────────────────────

const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found.",
            });
        }

        if (service.coverImage?.publicId) {
            await deleteImage(service.coverImage.publicId).catch(() => {});
        }

        await service.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Service deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    uploadServiceImage,
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
};
