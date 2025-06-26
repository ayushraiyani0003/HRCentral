// =================== services/ExperienceLevel.service.js ===================
const { ExperienceLevel } = require("../../models");
const { Op } = require("sequelize");

class ExperienceLevelService {
    /**
     * Create a new experience level
     * @param {Object} experienceLevelData - Experience level data
     * @returns {Promise<Object>} Created experience level
     */
    static async create(experienceLevelData) {
        try {
            const experienceLevel = await ExperienceLevel.create(
                experienceLevelData
            );
            return {
                success: true,
                data: experienceLevel,
                message: "Experience level created successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to create experience level",
            };
        }
    }

    /**
     * Get all experience levels
     * @param {Object} options - Query options (limit, offset, search)
     * @returns {Promise<Object>} List of experience levels
     */
    static async getAll(options = {}) {
        try {
            const { limit = 10, offset = 0, search = "" } = options;

            const whereClause = search
                ? {
                      name: { [Op.like]: `%${search}%` },
                  }
                : {};

            const { count, rows } = await ExperienceLevel.findAndCountAll({
                where: whereClause,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [["name", "ASC"]],
            });

            return {
                success: true,
                data: {
                    experienceLevels: rows,
                    pagination: {
                        total: count,
                        limit: parseInt(limit),
                        offset: parseInt(offset),
                        pages: Math.ceil(count / limit),
                    },
                },
                message: "Experience levels retrieved successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to retrieve experience levels",
            };
        }
    }

    /**
     * Get experience level by ID
     * @param {number} id - Experience level ID
     * @returns {Promise<Object>} Experience level data
     */
    static async getById(id) {
        try {
            const experienceLevel = await ExperienceLevel.findByPk(id);

            if (!experienceLevel) {
                return {
                    success: false,
                    message: "Experience level not found",
                };
            }

            return {
                success: true,
                data: experienceLevel,
                message: "Experience level retrieved successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to retrieve experience level",
            };
        }
    }

    /**
     * Update experience level
     * @param {number} id - Experience level ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated experience level
     */
    static async update(id, updateData) {
        try {
            const experienceLevel = await ExperienceLevel.findByPk(id);

            if (!experienceLevel) {
                return {
                    success: false,
                    message: "Experience level not found",
                };
            }

            await experienceLevel.update(updateData);

            return {
                success: true,
                data: experienceLevel,
                message: "Experience level updated successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to update experience level",
            };
        }
    }

    /**
     * Delete experience level
     * @param {number} id - Experience level ID
     * @returns {Promise<Object>} Deletion result
     */
    static async delete(id) {
        try {
            const experienceLevel = await ExperienceLevel.findByPk(id);

            if (!experienceLevel) {
                return {
                    success: false,
                    message: "Experience level not found",
                };
            }

            await experienceLevel.destroy();

            return {
                success: true,
                message: "Experience level deleted successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to delete experience level",
            };
        }
    }
}

module.exports = new ExperienceLevelService();
