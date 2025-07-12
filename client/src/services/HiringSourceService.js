// HiringSourceService.js - Client-side service for hiring source API operations

/**
 * @fileoverview Simple service for handling hiring sources API operations
 * @version 1.0.0
 */

class HiringSourceService {
    constructor() {
        this.baseUrl = "/api/hiring-source";
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

            // Fix: Handle nested hiringSources structure
            let processedData = result.data;

            // If data has nested hiringSources.hiringSources, flatten it
            if (
                processedData &&
                processedData.hiringSources &&
                processedData.hiringSources.hiringSources &&
                Array.isArray(processedData.hiringSources.hiringSources)
            ) {
                processedData = {
                    ...processedData,
                    hiringSources: processedData.hiringSources.hiringSources,
                };
            }

            return {
                success: result.success !== false, // Default to true if not specified
                data: processedData,
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
     * Get all hiring sources with optional search
     * @param {Object} params - Query parameters
     * @param {string} [params.search=""] - Search term to filter by name
     * @returns {Promise<Object>} API response with hiring sources
     */
    async getAllHiringSources(params = {}) {
        const { search } = params;
        const queryParams = new URLSearchParams();

        if (search) queryParams.append("search", search);

        const url = queryParams.toString()
            ? `${this.baseUrl}?${queryParams.toString()}`
            : this.baseUrl;

        return await this._makeRequest(url, {
            method: "GET",
        });
    }

    /**
     * Get hiring source by ID
     * @param {string} hiringSourceId - Hiring source ID
     * @returns {Promise<Object>} API response with hiring source data
     */
    async getHiringSourceById(hiringSourceId) {
        if (!hiringSourceId) {
            return {
                success: false,
                error: "Hiring source ID is required",
            };
        }

        return await this._makeRequest(`${this.baseUrl}/${hiringSourceId}`, {
            method: "GET",
        });
    }

    /**
     * Create new hiring source
     * @param {Object} hiringSourceData - Hiring source data
     * @param {string} hiringSourceData.name - Hiring source name
     * @returns {Promise<Object>} API response with created hiring source
     */
    async createHiringSource(hiringSourceData) {
        if (!hiringSourceData || !hiringSourceData.name) {
            return {
                success: false,
                error: "Hiring source name is required",
            };
        }

        console.log("Creating hiring source with data:", hiringSourceData);

        return await this._makeRequest(this.baseUrl, {
            method: "POST",
            body: JSON.stringify(hiringSourceData),
        });
    }

    /**
     * Update existing hiring source
     * @param {string} hiringSourceId - Hiring source ID
     * @param {Object} hiringSourceData - Updated hiring source data
     * @param {string} hiringSourceData.name - Updated hiring source name
     * @returns {Promise<Object>} API response with updated hiring source
     */
    async updateHiringSource(hiringSourceId, hiringSourceData) {
        if (!hiringSourceId) {
            return {
                success: false,
                error: "Hiring source ID is required",
            };
        }

        console.log(
            "Updating hiring source:",
            hiringSourceId,
            "with data:",
            hiringSourceData
        );

        return await this._makeRequest(`${this.baseUrl}/${hiringSourceId}`, {
            method: "PUT",
            body: JSON.stringify(hiringSourceData),
        });
    }

    /**
     * Delete hiring source
     * @param {string} hiringSourceId - Hiring source ID
     * @returns {Promise<Object>} API response confirming deletion
     */
    async deleteHiringSource(hiringSourceId) {
        if (!hiringSourceId) {
            return {
                success: false,
                error: "Hiring source ID is required",
            };
        }

        console.log("Deleting hiring source:", hiringSourceId);

        return await this._makeRequest(`${this.baseUrl}/${hiringSourceId}`, {
            method: "DELETE",
        });
    }

    // ==============================
    // Additional Operations
    // ==============================

    /**
     * Search hiring sources by name
     * @param {string} searchTerm - Search term
     * @returns {Promise<Object>} API response with matching hiring sources
     */
    async searchHiringSourcesByName(searchTerm) {
        if (!searchTerm) {
            return {
                success: false,
                error: "Search term is required",
            };
        }

        console.log("Searching hiring sources by name:", searchTerm);

        return await this._makeRequest(
            `${this.baseUrl}/search/${encodeURIComponent(searchTerm)}`,
            {
                method: "GET",
            }
        );
    }

    // ==============================
    // Convenience Methods
    // ==============================

    /**
     * Get all hiring sources (alias for getAllHiringSources with no params)
     * @returns {Promise<Object>} API response with all hiring sources
     */
    async getAll() {
        return await this.getAllHiringSources();
    }

    /**
     * Get hiring source by ID (alias)
     * @param {string} id - Hiring source ID
     * @returns {Promise<Object>} API response with hiring source data
     */
    async getById(id) {
        return await this.getHiringSourceById(id);
    }

    /**
     * Create hiring source (alias)
     * @param {Object} data - Hiring source data
     * @returns {Promise<Object>} API response with created hiring source
     */
    async create(data) {
        return await this.createHiringSource(data);
    }

    /**
     * Update hiring source (alias)
     * @param {string} id - Hiring source ID
     * @param {Object} data - Updated hiring source data
     * @returns {Promise<Object>} API response with updated hiring source
     */
    async update(id, data) {
        return await this.updateHiringSource(id, data);
    }

    /**
     * Delete hiring source (alias)
     * @param {string} id - Hiring source ID
     * @returns {Promise<Object>} API response confirming deletion
     */
    async delete(id) {
        return await this.deleteHiringSource(id);
    }

    /**
     * Search by name (alias)
     * @param {string} searchTerm - Search term
     * @returns {Promise<Object>} API response with matching hiring sources
     */
    async searchByName(searchTerm) {
        return await this.searchHiringSourcesByName(searchTerm);
    }
}

// Create singleton instance
let serviceInstance = null;

/**
 * Get service instance
 * @returns {HiringSourceService} HiringSourceService instance
 */
export const getHiringSourceService = () => {
    if (!serviceInstance) {
        serviceInstance = new HiringSourceService();
    }
    return serviceInstance;
};

export default getHiringSourceService();
