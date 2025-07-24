/**
 * Applicant Tracking Controller
 * Handles HTTP requests for applicant tracking operations
 */

const ApplicantTrackingService = require("../../services/api/ApplicantTracking.service");
const ApplicantEducationService = require("../../services/api/ApplicantEducation.service");
const ApplicantWorkHistoryService = require("../../services/api/ApplicantWorkHistory.service");
const InterviewService = require("../../services/api/Interview.service");
const { sequelize } = require("../../models");

class ApplicantTrackingController {
  /*
   * Create a new APPLICANT with EDUCATION, WORK HISTORY, INTERVIEWS, LANGUAGES (ID Only), and REFERENCE EMPLOYEE (ID Only)
   * POST /api/applicant-tracking
   */
  createApplicant = async (req, res) => {
    // Start transaction for rollback capability
    const transaction = await sequelize.transaction();

    try {
      const {
        educationData,
        workHistoryData,
        interviewData,
        languages, // Array of language UUIDs: ["uuid1", "uuid2"]
        referenceEmployee, // Single reference employee UUID: "uuid"
        hiringSource, // Single hiring source ID from hiring source table
        ...applicantData
      } = req.body;

      let educationIds = [];
      let workHistoryIds = [];
      let interviewIds = [];

      // Create education records if provided (optional)
      if (educationData && Array.isArray(educationData)) {
        try {
          for (const education of educationData) {
            const educationResult =
              await ApplicantEducationService.addEducation(education, {
                transaction,
              });

            if (!educationResult.success) {
              console.warn(
                `Failed to create education: ${educationResult.error}`
              );
              // Continue processing - education is optional
            } else {
              educationIds.push(educationResult.data.id);
            }
          }
        } catch (error) {
          console.warn(`Education creation failed: ${error.message}`);
          // Continue processing - education is optional
        }
      }

      // Create work history records if provided (optional)
      if (workHistoryData && Array.isArray(workHistoryData)) {
        try {
          for (const workHistory of workHistoryData) {
            const workHistoryResult =
              await ApplicantWorkHistoryService.addWorkHistory(workHistory, {
                transaction,
              });

            if (!workHistoryResult.success) {
              console.warn(
                `Failed to create work history: ${workHistoryResult.error}`
              );
              // Continue processing - work history is optional
            } else {
              workHistoryIds.push(workHistoryResult.data.id);
            }
          }
        } catch (error) {
          console.warn(`Work history creation failed: ${error.message}`);
          // Continue processing - work history is optional
        }
      }

      // Create interview records if provided (optional)
      if (interviewData && Array.isArray(interviewData)) {
        try {
          for (const interview of interviewData) {
            const interviewResult = await InterviewService.create(interview, {
              transaction,
            });

            if (!interviewResult.success) {
              console.warn(
                `Failed to create interview: ${interviewResult.error}`
              );
              // Continue processing - interview is optional
            } else {
              interviewIds.push(interviewResult.data.id);
            }
          }
        } catch (error) {
          console.warn(`Interview creation failed: ${error.message}`);
          // Continue processing - interview is optional
        }
      }

      // Process language IDs if provided (optional)
      // No validation needed - just accept the array as input

      // Process reference employee ID if provided (optional)
      // No validation needed - just accept the UUID as input

      // Process hiring source ID if provided (optional)
      // No validation needed - just accept the ID from hiring source table as input

      // Prepare applicant data with all foreign key references
      const applicantDataWithReferences = {
        ...applicantData,
        education_id:
          educationIds.length > 0 ? JSON.stringify(educationIds) : null,
        work_id:
          workHistoryIds.length > 0 ? JSON.stringify(workHistoryIds) : null,
        interview_id:
          interviewIds.length > 0 ? JSON.stringify(interviewIds) : null,
        language_id:
          languages && languages.length > 0 ? JSON.stringify(languages) : null,
        reference_employee_id: referenceEmployee || null,
        hiring_source_id: hiringSource || null,
      };

      // Create main applicant record (failure should rollback)
      const result = await ApplicantTrackingService.create(
        applicantDataWithReferences,
        { transaction }
      );

      if (!result) {
        await transaction.rollback(); //hard stop
        return res.status(400).json({
          success: false,
          message: "Failed to create applicant",
          data: null,
        });
      }

      // Commit transaction
      await transaction.commit();

      // Return success response with all created data
      res.status(201).json({
        success: true,
        message: "Applicant created successfully with all related records",
        data: {
          applicant: result,

          // Not compulsory just for information
          created_records: {
            education_count: educationIds.length,
            work_history_count: workHistoryIds.length,
            interview_count: interviewIds.length,
            language_count: languages ? languages.length : 0,
            reference_employee_set: !!referenceEmployee,
            hiring_source_set: !!hiringSource,
          },
        },
      });
    } catch (error) {
      // Rollback transaction on any error
      await transaction.rollback();
      console.error("Error in createApplicant:", error);
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  };

  /*
   * Get applicant tracking record by ID
   * GET /api/applicant-tracking/:id
   */
  getApplicantById = async (req, res) => {
    try {
      const { id } = req.params;

      // Get applicant record by ID
      const result = await ApplicantTrackingService.getById(id);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Applicant not found",
          data: null,
        });
      }

