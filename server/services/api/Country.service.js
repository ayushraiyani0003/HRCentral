// =================== services/Country.service.js ===================

const { Country } = require("../../models");
const { Op, fn, col, where } = require("sequelize");

/**
 * Country Service
 * Handles all CRUD operations for Country model
 * @class CountryService
 */
class CountryService {
    /**
     * Create a new country
     * @param {Object} data - Country data object
     * @param {string} data.name - Country name
     * @param {string} data.code - ISO 3166-1 alpha-2 country code (2 characters, uppercase)
     * @param {string} data.phone_code - Phone code with + prefix (e.g., +1, +91)
     * @param {string} data.region - Geographic region
     * @returns {Promise<Object>} Created country object
     * @throws {Error} Validation error or database error
     */
    async create(data) {
        try {
            const { name, code, phone_code, region } = data;

            // Validate required fields
            if (!name || !name.trim()) {
                throw new Error("Country name is required and cannot be empty");
            }
            if (!code || !code.trim()) {
                throw new Error("Country code is required and cannot be empty");
            }
            if (!phone_code || !phone_code.trim()) {
                throw new Error("Phone code is required and cannot be empty");
            }
            if (!region || !region.trim()) {
                throw new Error("Region is required and cannot be empty");
            }

            // Validate field lengths
            if (name.trim().length > 100) {
                throw new Error("Country name cannot exceed 100 characters");
            }
            if (code.trim().length !== 2) {
                throw new Error("Country code must be exactly 2 characters");
            }
            if (phone_code.trim().length > 10) {
                throw new Error("Phone code cannot exceed 10 characters");
            }
            if (region.trim().length > 50) {
                throw new Error("Region cannot exceed 50 characters");
            }

            // Validate country code format (2 uppercase letters)
            if (!/^[A-Z]{2}$/.test(code.trim().toUpperCase())) {
                throw new Error("Country code must be 2 uppercase letters");
            }

            // Validate phone code format (+ followed by digits)
            if (!/^\+\d+$/.test(phone_code.trim())) {
                throw new Error(
                    "Phone code must start with + followed by digits"
                );
            }

            // Check if country name already exists (case-insensitive)
            const existingCountryByName = await Country.findOne({
                where: where(
                    fn("LOWER", col("name")),
                    name.trim().toLowerCase()
                ),
            });

            if (existingCountryByName) {
                throw new Error("Country name already exists");
            }

            // Check if country code already exists (case-insensitive)
            const existingCountryByCode = await Country.findOne({
                where: where(
                    fn("UPPER", col("code")),
                    code.trim().toUpperCase()
                ),
            });

            if (existingCountryByCode) {
                throw new Error("Country code already exists");
            }

            const country = await Country.create({
                name: name.trim(),
                code: code.trim().toUpperCase(),
                phone_code: phone_code.trim(),
                region: region.trim(),
            });

            return {
                success: true,
                data: country,
                message: "Country created successfully",
            };
        } catch (error) {
            // Handle Sequelize unique constraint error
            if (error.name === "SequelizeUniqueConstraintError") {
                const field = error.errors[0]?.path;
                if (field === "name") {
                    throw new Error("Country name already exists");
                } else if (field === "code") {
                    throw new Error("Country code already exists");
                } else {
                    throw new Error("Country already exists");
                }
            }
            // Handle validation errors
            if (error.name === "SequelizeValidationError") {
                const validationErrors = error.errors
                    .map((err) => err.message)
                    .join(", ");
                throw new Error(`Validation error: ${validationErrors}`);
            }
            throw new Error(`Failed to create country: ${error.message}`);
        }
    }

    /**
     * Get all countries
     * @returns {Promise<Object>} List of countries
     */
    async getAll() {
        try {
            const countries = await Country.findAll();

            return {
                success: true,
                data: countries,
                message: "Countries retrieved successfully",
            };
        } catch (error) {
            throw new Error(`Failed to retrieve countries: ${error.message}`);
        }
    }

