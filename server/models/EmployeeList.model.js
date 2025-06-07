/**
 * Employee Model
 * Represents employee information and details in the system
 *
 * @param {Object} sequelize - Sequelize instance
 * @param {Object} DataTypes - Sequelize data types
 * @returns {Object} Employee model
 */
// TODO this is only for testing, later fix the model and their column
module.exports = (sequelize, DataTypes) => {
    const Employee = sequelize.define(
        "Employee",
        {
            /**
             * Auto-incrementing primary key
             * @type {number}
             */
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            /**
             * Unique employee identifier (company assigned)
             * @type {string}
             */
            employeeId: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true,
                },
            },
            punchCode: {
                type: DataTypes.STRING(20),
                allowNull: true,
                unique: true,
                validate: {
                    notEmpty: true,
                },
            },
            /**
             * Employee's first name
             * @type {string}
             */
            firstName: {
                type: DataTypes.STRING(50),
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [2, 50],
                    isAlpha: true,
                },
            },
            /**
             * Employee's last name
             * @type {string}
             */
            lastName: {
                type: DataTypes.STRING(50),
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [2, 50],
                    isAlpha: true,
                },
            },
            /**
             * Employee's surname/family name
             * @type {string}
             */
            surName: {
                type: DataTypes.STRING(50),
                allowNull: true,
                validate: {
                    len: [0, 50],
                    isAlpha: true,
                },
            },
            /**
             * Primary phone number
             * @type {string}
             */
            phoneNo1: {
                type: DataTypes.STRING(15),
                allowNull: false,
                validate: {
                    notEmpty: true,
                    is: /^[\+]?[\d\s\-\(\)]{10,15}$/,
                },
            },
            /**
             * Secondary phone number (optional)
             * @type {string}
             */
            phoneNo2: {
                type: DataTypes.STRING(15),
                allowNull: true,
                validate: {
                    is: /^[\+]?[\d\s\-\(\)]{10,15}$/,
                },
            },
            /**
             * Employee's email address
             * @type {string}
             */
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                    notEmpty: true,
                },
            },
            /**
             * Employee's date of birth
             * @type {Date}
             */
            dateOfBirth: {
                type: DataTypes.DATEONLY,
                allowNull: true,
                validate: {
                    isBefore: new Date().toISOString().split("T")[0], // Cannot be future date
                },
            },
            /**
             * Employee's gender
             * @type {string}
             */
            gender: {
                type: DataTypes.ENUM(
                    "Male",
                    "Female",
                    "Other",
                    "Prefer not to say"
                ),
                allowNull: true,
            },
            /**
             * Employee's current address
             * @type {string}
             */
            address: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            /**
             * City of residence
             * @type {string}
             */
            city: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            /**
             * State/Province of residence
             * @type {string}
             */
            state: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            /**
             * Postal/ZIP code
             * @type {string}
             */
            postalCode: {
                type: DataTypes.STRING(10),
                allowNull: true,
            },
            /**
             * Country of residence
             * @type {string}
             */
            country: {
                type: DataTypes.STRING(50),
                allowNull: true,
                defaultValue: "India",
            },
            /**
             * Department the employee belongs to
             * @type {string}
             */
            department: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            /**
             * Employee's job designation/title
             * @type {string}
             */
            designation: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            /**
             * Date when employee joined the company
             * @type {Date}
             */
            dateOfJoining: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            /**
             * Employee's current salary
             * @type {number}
             */
            salary: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
                validate: {
                    min: 0,
                },
            },
            /**
             * Employee's employment status
             * @type {string}
             */
            employmentStatus: {
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
            /**
             * Employee's work location/office
             * @type {string}
             */
            workLocation: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            /**
             * Direct reporting manager's employee ID
             * @type {number}
             */
            managerId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "Employees",
                    key: "id",
                },
            },
            /**
             * Emergency contact name
             * @type {string}
             */
            emergencyContactName: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            /**
             * Emergency contact phone number
             * @type {string}
             */
            emergencyContactPhone: {
                type: DataTypes.STRING(15),
                allowNull: true,
                validate: {
                    is: /^[\+]?[\d\s\-\(\)]{10,15}$/,
                },
            },
            /**
             * Relationship with emergency contact
             * @type {string}
             */
            emergencyContactRelation: {
                type: DataTypes.STRING(50),
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
                    name: "manager_id_idx",
                    fields: ["manager_id"],
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
        // Self-referencing association for manager
        Employee.belongsTo(models.Employee, {
            foreignKey: "managerId",
            as: "manager",
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
        });

        // Association for subordinates
        Employee.hasMany(models.Employee, {
            foreignKey: "managerId",
            as: "subordinates",
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
        });

        // Association with UserList
        Employee.hasOne(models.UserList, {
            foreignKey: "employeeId",
            as: "user",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });

        // Add other associations as needed
        // Employee.belongsToMany(models.Skill, { through: 'EmployeeSkills', foreignKey: 'employeeId' });
        // Employee.hasMany(models.LeaveRequest, { foreignKey: 'employeeId' });
    };

    /**
     * Instance method to get full name
     * @returns {string} Full name of employee
     */
    Employee.prototype.getFullName = function () {
        const parts = [this.firstName, this.lastName];
        if (this.surName) {
            parts.push(this.surName);
        }
        return parts.join(" ");
    };

    /**
     * Instance method to check if employee is active
     * @returns {boolean} True if employee is active
     */
    Employee.prototype.isActive = function () {
        return this.employmentStatus === "Active";
    };

    /**
     * Instance method to calculate years of service
     * @returns {number} Years of service
     */
    Employee.prototype.getYearsOfService = function () {
        const today = new Date();
        const joinDate = new Date(this.dateOfJoining);
        const diffTime = Math.abs(today - joinDate);
        const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
        return diffYears;
    };

    /**
     * Class method to find employees by department
     * @param {string} department - Department name
     * @returns {Promise<Array>} Array of employees
     */
    Employee.findByDepartment = function (department) {
        return this.findAll({
            where: {
                department: department,
                employmentStatus: "Active",
            },
        });
    };

    /**
     * Class method to find employees by manager
     * @param {number} managerId - Manager's ID
     * @returns {Promise<Array>} Array of employees
     */
    Employee.findByManager = function (managerId) {
        return this.findAll({
            where: {
                managerId: managerId,
                employmentStatus: "Active",
            },
        });
    };

    return Employee;
};
