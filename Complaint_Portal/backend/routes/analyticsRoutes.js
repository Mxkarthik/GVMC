const express = require("express");
const authenticate = require('../middleware/authenticate')
const {
    incrementVisitor,
    incrementProjectView,
    getAnalytics,
} = require("../controllers/analyticsController");

const router = express.Router();


router.get("/",authenticate,getAnalytics);

router.post("/visit", incrementVisitor);

router.post("/project-view", incrementProjectView);


module.exports = router;