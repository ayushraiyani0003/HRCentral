// =================== services/Management.service.js ===================
const { Management } = require("../../models");
const { Op } = require("sequelize");

class ManagementService {
  /**
   * Create a new management record
   * @param {Object} managementData - Management data
   * @returns {Promise<Object>} Created management record
   */
  async create(managementData) {
    try {
      const management = await Management.create(managementData);
      return {
        success: true,
        data: management,
        message: "Management record created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Failed to create management record",
      };
    }
  }

  /**
   * Get all management records
   * @returns {Promise<Object>} List of management records
   */
  async getAll() {
    try {
      const managements = await Management.findAll({
        order: [["name", "ASC"]],
      });

      return {
        success: true,
        data: {
          managements,
        },
        message: "Management records retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Failed to retrieve management records",
      };
    }
  }

  /**
   * Get management record by ID
   * @param {string} id - Management ID (UUID)
   * @returns {Promise<Object>} Management data
   */
  async getById(id) {
    try {
      const management = await Management.findByPk(id);

      if (!management) {
        return {
          success: false,
          message: "Management record not found",
        };
      }

      return {
        success: true,
        data: management,
        message: "Management record retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Failed to retrieve management record",
      };
    }
  }

  /**
   * Update management record
   * @param {string} id - Management ID (UUID)
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated management record
   */
  async update(id, updateData) {
    try {
      const management = await Management.findByPk(id);

      if (!management) {
        return {
          success: false,
          message: "Management record not found",
        };
      }

      await management.update(updateData);

      return {
        success: true,
        data: management,
        message: "Management record updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Failed to update management record",
      };
    }
  }

  /**
   * Delete management record
   * @param {string} id - Management ID (UUID)
   * @returns {Promise<Object>} Deletion result
   */
  async delete(id) {
    try {
      const management = await Management.findByPk(id);

      if (!management) {
        return {
          success: false,
          message: "Management record not found",
        };
      }

      await management.destroy();

      return {
        success: true,
        message: "Management record deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Failed to delete management record",
      };
    }
  }
}

module.exports = new ManagementService();
