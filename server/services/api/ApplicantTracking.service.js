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
   * @returns {Promise<Object|null>} Applicant tracking record or null if not found
   */
  async getById(id) {
    try {
      const applicant = await ApplicantTracking.findByPk(id);
      return applicant;
    } catch (error) {
      throw new Error(
        `Error fetching applicant tracking record by ID: ${error.message}`
      );
    }
  }

  /**
   * Update applicant tracking record by ID
   * @param {String} id - The applicant tracking record ID
   * @param {Object} updateData - The data to update
   * @param {Object} options - Transaction options
   * @returns {Promise<Object|null>} Updated applicant tracking record or null if not found
   */
  async update(id, updateData, options = {}) {
    try {
      const [updatedRowsCount] = await ApplicantTracking.update(updateData, {
        where: { id },
        ...options, // This will include transaction if provided
      });

      if (updatedRowsCount === 0) {
        return null;
      }

      const updatedApplicant = await ApplicantTracking.findByPk(id, options);
      return updatedApplicant;
    } catch (error) {
      throw new Error(
        `Error updating applicant tracking record: ${error.message}`
      );
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
