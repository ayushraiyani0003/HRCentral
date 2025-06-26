const express = require("express");
const router = express.Router();
const EducationLevelController = require("../controllers/EducationLevel.controller");

/**
 * @route POST /api/education-level
 * @desc Create a new education level
 * @access Public
 */
router.post("/", EducationLevelController.create);

/**
 * @route GET /api/education-level
 * @desc Get all education levels (supports pagination)
 * @access Public
 */
router.get("/", EducationLevelController.getAll);

/**
 * @route GET /api/education-level/search
 * @desc Search education levels by query
 * @queryParam {string} q - Search term
 * @access Public
 */
router.get("/search", EducationLevelController.search);

/**
 * @route GET /api/education-level/:id
 * @desc Get a single education level by ID
 * @access Public
 */
router.get("/:id", EducationLevelController.getById);

/**
 * @route PUT /api/education-level/:id
 * @desc Update an existing education level
 * @access Public
 */
router.put("/:id", EducationLevelController.update);

/**
 * @route DELETE /api/education-level/:id
 * @desc Delete an education level by ID
 * @access Public
 */
router.delete("/:id", EducationLevelController.delete);

module.exports = router;
