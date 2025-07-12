/**
 * @fileoverview Controller for Job Location operations
 * @version 1.0.0
 */

const JobLocationService = require("../../services/api/JobLocation.service"); // Adjust path as needed

/**
 * JobLocation Controller Class
 * Handles HTTP requests for job location operations
 */
class JobLocationController {
    /**
     * Create a new job location
     * @route POST /api/job-locations
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async create(req, res) {
        console.log(req.body);
        try {
            const result = await JobLocationService.create(req.body);

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
     * Get all job locations
     * @route GET /api/job-locations
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getAll(req, res) {
        try {
            const result = await JobLocationService.getAll();
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
     * Get job location by ID
     * @route GET /api/job-locations/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            const result = await JobLocationService.getById(id);
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
     * Update job location by ID
     * @route PUT /api/job-locations/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const result = await JobLocationService.update(id, req.body);
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
     * Delete job location by ID
     * @route DELETE /api/job-locations/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await JobLocationService.delete(id);
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

module.exports = new JobLocationController();
