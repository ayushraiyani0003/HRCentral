/**
 * @fileoverview Client-side service for Salutation API operations
 * @version 1.0.0
 */

/**
 * SalutationService - Handles all client-side operations for Salutation API
 * Base URL: /api/salutation
 */
class SalutationService {
    /**
     * Base API URL for salutation endpoints
     * @private
     * @static
     * @type {string}
     */
    static BASE_URL = "/api/salutation";

    /**
     * Default headers for API requests
     * @private
     * @static
     * @type {Object}
     */
    static DEFAULT_HEADERS = {
        "Content-Type": "application/json",
    };

    /**
     * Handle API response and error checking
     * @private
     * @static
     * @param {Response} response - Fetch response object
     * @returns {Promise<Object>} Parsed JSON response
     * @throws {Error} API error with status and message
     */
    static async handleResponse(response) {
        const data = await response.json();

        if (!response.ok) {
            const error = new Error(
                data.message ||
                    `HTTP ${response.status}: ${response.statusText}`
            );
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    }

    /**
     * Create a new salutation
     * @static
     * @param {Object} salutationData - Salutation data
     * @param {string} salutationData.name - Salutation name (required, max 100 characters)
     * @returns {Promise<Object>} Created salutation object
     * @throws {Error} 400 - Bad request (validation error)
     * @throws {Error} 409 - Conflict (name already exists)
     * @example
     * const newSalutation = await SalutationService.createSalutation({ name: 'Dr.' });
     */
    static async createSalutation(salutationData) {
        try {
            const response = await fetch(this.BASE_URL, {
                method: "POST",
                headers: this.DEFAULT_HEADERS,
                body: JSON.stringify(salutationData),
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error("Error creating salutation:", error);
            throw error;
        }
    }

    /**
     * Get all salutations with pagination
     * @static
     * @param {Object} [params={}] - Query parameters
     * @param {number} [params.page] - Page number for pagination
     * @param {number} [params.limit] - Number of items per page
     * @param {string} [params.search] - Search term for filtering
     * @param {string} [params.sortBy] - Field to sort by
     * @param {string} [params.sortOrder] - Sort order (asc/desc)
     * @returns {Promise<Object>} List of salutations with pagination info
     * @throws {Error} 400 - Bad request (invalid parameters)
     * @throws {Error} 500 - Internal server error
     * @example
     * const salutations = await SalutationService.getAllSalutations({ page: 1, limit: 10 });
     */
    static async getAllSalutations(params = {}) {
        try {
            const queryString = new URLSearchParams(
                Object.entries(params).filter(
                    ([_, value]) => value !== undefined && value !== null
                )
            ).toString();

            const url = queryString
                ? `${this.BASE_URL}?${queryString}`
                : this.BASE_URL;

            const response = await fetch(url, {
                method: "GET",
                headers: this.DEFAULT_HEADERS,
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error("Error fetching salutations:", error);
            throw error;
        }
    }

    /**
     * Get a specific salutation by ID
     * @static
     * @param {string} id - Salutation UUID
     * @returns {Promise<Object>} Salutation object
     * @throws {Error} 400 - Bad request (invalid UUID)
     * @throws {Error} 404 - Salutation not found
     * @throws {Error} 500 - Internal server error
     * @example
     * const salutation = await SalutationService.getSalutationById('123e4567-e89b-12d3-a456-426614174000');
     */
    static async getSalutationById(id) {
        try {
            if (!id) {
                throw new Error("Salutation ID is required");
            }

            const response = await fetch(`${this.BASE_URL}/${id}`, {
                method: "GET",
                headers: this.DEFAULT_HEADERS,
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error(`Error fetching salutation with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Update a salutation by ID
     * @static
     * @param {string} id - Salutation UUID
     * @param {Object} salutationData - Updated salutation data
     * @param {string} salutationData.name - Salutation name (required, max 100 characters)
     * @returns {Promise<Object>} Updated salutation object
     * @throws {Error} 400 - Bad request (validation error or invalid UUID)
     * @throws {Error} 404 - Salutation not found
     * @throws {Error} 409 - Conflict (name already exists)
     * @throws {Error} 500 - Internal server error
     * @example
     * const updatedSalutation = await SalutationService.updateSalutation('123e4567-e89b-12d3-a456-426614174000', { name: 'Prof.' });
     */
    static async updateSalutation(id, salutationData) {
        try {
            if (!id) {
                throw new Error("Salutation ID is required");
            }

            const response = await fetch(`${this.BASE_URL}/${id}`, {
                method: "PUT",
                headers: this.DEFAULT_HEADERS,
                body: JSON.stringify(salutationData),
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error(`Error updating salutation with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Delete a salutation by ID
     * @static
     * @param {string} id - Salutation UUID
     * @returns {Promise<Object>} Deletion success message
     * @throws {Error} 400 - Bad request (invalid UUID)
     * @throws {Error} 404 - Salutation not found
     * @throws {Error} 500 - Internal server error
     * @example
     * const result = await SalutationService.deleteSalutation('123e4567-e89b-12d3-a456-426614174000');
     */
    static async deleteSalutation(id) {
        try {
            if (!id) {
                throw new Error("Salutation ID is required");
            }

            const response = await fetch(`${this.BASE_URL}/${id}`, {
                method: "DELETE",
                headers: this.DEFAULT_HEADERS,
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error(`Error deleting salutation with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Check if a salutation name already exists
     * @static
     * @param {string} name - Salutation name to check
     * @returns {Promise<boolean>} True if name exists, false otherwise
     * @example
     * const exists = await SalutationService.checkSalutationExists('Dr.');
     */
    static async checkSalutationExists(name) {
        try {
            const salutations = await this.getAllSalutations({ search: name });
            return salutations.data.some(
                (salutation) =>
                    salutation.name.toLowerCase() === name.toLowerCase()
            );
        } catch (error) {
            console.error("Error checking salutation existence:", error);
            throw error;
        }
    }

    /**
     * Validate salutation data before sending to API
     * @static
     * @param {Object} salutationData - Salutation data to validate
     * @param {string} salutationData.name - Salutation name
     * @returns {Object} Validation result with isValid and errors
     * @example
     * const validation = SalutationService.validateSalutationData({ name: 'Dr.' });
     */
    static validateSalutationData(salutationData) {
        const errors = [];

        if (!salutationData.name) {
            errors.push("Salutation name is required");
        } else if (typeof salutationData.name !== "string") {
            errors.push("Salutation name must be a string");
        } else if (salutationData.name.trim().length === 0) {
            errors.push("Salutation name cannot be empty");
        } else if (salutationData.name.length > 100) {
            errors.push("Salutation name cannot exceed 100 characters");
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }
}

export default SalutationService;
