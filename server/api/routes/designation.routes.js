/**
 * @fileoverview Express routes for DesignationController
 * @version 1.0.0
 */

const express = require("express");
const router = express.Router();
const DesignationController = require("../controllers/Designation.controller"); // Adjust path as necessary

// ==============================
// Routes for Designation Management
// ==============================

// the base route is /api/designation

/**
 * @route POST /api/designation
 * @desc Create a new designation
 * @body {Object} designation - Designation object with name property
 * @body {string} designation.name - Designation name (required)
 * @returns {Object} 201 - Created designation object
 * @returns {Object} 400 - Bad request (validation error or duplicate name)
 */
router.post("/", DesignationController.createDesignation);

/**
 * @route GET /api/designation
 * @desc Get all designation
 * @returns {Object} 200 - List of designation with pagination info
 * @returns {Object} 500 - Internal server error
 */
router.get("/", DesignationController.getAllDesignations);

/**
 * @route GET /api/designation/:id
 * @desc Get a specific designation by ID
 * @param {string} id - Designation UUID
 * @returns {Object} 200 - Designation object
 * @returns {Object} 400 - Bad request (invalid UUID)
 * @returns {Object} 404 - Designation not found
 * @returns {Object} 500 - Internal server error
 */
router.get("/:id", DesignationController.getDesignationById);

/**
 * @route PUT /api/designation/:id
 * @desc Update a designation by ID
 * @param {string} id - Designation UUID
 * @body {Object} designation - Designation object with updated data
 * @body {string} designation.name - Designation name (required)
 * @returns {Object} 200 - Updated designation object
 * @returns {Object} 400 - Bad request (validation error or invalid UUID)
 * @returns {Object} 404 - Designation not found
 * @returns {Object} 409 - Conflict (name already exists)
 * @returns {Object} 500 - Internal server error
 */
router.put("/:id", DesignationController.updateDesignation);

/**
 * @route DELETE /api/designation/:id
 * @desc Delete a designation by ID
 * @param {string} id - Designation UUID
 * @returns {Object} 200 - Deletion success message
 * @returns {Object} 400 - Bad request (invalid UUID)
 * @returns {Object} 404 - Designation not found
 * @returns {Object} 500 - Internal server error
 */
router.delete("/:id", DesignationController.deleteDesignation);

module.exports = router;
