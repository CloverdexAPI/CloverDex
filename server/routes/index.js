const express = require("express");
const router = express.Router();

// different model routers
router.use("/api", require("./api"));

module.exports = router;
