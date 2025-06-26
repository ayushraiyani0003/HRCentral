// =================== services/EducationLevelService.js ===================
class EducationLevelService {
    /**
     * Create a new education level
     * @param {Object} educationLevelData - Education level data
     * @returns {Promise<Object>} Created education level
     */
    async createEducationLevel(educationLevelData) {
        try {
            const educationLevel = await EducationLevel.create(
                educationLevelData
            );
            return { success: true, data: educationLevel };
        } catch (error) {
            if (error.name === "SequelizeUniqueConstraintError") {
                return {
                    success: false,
                    error: "Education level name already exists",
                };
            }
            return { success: false, error: error.message };
        }
    }

    /**
     * Get all education levels
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Education levels list
     */
    async getAllEducationLevels(options = {}) {
        try {
            const { page, limit } = options;
            let queryOptions = {
                order: [["name", "ASC"]],
            };

            if (page && limit) {
                const offset = (page - 1) * limit;
                queryOptions.limit = parseInt(limit);
                queryOptions.offset = parseInt(offset);
            }

            const educationLevels = await EducationLevel.findAll(queryOptions);
            return { success: true, data: educationLevels };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Get education level by ID
     * @param {number} id - Education level ID
     * @returns {Promise<Object>} Education level data
     */
    async getEducationLevelById(id) {
        try {
            const educationLevel = await EducationLevel.findByPk(id);

            if (!educationLevel) {
                return { success: false, error: "Education level not found" };
            }

            return { success: true, data: educationLevel };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Update education level
     * @param {number} id - Education level ID
     * @param {Object} updateData - Update data
     * @returns {Promise<Object>} Updated education level
     */
    async updateEducationLevel(id, updateData) {
        try {
            const [updatedRowsCount] = await EducationLevel.update(updateData, {
                where: { id },
            });

            if (updatedRowsCount === 0) {
                return { success: false, error: "Education level not found" };
            }

            const updatedEducationLevel = await EducationLevel.findByPk(id);
            return { success: true, data: updatedEducationLevel };
        } catch (error) {
            if (error.name === "SequelizeUniqueConstraintError") {
                return {
                    success: false,
                    error: "Education level name already exists",
                };
            }
            return { success: false, error: error.message };
        }
    }

    /**
     * Delete education level
     * @param {number} id - Education level ID
     * @returns {Promise<Object>} Delete result
     */
    async deleteEducationLevel(id) {
        try {
            const deletedRowsCount = await EducationLevel.destroy({
                where: { id },
            });

            if (deletedRowsCount === 0) {
                return { success: false, error: "Education level not found" };
            }

            return {
                success: true,
                message: "Education level deleted successfully",
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Search education levels by name
     * @param {string} searchTerm - Search term
     * @returns {Promise<Object>} Search results
     */
    async searchEducationLevels(searchTerm) {
        try {
            const educationLevels = await EducationLevel.findAll({
                where: {
                    name: { [Op.iLike]: `%${searchTerm}%` },
                },
                order: [["name", "ASC"]],
            });

            return { success: true, data: educationLevels };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}
