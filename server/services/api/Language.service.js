const { Language } = require("../models"); // Adjust path as needed

class LanguageService {
    /**
     * Create a new language
     * @param {Object} data - Language data
     * @returns {Promise<Object>} Created language
     */
    async create(data) {
        try {
            const { name } = data;

            // Validate required fields
            if (!name) {
                throw new Error("Name is required");
            }

            const language = await Language.create({
                name: name.trim(),
            });

            return {
                success: true,
                data: language,
                message: "Language created successfully",
            };
        } catch (error) {
            // Handle unique constraint violation
            if (error.name === "SequelizeUniqueConstraintError") {
                throw new Error("Language with this name already exists");
            }
            throw new Error(`Failed to create language: ${error.message}`);
        }
    }

    /**
     * Get all languages
     * @param {Object} options - Query options (limit, offset, order)
     * @returns {Promise<Object>} List of languages
     */
    async readAll(options = {}) {
        try {
            const {
                limit = 10,
                offset = 0,
                orderBy = "created_at",
                orderDirection = "DESC",
            } = options;

            const languages = await Language.findAndCountAll({
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [[orderBy, orderDirection]],
            });

            return {
                success: true,
                data: languages.rows,
                pagination: {
                    total: languages.count,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    pages: Math.ceil(languages.count / limit),
                },
                message: "Languages retrieved successfully",
            };
        } catch (error) {
            throw new Error(`Failed to retrieve languages: ${error.message}`);
        }
    }

    /**
     * Get language by ID
     * @param {string} id - Language ID (UUID)
     * @returns {Promise<Object>} Language data
     */
    async readById(id) {
        try {
            if (!id) {
                throw new Error("Language ID is required");
            }

            const language = await Language.findByPk(id);

            if (!language) {
                throw new Error("Language not found");
            }

            return {
                success: true,
                data: language,
                message: "Language retrieved successfully",
            };
        } catch (error) {
            throw new Error(`Failed to retrieve language: ${error.message}`);
        }
    }

    /**
     * Update language by ID
     * @param {string} id - Language ID (UUID)
     * @param {Object} data - Updated language data
     * @returns {Promise<Object>} Updated language
     */
    async update(id, data) {
        try {
            if (!id) {
                throw new Error("Language ID is required");
            }

            const language = await Language.findByPk(id);

            if (!language) {
                throw new Error("Language not found");
            }

            const { name } = data;

            // Validate required fields
            if (!name) {
                throw new Error("Name is required");
            }

            const updatedLanguage = await language.update({
                name: name.trim(),
            });

            return {
                success: true,
                data: updatedLanguage,
                message: "Language updated successfully",
            };
        } catch (error) {
            // Handle unique constraint violation
            if (error.name === "SequelizeUniqueConstraintError") {
                throw new Error("Language with this name already exists");
            }
            throw new Error(`Failed to update language: ${error.message}`);
        }
    }

    /**
     * Delete language by ID
     * @param {string} id - Language ID (UUID)
     * @returns {Promise<Object>} Deletion result
     */
    async delete(id) {
        try {
            if (!id) {
                throw new Error("Language ID is required");
            }

            const language = await Language.findByPk(id);

            if (!language) {
                throw new Error("Language not found");
            }

            await language.destroy();

            return {
                success: true,
                message: "Language deleted successfully",
            };
        } catch (error) {
            throw new Error(`Failed to delete language: ${error.message}`);
        }
    }

    /**
     * Get language by name
     * @param {string} name - Language name
     * @returns {Promise<Object>} Language data
     */
    async readByName(name) {
        try {
            if (!name) {
                throw new Error("Language name is required");
            }

            const language = await Language.findOne({
                where: { name: name.trim() },
            });

            if (!language) {
                throw new Error("Language not found");
            }

            return {
                success: true,
                data: language,
                message: "Language retrieved successfully",
            };
        } catch (error) {
            throw new Error(`Failed to retrieve language: ${error.message}`);
        }
    }

    /**
     * Check if language exists by name
     * @param {string} name - Language name
     * @returns {Promise<boolean>} True if exists, false otherwise
     */
    async existsByName(name) {
        try {
            if (!name) {
                return false;
            }

            const language = await Language.findOne({
                where: { name: name.trim() },
            });

            return !!language;
        } catch (error) {
            throw new Error(
                `Failed to check language existence: ${error.message}`
            );
        }
    }

    /**
     * Search languages by name (partial match)
     * @param {string} searchTerm - Search term for language name
     * @param {Object} options - Query options (limit, offset)
     * @returns {Promise<Object>} List of matching languages
     */
    async search(searchTerm, options = {}) {
        try {
            if (!searchTerm) {
                throw new Error("Search term is required");
            }

            const { limit = 10, offset = 0 } = options;

            const { Op } = require("sequelize");

            const languages = await Language.findAndCountAll({
                where: {
                    name: {
                        [Op.iLike]: `%${searchTerm.trim()}%`,
                    },
                },
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [["name", "ASC"]],
            });

            return {
                success: true,
                data: languages.rows,
                pagination: {
                    total: languages.count,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    pages: Math.ceil(languages.count / limit),
                },
                message: "Languages search completed successfully",
            };
        } catch (error) {
            throw new Error(`Failed to search languages: ${error.message}`);
        }
    }
}

module.exports = LanguageService();
