/**
 * @fileoverview Controller for EducationLevel operations
 * @version 1.0.0
 */

const EducationLevelService = require("../../services/api/EducationLevel.service"); // Adjust path as needed

/**
 * EducationLevel Controller Class
 * Handles HTTP requests for education level operations
 */
class EducationLevelController {
    /**
     * Create a new education level
     * @route POST /api/education-level
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async create(req, res) {
        console.log(req.body);
        try {
            const result = await EducationLevelService.create(req.body);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: result.message,
                    error: "Bad Request",
                });
            }

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
     * Get all education levels
     * @route GET /api/education-level
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getAll(req, res) {
        try {
            const result = await EducationLevelService.getAll();

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    message: result.message,
                    error: "Internal Server Error",
                });
            }

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
     * Get education level by ID
     * @route GET /api/education-level/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            const result = await EducationLevelService.getById(id);

            if (!result.success) {
                const statusCode = result.message.includes("not found")
                    ? 404
                    : 400;
                return res.status(statusCode).json({
                    success: false,
                    message: result.message,
                    error: statusCode === 404 ? "Not Found" : "Bad Request",
                });
            }

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
     * Update education level by ID
     * @route PUT /api/education-level/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const result = await EducationLevelService.update(id, req.body);

            if (!result.success) {
                const statusCode = result.message.includes("not found")
                    ? 404
                    : result.message.includes("already exists")
                    ? 409
                    : 400;
                return res.status(statusCode).json({
                    success: false,
                    message: result.message,
                    error:
                        statusCode === 404
                            ? "Not Found"
                            : statusCode === 409
                            ? "Conflict"
                            : "Bad Request",
                });
            }

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
     * Delete education level by ID
     * @route DELETE /api/education-level/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await EducationLevelService.delete(id);

            if (!result.success) {
                const statusCode = result.message.includes("not found")
                    ? 404
                    : 400;
                return res.status(statusCode).json({
                    success: false,
                    message: result.message,
                    error: statusCode === 404 ? "Not Found" : "Bad Request",
                });
            }

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

module.exports = new EducationLevelController();
