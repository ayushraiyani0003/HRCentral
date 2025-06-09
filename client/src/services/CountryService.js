// CountryService.js

/**
 * @fileoverview Simple service for handling countries API operations
 * @version 1.0.0
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
            return error;
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

            console.log(`Making ${config.method || "GET"} request to:`, url); // Debug only

            const response = await fetch(url, config);

            if (!response.ok) {
                let errorMessage = `HTTP Error: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage =
                        errorData.message || errorData.error || errorMessage;
                } catch (e) {
                    // Use default error message
                    errorMessage = e.message || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            // console.log("API Response:", data); // Debug only

            return {
                success: true,
                data: data.data,
                pagination: data.pagination,
                count: data.count,
                message: data.message,
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
     * Get all countries with pagination and filtering
     * @param {Object} options - Query options
     * @param {number} options.page - Page number
     * @param {number} options.limit - Records per page
     * @param {string} options.region - Filter by region
     * @param {string} options.search - Search term
     * @param {string} options.sortBy - Sort field
     * @param {string} options.sortOrder - Sort order (ASC/DESC)
     * @returns {Promise<Object>} API response with countries and pagination
     */
    async getAllCountries(options = {}) {
        const queryParams = new URLSearchParams();

        if (options.page) queryParams.append("page", options.page);
        if (options.limit) queryParams.append("limit", options.limit);
        if (options.region) queryParams.append("region", options.region);
        if (options.search) queryParams.append("search", options.search);
        if (options.sortBy) queryParams.append("sortBy", options.sortBy);
        if (options.sortOrder)
            queryParams.append("sortOrder", options.sortOrder);

        const url = queryParams.toString()
            ? `${this.baseUrl}?${queryParams.toString()}`
            : this.baseUrl;

        return await this._makeRequest(url, {
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

    // ==============================
    // Additional Operations
    // ==============================

    /**
     * Get country by country code
     * @param {string} code - ISO country code (2 or 3 letters)
     * @returns {Promise<Object>} API response with country data
     */
    async getCountryByCode(code) {
        if (!code) {
            return {
                success: false,
                error: "Country code is required",
            };
        }

        return await this._makeRequest(`${this.baseUrl}/code/${code}`, {
            method: "GET",
        });
    }

    /**
     * Get all countries by region
     * @param {string} region - Geographic region
     * @param {Object} options - Query options
     * @param {string} options.sortBy - Sort field
     * @param {string} options.sortOrder - Sort order (ASC/DESC)
     * @returns {Promise<Object>} API response with countries array
     */
    async getCountriesByRegion(region, options = {}) {
        if (!region) {
            return {
                success: false,
                error: "Region is required",
            };
        }

        const queryParams = new URLSearchParams();
        if (options.sortBy) queryParams.append("sortBy", options.sortBy);
        if (options.sortOrder)
            queryParams.append("sortOrder", options.sortOrder);

        const url = queryParams.toString()
            ? `${this.baseUrl}/region/${region}?${queryParams.toString()}`
            : `${this.baseUrl}/region/${region}`;

        return await this._makeRequest(url, {
            method: "GET",
        });
    }

    /**
     * Get all unique regions
     * @returns {Promise<Object>} API response with unique regions array
     */
    async getUniqueRegions() {
        return await this._makeRequest(`${this.baseUrl}/regions/unique`, {
            method: "GET",
        });
    }

    /**
     * Get country count by region
     * @returns {Promise<Object>} API response with region counts
     */
    async getCountByRegion() {
        return await this._makeRequest(`${this.baseUrl}/regions/count`, {
            method: "GET",
        });
    }

    /**
     * Bulk create countries
     * @param {Array<Object>} countries - Array of country objects
     * @returns {Promise<Object>} API response with created countries
     */
    async bulkCreateCountries(countries) {
        if (!Array.isArray(countries) || countries.length === 0) {
            return {
                success: false,
                error: "Countries array is required and should not be empty",
            };
        }

        console.log("Bulk creating countries:", countries);

        return await this._makeRequest(`${this.baseUrl}/bulk`, {
            method: "POST",
            body: JSON.stringify({ countries }),
        });
    }

    // ==============================
    // Utility Methods
    // ==============================

    /**
     * Search countries by name
     * @param {string} searchTerm - Search term
     * @param {Object} options - Additional options
     * @returns {Promise<Object>} API response with matching countries
     */
    async searchCountries(searchTerm, options = {}) {
        if (!searchTerm) {
            return {
                success: false,
                error: "Search term is required",
            };
        }

        return await this.getAllCountries({
            search: searchTerm,
            ...options,
        });
    }

    /**
     * Get countries with pagination
     * @param {number} page - Page number
     * @param {number} limit - Records per page
     * @returns {Promise<Object>} API response with paginated countries
     */
    async getCountriesPaginated(page = 1, limit = 10) {
        return await this.getAllCountries({ page, limit });
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
