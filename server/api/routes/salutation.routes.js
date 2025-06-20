/**
 * @fileoverview Express routes for SalutationController
 * @version 1.0.0
 */

const express = require("express");
const router = express.Router();
const SalutationController = require("../controllers/Salutation.controller"); // Adjust path as necessary

// ==============================
// Routes for Salutation Management
// ==============================

// the base route is /api/salutation

/**
 * @route POST /api/salutation
 * @desc Create a new salutation
 * @body {Object} salutation - Salutation object with name property
 * @body {string} salutation.name - Salutation name (required, max 100 characters)
 * @returns {Object} 201 - Created salutation object
 * @returns {Object} 400 - Bad request (validation error)
 * @returns {Object} 409 - Conflict (name already exists)
 */
router.post("/", SalutationController.createSalutation);

/**
 * @route GET /api/salutation
 * @desc Get all salutations (supports pagination, filtering, search)
 * @query {number} limit - Number of records to return (default: 10, max: 100)
 * @query {number} offset - Number of records to skip (default: 0)
 * @query {string} orderBy - Field to order by: id, name, createdAt, updatedAt (default: createdAt)
 * @query {string} orderDirection - Order direction ASC/DESC (default: DESC)
 * @returns {Object} 200 - List of salutations with pagination info
 * @returns {Object} 400 - Bad request (invalid parameters)
 * @returns {Object} 500 - Internal server error
 */
router.get("/", SalutationController.getAllSalutations);

/**
 * @route GET /api/salutation/search
 * @desc Search salutations by name (partial match, case-insensitive)
 * @query {string} q - Search term for salutation name (required)
 * @query {number} limit - Number of records to return (default: 10, max: 100)
 * @query {number} offset - Number of records to skip (default: 0)
 * @returns {Object} 200 - List of matching salutations with pagination info
 * @returns {Object} 400 - Bad request (search term required)
 * @returns {Object} 500 - Internal server error
 */
router.get("/search", SalutationController.searchSalutations);

/**
 * @route GET /api/salutation/sorted
 * @desc Get all salutations sorted by name (for dropdown lists)
 * @returns {Object} 200 - List of salutations sorted by name
 * @returns {Object} 500 - Internal server error
 */
router.get("/sorted", SalutationController.getAllSalutationsSorted);

/**
 * @route GET /api/salutation/count
 * @desc Get total count of salutations
 * @returns {Object} 200 - Salutations count
 * @returns {Object} 500 - Internal server error
 */
router.get("/count", SalutationController.getSalutationsCount);

/**
 * @route POST /api/salutation/bulk
 * @desc Bulk create salutations
 * @body {Array} salutations - Array of salutation objects
 * @body {string} salutations[].name - Salutation name (required, max 100 characters)
 * @returns {Object} 201 - Created salutations array
 * @returns {Object} 400 - Bad request (validation error)
 * @returns {Object} 409 - Conflict (duplicate names)
 * @returns {Object} 500 - Internal server error
 */
router.post("/bulk", SalutationController.bulkCreateSalutations);

/**
 * @route GET /api/salutation/exists/name/:name
 * @desc Check if salutation exists by name
 * @param {string} name - Salutation name to check
 * @returns {Object} 200 - Existence status
 * @returns {Object} 400 - Bad request (name required)
 * @returns {Object} 500 - Internal server error
 */
router.get(
    "/exists/name/:name",
    SalutationController.checkSalutationExistsByName
);

/**
 * @route GET /api/salutation/exists/id/:id
 * @desc Check if salutation exists by ID
 * @param {string} id - Salutation UUID to check
 * @returns {Object} 200 - Existence status
 * @returns {Object} 400 - Bad request (ID required)
 * @returns {Object} 500 - Internal server error
 */
router.get("/exists/id/:id", SalutationController.checkSalutationExistsById);

/**
 * @route GET /api/salutation/name/:name
 * @desc Get salutation by name (case-insensitive)
 * @param {string} name - Salutation name
 * @returns {Object} 200 - Salutation object
 * @returns {Object} 400 - Bad request (name required)
 * @returns {Object} 404 - Salutation not found
 * @returns {Object} 500 - Internal server error
 */
router.get("/name/:name", SalutationController.getSalutationByName);

/**
 * @route GET /api/salutation/:id
 * @desc Get a specific salutation by ID
 * @param {string} id - Salutation UUID
 * @returns {Object} 200 - Salutation object
 * @returns {Object} 400 - Bad request (invalid UUID)
 * @returns {Object} 404 - Salutation not found
 * @returns {Object} 500 - Internal server error
 */
router.get("/:id", SalutationController.getSalutationById);

/**
 * @route PUT /api/salutation/:id
 * @desc Update a salutation by ID
 * @param {string} id - Salutation UUID
 * @body {Object} salutation - Salutation object with updated data
 * @body {string} salutation.name - Salutation name (required, max 100 characters)
 * @returns {Object} 200 - Updated salutation object
 * @returns {Object} 400 - Bad request (validation error or invalid UUID)
 * @returns {Object} 404 - Salutation not found
 * @returns {Object} 409 - Conflict (name already exists)
 * @returns {Object} 500 - Internal server error
 */
router.put("/:id", SalutationController.updateSalutation);

/**
 * @route DELETE /api/salutation/:id
 * @desc Delete a salutation by ID
 * @param {string} id - Salutation UUID
 * @returns {Object} 200 - Deletion success message
 * @returns {Object} 400 - Bad request (invalid UUID)
 * @returns {Object} 404 - Salutation not found
 * @returns {Object} 500 - Internal server error
 */
router.delete("/:id", SalutationController.deleteSalutation);

module.exports = router;
