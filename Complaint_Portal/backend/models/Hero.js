const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema(
    {
        subtitle: {
            type: String,
            required: true,
            trim: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        ourServicesButtonText: {
            type: String,
            required: true,
            trim: true,
        },

        ourServicesButtonLink: {
            type: String,
            required: true,
            trim: true,
        },

        viewProjectsButtonText: {
            type: String,
            required: true,
            trim: true,
        },

        viewProjectsButtonLink: {
            type: String,
            required: true,
            trim: true,
        },

        projectsCompleted: {
            type: Number,
            required: true,
        },

        happyClients: {
            type: Number,
            required: true,
        },

        yearsExperience: {
            type: Number,
            required: true,
        },

        clientSatisfaction: {
            type: Number,
            required: true,
        },

        backgroundImage: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Hero = mongoose.model("Hero", heroSchema);

module.exports = Hero;