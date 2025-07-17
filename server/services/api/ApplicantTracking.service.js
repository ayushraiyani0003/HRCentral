// =================== services/ApplicantTracking.service.js ===================
const { ApplicantTracking } = require("../../models");

class ApplicantTrackingService {
  /**
   * Create a new applicant tracking record
   * @param {Object} applicantData - The applicant data to create
   * @returns {Promise<Object>} Created applicant tracking record
   */
  async create(applicantData) {
    try {
      const applicant = await ApplicantTracking.create(applicantData);
      return applicant;
    } catch (error) {
      throw new Error(
        `Error creating applicant tracking record: ${error.message}`
      );
    }
  }

  /**
   * Get all applicant tracking records
   * @returns {Promise<Array>} Array of applicant tracking records
   */
  async getAll() {
    try {
      const applicants = await ApplicantTracking.findAll();

      return applicants;
    } catch (error) {
      throw new Error(
        `Error fetching applicant tracking records: ${error.message}`
      );
    }
  }

  /**
   * Get applicant tracking record by ID
   * @param {String} id - The applicant tracking record ID
   * @returns {Promise<Object>} Response object with success flag and data
   */
  async getById(id) {
    try {
      const applicant = await ApplicantTracking.findByPk(id);

      if (!applicant) {
        return {
          success: false,
          message: "Applicant not found",
          data: null,
        };
      }

      return {
        success: true,
        message: "Applicant found successfully",
        data: applicant.toJSON(), // Convert Sequelize instance to plain object
      };
    } catch (error) {
      return {
        success: false,
        message: `Error fetching applicant tracking record by ID: ${error.message}`,
        data: null,
      };
    }
  }
  /**
   * Update applicant tracking record by ID
   * @param {String} id - The applicant tracking record ID
   * @param {Object} updateData - The data to update
   * @param {Object} options - Transaction options
   * @returns {Promise<Object>} Response object with success flag and data
   */
  async update(id, updateData, options = {}) {
    try {
      const [updatedRowsCount] = await ApplicantTracking.update(updateData, {
        where: { id },
        ...options, // This will include transaction if provided
      });

      if (updatedRowsCount === 0) {
        return {
          success: false,
          message: "Applicant not found or no changes made",
          data: null,
        };
      }

      const updatedApplicant = await ApplicantTracking.findByPk(id, options);

      if (!updatedApplicant) {
        return {
          success: false,
          message: "Applicant not found after update",
          data: null,
        };
      }

      return {
        success: true,
        message: "Applicant updated successfully",
        data: updatedApplicant.toJSON(), // Convert Sequelize instance to plain object
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating applicant tracking record: ${error.message}`,
        data: null,
      };
    }
  }

  /**
   * Delete applicant tracking record by ID
   * @param {String} id - The applicant tracking record ID
   * @returns {Promise<Boolean>} True if deleted, false if not found
   */
  async delete(id) {
    try {
      const deletedRowsCount = await ApplicantTracking.destroy({
        where: { id },
      });

      return deletedRowsCount > 0;
    } catch (error) {
      throw new Error(
        `Error deleting applicant tracking record: ${error.message}`
      );
    }
  }
}

module.exports = new ApplicantTrackingService();
