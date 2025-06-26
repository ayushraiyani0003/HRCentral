const EducationLevelService = require("../../services/api/EducationLevel.service");

/**
 * Controller for managing education level operations
 * Handles HTTP requests and responses for education level CRUD operations
 */
class EducationLevelController {
    /**
     * Create a new education level
     * @param {Object} req - Express request object
     * @param {Object} req.body - Education level data to create
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} Created education level data or error response
     */
    async create(req, res) {
        const result = await EducationLevelService.createEducationLevel(
            req.body
        );
        if (result.success) {
            return res.status(201).json(result.data);
        }
        return res.status(400).json({ error: result.error });
    }

    /**
     * Get all education levels with pagination
     * @param {Object} req - Express request object
     * @param {Object} req.query - Query parameters
     * @param {string} req.query.page - Page number for pagination
     * @param {string} req.query.limit - Number of items per page
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} List of education levels or error response
     */
    async getAll(req, res) {
        const { page, limit } = req.query;
        const result = await EducationLevelService.getAllEducationLevels({
            page: parseInt(page),
            limit: parseInt(limit),
        });
        if (result.success) {
            return res.json(result.data);
        }
        return res.status(500).json({ error: result.error });
    }

    /**
     * Get a specific education level by ID
     * @param {Object} req - Express request object
     * @param {Object} req.params - Route parameters
     * @param {string} req.params.id - Education level ID
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} Education level data or error response
     */
    async getById(req, res) {
        const { id } = req.params;
        const result = await EducationLevelService.getEducationLevelById(id);
        if (result.success) {
            return res.json(result.data);
        }
        return res.status(404).json({ error: result.error });
    }

    /**
     * Update an existing education level
     * @param {Object} req - Express request object
     * @param {Object} req.params - Route parameters
     * @param {string} req.params.id - Education level ID to update
     * @param {Object} req.body - Updated education level data
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} Updated education level data or error response
     */
    async update(req, res) {
        const { id } = req.params;
        const result = await EducationLevelService.updateEducationLevel(
            id,
            req.body
        );
        if (result.success) {
            return res.json(result.data);
        }
        return res.status(400).json({ error: result.error });
    }

    /**
     * Delete an education level by ID
     * @param {Object} req - Express request object
     * @param {Object} req.params - Route parameters
     * @param {string} req.params.id - Education level ID to delete
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} Success message or error response
     */
    async delete(req, res) {
        const { id } = req.params;
        const result = await EducationLevelService.deleteEducationLevel(id);
        if (result.success) {
            return res.json({ message: result.message });
        }
        return res.status(404).json({ error: result.error });
    }

    /**
     * Search education levels by query string
     * @param {Object} req - Express request object
     * @param {Object} req.query - Query parameters
     * @param {string} req.query.q - Search query string
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} Search results or error response
     */
    async search(req, res) {
        const { q } = req.query;
        const result = await EducationLevelService.searchEducationLevels(
            q || ""
        );
        if (result.success) {
            return res.json(result.data);
        }
        return res.status(500).json({ error: result.error });
    }
}

module.exports = new EducationLevelController();
