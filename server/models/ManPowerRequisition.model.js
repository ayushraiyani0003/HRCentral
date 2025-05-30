// =================== models/ManPowerRequisition.model.js ===================

module.exports = (sequelize, DataTypes) => {
    const ManPowerRequisitionModel = sequelize.define(
        "ManPowerRequisition",
        {
            // Primary Key - Auto Increment Integer
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },

            // Unique request ID like req-01-0001 (generated via hooks)
            requestId: {
                type: DataTypes.STRING(15),
                allowNull: false,
                unique: true,
                validate: {
                    len: [8, 15], // Minimum 8 characters
                    is: /^[a-zA-Z0-9-]+$/, // Alphanumeric with hyphens
                },
            },

            // TODO: Add Employee model and uncomment foreign key constraints
            // User who requested - FK to Employee or User
            requestedBy: {
                type: DataTypes.INTEGER,
                allowNull: false,
                // references: {
                //     model: 'Employees',
                //     key: 'id'
                // },
                // onUpdate: 'CASCADE',
                // onDelete: 'RESTRICT'
            },

            // TODO: Add Employee model and uncomment foreign key constraints for department
            // Department the requirement is for - FK to CompanyStructure (ACTIVE)
            requirementForDepartment: {
                type: DataTypes.UUID, // UUID to match CompanyStructure
                allowNull: false,
                // references: {
                //     model: "CompanyStructures",
                //     key: "id",
                // },
                // onUpdate: "CASCADE",
                // onDelete: "RESTRICT",
            },

            // TODO: Add Designation model and uncomment foreign key constraints
            // Designation being requested - FK to Designation
            requirementForDesignation: {
                type: DataTypes.INTEGER,
                allowNull: false,
                // references: {
                //     model: 'Designations',
                //     key: 'id'
                // },
                // onUpdate: 'CASCADE',
                // onDelete: 'RESTRICT'
            },

            // Number of open positions required
            numberOfPositions: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 100, // Reasonable upper limit
                },
            },

            // Category of the requirement
            requirementForCategory: {
                type: DataTypes.ENUM("permanent", "technical", "fixed_term"),
                allowNull: false,
            },

            // Type of requirement
            requirementType: {
                type: DataTypes.ENUM(
                    "replacement",
                    "additional",
                    "budgeted",
                    "non_budgeted"
                ),
                allowNull: false,
            },

            // Expected Date of Joining
            expectedDateOfJoining: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                validate: {
                    isDate: true,
                    isAfter: new Date().toISOString().split("T")[0], // Must be future date
                },
            },

            // Experience required in months (more flexible than years)
            experienceRequired: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    min: 0,
                    max: 600, // 50 years max
                },
            },

            // Description of the job - optional longer text
            jobDescription: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    len: [10, 5000], // Reasonable length limits
                },
            },

            // TODO: Add Employee model and uncomment foreign key constraints for approval flow
            // Approval & review flow (nullable initially)
            agreedBy: {
                type: DataTypes.INTEGER,
                allowNull: true,
                // references: {
                //     model: 'Employees',
                //     key: 'id'
                // },
                // onUpdate: 'CASCADE',
                // onDelete: 'SET NULL'
            },
            approvedBy: {
                type: DataTypes.INTEGER,
                allowNull: true,
                // references: {
                //     model: 'Employees',
                //     key: 'id'
                // },
                // onUpdate: 'CASCADE',
                // onDelete: 'SET NULL'
            },
            onHoldBy: {
                type: DataTypes.INTEGER,
                allowNull: true,
                // references: {
                //     model: 'Employees',
                //     key: 'id'
                // },
                // onUpdate: 'CASCADE',
                // onDelete: 'SET NULL'
            },

            // Lifecycle Dates
            requestedDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            requestCompletedDate: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            dateOfJoining: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            approvedDate: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            agreedDate: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            // Status fields
            approvalStatus: {
                type: DataTypes.ENUM(
                    "approved",
                    "pending",
                    "rejected",
                    "on_hold"
                ),
                allowNull: false,
                defaultValue: "pending",
            },

            requisitionStatus: {
                type: DataTypes.ENUM(
                    "pending",
                    "in_process",
                    "on_hold",
                    "completed",
                    "cancelled"
                ),
                allowNull: false,
                defaultValue: "pending",
            },

            // TODO: Add Employee model and uncomment foreign key constraints for audit
            // Audit - track who last updated the record
            lastChangedBy: {
                type: DataTypes.INTEGER,
                allowNull: false,
                // references: {
                //     model: 'Employees',
                //     key: 'id'
                // },
                // onUpdate: 'CASCADE',
                // onDelete: 'RESTRICT'
            },

            // Soft delete flag // if user delete then make it false otherwise true
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            tableName: "ManPowerRequisition",
            timestamps: true,
            underscored: true,
            paranoid: true, // Enables soft delete
            indexes: [
                {
                    name: "request_id_unique_idx",
                    unique: true,
                    fields: ["request_id"], // Use snake_case because underscored: true
                },
                {
                    name: "requested_by_idx",
                    fields: ["requested_by"], // Use snake_case
                },
                {
                    name: "requirement_for_department_idx",
                    fields: ["requirement_for_department"], // Use snake_case
                },
                {
                    name: "requirement_for_designation_idx",
                    fields: ["requirement_for_designation"], // Use snake_case
                },
                {
                    name: "approval_status_idx",
                    fields: ["approval_status"], // Use snake_case
                },
                {
                    name: "requisition_status_idx",
                    fields: ["requisition_status"], // Use snake_case
                },
                {
                    name: "requested_date_idx",
                    fields: ["requested_date"], // Use snake_case
                },
            ],
            hooks: {
                beforeCreate: async (requisition, options) => {
                    // Auto-generate requestId if not provided
                    if (!requisition.requestId) {
                        const year = new Date()
                            .getFullYear()
                            .toString()
                            .slice(-2);
                        const month = String(
                            new Date().getMonth() + 1
                        ).padStart(2, "0");

                        // Get the next sequence number
                        const lastReq = await ManPowerRequisitionModel.findOne({
                            where: {
                                requestId: {
                                    [sequelize.Sequelize.Op
                                        .like]: `req-${year}${month}-%`,
                                },
                            },
                            order: [["requestId", "DESC"]],
                        });

                        let sequence = "0001";
                        if (lastReq) {
                            const lastSequence = parseInt(
                                lastReq.requestId.split("-")[2]
                            );
                            sequence = String(lastSequence + 1).padStart(
                                4,
                                "0"
                            );
                        }

                        requisition.requestId = `req-${year}${month}-${sequence}`;
                    }
                },
                beforeUpdate: (requisition, options) => {
                    // Update status dates automatically
                    if (requisition.changed("approvalStatus")) {
                        if (requisition.approvalStatus === "approved") {
                            requisition.approvedDate = new Date();
                        }
                    }

                    if (requisition.changed("requisitionStatus")) {
                        if (requisition.requisitionStatus === "completed") {
                            requisition.requestCompletedDate = new Date();
                        }
                    }
                },
            },
            validate: {
                // Model-level validations
                statusConsistency() {
                    if (
                        this.requisitionStatus === "completed" &&
                        this.approvalStatus !== "approved"
                    ) {
                        throw new Error(
                            "Requisition cannot be completed without approval"
                        );
                    }
                },
            },
        }
    );

    // Associations
    ManPowerRequisitionModel.associate = (models) => {
        // TODO: Add CompanyStructure model and uncomment foreign key constraints for department
        // Department (ACTIVE ASSOCIATION)
        // ManPowerRequisitionModel.belongsTo(models.CompanyStructure, {
        //     foreignKey: "requirementForDepartment",
        //     as: "department",
        //     targetKey: "id", // Explicitly specify the target key (UUID)
        // });
        // TODO: Uncomment when Employee model is created
        // // Requester
        // ManPowerRequisitionModel.belongsTo(models.Employee, {
        //     foreignKey: "requestedBy",
        //     as: "requester",
        // });
        // TODO: Uncomment when Designation model is created
        // // Designation
        // ManPowerRequisitionModel.belongsTo(models.Designation, {
        //     foreignKey: "requirementForDesignation",
        //     as: "designation",
        // });
        // TODO: Uncomment when Employee model is created
        // // Approval flow
        // ManPowerRequisitionModel.belongsTo(models.Employee, {
        //     foreignKey: "agreedBy",
        //     as: "agreementPerson",
        // });
        // ManPowerRequisitionModel.belongsTo(models.Employee, {
        //     foreignKey: "approvedBy",
        //     as: "approver",
        // });
        // ManPowerRequisitionModel.belongsTo(models.Employee, {
        //     foreignKey: "onHoldBy",
        //     as: "holdPerson",
        // });
        // ManPowerRequisitionModel.belongsTo(models.Employee, {
        //     foreignKey: "lastChangedBy",
        //     as: "lastChanger",
        // });
    };

    return ManPowerRequisitionModel;
};
