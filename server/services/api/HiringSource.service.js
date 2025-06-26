// =================== services/HiringSource.service.js ===================
const { HiringSource } = require("../models");
const { Op } = require("sequelize");

class HiringSourceService {
    /**
     * Create a new hiring source
     * @param {Object} hiringSourceData - Hiring source data
     * @returns {Promise<Object>} Created hiring source
     */
    async create(hiringSourceData) {
        try {
            const hiringSource = await HiringSource.create(hiringSourceData);
            return {
                success: true,
                data: hiringSource,
                message: "Hiring source created successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to create hiring source",
            };
        }
    }

    /**
     * Get all hiring sources
     * @param {Object} options - Query options (limit, offset, search)
     * @returns {Promise<Object>} List of hiring sources
     */
    async getAll(options = {}) {
        try {
            const { limit = 10, offset = 0, search = "" } = options;

            const whereClause = search
                ? {
                      name: { [Op.like]: `%${search}%` },
                  }
                : {};

            const { count, rows } = await HiringSource.findAndCountAll({
                where: whereClause,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [["name", "ASC"]],
            });

            return {
                success: true,
                data: {
                    hiringSources: rows,
                    pagination: {
                        total: count,
                        limit: parseInt(limit),
                        offset: parseInt(offset),
                        pages: Math.ceil(count / limit),
                    },
                },
                message: "Hiring sources retrieved successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to retrieve hiring sources",
            };
        }
    }

    /**
     * Get hiring source by ID
     * @param {number} id - Hiring source ID
     * @returns {Promise<Object>} Hiring source data
     */
    async getById(id) {
        try {
            const hiringSource = await HiringSource.findByPk(id);

            if (!hiringSource) {
                return {
                    success: false,
                    message: "Hiring source not found",
                };
            }

            return {
                success: true,
                data: hiringSource,
                message: "Hiring source retrieved successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to retrieve hiring source",
            };
        }
    }

    /**
     * Update hiring source
     * @param {number} id - Hiring source ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated hiring source
     */
    async update(id, updateData) {
        try {
            const hiringSource = await HiringSource.findByPk(id);

            if (!hiringSource) {
                return {
                    success: false,
                    message: "Hiring source not found",
                };
            }

            await hiringSource.update(updateData);

            return {
                success: true,
                data: hiringSource,
                message: "Hiring source updated successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to update hiring source",
            };
        }
    }

    /**
     * Delete hiring source
     * @param {number} id - Hiring source ID
     * @returns {Promise<Object>} Deletion result
     */
    async delete(id) {
        try {
            const hiringSource = await HiringSource.findByPk(id);

            if (!hiringSource) {
                return {
                    success: false,
                    message: "Hiring source not found",
                };
            }

            await hiringSource.destroy();

            return {
                success: true,
                message: "Hiring source deleted successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to delete hiring source",
            };
        }
    }
}

module.exports = new HiringSourceService();
