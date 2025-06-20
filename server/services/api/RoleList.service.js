/**
 * @fileoverview Service for managing RolesList operations
 * @author Your Name
 * @version 1.0.0
 */

const { Op } = require("sequelize");
const { RolesList } = require("../../models"); // Adjust path as needed

/**
 * @typedef {Object} Permission
 * @property {string} page_name - The name of the page/feature
 * @property {string} level - The permission level (e.g., "level_1", "level_6")
 */

/**
 * @typedef {Object} RoleData
 * @property {string} name - The role name
 * @property {Permission[]} permissions - Array of permissions for the role
 */

/**
 * @typedef {Object} RoleListItem
 * @property {string} id - UUID of the role
 * @property {string} name - The role name
 * @property {Permission[]} permissions - Array of permissions
 * @property {Date} created_at - Creation timestamp
 * @property {Date} updated_at - Last update timestamp
 */

/**
 * @typedef {Object} PaginationOptions
 * @property {number} [page=1] - Page number (1-based)
 * @property {number} [limit=10] - Number of items per page
 * @property {string} [sortBy='created_at'] - Field to sort by
 * @property {string} [sortOrder='DESC'] - Sort order ('ASC' or 'DESC')
 */

/**
 * @typedef {Object} SearchOptions
 * @property {string} [search] - Search term for role name
 * @property {string[]} [permissions] - Filter by specific permission page names
 * @property {string} [level] - Filter by permission level
 */

/**
 * @class RolesListService
 * @description Service class for managing roles and permissions with high performance operations
 */
class RolesListService {
    /**
     * @description Create a new role with permissions
     * @param {RoleData} roleData - The role data to create
     * @returns {Promise<RoleListItem>} The created role
     * @throws {Error} When role creation fails or validation errors occur
     * @example
     * const newRole = await RolesListService.createRole({
     *   name: "Editor",
     *   permissions: [
     *     { page_name: "content_management", level: "level_5" },
     *     { page_name: "dashboard", level: "level_3" }
     *   ]
     * });
     */
    static async createRole(roleData) {
        try {
            // Validate input data
            this._validateRoleData(roleData);

            // Check if role name already exists
            const existingRole = await RolesList.findOne({
                where: { name: roleData.name },
                attributes: ["id", "name"],
            });

            if (existingRole) {
                throw new Error(
                    `Role with name '${roleData.name}' already exists`
                );
            }

            // Create the role
            const newRole = await RolesList.create({
                name: roleData.name.trim(),
                permissions: roleData.permissions || [],
            });

            return newRole.toJSON();
        } catch (error) {
            throw new Error(`Failed to create role: ${error.message}`);
        }
    }

    /**
     * @description Get a role by ID with optimized query
     * @param {string} roleId - The UUID of the role
     * @returns {Promise<RoleListItem|null>} The role data or null if not found
     * @throws {Error} When database query fails
     * @example
     * const role = await RolesListService.getRoleById("123e4567-e89b-12d3-a456-426614174000");
     */
    static async getRoleById(roleId) {
        try {
            if (!roleId || typeof roleId !== "string") {
                throw new Error("Valid role ID is required");
            }

            const role = await RolesList.findByPk(roleId);
            return role ? role.toJSON() : null;
        } catch (error) {
            throw new Error(`Failed to get role: ${error.message}`);
        }
    }

    /**
     * @description Get a role by name with case-insensitive search
     * @param {string} roleName - The name of the role
     * @returns {Promise<RoleListItem|null>} The role data or null if not found
     * @throws {Error} When database query fails
     * @example
     * const role = await RolesListService.getRoleByName("Admin");
     */
    static async getRoleByName(roleName) {
        try {
            if (!roleName || typeof roleName !== "string") {
                throw new Error("Valid role name is required");
            }

            const role = await RolesList.findOne({
                where: {
                    name: {
                        [Op.iLike]: roleName.trim(),
                    },
                },
            });

            return role ? role.toJSON() : null;
        } catch (error) {
            throw new Error(`Failed to get role by name: ${error.message}`);
        }
    }

