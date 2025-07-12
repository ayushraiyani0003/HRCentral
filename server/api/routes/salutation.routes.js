/**
 * @fileoverview Express routes for SalutationController
 * @version 1.0.0
 */

const express = require("express");
const router = express.Router();
const SalutationController = require("../controllers/Salutation.controller"); // Adjust path as necessary

// ==============================
// Routes for Salutation Management
// ==============================

// the base route is /api/salutation

/**
 * @route POST /api/salutation
 * @desc Create a new salutation
 * @body {Object} salutation - Salutation object with name property
 * @body {string} salutation.name - Salutation name (required, max 100 characters)
 * @returns {Object} 201 - Created salutation object
 * @returns {Object} 400 - Bad request (validation error)
 * @returns {Object} 409 - Conflict (name already exists)
 */
router.post("/", SalutationController.createSalutation);

/**
 * @route GET /api/salutation
 * @returns {Object} 200 - List of salutations with pagination info
 * @returns {Object} 400 - Bad request (invalid parameters)
 * @returns {Object} 500 - Internal server error
 */
router.get("/", SalutationController.getAllSalutations);

/**
 * @route GET /api/salutation/:id
 * @desc Get a specific salutation by ID
 * @param {string} id - Salutation UUID
 * @returns {Object} 200 - Salutation object
 * @returns {Object} 400 - Bad request (invalid UUID)
 * @returns {Object} 404 - Salutation not found
 * @returns {Object} 500 - Internal server error
 */
router.get("/:id", SalutationController.getSalutationById);

/**
 * @route PUT /api/salutation/:id
 * @desc Update a salutation by ID
 * @param {string} id - Salutation UUID
 * @body {Object} salutation - Salutation object with updated data
 * @body {string} salutation.name - Salutation name (required, max 100 characters)
 * @returns {Object} 200 - Updated salutation object
 * @returns {Object} 400 - Bad request (validation error or invalid UUID)
 * @returns {Object} 404 - Salutation not found
 * @returns {Object} 409 - Conflict (name already exists)
 * @returns {Object} 500 - Internal server error
 */
router.put("/:id", SalutationController.updateSalutation);

/**
 * @route DELETE /api/salutation/:id
 * @desc Delete a salutation by ID
 * @param {string} id - Salutation UUID
 * @returns {Object} 200 - Deletion success message
 * @returns {Object} 400 - Bad request (invalid UUID)
 * @returns {Object} 404 - Salutation not found
 * @returns {Object} 500 - Internal server error
 */
router.delete("/:id", SalutationController.deleteSalutation);

module.exports = router;
