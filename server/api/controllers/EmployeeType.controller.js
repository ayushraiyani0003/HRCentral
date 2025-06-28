// =================== controllers/EmployeeType.controller.js ===================

const EmployeeTypeService = require("../../services/api/EmployeeType.service");

/**
 * EmployeeType Controller
 * Handles HTTP requests and responses for EmployeeType operations
 */
class EmployeeTypeController {
    /**
     * Create a new employee type
     * @param {Object} req - Express request object
     * @param {Object} req.body - Request body
     * @param {string} req.body.name - The name of the employee type (required, max 100 chars)
     * @param {Object} res - Express response object
     * @returns {Promise<void>} JSON response with created employee type or error
     * @description POST /api/employee-types
     * @example
     * // Request body:
     * // { "name": "Full-time" }
     * // Response:
     * // {
     * //   "success": true,
     * //   "message": "Employee type created successfully",
     * //   "data": {
     * //     "id": "123e4567-e89b-12d3-a456-426614174000",
     * //     "name": "Full-time",
     * //     "created_at": "2024-01-15T10:30:00.000Z",
     * //     "updated_at": "2024-01-15T10:30:00.000Z"
     * //   }
     * // }
     */
    static async createEmployeeType(req, res) {
        try {
            const { name } = req.body;

            // Input validation
            if (!name || typeof name !== "string") {
                return res.status(400).json({
                    success: false,
                    message:
                        "Employee type name is required and must be a string",
                    error: "VALIDATION_ERROR",
                });
            }

            if (name.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Employee type name cannot be empty",
                    error: "VALIDATION_ERROR",
                });
            }

