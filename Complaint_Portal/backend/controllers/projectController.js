const Project = require("../models/Project");
const uploadImage = require("../services/uploadServices");
const deleteImage = require("../services/deleteImageService");

const createProject = async (req, res) => {
    const uploadedPublicIds = [];

    try {

        const {
            title,
            description,
            location,
            category,
            status,
            clientName,
            completionDate,
            isFeatured,
        } = req.body;

        const thumbnailFile = req.files?.thumbnail?.[0];
        const galleryFiles = req.files?.images || [];

        let thumbnail = null;

        if (thumbnailFile) {

            thumbnail = await uploadImage(thumbnailFile, {
                folder: "projects/thumbnails",
            });

            uploadedPublicIds.push(thumbnail.publicId);

        }

        const images = await Promise.all(
            galleryFiles.map(async (file) => {

                const image = await uploadImage(file, {
                    folder: "projects/gallery",
                });

                uploadedPublicIds.push(image.publicId);

                return image;

            })
        );

        const project = await Project.create({
            title,
            description,
            location,
            category,
            status,
            clientName,
            completionDate,
            isFeatured,
            thumbnail,
            images,
        });

        return res.status(201).json({
            success: true,
            message: "Project created successfully.",
            data: project,
        });

    } catch (error) {

        await Promise.allSettled(
            uploadedPublicIds.map((publicId) =>
                deleteImage(publicId)
            )
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const getAllProjects = async (req, res) => {
    try {

        const projects = await Project.find().lean();

        return res.status(200).json({
            success: true,
            count: projects.length,
            data: projects,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const getProjectById = async (req, res) => {
    try {

        const { id } = req.params;

        const project = await Project.findById(id).lean();

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: project,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const updateProjectById = async (req, res) => {
    const uploadedPublicIds = [];

    try {

        const { id } = req.params;

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        const oldThumbnail = project.thumbnail;
        const oldImages = [...project.images];

        const {
            title,
            description,
            location,
            category,
            status,
            clientName,
            completionDate,
            isFeatured,
        } = req.body;

        project.title = title;
        project.description = description;
        project.location = location;
        project.category = category;
        project.status = status;
        project.clientName = clientName;
        project.completionDate = completionDate;
        project.isFeatured = isFeatured;

        const thumbnailFile = req.files?.thumbnail?.[0];
        const galleryFiles = req.files?.images || [];

        /*
        ==========================
        Upload New Thumbnail
        ==========================
        */

        if (thumbnailFile) {

            const newThumbnail = await uploadImage(thumbnailFile, {
                folder: "projects/thumbnails",
            });

            uploadedPublicIds.push(newThumbnail.publicId);

            project.thumbnail = newThumbnail;
        }

        /*
        ==========================
        Upload New Gallery
        ==========================
        */

        if (galleryFiles.length > 0) {

            const newImages = await Promise.all(
                galleryFiles.map(async (file) => {

                    const image = await uploadImage(file, {
                        folder: "projects/gallery",
                    });

                    uploadedPublicIds.push(image.publicId);

                    return image;

                })
            );

            project.images = newImages;
        }

        /*
        ==========================
        Save MongoDB
        ==========================
        */

        await project.save();

        /*
        ==========================
        Delete Old Thumbnail
        ==========================
        */

        if (thumbnailFile && oldThumbnail?.publicId) {
            await deleteImage(oldThumbnail.publicId);
        }

        /*
        ==========================
        Delete Old Gallery
        ==========================
        */

        if (galleryFiles.length > 0) {

            await Promise.allSettled(
                oldImages.map((image) =>
                    deleteImage(image.publicId)
                )
            );

        }

        return res.status(200).json({
            success: true,
            message: "Project updated successfully.",
            data: project,
        });

    } catch (error) {

        await Promise.allSettled(
            uploadedPublicIds.map((publicId) =>
                deleteImage(publicId)
            )
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const deleteProjectById = async (req, res) => {
    try {

        const { id } = req.params;

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        if (project.thumbnail?.publicId) {
            await deleteImage(project.thumbnail.publicId);
        }

        await Promise.allSettled(
            project.images.map((image) =>
                deleteImage(image.publicId)
            )
        );

        await project.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully.",
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};


module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProjectById,
    deleteProjectById,
};