// =================== services/ApplicantTrackingService.js ===================
const {
    ApplicantTracking,
    ApplicantEducation,
    ApplicantWorkHistory,
} = require("../models");
const { Op } = require("sequelize");

class ApplicantTrackingService {
    /**
     * Create a new applicant
     * @param {Object} applicantData - Applicant data
     * @returns {Promise<Object>} Created applicant
     */
    async createApplicant(applicantData) {
        try {
            const applicant = await ApplicantTracking.create(applicantData);
            return { success: true, data: applicant };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Get all applicants with pagination and filters
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Applicants list
     */
    async getAllApplicants(options = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                status,
                department,
                position,
            } = options;
            const offset = (page - 1) * limit;

            const whereClause = {};
            if (status) whereClause.status = status;
            if (department) whereClause.department = department;
            if (position)
                whereClause.position_applied = { [Op.iLike]: `%${position}%` };

            const { count, rows } = await ApplicantTracking.findAndCountAll({
                where: whereClause,
                include: [
                    { model: ApplicantEducation, as: "educations" },
                    { model: ApplicantWorkHistory, as: "workHistories" },
                ],
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [["created_at", "DESC"]],
            });

            return {
                success: true,
                data: {
                    applicants: rows,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(count / limit),
                        totalItems: count,
                        itemsPerPage: limit,
                    },
                },
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Get applicant by ID
     * @param {number} id - Applicant ID
     * @returns {Promise<Object>} Applicant data
     */
    async getApplicantById(id) {
        try {
            const applicant = await ApplicantTracking.findByPk(id, {
                include: [
                    { model: ApplicantEducation, as: "educations" },
                    { model: ApplicantWorkHistory, as: "workHistories" },
                ],
            });

            if (!applicant) {
                return { success: false, error: "Applicant not found" };
            }

            return { success: true, data: applicant };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Update applicant status
     * @param {number} id - Applicant ID
     * @param {string} status - New status
     * @returns {Promise<Object>} Updated applicant
     */
    async updateApplicantStatus(id, status) {
        try {
            const [updatedRowsCount] = await ApplicantTracking.update(
                { status },
                { where: { id } }
            );

            if (updatedRowsCount === 0) {
                return { success: false, error: "Applicant not found" };
            }

            const updatedApplicant = await this.getApplicantById(id);
            return updatedApplicant;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Search applicants by name or mobile
     * @param {string} searchTerm - Search term
     * @returns {Promise<Object>} Search results
     */
    async searchApplicants(searchTerm) {
        try {
            const applicants = await ApplicantTracking.findAll({
                where: {
                    [Op.or]: [
                        { first_name: { [Op.iLike]: `%${searchTerm}%` } },
                        { surname: { [Op.iLike]: `%${searchTerm}%` } },
                        { mobile_no_1: { [Op.like]: `%${searchTerm}%` } },
                    ],
                },
                include: [
                    { model: ApplicantEducation, as: "educations" },
                    { model: ApplicantWorkHistory, as: "workHistories" },
                ],
            });

            return { success: true, data: applicants };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Get applicants by department
     * @param {number} departmentId - Department ID
     * @returns {Promise<Object>} Applicants list
     */
    async getApplicantsByDepartment(departmentId) {
        try {
            const applicants = await ApplicantTracking.findAll({
                where: { department: departmentId },
                include: [
                    { model: ApplicantEducation, as: "educations" },
                    { model: ApplicantWorkHistory, as: "workHistories" },
                ],
            });

            return { success: true, data: applicants };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Delete applicant
     * @param {number} id - Applicant ID
     * @returns {Promise<Object>} Delete result
     */
    async deleteApplicant(id) {
        try {
            const deletedRowsCount = await ApplicantTracking.destroy({
                where: { id },
            });

            if (deletedRowsCount === 0) {
                return { success: false, error: "Applicant not found" };
            }

            return { success: true, message: "Applicant deleted successfully" };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}
