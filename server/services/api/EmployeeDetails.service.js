// =================== services/EmployeeDetails.service.js ===================
const { EmployeeDetails } = require("../../models");

class EmployeeDetailsService {
  /**
   * Create a new employee details record
   * @param {Object} employeeData - The employee details data to create
   * @returns {Promise<Object>} Response object with success flag, message and data
   */
  async create(employeeData) {
    try {
      const employee = await EmployeeDetails.create(employeeData);
      return {
        success: true,
        message: "Employee details created successfully",
        data: employee.toJSON(),
      };
    } catch (error) {
      return {
        success: false,
        message: `Error creating employee details record: ${error.message}`,
        data: null,
      };
    }
  }

  /**
   * Get all employee details records
   * @returns {Promise<Object>} Response object with success flag, message and data
   */
  async getAll() {
    try {
      const employees = await EmployeeDetails.findAll();

      return {
        success: true,
        message: "Employee details fetched successfully",
        data: employees.map((emp) => emp.toJSON()),
      };
    } catch (error) {
      return {
        success: false,
        message: `Error fetching employee details records: ${error.message}`,
        data: null,
      };
    }
  }

  /**
   * Get employee details record by ID
   * @param {String} id - The employee details record ID
   * @returns {Promise<Object>} Response object with success flag, message and data
   */
  async getById(id) {
    try {
      const employee = await EmployeeDetails.findByPk(id);

      if (!employee) {
        return {
          success: false,
          message: "Employee details not found",
          data: null,
        };
      }

      return {
        success: true,
        message: "Employee details found successfully",
        data: employee.toJSON(),
      };
    } catch (error) {
      return {
        success: false,
        message: `Error fetching employee details record by ID: ${error.message}`,
        data: null,
      };
    }
  }

  /**
   * Update employee details record by ID
   * @param {String} id - The employee details record ID
   * @param {Object} updateData - The data to update
   * @param {Object} options - Transaction options
   * @returns {Promise<Object>} Response object with success flag, message and data
   */
  async update(id, updateData, options = {}) {
    try {
      const [updatedRowsCount] = await EmployeeDetails.update(updateData, {
        where: { id },
        ...options, // This will include transaction if provided
      });

      if (updatedRowsCount === 0) {
        return {
          success: false,
          message: "Employee details not found",
          data: null,
        };
      }

      const updatedEmployee = await EmployeeDetails.findByPk(id, options);
      return {
        success: true,
        message: "Employee details updated successfully",
        data: updatedEmployee.toJSON(),
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating employee details record: ${error.message}`,
        data: null,
      };
    }
  }

  /**
   * Delete employee details record by ID
   * @param {String} id - The employee details record ID
   * @returns {Promise<Object>} Response object with success flag, message and data
   */
  async delete(id) {
    try {
      const deletedRowsCount = await EmployeeDetails.destroy({
        where: { id },
      });

      if (deletedRowsCount > 0) {
        return {
          success: true,
          message: "Employee details deleted successfully",
          data: null,
        };
      } else {
        return {
          success: false,
          message: "Employee details not found",
          data: null,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Error deleting employee details record: ${error.message}`,
        data: null,
      };
    }
  }
}

module.exports = new EmployeeDetailsService();
