const { Salutation } = require("../../models"); // Adjust path as needed
const { Op } = require("sequelize");

class SalutationService {
    /**
     * Create a new salutation
     * @param {Object} data - Salutation data
     * @returns {Promise<Object>} Created salutation
     */
    async create(data) {
        try {
            const { name } = data;

            // Validate required fields
            if (!name) {
                throw new Error("Name is required");
            }

            const salutation = await Salutation.create({
                name: name.trim(),
            });

            return {
                success: true,
                data: salutation,
                message: "Salutation created successfully",
            };
        } catch (error) {
            throw new Error(`Failed to create salutation: ${error.message}`);
        }
    }

    /**
     * Get all salutations
     * @param {Object} options - Query options (limit, offset, order)
     * @returns {Promise<Object>} List of salutations
     */
    async readAll(options = {}) {
        try {
            const {
                limit = 10,
                offset = 0,
                orderBy = "createdAt", // Fixed: use camelCase for Sequelize
                orderDirection = "DESC",
            } = options;

            const salutations = await Salutation.findAndCountAll({
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [[orderBy, orderDirection]],
            });

            return {
                success: true,
                data: salutations.rows,
                pagination: {
                    total: salutations.count,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    pages: Math.ceil(salutations.count / limit),
                },
                message: "Salutations retrieved successfully",
            };
        } catch (error) {
            throw new Error(`Failed to retrieve salutations: ${error.message}`);
        }
    }

    /**
     * Get salutation by ID (UUID)
     * @param {string} id - Salutation UUID
     * @returns {Promise<Object>} Salutation data
     */
    async readById(id) {
        try {
            if (!id) {
                throw new Error("Salutation ID is required");
            }

            // Validate UUID format
            const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(id)) {
                throw new Error("Invalid UUID format");
            }

            const salutation = await Salutation.findByPk(id);

            if (!salutation) {
                throw new Error("Salutation not found");
            }

            return {
                success: true,
                data: salutation,
                message: "Salutation retrieved successfully",
            };
        } catch (error) {
            throw new Error(`Failed to retrieve salutation: ${error.message}`);
        }
    }

    /**
     * Update salutation by ID (UUID)
     * @param {string} id - Salutation UUID
     * @param {Object} data - Updated salutation data
     * @returns {Promise<Object>} Updated salutation
     */
    async update(id, data) {
        try {
            if (!id) {
                throw new Error("Salutation ID is required");
            }

            // Validate UUID format
            const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(id)) {
                throw new Error("Invalid UUID format");
            }

            const salutation = await Salutation.findByPk(id);

            if (!salutation) {
                throw new Error("Salutation not found");
            }

            const { name } = data;

            // Validate required fields
            if (!name) {
                throw new Error("Name is required");
            }

            const updatedSalutation = await salutation.update({
                name: name.trim(),
            });

            return {
                success: true,
                data: updatedSalutation,
                message: "Salutation updated successfully",
            };
        } catch (error) {
            throw new Error(`Failed to update salutation: ${error.message}`);
        }
    }

    /**
     * Delete salutation by ID (UUID)
     * @param {string} id - Salutation UUID
     * @returns {Promise<Object>} Deletion result
     */
    async delete(id) {
        try {
            if (!id) {
                throw new Error("Salutation ID is required");
            }

            // Validate UUID format
            const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(id)) {
                throw new Error("Invalid UUID format");
            }

            const salutation = await Salutation.findByPk(id);

            if (!salutation) {
                throw new Error("Salutation not found");
            }

            await salutation.destroy();

            return {
                success: true,
                message: "Salutation deleted successfully",
            };
        } catch (error) {
            throw new Error(`Failed to delete salutation: ${error.message}`);
        }
    }

    /**
     * Get salutation by name
     * @param {string} name - Salutation name
     * @returns {Promise<Object>} Salutation data
     */
    async readByName(name) {
        try {
            if (!name) {
                throw new Error("Salutation name is required");
            }

            const salutation = await Salutation.findOne({
                where: { name: name.trim() },
            });

            if (!salutation) {
                throw new Error("Salutation not found");
            }

            return {
                success: true,
                data: salutation,
                message: "Salutation retrieved successfully",
            };
        } catch (error) {
            throw new Error(`Failed to retrieve salutation: ${error.message}`);
        }
    }

    /**
     * Check if salutation exists by name
     * @param {string} name - Salutation name
     * @returns {Promise<boolean>} True if exists, false otherwise
     */
    async existsByName(name) {
        try {
            if (!name) {
                return false;
            }

            const salutation = await Salutation.findOne({
                where: { name: name.trim() },
            });

            return !!salutation;
        } catch (error) {
            throw new Error(
                `Failed to check salutation existence: ${error.message}`
            );
        }
    }

    /**
     * Check if salutation exists by ID (UUID)
     * @param {string} id - Salutation UUID
     * @returns {Promise<boolean>} True if exists, false otherwise
     */
    async existsById(id) {
        try {
            if (!id) {
                return false;
            }

            // Validate UUID format
            const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(id)) {
                return false;
            }

            const salutation = await Salutation.findByPk(id);
            return !!salutation;
        } catch (error) {
            throw new Error(
                `Failed to check salutation existence: ${error.message}`
            );
        }
    }

    /**
     * Search salutations by name (partial match)
     * @param {string} searchTerm - Search term for salutation name
     * @param {Object} options - Query options (limit, offset)
     * @returns {Promise<Object>} List of matching salutations
     */
    async search(searchTerm, options = {}) {
        try {
            if (!searchTerm) {
                throw new Error("Search term is required");
            }

            const { limit = 10, offset = 0 } = options;

            const salutations = await Salutation.findAndCountAll({
                where: {
                    name: {
                        [Op.like]: `%${searchTerm.trim()}%`,
                    },
                },
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [["name", "ASC"]],
            });

            return {
                success: true,
                data: salutations.rows,
                pagination: {
                    total: salutations.count,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    pages: Math.ceil(salutations.count / limit),
                },
                message: "Salutations search completed successfully",
            };
        } catch (error) {
            throw new Error(`Failed to search salutations: ${error.message}`);
        }
    }

    /**
     * Get all salutations sorted by name (for dropdown lists)
     * @returns {Promise<Object>} List of salutations sorted by name
     */
    async getAllSorted() {
        try {
            const salutations = await Salutation.findAll({
                order: [["name", "ASC"]],
            });

            return {
                success: true,
                data: salutations,
                message: "Salutations retrieved successfully",
            };
        } catch (error) {
            throw new Error(`Failed to retrieve salutations: ${error.message}`);
        }
    }
}

module.exports = new SalutationService();
