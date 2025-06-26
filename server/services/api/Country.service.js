// =================== services/Country.service.js ===================

const { Country } = require("../../models");
const { Op } = require("sequelize");

/**
 * Country Service
 * Handles all CRUD operations for Country model
 * @class CountryService
 */
class CountryService {
    /**
     * Create a new country
     * @param {Object} countryData - Country data object
     * @param {string} countryData.name - Country name
     * @param {string} countryData.code - ISO 3166-1 alpha-2 country code (2 characters, uppercase)
     * @param {string} countryData.phone_code - Phone code with + prefix (e.g., +1, +91)
     * @param {string} countryData.region - Geographic region
     * @returns {Promise<Object>} Created country object
     * @throws {Error} Validation error or database error
     * @example
     * const country = await CountryService.create({
     *   name: 'United States',
     *   code: 'US',
     *   phone_code: '+1',
     *   region: 'North America'
     * });
     */
    static async create(countryData) {
        console.log(countryData);

        try {
            const country = await Country.create(countryData);
            return country.toJSON();
        } catch (error) {
            throw new Error(`Failed to create country: ${error.message}`);
        }
    }

    /**
     * Get all countries with optional filtering and pagination
     * @param {Object} options - Query options
     * @param {number} [options.page=1] - Page number for pagination
     * @param {number} [options.limit=10] - Number of records per page
     * @param {string} [options.region] - Filter by region
     * @param {string} [options.search] - Search in country name
     * @param {string} [options.sortBy='name'] - Sort by field
     * @param {string} [options.sortOrder='ASC'] - Sort order (ASC/DESC)
     * @returns {Promise<Object>} Object containing countries array and pagination info
     * @example
     * const result = await CountryService.getAll({
     *   page: 1,
     *   limit: 20,
     *   region: 'Asia',
     *   search: 'India'
     * });
     */
    static async getAll(options = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                region,
                search,
                sortBy = "name",
                sortOrder = "ASC",
            } = options;

            const offset = (page - 1) * limit;
            const whereClause = {};

            // Add region filter
            if (region) {
                whereClause.region = region;
            }

            // Add search filter
            if (search) {
                whereClause.name = {
                    [Op.iLike]: `%${search}%`,
                };
            }

            const { count, rows } = await Country.findAndCountAll({
                where: whereClause,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [[sortBy, sortOrder.toUpperCase()]],
            });

