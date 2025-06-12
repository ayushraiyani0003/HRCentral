// =================== controllers/EmployeeType.controller.js ===================

const employeeTypeService = require("../../services/api/EmployeeType.service"); // Adjust path as needed

/**
 * EmployeeType Controller
 * Handles HTTP requests for EmployeeType operations
 */
class EmployeeTypeController {
    /**
     * Create a new employee type
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async createEmployeeType(req, res) {
        try {
            const { name } = req.body;

            // Validation
            if (!name || name.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "Employee type name is required",
                });
            }

            const employeeType = await employeeTypeService.add({
                name: name.trim(),
            });

            res.status(201).json({
                success: true,
                message: "Employee type created successfully",
                data: employeeType,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to create employee type",
            });
        }
    }

    /**
     * Get all employee types
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getAllEmployeeTypes(req, res) {
        try {
            const employeeTypes = await employeeTypeService.readAll();

            res.status(200).json({
                success: true,
                message: "Employee types retrieved successfully",
                data: employeeTypes,
                count: employeeTypes.length,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve employee types",
            });
        }
    }

    /**
     * Get employee type by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getEmployeeTypeById(req, res) {
        try {
            const { id } = req.params;

            // Basic UUID validation
            const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid employee type ID format",
                });
            }

            const employeeType = await employeeTypeService.readById(id);

            if (!employeeType) {
                return res.status(404).json({
                    success: false,
                    message: "Employee type not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Employee type retrieved successfully",
                data: employeeType,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve employee type",
            });
        }
    }

    /**
     * Update employee type by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async updateEmployeeType(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            // Basic UUID validation
            const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid employee type ID format",
                });
            }

            // Validation
            if (!name || name.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "Employee type name is required",
                });
            }

            const updatedEmployeeType = await employeeTypeService.update(id, {
                name: name.trim(),
            });

            if (!updatedEmployeeType) {
                return res.status(404).json({
                    success: false,
                    message: "Employee type not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Employee type updated successfully",
                data: updatedEmployeeType,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to update employee type",
            });
        }
    }

    /**
     * Delete employee type by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async deleteEmployeeType(req, res) {
        try {
            const { id } = req.params;

            // Basic UUID validation
            const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid employee type ID format",
                });
            }

            const deleted = await employeeTypeService.delete(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: "Employee type not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Employee type deleted successfully",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to delete employee type",
            });
        }
    }
}

module.exports = new EmployeeTypeController();
