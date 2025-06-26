/**
 * SkillRoutes - Express router for skill management endpoints
 * Defines RESTful API routes for CRUD operations and bulk operations on skills
 */

const express = require("express");
const router = express.Router();
const skillController = require("../controllers/Skill.controller"); // Adjust the path if needed

/**
 * @route POST /api/skills
 * @desc Create a new skill
 * @access Public
 * @param {Object} req.body - Request body containing skill data
 * @param {string} req.body.name - Name of the skill to create
 * @returns {Object} 201 - Created skill object
 * @returns {Object} 400 - Bad request error
 * @returns {Object} 500 - Internal server error
 * @example
 * // Request body:
 * {
 *   "name": "JavaScript"
 * }
 *
 * // Response:
 * {
 *   "success": true,
 *   "data": {
 *     "id": 1,
 *     "name": "JavaScript"
 *   }
 * }
 */
router.post("/", skillController.createSkill);

/**
 * @route GET /api/skills
 * @desc Get all skills with optional pagination and search
 * @access Public
 * @param {number} [req.query.limit=10] - Maximum number of skills to return
 * @param {number} [req.query.offset=0] - Number of skills to skip
 * @param {string} [req.query.search=""] - Search term to filter skills by name
 * @returns {Object} 200 - Array of skills with pagination info
 * @returns {Object} 500 - Internal server error
 * @example
 * // Request: GET /api/skills?limit=5&offset=10&search=java
 *
 * // Response:
 * {
 *   "success": true,
 *   "data": [
 *     { "id": 1, "name": "JavaScript" },
 *     { "id": 2, "name": "Java" }
 *   ],
 *   "pagination": {
 *     "total": 25,
 *     "limit": 5,
 *     "offset": 10
 *   }
 * }
 */
router.get("/", skillController.getAllSkills);

/**
 * @route GET /api/skills/:id
 * @desc Get a specific skill by ID
 * @access Public
 * @param {string} req.params.id - Unique identifier of the skill
 * @returns {Object} 200 - Skill object
 * @returns {Object} 404 - Skill not found
 * @returns {Object} 500 - Internal server error
 * @example
 * // Request: GET /api/skills/123
 *
 * // Response:
 * {
 *   "success": true,
 *   "data": {
 *     "id": 123,
 *     "name": "React"
 *   }
 * }
 */
router.get("/:id", skillController.getSkillById);

/**
 * @route PUT /api/skills/:id
 * @desc Update a skill by ID
 * @access Public
 * @param {string} req.params.id - Unique identifier of the skill to update
 * @param {Object} req.body - Request body containing updated skill data
 * @param {string} req.body.name - Updated name of the skill
 * @returns {Object} 200 - Updated skill object
 * @returns {Object} 400 - Bad request error
 * @returns {Object} 404 - Skill not found
 * @returns {Object} 500 - Internal server error
 * @example
 * // Request: PUT /api/skills/123
 * // Request body:
 * {
 *   "name": "React.js"
 * }
 *
 * // Response:
 * {
 *   "success": true,
 *   "data": {
 *     "id": 123,
 *     "name": "React.js"
 *   }
 * }
 */
router.put("/:id", skillController.updateSkill);

/**
 * @route DELETE /api/skills/:id
 * @desc Delete a skill by ID
 * @access Public
 * @param {string} req.params.id - Unique identifier of the skill to delete
 * @returns {Object} 200 - Success message
 * @returns {Object} 404 - Skill not found
 * @returns {Object} 500 - Internal server error
 * @example
 * // Request: DELETE /api/skills/123
 *
 * // Response:
 * {
 *   "success": true,
 *   "message": "Skill deleted successfully"
 * }
 */
router.delete("/:id", skillController.deleteSkill);

/**
 * @route POST /api/skills/bulk
 * @desc Bulk create multiple skills
 * @access Public
 * @param {Array<Object>} req.body - Array of skill objects to create
 * @param {string} req.body[].name - Name of each skill to create
 * @returns {Object} 201 - Array of created skills
 * @returns {Object} 400 - Bad request error (invalid array or validation errors)
 * @returns {Object} 500 - Internal server error
 * @example
 * // Request body:
 * [
 *   { "name": "HTML" },
 *   { "name": "CSS" },
 *   { "name": "JavaScript" }
 * ]
 *
 * // Response:
 * {
 *   "success": true,
 *   "data": [
 *     { "id": 1, "name": "HTML" },
 *     { "id": 2, "name": "CSS" },
 *     { "id": 3, "name": "JavaScript" }
 *   ],
 *   "created": 3,
 *   "failed": 0
 * }
 */
router.post("/bulk", skillController.bulkCreateSkills);

module.exports = router;
