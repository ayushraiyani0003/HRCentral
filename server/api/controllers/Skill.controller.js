/**
 * SkillController - Handles HTTP requests for skill management
 * Provides CRUD operations and bulk operations for skills
 */

const skillService = require("../../services/api/Skill.service"); // Adjust the path if needed

class SkillController {
    /**
     * Create a new skill
     * @param {Object} req - Express request object containing skill data in body
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with created skill or error message
     */
    async createSkill(req, res) {
        try {
            const { name } = req.body;

            // Validate skill name is provided and not empty
            if (!name || name.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "Skill name is required",
                });
            }

            // Create skill with trimmed name
            const result = await skillService.create({ name: name.trim() });
            const status = result.success ? 201 : 400;
            res.status(status).json(result);
        } catch (error) {
            // Handle unexpected errors
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Get all skills with optional pagination and search
     * @param {Object} req - Express request object with query parameters (limit, offset, search)
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with skills array or error message
     */
    async getAllSkills(req, res) {
        try {
            // Extract query parameters with defaults
            const options = {
                limit: req.query.limit || 10,
                offset: req.query.offset || 0,
                search: req.query.search || "",
            };

            const result = await skillService.getAll(options);
            res.status(result.success ? 200 : 500).json(result);
        } catch (error) {
            // Handle unexpected errors
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Get a single skill by its ID
     * @param {Object} req - Express request object with skill ID in params
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with skill data or error message
     */
    async getSkillById(req, res) {
        try {
            const result = await skillService.getById(req.params.id);
            // Return 404 if skill not found, 200 if found
            const status = result.success ? 200 : 404;
            res.status(status).json(result);
        } catch (error) {
            // Handle unexpected errors
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Update an existing skill by ID
     * @param {Object} req - Express request object with skill ID in params and updated data in body
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with updated skill or error message
     */
    async updateSkill(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            // Validate skill name is provided and not empty
            if (!name || name.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "Skill name is required",
                });
            }

            // Update skill with trimmed name
            const result = await skillService.update(id, { name: name.trim() });
            const status = result.success ? 200 : 404;
            res.status(status).json(result);
        } catch (error) {
            // Handle unexpected errors
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Delete a skill by ID
     * @param {Object} req - Express request object with skill ID in params
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with success message or error
     */
    async deleteSkill(req, res) {
        try {
            const result = await skillService.delete(req.params.id);
            // Return 404 if skill not found, 200 if deleted successfully
            const status = result.success ? 200 : 404;
            res.status(status).json(result);
        } catch (error) {
            // Handle unexpected errors
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Create multiple skills in bulk
     * @param {Object} req - Express request object with array of skill objects in body
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with created skills or error message
     */
    async bulkCreateSkills(req, res) {
        try {
            const skills = req.body; // Expected format: [{ name: "Skill1" }, { name: "Skill2" }]

            // Validate input is a non-empty array
            if (!Array.isArray(skills) || skills.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "An array of skills is required",
                });
            }

            const result = await skillService.bulkCreate(skills);
            res.status(result.success ? 201 : 400).json(result);
        } catch (error) {
            // Handle unexpected errors
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

// Export a singleton instance of the controller
module.exports = new SkillController();
