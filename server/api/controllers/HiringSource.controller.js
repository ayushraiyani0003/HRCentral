/**
 * @fileoverview Controller for Hiring Source operations
 * @version 1.0.0
 */

const HiringSourceService = require("../../services/api/HiringSource.service"); // Adjust path as needed

/**
 * HiringSource Controller Class
 * Handles HTTP requests for hiring source operations
 */
class HiringSourceController {
  /**
   * Create a new hiring source
   * @route POST /api/hiring-sources
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async create(req, res) {
    console.log(req.body);
    try {
      const result = await HiringSourceService.create(req.body);

      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
        error: "Bad Request",
      });
    }
  }

  /**
   * Get all hiring sources
   * @route GET /api/hiring-sources
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async getAll(req, res) {
    try {
      const result = await HiringSourceService.getAll();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
        error: "Internal Server Error",
      });
    }
  }

  /**
   * Get hiring source by ID
   * @route GET /api/hiring-sources/:id
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await HiringSourceService.getById(id);
      return res.status(200).json(result);
    } catch (error) {
      const statusCode = error.message.includes("not found")
        ? 404
        : error.message.includes("Invalid UUID")
        ? 400
        : 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message,
        error:
          statusCode === 404
            ? "Not Found"
            : statusCode === 400
            ? "Bad Request"
            : "Internal Server Error",
      });
    }
  }

  /**
   * Update hiring source by ID
   * @route PUT /api/hiring-sources/:id
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const result = await HiringSourceService.update(id, req.body);
      return res.status(200).json(result);
    } catch (error) {
      const statusCode = error.message.includes("not found")
        ? 404
        : error.message.includes("Invalid UUID")
        ? 400
        : error.message.includes("already exists")
        ? 409
        : 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message,
        error:
          statusCode === 404
            ? "Not Found"
            : statusCode === 400
            ? "Bad Request"
            : statusCode === 409
            ? "Conflict"
            : "Internal Server Error",
      });
    }
  }

  /**
   * Delete hiring source by ID
   * @route DELETE /api/hiring-sources/:id
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await HiringSourceService.delete(id);
      return res.status(200).json(result);
    } catch (error) {
      const statusCode = error.message.includes("not found")
        ? 404
        : error.message.includes("Invalid UUID")
        ? 400
        : 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message,
        error:
          statusCode === 404
            ? "Not Found"
            : statusCode === 400
            ? "Bad Request"
            : "Internal Server Error",
      });
    }
  }
}

module.exports = new HiringSourceController();
