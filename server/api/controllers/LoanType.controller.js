/**
 * @fileoverview Controller for LoanType management
 * @version 1.0.0
 */

const LoanTypeService = require("../../services/api/LoanType.service"); // Adjust path as necessary

class LoanTypeController {
    /**
     * Create a new loan type
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async createLoanType(req, res) {
        try {
            const result = await LoanTypeService.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get all loan types with pagination and filtering
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getAllLoanTypes(req, res) {
        try {
            const options = {
                limit: req.query.limit || 10,
                offset: req.query.offset || 0,
                orderBy: req.query.orderBy || "created_at",
                orderDirection: req.query.orderDirection || "DESC",
            };

            const result = await LoanTypeService.readAll(options);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Search loan types by name
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async searchLoanTypes(req, res) {
        try {
            const { q: searchTerm } = req.query;

            if (!searchTerm) {
                return res.status(400).json({
                    success: false,
                    message: "Search term (q) is required",
                });
            }

            const options = {
                searchTerm,
                limit: req.query.limit || 10,
                offset: req.query.offset || 0,
                orderBy: req.query.orderBy || "created_at",
                orderDirection: req.query.orderDirection || "DESC",
            };

            const result = await LoanTypeService.search(options);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get all loan types sorted by name (for dropdown lists)
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getAllLoanTypesSorted(req, res) {
        try {
            const options = {
                limit: 1000, // High limit for dropdown
                offset: 0,
                orderBy: "name",
                orderDirection: "ASC",
            };

            const result = await LoanTypeService.readAll(options);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get total count of loan types
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getLoanTypesCount(req, res) {
        try {
            const result = await LoanTypeService.readAll({
                limit: 1,
                offset: 0,
            });
            res.status(200).json({
                success: true,
                count: result.pagination.total,
                message: "Loan types count retrieved successfully",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Bulk create loan types
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async bulkCreateLoanTypes(req, res) {
        try {
            const loanTypes = Array.isArray(req.body)
                ? req.body
                : req.body.loanTypes;

            if (!Array.isArray(loanTypes) || loanTypes.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "loanTypes array is required and cannot be empty",
                });
            }

            const results = [];
            const errors = [];

            for (let i = 0; i < loanTypes.length; i++) {
                try {
                    const result = await LoanTypeService.create(loanTypes[i]);
                    results.push(result.data);
                } catch (error) {
                    errors.push({
                        index: i,
                        data: loanTypes[i],
                        error: error.message,
                    });
                }
            }

            if (errors.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: "Some loan types could not be created",
                    created: results,
                    errors: errors,
                });
            }

            res.status(201).json({
                success: true,
                data: results,
                message: `${results.length} loan types created successfully`,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Check if loan type exists by name
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async checkLoanTypeExistsByName(req, res) {
        try {
            const { name } = req.params;
            const exists = await LoanTypeService.existsByName(name);

            res.status(200).json({
                success: true,
                exists: exists,
                message: `Loan type ${exists ? "exists" : "does not exist"}`,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Check if loan type exists by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async checkLoanTypeExistsById(req, res) {
        try {
            const { id } = req.params;

            try {
                await LoanTypeService.readById(id);
                res.status(200).json({
                    success: true,
                    exists: true,
                    message: "Loan type exists",
                });
            } catch (error) {
                if (error.message.includes("not found")) {
                    res.status(200).json({
                        success: true,
                        exists: false,
                        message: "Loan type does not exist",
                    });
                } else {
                    throw error;
                }
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get loan type by name
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getLoanTypeByName(req, res) {
        try {
            const { name } = req.params;

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Loan type name is required",
                });
            }

            const result = await LoanTypeService.readByName(name);
            res.status(200).json(result);
        } catch (error) {
            if (error.message.includes("not found")) {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        }
    }

    /**
     * Get loan type by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getLoanTypeById(req, res) {
        try {
            const { id } = req.params;
            const result = await LoanTypeService.readById(id);
            res.status(200).json(result);
        } catch (error) {
            if (error.message.includes("not found")) {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
            } else if (error.message.includes("required")) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        }
    }

    /**
     * Update loan type by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async updateLoanType(req, res) {
        try {
            const { id } = req.params;
            const result = await LoanTypeService.update(id, req.body);
            res.status(200).json(result);
        } catch (error) {
            if (error.message.includes("not found")) {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
            } else if (error.message.includes("already exists")) {
                res.status(409).json({
                    success: false,
                    message: error.message,
                });
            } else if (error.message.includes("required")) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        }
    }

    /**
     * Delete loan type by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async deleteLoanType(req, res) {
        try {
            const { id } = req.params;
            const result = await LoanTypeService.delete(id);
            res.status(200).json(result);
        } catch (error) {
            if (error.message.includes("not found")) {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
            } else if (error.message.includes("required")) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        }
    }
}

module.exports = new LoanTypeController();
