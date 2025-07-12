// =================== services/EducationLevel.service.js ===================
const { EducationLevel } = require("../../models");
const { Op } = require("sequelize");

class EducationLevelService {
    /**
     * Create a new education level
     * @param {Object} educationLevelData - Education level data
     * @returns {Promise<Object>} Created education level
     */
    async create(educationLevelData) {
        try {
            const educationLevel = await EducationLevel.create(
                educationLevelData
            );
            return {
                success: true,
                data: educationLevel,
                message: "Education level created successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to create education level",
            };
        }
    }

    /**
     * Get all education levels
     * @returns {Promise<Object>} List of education levels
     */
    async getAll() {
        try {
            const educationLevels = await EducationLevel.findAll({
                order: [["name", "ASC"]],
            });

            return {
                success: true,
                data: {
                    educationLevels,
                },
                message: "Education levels retrieved successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to retrieve education levels",
            };
        }
    }

    /**
     * Get education level by ID
     * @param {string} id - Education level ID (UUID)
     * @returns {Promise<Object>} Education level data
     */
    async getById(id) {
        try {
            const educationLevel = await EducationLevel.findByPk(id);

            if (!educationLevel) {
                return {
                    success: false,
                    message: "Education level not found",
                };
            }

            return {
                success: true,
                data: educationLevel,
                message: "Education level retrieved successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to retrieve education level",
            };
        }
    }

    /**
     * Update education level
     * @param {string} id - Education level ID (UUID)
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated education level
     */
    async update(id, updateData) {
        try {
            const educationLevel = await EducationLevel.findByPk(id);

            if (!educationLevel) {
                return {
                    success: false,
                    message: "Education level not found",
                };
            }

            await educationLevel.update(updateData);

            return {
                success: true,
                data: educationLevel,
                message: "Education level updated successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to update education level",
            };
        }
    }

    /**
     * Delete education level
     * @param {string} id - Education level ID (UUID)
     * @returns {Promise<Object>} Deletion result
     */
    async delete(id) {
        try {
            const educationLevel = await EducationLevel.findByPk(id);

            if (!educationLevel) {
                return {
                    success: false,
                    message: "Education level not found",
                };
            }

            await educationLevel.destroy();

            return {
                success: true,
                message: "Education level deleted successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to delete education level",
            };
        }
    }

    /**
     * Search education levels by name
     * @param {string} searchTerm - Search term for education level name
     * @returns {Promise<Object>} List of matching education levels
     */
    async searchByName(searchTerm) {
        try {
            const educationLevels = await EducationLevel.findAll({
                where: {
                    name: {
                        [Op.iLike]: `%${searchTerm}%`,
                    },
                },
                order: [["name", "ASC"]],
            });

            return {
                success: true,
                data: {
                    educationLevels,
                },
                message: `Education levels matching '${searchTerm}' retrieved successfully`,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to search education levels",
            };
        }
    }
}

module.exports = new EducationLevelService();
