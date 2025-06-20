const { AssetType } = require("../../models"); // Adjust path as needed

class AssetTypeService {
    /**
     * Create a new asset type
     * @param {Object} data - Asset type data
     * @returns {Promise<Object>} Created asset type
     */
    async create(data) {
        try {
            const { name } = data;

            // Validate required fields
            if (!name) {
                throw new Error("Name is required");
            }

            // Check if asset type with same name already exists
            const existingAssetType = await AssetType.findOne({
                where: { name: name.trim() },
            });

            if (existingAssetType) {
                throw new Error("Asset type with this name already exists");
            }

            const assetType = await AssetType.create({
                name: name.trim(),
            });

            return {
                success: true,
                data: assetType,
                message: "Asset type created successfully",
            };
        } catch (error) {
            throw new Error(`Failed to create asset type: ${error.message}`);
        }
    }

    /**
     * Get all asset types
     * @param {Object} options - Query options (limit, offset, order)
     * @returns {Promise<Object>} List of asset types
     */
    async readAll(options = {}) {
        try {
            const {
                limit = 10,
                offset = 0,
                orderBy = "createdAt", // Fixed: use camelCase for timestamps
                orderDirection = "DESC",
            } = options;
            console.log("AssetType model:", AssetType);
            console.log(limit);
            console.log(offset);
            console.log(orderBy);
            console.log(orderDirection);

            const assetTypes = await AssetType.findAndCountAll({
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [[orderBy, orderDirection]],
            });

            return {
                success: true,
                data: assetTypes.rows,
                pagination: {
                    total: assetTypes.count,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    pages: Math.ceil(assetTypes.count / limit),
                },
                message: "Asset types retrieved successfully",
            };
        } catch (error) {
            throw new Error(`Failed to retrieve asset types: ${error.message}`);
        }
    }

    /**
     * Get asset type by ID
     * @param {uuid} id - Asset type ID
     * @returns {Promise<Object>} Asset type data
     */
    async readById(id) {
        try {
            if (!id) {
                throw new Error("Asset type ID is required");
            }

            const assetType = await AssetType.findByPk(id);

            if (!assetType) {
                throw new Error("Asset type not found");
            }

            return {
                success: true,
                data: assetType,
                message: "Asset type retrieved successfully",
            };
        } catch (error) {
            throw new Error(`Failed to retrieve asset type: ${error.message}`);
        }
    }

    /**
     * Update asset type by ID
     * @param {uuid} id - Asset type ID
     * @param {Object} data - Updated asset type data
     * @returns {Promise<Object>} Updated asset type
     */
    async update(id, data) {
        try {
            if (!id) {
                throw new Error("Asset type ID is required");
            }

            const assetType = await AssetType.findByPk(id);

            if (!assetType) {
                throw new Error("Asset type not found");
            }

            const { name } = data;

            // Validate required fields
            if (!name) {
                throw new Error("Name is required");
            }

            // Check if another asset type with same name already exists (excluding current one)
            const existingAssetType = await AssetType.findOne({
                where: {
                    name: name.trim(),
                    id: { [require("sequelize").Op.ne]: id }, // Not equal to current id
                },
            });

            if (existingAssetType) {
                throw new Error("Asset type with this name already exists");
            }

            const updatedAssetType = await assetType.update({
                name: name.trim(),
            });

            return {
                success: true,
                data: updatedAssetType,
                message: "Asset type updated successfully",
            };
        } catch (error) {
            throw new Error(`Failed to update asset type: ${error.message}`);
        }
    }

    /**
     * Delete asset type by ID
     * @param {uuid} id - Asset type ID
     * @returns {Promise<Object>} Deletion result
     */
    async delete(id) {
        try {
            if (!id) {
                throw new Error("Asset type ID is required");
            }

            const assetType = await AssetType.findByPk(id);

            if (!assetType) {
                throw new Error("Asset type not found");
            }

            await assetType.destroy();

            return {
                success: true,
                message: "Asset type deleted successfully",
            };
        } catch (error) {
            throw new Error(`Failed to delete asset type: ${error.message}`);
        }
    }

    /**
     * Get asset type by name
     * @param {string} name - Asset type name
     * @returns {Promise<Object>} Asset type data
     */
    async readByName(name) {
        try {
            if (!name) {
                throw new Error("Asset type name is required");
            }

            const assetType = await AssetType.findOne({
                where: { name: name.trim() },
            });

            if (!assetType) {
                throw new Error("Asset type not found");
            }

            return {
                success: true,
                data: assetType,
                message: "Asset type retrieved successfully",
            };
        } catch (error) {
            throw new Error(`Failed to retrieve asset type: ${error.message}`);
        }
    }

    /**
     * Check if asset type exists by name
     * @param {string} name - Asset type name
     * @returns {Promise<boolean>} True if exists, false otherwise
     */
    async existsByName(name) {
        try {
            if (!name) {
                return false;
            }

            const assetType = await AssetType.findOne({
                where: { name: name.trim() },
            });

            return !!assetType;
        } catch (error) {
            throw new Error(
                `Failed to check asset type existence: ${error.message}`
            );
        }
    }
}

module.exports = new AssetTypeService();
