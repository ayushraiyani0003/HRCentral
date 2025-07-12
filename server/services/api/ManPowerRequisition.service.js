// =================== services/ManPowerRequisition.service.js ===================
const { Op } = require("sequelize");
const db = require("../../models");
const ManPowerRequisition = db.ManPowerRequisition;
const ApplicantTracking = db.ApplicantTracking;
const CompanyStructure = db.CompanyStructure;
const Designation = db.Designation;
const Employee = db.Employee;
const Management = db.Management;

class ManPowerRequisitionService {
    /**
     * Create a new manpower requisition
     * @param {Object} requisitionData - The requisition data
     * @returns {Promise<Object>} - Created requisition with associations
     */
    async createRequisition(requisitionData) {
        try {
            const requisition = await ManPowerRequisition.create(
                requisitionData
            );
            return await this.getRequisitionById(requisition.id);
        } catch (error) {
            throw new Error(
                `Error creating manpower requisition: ${error.message}`
            );
        }
    }

    /**
     * Get all manpower requisitions with optional filtering and pagination
     * @param {Object} options - Query options
     * @returns {Promise<Object>} - Paginated requisitions with associations
     */
    async getAllRequisitions(options = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                search = "",
                department_id,
                designation_id,
                requisition_status,
                approval_status,
                requirement_category,
                requirement_type,
                requested_by_id,
                approved_by_id,
                sort_by = "requested_date",
                sort_order = "DESC",
            } = options;

            const offset = (page - 1) * limit;
            const whereClause = {};

            // Add search functionality
            if (search) {
                whereClause[Op.or] = [
                    { job_description: { [Op.iLike]: `%${search}%` } },
                    { "$department.name$": { [Op.iLike]: `%${search}%` } },
                    { "$designation.name$": { [Op.iLike]: `%${search}%` } },
                ];
            }

            // Add filters
            if (department_id)
                whereClause.requirement_for_department_id = department_id;
            if (designation_id)
                whereClause.requirement_for_designation_id = designation_id;
            if (requisition_status)
                whereClause.requisition_status = requisition_status;
            if (approval_status) whereClause.approval_status = approval_status;
            if (requirement_category)
                whereClause.requirement_category = requirement_category;
            if (requirement_type)
                whereClause.requirement_type = requirement_type;
            if (requested_by_id) whereClause.requested_by_id = requested_by_id;
            if (approved_by_id) whereClause.approved_by_id = approved_by_id;

            const { count, rows } = await ManPowerRequisition.findAndCountAll({
                where: whereClause,
                include: this._getIncludeOptions(),
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [[sort_by, sort_order.toUpperCase()]],
                distinct: true,
            });