      // Return success response
      res.status(200).json({
        success: true,
        message: "Applicant retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in getApplicantById:", error);
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  };

  /**
   * Get all applicants with pagination
   * GET /api/applicant-tracking
   */
  getAllApplicants = async (req, res) => {
    try {
      const { id } = req.params;

      //Get all applicant record
      const result = await ApplicantTrackingService.getAll();

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Applicant not found",
          data: null,
        });
      }

      res.status(200).json({
        success: true,
        message: "Applicants retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in getAllApplicants:", error);
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  };

  /*
   * Update applicant with related data
   * PUT /api/applicant-tracking/:id
   */
  updateApplicant = async (req, res) => {
    // Start transaction for rollback capability
    const transaction = await sequelize.transaction();

    try {
      const { id } = req.params;
      const {
        educationData,
        workHistoryData,
        interviewData, // Array of interview UUIDs: ["uuid1", "uuid2"]
        languages, // Array of language UUIDs: ["uuid1", "uuid2"]
        referenceEmployee, // Single reference employee UUID: "uuid"
        hiringSource, // Single hiring source ID from hiring source table
        ...applicantData
      } = req.body;

      // Check if applicant exists
      const existingApplicant = await ApplicantTrackingService.getById(id);
      if (!existingApplicant) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: "Applicant not found",
          data: null,
        });
      }

      let educationIds = [];
      let workHistoryIds = [];
      let interviewIds = [];

      // Update education records if provided (optional)
      if (educationData && Array.isArray(educationData)) {
        try {
          for (const education of educationData) {
            let educationResult;

            if (education.id) {
              // Update existing education
              educationResult = await ApplicantEducationService.update(
                education.id,
                education,
                { transaction }
              );
            } else {
              // Create new education
              educationResult = await ApplicantEducationService.addEducation(
                education,
                { transaction }
              );
            }

            if (!educationResult.success) {
              console.warn(
                `Failed to update/create education: ${educationResult.error}`
              );
              // Continue processing - education is optional
            } else {
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
              // Update existing work history
              workHistoryResult = await ApplicantWorkHistoryService.update(
                workHistory.id,
                workHistory,
                { transaction }
              );
            } else {
              // Create new work history
              workHistoryResult =
                await ApplicantWorkHistoryService.addWorkHistory(workHistory, {
                  transaction,
                });
            }

            if (!workHistoryResult.success) {
              console.warn(
                `Failed to update/create work history: ${workHistoryResult.error}`
              );
              // Continue processing - work history is optional
            } else {
              workHistoryIds.push(workHistoryResult.data.id);
            }
          }
        } catch (error) {
          console.warn(`Work history update failed: ${error.message}`);
          // Continue processing - work history is optional
        }
      }

      // Update interview records if provided (optional)
      if (interviewData && Array.isArray(interviewData)) {
        try {
          for (const interview of interviewData) {
            let interviewResult;

            if (interview.id) {
              // Update existing interview
              interviewResult = await InterviewService.update(
                interview.id,
                interview,
                { transaction }
              );

              if (!interviewResult.success) {
                console.warn(
                  `Failed to update interview: ${interviewResult.error}`
                );
              } else {
                // Use the original ID, not the result ID
                interviewIds.push(interview.id);
              }
            } else {
              // Create new interview
              interviewResult = await InterviewService.create(interview, {
                transaction,
              });
            }

            if (!interviewResult.success) {
              console.warn(
                `Failed to update/create interview: ${interviewResult.error}`
              );
              // Continue processing - interview is optional
            } else {
              // Only push new interviews
              if (!interview.id || interview.id !== interviewResult.data.id) {
                interviewIds.push(interviewResult.data.id);
              }
            }
          }
        } catch (error) {
          console.warn(`Interview update failed: ${error.message}`);
          // Continue processing - interview is optional
        }
      }

      // Process language IDs if provided (optional)
      // No validation needed - just accept the array as input

      // Process reference employee ID if provided (optional)
      // No validation needed - just accept the UUID as input

      // Process hiring source ID if provided (optional)
      // No validation needed - just accept the ID from hiring source table as input

      // Prepare applicant data with all foreign key references
      const applicantDataWithReferences = {
        ...applicantData,
        education_id:
          educationIds.length > 0
            ? JSON.stringify(educationIds)
            : educationData === null
            ? null
            : existingApplicant.education_id,
        work_id:
          workHistoryIds.length > 0
            ? JSON.stringify(workHistoryIds)
            : workHistoryData === null
            ? null
            : existingApplicant.work_id,
        interview_id:
          interviewIds.length > 0
            ? JSON.stringify(interviewIds)
            : interviewData === null
            ? null
            : existingApplicant.interview_id,
        language_id:
          languages && languages.length > 0
            ? JSON.stringify(languages)
            : languages === null
            ? null
            : existingApplicant.language_id,
        reference_employee_id:
          referenceEmployee !== undefined
            ? referenceEmployee
            : existingApplicant.reference_employee_id,
        hiring_source_id:
          hiringSource !== undefined
            ? hiringSource
            : existingApplicant.hiring_source_id,
      };

      // Update main applicant record (failure should rollback)
      const result = await ApplicantTrackingService.update(
        id,
        applicantDataWithReferences,
        { transaction }
      );

      if (!result) {
        await transaction.rollback(); //hard stop
        return res.status(400).json({
          success: false,
          message: "Failed to update applicant",
          data: null,
        });
      }

      // Commit transaction
      await transaction.commit();

      // Return success response with all updated data
      res.status(200).json({
        success: true,
        message: "Applicant updated successfully with all related records",
        data: {
          applicant: result,
          updated_records: {
            education_count: educationIds.length,
            work_history_count: workHistoryIds.length,
            interview_count: interviewIds.length,
            language_count: languages ? languages.length : 0,
            reference_employee_updated: referenceEmployee !== undefined,
            hiring_source_updated: hiringSource !== undefined,
          },
        },
      });
    } catch (error) {
      // Rollback transaction on any error
      await transaction.rollback();
      console.error("Error in updateApplicant:", error);
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  };

  /**
   * Delete applicant and all related records
   * DELETE /api/applicant-tracking/:id
   */
  deleteApplicant = async (req, res) => {
    try {
      const { id } = req.params;

      const result = await ApplicantTrackingService.delete(id);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Applicant not found",
          data: null,
        });
      }

      res.status(200).json({
        success: true,
        message: "Applicant deleted successfully",
        data: null,
      });
    } catch (error) {
      console.error("Error in deleteApplicant:", error);
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  };
}

module.exports = new ApplicantTrackingController();
