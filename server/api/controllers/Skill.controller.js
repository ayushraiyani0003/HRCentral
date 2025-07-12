/**
 * @fileoverview Controller for Skill operations
 * @version 1.0.0
 */

const SkillService = require("../../services/api/Skill.service"); // Adjust path as needed

/**
 * Skill Controller Class
 * Handles HTTP requests for skill operations
 */
class SkillController {
    /**
     * Create a new skill
     * @route POST /api/skills
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async createSkill(req, res) {
        console.log(req.body);
        try {
            const result = await SkillService.create(req.body);

            return res.status(201).json(result);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
                error: "Bad Request",
            });
        }
    }

    /**
     * Get all skills with no pagination or limits
     * @route GET /api/skills
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getAllSkills(req, res) {
        try {
            const result = await SkillService.getAll();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
                error: "Internal Server Error",
            });
        }
    }

    /**
     * Get skill by ID
     * @route GET /api/skills/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getSkillById(req, res) {
        try {
            const { id } = req.params;
            const result = await SkillService.getById(id);
            return res.status(200).json(result);
        } catch (error) {
            const statusCode = error.message.includes("not found")
                ? 404
                : error.message.includes("Invalid UUID")
                ? 400
                : 500;
            return res.status(statusCode).json({
                success: false,
                message: error.message,
                error:
                    statusCode === 404
                        ? "Not Found"
                        : statusCode === 400
                        ? "Bad Request"
                        : "Internal Server Error",
            });
        }
    }

    /**
     * Update skill by ID
     * @route PUT /api/skills/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async updateSkill(req, res) {
        try {
            const { id } = req.params;
            const result = await SkillService.update(id, req.body);
            return res.status(200).json(result);
        } catch (error) {
            const statusCode = error.message.includes("not found")
                ? 404
                : error.message.includes("Invalid UUID")
                ? 400
                : error.message.includes("already exists")
                ? 409
                : 500;
            return res.status(statusCode).json({
                success: false,
                message: error.message,
                error:
                    statusCode === 404
                        ? "Not Found"
                        : statusCode === 400
                        ? "Bad Request"
                        : statusCode === 409
                        ? "Conflict"
                        : "Internal Server Error",
            });
        }
    }

    /**
     * Delete skill by ID
     * @route DELETE /api/skills/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async deleteSkill(req, res) {
        try {
            const { id } = req.params;
            const result = await SkillService.delete(id);
            return res.status(200).json(result);
        } catch (error) {
            const statusCode = error.message.includes("not found")
                ? 404
                : error.message.includes("Invalid UUID")
                ? 400
                : 500;
            return res.status(statusCode).json({
                success: false,
                message: error.message,
                error:
                    statusCode === 404
                        ? "Not Found"
                        : statusCode === 400
                        ? "Bad Request"
                        : "Internal Server Error",
            });
        }
    }
}

module.exports = new SkillController();
