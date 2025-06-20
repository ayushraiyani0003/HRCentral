const { BankList } = require("../models"); // Adjust path as needed
const { Op } = require("sequelize");

class BankListService {
    /**
     * Create a new bank
     * @param {Object} data - Bank data
     * @returns {Promise<Object>} Created bank
     */
    async create(data) {
        try {
            const { name } = data;

            // Validate required fields
            if (!name || !name.trim()) {
                throw new Error("Bank name is required and cannot be empty");
            }

            // Validate name length based on model constraint
            if (name.trim().length > 100) {
                throw new Error("Bank name cannot exceed 100 characters");
            }

            // Check if bank name already exists (case-insensitive)
            const existingBank = await BankList.findOne({
                where: {
                    name: {
                        [Op.iLike]: name.trim(),
                    },
                },
            });

            if (existingBank) {
                throw new Error("Bank name already exists");
            }

            const bank = await BankList.create({
                name: name.trim(),
            });

            return {
                success: true,
                data: bank,
                message: "Bank created successfully",
            };
        } catch (error) {
            // Handle Sequelize unique constraint error
            if (error.name === "SequelizeUniqueConstraintError") {
                throw new Error("Bank name already exists");
            }
            // Handle validation errors
            if (error.name === "SequelizeValidationError") {
                const validationErrors = error.errors
                    .map((err) => err.message)
                    .join(", ");
                throw new Error(`Validation error: ${validationErrors}`);
            }
            throw new Error(`Failed to create bank: ${error.message}`);
        }
    }

    /**
     * Get all banks
     * @param {Object} options - Query options (limit, offset, order)
     * @returns {Promise<Object>} List of banks
     */
    async readAll(options = {}) {
        try {
            const {
                limit = 10,
                offset = 0,
                orderBy = "created_at",
                orderDirection = "DESC",
            } = options;

            // Validate pagination parameters
            const parsedLimit = Math.max(
                1,
                Math.min(100, parseInt(limit) || 10)
            );
            const parsedOffset = Math.max(0, parseInt(offset) || 0);

            // Validate order parameters
            const validOrderFields = ["id", "name", "created_at", "updated_at"];
            const validOrderDirections = ["ASC", "DESC"];

            const finalOrderBy = validOrderFields.includes(orderBy)
                ? orderBy
                : "created_at";
            const finalOrderDirection = validOrderDirections.includes(
                orderDirection.toUpperCase()
            )
                ? orderDirection.toUpperCase()
                : "DESC";

            const banks = await BankList.findAndCountAll({
                limit: parsedLimit,
                offset: parsedOffset,
                order: [[finalOrderBy, finalOrderDirection]],
            });

            return {
                success: true,
                data: banks.rows,
                pagination: {
                    total: banks.count,
                    limit: parsedLimit,
                    offset: parsedOffset,
                    pages: Math.ceil(banks.count / parsedLimit),
                },
                message: "Banks retrieved successfully",
            };
        } catch (error) {
            throw new Error(`Failed to retrieve banks: ${error.message}`);
        }
    }

    /**
     * Get bank by ID (UUID)
     * @param {string} id - Bank UUID
     * @returns {Promise<Object>} Bank data
     */
    async readById(id) {
        try {
            if (!id) {
                throw new Error("Bank ID is required");
            }

            // Validate UUID format
            if (!this._isValidUUID(id)) {
                throw new Error("Invalid UUID format");
            }

            const bank = await BankList.findByPk(id);

            if (!bank) {
                throw new Error("Bank not found");
            }

            return {
                success: true,
                data: bank,
                message: "Bank retrieved successfully",
            };
        } catch (error) {
            throw new Error(`Failed to retrieve bank: ${error.message}`);
        }
    }

