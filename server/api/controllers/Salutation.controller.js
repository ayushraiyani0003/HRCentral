/**
 * @fileoverview Salutation Controller
 * @version 1.0.0
 */

const SalutationService = require("../../services/api/Salutation.service"); // Adjust path as needed

class SalutationController {
    /**
     * Create a new salutation
     * @route POST /api/salutation
     */
    async createSalutation(req, res) {
        try {
            const { name } = req.body;

            // Validate required fields
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

            // Check if salutation already exists
            const exists = await SalutationService.existsByName(name);
            if (exists) {
                return res.status(409).json({
                    success: false,
                    message: "Salutation with this name already exists",
                });
            }

            const result = await SalutationService.create({ name });

            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get all salutations with pagination and filtering
     * @route GET /api/salutation
     */
    async getAllSalutations(req, res) {
        try {
            const {
                limit = 10,
                offset = 0,
                orderBy = "createdAt",
                orderDirection = "DESC",
            } = req.query;

            // Validate limit
            const parsedLimit = parseInt(limit);
            if (parsedLimit > 100) {
                return res.status(400).json({
                    success: false,
                    message: "Limit cannot exceed 100",
                });
            }

            // Validate orderBy
            const allowedOrderBy = ["id", "name", "createdAt", "updatedAt"];
            if (!allowedOrderBy.includes(orderBy)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid orderBy field",
                });
            }

            // Validate orderDirection
            if (!["ASC", "DESC"].includes(orderDirection.toUpperCase())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid order direction. Use ASC or DESC",
                });
            }

            const options = {
                limit: parsedLimit,
                offset: parseInt(offset),
                orderBy,
                orderDirection: orderDirection.toUpperCase(),
            };

            const result = await SalutationService.readAll(options);

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Search salutations by name
     * @route GET /api/salutation/search
     */
    async searchSalutations(req, res) {
        try {
            const { q: searchTerm, limit = 10, offset = 0 } = req.query;

            if (!searchTerm) {
                return res.status(400).json({
                    success: false,
                    message: "Search term (q) is required",
                });
            }

            // Validate limit
            const parsedLimit = parseInt(limit);
            if (parsedLimit > 100) {
                return res.status(400).json({
                    success: false,
                    message: "Limit cannot exceed 100",
                });
            }

            const options = {
                limit: parsedLimit,
                offset: parseInt(offset),
            };

            const result = await SalutationService.search(searchTerm, options);

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get all salutations sorted by name
     * @route GET /api/salutation/sorted
     */
    async getAllSalutationsSorted(req, res) {
        try {
            const result = await SalutationService.getAllSorted();

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get salutations count
     * @route GET /api/salutation/count
     */
    async getSalutationsCount(req, res) {
        try {
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
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Bulk create salutations
     * @route POST /api/salutation/bulk
     */
    async bulkCreateSalutations(req, res) {
        try {
            const salutations = req.body;

            if (!Array.isArray(salutations) || salutations.length === 0) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Salutations array is required and must not be empty",
                });
            }

            // Validate each salutation
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

            const results = [];
            const errors = [];

            // Process each salutation individually
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

                    // Create the salutation - only pass the name field
                    const result = await SalutationService.create({
                        name: salutation.name,
                    });

                    results.push({
                        index: i,
                        name: salutation.name,
                        data: result,
                    });
                } catch (error) {
                    errors.push({
                        index: i,
                        name: salutation.name,
                        error: error.message,
                    });
                }
            }

            // Return response based on results
            if (errors.length === 0) {
                // All successful
                return res.status(201).json({
                    success: true,
                    message: `Successfully created ${results.length} salutations`,
                    data: results,
                    created: results.length,
                    failed: 0,
                });
            } else if (results.length === 0) {
                // All failed
                return res.status(400).json({
                    success: false,
                    message: "Failed to create any salutations",
                    errors: errors,
                    created: 0,
                    failed: errors.length,
                });
            } else {
                // Partial success
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
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // : ::ffff:192.168.10.36 - - [20/Jun/2025:09:32:43 +0000] "POST /api/salutation/bulk HTTP/1.1" 400 81 "-" "PostmanRuntime/7.44.1" {"service":"hr-central"}

    /**
     * Check if salutation exists by name
     * @route GET /api/salutation/exists/name/:name
     */
    async checkSalutationExistsByName(req, res) {
        try {
            const { name } = req.params;

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Name is required",
                });
            }

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
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Check if salutation exists by ID
     * @route GET /api/salutation/exists/id/:id
     */
    async checkSalutationExistsById(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "ID is required",
                });
            }

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
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get salutation by name
     * @route GET /api/salutation/name/:name
     */
    async getSalutationByName(req, res) {
        try {
            const { name } = req.params;

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Name is required",
                });
            }

            const result = await SalutationService.readByName(name);

            return res.status(200).json(result);
        } catch (error) {
            if (error.message.includes("not found")) {
                return res.status(404).json({
                    success: false,
                    message: "Salutation not found",
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get salutation by ID
     * @route GET /api/salutation/:id
     */
    async getSalutationById(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "ID is required",
                });
            }

            const result = await SalutationService.readById(id);

            return res.status(200).json(result);
        } catch (error) {
            if (error.message.includes("Invalid UUID")) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid UUID format",
                });
            }

            if (error.message.includes("not found")) {
                return res.status(404).json({
                    success: false,
                    message: "Salutation not found",
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Update salutation by ID
     * @route PUT /api/salutation/:id
     */
    async updateSalutation(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "ID is required",
                });
            }

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
                // Check if it's not the same record
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

            const result = await SalutationService.update(id, { name });

            return res.status(200).json(result);
        } catch (error) {
            if (error.message.includes("Invalid UUID")) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid UUID format",
                });
            }

            if (error.message.includes("not found")) {
                return res.status(404).json({
                    success: false,
                    message: "Salutation not found",
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Delete salutation by ID
     * @route DELETE /api/salutation/:id
     */
    async deleteSalutation(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "ID is required",
                });
            }

            const result = await SalutationService.delete(id);

            return res.status(200).json(result);
        } catch (error) {
            if (error.message.includes("Invalid UUID")) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid UUID format",
                });
            }

            if (error.message.includes("not found")) {
                return res.status(404).json({
                    success: false,
                    message: "Salutation not found",
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = new SalutationController();
