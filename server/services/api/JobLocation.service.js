// =================== services/JobLocation.service.js ===================
const { JobLocation } = require("../../models");
const { Op } = require("sequelize");

class JobLocationService {
    /**
     * Create a new job location
     * @param {Object} jobLocationData - Job location data
     * @returns {Promise<Object>} Created job location
     */
    async create(jobLocationData) {
        try {
            const jobLocation = await JobLocation.create(jobLocationData);
            return {
                success: true,
                data: jobLocation,
                message: "Job location created successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to create job location",
            };
        }
    }

    /**
     * Get all job locations
     * @returns {Promise<Object>} List of job locations
     */
    async getAll() {
        try {
            const jobLocations = await JobLocation.findAll({
                order: [["name", "ASC"]],
            });

            return {
                success: true,
                data: {
                    jobLocations,
                },
                message: "Job locations retrieved successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to retrieve job locations",
            };
        }
    }

    /**
     * Get job location by ID
     * @param {number} id - Job location ID
     * @returns {Promise<Object>} Job location data
     */
    async getById(id) {
        try {
            const jobLocation = await JobLocation.findByPk(id);

            if (!jobLocation) {
                return {
                    success: false,
                    message: "Job location not found",
                };
            }

            return {
                success: true,
                data: jobLocation,
                message: "Job location retrieved successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to retrieve job location",
            };
        }
    }

    /**
     * Update job location
     * @param {number} id - Job location ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated job location
     */
    async update(id, updateData) {
        try {
            const jobLocation = await JobLocation.findByPk(id);

            if (!jobLocation) {
                return {
                    success: false,
                    message: "Job location not found",
                };
            }

            await jobLocation.update(updateData);

            return {
                success: true,
                data: jobLocation,
                message: "Job location updated successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to update job location",
            };
        }
    }

    /**
     * Delete job location
     * @param {number} id - Job location ID
     * @returns {Promise<Object>} Deletion result
     */
    async delete(id) {
        try {
            const jobLocation = await JobLocation.findByPk(id);

            if (!jobLocation) {
                return {
                    success: false,
                    message: "Job location not found",
                };
            }

            await jobLocation.destroy();

            return {
                success: true,
                message: "Job location deleted successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to delete job location",
            };
        }
    }
}

module.exports = new JobLocationService();
