// =================== services/DesignationService.js ===================
class DesignationService {
    /**
     * Create a new designation
     * @param {Object} designationData - Designation data
     * @returns {Promise<Object>} Created designation
     */
    async createDesignation(designationData) {
        try {
            const designation = await Designation.create(designationData);
            return { success: true, data: designation };
        } catch (error) {
            if (error.name === "SequelizeUniqueConstraintError") {
                return {
                    success: false,
                    error: "Designation name already exists",
                };
            }
            return { success: false, error: error.message };
        }
    }

    /**
     * Get all designations
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Designations list
     */
    async getAllDesignations(options = {}) {
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

            const designations = await Designation.findAll(queryOptions);
            return { success: true, data: designations };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Get designation by ID
     * @param {string} id - Designation ID (UUID)
     * @returns {Promise<Object>} Designation data
     */
    async getDesignationById(id) {
        try {
            const designation = await Designation.findByPk(id);

            if (!designation) {
                return { success: false, error: "Designation not found" };
            }

            return { success: true, data: designation };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Update designation
     * @param {string} id - Designation ID
     * @param {Object} updateData - Update data
     * @returns {Promise<Object>} Updated designation
     */
    async updateDesignation(id, updateData) {
        try {
            const [updatedRowsCount] = await Designation.update(updateData, {
                where: { id },
            });

            if (updatedRowsCount === 0) {
                return { success: false, error: "Designation not found" };
            }

            const updatedDesignation = await Designation.findByPk(id);
            return { success: true, data: updatedDesignation };
        } catch (error) {
            if (error.name === "SequelizeUniqueConstraintError") {
                return {
                    success: false,
                    error: "Designation name already exists",
                };
            }
            return { success: false, error: error.message };
        }
    }

    /**
     * Delete designation
     * @param {string} id - Designation ID
     * @returns {Promise<Object>} Delete result
     */
    async deleteDesignation(id) {
        try {
            const deletedRowsCount = await Designation.destroy({
                where: { id },
            });

            if (deletedRowsCount === 0) {
                return { success: false, error: "Designation not found" };
            }

            return {
                success: true,
                message: "Designation deleted successfully",
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Search designations by name
     * @param {string} searchTerm - Search term
     * @returns {Promise<Object>} Search results
     */
    async searchDesignations(searchTerm) {
        try {
            const designations = await Designation.findAll({
                where: {
                    name: { [Op.iLike]: `%${searchTerm}%` },
                },
                order: [["name", "ASC"]],
            });

            return { success: true, data: designations };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}
