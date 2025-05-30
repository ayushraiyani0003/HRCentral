// =================== models/ApplicantTracking.model.js ===================
module.exports = (sequelize, DataTypes) => {
    const ApplicantTracking = sequelize.define(
        "ApplicantTracking",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            position_applied: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            application_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            first_name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            father_name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            surname: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            address: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            mobile_no_1: {
                type: DataTypes.STRING(15),
                allowNull: false,
                validate: {
                    isNumeric: true,
                    len: [10, 15],
                },
            },
            whatsapp_no: {
                type: DataTypes.STRING(15),
                allowNull: true,
                validate: {
                    isNumeric: true,
                    len: [10, 15],
                },
            },
            date_of_birth: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            department: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            cast: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            marital_status: {
                type: DataTypes.ENUM("married", "unmarried"),
                allowNull: false,
            },
            gender: {
                type: DataTypes.ENUM("male", "female"),
                allowNull: false,
            },
            required_notice_period: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            expected_salary: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            reference: {
                type: DataTypes.STRING(200),
                allowNull: true,
            },
            reference_relation: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            defence_salary: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM(
                    "pending",
                    "shortlisted",
                    "rejected",
                    "hired"
                ),
                allowNull: false,
                defaultValue: "pending",
            },
        },
        {
            tableName: "ApplicantTrackings",
            timestamps: true,
            underscored: true,
            indexes: [
                {
                    name: "mobile_no_1_idx",
                    fields: ["mobile_no_1"],
                },
                {
                    name: "department_idx",
                    fields: ["department"],
                },
                {
                    name: "position_applied_idx",
                    fields: ["position_applied"],
                },
                {
                    name: "status_idx",
                    fields: ["status"],
                },
            ],
        }
    );

    ApplicantTracking.associate = (models) => {
        // Association with Education model
        ApplicantTracking.hasMany(models.ApplicantEducation, {
            foreignKey: "applicant_id",
            as: "educations",
            onDelete: "CASCADE",
        });

        // Association with Work History model
        ApplicantTracking.hasMany(models.ApplicantWorkHistory, {
            foreignKey: "applicant_id",
            as: "workHistories",
            onDelete: "CASCADE",
        });

        // Association with Department model if exists
        // ApplicantTracking.belongsTo(models.Department, {
        //     foreignKey: 'department',
        //     targetKey: 'name',
        //     as: 'departmentInfo'
        // });
    };

    return ApplicantTracking;
};