    /**
     * Update bank by ID (UUID)
     * @param {string} id - Bank UUID
     * @param {Object} data - Updated bank data
     * @returns {Promise<Object>} Updated bank
     */
    async update(id, data) {
        try {
            if (!id) {
                throw new Error("Bank ID is required");
            }

            // Validate UUID format
            if (!this._isValidUUID(id)) {
                throw new Error("Invalid UUID format");
            }

            const bank = await BankList.findByPk(id);

            if (!bank) {
                throw new Error("Bank not found");
            }

            const { name } = data;

            // Validate required fields
            if (!name || !name.trim()) {
                throw new Error("Bank name is required and cannot be empty");
            }

            // Validate name length based on model constraint
            if (name.trim().length > 100) {
                throw new Error("Bank name cannot exceed 100 characters");
            }

            // Check if new name already exists (excluding current record, case-insensitive)
            const existingBank = await BankList.findOne({
                where: {
                    name: {
                        [Op.iLike]: name.trim(),
                    },
                    id: { [Op.ne]: id },
                },
            });

            if (existingBank) {
                throw new Error("Bank name already exists");
            }

            const updatedBank = await bank.update({
                name: name.trim(),
            });

            return {
                success: true,
                data: updatedBank,
                message: "Bank updated successfully",
            };
        } catch (error) {
            // Handle Sequelize unique constraint error
            if (error.name === "SequelizeUniqueConstraintError") {
                throw new Error("Bank name already exists");
            }
            // Handle validation errors
            if (error.name === "SequelizeValidationError") {
                const validationErrors = error.errors
                    .map((err) => err.message)
                    .join(", ");
                throw new Error(`Validation error: ${validationErrors}`);
            }
            throw new Error(`Failed to update bank: ${error.message}`);
        }
    }

    /**
     * Delete bank by ID (UUID)
     * @param {string} id - Bank UUID
     * @returns {Promise<Object>} Deletion result
     */
    async delete(id) {
        try {
            if (!id) {
                throw new Error("Bank ID is required");
            }

            // Validate UUID format
            if (!this._isValidUUID(id)) {
                throw new Error("Invalid UUID format");
            }

            const bank = await BankList.findByPk(id);

            if (!bank) {
                throw new Error("Bank not found");
            }

            await bank.destroy();

            return {
                success: true,
                message: "Bank deleted successfully",
            };
        } catch (error) {
            throw new Error(`Failed to delete bank: ${error.message}`);
        }
    }

    /**
     * Get bank by name (case-insensitive)
     * @param {string} name - Bank name
     * @returns {Promise<Object>} Bank data
     */
    async readByName(name) {
        try {
            if (!name || !name.trim()) {
                throw new Error("Bank name is required");
            }

            const bank = await BankList.findOne({
                where: {
                    name: {
                        [Op.iLike]: name.trim(),
                    },
                },
            });

            if (!bank) {
                throw new Error("Bank not found");
            }

            return {
                success: true,
                data: bank,
                message: "Bank retrieved successfully",
            };
        } catch (error) {
            throw new Error(`Failed to retrieve bank: ${error.message}`);
        }
    }

    /**
     * Check if bank exists by name (case-insensitive)
     * @param {string} name - Bank name
     * @returns {Promise<boolean>} True if exists, false otherwise
     */
    async existsByName(name) {
        try {
            if (!name || !name.trim()) {
                return false;
            }

            const bank = await BankList.findOne({
                where: {
                    name: {
                        [Op.iLike]: name.trim(),
                    },
                },
            });

            return !!bank;
        } catch (error) {
            throw new Error(`Failed to check bank existence: ${error.message}`);
        }
    }

    /**
     * Check if bank exists by ID (UUID)
     * @param {string} id - Bank UUID
     * @returns {Promise<boolean>} True if exists, false otherwise
     */
    async existsById(id) {
        try {
            if (!id) {
                return false;
            }

            // Validate UUID format
            if (!this._isValidUUID(id)) {
                return false;
            }

            const bank = await BankList.findByPk(id);
            return !!bank;
        } catch (error) {
            throw new Error(`Failed to check bank existence: ${error.message}`);
        }
    }

