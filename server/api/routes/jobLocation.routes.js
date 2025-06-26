const express = require("express");
const router = express.Router();
const JobLocationController = require("../controllers/JobLocation.controller");

// Create new job location
router.post("/", JobLocationController.create);

// Get all job locations
router.get("/", JobLocationController.getAll);

// Get job location by ID
router.get("/:id", JobLocationController.getById);

// Update job location by ID
router.put("/:id", JobLocationController.update);

// Delete job location by ID
router.delete("/:id", JobLocationController.delete);

module.exports = router;