    /**
     * Get country by ID (UUID)
     * @param {string} id - Country UUID
     * @returns {Promise<Object>} Country data
     */
    async readById(id) {
        try {
            if (!id) {
                throw new Error("Country ID is required");
            }

            // Validate UUID format
            if (!this._isValidUUID(id)) {
                throw new Error("Invalid UUID format");
            }

            const country = await Country.findByPk(id);

            if (!country) {
                throw new Error("Country not found");
            }

            return {
                success: true,
                data: country,
                message: "Country retrieved successfully",
            };
        } catch (error) {
            throw new Error(`Failed to retrieve country: ${error.message}`);
        }
    }

    /**
     * Update country by ID (UUID)
     * @param {string} id - Country UUID
     * @param {Object} data - Updated country data
     * @returns {Promise<Object>} Updated country
     */
    async update(id, data) {
        try {
            if (!id) {
                throw new Error("Country ID is required");
            }

            // Validate UUID format
            if (!this._isValidUUID(id)) {
                throw new Error("Invalid UUID format");
            }

            const country = await Country.findByPk(id);

            if (!country) {
                throw new Error("Country not found");
            }

            const { name, code, phone_code, region } = data;
            const updateData = {};

            // Validate and prepare update data
            if (name !== undefined) {
                if (!name || !name.trim()) {
                    throw new Error(
                        "Country name is required and cannot be empty"
                    );
                }
                if (name.trim().length > 100) {
                    throw new Error(
                        "Country name cannot exceed 100 characters"
                    );
                }
                updateData.name = name.trim();
            }

            if (code !== undefined) {
                if (!code || !code.trim()) {
                    throw new Error(
                        "Country code is required and cannot be empty"
                    );
                }
                if (code.trim().length !== 2) {
                    throw new Error(
                        "Country code must be exactly 2 characters"
                    );
                }
                if (!/^[A-Z]{2}$/.test(code.trim().toUpperCase())) {
                    throw new Error("Country code must be 2 uppercase letters");
                }
                updateData.code = code.trim().toUpperCase();
            }

            if (phone_code !== undefined) {
                if (!phone_code || !phone_code.trim()) {
                    throw new Error(
                        "Phone code is required and cannot be empty"
                    );
                }
                if (phone_code.trim().length > 10) {
                    throw new Error("Phone code cannot exceed 10 characters");
                }
                if (!/^\+\d+$/.test(phone_code.trim())) {
                    throw new Error(
                        "Phone code must start with + followed by digits"
                    );
                }
                updateData.phone_code = phone_code.trim();
            }

            if (region !== undefined) {
                if (!region || !region.trim()) {
                    throw new Error("Region is required and cannot be empty");
                }
                if (region.trim().length > 50) {
                    throw new Error("Region cannot exceed 50 characters");
                }
                updateData.region = region.trim();
            }

            // Check for duplicate name (excluding current record)
            if (updateData.name) {
                const existingCountryByName = await Country.findOne({
                    where: {
                        name: {
                            [Op.like]: updateData.name,
                        },
                        id: { [Op.ne]: id },
                    },
                });

                if (existingCountryByName) {
                    throw new Error("Country name already exists");
                }
            }

            // Check for duplicate code (excluding current record)
            if (updateData.code) {
                const existingCountryByCode = await Country.findOne({
                    where: {
                        code: updateData.code,
                        id: { [Op.ne]: id },
                    },
                });

                if (existingCountryByCode) {
                    throw new Error("Country code already exists");
                }
            }

            const updatedCountry = await country.update(updateData);

            return {
                success: true,
                data: updatedCountry,
                message: "Country updated successfully",
            };
        } catch (error) {
            // Handle Sequelize unique constraint error
            if (error.name === "SequelizeUniqueConstraintError") {
                const field = error.errors[0]?.path;
                if (field === "name") {
                    throw new Error("Country name already exists");
                } else if (field === "code") {
                    throw new Error("Country code already exists");
                } else {
                    throw new Error("Country already exists");
                }
            }
            // Handle validation errors
            if (error.name === "SequelizeValidationError") {
                const validationErrors = error.errors
                    .map((err) => err.message)
                    .join(", ");
                throw new Error(`Validation error: ${validationErrors}`);
            }
            throw new Error(`Failed to update country: ${error.message}`);
        }
    }

