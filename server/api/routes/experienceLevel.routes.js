const express = require("express");
const router = express.Router();
const experienceLevelController = require("../controllers/ExperienceLevel.controller"); // Adjust path as needed

/**
 * @route   POST /api/experience-levels
 * @desc    Create a new experience level
 * @access  Private
 * @body    {Object} req.body - Request body
 * @body    {string} req.body.name - Name of the experience level (required)
 * @returns {Object} 201 - Created experience level object
 * @returns {Object} 400 - Bad request error (validation failed)
 * @example
 * // Request body:
 * {
 *   "name": "Senior"
 * }
 *
 * // Response (201):
 * {
 *   "success": true,
 *   "data": {
 *     "id": "123",
 *     "name": "Senior",
 *     "createdAt": "2024-01-01T00:00:00.000Z"
 *   },
 *   "message": "Experience level created successfully"
 * }
 */
router.post("/", experienceLevelController.create);

/**
 * @route   GET /api/experience-levels
 * @desc    Get all experience levels
 * @access  Public
 * @returns {Object} 200 - Array of experience levels
 * @returns {Object} 500 - Internal server error
 * @example
 * // GET /api/experience-levels
 * // Response (200):
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "123",
 *       "name": "Senior",
 *       "createdAt": "2024-01-01T00:00:00.000Z"
 *     }
 *   ],
 *   "message": "Experience levels retrieved successfully"
 * }
 */
router.get("/", experienceLevelController.getAll);

/**
 * @route   GET /api/experience-levels/:id
 * @desc    Get a specific experience level by ID
 * @access  Public
 * @param   {string} id - Experience level ID (required)
 * @returns {Object} 200 - Experience level object
 * @returns {Object} 400 - Bad request error (ID is required)
 * @returns {Object} 404 - Experience level not found
 * @example
 * // GET /api/experience-levels/123
 * // Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "id": "123",
 *     "name": "Senior",
 *     "createdAt": "2024-01-01T00:00:00.000Z"
 *   },
 *   "message": "Experience level retrieved successfully"
 * }
 */
router.get("/:id", experienceLevelController.getById);

/**
 * @route   PUT /api/experience-levels/:id
 * @desc    Update an existing experience level by ID
 * @access  Private
 * @param   {string} id - Experience level ID (required)
 * @body    {Object} req.body - Request body
 * @body    {string} req.body.name - Updated name of the experience level (required)
 * @returns {Object} 200 - Updated experience level object
 * @returns {Object} 400 - Bad request error (validation failed or ID required)
 * @returns {Object} 404 - Experience level not found
 * @example
 * // PUT /api/experience-levels/123
 * // Request body:
 * {
 *   "name": "Senior Developer"
 * }
 *
 * // Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "id": "123",
 *     "name": "Senior Developer",
 *     "updatedAt": "2024-01-01T00:00:00.000Z"
 *   },
 *   "message": "Experience level updated successfully"
 * }
 */
router.put("/:id", experienceLevelController.update);

/**
 * @route   DELETE /api/experience-levels/:id
 * @desc    Delete an experience level by ID
 * @access  Private
 * @param   {string} id - Experience level ID to delete (required)
 * @returns {Object} 200 - Deletion confirmation message
 * @returns {Object} 400 - Bad request error (ID is required)
 * @returns {Object} 404 - Experience level not found
 * @example
 * // DELETE /api/experience-levels/123
 * // Response (200):
 * {
 *   "success": true,
 *   "message": "Experience level deleted successfully"
 * }
 */
router.delete("/:id", experienceLevelController.delete);

module.exports = router;
