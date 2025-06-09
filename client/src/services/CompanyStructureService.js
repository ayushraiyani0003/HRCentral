/**
 * @fileoverview Client-side service for Company Structure API
 * @version 1.0.0
 */

/**
 * Company Structure Service for client-side API interactions
 * Handles all HTTP requests to the company structure endpoints
 */
class CompanyStructureService {
    /**
     * Create a new CompanyStructureService instance
     * @param {string} baseUrl - Base URL for the API (default: '/api/company-structure')
     */
    constructor(baseUrl = "/api/company-structure") {
        this.baseUrl = baseUrl;
        this.headers = {
            "Content-Type": "application/json",
        };
    }

    /**
     * Set authorization header for authenticated requests
     * @param {string} token - Authorization token
     */
    setAuthToken(token) {
        if (token) {
            this.headers["Authorization"] = `Bearer ${token}`;
        } else {
            delete this.headers["Authorization"];
        }
    }

    /**
     * Handle HTTP response and return parsed data
     * @param {Response} response - Fetch response object
     * @returns {Promise<Object>} Parsed response data
     * @throws {Error} If response is not ok
     */
    async handleResponse(response) {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP Error: ${response.status}`);
        }

        return data;
    }

    /**
     * Build query string from parameters object
     * @param {Object} params - Query parameters
     * @returns {string} Query string
     */
    buildQueryString(params) {
        if (!params || Object.keys(params).length === 0) {
            return "";
        }

        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, value.toString());
            }
        });

        return searchParams.toString() ? `?${searchParams.toString()}` : "";
    }

    // ==============================
    // Basic CRUD Operations
    // ==============================

    /**
     * Create a new company structure entity
     * @param {Object} data - Company structure data
     * @returns {Promise<Object>} Created company structure
     */
    async create(data) {
        try {
            const response = await fetch(this.baseUrl, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify(data),
            });

            return await this.handleResponse(response);
        } catch (error) {
            throw new Error(
                `Failed to create company structure: ${error.message}`
            );
        }
    }

    /**
     * Get all company structure entities
     * @param {Object} options - Query options
     * @param {number} options.limit - Limit number of results
     * @param {number} options.offset - Offset for pagination
     * @param {boolean} options.includeCountry - Include country data
     * @param {string} options.country_id - Filter by country ID
     * @param {string} options.region - Filter by region
     * @returns {Promise<Object>} List of company structures
     */
    async getAll(options = {}) {
        try {
            const queryString = this.buildQueryString(options);
            const response = await fetch(`${this.baseUrl}${queryString}`, {
                method: "GET",
                headers: this.headers,
            });

            return await this.handleResponse(response);
        } catch (error) {
            throw new Error(
                `Failed to get company structures: ${error.message}`
            );
        }
    }

    /**
     * Get company structure by ID
     * @param {string} id - Company structure ID
     * @param {boolean} includeCountry - Include country data
     * @returns {Promise<Object>} Company structure data
     */
    async getById(id, includeCountry = false) {
        try {
            const queryString = includeCountry ? "?includeCountry=true" : "";
            const response = await fetch(
                `${this.baseUrl}/${id}${queryString}`,
                {
                    method: "GET",
                    headers: this.headers,
                }
            );

            return await this.handleResponse(response);
        } catch (error) {
            throw new Error(
                `Failed to get company structure: ${error.message}`
            );
        }
    }

    /**
     * Update company structure by ID
     * @param {string} id - Company structure ID
     * @param {Object} data - Updated data
     * @returns {Promise<Object>} Updated company structure
     */
    async update(id, data) {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: "PUT",
                headers: this.headers,
                body: JSON.stringify(data),
            });

            return await this.handleResponse(response);
        } catch (error) {
            throw new Error(
                `Failed to update company structure: ${error.message}`
            );
        }
    }

    /**
     * Delete company structure by ID
     * @param {string} id - Company structure ID
     * @returns {Promise<Object>} Delete confirmation
     */
    async delete(id) {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: "DELETE",
                headers: this.headers,
            });

            return await this.handleResponse(response);
        } catch (error) {
            throw new Error(
                `Failed to delete company structure: ${error.message}`
            );
        }
    }

    // ==============================
    // Hierarchical Operations
    // ==============================

    /**
     * Get hierarchical structure for a specific entity
     * @param {string} id - Entity ID
     * @param {boolean} includeCountry - Include country data
     * @returns {Promise<Object>} Hierarchical structure
     */
    async getHierarchy(id, includeCountry = false) {
        try {
            const queryString = includeCountry ? "?includeCountry=true" : "";
            const response = await fetch(
                `${this.baseUrl}/hierarchy/${id}${queryString}`,
                {
                    method: "GET",
                    headers: this.headers,
                }
            );

            return await this.handleResponse(response);
        } catch (error) {
            throw new Error(`Failed to get hierarchy: ${error.message}`);
        }
    }

    /**
     * Get complete company structure tree
     * @param {boolean} includeCountry - Include country data
     * @returns {Promise<Object>} Company tree structure
     */
    async getTree(includeCountry = false) {
        try {
            const queryString = includeCountry ? "?includeCountry=true" : "";
            const response = await fetch(`${this.baseUrl}/tree${queryString}`, {
                method: "GET",
                headers: this.headers,
            });

            return await this.handleResponse(response);
        } catch (error) {
            throw new Error(`Failed to get company tree: ${error.message}`);
        }
    }

    /**
     * Get all direct children of a parent entity
     * @param {string} parentId - Parent entity ID
     * @param {boolean} includeCountry - Include country data
     * @returns {Promise<Object>} List of children entities
     */
    async getChildren(parentId, includeCountry = false) {
        try {
            const queryString = includeCountry ? "?includeCountry=true" : "";
            const response = await fetch(
                `${this.baseUrl}/children/${parentId}${queryString}`,
                {
                    method: "GET",
                    headers: this.headers,
                }
            );

            return await this.handleResponse(response);
        } catch (error) {
            throw new Error(`Failed to get children: ${error.message}`);
        }
    }

    /**
     * Get all ancestors of a specific entity
     * @param {string} id - Entity ID
     * @param {boolean} includeCountry - Include country data
     * @returns {Promise<Object>} List of ancestor entities
     */
    async getAncestors(id, includeCountry = false) {
        try {
            const queryString = includeCountry ? "?includeCountry=true" : "";
            const response = await fetch(
                `${this.baseUrl}/ancestors/${id}${queryString}`,
                {
                    method: "GET",
                    headers: this.headers,
                }
            );

            return await this.handleResponse(response);
        } catch (error) {
            throw new Error(`Failed to get ancestors: ${error.message}`);
        }
    }

    /**
     * Move an entity to a different parent
     * @param {string} id - Entity ID to move
     * @param {string} newParentId - New parent ID
     * @param {Object} additionalData - Additional data for the move
     * @returns {Promise<Object>} Moved entity data
     */
    async moveEntity(id, newParentId, additionalData = {}) {
        try {
            const data = {
                newParentId,
                ...additionalData,
            };

            const response = await fetch(`${this.baseUrl}/${id}/move`, {
                method: "PUT",
                headers: this.headers,
                body: JSON.stringify(data),
            });

            return await this.handleResponse(response);
        } catch (error) {
            throw new Error(`Failed to move entity: ${error.message}`);
        }
    }

    // ==============================
    // Country/Region Operations
    // ==============================

    /**
     * Get company structures by country
     * @param {string} countryId - Country ID
     * @param {Object} options - Query options
     * @param {number} options.limit - Limit number of results
     * @param {number} options.offset - Offset for pagination
     * @returns {Promise<Object>} List of company structures by country
     */
    async getByCountry(countryId, options = {}) {
        try {
            const queryString = this.buildQueryString(options);
            const response = await fetch(
                `${this.baseUrl}/by-country/${countryId}${queryString}`,
                {
                    method: "GET",
                    headers: this.headers,
                }
            );

            return await this.handleResponse(response);
        } catch (error) {
            throw new Error(
                `Failed to get structures by country: ${error.message}`
            );
        }
    }

    /**
     * Get company structures by region
     * @param {string} region - Region name
     * @param {Object} options - Query options
     * @param {number} options.limit - Limit number of results
     * @param {number} options.offset - Offset for pagination
     * @returns {Promise<Object>} List of company structures by region
     */
    async getByRegion(region, options = {}) {
        try {
            const queryString = this.buildQueryString(options);
            const response = await fetch(
                `${this.baseUrl}/by-region/${region}${queryString}`,
                {
                    method: "GET",
                    headers: this.headers,
                }
            );

            return await this.handleResponse(response);
        } catch (error) {
            throw new Error(
                `Failed to get structures by region: ${error.message}`
            );
        }
    }

    /**
     * Get country statistics for company structures
     * @returns {Promise<Object>} Country statistics
     */
    async getCountryStats() {
        try {
            const response = await fetch(`${this.baseUrl}/stats/countries`, {
                method: "GET",
                headers: this.headers,
            });

            return await this.handleResponse(response);
        } catch (error) {
            throw new Error(
                `Failed to get country statistics: ${error.message}`
            );
        }
    }
}

export default CompanyStructureService;
