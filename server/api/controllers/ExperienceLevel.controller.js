const experienceLevelService = require("../../services/api/ExperienceLevel.service"); // Adjust path as needed

/**
 * ExperienceLevel Controller
 * Handles HTTP requests for ExperienceLevel operations
 */
class ExperienceLevelController {
    /**
     * Create a new experience level
     * @param {Object} req - Express request object
     * @param {Object} req.body - Request body
     * @param {string} req.body.name - Name of the experience level
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response with created experience level or error
     */
    async createExperienceLevel(req, res) {
        const { name } = req.body;

        console.log(name);

        // Validate required fields
        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Experience level name is required",
            });
        }

        // Create experience level through service
        const result = await experienceLevelService.create({
            name: name.trim(),
        });

        return res.status(result.success ? 201 : 400).json(result);
    }

    /**
     * Get all experience levels with pagination & optional search
     * @param {Object} req - Express request object
     * @param {Object} req.query - Query parameters
     * @param {number} [req.query.limit] - Number of records to return
     * @param {number} [req.query.offset] - Number of records to skip
     * @param {string} [req.query.search] - Search term to filter results
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response with experience levels list or error
     */
    async getAllExperienceLevels(req, res) {
        const { limit, offset, search } = req.query;

        // Get all experience levels with optional filters
        const result = await experienceLevelService.getAll({
            limit,
            offset,
            search,
        });

        return res.status(result.success ? 200 : 500).json(result);
    }

    /**
     * Get experience level by ID
     * @param {Object} req - Express request object
     * @param {Object} req.params - Route parameters
     * @param {string} req.params.id - Experience level ID
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response with experience level data or error
     */
    async getExperienceLevelById(req, res) {
        const { id } = req.params;

        // Fetch experience level by ID
        const result = await experienceLevelService.getById(id);

        return res.status(result.success ? 200 : 404).json(result);
    }

    /**
     * Update experience level by ID
     * @param {Object} req - Express request object
     * @param {Object} req.params - Route parameters
     * @param {string} req.params.id - Experience level ID
     * @param {Object} req.body - Request body
     * @param {string} req.body.name - Updated name of the experience level
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response with updated experience level or error
     */
    async updateExperienceLevel(req, res) {
        const { id } = req.params;
        const { name } = req.body;

        // Validate required fields
        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Experience level name is required",
            });
        }

        // Update experience level through service
        const result = await experienceLevelService.update(id, {
            name: name.trim(),
        });

        return res.status(result.success ? 200 : 404).json(result);
    }

    /**
     * Delete experience level by ID
     * @param {Object} req - Express request object
     * @param {Object} req.params - Route parameters
     * @param {string} req.params.id - Experience level ID to delete
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response confirming deletion or error
     */
    async deleteExperienceLevel(req, res) {
        const { id } = req.params;

        // Delete experience level through service
        const result = await experienceLevelService.delete(id);

        return res.status(result.success ? 200 : 404).json(result);
    }
}

// Export singleton instance of the controller
module.exports = new ExperienceLevelController();
