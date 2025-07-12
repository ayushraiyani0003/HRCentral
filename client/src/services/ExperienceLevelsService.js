// ExperienceLevelService.js - Client-side service for Experience Level API operations

/**
 * @fileoverview Simple service for handling experience levels API operations
 * @version 1.0.0
 */

class ExperienceLevelService {
    constructor() {
        this.baseUrl = "/api/experience-level";
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
                    errorMessage =
                        errorData.message || errorData.error || errorMessage;
                } catch (e) {
                    errorMessage = e.message || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const responseData = await response.json();
            console.log("API Response:", responseData);

            // Handle the response format based on the backend structure
            return {
                success: responseData.success !== false,
                data: responseData.data,
                message: responseData.message,
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
     * Get all experience levels
     * @returns {Promise<Object>} API response with experience levels
     */
    async getAllExperienceLevels() {
        const result = await this._makeRequest(this.baseUrl, {
            method: "GET",
        });

        // Handle the nested structure: data.experienceLevels
        if (result.success && result.data && result.data.experienceLevels) {
            return {
                ...result,
                data: result.data.experienceLevels, // Extract the array from the nested structure
            };
        }

        return result;
    }

    /**
     * Get experience level by ID
     * @param {string} experienceLevelId - Experience level ID
     * @returns {Promise<Object>} API response with experience level data
     */
    async getExperienceLevelById(experienceLevelId) {
        if (!experienceLevelId) {
            return {
                success: false,
                error: "Experience level ID is required",
            };
        }

        return await this._makeRequest(`${this.baseUrl}/${experienceLevelId}`, {
            method: "GET",
        });
    }

    /**
     * Get experience level by name
     * @param {string} name - Experience level name
     * @returns {Promise<Object>} API response with experience level data
     */
    async getExperienceLevelByName(name) {
        if (!name) {
            return {
                success: false,
                error: "Experience level name is required",
            };
        }

        return await this._makeRequest(
            `${this.baseUrl}/name/${encodeURIComponent(name)}`,
            {
                method: "GET",
            }
        );
    }

    /**
     * Create new experience level
     * @param {Object} experienceLevelData - Experience level data
     * @param {string} experienceLevelData.name - Experience level name (required)
     * @returns {Promise<Object>} API response with created experience level
     */
    async createExperienceLevel(experienceLevelData) {
        if (!experienceLevelData || !experienceLevelData.name) {
            return {
                success: false,
                error: "Experience level name is required",
            };
        }

        console.log(
            "Creating experience level with data:",
            experienceLevelData
        );

        return await this._makeRequest(this.baseUrl, {
            method: "POST",
            body: JSON.stringify(experienceLevelData),
        });
    }

    /**
     * Update existing experience level
     * @param {string} experienceLevelId - Experience level ID
     * @param {Object} experienceLevelData - Updated experience level data
     * @param {string} experienceLevelData.name - Updated experience level name
     * @returns {Promise<Object>} API response with updated experience level
     */
    async updateExperienceLevel(experienceLevelId, experienceLevelData) {
        if (!experienceLevelId) {
            return {
                success: false,
                error: "Experience level ID is required",
            };
        }

        console.log(
            "Updating experience level:",
            experienceLevelId,
            "with data:",
            experienceLevelData
        );

        return await this._makeRequest(`${this.baseUrl}/${experienceLevelId}`, {
            method: "PUT",
            body: JSON.stringify(experienceLevelData),
        });
    }

    /**
     * Delete experience level
     * @param {string} experienceLevelId - Experience level ID
     * @returns {Promise<Object>} API response confirming deletion
     */
    async deleteExperienceLevel(experienceLevelId) {
        if (!experienceLevelId) {
            return {
                success: false,
                error: "Experience level ID is required",
            };
        }

        console.log("Deleting experience level:", experienceLevelId);

        return await this._makeRequest(`${this.baseUrl}/${experienceLevelId}`, {
            method: "DELETE",
        });
    }

    // ==============================
    // Convenience Methods
    // ==============================

    /**
     * Check if experience level exists by name
     * @param {string} name - Experience level name
     * @returns {Promise<boolean>} True if exists, false otherwise
     */
    async experienceLevelExists(name) {
        try {
            const result = await this.getExperienceLevelByName(name);
            return result.success && result.data;
        } catch (error) {
            console.error("Error checking experience level existence:", error);
            return false;
        }
    }

    /**
     * Get experience level names only
     * @returns {Promise<Array<string>>} Array of experience level names
     */
    async getExperienceLevelNames() {
        try {
            const result = await this.getAllExperienceLevels();
            if (result.success && Array.isArray(result.data)) {
                return result.data
                    .filter((level) => level && level.name)
                    .map((level) => level.name);
            }
            return [];
        } catch (error) {
            console.error("Error getting experience level names:", error);
            return [];
        }
    }

    /**
     * Search experience levels by partial name match
     * @param {string} searchTerm - Search term
     * @returns {Promise<Array>} Filtered experience levels
     */
    async searchExperienceLevels(searchTerm) {
        try {
            const result = await this.getAllExperienceLevels();
            if (result.success && Array.isArray(result.data)) {
                const filtered = result.data.filter(
                    (level) =>
                        level &&
                        level.name &&
                        level.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                );
                return {
                    success: true,
                    data: filtered,
                    message: `Found ${filtered.length} experience levels matching "${searchTerm}"`,
                };
            }
            return {
                success: false,
                error: "Failed to fetch experience levels for search",
            };
        } catch (error) {
            console.error("Error searching experience levels:", error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
}

// Create singleton instance
let serviceInstance = null;

/**
 * Get service instance
 * @returns {ExperienceLevelService} ExperienceLevelService instance
 */
export const getExperienceLevelService = () => {
    if (!serviceInstance) {
        serviceInstance = new ExperienceLevelService();
    }
    return serviceInstance;
};

export default getExperienceLevelService();
