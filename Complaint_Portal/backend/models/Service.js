const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
    {
        // Display title shown on the portfolio site, e.g. "Residential Construction"
        title: {
            type: String,
            required: true,
            trim: true,
        },

        // One-liner used in cards and meta descriptions — keeps list views scannable
        shortDescription: {
            type: String,
            required: true,
            trim: true,
        },

        // Full marketing copy shown on the service detail page
        fullDescription: {
            type: String,
            required: true,
            trim: true,
        },

        // Icon name or SVG identifier — lets the frontend pick the right icon
        // without storing binary data. e.g. "building", "crane", "blueprint"
        icon: {
            type: String,
            trim: true,
            default: "",
        },

        // Cloudinary URL for the hero/cover image of this service
        coverImage: {
            url:      { type: String, default: "" },
            publicId: { type: String, default: "" },
        },

        // URL-safe identifier generated from title, used for deep-links
        // e.g. /services/residential-construction
        slug: {
            type:     String,
            required: true,
            unique:   true,
            trim:     true,
            lowercase: true,
        },

        // Controls the order services appear in the listing (ASC)
        // Allows admins to reorder without changing titles
        displayOrder: {
            type:    Number,
            default: 0,
        },

        // Pinned to the homepage / hero services section
        isFeatured: {
            type:    Boolean,
            default: false,
        },

        // Soft-visibility toggle — hide a service without deleting it
        isActive: {
            type:    Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for the most common public query: active services in order
serviceSchema.index({ isActive: 1, displayOrder: 1 });

module.exports = mongoose.model("Service", serviceSchema);
