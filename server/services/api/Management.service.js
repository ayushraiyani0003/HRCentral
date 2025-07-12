/**
 * Management Service
 * Handles business logic for Management operations
 */

const { Management } = require("../models");
const { Op } = require("sequelize");

class ManagementService {
    /**
     * Create a new management record
     * @param {Object} managementData - Management data to create
     * @param {string} managementData.name - Management name
     * @returns {Promise<Object>} Created management record
     */
    async createManagement(managementData) {
        try {
            const { name } = managementData;

            // Validate required fields
            if (!name || name.trim().length === 0) {
                throw new Error("Management name is required");
            }

            // Check if management with same name already exists
            const existingManagement = await Management.findOne({
                where: { name: name.trim() },
            });

            if (existingManagement) {
                throw new Error("Management with this name already exists");
            }

            const management = await Management.create({
                name: name.trim(),
            });

            return management;
        } catch (error) {
            throw new Error(`Failed to create management: ${error.message}`);
        }
    }

    /**
     * Get all management records
     * @param {Object} options - Query options
     * @param {number} options.page - Page number (default: 1)
     * @param {number} options.limit - Records per page (default: 10)
     * @param {string} options.search - Search term for name
     * @returns {Promise<Object>} Management records with pagination
     */
    async getAllManagement(options = {}) {
        try {
            const { page = 1, limit = 10, search } = options;
            const offset = (page - 1) * limit;

            // Build where clause for search
            const whereClause = {};
            if (search) {
                whereClause.name = {
                    [Op.iLike]: `%${search}%`,
                };
            }

            const { count, rows } = await Management.findAndCountAll({
                where: whereClause,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [["created_at", "DESC"]],
            });

            return {
                management: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit),
                },
            };
        } catch (error) {
            throw new Error(
                `Failed to fetch management records: ${error.message}`
            );
        }
    }

    /**
     * Get management record by ID
     * @param {string} id - Management ID
     * @returns {Promise<Object>} Management record
     */
    async getManagementById(id) {
        try {
            if (!id) {
                throw new Error("Management ID is required");
            }

            const management = await Management.findByPk(id);

            if (!management) {
                throw new Error("Management not found");
            }

            return management;
        } catch (error) {
            throw new Error(`Failed to fetch management: ${error.message}`);
        }
    }

    /**
     * Update management record
     * @param {string} id - Management ID
     * @param {Object} updateData - Data to update
     * @param {string} updateData.name - Management name
     * @returns {Promise<Object>} Updated management record
     */
    async updateManagement(id, updateData) {
        try {
            if (!id) {
                throw new Error("Management ID is required");
            }

            const management = await Management.findByPk(id);

            if (!management) {
                throw new Error("Management not found");
            }

            const { name } = updateData;

            // Validate name if provided
            if (name !== undefined) {
                if (!name || name.trim().length === 0) {
                    throw new Error("Management name cannot be empty");
                }

                // Check if another management with same name exists
                const existingManagement = await Management.findOne({
                    where: {
                        name: name.trim(),
                        id: { [Op.ne]: id },
                    },
                });

                if (existingManagement) {
                    throw new Error("Management with this name already exists");
                }
            }

            // Update the management record
            const updatedData = {};
            if (name !== undefined) {
                updatedData.name = name.trim();
            }

            await management.update(updatedData);

            return management;
        } catch (error) {
            throw new Error(`Failed to update management: ${error.message}`);
        }
    }

    /**
     * Delete management record
     * @param {string} id - Management ID
     * @returns {Promise<boolean>} Success status
     */
    async deleteManagement(id) {
        try {
            if (!id) {
                throw new Error("Management ID is required");
            }

            const management = await Management.findByPk(id);

            if (!management) {
                throw new Error("Management not found");
            }

            await management.destroy();

            return true;
        } catch (error) {
            throw new Error(`Failed to delete management: ${error.message}`);
        }
    }

    /**
     * Get management records by name pattern
     * @param {string} namePattern - Name pattern to search
     * @returns {Promise<Array>} Management records matching pattern
     */
    async getManagementByNamePattern(namePattern) {
        try {
            if (!namePattern) {
                throw new Error("Name pattern is required");
            }

            const management = await Management.findAll({
                where: {
                    name: {
                        [Op.iLike]: `%${namePattern}%`,
                    },
                },
                order: [["name", "ASC"]],
            });

            return management;
        } catch (error) {
            throw new Error(`Failed to search management: ${error.message}`);
        }
    }

    /**
     * Check if management exists by name
     * @param {string} name - Management name
     * @returns {Promise<boolean>} Whether management exists
     */
    async managementExists(name) {
        try {
            if (!name) {
                return false;
            }

            const management = await Management.findOne({
                where: { name: name.trim() },
            });

            return !!management;
        } catch (error) {
            throw new Error(
                `Failed to check management existence: ${error.message}`
            );
        }
    }

    /**
     * Get management count
     * @returns {Promise<number>} Total count of management records
     */
    async getManagementCount() {
        try {
            const count = await Management.count();
            return count;
        } catch (error) {
            throw new Error(`Failed to get management count: ${error.message}`);
        }
    }
}

module.exports = new ManagementService();
