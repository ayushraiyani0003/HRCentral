// =================== services/EmployeeType.service.js ===================

const { EmployeeType } = require("../../models"); // Adjust path as needed
const { Op } = require("sequelize");

/**
 * EmployeeType Service
 * Handles all CRUD operations for EmployeeType model
 */
class EmployeeTypeService {
    /**
     * Create a new employee type
     * @param {Object} employeeTypeData - The employee type data
     * @param {string} employeeTypeData.name - The name of the employee type
     * @returns {Promise<Object>} The created employee type
     * @throws {Error} If creation fails or validation error occurs
     */
    async add(employeeTypeData) {
        try {
            const employeeType = await EmployeeType.create(employeeTypeData);
            return employeeType;
        } catch (error) {
            throw new Error(`Failed to create employee type: ${error.message}`);
        }
    }

    /**
     * Get all employee types
     * @returns {Promise<Array>} Array of all employee types
     * @throws {Error} If retrieval fails
     */
    async readAll() {
        try {
            const employeeTypes = await EmployeeType.findAll({
                order: [["created_at", "DESC"]],
            });
            return employeeTypes;
        } catch (error) {
            throw new Error(
                `Failed to retrieve employee types: ${error.message}`
            );
        }
    }

    /**
     * Get employee type by ID
     * @param {string} id - The UUID of the employee type
     * @returns {Promise<Object|null>} The employee type object or null if not found
     * @throws {Error} If retrieval fails
     */
    async readById(id) {
        try {
            const employeeType = await EmployeeType.findByPk(id);
            return employeeType;
        } catch (error) {
            throw new Error(
                `Failed to retrieve employee type with ID ${id}: ${error.message}`
            );
        }
    }

    /**
     * Update an existing employee type
     * @param {string} id - The UUID of the employee type to update
     * @param {Object} updateData - The data to update
     * @param {string} [updateData.name] - The updated name of the employee type
     * @returns {Promise<Object|null>} The updated employee type or null if not found
     * @throws {Error} If update fails
     */
    async update(id, updateData) {
        try {
            const employeeType = await EmployeeType.findByPk(id);

            if (!employeeType) {
                return null;
            }

            const updatedEmployeeType = await employeeType.update(updateData);
            return updatedEmployeeType;
        } catch (error) {
            throw new Error(
                `Failed to update employee type with ID ${id}: ${error.message}`
            );
        }
    }

    /**
     * Delete an employee type by ID
     * @param {string} id - The UUID of the employee type to delete
     * @returns {Promise<boolean>} True if deleted successfully, false if not found
     * @throws {Error} If deletion fails
     */
    async delete(id) {
        try {
            const employeeType = await EmployeeType.findByPk(id);

            if (!employeeType) {
                return false;
            }

            await employeeType.destroy();
            return true;
        } catch (error) {
            throw new Error(
                `Failed to delete employee type with ID ${id}: ${error.message}`
            );
        }
    }
}

module.exports = new EmployeeTypeService();
