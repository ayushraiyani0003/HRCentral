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
            degree_diploma: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            medium_of_studies: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            year_of_passing: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1950,
                    max: new Date().getFullYear() + 10,
                },
            },
            institution: {
                type: DataTypes.STRING(200),
                allowNull: false,
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
            tableName: "ApplicantEducation",
            timestamps: true,
            underscored: true,
            indexes: [
                {
                    name: "year_of_passing_idx",
                    fields: ["year_of_passing"],
                },
                {
                    name: "degree_diploma_idx",
                    fields: ["degree_diploma"],
                },
            ],
        }
    );
    return ApplicantEducation;
};