            return {
                requisitions: rows,
                pagination: {
                    current_page: parseInt(page),
                    per_page: parseInt(limit),
                    total: count,
                    total_pages: Math.ceil(count / limit),
                    has_next: page < Math.ceil(count / limit),
                    has_prev: page > 1,
                },
            };
        } catch (error) {
            throw new Error(
                `Error fetching manpower requisitions: ${error.message}`
            );
        }
    }

    /**
     * Get a specific manpower requisition by ID
     * @param {string} id - Requisition ID
     * @returns {Promise<Object>} - Requisition with associations
     */
    async getRequisitionById(id) {
        try {
            const requisition = await ManPowerRequisition.findByPk(id, {
                include: this._getIncludeOptions(),
            });

            if (!requisition) {
                throw new Error("Manpower requisition not found");
            }

            return requisition;
        } catch (error) {
            throw new Error(
                `Error fetching manpower requisition: ${error.message}`
            );
        }
    }

    /**
     * Update a manpower requisition
     * @param {string} id - Requisition ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} - Updated requisition with associations
     */
    async updateRequisition(id, updateData) {
        try {
            const requisition = await ManPowerRequisition.findByPk(id);
            if (!requisition) {
                throw new Error("Manpower requisition not found");
            }

            await requisition.update(updateData);
            return await this.getRequisitionById(id);
        } catch (error) {
            throw new Error(
                `Error updating manpower requisition: ${error.message}`
            );
        }
    }

    /**
     * Delete a manpower requisition
     * @param {string} id - Requisition ID
     * @returns {Promise<boolean>} - Success status
     */
    async deleteRequisition(id) {
        try {
            const requisition = await ManPowerRequisition.findByPk(id);
            if (!requisition) {
                throw new Error("Manpower requisition not found");
            }

            await requisition.destroy();
            return true;
        } catch (error) {
            throw new Error(
                `Error deleting manpower requisition: ${error.message}`
            );
        }
    }

    /**
     * Update requisition status
     * @param {string} id - Requisition ID
     * @param {string} status - New status
     * @returns {Promise<Object>} - Updated requisition
     */
    async updateRequisitionStatus(id, status) {
        try {
            const validStatuses = [
                "pending",
                "InProcess",
                "OnHold",
                "completed",
                "cancelled",
            ];
            if (!validStatuses.includes(status)) {
                throw new Error("Invalid requisition status");
            }

            return await this.updateRequisition(id, {
                requisition_status: status,
            });
        } catch (error) {
            throw new Error(
                `Error updating requisition status: ${error.message}`
            );
        }
    }

    /**
     * Update approval status
     * @param {string} id - Requisition ID
     * @param {string} status - New approval status
     * @param {string} approved_by_id - ID of approver
     * @returns {Promise<Object>} - Updated requisition
     */
    async updateApprovalStatus(id, status, approved_by_id = null) {
        try {
            const validStatuses = ["selected", "pending", "rejected", "OnHold"];
            if (!validStatuses.includes(status)) {
                throw new Error("Invalid approval status");
            }

            const updateData = {
                approval_status: status,
                approved_date: status === "selected" ? new Date() : null,
            };

            if (approved_by_id) {
                updateData.approved_by_id = approved_by_id;
            }

            return await this.updateRequisition(id, updateData);
        } catch (error) {
            throw new Error(`Error updating approval status: ${error.message}`);
        }
    }

    /**
     * Get requisitions by department
     * @param {string} departmentId - Department ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>} - Filtered requisitions
     */
    async getRequisitionsByDepartment(departmentId, options = {}) {
        try {
            return await this.getAllRequisitions({
                ...options,
                department_id: departmentId,
            });
        } catch (error) {
            throw new Error(
                `Error fetching requisitions by department: ${error.message}`
            );
        }
    }

    /**
     * Get requisitions by designation
     * @param {string} designationId - Designation ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>} - Filtered requisitions
     */
    async getRequisitionsByDesignation(designationId, options = {}) {
        try {
            return await this.getAllRequisitions({
                ...options,
                designation_id: designationId,
            });
        } catch (error) {
            throw new Error(
                `Error fetching requisitions by designation: ${error.message}`
            );
        }
    }

    /**
     * Get requisitions by requester
     * @param {string} requesterId - Requester ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>} - Filtered requisitions
     */
    async getRequisitionsByRequester(requesterId, options = {}) {
        try {
            return await this.getAllRequisitions({
                ...options,
                requested_by_id: requesterId,
            });
        } catch (error) {
            throw new Error(
                `Error fetching requisitions by requester: ${error.message}`
            );
        }
    }

    /**
     * Get pending requisitions
     * @param {Object} options - Query options
     * @returns {Promise<Object>} - Pending requisitions
     */
    async getPendingRequisitions(options = {}) {
        try {
            return await this.getAllRequisitions({
                ...options,
                requisition_status: "pending",
            });
        } catch (error) {
            throw new Error(
                `Error fetching pending requisitions: ${error.message}`
            );
        }
    }

    /**
     * Get requisitions requiring approval
     * @param {Object} options - Query options
     * @returns {Promise<Object>} - Requisitions needing approval
     */
    async getRequisitionsForApproval(options = {}) {
        try {
            return await this.getAllRequisitions({
                ...options,
                approval_status: "pending",
            });
        } catch (error) {
            throw new Error(
                `Error fetching requisitions for approval: ${error.message}`
            );
        }
    }

    /**
     * Get requisition statistics
     * @returns {Promise<Object>} - Statistics data
     */
    async getRequisitionStatistics() {
        try {
            const stats = await ManPowerRequisition.findAll({
                attributes: [
                    "requisition_status",
                    "approval_status",
                    "requirement_category",
                    "requirement_type",
                    [db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"],
                ],
                group: [
                    "requisition_status",
                    "approval_status",
                    "requirement_category",
                    "requirement_type",
                ],
                raw: true,
            });

            // Transform the data for better readability
            const transformedStats = {
                by_requisition_status: {},
                by_approval_status: {},
                by_requirement_category: {},
                by_requirement_type: {},
                total_requisitions: 0,
            };

            stats.forEach((stat) => {
                const count = parseInt(stat.count);
                transformedStats.total_requisitions += count;

                if (
                    !transformedStats.by_requisition_status[
                        stat.requisition_status
                    ]
                ) {
                    transformedStats.by_requisition_status[
                        stat.requisition_status
                    ] = 0;
                }
                transformedStats.by_requisition_status[
                    stat.requisition_status
                ] += count;

                if (
                    !transformedStats.by_approval_status[stat.approval_status]
                ) {
                    transformedStats.by_approval_status[
                        stat.approval_status
                    ] = 0;
                }
                transformedStats.by_approval_status[stat.approval_status] +=
                    count;

                if (
                    !transformedStats.by_requirement_category[
                        stat.requirement_category
                    ]
                ) {
                    transformedStats.by_requirement_category[
                        stat.requirement_category
                    ] = 0;
                }
                transformedStats.by_requirement_category[
                    stat.requirement_category
                ] += count;

                if (
                    !transformedStats.by_requirement_type[stat.requirement_type]
                ) {
                    transformedStats.by_requirement_type[
                        stat.requirement_type
                    ] = 0;
                }
                transformedStats.by_requirement_type[stat.requirement_type] +=
                    count;
            });

            return transformedStats;
        } catch (error) {
            throw new Error(
                `Error fetching requisition statistics: ${error.message}`
            );
        }
    }

    /**
     * Bulk update requisitions
     * @param {Array} requisitionIds - Array of requisition IDs
     * @param {Object} updateData - Data to update
     * @returns {Promise<Array>} - Updated requisitions
     */
    async bulkUpdateRequisitions(requisitionIds, updateData) {
        try {
            await ManPowerRequisition.update(updateData, {
                where: {
                    id: { [Op.in]: requisitionIds },
                },
            });

            // Return updated requisitions
            return await ManPowerRequisition.findAll({
                where: {
                    id: { [Op.in]: requisitionIds },
                },
                include: this._getIncludeOptions(),
            });
        } catch (error) {
            throw new Error(
                `Error bulk updating requisitions: ${error.message}`
            );
        }
    }

    /**
     * Get overdue requisitions (past expected joining date)
     * @param {Object} options - Query options
     * @returns {Promise<Object>} - Overdue requisitions
     */
    async getOverdueRequisitions(options = {}) {
        try {
            const whereClause = {
                expected_joining_date: {
                    [Op.lt]: new Date(),
                },
                requisition_status: {
                    [Op.notIn]: ["completed", "cancelled"],
                },
            };

            const { page = 1, limit = 10 } = options;
            const offset = (page - 1) * limit;

            const { count, rows } = await ManPowerRequisition.findAndCountAll({
                where: whereClause,
                include: this._getIncludeOptions(),
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [["expected_joining_date", "ASC"]],
                distinct: true,
            });

            return {
                overdue_requisitions: rows,
                pagination: {
                    current_page: parseInt(page),
                    per_page: parseInt(limit),
                    total: count,
                    total_pages: Math.ceil(count / limit),
                },
            };
        } catch (error) {
            throw new Error(
                `Error fetching overdue requisitions: ${error.message}`
            );
        }
    }

    /**
     * Process applicant selection and update position count
     * @param {string} applicantTrackingId - ApplicantTracking ID
     * @param {string} selection - "accepted" or "Not_Interested"
     * @returns {Promise<Object>} - Updated requisition with position changes
     */
    async processApplicantSelection(applicantTrackingId, selection) {
        const transaction = await db.sequelize.transaction();

        try {
            // Get applicant tracking details
            const applicant = await ApplicantTracking.findByPk(
                applicantTrackingId,
                {
                    attributes: [
                        "id",
                        "applicant_department_id",
                        "applicant_designation_id",
                        "applicant_by_selection",
                        "manpower_requisition_id",
                    ],
                    transaction,
                }
            );

            if (!applicant) {
                throw new Error("Applicant tracking record not found");
            }

            // Validate selection values
            const validSelections = ["accepted", "Not_Interested"];
            if (!validSelections.includes(selection)) {
                throw new Error(
                    "Invalid selection. Must be 'accepted' or 'Not_Interested'"
                );
            }

            // Get the related manpower requisition
            const requisition = await ManPowerRequisition.findByPk(
                applicant.manpower_requisition_id,
                { transaction }
            );

            if (!requisition) {
                throw new Error("Associated manpower requisition not found");
            }

            // Store previous selection for comparison
            const previousSelection = applicant.applicant_by_selection;

            // Update applicant selection
            await applicant.update(
                { applicant_by_selection: selection },
                { transaction }
            );

            // Apply position logic based on business rules
            await this._applyPositionLogic(
                requisition,
                applicant,
                selection,
                previousSelection,
                transaction
            );

            await transaction.commit();

            // Return updated requisition with associations
            return await this.getRequisitionById(requisition.id);
        } catch (error) {
            await transaction.rollback();
            throw new Error(
                `Error processing applicant selection: ${error.message}`
            );
        }
    }

    /**
     * Apply position decrease/increase logic based on business rules
     * @param {Object} requisition - ManPowerRequisition instance
     * @param {Object} applicant - ApplicantTracking instance
     * @param {string} newSelection - New selection value
     * @param {string} previousSelection - Previous selection value
     * @param {Object} transaction - Database transaction
     * @returns {Promise<void>}
     */
    async _applyPositionLogic(
        requisition,
        applicant,
        newSelection,
        previousSelection,
        transaction
    ) {
        try {
            // Position Decrease Logic
            if (
                this._shouldDecreasePosition(
                    requisition,
                    applicant,
                    newSelection
                )
            ) {
                await this._decreasePosition(requisition, transaction);
            }

            // Position Increase Logic
            if (
                this._shouldIncreasePosition(
                    requisition,
                    applicant,
                    newSelection,
                    previousSelection
                )
            ) {
                await this._increasePosition(requisition, transaction);
            }
        } catch (error) {
            throw new Error(`Error applying position logic: ${error.message}`);
        }
    }

    /**
     * Check if position should be decreased
     * @param {Object} requisition - ManPowerRequisition instance
     * @param {Object} applicant - ApplicantTracking instance
     * @param {string} newSelection - New selection value
     * @returns {boolean}
     */
    _shouldDecreasePosition(requisition, applicant, newSelection) {
        return (
            requisition.number_of_positions > 0 &&
            requisition.requirement_for_department_id ===
                applicant.applicant_department_id &&
            requisition.requirement_for_designation_id ===
                applicant.applicant_designation_id &&
            requisition.approval_status === "selected" &&
            newSelection === "accepted"
        );
    }

    /**
     * Check if position should be increased
     * @param {Object} requisition - ManPowerRequisition instance
     * @param {Object} applicant - ApplicantTracking instance
     * @param {string} newSelection - New selection value
     * @param {string} previousSelection - Previous selection value
     * @returns {boolean}
     */
    _shouldIncreasePosition(
        requisition,
        applicant,
        newSelection,
        previousSelection
    ) {
        return (
            requisition.requirement_for_department_id ===
                applicant.applicant_department_id &&
            requisition.requirement_for_designation_id ===
                applicant.applicant_designation_id &&
            requisition.approval_status === "selected" &&
            previousSelection === "accepted" &&
            newSelection === "Not_Interested"
        );
    }

    /**
     * Decrease position count
     * @param {Object} requisition - ManPowerRequisition instance
     * @param {Object} transaction - Database transaction
     * @returns {Promise<void>}
     */
    async _decreasePosition(requisition, transaction) {
        const newPositionCount = requisition.number_of_positions - 1;
        await requisition.update(
            { number_of_positions: newPositionCount },
            { transaction }
        );
    }

    /**
     * Increase position count
     * @param {Object} requisition - ManPowerRequisition instance
     * @param {Object} transaction - Database transaction
     * @returns {Promise<void>}
     */
    async _increasePosition(requisition, transaction) {
        const newPositionCount = requisition.number_of_positions + 1;
        await requisition.update(
            { number_of_positions: newPositionCount },
            { transaction }
        );
    }

    /**
     * Get applicant tracking data for a requisition
     * @param {string} requisitionId - Requisition ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>} - Applicant tracking data with pagination
     */
    async getApplicantTrackingForRequisition(requisitionId, options = {}) {
        try {
            const { page = 1, limit = 10, applicant_by_selection } = options;
            const offset = (page - 1) * limit;

            const whereClause = { manpower_requisition_id: requisitionId };

            if (applicant_by_selection) {
                whereClause.applicant_by_selection = applicant_by_selection;
            }

            const { count, rows } = await ApplicantTracking.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: CompanyStructure,
                        as: "applicant_department",
                        attributes: ["id", "name", "code"],
                        required: false,
                    },
                    {
                        model: Designation,
                        as: "applicant_designation",
                        attributes: ["id", "name", "code"],
                        required: false,
                    },
                ],
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [["created_at", "DESC"]],
                distinct: true,
            });

            return {
                applicants: rows,
                pagination: {
                    current_page: parseInt(page),
                    per_page: parseInt(limit),
                    total: count,
                    total_pages: Math.ceil(count / limit),
                },
            };
        } catch (error) {
            throw new Error(
                `Error fetching applicant tracking: ${error.message}`
            );
        }
    }

    /**
     * Get requisition with position tracking summary
     * @param {string} requisitionId - Requisition ID
     * @returns {Promise<Object>} - Requisition with position tracking details
     */
    async getRequisitionWithPositionTracking(requisitionId) {
        try {
            const requisition = await this.getRequisitionById(requisitionId);

            // Get applicant statistics
            const applicantStats = await ApplicantTracking.findAll({
                where: { manpower_requisition_id: requisitionId },
                attributes: [
                    "applicant_by_selection",
                    [db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"],
                ],
                group: ["applicant_by_selection"],
                raw: true,
            });

            const positionTracking = {
                original_positions: requisition.number_of_positions,
                current_positions: requisition.number_of_positions,
                accepted_count: 0,
                not_interested_count: 0,
                pending_count: 0,
                total_applicants: 0,
            };

            applicantStats.forEach((stat) => {
                const count = parseInt(stat.count);
                positionTracking.total_applicants += count;

                switch (stat.applicant_by_selection) {
                    case "accepted":
                        positionTracking.accepted_count = count;
                        break;
                    case "Not_Interested":
                        positionTracking.not_interested_count = count;
                        break;
                    default:
                        positionTracking.pending_count = count;
                        break;
                }
            });

            return {
                ...requisition.toJSON(),
                position_tracking: positionTracking,
            };
        } catch (error) {
            throw new Error(
                `Error fetching requisition with position tracking: ${error.message}`
            );
        }
    }

    /**
     * Bulk process applicant selections
     * @param {Array} applicantSelections - Array of {applicantTrackingId, selection}
     * @returns {Promise<Array>} - Results of each processing
     */
    async bulkProcessApplicantSelections(applicantSelections) {
        const results = [];

        for (const { applicantTrackingId, selection } of applicantSelections) {
            try {
                const result = await this.processApplicantSelection(
                    applicantTrackingId,
                    selection
                );
                results.push({
                    applicantTrackingId,
                    success: true,
                    data: result,
                });
            } catch (error) {
                results.push({
                    applicantTrackingId,
                    success: false,
                    error: error.message,
                });
            }
        }

        return results;
    }

    /**
     * Get requisitions with position discrepancies
     * @returns {Promise<Array>} - Requisitions where positions might be inconsistent
     */
    async getRequisitionsWithPositionDiscrepancies() {
        try {
            const requisitions = await ManPowerRequisition.findAll({
                where: {
                    approval_status: "selected",
                    requisition_status: {
                        [Op.notIn]: ["completed", "cancelled"],
                    },
                },
                include: [
                    {
                        model: ApplicantTracking,
                        as: "applicant_trackings",
                        attributes: ["id", "applicant_by_selection"],
                        required: false,
                    },
                    ...this._getIncludeOptions(),
                ],
            });

            const discrepancies = [];

            for (const requisition of requisitions) {
                const acceptedCount =
                    requisition.applicant_trackings?.filter(
                        (at) => at.applicant_by_selection === "accepted"
                    ).length || 0;

                const expectedPositions =
                    requisition.number_of_positions + acceptedCount;

                if (expectedPositions !== requisition.number_of_positions) {
                    discrepancies.push({
                        requisition: requisition.toJSON(),
                        accepted_applicants: acceptedCount,
                        expected_positions: expectedPositions,
                        current_positions: requisition.number_of_positions,
                        discrepancy:
                            expectedPositions - requisition.number_of_positions,
                    });
                }
            }

            return discrepancies;
        } catch (error) {
            throw new Error(
                `Error finding position discrepancies: ${error.message}`
            );
        }
    }

    /**
     * Private method to get include options for associations
     * @returns {Array} - Include options
     */
    _getIncludeOptions() {
        return [
            {
                model: CompanyStructure,
                as: "department",
                attributes: ["id", "name", "code", "type"],
                required: false,
            },
            {
                model: Designation,
                as: "designation",
                attributes: ["id", "name", "code", "level"],
                required: false,
            },
            {
                model: Employee,
                as: "requested_by",
                attributes: [
                    "id",
                    "first_name",
                    "last_name",
                    "email",
                    "employee_code",
                ],
                required: false,
            },
            {
                model: Employee,
                as: "agreed_by",
                attributes: [
                    "id",
                    "first_name",
                    "last_name",
                    "email",
                    "employee_code",
                ],
                required: false,
            },
            {
                model: Management,
                as: "approved_by",
                attributes: [
                    "id",
                    "first_name",
                    "last_name",
                    "email",
                    "position",
                ],
                required: false,
            },
        ];
    }
}

module.exports = new ManPowerRequisitionService();
