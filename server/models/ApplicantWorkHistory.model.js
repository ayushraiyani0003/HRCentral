// =================== models/ApplicantWorkHistory.model.js ===================
module.exports = (sequelize, DataTypes) => {
    const ApplicantWorkHistory = sequelize.define(
        "ApplicantWorkHistory",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            applicant_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "ApplicantTrackings",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            job_post: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            company_name: {
                type: DataTypes.STRING(200),
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
                comment: "Format: MM/YYYY or Month YYYY",
            },
            salary: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            reason_for_leave: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            remarks: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            is_current_work: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            tableName: "ApplicantWorkHistories",
            timestamps: true,
            underscored: true,
            indexes: [
                {
                    name: "applicant_id_idx",
                    fields: ["applicant_id"],
                },
                {
                    name: "company_name_idx",
                    fields: ["company_name"],
                },
                {
                    name: "is_current_work_idx",
                    fields: ["is_current_work"],
                },
            ],
        }
    );

    ApplicantWorkHistory.associate = (models) => {
        // Association with ApplicantTracking model
        ApplicantWorkHistory.belongsTo(models.ApplicantTracking, {
            foreignKey: "applicant_id",
            as: "applicant",
        });
    };

    return ApplicantWorkHistory;
};
