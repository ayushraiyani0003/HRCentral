/**
 * @fileoverview Country Controller - Handles HTTP requests for country operations
 * @version 1.0.0
 */

const CountryService = require("../../services/api/country.service");

/**
 * Country Controller
 * Handles all HTTP requests related to country operations
 * @class CountryController
 */
class CountryController {
    /**
     * Create a new country
     * @param {Object} req - Express request object
     * @param {Object} req.body - Request body containing country data
     * @param {string} req.body.name - Country name
     * @param {string} req.body.code - ISO country code
     * @param {string} req.body.phone_code - Phone code with + prefix
     * @param {string} req.body.region - Geographic region
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response with created country or error
     */
    static async createCountry(req, res) {
        try {
            const countryData = req.body;
            const country = await CountryService.create(countryData);

            return res.status(201).json({
                success: true,
                message: "Country created successfully",
                data: country,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
                data: null,
            });
        }
    }

    /**
     * Get all countries with pagination and filtering
     * @param {Object} req - Express request object
     * @param {Object} req.query - Query parameters
     * @param {number} req.query.page - Page number
     * @param {number} req.query.limit - Records per page
     * @param {string} req.query.region - Filter by region
     * @param {string} req.query.search - Search term
     * @param {string} req.query.sortBy - Sort field
     * @param {string} req.query.sortOrder - Sort order (ASC/DESC)
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response with countries list and pagination
     */
    static async getAllCountries(req, res) {
        try {
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                region: req.query.region,
                search: req.query.search,
                sortBy: req.query.sortBy || "name",
                sortOrder: req.query.sortOrder || "ASC",
            };

            const result = await CountryService.getAll(options);

            return res.status(200).json({
                success: true,
                message: "Countries fetched successfully",
                data: result.countries,
                pagination: result.pagination,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
                data: null,
            });
        }
    }

    /**
     * Get a specific country by ID
     * @param {Object} req - Express request object
     * @param {Object} req.params - URL parameters
     * @param {string} req.params.id - Country UUID
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response with country data or error
     */
    static async getCountryById(req, res) {
        try {
            const { id } = req.params;
            const country = await CountryService.getById(id);

            if (!country) {
                return res.status(404).json({
                    success: false,
                    message: "Country not found",
                    data: null,
                });
            }

            return res.status(200).json({
                success: true,
                message: "Country fetched successfully",
                data: country,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
                data: null,
            });
        }
    }

    /**
     * Update a country by ID
     * @param {Object} req - Express request object
     * @param {Object} req.params - URL parameters
     * @param {string} req.params.id - Country UUID
     * @param {Object} req.body - Request body containing update data
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response with updated country or error
     */
    static async updateCountry(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const updatedCountry = await CountryService.update(id, updateData);

            if (!updatedCountry) {
                return res.status(404).json({
                    success: false,
                    message: "Country not found",
                    data: null,
                });
            }

            return res.status(200).json({
                success: true,
                message: "Country updated successfully",
                data: updatedCountry,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
                data: null,
            });
        }
    }

    /**
     * Delete a country by ID
     * @param {Object} req - Express request object
     * @param {Object} req.params - URL parameters
     * @param {string} req.params.id - Country UUID
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response confirming deletion or error
     */
    static async deleteCountry(req, res) {
        try {
            const { id } = req.params;
            const deleted = await CountryService.delete(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: "Country not found",
                    data: null,
                });
            }

            return res.status(200).json({
                success: true,
                message: "Country deleted successfully",
                data: null,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
                data: null,
            });
        }
    }

    /**
     * Get country by country code
     * @param {Object} req - Express request object
     * @param {Object} req.params - URL parameters
     * @param {string} req.params.code - ISO country code
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response with country data or error
     */
    static async getCountryByCode(req, res) {
        try {
            const { code } = req.params;
            const country = await CountryService.getByCode(code);

            if (!country) {
                return res.status(404).json({
                    success: false,
                    message: "Country not found with the provided code",
                    data: null,
                });
            }

            return res.status(200).json({
                success: true,
                message: "Country fetched successfully",
                data: country,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
                data: null,
            });
        }
    }

    /**
     * Get all countries by region
     * @param {Object} req - Express request object
     * @param {Object} req.params - URL parameters
     * @param {string} req.params.region - Geographic region
     * @param {Object} req.query - Query parameters
     * @param {string} req.query.sortBy - Sort field
     * @param {string} req.query.sortOrder - Sort order (ASC/DESC)
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response with countries array or error
     */
    static async getCountriesByRegion(req, res) {
        try {
            const { region } = req.params;
            const options = {
                sortBy: req.query.sortBy || "name",
                sortOrder: req.query.sortOrder || "ASC",
            };

            const countries = await CountryService.getByRegion(region, options);

            return res.status(200).json({
                success: true,
                message: `Countries in ${region} fetched successfully`,
                data: countries,
                count: countries.length,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
                data: null,
            });
        }
    }

    /**
     * Get unique regions
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response with unique regions array
     */
    static async getUniqueRegions(req, res) {
        try {
            const regions = await CountryService.getUniqueRegions();

            return res.status(200).json({
                success: true,
                message: "Unique regions fetched successfully",
                data: regions,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
                data: null,
            });
        }
    }

    /**
     * Get countries count by region
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response with region counts array
     */
    static async getCountByRegion(req, res) {
        try {
            const regionCounts = await CountryService.getCountByRegion();

            return res.status(200).json({
                success: true,
                message: "Country counts by region fetched successfully",
                data: regionCounts,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
                data: null,
            });
        }
    }

    /**
     * Bulk create countries
     * @param {Object} req - Express request object
     * @param {Object} req.body - Request body
     * @param {Array<Object>} req.body.countries - Array of country objects
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response with created countries or error
     */
    static async bulkCreateCountries(req, res) {
        try {
            const { countries } = req.body;

            if (!Array.isArray(countries) || countries.length === 0) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Countries array is required and should not be empty",
                    data: null,
                });
            }

            const createdCountries = await CountryService.bulkCreate(countries);

            return res.status(201).json({
                success: true,
                message: `${createdCountries.length} countries created successfully`,
                data: createdCountries,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
                data: null,
            });
        }
    }
}

module.exports = CountryController;
