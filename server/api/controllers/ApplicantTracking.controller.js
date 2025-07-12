/**
 * Applicant Tracking Controller
 * Handles HTTP requests for applicant tracking operations
 */

const ApplicantTrackingService = require("../../services/api/ApplicantTracking.service");
const ApplicantEducationService = require("../../services/api/ApplicantEducation.service");
const ApplicantWorkHistoryService = require("../../services/api/ApplicantWorkHistory.service");
const InterviewService = require("../../services/api/Interview.service");
const LanguageService = require("../../services/api/Language.service");
const HiringSourceService = require("../../services/api/HiringSource.service");
const EmployeeService = require("../../services/api/Employee.service");
class ApplicantTrackingController {
    /**
     * Create a new APPLICANT with EDUCATION, WORK HISTORY, INTERVIEWS, and (LANGUAGE Id Only)
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
                            await ApplicantEducationService.addEducation(
                                education,
                                {
                                    transaction,
                                }
                            );

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
                            await ApplicantWorkHistoryService.addWorkHistory(
                                workHistory,
                                {
                                    transaction,
                                }
                            );

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
                    console.warn(
                        `Work history creation failed: ${error.message}`
                    );
                    // Continue processing - work history is optional
                }
            }

            // Create interview records if provided (optional)
            if (interviewData && Array.isArray(interviewData)) {
                try {
                    for (const interview of interviewData) {
                        const interviewResult = await InterviewService.create(
                            interview,
                            {
                                transaction,
                            }
                        );

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

            // Validate language IDs if provided (optional)
            if (languages && Array.isArray(languages) && languages.length > 0) {
                try {
                    // Validate that all provided language IDs exist
                    const existingLanguages = await LanguageService.getByIds(
                        languages
                    );
                    if (existingLanguages.length !== languages.length) {
                        console.warn(
                            `Invalid language IDs provided: ${languages.length} requested, ${existingLanguages.length} found`
                        );
                        // Continue processing - languages are optional, just warn about invalid IDs
                    }
                } catch (error) {
                    console.warn(
                        `Language validation failed: ${error.message}`
                    );
                    // Continue processing - languages are optional
                }
            }

            // Prepare applicant data with all foreign key references
            const applicantDataWithReferences = {
                ...applicantData,
                education_id:
                    educationIds.length > 0
                        ? JSON.stringify(educationIds)
                        : null,
                work_id:
                    workHistoryIds.length > 0
                        ? JSON.stringify(workHistoryIds)
                        : null,
                interview_id:
                    interviewIds.length > 0
                        ? JSON.stringify(interviewIds)
                        : null,
                language_id:
                    languages && languages.length > 0
                        ? JSON.stringify(languages)
                        : null,
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
                message:
                    "Applicant created successfully with all related records",
                data: {
                    applicant: result,
                    created_records: {
                        education_count: educationIds.length,
                        work_history_count: workHistoryIds.length,
                        interview_count: interviewIds.length,
                        language_count: languages ? languages.length : 0,
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

    /**
     * Get applicant with all related data
     * GET /api/applicant-tracking/:id
     */
    getApplicantById = async (req, res) => {
        try {
            const { id } = req.params;

            const applicant = await ApplicantTrackingService.findById(id);

            if (!applicant) {
                return res.status(404).json({
                    success: false,
                    message: "Applicant not found",
                    data: null,
                });
            }

            res.status(200).json({
                success: true,
                message: "Applicant retrieved successfully",
                data: applicant,
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
     * Update applicant with related data
     * PUT /api/applicant-tracking/:id
     */
    updateApplicant = async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const result = await ApplicantTrackingService.update(
                id,
                updateData
            );

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: "Applicant not found or update failed",
                    data: null,
                });
            }

            res.status(200).json({
                success: true,
                message: "Applicant updated successfully",
                data: result,
            });
        } catch (error) {
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

    /**
     * Get all applicants with pagination
     * GET /api/applicant-tracking
     */
    getAllApplicants = async (req, res) => {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;

            const result = await ApplicantTrackingService.findAll({
                page: parseInt(page),
                limit: parseInt(limit),
                filters,
            });

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
}

module.exports = new ApplicantTrackingController();
