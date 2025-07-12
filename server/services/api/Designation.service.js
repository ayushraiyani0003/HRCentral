// =================== services/Designation.service.js ===================
const { Designation } = require("../../models");
const { Op } = require("sequelize");

class DesignationService {
    /**
     * Create a new designation
     * @param {Object} designationData - Designation data
     * @returns {Promise<Object>} Created designation
     */
    async create(designationData) {
        try {
            const designation = await Designation.create(designationData);
            return {
                success: true,
                data: designation,
                message: "Designation created successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to create designation",
            };
        }
    }

    /**
     * Get all designations
     * @returns {Promise<Object>} List of designations
     */
    async getAll() {
        try {
            const designations = await Designation.findAll({
                order: [["name", "ASC"]],
            });

            return {
                success: true,
                data: {
                    designations,
                },
                message: "Designations retrieved successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to retrieve designations",
            };
        }
    }

    /**
     * Get designation by ID
     * @param {string} id - Designation ID (UUID)
     * @returns {Promise<Object>} Designation data
     */
    async getById(id) {
        try {
            const designation = await Designation.findByPk(id);

            if (!designation) {
                return {
                    success: false,
                    message: "Designation not found",
                };
            }

            return {
                success: true,
                data: designation,
                message: "Designation retrieved successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to retrieve designation",
            };
        }
    }

    /**
     * Update designation
     * @param {string} id - Designation ID (UUID)
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated designation
     */
    async update(id, updateData) {
        try {
            const designation = await Designation.findByPk(id);

            if (!designation) {
                return {
                    success: false,
                    message: "Designation not found",
                };
            }

            await designation.update(updateData);

            return {
                success: true,
                data: designation,
                message: "Designation updated successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to update designation",
            };
        }
    }

    /**
     * Delete designation
     * @param {string} id - Designation ID (UUID)
     * @returns {Promise<Object>} Deletion result
     */
    async delete(id) {
        try {
            const designation = await Designation.findByPk(id);

            if (!designation) {
                return {
                    success: false,
                    message: "Designation not found",
                };
            }

            await designation.destroy();

            return {
                success: true,
                message: "Designation deleted successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to delete designation",
            };
        }
    }

    /**
     * Search designations by name
     * @param {string} searchTerm - Search term for designation name
     * @returns {Promise<Object>} List of matching designations
     */
    async searchByName(searchTerm) {
        try {
            const designations = await Designation.findAll({
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
                    designations,
                },
                message: `Designations matching '${searchTerm}' retrieved successfully`,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to search designations",
            };
        }
    }
}

module.exports = new DesignationService();
