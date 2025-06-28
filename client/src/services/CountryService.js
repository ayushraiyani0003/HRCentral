// CountryService.js - Updated to handle your API response format

/**
 * @fileoverview Simple service for handling countries API operations
 * @version 1.0.1
 */

class CountryService {
    constructor() {
        this.baseUrl = "/api/country";
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
     * Get all countries
     * @returns {Promise<Object>} API response with countries
     */
    async getAllCountries() {
        return await this._makeRequest(this.baseUrl, {
            method: "GET",
        });
    }

    /**
     * Get country by ID
     * @param {string} countryId - Country UUID
     * @returns {Promise<Object>} API response with country data
     */
    async getCountryById(countryId) {
        if (!countryId) {
            return {
                success: false,
                error: "Country ID is required",
            };
        }

        return await this._makeRequest(`${this.baseUrl}/${countryId}`, {
            method: "GET",
        });
    }

    /**
     * Create new country
     * @param {Object} countryData - Country data
     * @param {string} countryData.name - Country name
     * @param {string} countryData.code - ISO country code
     * @param {string} countryData.phone_code - Phone code with + prefix
     * @param {string} countryData.region - Geographic region
     * @returns {Promise<Object>} API response with created country
     */
    async createCountry(countryData) {
        if (!countryData || !countryData.name) {
            return {
                success: false,
                error: "Country name is required",
            };
        }

        console.log("Creating country with data:", countryData);

        return await this._makeRequest(this.baseUrl, {
            method: "POST",
            body: JSON.stringify(countryData),
        });
    }

    /**
     * Update existing country
     * @param {string} countryId - Country UUID
     * @param {Object} countryData - Updated country data
     * @returns {Promise<Object>} API response with updated country
     */
    async updateCountry(countryId, countryData) {
        if (!countryId) {
            return {
                success: false,
                error: "Country ID is required",
            };
        }

        console.log("Updating country:", countryId, "with data:", countryData);

        return await this._makeRequest(`${this.baseUrl}/${countryId}`, {
            method: "PUT",
            body: JSON.stringify(countryData),
        });
    }

    /**
     * Delete country
     * @param {string} countryId - Country UUID
     * @returns {Promise<Object>} API response confirming deletion
     */
    async deleteCountry(countryId) {
        if (!countryId) {
            return {
                success: false,
                error: "Country ID is required",
            };
        }

        console.log("Deleting country:", countryId);

        return await this._makeRequest(`${this.baseUrl}/${countryId}`, {
            method: "DELETE",
        });
    }
}

// Create singleton instance
let serviceInstance = null;

/**
 * Get service instance
 * @returns {CountryService} CountryService instance
 */
export const getCountryService = () => {
    if (!serviceInstance) {
        serviceInstance = new CountryService();
    }
    return serviceInstance;
};

export default getCountryService();
