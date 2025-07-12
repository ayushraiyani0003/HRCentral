/**
 * @fileoverview Controller for Bank List operations
 * @version 1.0.0
 */

const BankListService = require("../../services/api/BankList.service"); // Adjust path as needed

/**
 * BankList Controller Class
 * Handles HTTP requests for bank list operations
 */
class BankListController {
    /**
     * Create a new bank
     * @route POST /api/bank-list
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async createBank(req, res) {
        console.log(req.body);
        try {
            const result = await BankListService.create(req.body);

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
     * Get all banks with pagination and sorting
     * @route GET /api/bank-list
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getAllBanks(req, res) {
        try {
            const result = await BankListService.readAll();
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
     * Get bank by ID
     * @route GET /api/bank-list/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getBankById(req, res) {
        try {
            const { id } = req.params;
            const result = await BankListService.readById(id);
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
     * Update bank by ID
     * @route PUT /api/bank-list/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async updateBank(req, res) {
        try {
            const { id } = req.params;
            const result = await BankListService.update(id, req.body);
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
     * Delete bank by ID
     * @route DELETE /api/bank-list/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async deleteBank(req, res) {
        try {
            const { id } = req.params;
            const result = await BankListService.delete(id);
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

module.exports = new BankListController();
