// =================== services/ManPowerRequisition.service.js ===================

const { ManPowerRequisition } = require("../../models");

class ManPowerRequisitionService {
  /**
   * Create a new manpower requisition
   * @param {Object} requisitionData - The requisition data
   * @returns {Promise<Object>} - Created requisition with associations
   */

  async create(requisitionData) {
    try {
      const requisition = await ManPowerRequisition.create(requisitionData);
      return requisition;
    } catch (error) {
      throw new Error(`Error creating requisition record: ${error.message}`);
    }
  }

  /**
   * Get all manpower requisitions with optional filtering and pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} - Paginated requisitions with associations
   */
  async getall() {
    try {
      const requisitions = await ManPowerRequisition.findAll();

      return requisitions;
    } catch (error) {
      throw new Error(`Error fetching requisition records: ${error.message}`);
    }
  }

  /**
   * Get a specific manpower requisition by ID
   * @param {string} id - Requisition ID
   * @returns {Promise<Object>} - Requisition with associations
   */
  async getById(id) {
    try {
      const requisition = await ManPowerRequisition.findByPk(id);

      return requisition;
    } catch (error) {
      throw new Error(`Error fetching requisition by id: ${error.message}`);
    }
  }

  /**
   * Update a manpower requisition
   * @param {string} id - Requisition ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - Updated requisition with associations
   */
  async update(id, updateData) {
    try {
      const requisition = await ManPowerRequisition.findByPk(id);
      if (!requisition) {
        throw new Error("Manpower requisition not found");
      }

      await requisition.update(updateData);
      return requisition;
    } catch (error) {
      throw new Error(`Error updating manpower requisition: ${error.message}`);
    }
  }

  /**
   * Delete a manpower requisition
   * @param {string} id - Requisition ID
   * @returns {Promise<boolean>} - Success status
   */
  async delete(id) {
    try {
      const requisition = await ManPowerRequisition.findByPk(id);
      if (!requisition) {
        throw new Error("Manpower requisition not found");
      }

      await requisition.destroy();
      return true;
    } catch (error) {
      throw new Error(`Error deleting manpower requisition: ${error.message}`);
    }
  }
}

module.exports = new ManPowerRequisitionService();
