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
            const result = await DesignationService.createDesignation(req.body);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: result.error,
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
     * Get all designations with pagination and sorting
     * @route GET /api/designations
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getAllDesignations(req, res) {
        try {
            const options = {
                page: req.query.page,
                limit: req.query.limit,
            };

            const result = await DesignationService.getAllDesignations(options);

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    message: result.error,
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
            const result = await DesignationService.getDesignationById(id);

            if (!result.success) {
                const statusCode = result.error.includes("not found")
                    ? 404
                    : 400;
                return res.status(statusCode).json({
                    success: false,
                    message: result.error,
                    error: statusCode === 404 ? "Not Found" : "Bad Request",
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
     * Update designation by ID
     * @route PUT /api/designations/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async updateDesignation(req, res) {
        try {
            const { id } = req.params;
            const result = await DesignationService.updateDesignation(
                id,
                req.body
            );

            if (!result.success) {
                const statusCode = result.error.includes("not found")
                    ? 404
                    : result.error.includes("already exists")
                    ? 409
                    : 400;
                return res.status(statusCode).json({
                    success: false,
                    message: result.error,
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
            return res.status(500).json({
                success: false,
                message: error.message,
                error: "Internal Server Error",
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
            const result = await DesignationService.deleteDesignation(id);

            if (!result.success) {
                const statusCode = result.error.includes("not found")
                    ? 404
                    : 400;
                return res.status(statusCode).json({
                    success: false,
                    message: result.error,
                    error: statusCode === 404 ? "Not Found" : "Bad Request",
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
     * Search designations by name
     * @route GET /api/designations/search
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async searchDesignations(req, res) {
        try {
            const { q: searchTerm } = req.query;

            if (!searchTerm) {
                return res.status(400).json({
                    success: false,
                    message: "Search term is required",
                    error: "Bad Request",
                });
            }

            const result = await DesignationService.searchDesignations(
                searchTerm
            );

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    message: result.error,
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
     * Get all designations sorted by name
     * @route GET /api/designations/sorted
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getAllDesignationsSorted(req, res) {
        try {
            const result = await DesignationService.getAllDesignations();

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    message: result.error,
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
     * Get designations count
     * @route GET /api/designations/count
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getDesignationsCount(req, res) {
        try {
            const result = await DesignationService.getAllDesignations();

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    message: result.error,
                    error: "Internal Server Error",
                });
            }

            return res.status(200).json({
                success: true,
                data: { count: result.data.length },
                message: "Count retrieved successfully",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
                error: "Internal Server Error",
            });
        }
    }
}

module.exports = new DesignationController();
