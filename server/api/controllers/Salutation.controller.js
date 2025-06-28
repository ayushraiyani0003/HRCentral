/**
 * @fileoverview Salutation Controller
 * Handles all HTTP requests related to salutation management including CRUD operations,
 * search functionality, bulk operations, and validation.
 * @version 1.0.0
 * @author HR Central Team
 */

const SalutationService = require("../../services/api/Salutation.service"); // Adjust path as needed

/**
 * Salutation Controller Class
 * Provides REST API endpoints for managing salutations with comprehensive validation,
 * error handling, and business logic implementation.
 */
class SalutationController {
    /**
     * Create a new salutation
     * @route POST /api/salutation
     * @param {Object} req - Express request object
     * @param {Object} req.body - Request body containing salutation data
     * @param {string} req.body.name - Name of the salutation (required, max 100 chars)
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with created salutation or error
     * @description Creates a new salutation after validating uniqueness and format
     */
    async createSalutation(req, res) {
        try {
            const { name } = req.body;

            // Validate required fields - ensure name is provided
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Name is required",
                });
            }

            // Validate name length - business rule: max 100 characters
            if (name.length > 100) {
                return res.status(400).json({
                    success: false,
                    message: "Name must not exceed 100 characters",
                });
            }

            // Check if salutation already exists - prevent duplicates
            const exists = await SalutationService.existsByName(name);
            if (exists) {
                return res.status(409).json({
                    success: false,
                    message: "Salutation with this name already exists",
                });
            }

            // Create the salutation record
            const result = await SalutationService.create({ name });

            return res.status(201).json(result);
        } catch (error) {
            // Handle unexpected errors
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get all salutations without pagination or limits
     * @route GET /api/salutation
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with all salutations
     * @description Retrieves all salutations without any pagination or limits
     */
    async getAllSalutations(req, res) {
        try {
            // Fetch all data from service layer without any options
            const result = await SalutationService.readAll();

            return res.status(200).json(result);
        } catch (error) {
            // Handle service layer errors
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Search salutations by name
     * @route GET /api/salutation/search
     * @param {Object} req - Express request object
     * @param {Object} req.query - Query parameters
     * @param {string} req.query.q - Search term (required)
     * @param {number} [req.query.limit=10] - Number of results to return (max 100)
     * @param {number} [req.query.offset=0] - Number of results to skip
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with matching salutations
     * @description Performs fuzzy search on salutation names with pagination
     */
    async searchSalutations(req, res) {
        try {
            const { q: searchTerm, limit = 10, offset = 0 } = req.query;

            // Validate search term - required for search operation
            if (!searchTerm) {
                return res.status(400).json({
                    success: false,
                    message: "Search term (q) is required",
                });
            }

            // Validate limit - prevent excessive results
            const parsedLimit = parseInt(limit);
            if (parsedLimit > 100) {
                return res.status(400).json({
                    success: false,
                    message: "Limit cannot exceed 100",
                });
            }

            // Prepare search options
            const options = {
                limit: parsedLimit,
                offset: parseInt(offset),
            };

            // Perform search via service layer
            const result = await SalutationService.search(searchTerm, options);

            return res.status(200).json(result);
        } catch (error) {
            // Handle search errors
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get all salutations sorted by name
     * @route GET /api/salutation/sorted
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with all salutations sorted alphabetically
     * @description Returns all salutations sorted by name for dropdown/select lists
     */
    async getAllSalutationsSorted(req, res) {
        try {
            // Get all salutations sorted by name
            const result = await SalutationService.getAllSorted();

            return res.status(200).json(result);
        } catch (error) {
            // Handle service errors
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get salutations count
     * @route GET /api/salutation/count
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with total count of salutations
     * @description Returns the total number of salutations in the system
     */
    async getSalutationsCount(req, res) {
        try {
            // Use readAll with minimal limit to get total count from pagination
            const result = await SalutationService.readAll({
                limit: 1,
                offset: 0,
            });

            return res.status(200).json({
                success: true,
                data: {
                    count: result.pagination.total,
                },
                message: "Salutations count retrieved successfully",
            });
        } catch (error) {
            // Handle count retrieval errors
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Bulk create salutations
     * @route POST /api/salutation/bulk
     * @param {Object} req - Express request object
     * @param {Array} req.body - Array of salutation objects to create
     * @param {string} req.body[].name - Name of each salutation
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with bulk operation results
     * @description Creates multiple salutations in a single operation with detailed results
     */
    async bulkCreateSalutations(req, res) {
        try {
            const salutations = req.body;

            // Validate input is an array with content
            if (!Array.isArray(salutations) || salutations.length === 0) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Salutations array is required and must not be empty",
                });
            }

            // Validate each salutation in the array
            for (const salutation of salutations) {
                if (!salutation.name) {
                    return res.status(400).json({
                        success: false,
                        message: "All salutations must have a name",
                    });
                }
                if (salutation.name.length > 100) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Salutation names must not exceed 100 characters",
                    });
                }
            }

            // Track results for each operation
            const results = [];
            const errors = [];

            // Process each salutation individually to handle partial failures
            for (let i = 0; i < salutations.length; i++) {
                const salutation = salutations[i];
                try {
                    // Check if salutation already exists
                    const exists = await SalutationService.existsByName(
                        salutation.name
                    );
                    if (exists) {
                        errors.push({
                            index: i,
                            name: salutation.name,
                            error: "Salutation already exists",
                        });
                        continue;
                    }

                    // Create the salutation - only pass the name field for security
                    const result = await SalutationService.create({
                        name: salutation.name,
                    });

                    results.push({
                        index: i,
                        name: salutation.name,
                        data: result,
                    });
                } catch (error) {
                    // Track individual creation errors
                    errors.push({
                        index: i,
                        name: salutation.name,
                        error: error.message,
                    });
                }
            }

            // Return appropriate response based on results
            if (errors.length === 0) {
                // All operations successful
                return res.status(201).json({
                    success: true,
                    message: `Successfully created ${results.length} salutations`,
                    data: results,
                    created: results.length,
                    failed: 0,
                });
            } else if (results.length === 0) {
                // All operations failed
                return res.status(400).json({
                    success: false,
                    message: "Failed to create any salutations",
                    errors: errors,
                    created: 0,
                    failed: errors.length,
                });
            } else {
                // Partial success - some succeeded, some failed
                return res.status(207).json({
                    success: true,
                    message: `Partially successful: ${results.length} created, ${errors.length} failed`,
                    data: results,
                    errors: errors,
                    created: results.length,
                    failed: errors.length,
                });
            }
        } catch (error) {
            // Handle unexpected bulk operation errors
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Log entry for debugging: ::ffff:192.168.10.36 - - [20/Jun/2025:09:32:43 +0000] "POST /api/salutation/bulk HTTP/1.1" 400 81 "-" "PostmanRuntime/7.44.1" {"service":"hr-central"}

    /**
     * Check if salutation exists by name
     * @route GET /api/salutation/exists/name/:name
     * @param {Object} req - Express request object
     * @param {Object} req.params - Route parameters
     * @param {string} req.params.name - Name to check for existence
     * @param {Object} res - Express response object
     * @returns {Object} JSON response indicating if salutation exists
     * @description Utility endpoint to check name availability before creation
     */
    async checkSalutationExistsByName(req, res) {
        try {
            const { name } = req.params;

            // Validate name parameter
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Name is required",
                });
            }

            // Check existence via service layer
            const exists = await SalutationService.existsByName(name);

            return res.status(200).json({
                success: true,
                data: {
                    exists,
                    name,
                },
                message: "Existence check completed successfully",
            });
        } catch (error) {
            // Handle existence check errors
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Check if salutation exists by ID
     * @route GET /api/salutation/exists/id/:id
     * @param {Object} req - Express request object
     * @param {Object} req.params - Route parameters
     * @param {string} req.params.id - UUID to check for existence
     * @param {Object} res - Express response object
     * @returns {Object} JSON response indicating if salutation exists
     * @description Utility endpoint to validate salutation ID before operations
     */
    async checkSalutationExistsById(req, res) {
        try {
            const { id } = req.params;

            // Validate ID parameter
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "ID is required",
                });
            }

            // Check existence via service layer
            const exists = await SalutationService.existsById(id);

            return res.status(200).json({
                success: true,
                data: {
                    exists,
                    id,
                },
                message: "Existence check completed successfully",
            });
        } catch (error) {
            // Handle ID existence check errors
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get salutation by name
     * @route GET /api/salutation/name/:name
     * @param {Object} req - Express request object
     * @param {Object} req.params - Route parameters
     * @param {string} req.params.name - Name of the salutation to retrieve
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with salutation data or error
     * @description Retrieves a specific salutation by its name
     */
    async getSalutationByName(req, res) {
        try {
            const { name } = req.params;

            // Validate name parameter
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Name is required",
                });
            }

            // Retrieve salutation by name
            const result = await SalutationService.readByName(name);

            return res.status(200).json(result);
        } catch (error) {
            // Handle specific error cases
            if (error.message.includes("not found")) {
                return res.status(404).json({
                    success: false,
                    message: "Salutation not found",
                });
            }

            // Handle other errors
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get salutation by ID
     * @route GET /api/salutation/:id
     * @param {Object} req - Express request object
     * @param {Object} req.params - Route parameters
     * @param {string} req.params.id - UUID of the salutation to retrieve
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with salutation data or error
     * @description Retrieves a specific salutation by its unique identifier
     */
    async getSalutationById(req, res) {
        try {
            const { id } = req.params;

            // Validate ID parameter
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "ID is required",
                });
            }

            // Retrieve salutation by ID
            const result = await SalutationService.readById(id);

            return res.status(200).json(result);
        } catch (error) {
            // Handle UUID format errors
            if (error.message.includes("Invalid UUID")) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid UUID format",
                });
            }

            // Handle not found errors
            if (error.message.includes("not found")) {
                return res.status(404).json({
                    success: false,
                    message: "Salutation not found",
                });
            }

            // Handle other errors
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Update salutation by ID
     * @route PUT /api/salutation/:id
     * @param {Object} req - Express request object
     * @param {Object} req.params - Route parameters
     * @param {string} req.params.id - UUID of the salutation to update
     * @param {Object} req.body - Request body containing update data
     * @param {string} req.body.name - New name for the salutation
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with updated salutation or error
     * @description Updates an existing salutation with validation and conflict checking
     */
    async updateSalutation(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            // Validate ID parameter
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "ID is required",
                });
            }

            // Validate name in request body
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Name is required",
                });
            }

            // Validate name length
            if (name.length > 100) {
                return res.status(400).json({
                    success: false,
                    message: "Name must not exceed 100 characters",
                });
            }

            // Check if another salutation with this name already exists
            const existingSalutation = await SalutationService.existsByName(
                name
            );
            if (existingSalutation) {
                // Verify it's not the same record being updated
                try {
                    const currentSalutation = await SalutationService.readById(
                        id
                    );
                    if (currentSalutation.data.name !== name) {
                        return res.status(409).json({
                            success: false,
                            message: "Salutation with this name already exists",
                        });
                    }
                } catch (error) {
                    // If readById fails, the ID is invalid or doesn't exist
                    return res.status(409).json({
                        success: false,
                        message: "Salutation with this name already exists",
                    });
                }
            }

            // Perform the update
            const result = await SalutationService.update(id, { name });

            return res.status(200).json(result);
        } catch (error) {
            // Handle UUID format errors
            if (error.message.includes("Invalid UUID")) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid UUID format",
                });
            }

            // Handle not found errors
            if (error.message.includes("not found")) {
                return res.status(404).json({
                    success: false,
                    message: "Salutation not found",
                });
            }

            // Handle other update errors
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Delete salutation by ID
     * @route DELETE /api/salutation/:id
     * @param {Object} req - Express request object
     * @param {Object} req.params - Route parameters
     * @param {string} req.params.id - UUID of the salutation to delete
     * @param {Object} res - Express response object
     * @returns {Object} JSON response confirming deletion or error
     * @description Permanently removes a salutation from the system
     */
    async deleteSalutation(req, res) {
        try {
            const { id } = req.params;

            // Validate ID parameter
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "ID is required",
                });
            }

            // Perform deletion via service layer
            const result = await SalutationService.delete(id);

            return res.status(200).json(result);
        } catch (error) {
            // Handle UUID format errors
            if (error.message.includes("Invalid UUID")) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid UUID format",
                });
            }

            // Handle not found errors
            if (error.message.includes("not found")) {
                return res.status(404).json({
                    success: false,
                    message: "Salutation not found",
                });
            }

            // Handle other deletion errors
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}

// Export singleton instance of the controller
module.exports = new SalutationController();
