// =================== services/Employee.service.js ===================
const { Employee } = require("../../models");

/**
 * Service class for handling employee operations
 * Provides CRUD operations for employee records
 */
class EmployeeService {
  /**
   * Create a new employee record
   * @async
   * @method create
   * @param {Object} employeeData - The employee data to create
   * @param {string} employeeData.first_name - Employee's first name
   * @param {string} employeeData.middle_name - Employee's middle name
   * @param {string} employeeData.surname - Employee's surname
   * @param {string} employeeData.email_id - Employee's email address
   * @param {Date} employeeData.date_of_birth - Employee's date of birth
   * @param {string} employeeData.gender - Employee's gender (Male/Female/Other)
   * @param {string} employeeData.department - Employee's department
   * @param {string} employeeData.designation - Employee's designation
   * @param {Date} employeeData.date_of_joining - Employee's joining date
   * @param {string} employeeData.marital_status - Employee's marital status
   * @param {string} employeeData.attendance - Attendance type (Daily/Monthly)
   * @param {string} employeeData.employment_status - Employment status (Active/Inactive/On Leave/Terminated/Resigned)
   * @returns {Promise<Object>} Created employee record
   * @throws {Error} If employee creation fails
   */
  async create(employeeData) {
    try {
      const employee = await Employee.create(employeeData);
      return employee;
    } catch (error) {
      throw new Error(`Error creating employee record: ${error.message}`);
    }
  }

  /**
   * Get all employee records
   * @async
   * @method getAll
   * @returns {Promise<Array<Object>>} Array of employee records
   * @throws {Error} If fetching employees fails
   */
  async getAll() {
    try {
      const employees = await Employee.findAll();
      return employees;
    } catch (error) {
      throw new Error(`Error fetching employee records: ${error.message}`);
    }
  }
  /**
   * Get employee record by ID
   * @param {String} id - The employee record ID (UUID)
   * @returns {Promise<Object>} Response object with success flag and data
   */
  async getById(id) {
    try {
      const employee = await Employee.findByPk(id);

      if (!employee) {
        return {
          success: false,
          message: "Employee not found",
          data: null,
        };
      }

      return {
        success: true,
        message: "Employee found successfully",
        data: employee.toJSON(), // Convert Sequelize instance to plain object
      };
    } catch (error) {
      return {
        success: false,
        message: `Error fetching employee record by ID: ${error.message}`,
        data: null,
      };
    }
  }
  /**
   * Update employee record by ID
   * @async
   * @method update
   * @param {string} id - The employee record ID (UUID)
   * @param {Object} updateData - The data to update
   * @param {Object} [options={}] - Transaction options
   * @param {Object} [options.transaction] - Sequelize transaction object
   * @returns {Promise<Object|null>} Updated employee record or null if not found
   * @throws {Error} If updating employee fails
   */
  async update(id, updateData, options = {}) {
    try {
      const [updatedRowsCount] = await Employee.update(updateData, {
        where: { id },
        ...options, // This will include transaction if provided
      });

      if (updatedRowsCount === 0) {
        return null;
      }

      const updatedEmployee = await Employee.findByPk(id, options);
      return updatedEmployee;
    } catch (error) {
      throw new Error(`Error updating employee record: ${error.message}`);
    }
  }

  /**
   * Delete employee record by ID
   * @async
   * @method delete
   * @param {string} id - The employee record ID (UUID)
   * @returns {Promise<boolean>} True if deleted, false if not found
   * @throws {Error} If deleting employee fails
   */
  async delete(id) {
    try {
      const deletedRowsCount = await Employee.destroy({
        where: { id },
      });

      return deletedRowsCount > 0;
    } catch (error) {
      throw new Error(`Error deleting employee record: ${error.message}`);
    }
  }
}

/**
 * Singleton instance of EmployeeService
 * @type {EmployeeService}
 */
module.exports = new EmployeeService();
