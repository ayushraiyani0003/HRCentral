// =================== services/EmployeeListService.js ===================
const { EmployeeListService } = require("../../models");
const { Op } = require("sequelize");

class EmployeeListService {
    /**
     * Create a new employee
     * @param {Object} employeeData - Employee data
     * @returns {Promise<Object>} Created employee
     */
    async createEmployee(employeeData) {
        try {
            const employee = await Employee.create(employeeData);
            return { success: true, data: employee };
        } catch (error) {
            if (error.name === "SequelizeUniqueConstraintError") {
                return {
                    success: false,
                    error: "Employee ID or email already exists",
                };
            }
            return { success: false, error: error.message };
        }
    }

    /**
     * Get all employees with pagination and filters
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Employees list
     */
    async getAllEmployees(options = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                department,
                designation,
                status,
            } = options;
            const offset = (page - 1) * limit;

            const whereClause = {};
            if (department) whereClause.department = department;
            if (designation) whereClause.designation = designation;
            if (status) whereClause.employmentStatus = status;

            const { count, rows } = await Employee.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: Employee,
                        as: "manager",
                        attributes: [
                            "id",
                            "firstName",
                            "lastName",
                            "employeeId",
                        ],
                    },
                    {
                        model: Employee,
                        as: "subordinates",
                        attributes: [
                            "id",
                            "firstName",
                            "lastName",
                            "employeeId",
                        ],
                    },
                ],
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [["firstName", "ASC"]],
            });

            return {
                success: true,
                data: {
                    employees: rows,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(count / limit),
                        totalItems: count,
                        itemsPerPage: limit,
                    },
                },
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Get employee by ID
     * @param {number} id - Employee ID
     * @returns {Promise<Object>} Employee data
     */
    async getEmployeeById(id) {
        try {
            const employee = await Employee.findByPk(id, {
                include: [
                    {
                        model: Employee,
                        as: "manager",
                        attributes: [
                            "id",
                            "firstName",
                            "lastName",
                            "employeeId",
                        ],
                    },
                    {
                        model: Employee,
                        as: "subordinates",
                        attributes: [
                            "id",
                            "firstName",
                            "lastName",
                            "employeeId",
                        ],
                    },
                ],
            });

            if (!employee) {
                return { success: false, error: "Employee not found" };
            }

            return { success: true, data: employee };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Get employee by employee ID
     * @param {string} employeeId - Employee ID
     * @returns {Promise<Object>} Employee data
     */
    async getEmployeeByEmployeeId(employeeId) {
        try {
            const employee = await Employee.findOne({
                where: { employeeId },
                include: [
                    {
                        model: Employee,
                        as: "manager",
                        attributes: [
                            "id",
                            "firstName",
                            "lastName",
                            "employeeId",
                        ],
                    },
                    {
                        model: Employee,
                        as: "subordinates",
                        attributes: [
                            "id",
                            "firstName",
                            "lastName",
                            "employeeId",
                        ],
                    },
                ],
            });

            if (!employee) {
                return { success: false, error: "Employee not found" };
            }

            return { success: true, data: employee };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Update employee
     * @param {number} id - Employee ID
     * @param {Object} updateData - Update data
     * @returns {Promise<Object>} Updated employee
     */
    async updateEmployee(id, updateData) {
        try {
            const [updatedRowsCount] = await Employee.update(updateData, {
                where: { id },
            });

            if (updatedRowsCount === 0) {
                return { success: false, error: "Employee not found" };
            }

            const updatedEmployee = await this.getEmployeeById(id);
            return updatedEmployee;
        } catch (error) {
            if (error.name === "SequelizeUniqueConstraintError") {
                return {
                    success: false,
                    error: "Employee ID or email already exists",
                };
            }
            return { success: false, error: error.message };
        }
    }

    /**
     * Search employees
     * @param {string} searchTerm - Search term
     * @returns {Promise<Object>} Search results
     */
    async searchEmployees(searchTerm) {
        try {
            const employees = await Employee.findAll({
                where: {
                    [Op.or]: [
                        { firstName: { [Op.like]: `%${searchTerm}%` } },
                        { lastName: { [Op.like]: `%${searchTerm}%` } },
                        { employeeId: { [Op.like]: `%${searchTerm}%` } },
                        { email: { [Op.like]: `%${searchTerm}%` } },
                    ],
                },
                include: [
                    {
                        model: Employee,
                        as: "manager",
                        attributes: [
                            "id",
                            "firstName",
                            "lastName",
                            "employeeId",
                        ],
                    },
                ],
            });

            return { success: true, data: employees };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Get employees by department
     * @param {string} department - Department name
     * @returns {Promise<Object>} Employees list
     */
    async getEmployeesByDepartment(department) {
        try {
            const employees = await Employee.findByDepartment(department);
            return { success: true, data: employees };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Get employees by manager
     * @param {number} managerId - Manager ID
     * @returns {Promise<Object>} Employees list
     */
    async getEmployeesByManager(managerId) {
        try {
            const employees = await Employee.findByManager(managerId);
            return { success: true, data: employees };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Update employee status
     * @param {number} id - Employee ID
     * @param {string} status - New employment status
     * @returns {Promise<Object>} Updated employee
     */
    async updateEmployeeStatus(id, status) {
        try {
            const result = await this.updateEmployee(id, {
                employmentStatus: status,
            });
            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Delete employee (soft delete by updating status)
     * @param {number} id - Employee ID
     * @returns {Promise<Object>} Delete result
     */
    async deleteEmployee(id) {
        try {
            const result = await this.updateEmployee(id, {
                employmentStatus: "Terminated",
            });
            if (result.success) {
                return {
                    success: true,
                    message: "Employee terminated successfully",
                };
            }
            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Get employee hierarchy
     * @param {number} managerId - Manager ID
     * @returns {Promise<Object>} Employee hierarchy
     */
    async getEmployeeHierarchy(managerId) {
        try {
            const buildHierarchy = async (empId) => {
                const employee = await Employee.findByPk(empId, {
                    attributes: [
                        "id",
                        "firstName",
                        "lastName",
                        "employeeId",
                        "designation",
                        "department",
                    ],
                });

                if (!employee) return null;

                const subordinates = await Employee.findAll({
                    where: { managerId: empId, employmentStatus: "Active" },
                    attributes: [
                        "id",
                        "firstName",
                        "lastName",
                        "employeeId",
                        "designation",
                        "department",
                    ],
                });

                const hierarchyData = {
                    ...employee.toJSON(),
                    subordinates: [],
                };

                for (const subordinate of subordinates) {
                    const subHierarchy = await buildHierarchy(subordinate.id);
                    if (subHierarchy) {
                        hierarchyData.subordinates.push(subHierarchy);
                    }
                }

                return hierarchyData;
            };

            const hierarchy = await buildHierarchy(managerId);
            return { success: true, data: hierarchy };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = new EmployeeListService();
