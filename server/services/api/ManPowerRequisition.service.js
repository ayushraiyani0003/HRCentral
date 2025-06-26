/**
 * ManPowerRequisition Service
 * Handles all business logic for manpower requisition operations
 */

const { Op } = require("sequelize");
const db = require("../models"); // Adjust path as needed

class ManPowerRequisitionService {
    constructor() {
        this.model = db.ManPowerRequisition;
    }

    /**
     * Create a new manpower requisition
     * @param {Object} requisitionData - The requisition data
     * @param {number} userId - ID of the user creating the requisition
     * @returns {Promise<Object>} Created requisition
     */
    async createRequisition(requisitionData, userId) {
        try {
            const requisition = await this.model.create({
                ...requisitionData,
                requestedBy: userId,
                lastChangedBy: userId,
            });

            return {
                success: true,
                data: requisition,
                message: "Manpower requisition created successfully",
            };
        } catch (error) {
            throw new Error(`Failed to create requisition: ${error.message}`);
        }
    }

    /**
     * Get all requisitions with filtering and pagination
     * @param {Object} options - Query options
     * @param {number} options.page - Page number
     * @param {number} options.limit - Items per page
     * @param {Object} options.filters - Filter criteria
     * @returns {Promise<Object>} Paginated requisitions
     */
    async getAllRequisitions(options = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                filters = {},
                sortBy = "requestedDate",
                sortOrder = "DESC",
            } = options;

            const offset = (page - 1) * limit;
            const where = this._buildWhereClause(filters);

            const { rows: requisitions, count: total } =
                await this.model.findAndCountAll({
                    where,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    order: [[sortBy, sortOrder]],
                    include: [
                        // TODO: Uncomment when models are available
                        // {
                        //     model: db.Employee,
                        //     as: 'requester',
                        //     attributes: ['id', 'firstName', 'lastName', 'email']
                        // },
                        // {
                        //     model: db.CompanyStructure,
                        //     as: 'department',
                        //     attributes: ['id', 'name', 'code']
                        // },
                        // {
                        //     model: db.Designation,
                        //     as: 'designation',
                        //     attributes: ['id', 'title', 'code']
                        // }
                    ],
                });

