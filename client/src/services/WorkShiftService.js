/**
 * @fileoverview Frontend service for WorkShift API operations
 * @version 1.0.0
 */

/**
 * WorkShift Frontend Service Class
 * Handles API requests for work shift operations
 */
class WorkShiftService {
    constructor(baseURL = "/api/work-shift") {
        this.baseURL = baseURL;
    }

    /**
     * Handle API response and errors
     * @param {Response} response - Fetch response object
     * @returns {Promise<Object>} Parsed response data
     * @throws {Error} API error with message
     */
    async handleResponse(response) {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || `HTTP error! status: ${response.status}`
            );
        }

        return data;
    }

    /**
     * Create a new work shift
     * @param {Object} shiftData - Work shift details
     * @param {string} shiftData.name - Name of the work shift
     * @param {string} shiftData.start_time - Start time in HH:mm format
     * @param {string} shiftData.end_time - End time in HH:mm format
     * @returns {Promise<Object>} Created shift data
     * @throws {Error} Validation or server error
     * @example
     * const newShift = await workShiftService.create({
     *   name: "Morning Shift",
     *   start_time: "09:00",
     *   end_time: "17:00"
     * });
     */
    async create(shiftData) {
        try {
            const response = await fetch(this.baseURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(shiftData),
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error("Error creating work shift:", error);
            throw error;
        }
    }

    /**
     * Get all work shifts with optional query parameters
     * @param {Object} [queryParams] - Query parameters
     * @param {string} [queryParams.search] - Search keyword
     * @returns {Promise<Object>} List of work shifts
     * @throws {Error} Server error
     * @example
     * const shifts = await workShiftService.getAll();
     * const searchResults = await workShiftService.getAll({ search: "morning" });
     */
    async getAll(queryParams = {}) {
        try {
            const searchParams = new URLSearchParams();

            // Add query parameters if provided
            Object.keys(queryParams).forEach((key) => {
                if (
                    queryParams[key] !== undefined &&
                    queryParams[key] !== null
                ) {
                    searchParams.append(key, queryParams[key]);
                }
            });

            const url = searchParams.toString()
                ? `${this.baseURL}?${searchParams.toString()}`
                : this.baseURL;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error("Error fetching work shifts:", error);
            throw error;
        }
    }

    /**
     * Get work shift by ID
     * @param {string} id - Shift ID
     * @returns {Promise<Object>} Shift data
     * @throws {Error} Not found or server error
     * @example
     * const shift = await workShiftService.getById("123e4567-e89b-12d3-a456-426614174000");
     */
    async getById(id) {
        try {
            if (!id) {
                throw new Error("Shift ID is required");
            }

            const response = await fetch(`${this.baseURL}/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error(`Error fetching work shift with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Update work shift by ID
     * @param {string} id - Shift ID
     * @param {Object} updateData - Updated shift data
     * @param {string} [updateData.name] - Name of the work shift
     * @param {string} [updateData.start_time] - Start time in HH:mm format
     * @param {string} [updateData.end_time] - End time in HH:mm format
     * @returns {Promise<Object>} Updated shift data
     * @throws {Error} Not found, validation, or server error
     * @example
     * const updatedShift = await workShiftService.update("123e4567-e89b-12d3-a456-426614174000", {
     *   name: "Evening Shift",
     *   start_time: "17:00",
     *   end_time: "01:00"
     * });
     */
    async update(id, updateData) {
        try {
            if (!id) {
                throw new Error("Shift ID is required");
            }

            const response = await fetch(`${this.baseURL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error(`Error updating work shift with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Delete work shift by ID
     * @param {string} id - Shift ID
     * @returns {Promise<Object>} Deletion success message
     * @throws {Error} Not found or server error
     * @example
     * const result = await workShiftService.delete("123e4567-e89b-12d3-a456-426614174000");
     */
    async delete(id) {
        try {
            if (!id) {
                throw new Error("Shift ID is required");
            }

            const response = await fetch(`${this.baseURL}/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error(`Error deleting work shift with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Check if a shift with the given name already exists
     * @param {string} name - Shift name to check
     * @param {string} [excludeId] - ID to exclude from check (for updates)
     * @returns {Promise<boolean>} True if exists, false otherwise
     * @example
     * const exists = await workShiftService.checkIfExists("Morning Shift");
     */
    async checkIfExists(name, excludeId = null) {
        try {
            const shifts = await this.getAll({ search: name });

            if (!shifts.success || !shifts.data) {
                return false;
            }

            const matchingShifts = shifts.data.filter(
                (shift) =>
                    shift.name.toLowerCase() === name.toLowerCase() &&
                    (excludeId ? shift.id !== excludeId : true)
            );

            return matchingShifts.length > 0;
        } catch (error) {
            console.error("Error checking if shift exists:", error);
            throw error;
        }
    }

    /**
     * Search shifts by name
     * @param {string} searchTerm - Search term
     * @returns {Promise<Object>} Search results
     * @example
     * const results = await workShiftService.search("morning");
     */
    async search(searchTerm) {
        try {
            if (!searchTerm || searchTerm.trim() === "") {
                return await this.getAll();
            }

            return await this.getAll({ search: searchTerm.trim() });
        } catch (error) {
            console.error("Error searching shifts:", error);
            throw error;
        }
    }
}

// Create singleton instance
let serviceInstance = null;

/**
 * Get service instance
 * @returns {workShiftService} workShiftService instance
 */
export const getWorkShiftService = () => {
    if (!serviceInstance) {
        serviceInstance = new WorkShiftService();
    }
    return serviceInstance;
};

export default getWorkShiftService();
