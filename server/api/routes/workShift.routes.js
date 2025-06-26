const express = require("express");
const router = express.Router();
const WorkShiftController = require("../controllers/WorkShift.controller");

// Create a new work shift
router.post("/", WorkShiftController.create);

// Get all work shifts (with optional pagination/search)
router.get("/", WorkShiftController.getAll);

// Get work shift by ID
router.get("/:id", WorkShiftController.getById);

// Update a work shift by ID
router.put("/:id", WorkShiftController.update);

// Delete a work shift by ID
router.delete("/:id", WorkShiftController.delete);

// Check overlapping shifts
router.get("/check/overlap", WorkShiftController.checkOverlap);

module.exports = router;
