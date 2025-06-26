const express = require("express");
const router = express.Router();
const HiringSourceController = require("../controllers/HiringSource.controller");

// Create a new hiring source
router.post("/", HiringSourceController.create);

// Get all hiring sources with pagination and optional search
router.get("/", HiringSourceController.getAll);

// Get a single hiring source by ID
router.get("/:id", HiringSourceController.getById);

// Update a hiring source by ID
router.put("/:id", HiringSourceController.update);

// Delete a hiring source by ID
router.delete("/:id", HiringSourceController.delete);

module.exports = router;
