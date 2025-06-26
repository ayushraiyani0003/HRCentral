/**
 * Company Structure Service
 * Handles CRUD operations for company structure entities
 */

const { CompanyStructure } = require("../../models");
const { Op } = require("sequelize");

class CompanyStructureService {
    /**
     * Create a new company structure
     * @param {Object} data - Company structure data
     * @param {string} data.name - Name of the structure
     * @param {string} data.details - Details about the structure
     * @param {string} [data.address] - Address of the structure
     * @param {string} data.type - Type of structure (company, head office, etc.)
     * @param {string} data.country_id - Country ID (UUID reference to Country table)
     * @param {string} [data.parent_id] - Parent structure ID
     * @param {number} [data.head] - Head employee ID
     * @returns {Promise<Object>} Created company structure
     */
    async create(data) {
        try {
            const companyStructure = await CompanyStructure.create(data);
            return companyStructure;
        } catch (error) {
            throw new Error(
                `Failed to create company structure: ${error.message}`
            );
        }
    }

    /**
     * Get all company structures
     * @param {Object} [options] - Query options
     * @param {number} [options.limit] - Limit number of results
     * @param {number} [options.offset] - Offset for pagination
     * @param {boolean} [options.includeCountry] - Include country data
     * @returns {Promise<Array>} Array of company structures
     */
    async getAll(options = {}) {
        try {
            const { limit, offset, includeCountry = false } = options;
            const includeOptions = [];

            if (includeCountry) {
                includeOptions.push({
                    association: "country",
                    attributes: ["id", "name", "code", "phone_code", "region"],
                });
            }

            const companyStructures = await CompanyStructure.findAll({
                limit,
                offset,
                include: includeOptions,
                order: [["created_at", "DESC"]],
            });
            return companyStructures;
        } catch (error) {
            throw new Error(
                `Failed to fetch company structures: ${error.message}`
            );
        }
    }

    /**
     * Get company structure by ID
     * @param {string} id - Company structure ID (UUID)
     * @param {boolean} [includeCountry] - Include country data
     * @returns {Promise<Object|null>} Company structure or null if not found
     */
    async getById(id, includeCountry = false) {
        try {
            const includeOptions = [];

            if (includeCountry) {
                includeOptions.push({
                    association: "country",
                    attributes: ["id", "name", "code", "phone_code", "region"],
                });
            }

            const companyStructure = await CompanyStructure.findByPk(id, {
                include: includeOptions,
            });
            return companyStructure;
        } catch (error) {
            throw new Error(
                `Failed to fetch company structure: ${error.message}`
            );
        }
    }

    /**
     * Get company structure by structure ID
     * @param {number} structureId - Auto-incremented structure ID
     * @param {boolean} [includeCountry] - Include country data
     * @returns {Promise<Object|null>} Company structure or null if not found
     */
    async getByStructureId(structureId, includeCountry = false) {
        try {
            const includeOptions = [];

            if (includeCountry) {
                includeOptions.push({
                    association: "country",
                    attributes: ["id", "name", "code", "phone_code", "region"],
                });
            }

            const companyStructure = await CompanyStructure.findOne({
                where: { structure_id: structureId },
                include: includeOptions,
            });
            return companyStructure;
        } catch (error) {
            throw new Error(
                `Failed to fetch company structure: ${error.message}`
            );
        }
    }

    /**
     * Update company structure by ID
     * @param {string} id - Company structure ID (UUID)
     * @param {Object} data - Updated company structure data
     * @returns {Promise<Object|null>} Updated company structure or null if not found
     */
    async update(id, data) {
        try {
            const [updatedRowsCount] = await CompanyStructure.update(data, {
                where: { id },
                returning: true,
            });

            if (updatedRowsCount === 0) {
                return null;
            }

            const updatedCompanyStructure = await this.getById(id, false);
            return updatedCompanyStructure;
        } catch (error) {
            throw new Error(
                `Failed to update company structure: ${error.message}`
            );
        }
    }

    /**
     * Delete company structure by ID
     * @param {string} id - Company structure ID (UUID)
     * @returns {Promise<boolean>} True if deleted, false if not found
     */
    async delete(id) {
        try {
            const deletedRowsCount = await CompanyStructure.destroy({
                where: { id },
            });
            return deletedRowsCount > 0;
        } catch (error) {
            throw new Error(
                `Failed to delete company structure: ${error.message}`
            );
        }
    }

    /**
     * Get company structures by type
     * @param {string} type - Structure type
     * @returns {Promise<Array>} Array of company structures
     */
    async getByType(type) {
        try {
            const companyStructures = await CompanyStructure.findAll({
                where: { type },
                order: [["created_at", "DESC"]],
            });
            return companyStructures;
        } catch (error) {
            throw new Error(
                `Failed to fetch company structures by type: ${error.message}`
            );
        }
    }

    /**
     * Get company structures by country ID
     * @param {string} countryId - Country ID (UUID)
     * @returns {Promise<Array>} Array of company structures
     */
    async getByCountryId(countryId) {
        try {
            const companyStructures = await CompanyStructure.findAll({
                where: { country_id: countryId },
                include: [
                    {
                        association: "country",
                        attributes: [
                            "id",
                            "name",
                            "code",
                            "phone_code",
                            "region",
                        ],
                    },
                ],
                order: [["created_at", "DESC"]],
            });
            return companyStructures;
        } catch (error) {
            throw new Error(
                `Failed to fetch company structures by country: ${error.message}`
            );
        }
    }
}

module.exports = CompanyStructureService;
