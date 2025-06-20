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
            const options = {
                limit: req.query.limit,
                offset: req.query.offset,
                orderBy: req.query.orderBy,
                orderDirection: req.query.orderDirection,
            };

            const result = await BankListService.readAll(options);
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

    /**
     * Get bank by name
     * @route GET /api/bank-list/name/:name
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getBankByName(req, res) {
        try {
            const { name } = req.params;
            const result = await BankListService.readByName(
                decodeURIComponent(name)
            );
            return res.status(200).json(result);
        } catch (error) {
            const statusCode = error.message.includes("not found")
                ? 404
                : error.message.includes("required")
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
     * Check if bank exists by name
     * @route GET /api/bank-list/exists/name/:name
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async checkBankExistsByName(req, res) {
        try {
            const { name } = req.params;
            const exists = await BankListService.existsByName(
                decodeURIComponent(name)
            );
            return res.status(200).json({
                success: true,
                data: { exists },
                message: exists ? "Bank exists" : "Bank does not exist",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
                error: "Internal Server Error",
            });
        }
    }

    /**
     * Check if bank exists by ID
     * @route GET /api/bank-list/exists/id/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async checkBankExistsById(req, res) {
        try {
            const { id } = req.params;
            const exists = await BankListService.existsById(id);
            return res.status(200).json({
                success: true,
                data: { exists },
                message: exists ? "Bank exists" : "Bank does not exist",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
                error: "Internal Server Error",
            });
        }
    }

    /**
     * Search banks by name
     * @route GET /api/bank-list/search
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async searchBanks(req, res) {
        try {
            const { q: searchTerm } = req.query;
            const options = {
                limit: req.query.limit,
                offset: req.query.offset,
            };

            const result = await BankListService.search(searchTerm, options);
            return res.status(200).json(result);
        } catch (error) {
            const statusCode = error.message.includes("required") ? 400 : 500;
            return res.status(statusCode).json({
                success: false,
                message: error.message,
                error:
                    statusCode === 400
                        ? "Bad Request"
                        : "Internal Server Error",
            });
        }
    }

    /**
     * Get all banks sorted by name
     * @route GET /api/bank-list/sorted
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getAllBanksSorted(req, res) {
        try {
            const result = await BankListService.getAllSorted();
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
     * Get banks count
     * @route GET /api/bank-list/count
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getBanksCount(req, res) {
        try {
            const result = await BankListService.getCount();
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
     * Bulk create banks
     * @route POST /api/bank-list/bulk
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async bulkCreateBanks(req, res) {
        try {
            const result = await BankListService.bulkCreate(req.body);
            return res.status(201).json(result);
        } catch (error) {
            const statusCode = error.message.includes("array")
                ? 400
                : error.message.includes("already exist")
                ? 409
                : 500;
            return res.status(statusCode).json({
                success: false,
                message: error.message,
                error:
                    statusCode === 400
                        ? "Bad Request"
                        : statusCode === 409
                        ? "Conflict"
                        : "Internal Server Error",
            });
        }
    }
}

module.exports = new BankListController();
