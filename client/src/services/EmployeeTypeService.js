/**
 * EmployeeTypeService.js
 * Client-side service for handling Employee Type API requests
 */

class EmployeeTypeService {
    constructor(baseURL = "/api") {
        this.baseURL = baseURL;
        this.endpoint = `${this.baseURL}/employee-types`;
    }

    /**
     * Generic request handler with error handling
     * @param {string} url - The URL to make the request to
     * @param {object} options - Fetch options
     * @returns {Promise<object>} - Response data
     */
    async makeRequest(url, options = {}) {
        try {
            const defaultOptions = {
                headers: {
                    "Content-Type": "application/json",
                    // Add authorization header if token exists
                    ...(this.getAuthToken() && {
                        Authorization: `Bearer ${this.getAuthToken()}`,
                    }),
                    ...options.headers,
                },
            };

            const response = await fetch(url, {
                ...defaultOptions,
                ...options,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                        `HTTP error! status: ${response.status}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error("API Request Error:", error);
            throw error;
        }
    }

    /**
     * Get authentication token from localStorage or sessionStorage
     * @returns {string|null} - Auth token
     */
    getAuthToken() {
        // Adjust this based on where you store your auth token
        return (
            localStorage.getItem("authToken") ||
            sessionStorage.getItem("authToken")
        );
    }

    /**
     * Create a new employee type
     * @param {object} employeeTypeData - Employee type data
     * @param {string} employeeTypeData.name - Name of the employee type
     * @returns {Promise<object>} - Created employee type data
     *
     * @example
     * const newEmployeeType = await employeeTypeService.createEmployeeType({ name: 'Full-time' });
     */
    async createEmployeeType(employeeTypeData) {
        if (!employeeTypeData || !employeeTypeData.name) {
            throw new Error("Employee type name is required");
        }

        const response = await this.makeRequest(this.endpoint, {
            method: "POST",
            body: JSON.stringify(employeeTypeData),
        });

        return response;
    }

    /**
     * Get all employee types
     * @returns {Promise<object>} - List of all employee types
     *
     * @example
     * const employeeTypes = await employeeTypeService.getAllEmployeeTypes();
     */
    async getAllEmployeeTypes() {
        const response = await this.makeRequest(this.endpoint, {
            method: "GET",
        });

        return response;
    }

    /**
     * Get employee type by ID
     * @param {string} id - UUID of the employee type
     * @returns {Promise<object>} - Employee type data
     *
     * @example
     * const employeeType = await employeeTypeService.getEmployeeTypeById('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
     */
    async getEmployeeTypeById(id) {
        if (!id) {
            throw new Error("Employee type ID is required");
        }

        const response = await this.makeRequest(`${this.endpoint}/${id}`, {
            method: "GET",
        });

        return response;
    }

    /**
     * Update employee type by ID
     * @param {string} id - UUID of the employee type
     * @param {object} updateData - Data to update
     * @param {string} updateData.name - Updated name of the employee type
     * @returns {Promise<object>} - Updated employee type data
     *
     * @example
     * const updatedEmployeeType = await employeeTypeService.updateEmployeeType('a1b2c3d4-e5f6-7890-abcd-ef1234567890', { name: 'Part-time' });
     */
    async updateEmployeeType(id, updateData) {
        if (!id) {
            throw new Error("Employee type ID is required");
        }
        if (!updateData || !updateData.name) {
            throw new Error("Employee type name is required for update");
        }

        const response = await this.makeRequest(`${this.endpoint}/${id}`, {
            method: "PUT",
            body: JSON.stringify(updateData),
        });

        return response;
    }

    /**
     * Delete employee type by ID
     * @param {string} id - UUID of the employee type
     * @returns {Promise<object>} - Deletion confirmation
     *
     * @example
     * const result = await employeeTypeService.deleteEmployeeType('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
     */
    async deleteEmployeeType(id) {
        if (!id) {
            throw new Error("Employee type ID is required");
        }

        const response = await this.makeRequest(`${this.endpoint}/${id}`, {
            method: "DELETE",
        });

        return response;
    }

    /**
     * Check if employee type exists by name
     * @param {string} name - Name to check
     * @returns {Promise<boolean>} - True if exists, false otherwise
     *
     * @example
     * const exists = await employeeTypeService.employeeTypeExists('Full-time');
     */
    async employeeTypeExists(name) {
        try {
            const response = await this.getAllEmployeeTypes();
            const employeeTypes = response.data || [];
            return employeeTypes.some(
                (type) => type.name.toLowerCase() === name.toLowerCase()
            );
        } catch (error) {
            console.error("Error checking employee type existence:", error);
            return false;
        }
    }

    /**
     * Search employee types by name (client-side filtering)
     * @param {string} searchTerm - Search term
     * @returns {Promise<Array>} - Filtered employee types
     *
     * @example
     * const searchResults = await employeeTypeService.searchEmployeeTypes('time');
     */
    async searchEmployeeTypes(searchTerm) {
        try {
            const response = await this.getAllEmployeeTypes();
            const employeeTypes = response.data || [];

            if (!searchTerm) return employeeTypes;

            return employeeTypes.filter((type) =>
                type.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } catch (error) {
            console.error("Error searching employee types:", error);
            throw error;
        }
    }
}

// Create and export a singleton instance
const employeeTypeService = new EmployeeTypeService();

// Export both the class and the instance
export { EmployeeTypeService, employeeTypeService };

/**
 * Usage Examples:
 *
 * // Import the service
 * import { employeeTypeService } from './services/EmployeeTypeService.js';
 *
 * // Create a new employee type
 * try {
 *   const newEmployeeType = await employeeTypeService.createEmployeeType({ name: 'Full-time' });
 *   console.log('Created:', newEmployeeType.data);
 * } catch (error) {
 *   console.error('Failed to create employee type:', error.message);
 * }
 *
 * // Get all employee types
 * try {
 *   const allTypes = await employeeTypeService.getAllEmployeeTypes();
 *   console.log('All employee types:', allTypes.data);
 * } catch (error) {
 *   console.error('Failed to fetch employee types:', error.message);
 * }
 *
 * // Get specific employee type
 * try {
 *   const employeeType = await employeeTypeService.getEmployeeTypeById('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
 *   console.log('Employee type:', employeeType.data);
 * } catch (error) {
 *   console.error('Failed to fetch employee type:', error.message);
 * }
 *
 * // Update employee type
 * try {
 *   const updated = await employeeTypeService.updateEmployeeType('a1b2c3d4-e5f6-7890-abcd-ef1234567890', { name: 'Part-time' });
 *   console.log('Updated:', updated.data);
 * } catch (error) {
 *   console.error('Failed to update employee type:', error.message);
 * }
 *
 * // Delete employee type
 * try {
 *   const result = await employeeTypeService.deleteEmployeeType('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
 *   console.log('Deleted:', result.message);
 * } catch (error) {
 *   console.error('Failed to delete employee type:', error.message);
 * }
 *
 * // Search employee types
 * try {
 *   const searchResults = await employeeTypeService.searchEmployeeTypes('time');
 *   console.log('Search results:', searchResults);
 * } catch (error) {
 *   console.error('Search failed:', error.message);
 * }
 *
 * // Check if employee type exists
 * try {
 *   const exists = await employeeTypeService.employeeTypeExists('Full-time');
 *   console.log('Employee type exists:', exists);
 * } catch (error) {
 *   console.error('Check failed:', error.message);
 * }
 */
