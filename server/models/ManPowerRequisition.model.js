// =================== models/ManPowerRequisition.model.js ===================
module.exports = (sequelize, DataTypes) => {
    const ManPowerRequisition = sequelize.define(
        "ManPowerRequisition",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            requested_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                comment: "Date when the manpower requisition was requested",
            },
            requirement_for_department_id: {
                type: DataTypes.UUID,
                allowNull: false,
                comment:
                    "Foreign key reference to CompanyStructure table for department",
            },
            requirement_for_designation_id: {
                type: DataTypes.UUID,
                allowNull: false,
                comment:
                    "Foreign key reference to Designation table for job position",
            },
            number_of_positions: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "Number of positions required for this requisition",
            },
            experience_required: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: "Years of experience required for the position",
            },
            requirement_category: {
                type: DataTypes.ENUM("permanent", "technical", "FixedTerm"),
                allowNull: false,
                comment:
                    "Category of employment: permanent, technical, or fixed term",
            },
            requirement_type: {
                type: DataTypes.ENUM(
                    "replacement",
                    "additional",
                    "budgeted",
                    "NonBudgeted"
                ),
                allowNull: false,
                comment:
                    "Type of requirement: replacement, additional, budgeted, or non-budgeted",
            },
            expected_joining_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                comment: "Expected date when the candidate should join",
            },
            job_description: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: "Detailed job description and requirements",
            },
            requested_by_id: {
                type: DataTypes.UUID,
                allowNull: false,
                comment:
                    "Foreign key reference to Employee who requested the manpower",
            },
            approved_by_id: {
                type: DataTypes.UUID,
                allowNull: true,
                defaultValue: null,
                comment:
                    "Foreign key reference to Management who approved the request",
            },
            agreed_by_id: {
                type: DataTypes.UUID,
                allowNull: true,
                defaultValue: null,
                comment:
                    "Foreign key reference to Employee who agreed to the requisition",
            },
            approved_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
                defaultValue: null,
                comment: "Date when the requisition was approved",
            },
            requisition_status: {
                type: DataTypes.ENUM(
                    "pending",
                    "InProcess",
                    "OnHold",
                    "completed",
                    "cancelled"
                ),
                allowNull: false,
                defaultValue: "pending",
                comment: "Current status of the requisition process",
            },
            approval_status: {
                type: DataTypes.ENUM(
                    "selected",
                    "pending",
                    "rejected",
                    "OnHold"
                ),
                allowNull: false,
                defaultValue: "pending",
                comment: "Approval status of the requisition",
            },
        },
        {
            tableName: "ManPowerRequisition",
            timestamps: true,
            underscored: true,
            indexes: [
                {
                    name: "requirement_for_department_id_idx",
                    fields: ["requirement_for_department_id"],
                },
                {
                    name: "requirement_for_designation_id_idx",
                    fields: ["requirement_for_designation_id"],
                },
                {
                    name: "requested_by_id_idx",
                    fields: ["requested_by_id"],
                },
                {
                    name: "approved_by_id_idx",
                    fields: ["approved_by_id"],
                },
                {
                    name: "agreed_by_id_idx",
                    fields: ["agreed_by_id"],
                },
                {
                    name: "requisition_status_idx",
                    fields: ["requisition_status"],
                },
                {
                    name: "approval_status_idx",
                    fields: ["approval_status"],
                },
                {
                    name: "requested_date_idx",
                    fields: ["requested_date"],
                },
                {
                    name: "expected_joining_date_idx",
                    fields: ["expected_joining_date"],
                },
            ],
        }
    );

    // Define associations
    ManPowerRequisition.associate = (models) => {
        // Department association
        if (models.CompanyStructure) {
            ManPowerRequisition.belongsTo(models.CompanyStructure, {
                foreignKey: "requirement_for_department_id",
                as: "department",
                constraints: false, // Disable until CompanyStructure table is created
            });
        }

        // Designation association
        if (models.Designation) {
            ManPowerRequisition.belongsTo(models.Designation, {
                foreignKey: "requirement_for_designation_id",
                as: "designation",
                constraints: false, // Disable until Designation table is created
            });
        }

        // Employee associations
        if (models.Employee) {
            ManPowerRequisition.belongsTo(models.Employee, {
                foreignKey: "requested_by_id",
                as: "requested_by",
                constraints: false, // Disable until Employee table is created
            });

            ManPowerRequisition.belongsTo(models.Employee, {
                foreignKey: "agreed_by_id",
                as: "agreed_by",
                constraints: false, // Disable until Employee table is created
            });
        }

        // Management association
        if (models.Management) {
            ManPowerRequisition.belongsTo(models.Management, {
                foreignKey: "approved_by_id",
                as: "approved_by",
                constraints: false, // Disable until Management table is created
            });
        }
    };

    return ManPowerRequisition;
};
