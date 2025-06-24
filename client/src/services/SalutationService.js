/**
 * @fileoverview Client-side service for Salutation API operations
 * @version 1.0.0
 */

class SalutationService {
    constructor(baseURL = "/api") {
        this.baseURL = baseURL;
        this.endpoint = `${baseURL}/salutation`;
    }

    /**
     * Helper method to handle API requests
     * @private
     */
    async _request(url, options = {}) {
        const config = {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || `HTTP error! status: ${response.status}`
                );
            }

            return {
                success: true,
                data,
                status: response.status,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                status: error.status || 500,
            };
        }
    }

    /**
     * Create a new salutation
     * @param {Object} salutation - Salutation object
     * @param {string} salutation.name - Salutation name (required, max 100 characters)
     * @returns {Promise<Object>} API response with created salutation
     */
    async createSalutation(salutation) {
        return await this._request(this.endpoint, {
            method: "POST",
            body: JSON.stringify(salutation),
        });
    }

    /**
     * Get all salutations with pagination and filtering
     * @param {Object} params - Query parameters
     * @param {number} params.limit - Number of records to return (default: 10, max: 100)
     * @param {number} params.offset - Number of records to skip (default: 0)
     * @param {string} params.orderBy - Field to order by: id, name, createdAt, updatedAt
     * @param {string} params.orderDirection - Order direction ASC/DESC
     * @returns {Promise<Object>} API response with salutations list and pagination info
     */
    async getAllSalutations(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString
            ? `${this.endpoint}?${queryString}`
            : this.endpoint;

        return await this._request(url, {
            method: "GET",
        });
    }

    /**
     * Search salutations by name
     * @param {string} searchTerm - Search term for salutation name (required)
     * @param {Object} params - Additional query parameters
     * @param {number} params.limit - Number of records to return
     * @param {number} params.offset - Number of records to skip
     * @returns {Promise<Object>} API response with matching salutations
     */
    async searchSalutations(searchTerm, params = {}) {
        const queryParams = {
            q: searchTerm,
            ...params,
        };
        const queryString = new URLSearchParams(queryParams).toString();

        return await this._request(`${this.endpoint}/search?${queryString}`, {
            method: "GET",
        });
    }

    /**
     * Get all salutations sorted by name (for dropdown lists)
     * @returns {Promise<Object>} API response with sorted salutations
     */
    async getAllSalutationsSorted() {
        return await this._request(`${this.endpoint}/sorted`, {
            method: "GET",
        });
    }

    /**
     * Get total count of salutations
     * @returns {Promise<Object>} API response with salutations count
     */
    async getSalutationsCount() {
        return await this._request(`${this.endpoint}/count`, {
            method: "GET",
        });
    }

    /**
     * Bulk create salutations
     * @param {Array} salutations - Array of salutation objects
     * @returns {Promise<Object>} API response with created salutations
     */
    async bulkCreateSalutations(salutations) {
        return await this._request(`${this.endpoint}/bulk`, {
            method: "POST",
            body: JSON.stringify({ salutations }),
        });
    }

    /**
     * Check if salutation exists by name
     * @param {string} name - Salutation name to check
     * @returns {Promise<Object>} API response with existence status
     */
    async checkSalutationExistsByName(name) {
        const encodedName = encodeURIComponent(name);
        return await this._request(
            `${this.endpoint}/exists/name/${encodedName}`,
            {
                method: "GET",
            }
        );
    }

    /**
     * Check if salutation exists by ID
     * @param {string} id - Salutation UUID to check
     * @returns {Promise<Object>} API response with existence status
     */
    async checkSalutationExistsById(id) {
        return await this._request(`${this.endpoint}/exists/id/${id}`, {
            method: "GET",
        });
    }

    /**
     * Get salutation by name (case-insensitive)
     * @param {string} name - Salutation name
     * @returns {Promise<Object>} API response with salutation object
     */
    async getSalutationByName(name) {
        const encodedName = encodeURIComponent(name);
        return await this._request(`${this.endpoint}/name/${encodedName}`, {
            method: "GET",
        });
    }

    /**
     * Get a specific salutation by ID
     * @param {string} id - Salutation UUID
     * @returns {Promise<Object>} API response with salutation object
     */
    async getSalutationById(id) {
        return await this._request(`${this.endpoint}/${id}`, {
            method: "GET",
        });
    }

    /**
     * Update a salutation by ID
     * @param {string} id - Salutation UUID
     * @param {Object} salutation - Updated salutation data
     * @param {string} salutation.name - Salutation name (required, max 100 characters)
     * @returns {Promise<Object>} API response with updated salutation
     */
    async updateSalutation(id, salutation) {
        return await this._request(`${this.endpoint}/${id}`, {
            method: "PUT",
            body: JSON.stringify(salutation),
        });
    }

    /**
     * Delete a salutation by ID
     * @param {string} id - Salutation UUID
     * @returns {Promise<Object>} API response with deletion success message
     */
    async deleteSalutation(id) {
        return await this._request(`${this.endpoint}/${id}`, {
            method: "DELETE",
        });
    }
}

// Usage Examples:

// // Initialize the service
// const salutationService = new SalutationService();

// // Create a new salutation
// const createExample = async () => {
//     const result = await salutationService.createSalutation({ name: "Dr." });
//     if (result.success) {
//         console.log('Created:', result.data);
//     } else {
//         console.error('Error:', result.error);
//     }
// };

// // Get all salutations with pagination
// const getAllExample = async () => {
//     const result = await salutationService.getAllSalutations({
//         limit: 20,
//         offset: 0,
//         orderBy: 'name',
//         orderDirection: 'ASC'
//     });
//     if (result.success) {
//         console.log('Salutations:', result.data);
//     }
// };

// // Search salutations
// const searchExample = async () => {
//     const result = await salutationService.searchSalutations('Dr', { limit: 10 });
//     if (result.success) {
//         console.log('Search results:', result.data);
//     }
// };

// // Get sorted salutations for dropdown
// const getSortedExample = async () => {
//     const result = await salutationService.getAllSalutationsSorted();
//     if (result.success) {
//         console.log('Sorted salutations:', result.data);
//     }
// };

// // Update a salutation
// const updateExample = async () => {
//     const result = await salutationService.updateSalutation('uuid-here', { name: "Doctor" });
//     if (result.success) {
//         console.log('Updated:', result.data);
//     }
// };

// Export for module systems

export default SalutationService;
