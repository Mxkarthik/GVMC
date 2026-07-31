const express = require("express");
const router = express.Router();

const {
    createProject,
    getAllProjects,
    getProjectById,
    updateProjectById,
    deleteProjectById,
} = require("../controllers/projectController");

const authenticate = require("../middleware/authenticate");
const upload = require("../middleware/upload");

router.post(
    "/",
    authenticate,
    upload.fields([
        {
            name: "thumbnail",
            maxCount: 1,
        },
        {
            name: "images",
            maxCount: 10,
        },
    ]),
    createProject
);

router.get("/", getAllProjects);

router.get("/:id", getProjectById);

router.put(
    "/:id",
    authenticate,
    upload.fields([
        {
            name: "thumbnail",
            maxCount: 1,
        },
        {
            name: "images",
            maxCount: 10,
        },
    ]),
    updateProjectById
);

router.delete(
    "/:id",
    authenticate,
    deleteProjectById
);

module.exports = router;