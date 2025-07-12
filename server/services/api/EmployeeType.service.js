// =================== services/EmployeeType.service.js ===================

const { EmployeeType } = require("../../models");

/**
 * EmployeeType Service
 * Handles all business logic operations for EmployeeType entity
 */
class EmployeeTypeService {
    /**
     * Create a new employee type
     * @param {Object} employeeTypeData - The employee type data
     * @param {string} employeeTypeData.name - The name of the employee type (required, max 100 chars)
     * @returns {Promise<Object>} The created employee type object
     * @throws {Error} If validation fails or database error occurs
     * @example
     * const newEmployeeType = await EmployeeTypeService.add({
     *   name: "Full-time"
     * });
     */
    static async add(employeeTypeData) {
        try {
            const employeeType = await EmployeeType.create(employeeTypeData);
            return employeeType;
        } catch (error) {
            throw new Error(`Failed to create employee type: ${error.message}`);
        }
    }

    /**
     * Retrieve all employee types
     * @param {Object} options - Query options (optional)
     * @param {number} options.limit - Maximum number of records to return
     * @param {number} options.offset - Number of records to skip
     * @param {Array<string>} options.attributes - Specific attributes to select
     * @param {Object} options.order - Order by specifications
     * @returns {Promise<Array<Object>>} Array of employee type objects
     * @throws {Error} If database error occurs
     * @example
     * const allEmployeeTypes = await EmployeeTypeService.readAll();
     * const limitedEmployeeTypes = await EmployeeTypeService.readAll({
     *   limit: 10,
     *   offset: 0,
     *   order: [['name', 'ASC']]
     * });
     */
    static async readAll(options = {}) {
        try {
            const employeeTypes = await EmployeeType.findAll({
                ...options,
                order: options.order || [["created_at", "DESC"]],
            });
            return employeeTypes;
        } catch (error) {
            throw new Error(
                `Failed to retrieve employee types: ${error.message}`
            );
        }
    }

    /**
     * Retrieve a single employee type by ID
     * @param {string} id - The UUID of the employee type
     * @param {Object} options - Query options (optional)
     * @param {Array<string>} options.attributes - Specific attributes to select
     * @returns {Promise<Object|null>} The employee type object or null if not found
     * @throws {Error} If invalid ID format or database error occurs
     * @example
     * const employeeType = await EmployeeTypeService.readById('123e4567-e89b-12d3-a456-426614174000');
     * const employeeTypeWithSpecificFields = await EmployeeTypeService.readById(
     *   '123e4567-e89b-12d3-a456-426614174000',
     *   { attributes: ['id', 'name'] }
     * );
     */
    static async readById(id, options = {}) {
        try {
            if (!id) {
                throw new Error("Employee type ID is required");
            }

            const employeeType = await EmployeeType.findByPk(id, options);
            return employeeType;
        } catch (error) {
            throw new Error(
                `Failed to retrieve employee type: ${error.message}`
            );
        }
    }

    /**
     * Update an existing employee type
     * @param {string} id - The UUID of the employee type to update
     * @param {Object} updateData - The data to update
     * @param {string} updateData.name - The new name of the employee type (optional, max 100 chars)
     * @returns {Promise<Object|null>} The updated employee type object or null if not found
     * @throws {Error} If invalid ID, validation fails, or database error occurs
     * @example
     * const updatedEmployeeType = await EmployeeTypeService.update(
     *   '123e4567-e89b-12d3-a456-426614174000',
     *   { name: "Part-time" }
     * );
     */
    static async update(id, updateData) {
        try {
            if (!id) {
                throw new Error("Employee type ID is required");
            }

            const [updatedRows] = await EmployeeType.update(updateData, {
                where: { id },
                returning: true,
            });

            if (updatedRows === 0) {
                return null;
            }

            // Fetch and return the updated record
            const updatedEmployeeType = await EmployeeType.findByPk(id);
            return updatedEmployeeType;
        } catch (error) {
            throw new Error(`Failed to update employee type: ${error.message}`);
        }
    }

    /**
     * Delete an employee type by ID
     * @param {string} id - The UUID of the employee type to delete
     * @returns {Promise<boolean>} True if deleted successfully, false if not found
     * @throws {Error} If invalid ID or database error occurs
     * @example
     * const isDeleted = await EmployeeTypeService.delete('123e4567-e89b-12d3-a456-426614174000');
     * if (isDeleted) {
     *   console.log('Employee type deleted successfully');
     * } else {
     *   console.log('Employee type not found');
     * }
     */
    static async delete(id) {
        try {
            if (!id) {
                throw new Error("Employee type ID is required");
            }

            const deletedRows = await EmployeeType.destroy({
                where: { id },
            });

            return deletedRows > 0;
        } catch (error) {
            throw new Error(`Failed to delete employee type: ${error.message}`);
        }
    }
}

module.exports = EmployeeTypeService;