    /**
     * Delete country by ID (UUID)
     * @param {string} id - Country UUID
     * @returns {Promise<Object>} Deletion result
     */
    async delete(id) {
        try {
            if (!id) {
                throw new Error("Country ID is required");
            }

            // Validate UUID format
            if (!this._isValidUUID(id)) {
                throw new Error("Invalid UUID format");
            }

            const country = await Country.findByPk(id);

            if (!country) {
                throw new Error("Country not found");
            }

            await country.destroy();

            return {
                success: true,
                message: "Country deleted successfully",
            };
        } catch (error) {
            throw new Error(`Failed to delete country: ${error.message}`);
        }
    }

    /**
     * Get country by name (case-insensitive)
     * @param {string} name - Country name
     * @returns {Promise<Object>} Country data
     */
    async readByName(name) {
        try {
            if (!name || !name.trim()) {
                throw new Error("Country name is required");
            }

            const country = await Country.findOne({
                where: {
                    name: {
                        [Op.like]: name.trim(),
                    },
                },
            });

            if (!country) {
                throw new Error("Country not found");
            }

            return {
                success: true,
                data: country,
                message: "Country retrieved successfully",
            };
        } catch (error) {
            throw new Error(`Failed to retrieve country: ${error.message}`);
        }
    }

    /**
     * Get country by code (case-insensitive)
     * @param {string} code - Country code
     * @returns {Promise<Object>} Country data
     */
    async readByCode(code) {
        try {
            if (!code || !code.trim()) {
                throw new Error("Country code is required");
            }

            const country = await Country.findOne({
                where: {
                    code: code.trim().toUpperCase(),
                },
            });

            if (!country) {
                throw new Error("Country not found");
            }

            return {
                success: true,
                data: country,
                message: "Country retrieved successfully",
            };
        } catch (error) {
            throw new Error(`Failed to retrieve country: ${error.message}`);
        }
    }

    /**
     * Check if country exists by name (case-insensitive)
     * @param {string} name - Country name
     * @returns {Promise<boolean>} True if exists, false otherwise
     */
    async existsByName(name) {
        try {
            if (!name || !name.trim()) {
                return false;
            }

            const country = await Country.findOne({
                where: {
                    name: {
                        [Op.like]: name.trim(),
                    },
                },
            });

            return !!country;
        } catch (error) {
            throw new Error(
                `Failed to check country existence: ${error.message}`
            );
        }
    }

    /**
     * Check if country exists by code
     * @param {string} code - Country code
     * @returns {Promise<boolean>} True if exists, false otherwise
     */
    async existsByCode(code) {
        try {
            if (!code || !code.trim()) {
                return false;
            }

            const country = await Country.findOne({
                where: {
                    code: code.trim().toUpperCase(),
                },
            });

            return !!country;
        } catch (error) {
            throw new Error(
                `Failed to check country existence: ${error.message}`
            );
        }
    }

    /**
     * Check if country exists by ID (UUID)
     * @param {string} id - Country UUID
     * @returns {Promise<boolean>} True if exists, false otherwise
     */
    async existsById(id) {
        try {
            if (!id) {
                return false;
            }

            // Validate UUID format
            if (!this._isValidUUID(id)) {
                return false;
            }

            const country = await Country.findByPk(id);
            return !!country;
        } catch (error) {
            throw new Error(
                `Failed to check country existence: ${error.message}`
            );
        }
    }

    /**
     * Private method to validate UUID format
     * @param {string} uuid - UUID string to validate
     * @returns {boolean} True if valid UUID, false otherwise
     */
    _isValidUUID(uuid) {
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }
}

module.exports = new CountryService();
