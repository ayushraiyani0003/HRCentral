const { LoanType } = require("../../models"); // Adjust path as needed
const { Op } = require("sequelize");

class LoanTypeService {
    /**
     * Create a new loan type
     * @param {Object} data - Loan type data
     * @returns {Promise<Object>} Created loan type
     */
    async create(data) {
        try {
            const { name } = data;

            // Validate required fields
            if (!name) {
                throw new Error("Name is required");
            }

            // Check if loan type already exists
            const existingLoanType = await LoanType.findOne({
                where: { name: name.trim() },
            });

            if (existingLoanType) {
                throw new Error("Loan type with this name already exists");
            }

            const loanType = await LoanType.create({
                name: name.trim(),
            });

            return {
                success: true,
                data: loanType,
                message: "Loan type created successfully",
            };
        } catch (error) {
            throw new Error(`Failed to create loan type: ${error.message}`);
        }
    }

    /**
     * Get all loan types
     * @param {Object} options - Query options (limit, offset, order)
     * @returns {Promise<Object>} List of loan types
     */
    async readAll(options = {}) {
        try {
            const {
                limit = 10,
                offset = 0,
                orderBy = "created_at", // This matches your model's underscored format
                orderDirection = "DESC",
            } = options;

            // debug only
            // console.log(limit);
            // console.log(offset);
            // console.log(orderBy);
            // console.log(orderDirection);

            const loanTypes = await LoanType.findAndCountAll({
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [[orderBy, orderDirection]],
            });

            // debug only
            // console.log(loanTypes);
            // console.log(loanTypes.count);
            // console.log(loanTypes.rows);

            return {
                success: true,
                data: loanTypes.rows,
                pagination: {
                    total: loanTypes.count,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    pages: Math.ceil(loanTypes.count / limit),
                },
                message: "Loan types retrieved successfully",
            };
        } catch (error) {
            throw new Error(`Failed to retrieve loan types: ${error.message}`);
        }
    }

    /**
     * Get loan type by ID
     * @param {uuid} id - Loan type ID
     * @returns {Promise<Object>} Loan type data
     */
    async readById(id) {
        try {
            if (!id) {
                throw new Error("Loan type ID is required");
            }

            const loanType = await LoanType.findByPk(id);

            if (!loanType) {
                throw new Error("Loan type not found");
            }

            return {
                success: true,
                data: loanType,
                message: "Loan type retrieved successfully",
            };
        } catch (error) {
            throw new Error(`Failed to retrieve loan type: ${error.message}`);
        }
    }

    /**
     * Update loan type by ID
     * @param {uuid} id - Loan type ID
     * @param {Object} data - Updated loan type data
     * @returns {Promise<Object>} Updated loan type
     */
    async update(id, data) {
        try {
            if (!id) {
                throw new Error("Loan type ID is required");
            }

            const loanType = await LoanType.findByPk(id);

            if (!loanType) {
                throw new Error("Loan type not found");
            }

            const { name } = data;

            // Validate required fields
            if (!name) {
                throw new Error("Name is required");
            }

            // Check if another loan type with this name already exists (excluding current one)
            const existingLoanType = await LoanType.findOne({
                where: {
                    name: name.trim(),
                    id: { [require("sequelize").Op.ne]: id },
                },
            });

            if (existingLoanType) {
                throw new Error(
                    "Another loan type with this name already exists"
                );
            }

            const updatedLoanType = await loanType.update({
                name: name.trim(),
            });

            return {
                success: true,
                data: updatedLoanType,
                message: "Loan type updated successfully",
            };
        } catch (error) {
            throw new Error(`Failed to update loan type: ${error.message}`);
        }
    }

    /**
     * Delete loan type by ID
     * @param {uuid} id - Loan type ID
     * @returns {Promise<Object>} Deletion result
     */
    async delete(id) {
        try {
            if (!id) {
                throw new Error("Loan type ID is required");
            }

            const loanType = await LoanType.findByPk(id);

            if (!loanType) {
                throw new Error("Loan type not found");
            }

            await loanType.destroy();

            return {
                success: true,
                message: "Loan type deleted successfully",
            };
        } catch (error) {
            throw new Error(`Failed to delete loan type: ${error.message}`);
        }
    }

    /**
     * Get loan type by name
     * @param {string} name - Loan type name
     * @returns {Promise<Object>} Loan type data
     */
    async readByName(name) {
        try {
            if (!name) {
                throw new Error("Loan type name is required");
            }

            const loanType = await LoanType.findOne({
                where: { name: name.trim() },
            });

            if (!loanType) {
                throw new Error("Loan type not found");
            }

            return {
                success: true,
                data: loanType,
                message: "Loan type retrieved successfully",
            };
        } catch (error) {
            throw new Error(`Failed to retrieve loan type: ${error.message}`);
        }
    }

    /**
     * Check if loan type exists by name
     * @param {string} name - Loan type name
     * @returns {Promise<boolean>} True if exists, false otherwise
     */
    async existsByName(name) {
        try {
            if (!name) {
                return false;
            }

            const loanType = await LoanType.findOne({
                where: { name: name.trim() },
            });

            return !!loanType;
        } catch (error) {
            throw new Error(
                `Failed to check loan type existence: ${error.message}`
            );
        }
    }

    /**
     * Get loan types with search functionality
     * @param {Object} options - Search options
     * @returns {Promise<Object>} Filtered loan types
     */
    async search(options = {}) {
        try {
            const {
                searchTerm = "",
                limit = 10,
                offset = 0,
                orderBy = "created_at",
                orderDirection = "DESC",
            } = options;

            const whereClause = {};

            if (searchTerm) {
                whereClause.name = {
                    [require("sequelize").Op.like]: `%${searchTerm.trim()}%`,
                };
            }

            const loanTypes = await LoanType.findAndCountAll({
                where: whereClause,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [[orderBy, orderDirection]],
            });

            return {
                success: true,
                data: loanTypes.rows,
                pagination: {
                    total: loanTypes.count,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    pages: Math.ceil(loanTypes.count / limit),
                },
                message: "Loan types retrieved successfully",
            };
        } catch (error) {
            throw new Error(`Failed to search loan types: ${error.message}`);
        }
    }
}

module.exports = new LoanTypeService();
