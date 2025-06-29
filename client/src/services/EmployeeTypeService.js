// EmployeeTypeService.js - Service for handling employee types API operations

/**
 * @fileoverview Simple service for handling employee types API operations
 * @version 1.0.1
 */

class EmployeeTypeService {
    constructor() {
        this.baseUrl = "/api/employee-type";
    }

    /**
     * Get auth token from storage
     * @private
     * @returns {string|null} Auth token
     */
    _getToken() {
        try {
            // Note: Using in-memory storage instead of localStorage for compatibility
            return window.authToken || null;
        } catch (error) {
            console.error("Error getting auth token:", error);
            return null;
        }
    }

    /**
     * Make API request
     * @private
     * @param {string} url - Request URL
     * @param {Object} options - Request options
     * @returns {Promise<Object>} API response
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

            console.log(`Making ${config.method || "GET"} request to:`, url);

            const response = await fetch(url, config);

            if (!response.ok) {
                let errorMessage = `HTTP Error: ${response.status}`;
                try {
                    const errorData = await response.json();
                    // Handle both direct error and wrapped error responses
                    errorMessage =
                        errorData.result?.message ||
                        errorData.result?.error ||
                        errorData.message ||
                        errorData.error ||
                        errorMessage;
                } catch (e) {
                    errorMessage = e.message || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const responseData = await response.json();
            console.log("API Response:", responseData);

            // Handle the wrapped response format: { success, data, message }
            const result = responseData.result || responseData;

            return {
                success: result.success !== false, // Default to true if not specified
                data: result.data,
                message: result.message,
            };
        } catch (error) {
            console.error(`API Error [${url}]:`, error);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ==============================
    // Basic CRUD Operations
    // ==============================

    /**
     * Get all employee types
     * @returns {Promise<Object>} API response with employee types
     */
    async getAllEmployeeTypes() {
        return await this._makeRequest(this.baseUrl, {
            method: "GET",
        });
    }

    /**
     * Get employee type by ID
     * @param {string} employeeTypeId - Employee type UUID
     * @returns {Promise<Object>} API response with employee type data
     */
    async getEmployeeTypeById(employeeTypeId) {
        if (!employeeTypeId) {
            return {
                success: false,
                error: "Employee type ID is required",
            };
        }

        return await this._makeRequest(`${this.baseUrl}/${employeeTypeId}`, {
            method: "GET",
        });
    }

    /**
     * Create new employee type
     * @param {Object} employeeTypeData - Employee type data
     * @param {string} employeeTypeData.name - Employee type name (required, max 100 chars)
     * @returns {Promise<Object>} API response with created employee type
     */
    async createEmployeeType(employeeTypeData) {
        if (!employeeTypeData || !employeeTypeData.name) {
            return {
                success: false,
                error: "Employee type name is required",
            };
        }

        // Client-side validation
        if (typeof employeeTypeData.name !== "string") {
            return {
                success: false,
                error: "Employee type name must be a string",
            };
        }

        if (employeeTypeData.name.trim().length === 0) {
            return {
                success: false,
                error: "Employee type name cannot be empty",
            };
        }

        if (employeeTypeData.name.length > 100) {
            return {
                success: false,
                error: "Employee type name must not exceed 100 characters",
            };
        }

        console.log("Creating employee type with data:", employeeTypeData);

        return await this._makeRequest(this.baseUrl, {
            method: "POST",
            body: JSON.stringify({
                name: employeeTypeData.name.trim(),
            }),
        });
    }

    /**
     * Update existing employee type
     * @param {string} employeeTypeId - Employee type UUID
     * @param {Object} employeeTypeData - Updated employee type data
     * @param {string} employeeTypeData.name - Employee type name (required, max 100 chars)
     * @returns {Promise<Object>} API response with updated employee type
     */
    async updateEmployeeType(employeeTypeId, employeeTypeData) {
        if (!employeeTypeId) {
            return {
                success: false,
                error: "Employee type ID is required",
            };
        }

        if (!employeeTypeData || !employeeTypeData.name) {
            return {
                success: false,
                error: "Employee type name is required",
            };
        }

        // Client-side validation
        if (typeof employeeTypeData.name !== "string") {
            return {
                success: false,
                error: "Employee type name must be a string",
            };
        }

        if (employeeTypeData.name.trim().length === 0) {
            return {
                success: false,
                error: "Employee type name cannot be empty",
            };
        }

        if (employeeTypeData.name.length > 100) {
            return {
                success: false,
                error: "Employee type name must not exceed 100 characters",
            };
        }

        console.log(
            "Updating employee type:",
            employeeTypeId,
            "with data:",
            employeeTypeData
        );

        return await this._makeRequest(`${this.baseUrl}/${employeeTypeId}`, {
            method: "PUT",
            body: JSON.stringify({
                name: employeeTypeData.name.trim(),
            }),
        });
    }

    /**
     * Delete employee type
     * @param {string} employeeTypeId - Employee type UUID
     * @returns {Promise<Object>} API response confirming deletion
     */
    async deleteEmployeeType(employeeTypeId) {
        if (!employeeTypeId) {
            return {
                success: false,
                error: "Employee type ID is required",
            };
        }

        console.log("Deleting employee type:", employeeTypeId);

        return await this._makeRequest(`${this.baseUrl}/${employeeTypeId}`, {
            method: "DELETE",
        });
    }

    // ==============================
    // Utility Methods
    // ==============================

    /**
     * Search employee types by name
     * @param {string} searchTerm - Search term for employee type name
     * @returns {Promise<Object>} API response with filtered employee types
     */
    async searchEmployeeTypes(searchTerm) {
        const result = await this.getAllEmployeeTypes();

        if (!result.success || !result.data) {
            return result;
        }

        // Client-side filtering by name
        const filteredData = result.data.filter((employeeType) =>
            employeeType.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return {
            ...result,
            data: filteredData,
        };
    }

    /**
     * Check if employee type name exists
     * @param {string} name - Employee type name to check
     * @param {string} excludeId - ID to exclude from check (for updates)
     * @returns {Promise<boolean>} True if name exists, false otherwise
     */
    async isNameExists(name, excludeId = null) {
        try {
            const result = await this.getAllEmployeeTypes();

            if (!result.success || !result.data) {
                return false;
            }

            return result.data.some(
                (employeeType) =>
                    employeeType.name.toLowerCase() === name.toLowerCase() &&
                    employeeType.id !== excludeId
            );
        } catch (error) {
            console.error("Error checking if name exists:", error);
            return false;
        }
    }
}

// Create singleton instance
let serviceInstance = null;

/**
 * Get service instance
 * @returns {EmployeeTypeService} EmployeeTypeService instance
 */
export const getEmployeeTypeService = () => {
    if (!serviceInstance) {
        serviceInstance = new EmployeeTypeService();
    }
    return serviceInstance;
};

export default getEmployeeTypeService();
