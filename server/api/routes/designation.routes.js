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

// the base route is /api/designations

/**
 * @route POST /api/designations
 * @desc Create a new designation
 * @body {Object} designation - Designation object with name property
 * @body {string} designation.name - Designation name (required)
 * @returns {Object} 201 - Created designation object
 * @returns {Object} 400 - Bad request (validation error or duplicate name)
 */
router.post("/", DesignationController.createDesignation);

/**
 * @route GET /api/designations
 * @desc Get all designations (supports pagination)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Number of records per page (default: 10)
 * @returns {Object} 200 - List of designations with pagination info
 * @returns {Object} 500 - Internal server error
 */
router.get("/", DesignationController.getAllDesignations);

/**
 * @route GET /api/designations/search
 * @desc Search designations by name (partial match, case-insensitive)
 * @query {string} q - Search term for designation name (required)
 * @returns {Object} 200 - List of matching designations
 * @returns {Object} 400 - Bad request (search term required)
 * @returns {Object} 500 - Internal server error
 */
router.get("/search", DesignationController.searchDesignations);

/**
 * @route GET /api/designations/sorted
 * @desc Get all designations sorted by name (for dropdown lists)
 * @returns {Object} 200 - List of designations sorted by name
 * @returns {Object} 500 - Internal server error
 */
router.get("/sorted", DesignationController.getAllDesignationsSorted);

/**
 * @route GET /api/designations/count
 * @desc Get total count of designations
 * @returns {Object} 200 - Designations count
 * @returns {Object} 500 - Internal server error
 */
router.get("/count", DesignationController.getDesignationsCount);

/**
 * @route GET /api/designations/:id
 * @desc Get a specific designation by ID
 * @param {string} id - Designation UUID
 * @returns {Object} 200 - Designation object
 * @returns {Object} 400 - Bad request (invalid UUID)
 * @returns {Object} 404 - Designation not found
 * @returns {Object} 500 - Internal server error
 */
router.get("/:id", DesignationController.getDesignationById);

/**
 * @route PUT /api/designations/:id
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
 * @route DELETE /api/designations/:id
 * @desc Delete a designation by ID
 * @param {string} id - Designation UUID
 * @returns {Object} 200 - Deletion success message
 * @returns {Object} 400 - Bad request (invalid UUID)
 * @returns {Object} 404 - Designation not found
 * @returns {Object} 500 - Internal server error
 */
router.delete("/:id", DesignationController.deleteDesignation);

module.exports = router;
