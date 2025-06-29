// SkillService.js - Service for handling skills API operations

/**
 * @fileoverview Simple service for handling skills API operations
 * @version 1.0.0
 */

class SkillService {
    constructor() {
        this.baseUrl = "/api/skill";
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
     * Get all skills
     * @param {Object} options - Query options
     * @param {string} [options.search] - Search term to filter skills by name
     * @returns {Promise<Object>} API response with skills
     */
    async getAllSkills(options = {}) {
        const queryParams = new URLSearchParams();

        if (options.search) {
            queryParams.append("search", options.search);
        }

        const url = queryParams.toString()
            ? `${this.baseUrl}?${queryParams.toString()}`
            : this.baseUrl;

        return await this._makeRequest(url, {
            method: "GET",
        });
    }

    /**
     * Get skill by ID
     * @param {string} skillId - Skill ID
     * @returns {Promise<Object>} API response with skill data
     */
    async getSkillById(skillId) {
        if (!skillId) {
            return {
                success: false,
                error: "Skill ID is required",
            };
        }

        return await this._makeRequest(`${this.baseUrl}/${skillId}`, {
            method: "GET",
        });
    }

    /**
     * Create new skill
     * @param {Object} skillData - Skill data
     * @param {string} skillData.name - Skill name
     * @returns {Promise<Object>} API response with created skill
     */
    async createSkill(skillData) {
        if (!skillData || !skillData.name) {
            return {
                success: false,
                error: "Skill name is required",
            };
        }

        console.log("Creating skill with data:", skillData);

        return await this._makeRequest(this.baseUrl, {
            method: "POST",
            body: JSON.stringify(skillData),
        });
    }

    /**
     * Update existing skill
     * @param {string} skillId - Skill ID
     * @param {Object} skillData - Updated skill data
     * @param {string} skillData.name - Updated skill name
     * @returns {Promise<Object>} API response with updated skill
     */
    async updateSkill(skillId, skillData) {
        if (!skillId) {
            return {
                success: false,
                error: "Skill ID is required",
            };
        }

        if (!skillData || !skillData.name) {
            return {
                success: false,
                error: "Skill name is required",
            };
        }

        console.log("Updating skill:", skillId, "with data:", skillData);

        return await this._makeRequest(`${this.baseUrl}/${skillId}`, {
            method: "PUT",
            body: JSON.stringify(skillData),
        });
    }

    /**
     * Delete skill
     * @param {string} skillId - Skill ID
     * @returns {Promise<Object>} API response confirming deletion
     */
    async deleteSkill(skillId) {
        if (!skillId) {
            return {
                success: false,
                error: "Skill ID is required",
            };
        }

        console.log("Deleting skill:", skillId);

        return await this._makeRequest(`${this.baseUrl}/${skillId}`, {
            method: "DELETE",
        });
    }

    // ==============================
    // Convenience Methods
    // ==============================

    /**
     * Search skills by name
     * @param {string} searchTerm - Search term
     * @param {Object} options - Additional options
     * @returns {Promise<Object>} API response with matching skills
     */
    async searchSkills(searchTerm, options = {}) {
        if (!searchTerm) {
            return {
                success: false,
                error: "Search term is required",
            };
        }

        return await this.getAllSkills({
            search: searchTerm,
            ...options,
        });
    }
}

// Create singleton instance
let serviceInstance = null;

/**
 * Get service instance
 * @returns {SkillService} SkillService instance
 */
export const getSkillService = () => {
    if (!serviceInstance) {
        serviceInstance = new SkillService();
    }
    return serviceInstance;
};

export default getSkillService();
