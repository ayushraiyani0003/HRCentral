/**
 * @fileoverview Controller for managing RolesList CRUD operations
 * @author Your Name
 * @version 1.0.0
 */

const RolesListService = require("../../services/api/RoleList.service"); // Adjust path as needed

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Indicates if the operation was successful
 * @property {string} message - Response message
 * @property {*} [data] - Response data (optional)
 * @property {Object} [error] - Error details (optional)
 * @property {number} [statusCode] - HTTP status code
 */

/**
 * @typedef {Object} ValidationError
 * @property {string} field - Field name that failed validation
 * @property {string} message - Validation error message
 */

/**
 * @class RolesListController
 * @description Controller class for handling HTTP requests related to roles management
 */
class RolesListController {
    /**
     * @description Create a new role
     * @param {Object} req - Express request object
     * @param {Object} req.body - Request body
     * @param {string} req.body.name - Role name
     * @param {Array} req.body.permissions - Array of permissions
     * @param {Object} res - Express response object
     * @returns {Promise<void>} JSON response with created role or error
     * @example
     * POST /api/roles
     * Body: {
     *   "name": "Editor",
     *   "permissions": [
     *     {"page_name": "content_management", "level": "level_5"},
     *     {"page_name": "dashboard", "level": "level_3"}
     *   ]
     * }
     */
    static async createRole(req, res) {
        try {
            const { name, permissions } = req.body;

            // Validate required fields
            const validationErrors =
                RolesListController._validateCreateRoleInput({
                    name,
                    permissions,
                });
            if (validationErrors.length > 0) {
                return RolesListController._sendErrorResponse(
                    res,
                    400,
                    "Validation failed",
                    {
                        validationErrors,
                    }
                );
            }

            // Create role using service
            const newRole = await RolesListService.createRole({
                name: name.trim(),
                permissions: permissions || [],
            });

            return RolesListController._sendSuccessResponse(
                res,
                201,
                "Role created successfully",
                {
                    role: newRole,
                }
            );
        } catch (error) {
            console.error("Error creating role:", error);

            // Handle specific error types
            if (error.message.includes("already exists")) {
                return RolesListController._sendErrorResponse(
                    res,
                    409,
                    error.message
                );
            }

            if (
                error.message.includes("validation") ||
                error.message.includes("required")
            ) {
                return RolesListController._sendErrorResponse(
                    res,
                    400,
                    error.message
                );
            }

            return RolesListController._sendErrorResponse(
                res,
                500,
                "Failed to create role",
                {
                    details:
                        process.env.NODE_ENV === "development"
                            ? error.message
                            : undefined,
                }
            );
        }
    }

    /**
     * @description Get a role by ID
     * @param {Object} req - Express request object
     * @param {Object} req.params - Request parameters
     * @param {string} req.params.id - Role ID (UUID)
     * @param {Object} res - Express response object
     * @returns {Promise<void>} JSON response with role data or error
     * @example
     * GET /api/roles/123e4567-e89b-12d3-a456-426614174000
     */
    static async getRoleById(req, res) {
        try {
            const { id } = req.params;

            // Validate ID parameter
            if (!id || !RolesListController._isValidUUID(id)) {
                return RolesListController._sendErrorResponse(
                    res,
                    400,
                    "Valid role ID is required"
                );
            }

            // Get role using service
            const role = await RolesListService.getRoleById(id);

            if (!role) {
                return RolesListController._sendErrorResponse(
                    res,
                    404,
                    `Role with ID '${id}' not found`
                );
            }

            return RolesListController._sendSuccessResponse(
                res,
                200,
                "Role retrieved successfully",
                {
                    role,
                }
            );
        } catch (error) {
            console.error("Error getting role by ID:", error);
            return RolesListController._sendErrorResponse(
                res,
                500,
                "Failed to retrieve role",
                {
                    details:
                        process.env.NODE_ENV === "development"
                            ? error.message
                            : undefined,
                }
            );
        }
    }

    /**
     * @description Get all roles with pagination, search, and filtering
     * @param {Object} req - Express request object
     * @param {Object} req.query - Query parameters
     * @param {Object} res - Express response object
     * @returns {Promise<void>} JSON response with paginated roles or error
     * @example
     * GET /api/roles
     */
    static async getAllRoles(req, res) {
        try {
            const { permissions, level } = req.query;

            // Validate pagination parameters
            const validationErrors =
                RolesListController._validatePaginationParams({});
            if (validationErrors.length > 0) {
                return RolesListController._sendErrorResponse(
                    res,
                    400,
                    "Invalid pagination parameters",
                    {
                        validationErrors,
                    }
                );
            }

            // Get roles using service
            const result = await RolesListService.getAllRoles();

            return RolesListController._sendSuccessResponse(
                res,
                200,
                "Roles retrieved successfully",
                result
            );
        } catch (error) {
            console.error("Error getting all roles:", error);
            return RolesListController._sendErrorResponse(
                res,
                500,
                "Failed to retrieve roles",
                {
                    details:
                        process.env.NODE_ENV === "development"
                            ? error.message
                            : undefined,
                }
            );
        }
    }

