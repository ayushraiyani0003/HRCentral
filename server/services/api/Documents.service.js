const { Documents } = require("../../models");
const { Op } = require("sequelize");

class DocumentsService {
    /**
     * Upload/Create document record for employee
     * @param {Object} documentData - Document data
     * @returns {Promise<Object>} Created document record
     */
    async uploadDocument(documentData) {
        console.log(documentData);

        try {
            const document = await Documents.create(documentData);
            return { success: true, data: document };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Update document record
     * @param {string} id - Document UUID
     * @param {Object} updateData - Update data
     * @returns {Promise<Object>} Updated document record
     */
    async updateDocument(id, updateData) {
        try {
            const [updatedRowsCount] = await Documents.update(updateData, {
                where: { id },
            });

            if (updatedRowsCount === 0) {
                return { success: false, error: "Document record not found" };
            }

            const updatedDocument = await Documents.findByPk(id);
            return { success: true, data: updatedDocument };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Delete document record
     * @param {string} id - Document UUID
     * @returns {Promise<Object>} Delete result
     */
    async deleteDocument(id) {
        try {
            const deletedRowsCount = await Documents.destroy({
                where: { id },
            });

            if (deletedRowsCount === 0) {
                return { success: false, error: "Document record not found" };
            }

            return {
                success: true,
                message: "Document record deleted successfully",
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Get document record by ID
     * @param {string} id - Document UUID
     * @returns {Promise<Object>} Document record
     */
    async getDocumentById(id) {
        try {
            const document = await Documents.findByPk(id);

            if (!document) {
                return { success: false, error: "Document record not found" };
            }

            return { success: true, data: document };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Get all document records
     * @returns {Promise<Object>} All document records
     */
    async getAllDocuments() {
        try {
            const documents = await Documents.findAll({
                order: [["created_at", "DESC"]],
            });

            return { success: true, data: documents };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = new DocumentsService();
