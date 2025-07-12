// =================== services/ExperienceLevel.service.js ===================
const { ExperienceLevel } = require("../../models");
const { Op } = require("sequelize");

/**
 * ExperienceLevel Service
 * Handles all database operations for ExperienceLevel model
 */
class ExperienceLevelService {
    /**
     * Create a new experience level
     * @param {Object} experienceLevelData - Experience level data
     * @param {string} experienceLevelData.name - Name of the experience level
     * @returns {Promise<Object>} Created experience level object
     */
    async create(experienceLevelData) {
        try {
            // Check if experience level already exists
            const existingExperienceLevel = await ExperienceLevel.findOne({
                where: { name: experienceLevelData.name },
            });

            if (existingExperienceLevel) {
                return {
                    success: false,
                    message: "Experience level already exists",
                };
            }

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
     * Add a new experience level (alias for create - backward compatibility)
     * @param {Object} experienceLevelData - Experience level data
     * @param {string} experienceLevelData.name - Name of the experience level
     * @returns {Promise<Object>} Created experience level object
     */
    async add(experienceLevelData) {
        return await this.create(experienceLevelData);
    }

    /**
     * Get all experience levels
     * @returns {Promise<Object>} List of experience levels
     */
    async getAll() {
        try {
            const experienceLevels = await ExperienceLevel.findAll({
                order: [["name", "ASC"]],
            });

            return {
                success: true,
                data: {
                    experienceLevels,
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
     * Retrieve all experience levels (alias for getAll - backward compatibility)
     * @returns {Promise<Object>} List of experience levels
     */
    async readAll() {
        return await this.getAll();
    }

    /**
     * Get experience level by ID
     * @param {string} id - Experience level ID (UUID)
     * @returns {Promise<Object>} Experience level data
     */
    async getById(id) {
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
     * Retrieve experience level by name
     * @param {string} name - Name of the experience level
     * @returns {Promise<Object>} Experience level data
     */
    async readByName(name) {
        try {
            const experienceLevel = await ExperienceLevel.findOne({
                where: { name: name },
            });

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
                message: "Failed to retrieve experience level by name",
            };
        }
    }

    /**
     * Update experience level
     * @param {string} id - Experience level ID (UUID)
     * @param {Object} updateData - Data to update
     * @param {string} [updateData.name] - Updated name of the experience level
     * @returns {Promise<Object>} Updated experience level
     */
    async update(id, updateData) {
        try {
            const experienceLevel = await ExperienceLevel.findByPk(id);

            if (!experienceLevel) {
                return {
                    success: false,
                    message: "Experience level not found",
                };
            }

            // Check if new name already exists (if name is being updated)
            if (updateData.name && updateData.name !== experienceLevel.name) {
                const existingExperienceLevel = await ExperienceLevel.findOne({
                    where: { name: updateData.name },
                });

                if (existingExperienceLevel) {
                    return {
                        success: false,
                        message:
                            "Experience level with this name already exists",
                    };
                }
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
     * @param {string} id - Experience level ID (UUID)
     * @returns {Promise<Object>} Deletion result
     */
    async delete(id) {
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

    /**
     * Get total count of experience levels
     * @returns {Promise<Object>} Total count of experience levels
     */
    async count() {
        try {
            const count = await ExperienceLevel.count();
            return {
                success: true,
                data: { count },
                message: "Experience levels count retrieved successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to count experience levels",
            };
        }
    }

    /**
     * Check if experience level exists by name
     * @param {string} name - Name to check
     * @returns {Promise<Object>} Existence check result
     */
    async exists(name) {
        try {
            const experienceLevel = await ExperienceLevel.findOne({
                where: { name: name },
            });

            return {
                success: true,
                data: { exists: !!experienceLevel },
                message: "Experience level existence checked successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to check experience level existence",
            };
        }
    }
}

module.exports = new ExperienceLevelService();
