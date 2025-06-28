// =================== models/ApplicantEducation.model.js ===================
module.exports = (sequelize, DataTypes) => {
    const ApplicantEducation = sequelize.define(
        "ApplicantEducation",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
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
            education_training: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            institution: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            degree_diploma: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            start_year: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1950,
                    max: new Date().getFullYear(),
                },
            },
            end_year: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    min: 1950,
                    max: new Date().getFullYear() + 10,
                },
            },
            is_current_study: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            result: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            remarks: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            tableName: "ApplicantEducations",
            timestamps: true,
            underscored: true,
            indexes: [
                {
                    name: "applicant_id_idx",
                    fields: ["applicant_id"],
                },
                {
                    name: "start_year_idx",
                    fields: ["start_year"],
                },
            ],
        }
    );

    ApplicantEducation.associate = (models) => {
        // Association with ApplicantTracking model
        ApplicantEducation.belongsTo(models.ApplicantTracking, {
            foreignKey: "applicant_id",
            as: "applicant",
        });
    };

    return ApplicantEducation;
};