            return {
                success: true,
                data: {
                    requisitions,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil(total / limit),
                        totalItems: total,
                        itemsPerPage: parseInt(limit),
                    },
                },
            };
        } catch (error) {
            throw new Error(`Failed to fetch requisitions: ${error.message}`);
        }
    }

    /**
     * Get requisition by ID
     * @param {number} id - Requisition ID
     * @returns {Promise<Object>} Requisition details
     */
    async getRequisitionById(id) {
        try {
            const requisition = await this.model.findByPk(id, {
                include: [
                    // TODO: Uncomment when models are available
                    // {
                    //     model: db.Employee,
                    //     as: 'requester',
                    //     attributes: ['id', 'firstName', 'lastName', 'email']
                    // },
                    // {
                    //     model: db.CompanyStructure,
                    //     as: 'department',
                    //     attributes: ['id', 'name', 'code']
                    // },
                    // {
                    //     model: db.Designation,
                    //     as: 'designation',
                    //     attributes: ['id', 'title', 'code']
                    // },
                    // {
                    //     model: db.Employee,
                    //     as: 'approver',
                    //     attributes: ['id', 'firstName', 'lastName']
                    // }
                ],
            });

            if (!requisition) {
                return {
                    success: false,
                    message: "Requisition not found",
                };
            }

            return {
                success: true,
                data: requisition,
            };
        } catch (error) {
            throw new Error(`Failed to fetch requisition: ${error.message}`);
        }
    }

    /**
     * Get requisition by request ID
     * @param {string} requestId - Request ID (e.g., req-25-06-0001)
     * @returns {Promise<Object>} Requisition details
     */
    async getRequisitionByRequestId(requestId) {
        try {
            const requisition = await this.model.findOne({
                where: { requestId },
                include: [
                    // TODO: Add includes when models are available
                ],
            });

            if (!requisition) {
                return {
                    success: false,
                    message: "Requisition not found",
                };
            }

            return {
                success: true,
                data: requisition,
            };
        } catch (error) {
            throw new Error(`Failed to fetch requisition: ${error.message}`);
        }
    }

    /**
     * Update requisition
     * @param {number} id - Requisition ID
     * @param {Object} updateData - Data to update
     * @param {number} userId - ID of user making the update
     * @returns {Promise<Object>} Updated requisition
     */
    async updateRequisition(id, updateData, userId) {
        try {
            const requisition = await this.model.findByPk(id);

            if (!requisition) {
                return {
                    success: false,
                    message: "Requisition not found",
                };
            }

            await requisition.update({
                ...updateData,
                lastChangedBy: userId,
            });

            return {
                success: true,
                data: requisition,
                message: "Requisition updated successfully",
            };
        } catch (error) {
            throw new Error(`Failed to update requisition: ${error.message}`);
        }
    }

    /**
     * Approve requisition
     * @param {number} id - Requisition ID
     * @param {number} approverId - ID of approver
     * @returns {Promise<Object>} Updated requisition
     */
    async approveRequisition(id, approverId) {
        try {
            const requisition = await this.model.findByPk(id);

            if (!requisition) {
                return {
                    success: false,
                    message: "Requisition not found",
                };
            }

            if (requisition.approvalStatus === "approved") {
                return {
                    success: false,
                    message: "Requisition is already approved",
                };
            }

            await requisition.update({
                approvalStatus: "approved",
                approvedBy: approverId,
                approvedDate: new Date(),
                requisitionStatus: "in_process",
                lastChangedBy: approverId,
            });

            return {
                success: true,
                data: requisition,
                message: "Requisition approved successfully",
            };
        } catch (error) {
            throw new Error(`Failed to approve requisition: ${error.message}`);
        }
    }

    /**
     * Reject requisition
     * @param {number} id - Requisition ID
     * @param {number} rejectorId - ID of person rejecting
     * @returns {Promise<Object>} Updated requisition
     */
    async rejectRequisition(id, rejectorId) {
        try {
            const requisition = await this.model.findByPk(id);

            if (!requisition) {
                return {
                    success: false,
                    message: "Requisition not found",
                };
            }

            await requisition.update({
                approvalStatus: "rejected",
                requisitionStatus: "cancelled",
                lastChangedBy: rejectorId,
            });

            return {
                success: true,
                data: requisition,
                message: "Requisition rejected successfully",
            };
        } catch (error) {
            throw new Error(`Failed to reject requisition: ${error.message}`);
        }
    }

    /**
     * Put requisition on hold
     * @param {number} id - Requisition ID
     * @param {number} holderId - ID of person putting on hold
     * @returns {Promise<Object>} Updated requisition
     */
    async holdRequisition(id, holderId) {
        try {
            const requisition = await this.model.findByPk(id);

            if (!requisition) {
                return {
                    success: false,
                    message: "Requisition not found",
                };
            }

            await requisition.update({
                approvalStatus: "on_hold",
                requisitionStatus: "on_hold",
                onHoldBy: holderId,
                lastChangedBy: holderId,
            });

            return {
                success: true,
                data: requisition,
                message: "Requisition put on hold successfully",
            };
        } catch (error) {
            throw new Error(`Failed to hold requisition: ${error.message}`);
        }
    }

    /**
     * Complete requisition
     * @param {number} id - Requisition ID
     * @param {Object} completionData - Completion data including dateOfJoining
     * @param {number} userId - ID of user completing
     * @returns {Promise<Object>} Updated requisition
     */
    async completeRequisition(id, completionData, userId) {
        try {
            const requisition = await this.model.findByPk(id);

            if (!requisition) {
                return {
                    success: false,
                    message: "Requisition not found",
                };
            }

            if (requisition.approvalStatus !== "approved") {
                return {
                    success: false,
                    message: "Requisition must be approved before completion",
                };
            }

            await requisition.update({
                requisitionStatus: "completed",
                requestCompletedDate: new Date(),
                dateOfJoining: completionData.dateOfJoining,
                lastChangedBy: userId,
            });

            return {
                success: true,
                data: requisition,
                message: "Requisition completed successfully",
            };
        } catch (error) {
            throw new Error(`Failed to complete requisition: ${error.message}`);
        }
    }

    /**
     * Soft delete requisition
     * @param {number} id - Requisition ID
     * @param {number} userId - ID of user deleting
     * @returns {Promise<Object>} Result
     */
    async deleteRequisition(id, userId) {
        try {
            const requisition = await this.model.findByPk(id);

            if (!requisition) {
                return {
                    success: false,
                    message: "Requisition not found",
                };
            }

            await requisition.update({
                isActive: false,
                lastChangedBy: userId,
            });

            // Also perform paranoid delete
            await requisition.destroy();

            return {
                success: true,
                message: "Requisition deleted successfully",
            };
        } catch (error) {
            throw new Error(`Failed to delete requisition: ${error.message}`);
        }
    }

    /**
     * Get dashboard statistics
     * @returns {Promise<Object>} Dashboard stats
     */
    async getDashboardStats() {
        try {
            const [
                totalRequisitions,
                pendingApproval,
                approved,
                inProcess,
                completed,
                onHold,
                rejected,
            ] = await Promise.all([
                this.model.count({ where: { isActive: true } }),
                this.model.count({
                    where: { approvalStatus: "pending", isActive: true },
                }),
                this.model.count({
                    where: { approvalStatus: "approved", isActive: true },
                }),
                this.model.count({
                    where: { requisitionStatus: "in_process", isActive: true },
                }),
                this.model.count({
                    where: { requisitionStatus: "completed", isActive: true },
                }),
                this.model.count({
                    where: { requisitionStatus: "on_hold", isActive: true },
                }),
                this.model.count({
                    where: { approvalStatus: "rejected", isActive: true },
                }),
            ]);

            return {
                success: true,
                data: {
                    totalRequisitions,
                    pendingApproval,
                    approved,
                    inProcess,
                    completed,
                    onHold,
                    rejected,
                },
            };
        } catch (error) {
            throw new Error(`Failed to get dashboard stats: ${error.message}`);
        }
    }

    /**
     * Get requisitions by department
     * @param {string} departmentId - Department UUID
     * @returns {Promise<Object>} Department requisitions
     */
    async getRequisitionsByDepartment(departmentId) {
        try {
            const requisitions = await this.model.findAll({
                where: {
                    requirementForDepartment: departmentId,
                    isActive: true,
                },
                order: [["requestedDate", "DESC"]],
            });

            return {
                success: true,
                data: requisitions,
            };
        } catch (error) {
            throw new Error(
                `Failed to fetch department requisitions: ${error.message}`
            );
        }
    }

    /**
     * Get requisitions by user
     * @param {number} userId - User ID
     * @returns {Promise<Object>} User's requisitions
     */
    async getRequisitionsByUser(userId) {
        try {
            const requisitions = await this.model.findAll({
                where: {
                    requestedBy: userId,
                    isActive: true,
                },
                order: [["requestedDate", "DESC"]],
            });

            return {
                success: true,
                data: requisitions,
            };
        } catch (error) {
            throw new Error(
                `Failed to fetch user requisitions: ${error.message}`
            );
        }
    }

    /**
     * Build where clause for filtering
     * @param {Object} filters - Filter object
     * @returns {Object} Sequelize where clause
     */
    _buildWhereClause(filters) {
        const where = { isActive: true };

        if (filters.approvalStatus) {
            where.approvalStatus = filters.approvalStatus;
        }

        if (filters.requisitionStatus) {
            where.requisitionStatus = filters.requisitionStatus;
        }

        if (filters.requirementForDepartment) {
            where.requirementForDepartment = filters.requirementForDepartment;
        }

        if (filters.requirementForDesignation) {
            where.requirementForDesignation = filters.requirementForDesignation;
        }

        if (filters.requirementType) {
            where.requirementType = filters.requirementType;
        }

        if (filters.requirementForCategory) {
            where.requirementForCategory = filters.requirementForCategory;
        }

        if (filters.requestedBy) {
            where.requestedBy = filters.requestedBy;
        }

        if (filters.dateFrom && filters.dateTo) {
            where.requestedDate = {
                [Op.between]: [filters.dateFrom, filters.dateTo],
            };
        } else if (filters.dateFrom) {
            where.requestedDate = {
                [Op.gte]: filters.dateFrom,
            };
        } else if (filters.dateTo) {
            where.requestedDate = {
                [Op.lte]: filters.dateTo,
            };
        }

        if (filters.search) {
            where[Op.or] = [
                { requestId: { [Op.iLike]: `%${filters.search}%` } },
                { jobDescription: { [Op.iLike]: `%${filters.search}%` } },
            ];
        }

        return where;
    }
}

module.exports = new ManPowerRequisitionService();