            return {
                countries: rows.map((country) => country.toJSON()),
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    totalCount: count,
                    hasNext: page < Math.ceil(count / limit),
                    hasPrev: page > 1,
                },
            };
        } catch (error) {
            throw new Error(`Failed to fetch countries: ${error.message}`);
        }
    }

    /**
     * Get a country by ID
     * @param {string} id - Country UUID
     * @returns {Promise<Object|null>} Country object or null if not found
     * @throws {Error} Database error
     * @example
     * const country = await CountryService.getById('123e4567-e89b-12d3-a456-426614174000');
     */
    static async getById(id) {
        try {
            const country = await Country.findByPk(id);
            return country ? country.toJSON() : null;
        } catch (error) {
            throw new Error(`Failed to fetch country by ID: ${error.message}`);
        }
    }

    /**
     * Get a country by country code
     * @param {string} code - ISO 3166-1 alpha-2 country code
     * @returns {Promise<Object|null>} Country object or null if not found
     * @throws {Error} Database error
     * @example
     * const country = await CountryService.getByCode('US');
     */
    static async getByCode(code) {
        try {
            const country = await Country.findOne({
                where: { code: code.toUpperCase() },
            });
            return country ? country.toJSON() : null;
        } catch (error) {
            throw new Error(
                `Failed to fetch country by code: ${error.message}`
            );
        }
    }

    /**
     * Get countries by region
     * @param {string} region - Geographic region
     * @param {Object} options - Query options
     * @param {string} [options.sortBy='name'] - Sort by field
     * @param {string} [options.sortOrder='ASC'] - Sort order (ASC/DESC)
     * @returns {Promise<Array>} Array of country objects
     * @throws {Error} Database error
     * @example
     * const countries = await CountryService.getByRegion('Asia');
     */
    static async getByRegion(region, options = {}) {
        try {
            const { sortBy = "name", sortOrder = "ASC" } = options;

            const countries = await Country.findAll({
                where: { region },
                order: [[sortBy, sortOrder.toUpperCase()]],
            });

            return countries.map((country) => country.toJSON());
        } catch (error) {
            throw new Error(
                `Failed to fetch countries by region: ${error.message}`
            );
        }
    }

    /**
     * Update a country by ID
     * @param {string} id - Country UUID
     * @param {Object} updateData - Data to update
     * @param {string} [updateData.name] - Country name
     * @param {string} [updateData.code] - ISO 3166-1 alpha-2 country code
     * @param {string} [updateData.phone_code] - Phone code with + prefix
     * @param {string} [updateData.region] - Geographic region
     * @returns {Promise<Object|null>} Updated country object or null if not found
     * @throws {Error} Validation error or database error
     * @example
     * const updatedCountry = await CountryService.update('123e4567-e89b-12d3-a456-426614174000', {
     *   name: 'United States of America',
     *   region: 'North America'
     * });
     */
    static async update(id, updateData) {
        try {
            const [updatedRowsCount] = await Country.update(updateData, {
                where: { id },
                returning: true,
            });

            if (updatedRowsCount === 0) {
                return null;
            }

            const updatedCountry = await Country.findByPk(id);
            return updatedCountry.toJSON();
        } catch (error) {
            throw new Error(`Failed to update country: ${error.message}`);
        }
    }

    /**
     * Update a country by country code
     * @param {string} code - ISO 3166-1 alpha-2 country code
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object|null>} Updated country object or null if not found
     * @throws {Error} Validation error or database error
     * @example
     * const updatedCountry = await CountryService.updateByCode('US', {
     *   name: 'United States of America'
     * });
     */
    static async updateByCode(code, updateData) {
        try {
            const [updatedRowsCount] = await Country.update(updateData, {
                where: { code: code.toUpperCase() },
                returning: true,
            });

            if (updatedRowsCount === 0) {
                return null;
            }

            const updatedCountry = await Country.findOne({
                where: { code: code.toUpperCase() },
            });
            return updatedCountry.toJSON();
        } catch (error) {
            throw new Error(
                `Failed to update country by code: ${error.message}`
            );
        }
    }

    /**
     * Delete a country by ID
     * @param {string} id - Country UUID
     * @returns {Promise<boolean>} True if deleted, false if not found
     * @throws {Error} Database error
     * @example
     * const deleted = await CountryService.delete('123e4567-e89b-12d3-a456-426614174000');
     */
    static async delete(id) {
        try {
            const deletedRowsCount = await Country.destroy({
                where: { id },
            });

            return deletedRowsCount > 0;
        } catch (error) {
            throw new Error(`Failed to delete country: ${error.message}`);
        }
    }

    /**
     * Delete a country by country code
     * @param {string} code - ISO 3166-1 alpha-2 country code
     * @returns {Promise<boolean>} True if deleted, false if not found
     * @throws {Error} Database error
     * @example
     * const deleted = await CountryService.deleteByCode('US');
     */
    static async deleteByCode(code) {
        try {
            const deletedRowsCount = await Country.destroy({
                where: { code: code.toUpperCase() },
            });

            return deletedRowsCount > 0;
        } catch (error) {
            throw new Error(
                `Failed to delete country by code: ${error.message}`
            );
        }
    }

    /**
     * Bulk create countries
     * @param {Array<Object>} countriesData - Array of country objects
     * @returns {Promise<Array>} Array of created country objects
     * @throws {Error} Validation error or database error
     * @example
     * const countries = await CountryService.bulkCreate([
     *   { name: 'India', code: 'IN', phone_code: '+91', region: 'Asia' },
     *   { name: 'China', code: 'CN', phone_code: '+86', region: 'Asia' }
     * ]);
     */
    static async bulkCreate(countriesData) {
        try {
            const countries = await Country.bulkCreate(countriesData, {
                returning: true,
                validate: true,
            });

            return countries.map((country) => country.toJSON());
        } catch (error) {
            throw new Error(
                `Failed to bulk create countries: ${error.message}`
            );
        }
    }

    /**
     * Get unique regions
     * @returns {Promise<Array<string>>} Array of unique region names
     * @throws {Error} Database error
     * @example
     * const regions = await CountryService.getUniqueRegions();
     * // Returns: ['Asia', 'Europe', 'North America', ...]
     */
    static async getUniqueRegions() {
        try {
            const regions = await Country.findAll({
                attributes: ["region"],
                group: ["region"],
                order: [["region", "ASC"]],
            });

            return regions.map((item) => item.region);
        } catch (error) {
            throw new Error(`Failed to fetch unique regions: ${error.message}`);
        }
    }

    /**
     * Check if a country exists by code
     * @param {string} code - ISO 3166-1 alpha-2 country code
     * @returns {Promise<boolean>} True if exists, false otherwise
     * @throws {Error} Database error
     * @example
     * const exists = await CountryService.existsByCode('US');
     */
    static async existsByCode(code) {
        try {
            const count = await Country.count({
                where: { code: code.toUpperCase() },
            });

            return count > 0;
        } catch (error) {
            throw new Error(
                `Failed to check country existence: ${error.message}`
            );
        }
    }

    /**
     * Get countries count by region
     * @returns {Promise<Array<Object>>} Array of objects with region and count
     * @throws {Error} Database error
     * @example
     * const regionCounts = await CountryService.getCountByRegion();
     * // Returns: [{ region: 'Asia', count: 45 }, { region: 'Europe', count: 44 }, ...]
     */
    static async getCountByRegion() {
        try {
            const results = await Country.findAll({
                attributes: [
                    "region",
                    [
                        Country.sequelize.fn(
                            "COUNT",
                            Country.sequelize.col("id")
                        ),
                        "count",
                    ],
                ],
                group: ["region"],
                order: [["region", "ASC"]],
            });

            return results.map((item) => ({
                region: item.region,
                count: parseInt(item.dataValues.count),
            }));
        } catch (error) {
            throw new Error(`Failed to get count by region: ${error.message}`);
        }
    }
}

module.exports = CountryService;
