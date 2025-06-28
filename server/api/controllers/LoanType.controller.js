/**
 * @fileoverview Controller for Loan Type operations
 * @version 1.0.0
 */

const LoanTypeService = require("../../services/api/LoanType.service"); // Adjust path as needed

/**
 * LoanType Controller Class
 * Handles HTTP requests for loan type operations
 */
class LoanTypeController {
    /**
     * Create a new loan type
     * @route POST /api/loan-type
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async createLoanType(req, res) {
        console.log(req.body);
        try {
            const result = await LoanTypeService.create(req.body);

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
     * Get all loan types
     * @route GET /api/loan-type
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getAllLoanTypes(req, res) {
        try {
            const result = await LoanTypeService.getAll();
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
     * Get loan type by ID
     * @route GET /api/loan-type/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getLoanTypeById(req, res) {
        try {
            const { id } = req.params;
            const result = await LoanTypeService.getById(id);
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
     * Update loan type by ID
     * @route PUT /api/loan-type/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async updateLoanType(req, res) {
        try {
            const { id } = req.params;
            const result = await LoanTypeService.update(id, req.body);
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
     * Delete loan type by ID
     * @route DELETE /api/loan-type/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async deleteLoanType(req, res) {
        try {
            const { id } = req.params;
            const result = await LoanTypeService.delete(id);
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

module.exports = new LoanTypeController();
