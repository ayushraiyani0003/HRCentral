/**
 * Employee Service
 * Handles CRUD operations for employee entities
 */

const {
    Employee,
    ApplicantEducation,
    ApplicantWorkHistory,
    Language,
    HiringSource,
    UserList,
} = require("../../models");

class EmployeeService {
    /**
     * Create a new employee
     * @param {Object} data - Employee data
     * @param {number} data.employee_id - Employee ID
     * @param {string} [data.punch_code] - Punch code
     * @param {string} data.first_name - First name
     * @param {string} data.father_name - Father's name
     * @param {string} [data.surname] - Surname
     * @param {string} data.mobile_no - Mobile number
     * @param {string} [data.whatsapp_no] - WhatsApp number
     * @param {string} data.email_id - Email ID
     * @param {string} data.date_of_birth - Date of birth
     * @param {string} data.gender - Gender (Male/Female/Other)
     * @param {string} data.address - Address
     * @param {string} [data.city] - City
     * @param {string} [data.state] - State
     * @param {string} [data.postal_code] - Postal code
     * @param {string} [data.country] - Country
     * @param {boolean} data.driving_license - Driving license status
     * @param {string} [data.cast] - Cast/Category
     * @param {string} data.marital_status - Marital status (married/unmarried)
     * @param {boolean} data.major_surgery_or_alergy_or_illness - Medical history
     * @param {string} [data.strength] - Strengths
     * @param {string} [data.weakness] - Weaknesses
     * @param {boolean} data.previous_salary_slip - Previous salary slip available
     * @param {string} data.department - Department
     * @param {string} data.designation - Designation
     * @param {string} data.date_of_joining - Date of joining
     * @param {number} [data.salary] - Salary
     * @param {string} [data.employment_status] - Employment status
     * @param {string} [data.work_location] - Work location
     * @param {string} [data.emergency_contact_name] - Emergency contact name
     * @param {string} [data.emergency_contact_phone] - Emergency contact phone
     * @param {string} [data.emergency_contact_relation] - Emergency contact relation
     * @param {string} data.language_id - Language ID reference
     * @param {string} data.education_id - Education ID reference
     * @param {string} [data.work_id] - Work ID reference
     * @param {string} [data.reference_employee_id] - Reference employee ID
     * @param {string} [data.reference_relation] - Reference relation
     * @param {string} [data.hiring_source_id] - Hiring source ID
     * @returns {Promise<Object>} Created employee
     */
    async create(data) {
        try {
            const employee = await Employee.create(data);

            // Include related data in response
            const includes = [];

            if (data.education_id) {
                includes.push({
                    model: ApplicantEducation,
                    as: "education",
                });
            }

            if (data.work_id) {
                includes.push({
                    model: ApplicantWorkHistory,
                    as: "workHistory",
                });
            }

            if (data.language_id) {
                includes.push({
                    model: Language,
                    as: "language",
                });
            }

            if (data.hiring_source_id) {
                includes.push({
                    model: HiringSource,
                    as: "hiringSource",
                });
            }

            if (data.reference_employee_id) {
                includes.push({
                    model: Employee,
                    as: "referenceEmployee",
                });
            }

            if (includes.length > 0) {
                const employeeWithDetails = await Employee.findByPk(
                    employee.id,
                    {
                        include: includes,
                    }
                );
                return employeeWithDetails;
            }

            return employee;
        } catch (error) {
            throw new Error(`Failed to create employee: ${error.message}`);
        }
    }
    /**
     * Retrieves all employees with their associated details
     * @async
     * @function getAll
     * @returns {Promise<Array>} Promise that resolves to an array of employee objects with related details
     * @throws {Error} Throws an error if the database query fails
     */
    async getAll() {
        try {
            const employees = await Employee.findAll({
                include: [
                    {
                        model: ApplicantEducation,
                        as: "education",
                        required: false, // LEFT JOIN
                    },
                    {
                        model: ApplicantWorkHistory,
                        as: "workHistory",
                        required: false, // LEFT JOIN
                    },
                    {
                        model: Language,
                        as: "language",
                        required: false, // LEFT JOIN
                    },
                    {
                        model: HiringSource,
                        as: "hiringSource",
                        required: false, // LEFT JOIN
                    },
                    {
                        model: Employee,
                        as: "referenceEmployee",
                        required: false, // LEFT JOIN
                        attributes: [
                            "id",
                            "first_name",
                            "surname",
                            "employee_id",
                        ],
                    },
                    {
                        model: UserList,
                        as: "user",
                        required: false, // LEFT JOIN
                    },
                ],
                order: [["createdAt", "DESC"]], // Order by creation date, newest first
            });

            return employees;
        } catch (error) {
            throw new Error(`Failed to fetch employees: ${error.message}`);
        }
    }

    /**
     * Find employee by ID with all related details
     * @param {string} id - The employee ID (UUID)
     * @returns {Promise<Object|null>} Promise that resolves to employee object with related data or null if not found
     * @throws {Error} Throws error if database operation fails
     */
    async findById(id) {
        try {
            const employee = await Employee.findByPk(id, {
                include: [
                    {
                        model: ApplicantEducation,
                        as: "education",
                    },
                    {
                        model: ApplicantWorkHistory,
                        as: "workHistory",
                    },
                    {
                        model: Language,
                        as: "language",
                    },
                    {
                        model: HiringSource,
                        as: "hiringSource",
                    },
                    {
                        model: Employee,
                        as: "referenceEmployee",
                        attributes: [
                            "id",
                            "first_name",
                            "surname",
                            "employee_id",
                        ],
                    },
                    {
                        model: UserList,
                        as: "user",
                    },
                ],
            });

            return employee;
        } catch (error) {
            throw new Error(`Failed to find employee: ${error.message}`);
        }
    }

