/**
 * @fileoverview Simple service for handling roles API operations
 * @version 1.0.2
 */

class RolesPermissionsService {
    constructor() {
        this.baseUrl = "/api/roles";
    }

    /**
     * Get auth token from localStorage
     * @private
     */
    _getToken() {
        try {
            return localStorage.getItem("authToken");
        } catch (error) {
            return null;
        }
    }

    /**
     * Make API request
     * @private
     */
    async _makeRequest(url, options = {}) {
        try {
            const headers = {
                "Content-Type": "application/json",
                ...options.headers,
            };

            const token = this._getToken();
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const config = {
                ...options,
                headers,
            };

            // console.log(`Making ${config.method || "GET"} request to:`, url);
            // console.log("Request config:", config);

            const response = await fetch(url, config);

            if (!response.ok) {
                let errorMessage = `HTTP Error: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage =
                        errorData.message || errorData.error || errorMessage;
                } catch (e) {
                    // Use default error message
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            // console.log("API Response:", data);

            return {
                success: true,
                data,
            };
        } catch (error) {
            console.error(`API Error [${url}]:`, error);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    /**
     * Get all roles
     */
    async getAllRoles() {
        return await this._makeRequest(this.baseUrl, {
            method: "GET",
        });
    }

    /**
     * Get role by ID
     */
    async getRoleById(roleId) {
        if (!roleId) {
            return {
                success: false,
                error: "Role ID is required",
            };
        }

        return await this._makeRequest(`${this.baseUrl}/${roleId}`, {
            method: "GET",
        });
    }

    /**
     * Create new role
     */
    async createRole(roleData) {
        // console.log("Received role data:", roleData);

        if (!roleData || !roleData.name) {
            return {
                success: false,
                error: "Role name is required",
            };
        }

        // console.log("Creating role with data:", roleData);

        return await this._makeRequest(this.baseUrl, {
            method: "POST",
            body: JSON.stringify(roleData),
        });
    }

    /**
     * Update existing role
     */
    async updateRole(roleId, roleData) {
        if (!roleId) {
            return {
                success: false,
                error: "Role ID is required",
            };
        }

        console.log("Updating role:", roleId, "with data:", roleData);

        return await this._makeRequest(`${this.baseUrl}/${roleId}`, {
            method: "PUT",
            body: JSON.stringify(roleData),
        });
    }

    /**
     * Delete role
     */
    async deleteRole(roleId) {
        if (!roleId) {
            return {
                success: false,
                error: "Role ID is required",
            };
        }

        console.log("Deleting role:", roleId);

        return await this._makeRequest(`${this.baseUrl}/${roleId}`, {
            method: "DELETE",
        });
    }

    /**
     * Bulk operations (if needed)
     */
    async bulkRoleOperations(operations) {
        if (!operations || operations.length === 0) {
            return {
                success: false,
                error: "No operations specified",
            };
        }

        return await this._makeRequest(`${this.baseUrl}/bulk`, {
            method: "POST",
            body: JSON.stringify(operations),
        });
    }
}

// Create singleton instance
let serviceInstance = null;

/**
 * Get service instance
 */
export const getRolesPermissionsService = () => {
    if (!serviceInstance) {
        serviceInstance = new RolesPermissionsService();
    }
    return serviceInstance;
};

export default getRolesPermissionsService();
