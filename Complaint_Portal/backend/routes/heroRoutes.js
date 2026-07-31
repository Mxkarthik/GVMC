const express = require("express");
const authenticate = require("../middleware/authenticate");
const upload = require("../middleware/upload");
const { updateHero, getHero, uploadHeroImage } = require("../controllers/heroController");

const router = express.Router();

router.get("/", getHero);
router.put("/", authenticate, updateHero);
router.post("/upload-image", authenticate, upload.single("image"), uploadHeroImage);

module.exports = router;
