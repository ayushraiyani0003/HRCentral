/**
 * @fileoverview ManPowerRequisition Controller - Handles HTTP requests for manpower requisition operations
 * @version 1.0.0
 */
const ManPowerRequisitionService = require("../../services/api/ManPowerRequisition.service");

/**
 * ManPowerRequisition Controller
 * Handles all HTTP requests related to manpower requisition operations
 * @class ManPowerRequisitionController
 */

class ManPowerRequisitionController {
  constructor() {
    this.createManPowerRequisition = this.createManPowerRequisition.bind(this);
    this.generateRequisitionId = this.generateRequisitionId.bind(this);
  }

  /**
   * Generate next requisition ID
   * @returns {Promise<string>} Generated requisition ID in format req01, req02, etc.
   */
  async generateRequisitionId() {
    try {
      console.log("Generating requisition ID...");

      // Get the last requisition to determine the next sequential number
      const lastRequisition =
        await ManPowerRequisitionService.getLastRequisition();
      console.log(lastRequisition);

      let nextNumber = 1;

      if (lastRequisition && lastRequisition.requisition_id) {
        //Extract number from requisition_id
        const lastIdNumber = lastRequisition.requisition_id.replace("req", "");
        nextNumber = parseInt(lastIdNumber, 10) + 1;
      }

      // Formate number with leading zeros
      const formattedNumber = nextNumber.toString().padStart(4, "0");

      return `req${formattedNumber}`;
    } catch (error) {
      throw new Error(`Failed to generate requisition ID: ${error.message}`);
    }
  }
  /**
   * Create a new manpower requisition
   * @param {Object} req - E xpress request object
   * @param {Object} req.body - Request body containing requisition data
   * @param {string} req.body.requested_date - Date when the manpower requisition was requested
   * @param {string} req.body.requirement_for_department_id - Foreign key reference to CompanyStructure table
   * @param {string} req.body.requirement_for_designation_id - Foreign key reference to Designation table
   * @param {number} req.body.number_of_positions - Number of positions required
   * @param {number} req.body.experience_required - Years of experience required
   * @param {string} req.body.requirement_category - Category: permanent, technical, or FixedTerm
   * @param {string} req.body.requirement_type - Type: replacement, additional, budgeted, or NonBudgeted
   * @param {string} req.body.expected_joining_date - Expected joining date
   * @param {string} req.body.job_description - Detailed job description
   * @param {string} req.body.requested_by_id - Foreign key reference to Employee who requested
   * @param {string} [req.body.agreed_by_id] - Foreign key reference to Employee who agreed
   * @param {string} [req.body.approved_by_id] - Foreign key reference to Management who approved
   * @param {string} [req.body.approved_date] - Date when requisition was approved
   * @param {string} [req.body.requisition_status] - Current status of requisition process
   * @param {string} [req.body.approval_status] - Approval status of requisition
   * @param {Object} res - Express response object
   * @returns {Promise<Object>} JSON response with created requisition or error
   */
  async createManPowerRequisition(req, res) {
    try {
      const requisitionData = req.body;
      console.log(requisitionData);

      // Generate unique requisition_id
      requisitionData.requisition_id = await this.generateRequisitionId();
      console.log(requisitionData.requisition_id);

      const requisition = await ManPowerRequisitionService.create(
        requisitionData
      );

      return res.status(201).json({
        success: true,
        message: "Manpower requisition created successfully",
        data: requisition,
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
   * Get all manpower requisitions
   * @param {Object} req - Express request object
   * @param {Object} req.query - Query parameters for filtering/pagination
   * @param {string} [req.query.requisition_status] - Filter by requisition status
   * @param {string} [req.query.approval_status] - Filter by approval status
   * @param {string} [req.query.requirement_category] - Filter by requirement category
   * @param {string} [req.query.requirement_type] - Filter by requirement type
   * @param {string} [req.query.department_id] - Filter by department ID
   * @param {string} [req.query.designation_id] - Filter by designation ID
   * @param {number} [req.query.page] - Page number for pagination
   * @param {number} [req.query.limit] - Number of records per page
   * @param {Object} res - Express response object
   * @returns {Promise<Object>} JSON response with requisitions list or error
   */

  async getAllManPowerRequisitions(req, res) {
    try {
      const queryParams = req.body;
      const requisitions = await ManPowerRequisitionService.getall(queryParams);

      return res.status(200).json({
        success: true,
        message: "ManPower Requisition retrieved successfully",
        data: requisitions,
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
   * Get a manpower requisition by ID
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.id - Requisition ID to retrieve
   * @param {Object} res - Express response object
   * @returns {Promise<Object>} JSON response with requisition data or error
   */

  async getManPowerRequisitionById(req, res) {
    try {
      const { id } = req.params;
      const requisitions = await ManPowerRequisitionService.getById(id);

      if (!requisitions) {
        return res.status(404).json({
          success: false,
          message: "ManPower requisition not found",
          data: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "ManPower requisition retrieved successfully",
        data: requisitions,
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
   * Update a manpower requisition
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.id - Requisition ID to update
   * @param {Object} req.body - Request body containing updated requisition data
   * @param {string} [req.body.requested_date] - Date when the manpower requisition was requested
   * @param {string} [req.body.requirement_for_department_id] - Foreign key reference to CompanyStructure table
   * @param {string} [req.body.requirement_for_designation_id] - Foreign key reference to Designation table
   * @param {number} [req.body.number_of_positions] - Number of positions required
   * @param {number} [req.body.experience_required] - Years of experience required
   * @param {string} [req.body.requirement_category] - Category: permanent, technical, or FixedTerm
   * @param {string} [req.body.requirement_type] - Type: replacement, additional, budgeted, or NonBudgeted
   * @param {string} [req.body.expected_joining_date] - Expected joining date
   * @param {string} [req.body.job_description] - Detailed job description
   * @param {string} [req.body.requested_by_id] - Foreign key reference to Employee who requested
   * @param {string} [req.body.agreed_by_id] - Foreign key reference to Employee who agreed
   * @param {string} [req.body.approved_by_id] - Foreign key reference to Management who approved
   * @param {string} [req.body.approved_date] - Date when requisition was approved
   * @param {string} [req.body.requisition_status] - Current status of requisition process
   * @param {string} [req.body.approval_status] - Approval status of requisition
   * @param {Array<string>} [req.body.applicant_ids] - Array of applicant IDs from Employee table
   * @param {Object} res - Express response object
   * @returns {Promise<Object>} JSON response with updated requisition or error
   */

  async updateManPowerRequisition(req, res) {
    try {
      const { id } = req.params;
      const { applicant_ids, ...updateData } = req.body; //Array of applicant IDs from Employee table: ["uuid1","uuid2"]
      console.log(applicant_ids);
      console.log(req.body);
      //prepare update data with applicant ids handling
      const updateDataWithApplicants = {
        ...updateData,
        applicant_id:
          applicant_ids && applicant_ids.length > 0
            ? global.JSON.stringify(applicant_ids)
            : null,
      };

      const requisition = await ManPowerRequisitionService.update(
        id,
        updateDataWithApplicants
      );

      return res.status(200).json({
        success: true,
        message: "ManPower Requisition updated successfully",
        data: {
          requisition, // not compulsory just for information
          updated_records: {
            applicant_count: applicant_ids ? applicant_ids.length : 0,
            applicants_set: !!(applicant_ids && applicant_ids.length > 0),
          },
        },
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
   * Delete a manpower requisition by ID
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.id - Requisition ID to delete
   * @param {Object} res - Express response object
   * @returns {Promise<Object>} JSON response with deletion confirmation or error
   */

  async deleteManPowerRequisition(req, res) {
    try {
      const { id } = req.params;
      const requisition = await ManPowerRequisitionService.delete(id);

      if (!requisition) {
        return res.status(404).json({
          success: false,
          message: "ManPower requisition not found",
          data: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "ManPower requisition deleted successfully",
        data: requisition,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }
}

module.exports = new ManPowerRequisitionController();
