/**
 * @fileoverview Controller for Asset Type operations
 * @version 1.0.0
 */

const AssetTypeService = require("../../services/api/AssetType.service"); // Adjust path as needed

class AssetTypeController {
    /**
     * Create a new asset type
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async createAssetType(req, res) {
        try {
            const result = await AssetTypeService.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get all asset types with pagination and filtering
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getAllAssetTypes(req, res) {
        try {
            const options = {
                limit: req.query.limit || 10,
                offset: req.query.offset || 0,
                orderBy: req.query.orderBy || "createdAt",
                orderDirection: req.query.orderDirection || "DESC",
            };

            const result = await AssetTypeService.readAll(options);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get asset type by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getAssetTypeById(req, res) {
        try {
            const { id } = req.params;
            const result = await AssetTypeService.readById(id);
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
     * Update asset type by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async updateAssetType(req, res) {
        try {
            const { id } = req.params;
            const result = await AssetTypeService.update(id, req.body);
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
     * Delete asset type by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async deleteAssetType(req, res) {
        try {
            const { id } = req.params;
            const result = await AssetTypeService.delete(id);
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
     * Get asset type by name
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getAssetTypeByName(req, res) {
        try {
            const { name } = req.params;
            const result = await AssetTypeService.readByName(name);
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
     * Check if asset type exists by name
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async checkAssetTypeExists(req, res) {
        try {
            const { name } = req.params;
            const exists = await AssetTypeService.existsByName(name);
            res.status(200).json({
                success: true,
                exists: exists,
                message: exists
                    ? "Asset type exists"
                    : "Asset type does not exist",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = new AssetTypeController();
