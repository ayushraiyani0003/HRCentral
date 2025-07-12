/**
 * @fileoverview Client-side service for Bank List API operations
 * @version 1.0.0
 */

class BankListService {
    constructor(baseURL = "/api/bank-list") {
        this.baseURL = baseURL;
    }

    /**
     * Make HTTP request with error handling
     * @param {string} url - Request URL
     * @param {Object} options - Fetch options
     * @returns {Promise<Object>} Response data
     */
    async _makeRequest(url, options = {}) {
        try {
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers,
                },
                ...options,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || `HTTP error! status: ${response.status}`
                );
            }

            return data;
        } catch (error) {
            throw new Error(`Request failed: ${error.message}`);
        }
    }

    /**
     * Create a new bank
     * @param {Object} bankData - Bank data
     * @param {string} bankData.name - Bank name (required, max 100 characters)
     * @returns {Promise<Object>} Created bank
     */
    async createBank(bankData) {
        return await this._makeRequest(this.baseURL, {
            method: "POST",
            body: JSON.stringify(bankData),
        });
    }

    /**
     * Get all banks - if options is empty/null, get all data without pagination
     * @param {Object} options - Query options (optional)
     * @param {number} options.limit - Number of records to return (default: 10, max: 100)
     * @param {number} options.offset - Number of records to skip (default: 0)
     * @param {string} options.orderBy - Field to order by: id, name, created_at, updated_at
     * @param {string} options.orderDirection - Order direction ASC/DESC
     * @returns {Promise<Object>} List of banks with or without pagination info
     */
    async getAllBanks(options = {}) {
        // Check if options is empty/null or has no meaningful values
        const hasOptions =
            options &&
            (options.limit !== undefined ||
                options.offset !== undefined ||
                options.orderBy ||
                options.orderDirection);

        if (!hasOptions) {
            // Simple request to get all data without query parameters
            return await this._makeRequest(this.baseURL);
        }

        // Build query parameters only if options are provided
        const queryParams = new URLSearchParams();

        if (options.limit !== undefined)
            queryParams.append("limit", options.limit);
        if (options.offset !== undefined)
            queryParams.append("offset", options.offset);
        if (options.orderBy) queryParams.append("orderBy", options.orderBy);
        if (options.orderDirection)
            queryParams.append("orderDirection", options.orderDirection);

        const url = `${this.baseURL}?${queryParams.toString()}`;
        return await this._makeRequest(url);
    }

    /**
     * Get a specific bank by ID
     * @param {string} id - Bank UUID
     * @returns {Promise<Object>} Bank object
     */
    async getBankById(id) {
        if (!id) {
            throw new Error("Bank ID is required");
        }
        return await this._makeRequest(`${this.baseURL}/${id}`);
    }

    /**
     * Update a bank by ID
     * @param {string} id - Bank UUID
     * @param {Object} bankData - Updated bank data
     * @param {string} bankData.name - Bank name (required, max 100 characters)
     * @returns {Promise<Object>} Updated bank object
     */
    async updateBank(id, bankData) {
        if (!id) {
            throw new Error("Bank ID is required");
        }
        return await this._makeRequest(`${this.baseURL}/${id}`, {
            method: "PUT",
            body: JSON.stringify(bankData),
        });
    }

    /**
     * Delete a bank by ID
     * @param {string} id - Bank UUID
     * @returns {Promise<Object>} Deletion success message
     */
    async deleteBank(id) {
        if (!id) {
            throw new Error("Bank ID is required");
        }
        return await this._makeRequest(`${this.baseURL}/${id}`, {
            method: "DELETE",
        });
    }

    /**
     * Get bank by name (case-insensitive)
     * @param {string} name - Bank name
     * @returns {Promise<Object>} Bank object
     */
    async getBankByName(name) {
        if (!name || !name.trim()) {
            throw new Error("Bank name is required");
        }
        return await this._makeRequest(
            `${this.baseURL}/name/${encodeURIComponent(name.trim())}`
        );
    }

    /**
     * Check if bank exists by name
     * @param {string} name - Bank name to check
     * @returns {Promise<Object>} Existence status
     */
    async checkBankExistsByName(name) {
        if (!name || !name.trim()) {
            throw new Error("Bank name is required");
        }
        return await this._makeRequest(
            `${this.baseURL}/exists/name/${encodeURIComponent(name.trim())}`
        );
    }

    /**
     * Check if bank exists by ID
     * @param {string} id - Bank UUID to check
     * @returns {Promise<Object>} Existence status
     */
    async checkBankExistsById(id) {
        if (!id) {
            throw new Error("Bank ID is required");
        }
        return await this._makeRequest(`${this.baseURL}/exists/id/${id}`);
    }

    /**
     * Search banks by name (partial match, case-insensitive)
     * @param {string} searchTerm - Search term for bank name
     * @param {Object} options - Query options (optional)
     * @param {number} options.limit - Number of records to return (default: 10, max: 100)
     * @param {number} options.offset - Number of records to skip (default: 0)
     * @returns {Promise<Object>} List of matching banks with pagination info
     */
    async searchBanks(searchTerm, options = {}) {
        if (!searchTerm || !searchTerm.trim()) {
            throw new Error("Search term is required");
        }

        const queryParams = new URLSearchParams();
        queryParams.append("q", searchTerm.trim());

        // Only add pagination if options are provided
        if (options.limit !== undefined)
            queryParams.append("limit", options.limit);
        if (options.offset !== undefined)
            queryParams.append("offset", options.offset);

        const url = `${this.baseURL}/search?${queryParams.toString()}`;
        return await this._makeRequest(url);
    }

    /**
     * Get all banks sorted by name (for dropdown lists) - always returns all data
     * @returns {Promise<Object>} List of all banks sorted by name
     */
    async getAllBanksSorted() {
        return await this._makeRequest(`${this.baseURL}/sorted`);
    }

    /**
     * Get total count of banks
     * @returns {Promise<Object>} Banks count
     */
    async getBanksCount() {
        return await this._makeRequest(`${this.baseURL}/count`);
    }

    /**
     * Bulk create banks
     * @param {Array} banksData - Array of bank objects
     * @param {string} banksData[].name - Bank name (required, max 100 characters)
     * @returns {Promise<Object>} Created banks array
     */
    async bulkCreateBanks(banksData) {
        if (!Array.isArray(banksData) || banksData.length === 0) {
            throw new Error("Banks data must be a non-empty array");
        }
        return await this._makeRequest(`${this.baseURL}/bulk`, {
            method: "POST",
            body: JSON.stringify({ banks: banksData }),
        });
    }

    /**
     * Validate bank name on client side
     * @param {string} name - Bank name to validate
     * @returns {Object} Validation result
     */
    validateBankName(name) {
        const errors = [];

        if (!name || !name.trim()) {
            errors.push("Bank name is required and cannot be empty");
        } else if (name.trim().length > 100) {
            errors.push("Bank name cannot exceed 100 characters");
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    /**
     * Validate UUID format on client side
     * @param {string} uuid - UUID string to validate
     * @returns {boolean} True if valid UUID, false otherwise
     */
    isValidUUID(uuid) {
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }

    /**
     * Format bank data for display
     * @param {Object} bank - Bank object
     * @returns {Object} Formatted bank object
     */
    formatBankForDisplay(bank) {
        return {
            ...bank,
            displayName: bank.name,
            createdAt: new Date(bank.created_at).toLocaleDateString(),
            updatedAt: new Date(bank.updated_at).toLocaleDateString(),
        };
    }

    /**
     * Format multiple banks for display
     * @param {Array} banks - Array of bank objects
     * @returns {Array} Array of formatted bank objects
     */
    formatBanksForDisplay(banks) {
        return banks.map((bank) => this.formatBankForDisplay(bank));
    }
}

export default BankListService;

// Usage Examples:
/*
// Initialize the service
const bankService = new BankListService();

// Get ALL banks without any parameters (no pagination)
try {
    const result = await bankService.getAllBanks(); // Simple GET /api/bank-list
    console.log('All Banks:', result.data);
} catch (error) {
    console.error('Error fetching all banks:', error.message);
}

// Get ALL banks with empty options (no pagination)
try {
    const result = await bankService.getAllBanks({}); // Simple GET /api/bank-list
    console.log('All Banks:', result.data);
} catch (error) {
    console.error('Error fetching all banks:', error.message);
}

// Get banks WITH pagination (when options are provided)
try {
    const result = await bankService.getAllBanks({
        limit: 20,
        offset: 0,
        orderBy: 'name',
        orderDirection: 'ASC'
    }); // GET /api/bank-list?limit=20&offset=0&orderBy=name&orderDirection=ASC
    console.log('Paginated Banks:', result.data);
    console.log('Pagination:', result.pagination);
} catch (error) {
    console.error('Error fetching paginated banks:', error.message);
}

// Create a new bank
try {
    const result = await bankService.createBank({ name: 'Chase Bank' });
    console.log('Bank created:', result.data);
} catch (error) {
    console.error('Error creating bank:', error.message);
}

// Search banks (with or without pagination)
try {
    const result = await bankService.searchBanks('Chase'); // All results
    console.log('Search results:', result.data);
} catch (error) {
    console.error('Error searching banks:', error.message);
}

// Search banks with pagination
try {
    const result = await bankService.searchBanks('Chase', { limit: 10 });
    console.log('Paginated search results:', result.data);
} catch (error) {
    console.error('Error searching banks:', error.message);
}

// Get bank by ID
try {
    const result = await bankService.getBankById('123e4567-e89b-12d3-a456-426614174000');
    console.log('Bank:', result.data);
} catch (error) {
    console.error('Error fetching bank:', error.message);
}

// Update bank
try {
    const result = await bankService.updateBank('123e4567-e89b-12d3-a456-426614174000', {
        name: 'Updated Bank Name'
    });
    console.log('Updated bank:', result.data);
} catch (error) {
    console.error('Error updating bank:', error.message);
}

// Delete bank
try {
    const result = await bankService.deleteBank('123e4567-e89b-12d3-a456-426614174000');
    console.log('Bank deleted:', result.message);
} catch (error) {
    console.error('Error deleting bank:', error.message);
}

// Get all banks sorted (always returns all data)
try {
    const result = await bankService.getAllBanksSorted();
    console.log('Sorted banks:', result.data);
} catch (error) {
    console.error('Error fetching sorted banks:', error.message);
}
*/
