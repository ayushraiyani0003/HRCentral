// =================== services/EmployeeDetails.service.js ===================
const { EmployeeDetails } = require("../../models");

class EmployeeDetailsService {
  /**
   * Create a new employee details record
   * @param {Object} employeeData - The employee details data to create
   * @returns {Promise<Object>} Created employee details record
   */
  async create(employeeData) {
    try {
      const employee = await EmployeeDetails.create(employeeData);
      return employee;
    } catch (error) {
      throw new Error(
        `Error creating employee details record: ${error.message}`
      );
    }
  }

  /**
   * Get all employee details records
   * @returns {Promise<Array>} Array of employee details records
   */
  async getAll() {
    try {
      const employees = await EmployeeDetails.findAll();

      return employees;
    } catch (error) {
      throw new Error(
        `Error fetching employee details records: ${error.message}`
      );
    }
  }

  /**
   * Get employee details record by ID
   * @param {String} id - The employee details record ID
   * @returns {Promise<Object|null>} Employee details record or null if not found
   */
  async getById(id) {
    try {
      const employee = await EmployeeDetails.findByPk(id);
      return employee;
    } catch (error) {
      throw new Error(
        `Error fetching employee details record by ID: ${error.message}`
      );
    }
  }

  /**
   * Update employee details record by ID
   * @param {String} id - The employee details record ID
   * @param {Object} updateData - The data to update
   * @param {Object} options - Transaction options
   * @returns {Promise<Object|null>} Updated employee details record or null if not found
   */
  async update(id, updateData, options = {}) {
    try {
      const [updatedRowsCount] = await EmployeeDetails.update(updateData, {
        where: { id },
        ...options, // This will include transaction if provided
      });

      if (updatedRowsCount === 0) {
        return null;
      }

      const updatedEmployee = await EmployeeDetails.findByPk(id, options);
      return updatedEmployee;
    } catch (error) {
      throw new Error(
        `Error updating employee details record: ${error.message}`
      );
    }
  }

  /**
   * Delete employee details record by ID
   * @param {String} id - The employee details record ID
   * @returns {Promise<Boolean>} True if deleted, false if not found
   */
  async delete(id) {
    try {
      const deletedRowsCount = await EmployeeDetails.destroy({
        where: { id },
      });

      return deletedRowsCount > 0;
    } catch (error) {
      throw new Error(
        `Error deleting employee details record: ${error.message}`
      );
    }
  }
}

module.exports = new EmployeeDetailsService();
