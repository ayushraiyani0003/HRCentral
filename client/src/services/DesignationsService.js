/**
 * @fileoverview Service for handling Designation API operations
 * @version 1.0.1
 */

class DesignationService {
    constructor() {
        this.baseUrl = "/api/designation";
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
            console.log("Response:", response);

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

            // Handle the wrapped response format: { result: { success, data, message } }
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
     * Get all designations
     * @returns {Promise<Object>} API response with designations
     *
     * @example
     * const response = await designationService.getAllDesignations();
     * if (response.success) {
     *     console.log('Designations:', response.data);
     * }
     */
    async getAllDesignations() {
        return await this._makeRequest(this.baseUrl, {
            method: "GET",
        });
    }

    /**
     * Get designation by ID
     * @param {string} designationId - Designation UUID
     * @returns {Promise<Object>} API response with designation data
     *
     * @example
     * const response = await designationService.getDesignationById('uuid-here');
     * if (response.success) {
     *     console.log('Designation:', response.data);
     * }
     */
    async getDesignationById(designationId) {
        if (!designationId) {
            return {
                success: false,
                error: "Designation ID is required",
            };
        }

        return await this._makeRequest(`${this.baseUrl}/${designationId}`, {
            method: "GET",
        });
    }

    /**
     * Create new designation
     * @param {Object} designationData - Designation data
     * @param {string} designationData.name - Designation name (required)
     * @param {string} [designationData.description] - Designation description
     * @param {string} [designationData.department] - Department name
     * @param {number} [designationData.level] - Designation level
     * @returns {Promise<Object>} API response with created designation
     *
     * @example
     * const response = await designationService.createDesignation({
     *     name: "Software Engineer",
     *     description: "Develops software applications",
     *     department: "Engineering"
     * });
     */
    async createDesignation(designationData) {
        if (!designationData || !designationData.name) {
            return {
                success: false,
                error: "Designation name is required",
            };
        }

        console.log("Creating designation with data:", designationData);

        return await this._makeRequest(this.baseUrl, {
            method: "POST",
            body: JSON.stringify(designationData),
        });
    }

    /**
     * Update existing designation
     * @param {string} designationId - Designation UUID
     * @param {Object} designationData - Updated designation data
     * @param {string} [designationData.name] - Designation name
     * @param {string} [designationData.description] - Designation description
     * @param {string} [designationData.department] - Department name
     * @param {number} [designationData.level] - Designation level
     * @returns {Promise<Object>} API response with updated designation
     *
     * @example
     * const response = await designationService.updateDesignation('uuid-here', {
     *     name: "Senior Software Engineer",
     *     description: "Leads software development projects"
     * });
     */
    async updateDesignation(designationId, designationData) {
        if (!designationId) {
            return {
                success: false,
                error: "Designation ID is required",
            };
        }

        console.log(
            "Updating designation:",
            designationId,
            "with data:",
            designationData
        );

        return await this._makeRequest(`${this.baseUrl}/${designationId}`, {
            method: "PUT",
            body: JSON.stringify(designationData),
        });
    }

    /**
     * Delete designation
     * @param {string} designationId - Designation UUID
     * @returns {Promise<Object>} API response confirming deletion
     *
     * @example
     * const response = await designationService.deleteDesignation('uuid-here');
     * if (response.success) {
     *     console.log('Designation deleted successfully');
     * }
     */
    async deleteDesignation(designationId) {
        if (!designationId) {
            return {
                success: false,
                error: "Designation ID is required",
            };
        }

        console.log("Deleting designation:", designationId);

        return await this._makeRequest(`${this.baseUrl}/${designationId}`, {
            method: "DELETE",
        });
    }

    // ==============================
    // Utility Methods
    // ==============================

    /**
     * Check if designation name exists
     * @param {string} name - Designation name to check
     * @param {string} [excludeId] - ID to exclude from check (for updates)
     * @returns {Promise<boolean>} True if name exists, false otherwise
     *
     * @example
     * const exists = await designationService.doesNameExist("Software Engineer");
     */
    async doesNameExist(name, excludeId = null) {
        try {
            const response = await this.getAllDesignations();
            if (response.success && response.data) {
                return response.data.some(
                    (designation) =>
                        designation.name.toLowerCase() === name.toLowerCase() &&
                        designation.id !== excludeId
                );
            }
            return false;
        } catch (error) {
            console.error("Error checking designation name:", error);
            return false;
        }
    }

    /**
     * Search designations by name or description
     * @param {string} searchTerm - Search term
     * @returns {Promise<Array>} Filtered designations
     *
     * @example
     * const results = await designationService.searchByName('engineer');
     */
    async searchByName(searchTerm) {
        try {
            const response = await this.getAllDesignations();
            if (response.success && response.data) {
                return response.data.filter(
                    (designation) =>
                        designation.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                        (designation.description &&
                            designation.description
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()))
                );
            }
            return [];
        } catch (error) {
            console.error("Error searching designations:", error);
            return [];
        }
    }

    /**
     * Get designations by department
     * @param {string} department - Department name
     * @returns {Promise<Array>} Designations in the department
     *
     * @example
     * const engineeringRoles = await designationService.getByDepartment('Engineering');
     */
    async getByDepartment(department) {
        try {
            const response = await this.getAllDesignations();
            if (response.success && response.data) {
                return response.data.filter(
                    (designation) =>
                        designation.department &&
                        designation.department.toLowerCase() ===
                            department.toLowerCase()
                );
            }
            return [];
        } catch (error) {
            console.error("Error getting designations by department:", error);
            return [];
        }
    }

    /**
     * Get designations sorted by level
     * @param {string} [order='asc'] - Sort order: 'asc' or 'desc'
     * @returns {Promise<Array>} Sorted designations
     *
     * @example
     * const sorted = await designationService.getSortedByLevel('desc');
     */
    async getSortedByLevel(order = "asc") {
        try {
            const response = await this.getAllDesignations();
            if (response.success && response.data) {
                return response.data.sort((a, b) => {
                    const levelA = a.level || 0;
                    const levelB = b.level || 0;
                    return order === "asc" ? levelA - levelB : levelB - levelA;
                });
            }
            return [];
        } catch (error) {
            console.error("Error getting sorted designations:", error);
            return [];
        }
    }

    /**
     * Validate designation data
     * @param {Object} data - Designation data to validate
     * @returns {Object} Validation result
     *
     * @example
     * const validation = designationService.validateData({
     *     name: "Software Engineer"
     * });
     */
    validateData(data) {
        const errors = [];

        if (!data || typeof data !== "object") {
            errors.push("Designation data is required");
            return { isValid: false, errors };
        }

        if (
            !data.name ||
            typeof data.name !== "string" ||
            data.name.trim().length === 0
        ) {
            errors.push("Designation name is required");
        } else if (data.name.length > 100) {
            errors.push("Designation name must be less than 100 characters");
        }

        if (data.description && typeof data.description !== "string") {
            errors.push("Description must be a string");
        } else if (data.description && data.description.length > 500) {
            errors.push("Description must be less than 500 characters");
        }

        if (data.department && typeof data.department !== "string") {
            errors.push("Department must be a string");
        }

        if (
            data.level !== undefined &&
            (typeof data.level !== "number" || data.level < 0)
        ) {
            errors.push("Level must be a non-negative number");
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }
}

// Create singleton instance
let serviceInstance = null;

/**
 * Get service instance
 * @returns {DesignationService} DesignationService instance
 */
export const getDesignationService = () => {
    if (!serviceInstance) {
        serviceInstance = new DesignationService();
    }
    return serviceInstance;
};

export default getDesignationService();