            if (name.length > 100) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Employee type name must not exceed 100 characters",
                    error: "VALIDATION_ERROR",
                });
            }

            const employeeType = await EmployeeTypeService.add({
                name: name.trim(),
            });

            res.status(201).json({
                success: true,
                message: "Employee type created successfully",
                data: employeeType,
            });
        } catch (error) {
            console.error("Error creating employee type:", error);
            res.status(500).json({
                success: false,
                message: "Failed to create employee type",
                error: error.message,
            });
        }
    }

    /**
     * Get all employee types
     * @param {Object} req - Express request object
     * @param {Object} req.query - Query parameters
     * @param {string} req.query.limit - Maximum number of records to return
     * @param {string} req.query.offset - Number of records to skip
     * @param {string} req.query.sortBy - Field to sort by (default: created_at)
     * @param {string} req.query.sortOrder - Sort order: 'ASC' or 'DESC' (default: DESC)
     * @param {Object} res - Express response object
     * @returns {Promise<void>} JSON response with employee types array or error
     * @description GET /api/employee-types
     * @example
     * // Request: GET /api/employee-types?limit=10&offset=0&sortBy=name&sortOrder=ASC
     * // Response:
     * // {
     * //   "success": true,
     * //   "message": "Employee types retrieved successfully",
     * //   "data": [
     * //     {
     * //       "id": "123e4567-e89b-12d3-a456-426614174000",
     * //       "name": "Full-time",
     * //       "created_at": "2024-01-15T10:30:00.000Z",
     * //       "updated_at": "2024-01-15T10:30:00.000Z"
     * //     }
     * //   ],
     * //   "pagination": {
     * //     "limit": 10,
     * //     "offset": 0,
     * //     "total": 1
     * //   }
     * // }
     */
    static async getAllEmployeeTypes(req, res) {
        try {
            const {
                limit,
                offset,
                sortBy = "created_at",
                sortOrder = "DESC",
            } = req.query;

            // Build query options
            const options = {};

            // Handle pagination
            if (limit) {
                const parsedLimit = parseInt(limit, 10);
                if (isNaN(parsedLimit) || parsedLimit < 1) {
                    return res.status(400).json({
                        success: false,
                        message: "Limit must be a positive integer",
                        error: "VALIDATION_ERROR",
                    });
                }
                options.limit = parsedLimit;
            }

            if (offset) {
                const parsedOffset = parseInt(offset, 10);
                if (isNaN(parsedOffset) || parsedOffset < 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Offset must be a non-negative integer",
                        error: "VALIDATION_ERROR",
                    });
                }
                options.offset = parsedOffset;
            }

            // Handle sorting
            const validSortOrders = ["ASC", "DESC"];
            if (!validSortOrders.includes(sortOrder.toUpperCase())) {
                return res.status(400).json({
                    success: false,
                    message: "Sort order must be 'ASC' or 'DESC'",
                    error: "VALIDATION_ERROR",
                });
            }

            options.order = [[sortBy, sortOrder.toUpperCase()]];

            const employeeTypes = await EmployeeTypeService.readAll(options);

            res.status(200).json({
                success: true,
                message: "Employee types retrieved successfully",
                data: employeeTypes,
                pagination: {
                    limit: options.limit || null,
                    offset: options.offset || 0,
                    total: employeeTypes.length,
                },
            });
        } catch (error) {
            console.error("Error retrieving employee types:", error);
            res.status(500).json({
                success: false,
                message: "Failed to retrieve employee types",
                error: error.message,
            });
        }
    }

    /**
     * Get employee type by ID
     * @param {Object} req - Express request object
     * @param {Object} req.params - Route parameters
     * @param {string} req.params.id - UUID of the employee type
     * @param {Object} res - Express response object
     * @returns {Promise<void>} JSON response with employee type object or error
     * @description GET /api/employee-types/:id
     * @example
     * // Request: GET /api/employee-types/123e4567-e89b-12d3-a456-426614174000
     * // Response:
     * // {
     * //   "success": true,
     * //   "message": "Employee type retrieved successfully",
     * //   "data": {
     * //     "id": "123e4567-e89b-12d3-a456-426614174000",
     * //     "name": "Full-time",
     * //     "created_at": "2024-01-15T10:30:00.000Z",
     * //     "updated_at": "2024-01-15T10:30:00.000Z"
     * //   }
     * // }
     */
    static async getEmployeeTypeById(req, res) {
        try {
            const { id } = req.params;

            // Input validation
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Employee type ID is required",
                    error: "VALIDATION_ERROR",
                });
            }

            const employeeType = await EmployeeTypeService.readById(id);

            if (!employeeType) {
                return res.status(404).json({
                    success: false,
                    message: "Employee type not found",
                    error: "NOT_FOUND",
                });
            }

            res.status(200).json({
                success: true,
                message: "Employee type retrieved successfully",
                data: employeeType,
            });
        } catch (error) {
            console.error("Error retrieving employee type:", error);

            // Handle specific error types
            if (error.message.includes("invalid input syntax for type uuid")) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid employee type ID format",
                    error: "VALIDATION_ERROR",
                });
            }

            res.status(500).json({
                success: false,
                message: "Failed to retrieve employee type",
                error: error.message,
            });
        }
    }

    /**
     * Update employee type by ID
     * @param {Object} req - Express request object
     * @param {Object} req.params - Route parameters
     * @param {string} req.params.id - UUID of the employee type
     * @param {Object} req.body - Request body
     * @param {string} req.body.name - The new name of the employee type (optional, max 100 chars)
     * @param {Object} res - Express response object
     * @returns {Promise<void>} JSON response with updated employee type or error
     * @description PUT /api/employee-types/:id
     * @example
     * // Request: PUT /api/employee-types/123e4567-e89b-12d3-a456-426614174000
     * // Body: { "name": "Part-time" }
     * // Response:
     * // {
     * //   "success": true,
     * //   "message": "Employee type updated successfully",
     * //   "data": {
     * //     "id": "123e4567-e89b-12d3-a456-426614174000",
     * //     "name": "Part-time",
     * //     "created_at": "2024-01-15T10:30:00.000Z",
     * //     "updated_at": "2024-01-15T11:45:00.000Z"
     * //   }
     * // }
     */
    static async updateEmployeeType(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            // Input validation
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Employee type ID is required",
                    error: "VALIDATION_ERROR",
                });
            }

            if (!name || typeof name !== "string") {
                return res.status(400).json({
                    success: false,
                    message:
                        "Employee type name is required and must be a string",
                    error: "VALIDATION_ERROR",
                });
            }

            if (name.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Employee type name cannot be empty",
                    error: "VALIDATION_ERROR",
                });
            }

            if (name.length > 100) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Employee type name must not exceed 100 characters",
                    error: "VALIDATION_ERROR",
                });
            }

            const updatedEmployeeType = await EmployeeTypeService.update(id, {
                name: name.trim(),
            });

            if (!updatedEmployeeType) {
                return res.status(404).json({
                    success: false,
                    message: "Employee type not found",
                    error: "NOT_FOUND",
                });
            }

            res.status(200).json({
                success: true,
                message: "Employee type updated successfully",
                data: updatedEmployeeType,
            });
        } catch (error) {
            console.error("Error updating employee type:", error);

            // Handle specific error types
            if (error.message.includes("invalid input syntax for type uuid")) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid employee type ID format",
                    error: "VALIDATION_ERROR",
                });
            }

            res.status(500).json({
                success: false,
                message: "Failed to update employee type",
                error: error.message,
            });
        }
    }

    /**
     * Delete employee type by ID
     * @param {Object} req - Express request object
     * @param {Object} req.params - Route parameters
     * @param {string} req.params.id - UUID of the employee type
     * @param {Object} res - Express response object
     * @returns {Promise<void>} JSON response with deletion status or error
     * @description DELETE /api/employee-types/:id
     * @example
     * // Request: DELETE /api/employee-types/123e4567-e89b-12d3-a456-426614174000
     * // Response:
     * // {
     * //   "success": true,
     * //   "message": "Employee type deleted successfully"
     * // }
     */
    static async deleteEmployeeType(req, res) {
        try {
            const { id } = req.params;

            // Input validation
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Employee type ID is required",
                    error: "VALIDATION_ERROR",
                });
            }

            const isDeleted = await EmployeeTypeService.delete(id);

            if (!isDeleted) {
                return res.status(404).json({
                    success: false,
                    message: "Employee type not found",
                    error: "NOT_FOUND",
                });
            }

            res.status(200).json({
                success: true,
                message: "Employee type deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting employee type:", error);

            // Handle specific error types
            if (error.message.includes("invalid input syntax for type uuid")) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid employee type ID format",
                    error: "VALIDATION_ERROR",
                });
            }

            // Handle foreign key constraint errors
            if (error.message.includes("violates foreign key constraint")) {
                return res.status(409).json({
                    success: false,
                    message:
                        "Cannot delete employee type as it is being used by other records",
                    error: "FOREIGN_KEY_CONSTRAINT",
                });
            }

            res.status(500).json({
                success: false,
                message: "Failed to delete employee type",
                error: error.message,
            });
        }
    }
}

module.exports = EmployeeTypeController;
