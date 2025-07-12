const { ApplicantEducation } = require("../../models");
const { Op } = require("sequelize");

class ApplicantEducationService {
    /**
     * Add education record for applicant
     * @param {Object} educationData - Education data
     * @returns {Promise<Object>} Created education record
     */
    async addEducation(educationData) {
        console.log(educationData);

        try {
            const education = await ApplicantEducation.create(educationData);
            return { success: true, data: education };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Update education record
     * @param {string} id - Education UUID
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
     * @param {string} id - Education UUID
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

    /**
     * Get education record by ID
     * @param {string} id - Education UUID
     * @returns {Promise<Object>} Education record
     */
    async getEducationById(id) {
        try {
            const education = await ApplicantEducation.findByPk(id);

            if (!education) {
                return { success: false, error: "Education record not found" };
            }

            return { success: true, data: education };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Get all education records
     * @returns {Promise<Object>} All education records
     */
    async getAllEducations() {
        try {
            const educations = await ApplicantEducation.findAll({
                order: [["year_of_passing", "DESC"]],
            });

            return { success: true, data: educations };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = new ApplicantEducationService();
