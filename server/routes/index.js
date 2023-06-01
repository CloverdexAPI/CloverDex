const express = require("express");
const router = express.Router();

// different model routers
router.use("/", require("./api"));

module.exports = router;
