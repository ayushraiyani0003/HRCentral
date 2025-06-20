/**
 * @fileoverview CompanyStructure Controller
 * @version 1.0.0
 */

const CompanyStructureService = require("../../services/api/CompanyStructure.service");
const CountryService = require("../../services/api/Country.service");

class CompanyStructureController {
    constructor() {
        this.companyStructureService = new CompanyStructureService();
    }

    /**
     * Enhance company structure data with country information
     * @param {Object|Array} data - Company structure data
     * @returns {Object|Array} Enhanced data with country details
     */
    async enhanceWithCountryData(data) {
        if (!data) return data;

        const enhanceStructure = async (structure) => {
            if (structure.country_id) {
                try {
                    const country = await CountryService.getById(
                        structure.country_id
                    );
                    if (country) {
                        structure.country = {
                            id: country.id,
                            name: country.name,
                            code: country.code,
                            phone_code: country.phone_code,
                            region: country.region,
                        };
                    }
                } catch (error) {
                    console.warn(
                        `Failed to fetch country data for ID ${structure.country_id}:`,
                        error.message
                    );
                }
            }
            return structure;
        };

        if (Array.isArray(data)) {
            return Promise.all(data.map(enhanceStructure));
        } else {
            return enhanceStructure(data);
        }
    }

    /**
     * Validate country ID if provided
     * @param {string} countryId - Country ID to validate
     * @throws {Error} If country doesn't exist
     */
    async validateCountryId(countryId) {
        if (countryId) {
            const country = await CountryService.getById(countryId);
            if (!country) {
                throw new Error(`Country with ID ${countryId} not found`);
            }
        }
    }

    /**
     * Create a new company structure
     * @route POST /api/company-structure
     */
    createCompanyStructure = async (req, res) => {
        try {
            console.log(req.body); // Debug

            // Validate country ID if provided
            if (req.body.country_id) {
                await this.validateCountryId(req.body.country_id);
            }

            const companyStructure = await this.companyStructureService.create(
                req.body
            );

            // Enhance with country data
            const enhancedData = await this.enhanceWithCountryData(
                companyStructure
            );

            res.status(201).json({
                success: true,
                message: "Company structure created successfully",
                data: enhancedData,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "Failed to create company structure",
                error: error.message,
            });
        }
    };

    /**
     * Get all company structures
     * @route GET /api/company-structure
     */
    getAllCompanyStructures = async (req, res) => {
        try {
            const { limit, offset, includeCountry, country_id, region } =
                req.query;
            const options = {
                limit: limit ? parseInt(limit) : undefined,
                offset: offset ? parseInt(offset) : undefined,
                includeCountry: includeCountry === "true",
                country_id: country_id,
                region: region,
            };

            const companyStructures = await this.companyStructureService.getAll(
                options
            );

            // Enhance with country data if requested or if country filtering is applied
            let enhancedData = companyStructures;
            if (includeCountry === "true" || country_id || region) {
                if (companyStructures.data) {
                    enhancedData = {
                        ...companyStructures,
                        data: await this.enhanceWithCountryData(
                            companyStructures.data
                        ),
                    };
                } else {
                    enhancedData = await this.enhanceWithCountryData(
                        companyStructures
                    );
                }
            }

            res.status(200).json({
                success: true,
                message: "Company structures retrieved successfully",
                data: enhancedData,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve company structures",
                error: error.message,
            });
        }
    };

    /**
     * Get company structure by ID
     * @route GET /api/company-structure/:id
     */
    getCompanyStructureById = async (req, res) => {
        try {
            const { id } = req.params;
            const { includeCountry } = req.query;
            console.log(id);

            const companyStructure = await this.companyStructureService.getById(
                id,
                includeCountry === "true"
            );

            if (!companyStructure) {
                return res.status(404).json({
                    success: false,
                    message: "Company structure not found",
                });
            }

            // Enhance with country data
            const enhancedData = await this.enhanceWithCountryData(
                companyStructure
            );

            res.status(200).json({
                success: true,
                message: "Company structure retrieved successfully",
                data: enhancedData,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve company structure",
                error: error.message,
            });
        }
    };

    /**
     * Update company structure by ID
     * @route PUT /api/company-structure/:id
     */
    updateCompanyStructure = async (req, res) => {
        console.log(req.body);

        try {
            const { id } = req.params;

            // Validate country ID if provided in update data
            if (req.body.country_id) {
                await this.validateCountryId(req.body.country_id);
            }

            const updatedCompanyStructure =
                await this.companyStructureService.update(id, req.body);

            if (!updatedCompanyStructure) {
                return res.status(404).json({
                    success: false,
                    message: "Company structure not found",
                });
            }

            // Enhance with country data
            const enhancedData = await this.enhanceWithCountryData(
                updatedCompanyStructure
            );

            res.status(200).json({
                success: true,
                message: "Company structure updated successfully",
                data: enhancedData,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "Failed to update company structure",
                error: error.message,
            });
        }
    };

