/**
 * @fileoverview Controller for Designation operations
 * @version 1.0.0
 */

const DesignationService = require("../../services/api/Designation.service"); // Adjust path as needed

/**
 * Designation Controller Class
 * Handles HTTP requests for designation operations
 */
class DesignationController {
    /**
     * Create a new designation
     * @route POST /api/designations
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async createDesignation(req, res) {
        console.log(req.body);
        try {
            const result = await DesignationService.create(req.body);

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
     * Get all designations
     * @route GET /api/designations
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getAllDesignations(req, res) {
        try {
            const result = await DesignationService.getAll();

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
     * Get designation by ID
     * @route GET /api/designations/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getDesignationById(req, res) {
        try {
            const { id } = req.params;
            const result = await DesignationService.getById(id);

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
     * Update designation by ID
     * @route PUT /api/designations/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async updateDesignation(req, res) {
        try {
            const { id } = req.params;
            const result = await DesignationService.update(id, req.body);

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
     * Delete designation by ID
     * @route DELETE /api/designations/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async deleteDesignation(req, res) {
        try {
            const { id } = req.params;
            const result = await DesignationService.delete(id);

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

module.exports = new DesignationController();
