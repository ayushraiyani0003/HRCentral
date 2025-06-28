// =================== controllers/ExperienceLevel.controller.js ===================
const ExperienceLevelService = require("../../services/api/ExperienceLevel.service");

/**
 * ExperienceLevel Controller
 * Handles HTTP requests for ExperienceLevel operations
 */
class ExperienceLevelController {
    /**
     * Create a new experience level
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async create(req, res) {
        try {
            const result = await ExperienceLevelService.create(req.body);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: result.message,
                    error: result.error || null,
                });
            }

            return res.status(201).json({
                success: true,
                data: result.data,
                message: result.message,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    }

    /**
     * Get all experience levels
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getAll(req, res) {
        try {
            const result = await ExperienceLevelService.getAll();

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    message: result.message,
                    error: result.error || null,
                });
            }

            return res.status(200).json({
                success: true,
                data: result.data,
                message: result.message,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    }

    /**
     * Get experience level by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getById(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Experience level ID is required",
                });
            }

            const result = await ExperienceLevelService.getById(id);

            if (!result.success) {
                return res.status(404).json({
                    success: false,
                    message: result.message,
                    error: result.error || null,
                });
            }

            return res.status(200).json({
                success: true,
                data: result.data,
                message: result.message,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    }

    /**
     * Get experience level by name
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getByName(req, res) {
        try {
            const { name } = req.params;

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Experience level name is required",
                });
            }

            const result = await ExperienceLevelService.readByName(name);

            if (!result.success) {
                return res.status(404).json({
                    success: false,
                    message: result.message,
                    error: result.error || null,
                });
            }

            return res.status(200).json({
                success: true,
                data: result.data,
                message: result.message,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    }

    /**
     * Update experience level
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async update(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Experience level ID is required",
                });
            }

            const result = await ExperienceLevelService.update(id, req.body);

            if (!result.success) {
                const statusCode =
                    result.message === "Experience level not found" ? 404 : 400;
                return res.status(statusCode).json({
                    success: false,
                    message: result.message,
                    error: result.error || null,
                });
            }

            return res.status(200).json({
                success: true,
                data: result.data,
                message: result.message,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    }

    /**
     * Delete experience level
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async delete(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Experience level ID is required",
                });
            }

            const result = await ExperienceLevelService.delete(id);

            if (!result.success) {
                return res.status(404).json({
                    success: false,
                    message: result.message,
                    error: result.error || null,
                });
            }

            return res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    }
}

module.exports = new ExperienceLevelController();
