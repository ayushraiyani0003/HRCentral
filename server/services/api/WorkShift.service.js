// =================== services/WorkShift.service.js ===================
const { WorkShift } = require("../../models");
const { Op } = require("sequelize");

class WorkShiftService {
    /**
     * Create a new work shift
     * @param {Object} workShiftData - Work shift data
     * @returns {Promise<Object>} Created work shift
     */
    async create(workShiftData) {
        try {
            const workShift = await WorkShift.create(workShiftData);
            return {
                success: true,
                data: workShift,
                message: "Work shift created successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to create work shift",
            };
        }
    }

    /**
     * Get all work shifts
     * @returns {Promise<Object>} List of work shifts
     */
    async getAll() {
        try {
            const workShifts = await WorkShift.findAll({
                order: [["name", "ASC"]],
            });

            return {
                success: true,
                data: {
                    workShifts,
                },
                message: "Work shifts retrieved successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to retrieve work shifts",
            };
        }
    }

    /**
     * Get work shift by ID
     * @param {string} id - Work shift ID (UUID)
     * @returns {Promise<Object>} Work shift data
     */
    async getById(id) {
        try {
            const workShift = await WorkShift.findByPk(id);

            if (!workShift) {
                return {
                    success: false,
                    message: "Work shift not found",
                };
            }

            return {
                success: true,
                data: workShift,
                message: "Work shift retrieved successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to retrieve work shift",
            };
        }
    }

    /**
     * Update work shift
     * @param {string} id - Work shift ID (UUID)
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated work shift
     */
    async update(id, updateData) {
        try {
            const workShift = await WorkShift.findByPk(id);

            if (!workShift) {
                return {
                    success: false,
                    message: "Work shift not found",
                };
            }

            await workShift.update(updateData);

            return {
                success: true,
                data: workShift,
                message: "Work shift updated successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to update work shift",
            };
        }
    }

    /**
     * Delete work shift
     * @param {string} id - Work shift ID (UUID)
     * @returns {Promise<Object>} Deletion result
     */
    async delete(id) {
        try {
            const workShift = await WorkShift.findByPk(id);

            if (!workShift) {
                return {
                    success: false,
                    message: "Work shift not found",
                };
            }

            await workShift.destroy();

            return {
                success: true,
                message: "Work shift deleted successfully",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to delete work shift",
            };
        }
    }
}

module.exports = new WorkShiftService();
