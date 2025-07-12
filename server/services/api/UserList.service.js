/**
 * UserList Service
 * Handles all business logic for user management operations
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { UserList } = require("../../models"); // Adjust path as needed

class UserListService {
    constructor() {
        this.model = db.UserList;
        this.jwtSecret = process.env.JWT_SECRET || "your-secret-key";
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "24h";
    }

    /**
     * Create a new user
     * @param {Object} userData - User data
     * @returns {Promise<Object>} Created user
     */
    async createUser(userData) {
        try {
            // Check if username already exists
            const existingUser = await this.model.findOne({
                where: { userName: userData.userName },
            });

            if (existingUser) {
                return {
                    success: false,
                    message: "Username already exists",
                };
            }

            // Check if employee already has a user account
            const existingEmployee = await this.model.findOne({
                where: { employeeId: userData.employeeId },
            });

            if (existingEmployee) {
                return {
                    success: false,
                    message: "Employee already has a user account",
                };
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(userData.password, 12);

            // Create user
            const user = await this.model.create({
                ...userData,
                password: hashedPassword,
            });

            // Remove password from response
            const userResponse = user.toJSON();
            delete userResponse.password;

            return {
                success: true,
                data: userResponse,
                message: "User created successfully",
            };
        } catch (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }

    /**
     * Authenticate user login
     * @param {string} userName - Username
     * @param {string} password - Password
     * @returns {Promise<Object>} Authentication result with token
     */
    async authenticateUser(userName, password) {
        try {
            // Find user by username
            const user = await this.model.findOne({
                where: { userName },
                include: [
                    {
                        model: db.Employee,
                        as: "employee",
                        attributes: [
                            "id",
                            "firstName",
                            "lastName",
                            "email",
                            "phoneNumber",
                        ],
                    },
                ],
            });

            if (!user) {
                return {
                    success: false,
                    message: "Invalid username or password",
                };
            }

            // Check if user is active
            if (user.status !== "active") {
                return {
                    success: false,
                    message: `Account is ${user.status}. Please contact administrator.`,
                };
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );
            if (!isPasswordValid) {
                return {
                    success: false,
                    message: "Invalid username or password",
                };
            }

            // Update last seen
            await user.updateLastSeen();

            // Generate JWT token
            const token = jwt.sign(
                {
                    userId: user.userId,
                    userName: user.userName,
                    role: user.role,
                    employeeId: user.employeeId,
                },
                this.jwtSecret,
                { expiresIn: this.jwtExpiresIn }
            );

            // Prepare user data for response
            const userData = user.toJSON();
            delete userData.password;

            return {
                success: true,
                data: {
                    user: userData,
                    token,
                    firstLogin: user.firstLogin,
                },
                message: "Authentication successful",
            };
        } catch (error) {
            throw new Error(`Authentication failed: ${error.message}`);
        }
    }

    /**
     * Get all users with filtering and pagination
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Paginated users
     */
    async getAllUsers(options = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                filters = {},
                sortBy = "createdAt",
                sortOrder = "DESC",
            } = options;

            const offset = (page - 1) * limit;
            const where = this._buildWhereClause(filters);

            const { rows: users, count: total } =
                await this.model.findAndCountAll({
                    where,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    order: [[sortBy, sortOrder]],
                    attributes: { exclude: ["password"] },
                    include: [
                        {
                            model: db.Employee,
                            as: "employee",
                            attributes: [
                                "id",
                                "firstName",
                                "lastName",
                                "email",
                                "phoneNumber",
                            ],
                        },
                    ],
                });

            return {
                success: true,
                data: {
                    users,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil(total / limit),
                        totalItems: total,
                        itemsPerPage: parseInt(limit),
                    },
                },
            };
        } catch (error) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    }

    /**
     * Get user by ID
     * @param {string} userId - User UUID
     * @returns {Promise<Object>} User details
     */
    async getUserById(userId) {
        try {
            const user = await this.model.findByPk(userId, {
                attributes: { exclude: ["password"] },
                include: [
                    {
                        model: db.Employee,
                        as: "employee",
                        attributes: [
                            "id",
                            "firstName",
                            "lastName",
                            "email",
                            "phoneNumber",
                        ],
                    },
                ],
            });

            if (!user) {
                return {
                    success: false,
                    message: "User not found",
                };
            }

            return {
                success: true,
                data: user,
            };
        } catch (error) {
            throw new Error(`Failed to fetch user: ${error.message}`);
        }
    }

    /**
     * Get user by username
     * @param {string} userName - Username
     * @returns {Promise<Object>} User details
     */
    async getUserByUsername(userName) {
        try {
            const user = await this.model.findOne({
                where: { userName },
                attributes: { exclude: ["password"] },
                include: [
                    {
                        model: db.Employee,
                        as: "employee",
                        attributes: [
                            "id",
                            "firstName",
                            "lastName",
                            "email",
                            "phoneNumber",
                        ],
                    },
                ],
            });

            if (!user) {
                return {
                    success: false,
                    message: "User not found",
                };
            }

            return {
                success: true,
                data: user,
            };
        } catch (error) {
            throw new Error(`Failed to fetch user: ${error.message}`);
        }
    }

    /**
     * Update user
     * @param {string} userId - User UUID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated user
     */
    async updateUser(userId, updateData) {
        try {
            const user = await this.model.findByPk(userId);

            if (!user) {
                return {
                    success: false,
                    message: "User not found",
                };
            }

            // If updating username, check for conflicts
            if (updateData.userName && updateData.userName !== user.userName) {
                const existingUser = await this.model.findOne({
                    where: {
                        userName: updateData.userName,
                        userId: { [Op.ne]: userId },
                    },
                });

                if (existingUser) {
                    return {
                        success: false,
                        message: "Username already exists",
                    };
                }
            }

            // Hash password if provided
            if (updateData.password) {
                updateData.password = await bcrypt.hash(
                    updateData.password,
                    12
                );
            }

            await user.update(updateData);

            // Return updated user without password
            const updatedUser = await this.model.findByPk(userId, {
                attributes: { exclude: ["password"] },
                include: [
                    {
                        model: db.Employee,
                        as: "employee",
                        attributes: [
                            "id",
                            "firstName",
                            "lastName",
                            "email",
                            "phoneNumber",
                        ],
                    },
                ],
            });

            return {
                success: true,
                data: updatedUser,
                message: "User updated successfully",
            };
        } catch (error) {
            throw new Error(`Failed to update user: ${error.message}`);
        }
    }

    /**
     * Change user password
     * @param {string} userId - User UUID
     * @param {string} currentPassword - Current password
     * @param {string} newPassword - New password
     * @returns {Promise<Object>} Result
     */
    async changePassword(userId, currentPassword, newPassword) {
        try {
            const user = await this.model.findByPk(userId);

            if (!user) {
                return {
                    success: false,
                    message: "User not found",
                };
            }

            // Verify current password
            const isCurrentPasswordValid = await bcrypt.compare(
                currentPassword,
                user.password
            );
            if (!isCurrentPasswordValid) {
                return {
                    success: false,
                    message: "Current password is incorrect",
                };
            }

            // Hash new password
            const hashedNewPassword = await bcrypt.hash(newPassword, 12);

            // Update password
            await user.update({ password: hashedNewPassword });

            return {
                success: true,
                message: "Password changed successfully",
            };
        } catch (error) {
            throw new Error(`Failed to change password: ${error.message}`);
        }
    }

    /**
     * Reset user password (admin function)
     * @param {string} userId - User UUID
     * @param {string} newPassword - New password
     * @returns {Promise<Object>} Result
     */
    async resetPassword(userId, newPassword) {
        try {
            const user = await this.model.findByPk(userId);

            if (!user) {
                return {
                    success: false,
                    message: "User not found",
                };
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 12);

            // Update password and set first login flag
            await user.update({
                password: hashedPassword,
                firstLogin: true,
            });

            return {
                success: true,
                message: "Password reset successfully",
            };
        } catch (error) {
            throw new Error(`Failed to reset password: ${error.message}`);
        }
    }

    /**
     * Update user status
     * @param {string} userId - User UUID
     * @param {string} status - New status
     * @returns {Promise<Object>} Updated user
     */
    async updateUserStatus(userId, status) {
        try {
            const user = await this.model.findByPk(userId);

            if (!user) {
                return {
                    success: false,
                    message: "User not found",
                };
            }

            await user.update({ status });

            return {
                success: true,
                data: user,
                message: `User status updated to ${status}`,
            };
        } catch (error) {
            throw new Error(`Failed to update user status: ${error.message}`);
        }
    }

    /**
     * Complete first login
     * @param {string} userId - User UUID
     * @returns {Promise<Object>} Result
     */
    async completeFirstLogin(userId) {
        try {
            const user = await this.model.findByPk(userId);

            if (!user) {
                return {
                    success: false,
                    message: "User not found",
                };
            }

            await user.completeFirstLogin();

            return {
                success: true,
                message: "First login completed",
            };
        } catch (error) {
            throw new Error(`Failed to complete first login: ${error.message}`);
        }
    }

    /**
     * Get active users
     * @returns {Promise<Object>} Active users
     */
    async getActiveUsers() {
        try {
            const users = await this.model.findActiveUsers();

            return {
                success: true,
                data: users.map((user) => {
                    const userData = user.toJSON();
                    delete userData.password;
                    return userData;
                }),
            };
        } catch (error) {
            throw new Error(`Failed to fetch active users: ${error.message}`);
        }
    }

    /**
     * Get user dashboard stats
     * @returns {Promise<Object>} Dashboard statistics
     */
    async getDashboardStats() {
        try {
            const [
                totalUsers,
                activeUsers,
                inactiveUsers,
                suspendedUsers,
                pendingUsers,
                firstLoginUsers,
            ] = await Promise.all([
                this.model.count(),
                this.model.count({ where: { status: "active" } }),
                this.model.count({ where: { status: "inactive" } }),
                this.model.count({ where: { status: "suspended" } }),
                this.model.count({ where: { status: "pending" } }),
                this.model.count({ where: { firstLogin: true } }),
            ]);

            return {
                success: true,
                data: {
                    totalUsers,
                    activeUsers,
                    inactiveUsers,
                    suspendedUsers,
                    pendingUsers,
                    firstLoginUsers,
                },
            };
        } catch (error) {
            throw new Error(`Failed to get dashboard stats: ${error.message}`);
        }
    }

    /**
     * Verify JWT token
     * @param {string} token - JWT token
     * @returns {Promise<Object>} Verification result
     */
    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, this.jwtSecret);

            // Check if user still exists and is active
            const user = await this.model.findByPk(decoded.userId, {
                attributes: { exclude: ["password"] },
            });

            if (!user) {
                return {
                    success: false,
                    message: "User not found",
                };
            }

            if (user.status !== "active") {
                return {
                    success: false,
                    message: "User account is not active",
                };
            }

            return {
                success: true,
                data: {
                    user,
                    decoded,
                },
            };
        } catch (error) {
            return {
                success: false,
                message: "Invalid or expired token",
            };
        }
    }

    /**
     * Delete user (soft delete by setting status to inactive)
     * @param {string} userId - User UUID
     * @returns {Promise<Object>} Result
     */
    async deleteUser(userId) {
        try {
            const user = await this.model.findByPk(userId);

            if (!user) {
                return {
                    success: false,
                    message: "User not found",
                };
            }

            await user.update({ status: "inactive" });

            return {
                success: true,
                message: "User deleted successfully",
            };
        } catch (error) {
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }

    /**
     * Get users by role
     * @param {string} role - User role
     * @returns {Promise<Object>} Users with specified role
     */
    async getUsersByRole(role) {
        try {
            const users = await this.model.findAll({
                where: { role, status: "active" },
                attributes: { exclude: ["password"] },
                include: [
                    {
                        model: db.Employee,
                        as: "employee",
                        attributes: [
                            "id",
                            "firstName",
                            "lastName",
                            "email",
                            "phoneNumber",
                        ],
                    },
                ],
            });

            return {
                success: true,
                data: users,
            };
        } catch (error) {
            throw new Error(`Failed to fetch users by role: ${error.message}`);
        }
    }

    /**
     * Update user role
     * @param {string} userId - User UUID
     * @param {string} newRole - New role
     * @returns {Promise<Object>} Updated user
     */
    async updateUserRole(userId, newRole) {
        try {
            const user = await this.model.findByPk(userId);

            if (!user) {
                return {
                    success: false,
                    message: "User not found",
                };
            }

            await user.update({ role: newRole });

            const updatedUser = await this.model.findByPk(userId, {
                attributes: { exclude: ["password"] },
                include: [
                    {
                        model: db.Employee,
                        as: "employee",
                        attributes: [
                            "id",
                            "firstName",
                            "lastName",
                            "email",
                            "phoneNumber",
                        ],
                    },
                ],
            });

            return {
                success: true,
                data: updatedUser,
                message: "User role updated successfully",
            };
        } catch (error) {
            throw new Error(`Failed to update user role: ${error.message}`);
        }
    }

    /**
     * Get recently active users
     * @param {number} days - Number of days to look back
     * @returns {Promise<Object>} Recently active users
     */
    async getRecentlyActiveUsers(days = 7) {
        try {
            const sinceDate = new Date();
            sinceDate.setDate(sinceDate.getDate() - days);

            const users = await this.model.findAll({
                where: {
                    lastSeen: {
                        [Op.gte]: sinceDate,
                    },
                    status: "active",
                },
                attributes: { exclude: ["password"] },
                include: [
                    {
                        model: db.Employee,
                        as: "employee",
                        attributes: ["id", "firstName", "lastName", "email"],
                    },
                ],
                order: [["lastSeen", "DESC"]],
            });

            return {
                success: true,
                data: users,
            };
        } catch (error) {
            throw new Error(
                `Failed to fetch recently active users: ${error.message}`
            );
        }
    }

    /**
     * Bulk update user status
     * @param {Array} userIds - Array of user UUIDs
     * @param {string} status - New status
     * @returns {Promise<Object>} Result
     */
    async bulkUpdateUserStatus(userIds, status) {
        try {
            const result = await this.model.update(
                { status },
                {
                    where: {
                        userId: {
                            [Op.in]: userIds,
                        },
                    },
                }
            );

            return {
                success: true,
                data: {
                    updatedCount: result[0],
                },
                message: `${result[0]} users updated successfully`,
            };
        } catch (error) {
            throw new Error(`Failed to bulk update users: ${error.message}`);
        }
    }

    /**
     * Generate temporary password
     * @returns {string} Temporary password
     */
    generateTemporaryPassword() {
        const length = 8;
        const charset =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let password = "";

        for (let i = 0; i < length; i++) {
            password += charset.charAt(
                Math.floor(Math.random() * charset.length)
            );
        }

        return password;
    }

    /**
     * Build where clause for filtering
     * @param {Object} filters - Filter object
     * @returns {Object} Sequelize where clause
     */
    _buildWhereClause(filters) {
        const where = {};

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.role) {
            where.role = filters.role;
        }

        if (filters.employeeId) {
            where.employeeId = filters.employeeId;
        }

        if (filters.firstLogin !== undefined) {
            where.firstLogin = filters.firstLogin;
        }

        if (filters.search) {
            where[Op.or] = [
                { userName: { [Op.like]: `%${filters.search}%` } },
                { role: { [Op.like]: `%${filters.search}%` } },
            ];
        }

        if (filters.lastSeenFrom && filters.lastSeenTo) {
            where.lastSeen = {
                [Op.between]: [filters.lastSeenFrom, filters.lastSeenTo],
            };
        } else if (filters.lastSeenFrom) {
            where.lastSeen = {
                [Op.gte]: filters.lastSeenFrom,
            };
        } else if (filters.lastSeenTo) {
            where.lastSeen = {
                [Op.lte]: filters.lastSeenTo,
            };
        }

        return where;
    }

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {Object} Validation result
     */
    validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const errors = [];

        if (password.length < minLength) {
            errors.push(
                `Password must be at least ${minLength} characters long`
            );
        }

        if (!hasUpperCase) {
            errors.push("Password must contain at least one uppercase letter");
        }

        if (!hasLowerCase) {
            errors.push("Password must contain at least one lowercase letter");
        }

        if (!hasNumbers) {
            errors.push("Password must contain at least one number");
        }

        if (!hasSpecialChar) {
            errors.push("Password must contain at least one special character");
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    }
}

module.exports = new UserListService();
