// =================== services/WorkShift.service.js ===================
const { WorkShift } = require("../models");
const { Op } = require("sequelize");

class WorkShiftService {
    /**
     * Create a new work shift
     * @param {Object} workShiftData - Work shift data
     * @returns {Promise<Object>} Created work shift
     */
    static async create(workShiftData) {
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
     * @param {Object} options - Query options (limit, offset, search)
     * @returns {Promise<Object>} List of work shifts
     */
    static async getAll(options = {}) {
        try {
            const { limit = 10, offset = 0, search = "" } = options;

            const whereClause = search
                ? {
                      name: { [Op.iLike]: `%${search}%` },
                  }
                : {};

            const { count, rows } = await WorkShift.findAndCountAll({
                where: whereClause,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [["start_time", "ASC"]],
            });

            return {
                success: true,
                data: {
                    workShifts: rows,
                    pagination: {
                        total: count,
                        limit: parseInt(limit),
                        offset: parseInt(offset),
                        pages: Math.ceil(count / limit),
                    },
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
     * @param {number} id - Work shift ID
     * @returns {Promise<Object>} Work shift data
     */
    static async getById(id) {
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
     * @param {number} id - Work shift ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated work shift
     */
    static async update(id, updateData) {
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
     * @param {number} id - Work shift ID
     * @returns {Promise<Object>} Deletion result
     */
    static async delete(id) {
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

    /**
     * Check for overlapping shifts
     * @param {string} startTime - Start time (HH:MM format)
     * @param {string} endTime - End time (HH:MM format)
     * @param {number} excludeId - ID to exclude from check (for updates)
     * @returns {Promise<Object>} Overlap check result
     */
    static async checkOverlap(startTime, endTime, excludeId = null) {
        try {
            const whereClause = {
                [Op.or]: [
                    {
                        start_time: {
                            [Op.between]: [startTime, endTime],
                        },
                    },
                    {
                        end_time: {
                            [Op.between]: [startTime, endTime],
                        },
                    },
                    {
                        [Op.and]: [
                            { start_time: { [Op.lte]: startTime } },
                            { end_time: { [Op.gte]: endTime } },
                        ],
                    },
                ],
            };

            if (excludeId) {
                whereClause.id = { [Op.ne]: excludeId };
            }

            const overlappingShifts = await WorkShift.findAll({
                where: whereClause,
            });

            return {
                success: true,
                hasOverlap: overlappingShifts.length > 0,
                overlappingShifts,
                message:
                    overlappingShifts.length > 0
                        ? "Overlapping shifts found"
                        : "No overlapping shifts",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: "Failed to check for overlapping shifts",
            };
        }
    }
}

module.exports = WorkShiftService;
