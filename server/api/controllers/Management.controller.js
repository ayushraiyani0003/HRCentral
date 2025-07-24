/**
 * @fileoverview Controller for Management operations
 * @version 1.0.0
 */

const ManagementService = require("../../services/api/Management.service"); // Adjust path as needed

/**
 * Management Controller Class
 * Handles HTTP requests for management operations
 */
class ManagementController {
  /**
   * Create a new management record
   * @route POST /api/management
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async create(req, res) {
    console.log(req.body);
    try {
      const result = await ManagementService.create(req.body);

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
   * Get all management records
   * @route GET /api/management
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async getAll(req, res) {
    try {
      const result = await ManagementService.getAll();
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
   * Get management record by ID
   * @route GET /api/management/:id
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await ManagementService.getById(id);
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
   * Update management record by ID
   * @route PUT /api/management/:id
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const result = await ManagementService.update(id, req.body);
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
   * Delete management record by ID
   * @route DELETE /api/management/:id
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await ManagementService.delete(id);
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

module.exports = new ManagementController();