    /**
     * @description Update a role by ID
     * @param {Object} req - Express request object
     * @param {Object} req.params - Request parameters
     * @param {string} req.params.id - Role ID (UUID)
     * @param {Object} req.body - Request body
     * @param {string} [req.body.name] - Updated role name
     * @param {Array} [req.body.permissions] - Updated permissions array
     * @param {Object} res - Express response object
     * @returns {Promise<void>} JSON response with updated role or error
     * @example
     * PUT /api/roles/123e4567-e89b-12d3-a456-426614174000
     * Body: {
     *   "name": "Senior Editor",
     *   "permissions": [{"page_name": "content_management", "level": "level_8"}]
     * }
     */
    static async updateRole(req, res) {
        try {
            const { id } = req.params;
            const { name, permissions } = req.body;

            // Validate ID parameter
            if (!id || !RolesListController._isValidUUID(id)) {
                return RolesListController._sendErrorResponse(
                    res,
                    400,
                    "Valid role ID is required"
                );
            }

            // Validate update data
            const validationErrors =
                RolesListController._validateUpdateRoleInput({
                    name,
                    permissions,
                });
            if (validationErrors.length > 0) {
                return RolesListController._sendErrorResponse(
                    res,
                    400,
                    "Validation failed",
                    {
                        validationErrors,
                    }
                );
            }

            // Check if there's something to update
            if (name === undefined && permissions === undefined) {
                return RolesListController._sendErrorResponse(
                    res,
                    400,
                    "At least one field (name or permissions) must be provided for update"
                );
            }

            // Prepare update data
            const updateData = {};
            if (name !== undefined) updateData.name = name.trim();
            if (permissions !== undefined) updateData.permissions = permissions;

            // Update role using service
            const updatedRole = await RolesListService.updateRole(
                id,
                updateData
            );

            return RolesListController._sendSuccessResponse(
                res,
                200,
                "Role updated successfully",
                {
                    role: updatedRole,
                }
            );
        } catch (error) {
            console.error("Error updating role:", error);

            // Handle specific error types
            if (error.message.includes("not found")) {
                return RolesListController._sendErrorResponse(
                    res,
                    404,
                    error.message
                );
            }

            if (error.message.includes("already exists")) {
                return RolesListController._sendErrorResponse(
                    res,
                    409,
                    error.message
                );
            }

            if (
                error.message.includes("validation") ||
                error.message.includes("required")
            ) {
                return RolesListController._sendErrorResponse(
                    res,
                    400,
                    error.message
                );
            }

            return RolesListController._sendErrorResponse(
                res,
                500,
                "Failed to update role",
                {
                    details:
                        process.env.NODE_ENV === "development"
                            ? error.message
                            : undefined,
                }
            );
        }
    }

    /**
     * @description Delete a role by ID
     * @param {Object} req - Express request object
     * @param {Object} req.params - Request parameters
     * @param {string} req.params.id - Role ID (UUID)
     * @param {Object} res - Express response object
     * @returns {Promise<void>} JSON response confirming deletion or error
     * @example
     * DELETE /api/roles/123e4567-e89b-12d3-a456-426614174000
     */
    static async deleteRole(req, res) {
        try {
            const { id } = req.params;

            // Validate ID parameter
            if (!id || !RolesListController._isValidUUID(id)) {
                return RolesListController._sendErrorResponse(
                    res,
                    400,
                    "Valid role ID is required"
                );
            }

            // Delete role using service
            const isDeleted = await RolesListService.deleteRole(id);

            if (isDeleted) {
                return RolesListController._sendSuccessResponse(
                    res,
                    200,
                    "Role deleted successfully",
                    {
                        deletedRoleId: id,
                    }
                );
            }
        } catch (error) {
            console.error("Error deleting role:", error);

            // Handle specific error types
            if (error.message.includes("not found")) {
                return RolesListController._sendErrorResponse(
                    res,
                    404,
                    error.message
                );
            }

            return RolesListController._sendErrorResponse(
                res,
                500,
                "Failed to delete role",
                {
                    details:
                        process.env.NODE_ENV === "development"
                            ? error.message
                            : undefined,
                }
            );
        }
    }

    // ============= PRIVATE HELPER METHODS =============

    /**
     * @private
     * @description Send success response
     * @param {Object} res - Express response object
     * @param {number} statusCode - HTTP status code
     * @param {string} message - Success message
     * @param {Object} [data] - Response data
     * @returns {Object} Express response
     */
    static _sendSuccessResponse(res, statusCode, message, data = null) {
        const response = {
            success: true,
            message,
            ...(data && { data }),
            timestamp: new Date().toISOString(),
        };

        return res.status(statusCode).json(response);
    }

    /**
     * @private
     * @description Send error response
     * @param {Object} res - Express response object
     * @param {number} statusCode - HTTP status code
     * @param {string} message - Error message
     * @param {Object} [error] - Additional error details
     * @returns {Object} Express response
     */
    static _sendErrorResponse(res, statusCode, message, error = null) {
        const response = {
            success: false,
            message,
            ...(error && { error }),
            timestamp: new Date().toISOString(),
        };

        return res.status(statusCode).json(response);
    }

