/**
 * Interview Service
 * Handles business logic for interview operations
 */

const {
    Interview,
    Employee,
    Management,
    CompanyStructure,
} = require("../../models");
const { Op } = require("sequelize");

class InterviewService {
    /**
     * Create a new interview
     * @param {Object} interviewData - Interview data
     * @returns {Promise<Object>} Created interview
     */
    async create(interviewData) {
        try {
            const interview = await Interview.create(interviewData);
            return {
                success: true,
                data: interview,
                message: "Interview created successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to create interview",
            };
        }
    }

    /**
     * Get all interviews
     * @returns {Promise<Object>} List of interviews
     */
    async getAll() {
        try {
            const interviews = await Interview.findAll({
                include: [
                    {
                        model: Employee,
                        as: "interviewerEmployee",
                        required: false,
                    },
                    {
                        model: Management,
                        as: "interviewerManagement",
                        required: false,
                    },
                    {
                        model: CompanyStructure,
                        as: "department",
                        required: false,
                    },
                ],
                order: [["created_at", "DESC"]],
            });

            return {
                success: true,
                data: {
                    interviews,
                },
                message: "Interviews retrieved successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to retrieve interviews",
            };
        }
    }

    /**
     * Get interview by ID
     * @param {string} id - Interview ID (UUID)
     * @returns {Promise<Object>} Interview data
     */
    async getById(id) {
        try {
            const interview = await Interview.findByPk(id, {
                include: [
                    {
                        model: Employee,
                        as: "interviewerEmployee",
                        required: false,
                    },
                    {
                        model: Management,
                        as: "interviewerManagement",
                        required: false,
                    },
                    {
                        model: CompanyStructure,
                        as: "department",
                        required: false,
                    },
                ],
            });

            if (!interview) {
                return {
                    success: false,
                    message: "Interview not found",
                };
            }

            return {
                success: true,
                data: interview,
                message: "Interview retrieved successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to retrieve interview",
            };
        }
    }

    /**
     * Update interview
     * @param {string} id - Interview ID (UUID)
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated interview
     */
    async update(id, updateData) {
        try {
            const interview = await Interview.findByPk(id);

            if (!interview) {
                return {
                    success: false,
                    message: "Interview not found",
                };
            }

            await interview.update(updateData);

            return {
                success: true,
                data: interview,
                message: "Interview updated successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to update interview",
            };
        }
    }

    /**
     * Delete interview
     * @param {string} id - Interview ID (UUID)
     * @returns {Promise<Object>} Deletion result
     */
    async delete(id) {
        try {
            const interview = await Interview.findByPk(id);

            if (!interview) {
                return {
                    success: false,
                    message: "Interview not found",
                };
            }

            await interview.destroy();

            return {
                success: true,
                message: "Interview deleted successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to delete interview",
            };
        }
    }
}

module.exports = new InterviewService();
