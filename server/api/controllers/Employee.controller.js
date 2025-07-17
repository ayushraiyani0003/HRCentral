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

        if (!employeeDetailsResult) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: "Failed to create employee details",
            data: null,
          });
        }

        // Add employeeDetails_id to the employee data
        employeeDataToCopy.employeeDetails_id = employeeDetailsResult.id; // Todo: only ID will be passed
      }

      // Create employee record
      const employeeResult = await EmployeeService.create(employeeDataToCopy, {
        transaction,
      });

      if (!employeeResult) {
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
          employee: employeeResult,
          employeeDetails: employeeDetailsResult,
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
              // Update existing education - pass transaction
              educationResult = await ApplicantEducationService.updateEducation(
                education.id,
                education,
                { transaction } // Make sure your service accepts this
              );
            } else {
              // Create new education - pass transaction
              educationResult = await ApplicantEducationService.addEducation(
                education,
                { transaction } // Make sure your service accepts this
              );
            }

            //console.log("education result is:", educationResult);

            // Check if result exists and has expected structure
            if (!educationResult) {
              console.warn("Education service returned undefined/null result");
              continue; // Skip this education record
            }

            if (!educationResult.success) {
              console.warn(
                `Failed to update/create education: ${
                  educationResult.error || "Unknown error"
                }`
              );
              // Continue processing - education is optional
            } else if (educationResult.data && educationResult.data.id) {
              educationIds.push(educationResult.data.id);
            }
          }
        } catch (error) {
          console.warn(`Education update failed: ${error.message}`);
          // Continue processing - education is optional
        }
      }

      // Update work history records if provided (optional)
      if (workHistoryData && Array.isArray(workHistoryData)) {
        try {
          for (const workHistory of workHistoryData) {
            let workHistoryResult;

            if (workHistory.id) {
              // Update existing work history - pass transaction
              workHistoryResult =
                await ApplicantWorkHistoryService.updateWorkHistory(
                  workHistory.id,
                  workHistory,
                  { transaction } // Make sure your service accepts this
                );
            } else {
              // Create new work history - pass transaction
              workHistoryResult =
                await ApplicantWorkHistoryService.addWorkHistory(
                  workHistory,
                  { transaction } // Make sure your service accepts this
                );
            }

            //console.log("work history result is:", workHistoryResult);

            // Check if result exists and has expected structure
            if (!workHistoryResult) {
              console.warn(
                "Work history service returned undefined/null result"
              );
              continue; // Skip this work history record
            }

            if (!workHistoryResult.success) {
              console.warn(
                `Failed to update/create work history: ${
                  workHistoryResult.error || "Unknown error"
                }`
              );
              // Continue processing - work history is optional
            } else if (workHistoryResult.data && workHistoryResult.data.id) {
              workHistoryIds.push(workHistoryResult.data.id);
            }
          }
        } catch (error) {
          console.warn(`Work history update failed: ${error.message}`);
          // Continue processing - work history is optional
        }
      }

      // Update employee details if provided (optional)
      let employeeDetailsResult = null;
      if (employeeDetailsData && employee.employeeDetails_id) {
        try {
          employeeDetailsResult = await EmployeeDetailsService.update(
            employee.employeeDetails_id,
            employeeDetailsData,
            { transaction }
          );

          // Handle the different return pattern for EmployeeDetailsService
          if (!employeeDetailsResult) {
            console.warn("Failed to update employee details: Record not found");
            // Continue processing - employee details is optional
          } else {
            // EmployeeDetailsService.update returns the record directly, not wrapped in success object
            employeeDetailsResult = {
              success: true,
              data: employeeDetailsResult,
            };
          }
        } catch (error) {
          console.warn(`Employee details update failed: ${error.message}`);
          // Continue processing - employee details is optional
        }
      } else if (employeeDetailsData && !employee.employeeDetails_id) {
        // Create new employee details if data provided but no existing record
        try {
          const newEmployeeDetails = await EmployeeDetailsService.create(
            employeeDetailsData,
            { transaction }
          );

          if (newEmployeeDetails) {
            employeeDetailsResult = {
              success: true,
              data: newEmployeeDetails,
            };
            // Add the new employeeDetails_id to employee data
            employeeData.employeeDetails_id = newEmployeeDetails.id;
          }
        } catch (error) {
          console.warn(`Employee details creation failed: ${error.message}`);
          // Continue processing - employee details is optional
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

      //console.log("Employee update result:", result);

      // Handle the different return pattern for EmployeeService
      if (!result) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: "Employee not found",
          data: null,
        });
      }

      // EmployeeService.update returns the record directly, not wrapped in success object
      const employeeUpdateResult = {
        success: true,
        data: result,
      };

      // Commit transaction
      await transaction.commit();

      // Return success response with all updated data
      res.status(200).json({
        success: true,
        message: "Employee updated successfully with all related records",
        data: {
          employee: employeeUpdateResult.data,
          employeeDetails: employeeDetailsResult
            ? employeeDetailsResult.data
            : null,
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
      const employees = await EmployeeService.getAll();

      // Get all employee details from EmployeeDetailsService
      const employeeDetails = await EmployeeDetailsService.getAll();

      // Create a map of employee details by their ID
      const detailsMap = new Map();
      employeeDetails.forEach((detail) => {
        const detailObj = detail.toJSON ? detail.toJSON() : detail;
        detailsMap.set(String(detailObj.id), detailObj);
      });

      // console.log("DetailsMap keys:", Array.from(detailsMap.keys()));
      // console.log("DetailsMap size:", detailsMap.size);

      const mergedEmployees = employees.map((employee) => {
        const employeeObj = employee.toJSON ? employee.toJSON() : employee;

        // Use the correct field name from the employee object
        const employeeDetailsId = employeeObj.employeeDetails_id;

        // console.log("Employee ID:", employeeObj.id);
        // console.log("Employee details ID:", employeeDetailsId);

        // Look up employee details
        const details = employeeDetailsId
          ? detailsMap.get(String(employeeDetailsId))
          : null;

        // console.log("Found details:", details ? "Yes" : "No");

        return {
          ...employeeObj,
          employeeDetails: details || null,
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
        });
      }

      // Get employee from EmployeeService
      const employee = await EmployeeService.getById(id);

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
          data: null,
        });
      }

      // Convert employee to plain object
      const employeeObj = employee.toJSON ? employee.toJSON() : employee;

      // Get the employeeDetails_id from the employee record
      const employeeDetailsId = employeeObj.employeeDetails_id;

      // Get employee details using the employeeDetails_id (not the employee ID)
      const employeeDetails = employeeDetailsId
        ? await EmployeeDetailsService.getById(employeeDetailsId)
        : null;

      // Convert employee details to plain object if it exists
      const detailsObj = employeeDetails
        ? employeeDetails.toJSON
          ? employeeDetails.toJSON()
          : employeeDetails
        : null;

      // Merge employee with employee details into single JSON
      const mergedData = {
        ...employeeObj,
        employeeDetails: detailsObj,
      };

      return res.status(200).json({
        success: true,
        message: "Employee found successfully",
        data: mergedData,
      });
    } catch (error) {
      console.error("Error in getEmployeeById:", error);
      return res.status(500).json({
        success: false,
        message: `Error fetching employee record by ID: ${error.message}`,
        data: null,
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
      const employee = await EmployeeService.getById(id);

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
          data: null,
        });
      }

      // Convert employee to plain object to get employeeDetails_id
      const employeeObj = employee.toJSON ? employee.toJSON() : employee;
      const employeeDetailsId = employeeObj.employeeDetails_id;

      // Delete employee details first (if exists) to maintain referential integrity
      if (employeeDetailsId) {
        await EmployeeDetailsService.delete(employeeDetailsId);
      }

      // Delete the employee record
      await EmployeeService.delete(id);

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
