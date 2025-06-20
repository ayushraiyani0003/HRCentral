/**
 * @fileoverview Language Controller - Handles HTTP requests for language management
 * @version 1.0.0
 */

const LanguageService = require("../../services/api/Language.service"); // Adjust path as needed

class LanguageController {
    /**
     * Create a new language
     * @route POST /api/language
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async createLanguage(req, res) {
        try {
            const result = await LanguageService.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get all languages with pagination and sorting
     * @route GET /api/language
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getAllLanguages(req, res) {
        try {
            const options = {
                limit: req.query.limit,
                offset: req.query.offset,
                orderBy: req.query.orderBy,
                orderDirection: req.query.orderDirection,
            };

            const result = await LanguageService.readAll(options);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get language by ID
     * @route GET /api/language/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getLanguageById(req, res) {
        try {
            const { id } = req.params;
            const result = await LanguageService.readById(id);
            res.status(200).json(result);
        } catch (error) {
            const statusCode = error.message.includes("not found") ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Update language by ID
     * @route PUT /api/language/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async updateLanguage(req, res) {
        try {
            const { id } = req.params;
            const result = await LanguageService.update(id, req.body);
            res.status(200).json(result);
        } catch (error) {
            const statusCode = error.message.includes("not found") ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Delete language by ID
     * @route DELETE /api/language/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async deleteLanguage(req, res) {
        try {
            const { id } = req.params;
            const result = await LanguageService.delete(id);
            res.status(200).json(result);
        } catch (error) {
            const statusCode = error.message.includes("not found") ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get language by name
     * @route GET /api/language/name/:name
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getLanguageByName(req, res) {
        try {
            const { name } = req.params;
            const result = await LanguageService.readByName(name);
            res.status(200).json(result);
        } catch (error) {
            const statusCode = error.message.includes("not found") ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Check if language exists by name
     * @route GET /api/language/exists/:name
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async checkLanguageExists(req, res) {
        try {
            const { name } = req.params;
            const exists = await LanguageService.existsByName(name);
            res.status(200).json({
                success: true,
                exists: exists,
                message: exists ? "Language exists" : "Language does not exist",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Search languages by name (partial match)
     * @route GET /api/language/search/:searchTerm
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async searchLanguages(req, res) {
        try {
            const { searchTerm } = req.params;

            // Convert and apply defaults
            const limit = Number.parseInt(req.query.limit, 10) || 10;
            const offset = Number.parseInt(req.query.offset, 10) || 0;
            console.log(typeof limit, limit); // -> "number" 10
            console.log(typeof offset, offset); // -> "number" 0

            // Optional: sanity‑check the numbers
            if (limit <= 0 || offset < 0) {
                return res.status(400).json({
                    success: false,
                    message: "limit must be > 0 and offset ≥ 0",
                });
            }

            const result = await LanguageService.search(searchTerm.trim(), {
                limit,
                offset,
            });

            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = new LanguageController();
