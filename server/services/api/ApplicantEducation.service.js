// =================== services/ApplicantEducationService.js ===================
const { ApplicantEducation } = require("../../models");
const { Op } = require("sequelize");

class ApplicantEducationService {
    /**
     * Add education record for applicant
     * @param {Object} educationData - Education data
     * @returns {Promise<Object>} Created education record
     */
    async addEducation(educationData) {
        try {
            const education = await ApplicantEducation.create(educationData);
            return { success: true, data: education };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Get education records by applicant ID
     * @param {number} applicantId - Applicant ID
     * @returns {Promise<Object>} Education records
     */
    async getEducationByApplicantId(applicantId) {
        try {
            const educations = await ApplicantEducation.findAll({
                where: { applicant_id: applicantId },
                order: [["start_year", "DESC"]],
            });

            return { success: true, data: educations };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Update education record
     * @param {number} id - Education ID
     * @param {Object} updateData - Update data
     * @returns {Promise<Object>} Updated education record
     */
    async updateEducation(id, updateData) {
        try {
            const [updatedRowsCount] = await ApplicantEducation.update(
                updateData,
                { where: { id } }
            );

            if (updatedRowsCount === 0) {
                return { success: false, error: "Education record not found" };
            }

            const updatedEducation = await ApplicantEducation.findByPk(id);
            return { success: true, data: updatedEducation };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Delete education record
     * @param {number} id - Education ID
     * @returns {Promise<Object>} Delete result
     */
    async deleteEducation(id) {
        try {
            const deletedRowsCount = await ApplicantEducation.destroy({
                where: { id },
            });

            if (deletedRowsCount === 0) {
                return { success: false, error: "Education record not found" };
            }

            return {
                success: true,
                message: "Education record deleted successfully",
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = new ApplicantEducationService();