    /**
     * @private
     * @description Validate create role input
     * @param {Object} input - Input data to validate
     * @param {string} input.name - Role name
     * @param {Array} input.permissions - Permissions array
     * @returns {ValidationError[]} Array of validation errors
     */
    static _validateCreateRoleInput({ name, permissions }) {
        const errors = [];

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            errors.push({
                field: "name",
                message: "Role name is required and must be a non-empty string",
            });
        } else if (name.trim().length > 200) {
            errors.push({
                field: "name",
                message: "Role name must not exceed 200 characters",
            });
        }

        if (permissions !== undefined) {
            if (!Array.isArray(permissions)) {
                errors.push({
                    field: "permissions",
                    message: "Permissions must be an array",
                });
            } else {
                permissions.forEach((perm, index) => {
                    if (!perm || typeof perm !== "object") {
                        errors.push({
                            field: `permissions[${index}]`,
                            message: "Each permission must be an object",
                        });
                    } else {
                        if (
                            !perm.page_name ||
                            typeof perm.page_name !== "string"
                        ) {
                            errors.push({
                                field: `permissions[${index}].page_name`,
                                message:
                                    "Permission page_name is required and must be a string",
                            });
                        }
                        if (
                            !perm.level ||
                            typeof perm.level !== "string" ||
                            !perm.level.match(/^level_\d+$/)
                        ) {
                            errors.push({
                                field: `permissions[${index}].level`,
                                message:
                                    'Permission level must follow format "level_X" where X is a number',
                            });
                        }
                    }
                });
            }
        }

        return errors;
    }

    /**
     * @private
     * @description Validate update role input
     * @param {Object} input - Input data to validate
     * @param {string} [input.name] - Role name
     * @param {Array} [input.permissions] - Permissions array
     * @returns {ValidationError[]} Array of validation errors
     */
    static _validateUpdateRoleInput({ name, permissions }) {
        const errors = [];

        if (name !== undefined) {
            if (!name || typeof name !== "string" || name.trim().length === 0) {
                errors.push({
                    field: "name",
                    message: "Role name must be a non-empty string",
                });
            } else if (name.trim().length > 200) {
                errors.push({
                    field: "name",
                    message: "Role name must not exceed 200 characters",
                });
            }
        }

        if (permissions !== undefined) {
            if (!Array.isArray(permissions)) {
                errors.push({
                    field: "permissions",
                    message: "Permissions must be an array",
                });
            } else {
                permissions.forEach((perm, index) => {
                    if (!perm || typeof perm !== "object") {
                        errors.push({
                            field: `permissions[${index}]`,
                            message: "Each permission must be an object",
                        });
                    } else {
                        if (
                            !perm.page_name ||
                            typeof perm.page_name !== "string"
                        ) {
                            errors.push({
                                field: `permissions[${index}].page_name`,
                                message:
                                    "Permission page_name is required and must be a string",
                            });
                        }
                        if (
                            !perm.level ||
                            typeof perm.level !== "string" ||
                            !perm.level.match(/^level_\d+$/)
                        ) {
                            errors.push({
                                field: `permissions[${index}].level`,
                                message:
                                    'Permission level must follow format "level_X" where X is a number',
                            });
                        }
                    }
                });
            }
        }

        return errors;
    }

    /**
     * @private
     * @description Validate pagination parameters
     * @param {Object} params - Pagination parameters
     * @param {string} params.page - Page number
     * @param {string} params.limit - Items per page
     * @param {string} params.sortBy - Sort field
     * @param {string} params.sortOrder - Sort order
     * @returns {ValidationError[]} Array of validation errors
     */
    static _validatePaginationParams({ page, limit, sortBy, sortOrder }) {
        const errors = [];
        const allowedSortFields = ["id", "name", "created_at", "updated_at"];
        const allowedSortOrders = ["ASC", "DESC"];

        if (page && (isNaN(page) || parseInt(page) < 1)) {
            errors.push({
                field: "page",
                message: "Page must be a positive integer",
            });
        }

        if (
            limit &&
            (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)
        ) {
            errors.push({
                field: "limit",
                message: "Limit must be a positive integer between 1 and 100",
            });
        }

        if (sortBy && !allowedSortFields.includes(sortBy)) {
            errors.push({
                field: "sortBy",
                message: `Sort field must be one of: ${allowedSortFields.join(
                    ", "
                )}`,
            });
        }

        if (sortOrder && !allowedSortOrders.includes(sortOrder.toUpperCase())) {
            errors.push({
                field: "sortOrder",
                message: "Sort order must be either ASC or DESC",
            });
        }

        return errors;
    }

    /**
     * @private
     * @description Check if string is a valid UUID
     * @param {string} str - String to validate
     * @returns {boolean} True if valid UUID
     */
    static _isValidUUID(str) {
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(str);
    }
}

module.exports = RolesListController;
