// =================== models/ApplicantWorkHistory.model.js ===================
module.exports = (sequelize, DataTypes) => {
    const ApplicantWorkHistory = sequelize.define(
        "ApplicantWorkHistory",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            company_name: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            location: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            start_month_year: {
                type: DataTypes.STRING(20),
                allowNull: false,
                comment: "Format: MM/YYYY or Month YYYY",
            },
            end_month_year: {
                type: DataTypes.STRING(20),
                allowNull: true,
                defaultValue: null,
                comment: "Format: MM/YYYY or Month YYYY",
            },
            salary_drawn: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
                defaultValue: null,
            },
            designation: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            job_history: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            reason_for_leave: {
                type: DataTypes.TEXT,
                allowNull: true,
                defaultValue: null,
            },

            period_to_work: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            department: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            reporting_head: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            reason_of_leaving: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            remarks: {
                type: DataTypes.TEXT,
                allowNull: true,
                defaultValue: null,
            },
        },
        {
            tableName: "ApplicantWorkHistories",
            timestamps: true,
            underscored: true,
            indexes: [
                {
                    name: "company_name_idx",
                    fields: ["company_name"],
                },
                {
                    name: "designation_idx",
                    fields: ["designation"],
                },
                {
                    name: "start_month_year_idx",
                    fields: ["start_month_year"],
                },
            ],
        }
    );
    return ApplicantWorkHistory;
};