    /**
     * @description Get all roles
     * @returns {Promise<{roles: RoleListItem[],}>} Paginated roles data
     * @throws {Error} When database query fails
     * @example
     */
    static async getAllRoles() {
        try {
            // Execute query with count
            const { count, rows } = await RolesList.findAndCountAll({
                distinct: true,
            });

            const totalPages = Math.ceil(count);

            return {
                roles: rows.map((role) => role.toJSON()),
                total: count,
            };
        } catch (error) {
            throw new Error(`Failed to get roles: ${error.message}`);
        }
    }

    /**
     * @description Update a role by ID
     * @param {string} roleId - The UUID of the role to update
     * @param {Partial<RoleData>} updateData - The data to update
     * @returns {Promise<RoleListItem>} The updated role
     * @throws {Error} When role not found or update fails
     * @example
     * const updatedRole = await RolesListService.updateRole("123e4567-e89b-12d3-a456-426614174000", {
     *   name: "Super Admin",
     *   permissions: [{ page_name: "all_access", level: "level_10" }]
     * });
     */
    static async updateRole(roleId, updateData) {
        try {
            if (!roleId || typeof roleId !== "string") {
                throw new Error("Valid role ID is required");
            }

            // Find the role first
            const role = await RolesList.findByPk(roleId);
            if (!role) {
                throw new Error(`Role with ID '${roleId}' not found`);
            }

            // Validate update data
            if (updateData.name !== undefined) {
                this._validateRoleName(updateData.name);

                // Check if new name conflicts with existing role (excluding current role)
                const existingRole = await RolesList.findOne({
                    where: {
                        name: updateData.name.trim(),
                        id: { [Op.ne]: roleId },
                    },
                    attributes: ["id", "name"],
                });

                if (existingRole) {
                    throw new Error(
                        `Role with name '${updateData.name}' already exists`
                    );
                }
            }

            if (updateData.permissions !== undefined) {
                this._validatePermissions(updateData.permissions);
            }

            // Prepare update object
            const updateObj = {};
            if (updateData.name !== undefined) {
                updateObj.name = updateData.name.trim();
            }
            if (updateData.permissions !== undefined) {
                updateObj.permissions = updateData.permissions;
            }

            // Update the role
            await role.update(updateObj);

            // Return updated role
            await role.reload();
            return role.toJSON();
        } catch (error) {
            throw new Error(`Failed to update role: ${error.message}`);
        }
    }

    /**
     * @description Delete a role by ID
     * @param {string} roleId - The UUID of the role to delete
     * @returns {Promise<boolean>} True if deletion was successful
     * @throws {Error} When role not found or deletion fails
     * @example
     * const isDeleted = await RolesListService.deleteRole("123e4567-e89b-12d3-a456-426614174000");
     */
    static async deleteRole(roleId) {
        try {
            if (!roleId || typeof roleId !== "string") {
                throw new Error("Valid role ID is required");
            }

            const deletedCount = await RolesList.destroy({
                where: { id: roleId },
            });

            if (deletedCount === 0) {
                throw new Error(`Role with ID '${roleId}' not found`);
            }

            return true;
        } catch (error) {
            throw new Error(`Failed to delete role: ${error.message}`);
        }
    }

    /**
     * @description Bulk delete roles by IDs
     * @param {string[]} roleIds - Array of role UUIDs to delete
     * @returns {Promise<{deletedCount: number, failedIds: string[]}>} Deletion results
     * @throws {Error} When bulk deletion fails
     * @example
     * const result = await RolesListService.bulkDeleteRoles([
     *   "123e4567-e89b-12d3-a456-426614174000",
     *   "987fcdeb-51d2-43a8-b456-426614174111"
     * ]);
     */
    static async bulkDeleteRoles(roleIds) {
        try {
            if (!Array.isArray(roleIds) || roleIds.length === 0) {
                throw new Error("Valid array of role IDs is required");
            }

            const deletedCount = await RolesList.destroy({
                where: {
                    id: {
                        [Op.in]: roleIds,
                    },
                },
            });

            const failedIds =
                roleIds.length - deletedCount > 0
                    ? roleIds.slice(deletedCount)
                    : [];

            return {
                deletedCount,
                failedIds,
                success: deletedCount > 0,
            };
        } catch (error) {
            throw new Error(`Failed to bulk delete roles: ${error.message}`);
        }
    }

