/**
 * Employee Model
 * Represents employee information and details in the system
 *
 * @param {Object} sequelize - Sequelize instance
 * @param {Object} DataTypes - Sequelize data types
 * @returns {Object} Employee model
 */
module.exports = (sequelize, DataTypes) => {
    const Employee = sequelize.define(
        "Employee",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            employee_id: {
                type: DataTypes.INTEGER(50),
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true,
                },
            },
            punch_code: {
                type: DataTypes.STRING(20),
                allowNull: true,
                unique: true,
                validate: {
                    notEmpty: true,
                },
            },
            first_name: {
                type: DataTypes.STRING(50),
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [2, 50],
                    isAlpha: true,
                },
            },
            father_name: {
                type: DataTypes.STRING(50),
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [2, 50],
                    isAlpha: true,
                },
            },
            surname: {
                type: DataTypes.STRING(50),
                allowNull: true,
                validate: {
                    len: [0, 50],
                    isAlpha: true,
                },
            },
            mobile_no: {
                type: DataTypes.STRING(15),
                allowNull: false,
                validate: {
                    notEmpty: true,
                    is: /^[\+]?[\d\s\-\(\)]{10,15}$/,
                },
            },
            whatsapp_no: {
                type: DataTypes.STRING(15),
                allowNull: true,
                validate: {
                    is: /^[\+]?[\d\s\-\(\)]{10,15}$/,
                },
            },
            email_id: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                    notEmpty: true,
                },
            },
            date_of_birth: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                validate: {
                    isBefore: new Date().toISOString().split("T")[0], // Cannot be future date
                },
            },
            gender: {
                type: DataTypes.ENUM("Male", "Female", "Other"),
                allowNull: false,
            },
            address: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            city: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            state: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            postal_code: {
                type: DataTypes.STRING(10),
                allowNull: true,
            },
            country: {
                type: DataTypes.STRING(50),
                allowNull: true,
                defaultValue: "India",
            },
            cast: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            marital_status: {
                type: DataTypes.ENUM("married", "unmarried"),
                allowNull: false,
            },
            major_surgery_or_alergy_or_illness: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                comment: "true = Yes, false = No",
            },
            strength: {
                type: DataTypes.STRING(200),
                allowNull: true,
            },
            weakness: {
                type: DataTypes.STRING(200),
                allowNull: true,
            },
            previous_salary_slip: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                comment: "true = Yes, false = No",
            },
            department: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            designation: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            date_of_joining: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                validate: {
                    notEmpty: true, // here we have to implement code for getting system date...
                },
            },
            salary: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
                validate: {
                    min: 0,
                },
            },
            employment_status: {
                type: DataTypes.ENUM(
                    "Active",
                    "Inactive",
                    "On Leave",
                    "Terminated",
                    "Resigned"
                ),
                allowNull: false,
                defaultValue: "Active",
            },
            emergency_contact_name: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            emergency_contact_phone: {
                type: DataTypes.STRING(15),
                allowNull: true,
                validate: {
                    is: /^[\+]?[\d\s\-\(\)]{10,15}$/,
                },
            },
            emergency_contact_relation: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            //reference from language model
            language_id: {
                type: DataTypes.TEXT,
                allowNull: false,
                comment: "Reference to Language table",
            },
            // reference from education model
            education_id: {
                type: DataTypes.TEXT,
                allowNull: false,
                comment: "Reference to applicant education table",
            },
            //reference from work model
            work_id: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: "Reference to applicant work history table",
            },
            //reference from employee list model
            reference_employee_id: {
                type: DataTypes.UUID,
                allowNull: true,
                comment:
                    "Employee who referred this applicant reference to employee list table",
            },
            //reference for hiring source model
            hiring_source_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },
        },
        {
            tableName: "Employees",
            timestamps: true,
            underscored: true,
            indexes: [
                {
                    name: "employee_id_unique_idx",
                    unique: true,
                    fields: ["employee_id"],
                },
                {
                    name: "email_unique_idx",
                    unique: true,
                    fields: ["email"],
                },
                {
                    name: "department_idx",
                    fields: ["department"],
                },
                {
                    name: "designation_idx",
                    fields: ["designation"],
                },
                {
                    name: "employment_status_idx",
                    fields: ["employment_status"],
                },
                {
                    name: "name_search_idx",
                    fields: ["first_name", "last_name"],
                },
            ],
        }
    );

    /**
     * Define model associations
     * @param {Object} models - All defined models
     */
    Employee.associate = (models) => {
        // Association with UserList
        Employee.hasOne(models.UserList, {
            foreignKey: "employee_id",
            as: "user",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        // Association with Education model
        Employee.belongsTo(models.ApplicantEducation, {
            foreignKey: "education_id",
            as: "education",
            onDelete: "CASCADE",
        });

        // Association with Work History model
        Employee.belongsTo(models.ApplicantWorkHistory, {
            foreignKey: "work_id",
            as: "workHistory",
            onDelete: "CASCADE",
        });

        // Association with EmployeeList model (reference employee)
        Employee.hasOne(models.Employee, {
            foreignKey: "reference_employee_id",
            as: "referenceEmployee",
            constraints: false,
        });

        // Association with HiringSource model
        Employee.hasOne(models.HiringSource, {
            foreignKey: "hiring_source_id",
            as: "hiringSource",
            constraints: false,
        });

        // Association with Language model
        Employee.belongsTo(models.Language, {
            foreignKey: "language_id",
            as: "language",
            constraints: false,
        });

        // Add other associations as needed
        // Employee.belongsToMany(models.Skill, { through: 'EmployeeSkills', foreignKey: 'employeeId' });
        // Employee.hasMany(models.LeaveRequest, { foreignKey: 'employeeId' });
    };

    return Employee;
};