    /**
     * Delete company structure by ID
     * @route DELETE /api/company-structure/:id
     */
    deleteCompanyStructure = async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await this.companyStructureService.delete(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: "Company structure not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Company structure deleted successfully",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to delete company structure",
                error: error.message,
            });
        }
    };

    /**
     * Get company structures by country
     * @route GET /api/company-structure/by-country/:countryId
     */
    getByCountry = async (req, res) => {
        try {
            const { countryId } = req.params;
            const { limit, offset } = req.query;

            // Validate country exists
            await this.validateCountryId(countryId);

            const options = {
                limit: limit ? parseInt(limit) : undefined,
                offset: offset ? parseInt(offset) : undefined,
                country_id: countryId,
                includeCountry: true,
            };

            const companyStructures = await this.companyStructureService.getAll(
                options
            );
            const enhancedData = await this.enhanceWithCountryData(
                companyStructures
            );

            res.status(200).json({
                success: true,
                message: "Company structures retrieved by country successfully",
                data: enhancedData,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve company structures by country",
                error: error.message,
            });
        }
    };

    /**
     * Get company structures by region
     * @route GET /api/company-structure/by-region/:region
     */
    getByRegion = async (req, res) => {
        try {
            const { region } = req.params;
            const { limit, offset } = req.query;

            const options = {
                limit: limit ? parseInt(limit) : undefined,
                offset: offset ? parseInt(offset) : undefined,
                region: region,
                includeCountry: true,
            };

            const companyStructures = await this.companyStructureService.getAll(
                options
            );
            const enhancedData = await this.enhanceWithCountryData(
                companyStructures
            );

            res.status(200).json({
                success: true,
                message: "Company structures retrieved by region successfully",
                data: enhancedData,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve company structures by region",
                error: error.message,
            });
        }
    };

    /**
     * Get hierarchical structure for a specific entity
     * @route GET /api/company-structure/hierarchy/:id
     */
    getHierarchy = async (req, res) => {
        try {
            const { id } = req.params;
            const { includeCountry } = req.query;

            const hierarchy = await this.companyStructureService.getHierarchy(
                id
            );

            if (!hierarchy) {
                return res.status(404).json({
                    success: false,
                    message: "Company structure not found",
                });
            }

            // Enhance with country data if requested
            let enhancedData = hierarchy;
            if (includeCountry === "true") {
                enhancedData = await this.enhanceWithCountryData(hierarchy);
            }

            res.status(200).json({
                success: true,
                message: "Hierarchy retrieved successfully",
                data: enhancedData,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve hierarchy",
                error: error.message,
            });
        }
    };

    /**
     * Get complete company structure tree
     * @route GET /api/company-structure/tree
     */
    getCompanyTree = async (req, res) => {
        try {
            const { includeCountry } = req.query;

            const tree = await this.companyStructureService.getTree();

            // Enhance with country data if requested
            let enhancedData = tree;
            if (includeCountry === "true") {
                enhancedData = await this.enhanceWithCountryData(tree);
            }

            res.status(200).json({
                success: true,
                message: "Company tree retrieved successfully",
                data: enhancedData,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve company tree",
                error: error.message,
            });
        }
    };

    /**
     * Get all direct children of a parent entity
     * @route GET /api/company-structure/children/:parentId
     */
    getChildren = async (req, res) => {
        try {
            const { parentId } = req.params;
            const { includeCountry } = req.query;

            const children = await this.companyStructureService.getChildren(
                parentId
            );

            // Enhance with country data if requested
            let enhancedData = children;
            if (includeCountry === "true") {
                enhancedData = await this.enhanceWithCountryData(children);
            }

            res.status(200).json({
                success: true,
                message: "Children retrieved successfully",
                data: enhancedData,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve children",
                error: error.message,
            });
        }
    };

    /**
     * Get all ancestors of a specific entity
     * @route GET /api/company-structure/ancestors/:id
     */
    getAncestors = async (req, res) => {
        try {
            const { id } = req.params;
            const { includeCountry } = req.query;

            const ancestors = await this.companyStructureService.getAncestors(
                id
            );

            // Enhance with country data if requested
            let enhancedData = ancestors;
            if (includeCountry === "true") {
                enhancedData = await this.enhanceWithCountryData(ancestors);
            }

            res.status(200).json({
                success: true,
                message: "Ancestors retrieved successfully",
                data: enhancedData,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve ancestors",
                error: error.message,
            });
        }
    };

    /**
     * Move an entity to a different parent
     * @route PUT /api/company-structure/:id/move
     */
    moveEntity = async (req, res) => {
        try {
            const { id } = req.params;
            const { newParentId, country_id } = req.body;

            // Validate country ID if provided
            if (country_id) {
                await this.validateCountryId(country_id);
            }

            const result = await this.companyStructureService.moveEntity(
                id,
                newParentId,
                req.body
            );

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: "Entity not found or move operation failed",
                });
            }

            // Enhance with country data
            const enhancedData = await this.enhanceWithCountryData(result);

            res.status(200).json({
                success: true,
                message: "Entity moved successfully",
                data: enhancedData,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "Failed to move entity",
                error: error.message,
            });
        }
    };

    /**
     * Get country statistics for company structures
     * @route GET /api/company-structure/stats/countries
     */
    getCountryStats = async (req, res) => {
        try {
            const stats = await this.companyStructureService.getCountryStats();

            res.status(200).json({
                success: true,
                message: "Country statistics retrieved successfully",
                data: stats,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve country statistics",
                error: error.message,
            });
        }
    };
}

module.exports = new CompanyStructureController();
