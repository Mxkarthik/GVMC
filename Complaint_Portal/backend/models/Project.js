const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        location: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true,
            enum: [
                "Residential",
                "Commercial",
                "Industrial",
                "Infrastructure",
            ],
        },

        status: {
            type: String,
            required: true,
            enum: [
                "Completed",
                "Ongoing",
                "Upcoming",
            ],
        },

        clientName: {
            type: String,
        },

        completionDate: {
            type: Date,
        },

        thumbnail: {
            url: String,
            publicId: String,
        },

        images: [
            {
                url: String,
                publicId: String,
            },
        ],

        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Project", projectSchema);