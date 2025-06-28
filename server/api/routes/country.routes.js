/**
 * @fileoverview Express routes for CountryController
 * @version 1.0.0
 */

const express = require("express");
const router = express.Router();
const CountryController = require("../controllers/country.controller"); // Adjust path as necessary

// ==============================
// Routes for Country Management
// ==============================

/**
 * @route POST /api/countries
 * @desc Create a new country
 */
router.post("/", CountryController.createCountry);

/**
 * @route GET /api/countries
 * @desc Get all countries
 */
router.get("/", CountryController.getAllCountries);

/**
 * @route GET /api/countries/:id
 * @desc Get a specific country by ID
 */
router.get("/:id", CountryController.getCountryById);

/**
 * @route PUT /api/countries/:id
 * @desc Update a country by ID
 */
router.put("/:id", CountryController.updateCountry);

/**
 * @route DELETE /api/countries/:id
 * @desc Delete a country by ID
 */
router.delete("/:id", CountryController.deleteCountry);

module.exports = router;