    /**
     * @description Check if a role has specific permission
     * @param {string} roleId - The UUID of the role
     * @param {string} pageName - The page name to check
     * @param {string} [minLevel] - Minimum required level (optional)
     * @returns {Promise<{hasPermission: boolean, currentLevel?: string}>} Permission check result
     * @throws {Error} When role not found or check fails
     * @example
     * const result = await RolesListService.checkPermission(
     *   "123e4567-e89b-12d3-a456-426614174000",
     *   "user_management",
     *   "level_5"
     * );
     */
    static async checkPermission(roleId, pageName, minLevel = null) {
        try {
            const role = await this.getRoleById(roleId);
            if (!role) {
                throw new Error(`Role with ID '${roleId}' not found`);
            }

            const permission = role.permissions.find(
                (p) => p.page_name === pageName
            );

            if (!permission) {
                return { hasPermission: false };
            }

            if (minLevel) {
                const currentLevelNum = parseInt(
                    permission.level.replace("level_", "")
                );
                const minLevelNum = parseInt(minLevel.replace("level_", ""));
                const hasPermission = currentLevelNum >= minLevelNum;

                return {
                    hasPermission,
                    currentLevel: permission.level,
                };
            }

            return {
                hasPermission: true,
                currentLevel: permission.level,
            };
        } catch (error) {
            throw new Error(`Failed to check permission: ${error.message}`);
        }
    }

    /**
     * @description Get roles statistics
     * @returns {Promise<{totalRoles: number, permissionStats: Object}>} Statistics data
     * @throws {Error} When statistics query fails
     * @example
     * const stats = await RolesListService.getRolesStatistics();
     */
    static async getRolesStatistics() {
        try {
            const totalRoles = await RolesList.count();

            const roles = await RolesList.findAll({
                attributes: ["permissions"],
            });

            const permissionStats = {};
            roles.forEach((role) => {
                if (role.permissions && Array.isArray(role.permissions)) {
                    role.permissions.forEach((perm) => {
                        if (!permissionStats[perm.page_name]) {
                            permissionStats[perm.page_name] = {
                                total: 0,
                                levels: {},
                            };
                        }
                        permissionStats[perm.page_name].total++;
                        permissionStats[perm.page_name].levels[perm.level] =
                            (permissionStats[perm.page_name].levels[
                                perm.level
                            ] || 0) + 1;
                    });
                }
            });

            return {
                totalRoles,
                permissionStats,
            };
        } catch (error) {
            throw new Error(`Failed to get roles statistics: ${error.message}`);
        }
    }

    // ============= PRIVATE HELPER METHODS =============

    /**
     * @private
     * @description Validate complete role data
     * @param {RoleData} roleData - Role data to validate
     * @throws {Error} When validation fails
     */
    static _validateRoleData(roleData) {
        if (!roleData || typeof roleData !== "object") {
            throw new Error("Role data is required and must be an object");
        }

        this._validateRoleName(roleData.name);
        this._validatePermissions(roleData.permissions);
    }

    /**
     * @private
     * @description Validate role name
     * @param {string} name - Role name to validate
     * @throws {Error} When validation fails
     */
    static _validateRoleName(name) {
        if (!name || typeof name !== "string" || name.trim().length === 0) {
            throw new Error(
                "Role name is required and must be a non-empty string"
            );
        }

        if (name.trim().length > 200) {
            throw new Error("Role name must not exceed 200 characters");
        }
    }

    /**
     * @private
     * @description Validate permissions array
     * @param {Permission[]} permissions - Permissions to validate
     * @throws {Error} When validation fails
     */
    static _validatePermissions(permissions) {
        if (!permissions || !Array.isArray(permissions)) {
            throw new Error("Permissions must be an array");
        }

        permissions.forEach((perm, index) => {
            if (!perm || typeof perm !== "object") {
                throw new Error(
                    `Permission at index ${index} must be an object`
                );
            }

            if (!perm.page_name || typeof perm.page_name !== "string") {
                throw new Error(
                    `Permission at index ${index} must have a valid page_name`
                );
            }

            if (!perm.level || typeof perm.level !== "string") {
                throw new Error(
                    `Permission at index ${index} must have a valid level`
                );
            }

            if (!perm.level.match(/^level_\d+$/)) {
                throw new Error(
                    `Permission level at index ${index} must follow format 'level_X' where X is a number`
                );
            }
        });
    }
}

module.exports = RolesListService;
