const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { check, validationResult } = require("express-validator");
const axios = require('axios');
const { sequelize } = require("../db");

// REGISTER user
router.post("/register", async (req, res) => {
  try {
    const { name, email, username, password, elementType} = req.body;
    
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
      elementType
    });

    // Return the newly created user
    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// LOGIN user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user based on the email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, process.env.SECRET, {
      expiresIn: "24h",
    });

    // Return a success message or any other data you need
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// GET user
router.get("/user", authenticateToken, async (req, res) => {
  try {
    // Extract the userId from the authenticated request
    const userId = req.user.userId;

    // Fetch the user from the database
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user's data
    const userData = {
      name: user.name,
      username: user.username,
      email: user.email,
      elementType: user.elementType,
      team: user.team
    };

    return res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Middleware to authenticate the JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
}

//GET pokemon name
router.get('/pokemon/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemonName = response.data.name;
    res.json({ name: pokemonName });
  } catch (error) {
    console.error('Error fetching Pokémon:', error);
    res.status(500).json({ error: 'Failed to fetch Pokémon' });
  }
});


// POST route to add a Pokémon to user's team
router.post("/user/team", authenticateToken, async (req, res) => {
  try {
    // Extract the userId from the authenticated request
    const userId = req.user.userId;

    // Fetch the user from the database
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract the Pokémon details from the request body
    const { name, type } = req.body;

    // Create a new Pokémon object
    const pokemon = {
      name,
      type,
    };

    // Debugging statement - log the value of user.team before parsing
    console.log("user.team before parsing:", typeof user.team);

    // Parse the user.team JSON string to a JavaScript array
    let parsedTeam = [];
    try {
      parsedTeam = JSON.parse(user.team || "[]");
    } catch (error) {
      console.error("Error parsing team array:", error);
    }


    // Debugging statement - log the value of parsedTeam
    console.log("parsedTeam:", parsedTeam);

    // Add the Pokémon object to the user's team array
    parsedTeam.push(pokemon);

    // Convert the updated team array back to a JSON string
    user.team = JSON.stringify(parsedTeam);

    // Save the updated user record
    await user.save();

    // Return a success message along with the serialized user object
    const serializedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      password: user.password,
      elementType: user.elementType,
      team: user.team,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return res.status(200).json({ message: "Pokémon added to team", user: serializedUser });
  } catch (error) {
    console.error("Error adding Pokémon to team:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});








module.exports = router;