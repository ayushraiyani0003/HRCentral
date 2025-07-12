/**
 * Interview Model
 * Represents interview information and details in the system
 *
 * @param {Object} sequelize - Sequelize instance
 * @param {Object} DataTypes - Sequelize data types
 * @returns {Object} Interview model
 */

module.exports = (sequelize, DataTypes) => {
    const Interview = sequelize.define(
        "Interview",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            interviewer: {
                type: DataTypes.TEXT,
                allowNull: false,
                comment: "Reference from Employee and Management table",
            },
            suitable_department: {
                type: DataTypes.TEXT,
                allowNull: false,
                comment: "Reference from Employee and Management table",
            },
            forwarded_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                validate: {
                    isBefore: new Date().toISOString().split("T")[0], // Cannot be future date
                },
            },
            rejection_remarks: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: "Final remarks/comments about the applicant",
            },
            result: {
                type: DataTypes.ENUM("Selected", "Rejected", "On Hold"),
                allowNull: false,
                defaultValue: "On Hold",
            },
        },
        {
            tableName: "Interview",
            timestamps: true,
            underscored: true,
            indexes: [
                {
                    name: "interviewer_idx",
                    fields: ["interviewer"],
                },
                {
                    name: "suitable_department_idx",
                    fields: ["suitable_department"],
                },
                {
                    name: "result_idx",
                    fields: ["result"],
                },
                {
                    name: "forwarded_date_idx",
                    fields: ["forwarded_date"],
                },
            ],
        }
    );

    Interview.associate = (models) => {
        // Association with Employee model (interviewer)
        if (models.Employee) {
            Interview.belongsTo(models.Employee, {
                foreignKey: "interviewer",
                as: "interviewerEmployee",
                constraints: false,
            });
        }

        // Association with Management model (interviewer)
        if (models.Management) {
            Interview.belongsTo(models.Management, {
                foreignKey: "interviewer",
                as: "interviewerManagement",
                constraints: false,
            });
        }

        // Association with CompanyStructure model (suitable_department)
        if (models.CompanyStructure) {
            Interview.belongsTo(models.CompanyStructure, {
                foreignKey: "suitable_department",
                as: "department",
                constraints: false,
            });
        }
    };

    return Interview;
};
