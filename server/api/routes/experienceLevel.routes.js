const express = require("express");
const router = express.Router();
const experienceLevelController = require("../controllers/ExperienceLevel.controller"); // Adjust path as needed

/**
 * @route   POST /api/experience-levels
 * @desc    Create a new experience level
 * @body    { name: string }
 */
router.post("/", experienceLevelController.createExperienceLevel);

/**
 * @route   GET /api/experience-levels
 * @desc    Get all experience levels (with optional search and pagination)
 * @query   limit, offset, search
 */
router.get("/", experienceLevelController.getAllExperienceLevels);

/**
 * @route   GET /api/experience-levels/:id
 * @desc    Get experience level by ID
 */
router.get("/:id", experienceLevelController.getExperienceLevelById);

/**
 * @route   PUT /api/experience-levels/:id
 * @desc    Update experience level by ID
 * @body    { name: string }
 */
router.put("/:id", experienceLevelController.updateExperienceLevel);

/**
 * @route   DELETE /api/experience-levels/:id
 * @desc    Delete experience level by ID
 */
router.delete("/:id", experienceLevelController.deleteExperienceLevel);

module.exports = router;
