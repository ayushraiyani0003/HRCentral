// =================== services/Language.service.js ===================
const { Language } = require("../../models");
const { Op } = require("sequelize");

class LanguageService {
    /**
     * Create a new language
     * @param {Object} languageData - Language data
     * @returns {Promise<Object>} Created language
     */
    async create(languageData) {
        try {
            const language = await Language.create(languageData);
            return {
                success: true,
                data: language,
                message: "Language created successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to create language",
            };
        }
    }

    /**
     * Get all languages
     * @returns {Promise<Object>} List of languages
     */
    async getAll() {
        try {
            const languages = await Language.findAll({
                order: [["name", "ASC"]],
            });

            return {
                success: true,
                data: {
                    languages,
                },
                message: "Languages retrieved successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to retrieve languages",
            };
        }
    }

    /**
     * Get language by ID
     * @param {string} id - Language ID (UUID)
     * @returns {Promise<Object>} Language data
     */
    async getById(id) {
        try {
            const language = await Language.findByPk(id);

            if (!language) {
                return {
                    success: false,
                    message: "Language not found",
                };
            }

            return {
                success: true,
                data: language,
                message: "Language retrieved successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to retrieve language",
            };
        }
    }

    /**
     * Update language
     * @param {string} id - Language ID (UUID)
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated language
     */
    async update(id, updateData) {
        try {
            const language = await Language.findByPk(id);

            if (!language) {
                return {
                    success: false,
                    message: "Language not found",
                };
            }

            await language.update(updateData);

            return {
                success: true,
                data: language,
                message: "Language updated successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to update language",
            };
        }
    }

    /**
     * Delete language
     * @param {string} id - Language ID (UUID)
     * @returns {Promise<Object>} Deletion result
     */
    async delete(id) {
        try {
            const language = await Language.findByPk(id);

            if (!language) {
                return {
                    success: false,
                    message: "Language not found",
                };
            }

            await language.destroy();

            return {
                success: true,
                message: "Language deleted successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to delete language",
            };
        }
    }
}

module.exports = new LanguageService();
