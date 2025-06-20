/**
 * @fileoverview Express routes for LanguageController
 * @version 1.0.0
 */

const express = require("express");
const router = express.Router();
const LanguageController = require("../controllers/Language.controller"); // Adjust path as necessary

// ==============================
// Routes for Language Management
// ==============================

// the base route is /api/language

/**
 * @route POST /api/language
 * @desc Create a new language
 */
router.post("/", LanguageController.createLanguage);

/**
 * @route GET /api/language
 * @desc Get all languages (supports pagination, filtering, search)
 * @query {number} limit - Number of records to return (default: 10)
 * @query {number} offset - Number of records to skip (default: 0)
 * @query {string} orderBy - Field to order by (default: created_at)
 * @query {string} orderDirection - Order direction ASC/DESC (default: DESC)
 */
router.get("/", LanguageController.getAllLanguages);

/**
 * @route GET /api/language/:id
 * @desc Get a specific language by ID
 */
router.get("/:id", LanguageController.getLanguageById);

/**
 * @route PUT /api/language/:id
 * @desc Update a language by ID
 */
router.put("/:id", LanguageController.updateLanguage);

/**
 * @route DELETE /api/language/:id
 * @desc Delete a language by ID
 */
router.delete("/:id", LanguageController.deleteLanguage);

// ==============================
// Additional Language Routes
// ==============================

/**
 * @route GET /api/language/name/:name
 * @desc Get language by name
 */
router.get("/name/:name", LanguageController.getLanguageByName);

/**
 * @route GET /api/language/exists/:name
 * @desc Check if language exists by name
 */
router.get("/exists/:name", LanguageController.checkLanguageExists);

/**
 * @route GET /api/language/search/:searchTerm
 * @desc Search languages by name (partial match)
 * @query {number} limit - Number of records to return (default: 10)
 * @query {number} offset - Number of records to skip (default: 0)
 */
router.get("/search/:searchTerm", LanguageController.searchLanguages);

module.exports = router;
