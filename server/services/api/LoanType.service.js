// =================== services/LoanType.service.js ===================
const { LoanType } = require("../../models");
const { Op } = require("sequelize");

class LoanTypeService {
    /**
     * Create a new loan type
     * @param {Object} loanTypeData - Loan type data
     * @returns {Promise<Object>} Created loan type
     */
    async create(loanTypeData) {
        try {
            const loanType = await LoanType.create(loanTypeData);
            return {
                success: true,
                data: loanType,
                message: "Loan type created successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to create loan type",
            };
        }
    }

    /**
     * Get all loan types
     * @returns {Promise<Object>} List of loan types
     */
    async getAll() {
        try {
            const loanTypes = await LoanType.findAll({
                order: [["name", "ASC"]],
            });

            return {
                success: true,
                data: {
                    loanTypes,
                },
                message: "Loan types retrieved successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to retrieve loan types",
            };
        }
    }

    /**
     * Get loan type by ID
     * @param {string} id - Loan type ID (UUID)
     * @returns {Promise<Object>} Loan type data
     */
    async getById(id) {
        try {
            const loanType = await LoanType.findByPk(id);

            if (!loanType) {
                return {
                    success: false,
                    message: "Loan type not found",
                };
            }

            return {
                success: true,
                data: loanType,
                message: "Loan type retrieved successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to retrieve loan type",
            };
        }
    }

    /**
     * Update loan type
     * @param {string} id - Loan type ID (UUID)
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated loan type
     */
    async update(id, updateData) {
        try {
            const loanType = await LoanType.findByPk(id);

            if (!loanType) {
                return {
                    success: false,
                    message: "Loan type not found",
                };
            }

            await loanType.update(updateData);

            return {
                success: true,
                data: loanType,
                message: "Loan type updated successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to update loan type",
            };
        }
    }

    /**
     * Delete loan type
     * @param {string} id - Loan type ID (UUID)
     * @returns {Promise<Object>} Deletion result
     */
    async delete(id) {
        try {
            const loanType = await LoanType.findByPk(id);

            if (!loanType) {
                return {
                    success: false,
                    message: "Loan type not found",
                };
            }

            await loanType.destroy();

            return {
                success: true,
                message: "Loan type deleted successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to delete loan type",
            };
        }
    }
}

module.exports = new LoanTypeService();