    /**
     * Search banks by name (partial match, case-insensitive)
     * @param {string} searchTerm - Search term for bank name
     * @param {Object} options - Query options (limit, offset)
     * @returns {Promise<Object>} List of matching banks
     */
    async search(searchTerm, options = {}) {
        try {
            if (!searchTerm || !searchTerm.trim()) {
                throw new Error("Search term is required");
            }

            const { limit = 10, offset = 0 } = options;

            // Validate pagination parameters
            const parsedLimit = Math.max(
                1,
                Math.min(100, parseInt(limit) || 10)
            );
            const parsedOffset = Math.max(0, parseInt(offset) || 0);

            const banks = await BankList.findAndCountAll({
                where: {
                    name: {
                        [Op.iLike]: `%${searchTerm.trim()}%`,
                    },
                },
                limit: parsedLimit,
                offset: parsedOffset,
                order: [["name", "ASC"]],
            });

            return {
                success: true,
                data: banks.rows,
                pagination: {
                    total: banks.count,
                    limit: parsedLimit,
                    offset: parsedOffset,
                    pages: Math.ceil(banks.count / parsedLimit),
                },
                message: "Banks search completed successfully",
            };
        } catch (error) {
            throw new Error(`Failed to search banks: ${error.message}`);
        }
    }

    /**
     * Get all banks sorted by name (for dropdown lists)
     * @returns {Promise<Object>} List of banks sorted by name
     */
    async getAllSorted() {
        try {
            const banks = await BankList.findAll({
                order: [["name", "ASC"]],
            });

            return {
                success: true,
                data: banks,
                message: "Banks retrieved successfully",
            };
        } catch (error) {
            throw new Error(`Failed to retrieve banks: ${error.message}`);
        }
    }

    /**
     * Get banks count
     * @returns {Promise<Object>} Total count of banks
     */
    async getCount() {
        try {
            const count = await BankList.count();

            return {
                success: true,
                data: { count },
                message: "Banks count retrieved successfully",
            };
        } catch (error) {
            throw new Error(`Failed to get banks count: ${error.message}`);
        }
    }

    /**
     * Bulk create banks
     * @param {Array} banksData - Array of bank objects
     * @returns {Promise<Object>} Created banks
     */
    async bulkCreate(banksData) {
        try {
            if (!Array.isArray(banksData) || banksData.length === 0) {
                throw new Error("Banks data must be a non-empty array");
            }

            // Validate and sanitize data
            const sanitizedData = banksData.map((bank) => {
                if (!bank.name || !bank.name.trim()) {
                    throw new Error("All banks must have a name");
                }
                if (bank.name.trim().length > 100) {
                    throw new Error("Bank name cannot exceed 100 characters");
                }
                return { name: bank.name.trim() };
            });

            // Check for duplicates within the input data
            const names = sanitizedData.map((bank) => bank.name.toLowerCase());
            const duplicates = names.filter(
                (name, index) => names.indexOf(name) !== index
            );
            if (duplicates.length > 0) {
                throw new Error(
                    `Duplicate names found in input: ${duplicates.join(", ")}`
                );
            }

            const createdBanks = await BankList.bulkCreate(sanitizedData, {
                validate: true,
                ignoreDuplicates: false,
            });

            return {
                success: true,
                data: createdBanks,
                message: `${createdBanks.length} banks created successfully`,
            };
        } catch (error) {
            if (error.name === "SequelizeUniqueConstraintError") {
                throw new Error("One or more bank names already exist");
            }
            throw new Error(`Failed to bulk create banks: ${error.message}`);
        }
    }

    /**
     * Private method to validate UUID format
     * @param {string} uuid - UUID string to validate
     * @returns {boolean} True if valid UUID, false otherwise
     */
    _isValidUUID(uuid) {
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }
}

module.exports = BankListService();
