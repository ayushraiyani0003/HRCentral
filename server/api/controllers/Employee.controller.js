/**
 * Employee Controller
 * Handles HTTP requests for Employee operations
 */

const EmployeeService = require("../../services/api/Employee.service");
const ApplicantTrackingService = require("../../services/api/ApplicantTracking.service");
const EmployeeDetailsService = require("../../services/api/EmployeeDetails.service");
const ApplicantEducationService = require("../../services/api/ApplicantEducation.service");
const ApplicantWorkHistoryService = require("../../services/api/ApplicantWorkHistory.service");
const LanguageService = require("../../services/api/Language.service");
const { sequelize } = require("../../models");
const { log } = require("winston");
// const {
//   Employee,
//   EmployeeDetails,
//   ApplicantTracking,
// } = require("../../models");

class EmployeeController {
  /**
   * Create a new EMPLOYEE by copying data from ApplicantTracking
   * and create EmployeeDetails with manual entry
   * POST /api/employees
   */
  createEmployee = async (req, res) => {
    //start transaction for rollback capability
    const transaction = await sequelize.transaction();

    try {
      const {
        applicant_id, //Required: ID of the applicant to convert to employee
        employeeDetailsData, // Manual entry data for EmployeeDetails
        ...manualEmployeeData // Any additional/override data for employee
      } = req.body;

      // Validate required applicant_id
      if (!applicant_id) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "applicant_id is required to create employee",
          data: null,
        });
      }

      // Fetch applicant data from ApplicantTracking
      const applicantResult = await ApplicantTrackingService.getById(
        applicant_id
      );

      if (!applicantResult || !applicantResult.success) {
        await transaction.rollback();
        //console.log("Fetching applicant with ID:", applicant_id);
        return res.status(404).json({
          success: false,
          message: "Applicant not found",
          data: null,
        });
      }
      const applicantData = applicantResult.data;

      // Prepare employee data by copying matching fields from ApplicantTracking
      const employeeDataToCopy = {
        applicant_id: applicantData.id,
      };

      // Copy all matching fields from applicant data and allow overrides
      Object.keys(applicantData).forEach((field) => {
        if (manualEmployeeData[field] !== undefined) {
          // Use manual data if provided (override)
          employeeDataToCopy[field] = manualEmployeeData[field];
        } else if (
          applicantData[field] !== undefined &&
          applicantData[field] !== null
        ) {
          // Use applicant data as default
          employeeDataToCopy[field] = applicantData[field];
        }
      });

      // Ensure employment_status is set (default to Active if not provided)
      if (!employeeDataToCopy.employment_status) {
        employeeDataToCopy.employment_status = "Active";
      }

      // Create EmployeeDetails record first if data is provided
      let employeeDetailsResult = null;
      if (employeeDetailsData) {
        employeeDetailsResult = await EmployeeDetailsService.create(
          employeeDetailsData,
          { transaction }
        );

        if (!employeeDetailsResult || !employeeDetailsResult.success) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: "Failed to create employee details",
            data: null,
          });
        }

        // Add employeeDetails_id to the employee data
        employeeDataToCopy.employeeDetails_id = employeeDetailsResult.data.id;
      }

      // Create employee record
      const employeeResult = await EmployeeService.create(employeeDataToCopy, {
        transaction,
      });

      if (!employeeResult || !employeeResult.success) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Failed to create employee",
          data: null,
        });
      }
      // Optionally update applicant status to 'hired'
      await ApplicantTrackingService.update(
        applicant_id,
        { status: "hired" },
        { transaction }
      );

      // Commit transaction
      await transaction.commit();

      // Return success response
      res.status(201).json({
        success: true,
        message: "Employee created successfully from applicant data",
        data: {
          employee: employeeResult.data,
          employeeDetails: employeeDetailsResult
            ? employeeDetailsResult.data
            : null,
          copied_from_applicant: applicant_id,
          applicant_status_updated: true,
          fields_copied_from_applicant: Object.keys(applicantData).filter(
            (field) =>
              applicantData[field] !== undefined &&
              applicantData[field] !== null &&
              manualEmployeeData[field] === undefined
          ),
          fields_modified_or_overridden: Object.keys(manualEmployeeData),
        },
      });
    } catch (error) {
      // Rollback transaction on any error
      await transaction.rollback();
      console.error("Error in createEmployee:", error);
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  };

  /**
   * Update employee with related data
   * PUT /api/employees/:id
   */
  updateEmployee = async (req, res) => {
    // Start transaction for rollback capability
    const transaction = await sequelize.transaction();

    try {
      const { id } = req.params;
      const {
        educationData,
        workHistoryData,
        employeeDetailsData,
        languages, // Array of language UUIDs: ["uuid1", "uuid2"]
        referenceEmployee, // Single reference employee UUID: "uuid"
        hiringSource, // Single hiring source ID from hiring source table
        ...employeeData
      } = req.body;

      // Check if employee exists
      const existingEmployee = await EmployeeService.getById(id);
      if (!existingEmployee || !existingEmployee.success) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: "Employee not found",
          data: null,
        });
      }

      const employee = existingEmployee.data;
      let educationIds = [];
      let workHistoryIds = [];

      // Update education records if provided (optional)
      if (educationData && Array.isArray(educationData)) {
        try {
          for (const education of educationData) {
            let educationResult;

            if (education.id) {
              educationResult = await ApplicantEducationService.updateEducation(
                education.id,
                education,
                { transaction }
              );
            } else {
              educationResult = await ApplicantEducationService.addEducation(
                education,
                { transaction }
              );
            }

            if (!educationResult) {
              console.warn("Education service returned undefined/null result");
              continue;
            }

            if (!educationResult.success) {
              console.warn(
                `Failed to update/create education: ${
                  educationResult.error || "Unknown error"
                }`
              );
            } else if (educationResult.data && educationResult.data.id) {
              educationIds.push(educationResult.data.id);
            }
          }
        } catch (error) {
          console.warn(`Education update failed: ${error.message}`);
        }
      }

      // Update work history records if provided (optional)
      if (workHistoryData && Array.isArray(workHistoryData)) {
        try {
          for (const workHistory of workHistoryData) {
            let workHistoryResult;

            if (workHistory.id) {
              workHistoryResult =
                await ApplicantWorkHistoryService.updateWorkHistory(
                  workHistory.id,
                  workHistory,
                  { transaction }
                );
            } else {
              workHistoryResult =
                await ApplicantWorkHistoryService.addWorkHistory(workHistory, {
                  transaction,
                });
            }

            if (!workHistoryResult) {
              console.warn(
                "Work history service returned undefined/null result"
              );
              continue;
            }

            if (!workHistoryResult.success) {
              console.warn(
                `Failed to update/create work history: ${
                  workHistoryResult.error || "Unknown error"
                }`
              );
            } else if (workHistoryResult.data && workHistoryResult.data.id) {
              workHistoryIds.push(workHistoryResult.data.id);
            }
          }
        } catch (error) {
          console.warn(`Work history update failed: ${error.message}`);
        }
      }

      // Update employee details if provided (optional)
      let employeeDetailsResult = null;
      let cleanDetails = null;

      if (employeeDetailsData && employee.employeeDetails_id) {
        try {
          employeeDetailsResult = await EmployeeDetailsService.update(
            employee.employeeDetails_id,
            employeeDetailsData,
            { transaction }
          );

          if (!employeeDetailsResult || !employeeDetailsResult.success) {
            console.warn("Failed to update employee details");
          } else {
            const { employeeDetails_id, ...restDetails } =
              employeeDetailsResult.data;
            cleanDetails = restDetails;
          }
        } catch (error) {
          console.warn(`Employee details update failed: ${error.message}`);
        }
      } else if (employeeDetailsData && !employee.employeeDetails_id) {
        try {
          const newEmployeeDetails = await EmployeeDetailsService.create(
            employeeDetailsData,
            { transaction }
          );

          if (newEmployeeDetails && newEmployeeDetails.success) {
            employeeDetailsResult = newEmployeeDetails;
            employeeData.employeeDetails_id = newEmployeeDetails.data.id;

            const { employeeDetails_id, ...restDetails } =
              newEmployeeDetails.data;
            cleanDetails = restDetails;
          }
        } catch (error) {
          console.warn(`Employee details creation failed: ${error.message}`);
        }
      }

      // Prepare employee data with all foreign key references
      const employeeDataWithReferences = {
        ...employeeData,
        education_id:
          educationIds.length > 0
            ? JSON.stringify(educationIds)
            : educationData === null
            ? null
            : employee.education_id,
        work_id:
          workHistoryIds.length > 0
            ? JSON.stringify(workHistoryIds)
            : workHistoryData === null
            ? null
            : employee.work_id,
        language_id:
          languages && languages.length > 0
            ? JSON.stringify(languages)
            : languages === null
            ? null
            : employee.language_id,
        reference_employee_id:
          referenceEmployee !== undefined
            ? referenceEmployee
            : employee.reference_employee_id,
        hiring_source_id:
          hiringSource !== undefined ? hiringSource : employee.hiring_source_id,
      };

      // Update main employee record (failure should rollback)
      const result = await EmployeeService.update(
        id,
        employeeDataWithReferences,
        { transaction }
      );

      if (!result || !result.success) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: "Employee not found",
          data: null,
        });
      }

      // Commit transaction
      await transaction.commit();

      // Return success response with all updated data
      res.status(200).json({
        success: true,
        message: "Employee updated successfully with all related records",
        data: {
          employee: result.data,
          employeeDetails: cleanDetails,
          updated_records: {
            education_count: educationIds.length,
            work_history_count: workHistoryIds.length,
            employee_details_updated: employeeDetailsResult !== null,
            language_count: languages ? languages.length : 0,
            reference_employee_updated: referenceEmployee !== undefined,
            hiring_source_updated: hiringSource !== undefined,
          },
        },
      });
    } catch (error) {
      // Rollback transaction on any error
      await transaction.rollback();
      console.error("Error in updateEmployee:", error);
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  };

  /**
   * Get all employee records with merged employee details
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async getAllEmployees(req, res) {
    try {
      // Get all employees from EmployeeService
      const employeesResult = await EmployeeService.getAll();

      if (!employeesResult || !employeesResult.success) {
        return res.status(500).json({
          success: false,
          message: employeesResult
            ? employeesResult.message
            : "Error fetching employees",
          data: null,
        });
      }

      // Get all employee details from EmployeeDetailsService
      const employeeDetailsResult = await EmployeeDetailsService.getAll();

      if (!employeeDetailsResult || !employeeDetailsResult.success) {
        return res.status(500).json({
          success: false,
          message: employeeDetailsResult
            ? employeeDetailsResult.message
            : "Error fetching employee details",
          data: null,
        });
      }

      const employees = employeesResult.data;
      const employeeDetails = employeeDetailsResult.data;

      // Create a map of employee details by their ID
      const detailsMap = new Map();
      employeeDetails.forEach((detail) => {
        detailsMap.set(String(detail.id), detail);
      });

      const mergedEmployees = employees.map((employee) => {
        // Use the correct field name from the employee object
        const employeeDetailsId = employee.employeeDetails_id;

        // Look up employee details
        const details = employeeDetailsId
          ? detailsMap.get(String(employeeDetailsId))
          : null;

        //Remove the employeeDetails_id from the details object to avoid duplication
        let cleanDetails = null;
        if (details) {
          const { employeeDetails_id, ...restDetails } = details;
          cleanDetails = restDetails;
        }
        return {
          ...employee,
          employeeDetails: cleanDetails,
        };
      });

      return res.status(200).json({
        success: true,
        message: "Employees fetched successfully",
        data: mergedEmployees,
        count: mergedEmployees.length,
      });
    } catch (error) {
      console.error("Error in getAllEmployees:", error);
      return res.status(500).json({
        success: false,
        message: `Error fetching employee records: ${error.message}`,
        data: null,
      });
    }
  }
  /**
   * Get employee record by ID with all associated data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async getEmployeeById(req, res) {
    try {
      const { id } = req.params;

      // Validate ID parameter
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Employee ID is required",
          data: null,
          count: 0,
        });
      }

      // Get employee from EmployeeService
      const employeeResult = await EmployeeService.getById(id);

      if (!employeeResult || !employeeResult.success) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
          data: null,
          count: 0,
        });
      }

      const employee = employeeResult.data;

      // Get the employeeDetails_id from the employee record
      const employeeDetailsId = employee.employeeDetails_id;

      let detailsObj = null;

      if (employeeDetailsId) {
        // Try to get employee details using the employeeDetails_id
        const employeeDetailsResult = await EmployeeDetailsService.getById(
          employeeDetailsId
        );

        // Extract employee details data if successful
        if (employeeDetailsResult && employeeDetailsResult.success) {
          detailsObj = employeeDetailsResult.data;
        }
      }

      // If still null, try the fallback approach like in getAllEmployees
      if (!detailsObj && employeeDetailsId) {
        const allEmployeeDetailsResult = await EmployeeDetailsService.getAll();

        if (allEmployeeDetailsResult && allEmployeeDetailsResult.success) {
          const detailsMap = new Map();

          allEmployeeDetailsResult.data.forEach((detail) => {
            detailsMap.set(String(detail.id), detail);
          });

          detailsObj = detailsMap.get(String(employeeDetailsId)) || null;
        }
      }

      // Remove the employeeDetails_id from the details object to avoid duplication
      let cleanDetails = null;
      if (detailsObj) {
        const { employeeDetails_id, ...restDetails } = detailsObj;
        cleanDetails = restDetails;
      }

      // Merge employee with employee details into single JSON
      const mergedData = {
        ...employee,
        employeeDetails: cleanDetails,
      };

      return res.status(200).json({
        success: true,
        message: "Employee found successfully",
        data: mergedData,
        count: 1, // Always 1 for a single employee record
      });
    } catch (error) {
      console.error("Error in getEmployeeById:", error);
      return res.status(500).json({
        success: false,
        message: `Error fetching employee record by ID: ${error.message}`,
        data: null,
        count: 0,
      });
    }
  }
  /**
   * Delete employee record by ID along with associated employee details
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async deleteEmployee(req, res) {
    try {
      const { id } = req.params;

      // Validate ID parameter
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Employee ID is required",
          data: null,
        });
      }

      // First, get the employee to check if it exists and get employeeDetails_id
      const employeeResult = await EmployeeService.getById(id);

      if (!employeeResult || !employeeResult.success) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
          data: null,
        });
      }

      const employee = employeeResult.data;
      const employeeDetailsId = employee.employeeDetails_id;

      // Delete employee details first (if exists) to maintain referential integrity
      if (employeeDetailsId) {
        await EmployeeDetailsService.delete(employeeDetailsId);
      }

      // Delete the employee record
      const deleteResult = await EmployeeService.delete(id);

      if (!deleteResult || !deleteResult.success) {
        return res.status(500).json({
          success: false,
          message: "Failed to delete employee",
          data: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Employee deleted successfully",
        data: {
          deletedEmployeeId: id,
          deletedEmployeeDetailsId: employeeDetailsId || null,
        },
      });
    } catch (error) {
      console.error("Error in deleteEmployee:", error);
      return res.status(500).json({
        success: false,
        message: `Error deleting employee record: ${error.message}`,
        data: null,
      });
    }
  }
}

module.exports = new EmployeeController();
