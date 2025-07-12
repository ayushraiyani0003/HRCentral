// =================== services/AssetType.service.js ===================
const { AssetType } = require("../../models");
const { Op } = require("sequelize");

class AssetTypeService {
    /**
     * Create a new asset type
     * @param {Object} assetTypeData - Asset type data
     * @returns {Promise<Object>} Created asset type
     */
    async create(assetTypeData) {
        try {
            const assetType = await AssetType.create(assetTypeData);
            return {
                success: true,
                data: assetType,
                message: "Asset type created successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to create asset type",
            };
        }
    }

    /**
     * Get all asset types
     * @returns {Promise<Object>} List of asset types
     */
    async getAll() {
        try {
            const assetTypes = await AssetType.findAll({
                order: [["name", "ASC"]],
            });

            return {
                success: true,
                data: {
                    assetTypes,
                },
                message: "Asset types retrieved successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to retrieve asset types",
            };
        }
    }

    /**
     * Get asset type by ID
     * @param {string} id - Asset type ID (UUID)
     * @returns {Promise<Object>} Asset type data
     */
    async getById(id) {
        try {
            const assetType = await AssetType.findByPk(id);

            if (!assetType) {
                return {
                    success: false,
                    message: "Asset type not found",
                };
            }

            return {
                success: true,
                data: assetType,
                message: "Asset type retrieved successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to retrieve asset type",
            };
        }
    }

    /**
     * Update asset type
     * @param {string} id - Asset type ID (UUID)
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated asset type
     */
    async update(id, updateData) {
        try {
            const assetType = await AssetType.findByPk(id);

            if (!assetType) {
                return {
                    success: false,
                    message: "Asset type not found",
                };
            }

            await assetType.update(updateData);

            return {
                success: true,
                data: assetType,
                message: "Asset type updated successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to update asset type",
            };
        }
    }

    /**
     * Delete asset type
     * @param {string} id - Asset type ID (UUID)
     * @returns {Promise<Object>} Deletion result
     */
    async delete(id) {
        try {
            const assetType = await AssetType.findByPk(id);

            if (!assetType) {
                return {
                    success: false,
                    message: "Asset type not found",
                };
            }

            await assetType.destroy();

            return {
                success: true,
                message: "Asset type deleted successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to delete asset type",
            };
        }
    }
}

module.exports = new AssetTypeService();
