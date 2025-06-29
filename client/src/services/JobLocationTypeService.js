// JobLocationTypeService.js - Service for handling job location type API operations

/**
 * @fileoverview Simple service for handling job location type API operations
 * @version 1.0.0
 */

class JobLocationTypeService {
    constructor() {
        this.baseUrl = "/api/job-location";
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
     * Get all job location types with optional search
     * @param {Object} params - Query parameters
     * @param {string} params.search - Search term for filtering
     * @returns {Promise<Object>} API response with job location types
     */
    async getAllJobLocationTypes(params = {}) {
        const queryParams = new URLSearchParams();

        if (params.search) queryParams.append("search", params.search);

        const url = queryParams.toString()
            ? `${this.baseUrl}?${queryParams.toString()}`
            : this.baseUrl;

        return await this._makeRequest(url, {
            method: "GET",
        });
    }

    /**
     * Get job location type by ID
     * @param {string} jobLocationTypeId - Job location type UUID
     * @returns {Promise<Object>} API response with job location type data
     */
    async getJobLocationTypeById(jobLocationTypeId) {
        if (!jobLocationTypeId) {
            return {
                success: false,
                error: "Job location type ID is required",
            };
        }

        return await this._makeRequest(`${this.baseUrl}/${jobLocationTypeId}`, {
            method: "GET",
        });
    }

    /**
     * Create new job location type
     * @param {Object} jobLocationTypeData - Job location type data
     * @param {string} jobLocationTypeData.name - Job location type name
     * @param {string} [jobLocationTypeData.description] - Job location type description
     * @returns {Promise<Object>} API response with created job location type
     */
    async createJobLocationType(jobLocationTypeData) {
        if (!jobLocationTypeData || !jobLocationTypeData.name) {
            return {
                success: false,
                error: "Job location type name is required",
            };
        }

        console.log(
            "Creating job location type with data:",
            jobLocationTypeData
        );

        return await this._makeRequest(this.baseUrl, {
            method: "POST",
            body: JSON.stringify(jobLocationTypeData),
        });
    }

    /**
     * Update existing job location type
     * @param {string} jobLocationTypeId - Job location type UUID
     * @param {Object} jobLocationTypeData - Updated job location type data
     * @returns {Promise<Object>} API response with updated job location type
     */
    async updateJobLocationType(jobLocationTypeId, jobLocationTypeData) {
        if (!jobLocationTypeId) {
            return {
                success: false,
                error: "Job location type ID is required",
            };
        }

        console.log(
            "Updating job location type:",
            jobLocationTypeId,
            "with data:",
            jobLocationTypeData
        );

        return await this._makeRequest(`${this.baseUrl}/${jobLocationTypeId}`, {
            method: "PUT",
            body: JSON.stringify(jobLocationTypeData),
        });
    }

    /**
     * Delete job location type
     * @param {string} jobLocationTypeId - Job location type UUID
     * @returns {Promise<Object>} API response confirming deletion
     */
    async deleteJobLocationType(jobLocationTypeId) {
        if (!jobLocationTypeId) {
            return {
                success: false,
                error: "Job location type ID is required",
            };
        }

        console.log("Deleting job location type:", jobLocationTypeId);

        return await this._makeRequest(`${this.baseUrl}/${jobLocationTypeId}`, {
            method: "DELETE",
        });
    }

    // ==============================
    // Convenience Methods
    // ==============================

    /**
     * Search job location types by name
     * @param {string} searchTerm - Search term
     * @returns {Promise<Object>} API response with filtered job location types
     */
    async searchJobLocationTypes(searchTerm) {
        return await this.getAllJobLocationTypes({
            search: searchTerm,
        });
    }
}

// Create singleton instance
let serviceInstance = null;

/**
 * Get service instance
 * @returns {JobLocationTypeService} JobLocationTypeService instance
 */
export const getJobLocationTypeService = () => {
    if (!serviceInstance) {
        serviceInstance = new JobLocationTypeService();
    }
    return serviceInstance;
};

export default getJobLocationTypeService();
