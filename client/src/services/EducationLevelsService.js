/**
 * @fileoverview Service for handling Education Level API operations
 * @version 1.0.0
 */

class EducationLevelService {
    constructor() {
        this.baseUrl = "/api/education-level";
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
     * Get all education levels
     * @returns {Promise<Object>} API response with education levels
     *
     * @example
     * const response = await educationLevelService.getAllEducationLevels();
     * if (response.success) {
     *     console.log('Education levels:', response.data);
     * }
     */
    async getAllEducationLevels() {
        return await this._makeRequest(this.baseUrl, {
            method: "GET",
        });
    }

    /**
     * Get education level by ID
     * @param {string} educationLevelId - Education Level UUID
     * @returns {Promise<Object>} API response with education level data
     *
     * @example
     * const response = await educationLevelService.getEducationLevelById('uuid-here');
     * if (response.success) {
     *     console.log('Education level:', response.data);
     * }
     */
    async getEducationLevelById(educationLevelId) {
        if (!educationLevelId) {
            return {
                success: false,
                error: "Education Level ID is required",
            };
        }

        return await this._makeRequest(`${this.baseUrl}/${educationLevelId}`, {
            method: "GET",
        });
    }

    /**
     * Create new education level
     * @param {Object} educationLevelData - Education level data
     * @param {string} educationLevelData.name - Education level name (required)
     * @param {string} [educationLevelData.description] - Education level description
     * @param {number} [educationLevelData.level] - Numeric level for ordering
     * @returns {Promise<Object>} API response with created education level
     *
     * @example
     * const response = await educationLevelService.createEducationLevel({
     *     name: "Bachelor's Degree",
     *     description: "Undergraduate degree",
     *     level: 3
     * });
     */
    async createEducationLevel(educationLevelData) {
        if (!educationLevelData || !educationLevelData.name) {
            return {
                success: false,
                error: "Education level name is required",
            };
        }

        console.log("Creating education level with data:", educationLevelData);

        return await this._makeRequest(this.baseUrl, {
            method: "POST",
            body: JSON.stringify(educationLevelData),
        });
    }

    /**
     * Update existing education level
     * @param {string} educationLevelId - Education Level UUID
     * @param {Object} educationLevelData - Updated education level data
     * @param {string} [educationLevelData.name] - Education level name
     * @param {string} [educationLevelData.description] - Education level description
     * @param {number} [educationLevelData.level] - Numeric level for ordering
     * @returns {Promise<Object>} API response with updated education level
     *
     * @example
     * const response = await educationLevelService.updateEducationLevel('uuid-here', {
     *     name: "Master's Degree",
     *     description: "Graduate degree"
     * });
     */
    async updateEducationLevel(educationLevelId, educationLevelData) {
        if (!educationLevelId) {
            return {
                success: false,
                error: "Education Level ID is required",
            };
        }

        console.log(
            "Updating education level:",
            educationLevelId,
            "with data:",
            educationLevelData
        );

        return await this._makeRequest(`${this.baseUrl}/${educationLevelId}`, {
            method: "PUT",
            body: JSON.stringify(educationLevelData),
        });
    }

    /**
     * Delete education level
     * @param {string} educationLevelId - Education Level UUID
     * @returns {Promise<Object>} API response confirming deletion
     *
     * @example
     * const response = await educationLevelService.deleteEducationLevel('uuid-here');
     * if (response.success) {
     *     console.log('Education level deleted successfully');
     * }
     */
    async deleteEducationLevel(educationLevelId) {
        if (!educationLevelId) {
            return {
                success: false,
                error: "Education Level ID is required",
            };
        }

        console.log("Deleting education level:", educationLevelId);

        return await this._makeRequest(`${this.baseUrl}/${educationLevelId}`, {
            method: "DELETE",
        });
    }

    // ==============================
    // Utility Methods
    // ==============================

    /**
     * Check if education level name exists
     * @param {string} name - Education level name to check
     * @param {string} [excludeId] - ID to exclude from check (for updates)
     * @returns {Promise<boolean>} True if name exists, false otherwise
     *
     * @example
     * const exists = await educationLevelService.doesNameExist("Bachelor's Degree");
     */
    async doesNameExist(name, excludeId = null) {
        try {
            const response = await this.getAllEducationLevels();
            if (response.success && response.data) {
                return response.data.some(
                    (level) =>
                        level.name.toLowerCase() === name.toLowerCase() &&
                        level.id !== excludeId
                );
            }
            return false;
        } catch (error) {
            console.error("Error checking education level name:", error);
            return false;
        }
    }

    /**
     * Search education levels by name
     * @param {string} searchTerm - Search term
     * @returns {Promise<Array>} Filtered education levels
     *
     * @example
     * const results = await educationLevelService.searchByName('degree');
     */
    async searchByName(searchTerm) {
        try {
            const response = await this.getAllEducationLevels();
            if (response.success && response.data) {
                return response.data.filter(
                    (level) =>
                        level.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                        (level.description &&
                            level.description
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()))
                );
            }
            return [];
        } catch (error) {
            console.error("Error searching education levels:", error);
            return [];
        }
    }

    /**
     * Get education levels sorted by level
     * @param {string} [order='asc'] - Sort order: 'asc' or 'desc'
     * @returns {Promise<Array>} Sorted education levels
     *
     * @example
     * const sorted = await educationLevelService.getSortedByLevel('desc');
     */
    async getSortedByLevel(order = "asc") {
        try {
            const response = await this.getAllEducationLevels();
            if (response.success && response.data) {
                return response.data.sort((a, b) => {
                    const levelA = a.level || 0;
                    const levelB = b.level || 0;
                    return order === "asc" ? levelA - levelB : levelB - levelA;
                });
            }
            return [];
        } catch (error) {
            console.error("Error getting sorted education levels:", error);
            return [];
        }
    }

    /**
     * Validate education level data
     * @param {Object} data - Education level data to validate
     * @returns {Object} Validation result
     *
     * @example
     * const validation = educationLevelService.validateData({
     *     name: "Bachelor's Degree"
     * });
     */
    validateData(data) {
        const errors = [];

        if (!data || typeof data !== "object") {
            errors.push("Education level data is required");
            return { isValid: false, errors };
        }

        if (
            !data.name ||
            typeof data.name !== "string" ||
            data.name.trim().length === 0
        ) {
            errors.push("Education level name is required");
        } else if (data.name.length > 100) {
            errors.push(
                "Education level name must be less than 100 characters"
            );
        }

        if (data.description && typeof data.description !== "string") {
            errors.push("Description must be a string");
        } else if (data.description && data.description.length > 500) {
            errors.push("Description must be less than 500 characters");
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
 * @returns {EducationLevelService} EducationLevelService instance
 */
export const getEducationLevelService = () => {
    if (!serviceInstance) {
        serviceInstance = new EducationLevelService();
    }
    return serviceInstance;
};

export default getEducationLevelService();