    /**
     * Find employee by employee_id (integer) with all related details
     * @param {number} employeeId - The employee ID (integer)
     * @returns {Promise<Object|null>} Promise that resolves to employee object with related data or null if not found
     * @throws {Error} Throws error if database operation fails
     */
    async findByEmployeeId(employeeId) {
        try {
            const employee = await Employee.findOne({
                where: { employee_id: employeeId },
                include: [
                    {
                        model: ApplicantEducation,
                        as: "education",
                    },
                    {
                        model: ApplicantWorkHistory,
                        as: "workHistory",
                    },
                    {
                        model: Language,
                        as: "language",
                    },
                    {
                        model: HiringSource,
                        as: "hiringSource",
                    },
                    {
                        model: Employee,
                        as: "referenceEmployee",
                        attributes: [
                            "id",
                            "first_name",
                            "surname",
                            "employee_id",
                        ],
                    },
                    {
                        model: UserList,
                        as: "user",
                    },
                ],
            });

            return employee;
        } catch (error) {
            throw new Error(
                `Failed to find employee by employee_id: ${error.message}`
            );
        }
    }

    /**
     * Update employee by ID
     * @param {string} id - Employee ID (UUID)
     * @param {Object} data - Updated employee data
     * @returns {Promise<Object|null>} Updated employee or null if not found
     */
    async update(id, data) {
        try {
            //Update the employee record
            const [updatedRowsCount] = await Employee.update(data, {
                where: { id: id },
            });

            if (updatedRowsCount === 0) {
                throw new Error("Employee not found or no changes made");
            }

            // Optionally include related data (education, work history, language, etc.) in response
            if (
                data.education_id ||
                data.work_id ||
                data.language_id ||
                data.reference_employee_id ||
                data.hiring_source_id
            ) {
                const includes = [];

                if (data.education_id) {
                    includes.push({
                        model: EmployeeEducation,
                        as: "education", //Make sure this alias matches your model association
                    });
                }

                if (data.work_id) {
                    includes.push({
                        model: workHistory,
                        as: "workHistory", // Make sure this alias matches your model association
                    });
                }

                if (data.language_id) {
                    includes.push({
                        model: language,
                        as: "language", // Make sure this alias matches your model association
                    });
                }

                if (data.reference_employee_id) {
                    includes.push({
                        model: employee,
                        as: "employee", // Make sure this alias matches your model association
                    });
                }

                if (data.hiring_source_id) {
                    includes.push({
                        model: HiringSource,
                        as: "hiringSource", // Make sure this alias matches your model association
                    });
                }

                const employeeWithDetails = await Employee.findByPk(id, {
                    include: includes,
                });
                return employeeWithDetails;
            }

            const updatedEmployee = await Employee.findByPk(id);
            return updatedEmployee;
        } catch (error) {
            throw new Error(`Failed to update employee: ${error.message}`);
        }
    }

    /**
     * Delete employee by ID
     * @param {string} id - Employee ID (UUID)
     * @returns {Promise<boolean>} True if deleted, false if not found
     */
    async delete(id) {
        try {
            const deletedRowsCount = await Employee.destroy({
                where: { id: id },
            });

            if (deletedRowsCount === 0) {
                throw new Error("Employee not found");
            }

            return true;
        } catch (error) {
            throw new Error(`Failed to delete employee: ${error.message}`);
        }
    }

    /**
     * Get employees by department
     * @param {string} department - Department name
     * @returns {Promise<Array>} Promise that resolves to an array of employees in the department
     */
    async findByDepartment(department) {
        try {
            const employees = await Employee.findAll({
                where: { department: department },
                order: [["first_name", "ASC"]],
            });

            return employees;
        } catch (error) {
            throw new Error(
                `Failed to find employees by department: ${error.message}`
            );
        }
    }

    /**
     * Get employees by employment status
     * @param {string} status - Employment status (Active, Inactive, On Leave, Terminated, Resigned)
     * @returns {Promise<Array>} Promise that resolves to an array of employees with the specified status
     */
    async findByEmploymentStatus(status) {
        try {
            const employees = await Employee.findAll({
                where: { employment_status: status },
                order: [["first_name", "ASC"]],
            });

            return employees;
        } catch (error) {
            throw new Error(
                `Failed to find employees by employment status: ${error.message}`
            );
        }
    }

    /**
     * Search employees by name (first_name, father_name, surname)
     * @param {string} searchTerm - Search term
     * @returns {Promise<Array>} Promise that resolves to an array of matching employees
     */
    async searchByName(searchTerm) {
        try {
            const { Op } = require("sequelize");

            const employees = await Employee.findAll({
                where: {
                    [Op.or]: [
                        { first_name: { [Op.iLike]: `%${searchTerm}%` } },
                        { father_name: { [Op.iLike]: `%${searchTerm}%` } },
                        { surname: { [Op.iLike]: `%${searchTerm}%` } },
                    ],
                },
                order: [["first_name", "ASC"]],
            });

            return employees;
        } catch (error) {
            throw new Error(
                `Failed to search employees by name: ${error.message}`
            );
        }
    }
}

module.exports = new EmployeeService();
