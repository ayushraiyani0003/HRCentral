const { ApplicantWorkHistory } = require("../../models");
const { Op } = require("sequelize");

class ApplicantWorkHistoryService {
    /**
     * Add work history record for applicant
     * @param {Object} workHistoryData - Work history data
     * @returns {Promise<Object>} Created work history record
     */
    async addWorkHistory(workHistoryData) {
        try {
            const workHistory = await ApplicantWorkHistory.create(
                workHistoryData
            );
            return { success: true, data: workHistory };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Update work history record
     * @param {string} id - Work History UUID
     * @param {Object} updateData - Update data
     * @returns {Promise<Object>} Updated work history record
     */
    async updateWorkHistory(id, updateData) {
        try {
            const [updatedRowsCount] = await ApplicantWorkHistory.update(
                updateData,
                { where: { id } }
            );

            if (updatedRowsCount === 0) {
                return {
                    success: false,
                    error: "Work history record not found",
                };
            }

            const updatedWorkHistory = await ApplicantWorkHistory.findByPk(id);
            return { success: true, data: updatedWorkHistory };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Delete work history record
     * @param {string} id - Work History UUID
     * @returns {Promise<Object>} Delete result
     */
    async deleteWorkHistory(id) {
        try {
            const deletedRowsCount = await ApplicantWorkHistory.destroy({
                where: { id },
            });

            if (deletedRowsCount === 0) {
                return {
                    success: false,
                    error: "Work history record not found",
                };
            }

            return {
                success: true,
                message: "Work history record deleted successfully",
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Get work history record by ID
     * @param {string} id - Work History UUID
     * @returns {Promise<Object>} Work history record
     */
    async getWorkHistoryById(id) {
        try {
            const workHistory = await ApplicantWorkHistory.findByPk(id);

            if (!workHistory) {
                return {
                    success: false,
                    error: "Work history record not found",
                };
            }

            return { success: true, data: workHistory };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Get all work history records
     * @returns {Promise<Object>} All work history records
     */
    async getAllWorkHistories() {
        try {
            const workHistories = await ApplicantWorkHistory.findAll({
                order: [["start_month_year", "DESC"]],
            });

            return { success: true, data: workHistories };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Get current work history records (where end_month_year is null)
     * @returns {Promise<Object>} Current work history records
     */
    async getCurrentWorkHistories() {
        try {
            const workHistories = await ApplicantWorkHistory.findAll({
                where: { end_month_year: null },
                order: [["start_month_year", "DESC"]],
            });

            return { success: true, data: workHistories };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = new ApplicantWorkHistoryService();
