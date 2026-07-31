const express    = require("express");
const authenticate = require("../middleware/authenticate");
const upload     = require("../middleware/upload");
const {
    uploadServiceImage,
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
} = require("../controllers/serviceController");

const router = express.Router();

// Image upload — authenticated, single file, field name "image"
router.post("/upload-image", authenticate, upload.single("image"), uploadServiceImage);

// Public reads
router.get("/",    getAllServices);
router.get("/:id", getServiceById);

// Authenticated writes
router.post("/",    authenticate, createService);
router.put("/:id",  authenticate, updateService);
router.delete("/:id", authenticate, deleteService);

module.exports = router;
