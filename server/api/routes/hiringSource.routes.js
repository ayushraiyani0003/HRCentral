/**
 * HiringSourceRoutes - Express router for managing hiring sources.
 * Defines RESTful API routes for creating, reading, updating, and deleting hiring source records.
 */

const express = require("express");
const router = express.Router();
const HiringSourceController = require("../controllers/HiringSource.controller");

/**
 * @route POST /api/hiring-sources
 * @desc Create a new hiring source
 * @access Public
 * @param {Object} req.body - Request body containing hiring source data
 * @param {string} req.body.name - Name of the hiring source
 * @returns {Object} 201 - Created hiring source object
 * @returns {Object} 400 - Bad request error
 * @returns {Object} 500 - Internal server error
 * @example
 * // Request body:
 * {
 *   "name": "LinkedIn"
 * }
 *
 * // Response:
 * {
 *   "success": true,
 *   "data": {
 *     "id": 1,
 *     "name": "LinkedIn"
 *   }
 * }
 */
router.post("/", HiringSourceController.create);

/**
 * @route GET /api/hiring-sources
 * @desc Get all hiring sources with optional pagination and search
 * @access Public
 * @param {number} [req.query.limit=10] - Maximum number of records to return
 * @param {number} [req.query.offset=0] - Number of records to skip
 * @param {string} [req.query.search=""] - Search term to filter by name
 * @returns {Object} 200 - List of hiring sources
 * @returns {Object} 500 - Internal server error
 * @example
 * // Request: GET /api/hiring-sources?limit=5&offset=0&search=linkedin
 *
 * // Response:
 * {
 *   "success": true,
 *   "data": [
 *     { "id": 1, "name": "LinkedIn" },
 *     { "id": 2, "name": "Indeed" }
 *   ],
 *   "pagination": {
 *     "total": 12,
 *     "limit": 5,
 *     "offset": 0
 *   }
 * }
 */
router.get("/", HiringSourceController.getAll);

/**
 * @route GET /api/hiring-sources/:id
 * @desc Get a specific hiring source by ID
 * @access Public
 * @param {string} req.params.id - Unique identifier of the hiring source
 * @returns {Object} 200 - Hiring source object
 * @returns {Object} 404 - Not found
 * @returns {Object} 500 - Internal server error
 * @example
 * // Request: GET /api/hiring-sources/123
 *
 * // Response:
 * {
 *   "success": true,
 *   "data": {
 *     "id": 123,
 *     "name": "Referral"
 *   }
 * }
 */
router.get("/:id", HiringSourceController.getById);

/**
 * @route PUT /api/hiring-sources/:id
 * @desc Update a hiring source by ID
 * @access Public
 * @param {string} req.params.id - ID of the hiring source to update
 * @param {Object} req.body - Updated hiring source data
 * @param {string} req.body.name - Updated name
 * @returns {Object} 200 - Updated hiring source object
 * @returns {Object} 400 - Bad request
 * @returns {Object} 404 - Not found
 * @returns {Object} 500 - Internal server error
 * @example
 * // Request: PUT /api/hiring-sources/123
 * {
 *   "name": "Updated Name"
 * }
 *
 * // Response:
 * {
 *   "success": true,
 *   "data": {
 *     "id": 123,
 *     "name": "Updated Name"
 *   }
 * }
 */
router.put("/:id", HiringSourceController.update);

/**
 * @route DELETE /api/hiring-sources/:id
 * @desc Delete a hiring source by ID
 * @access Public
 * @param {string} req.params.id - ID of the hiring source to delete
 * @returns {Object} 200 - Success message
 * @returns {Object} 404 - Not found
 * @returns {Object} 500 - Internal server error
 * @example
 * // Request: DELETE /api/hiring-sources/123
 *
 * // Response:
 * {
 *   "success": true,
 *   "message": "Hiring source deleted successfully"
 * }
 */
router.delete("/:id", HiringSourceController.delete);

module.exports = router;
