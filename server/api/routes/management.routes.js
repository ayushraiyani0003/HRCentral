/**
 * ManagementRoutes - Express router for managing management records.
 * Defines RESTful API routes for creating, reading, updating, and deleting management records.
 */

const express = require("express");
const router = express.Router();
const ManagementController = require("../controllers/Management.controller");

/**
 * @route POST /api/management
 * @desc Create a new management record
 * @access Public
 * @param {Object} req.body - Request body containing management data
 * @param {string} req.body.name - Name of the management record
 * @returns {Object} 201 - Created management record object
 * @returns {Object} 400 - Bad request error
 * @returns {Object} 500 - Internal server error
 */
router.post("/", ManagementController.create);

/**
 * @route GET /api/management
 * @desc Get all management records ordered by name
 * @access Public
 * @returns {Object} 200 - List of management records
 * @returns {Object} 500 - Internal server error
 */
router.get("/", ManagementController.getAll);

/**
 * @route GET /api/management/:id
 * @desc Get a specific management record by ID
 * @access Public
 * @param {string} req.params.id - UUID of the management record
 * @returns {Object} 200 - Management record object
 * @returns {Object} 404 - Not found
 * @returns {Object} 400 - Bad request (Invalid UUID)
 * @returns {Object} 500 - Internal server error
 */
router.get("/:id", ManagementController.getById);

/**
 * @route PUT /api/management/:id
 * @desc Update a management record by ID
 * @access Public
 * @param {string} req.params.id - UUID of the management record to update
 * @param {Object} req.body - Updated management record data
 * @param {string} req.body.name - Updated name
 * @returns {Object} 200 - Updated management record object
 * @returns {Object} 400 - Bad request
 * @returns {Object} 404 - Not found
 * @returns {Object} 409 - Conflict (name already exists)
 * @returns {Object} 500 - Internal server error
 */
router.put("/:id", ManagementController.update);

/**
 * @route DELETE /api/management/:id
 * @desc Delete a management record by ID
 * @access Public
 * @param {string} req.params.id - UUID of the management record to delete
 * @returns {Object} 200 - Success message
 * @returns {Object} 404 - Not found
 * @returns {Object} 400 - Bad request (Invalid UUID)
 * @returns {Object} 500 - Internal server error
 */
router.delete("/:id", ManagementController.delete);

module.exports = router;
