const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require("../models");
const { check, validationResult } = require("express-validator");

// REGISTER user
router.post("/register", async (req, res) => {
  try {
    const { name, email, username, password, elementType } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const newUser = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
      elementType,
    });

    // Return the newly created user
    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
