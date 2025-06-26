/**
 * @fileoverview JobLocation Controller - Handles HTTP requests for job location operations
 * @version 1.0.0
 */

const JobLocationService = require("../../services/api/JobLocation.service");

/**
 * JobLocation Controller
 * @class JobLocationController
 */
class JobLocationController {
    /**
     * Create a new job location
     * @param {Object} req - Express request object
     * @param {Object} req.body - Request body with job location data
     * @param {string} req.body.name - Job location name
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response
     */
    static async create(req, res) {
        try {
            const result = await JobLocationService.create(req.body);

            return res.status(201).json({
                success: true,
                message: result.message,
                data: result.data,
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
     * Get all job locations with pagination and search
     * @param {Object} req - Express request object
     * @param {Object} req.query - Query params for pagination and search
     * @param {number} req.query.limit - Limit of records
     * @param {number} req.query.offset - Offset value
     * @param {string} req.query.search - Search term
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response
     */
    static async getAll(req, res) {
        try {
            const { limit, offset, search } = req.query;
            const result = await JobLocationService.getAll({
                limit,
                offset,
                search,
            });

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.data.jobLocations,
                pagination: result.data.pagination,
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
     * Get job location by ID
     * @param {Object} req - Express request object
     * @param {string} req.params.id - Job location UUID
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response
     */
    static async getById(req, res) {
        try {
            const result = await JobLocationService.getById(req.params.id);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
                data: null,
            });
        }
    }

    /**
     * Update a job location
     * @param {Object} req - Express request object
     * @param {string} req.params.id - Job location UUID
     * @param {Object} req.body - Updated data
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response
     */
    static async update(req, res) {
        try {
            const result = await JobLocationService.update(
                req.params.id,
                req.body
            );

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
                data: null,
            });
        }
    }

    /**
     * Delete a job location
     * @param {Object} req - Express request object
     * @param {string} req.params.id - Job location UUID
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response
     */
    static async delete(req, res) {
        try {
            const result = await JobLocationService.delete(req.params.id);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
                data: null,
            });
        }
    }
}

module.exports = JobLocationController;
