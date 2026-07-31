const express = require("express");
const authenticate = require("../middleware/authenticate");
const { getDashboardSummary } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/summary", authenticate, getDashboardSummary);

module.exports = router;
