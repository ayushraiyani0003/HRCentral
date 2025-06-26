// =================== services/ApplicantWorkHistoryService.js ===================
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
     * Get work history records by applicant ID
     * @param {number} applicantId - Applicant ID
     * @returns {Promise<Object>} Work history records
     */
    async getWorkHistoryByApplicantId(applicantId) {
        try {
            const workHistories = await ApplicantWorkHistory.findAll({
                where: { applicant_id: applicantId },
                order: [["start_month_year", "DESC"]],
            });

            return { success: true, data: workHistories };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Update work history record
     * @param {number} id - Work history ID
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
     * @param {number} id - Work history ID
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
     * Get current work details for applicant
     * @param {number} applicantId - Applicant ID
     * @returns {Promise<Object>} Current work details
     */
    async getCurrentWork(applicantId) {
        try {
            const currentWork = await ApplicantWorkHistory.findOne({
                where: {
                    applicant_id: applicantId,
                    is_current_work: true,
                },
            });

            return { success: true, data: currentWork };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = new ApplicantWorkHistoryService();
