/**
 * Employee Controller
 * Handles HTTP requests for Employee operations
 */

const EmployeeService = require("../../services/api/Employee.service");
const ApplicantEducationService = require("../../services/api/ApplicantEducation.service");
const ApplicantWorkHistoryService = require("../../services/api/ApplicantWorkHistory.service");
const LanguageService = require("../../services/api/Language.service");
const HiringSourceService = require("../../services/api/HiringSource.service");

class EmployeeController {
    /**
     * Create a new EMPLOYEE with LANGUAGE through id as a primary key to language_id foreign key
     * POST /api/employees
     */
    createEmployee = async (req, res) => {
        try {
            const {
                languageData,
                educationData,
                workHistoryData,
                referenceEmployeeData,
                ...employeeData
            } = req.body;

            let languageId = null;
            let educationId = null;
            let workHistoryId = null;
            let referenceEmployeeId = null;

            // First create language record if provided
            if (languageData) {
                const languageResult = await LanguageService.addLanguage(
                    languageData
                );

                if (!languageResult.success) {
                    return res.status(400).json({
                        success: false,
                        message: `Failed to create language: ${languageResult.error}`,
                        data: null,
                    });
                }
                languageId = languageResult.data.id;
            }

            // Create education record if provided
            if (educationData) {
                const educationResult =
                    await ApplicantEducationService.addEducation(educationData);

                if (!educationResult.success) {
                    return res.status(400).json({
                        success: false,
                        message: `Failed to create education: ${educationResult.error}`,
                        data: null,
                    });
                }
                educationId = educationResult.data.id;
            }

            // Create work history record if provided
            if (workHistoryData) {
                const workHistoryResult =
                    await ApplicantWorkHistoryService.addWorkHistory(
                        workHistoryData
                    );

                if (!workHistoryResult.success) {
                    return res.status(400).json({
                        success: false,
                        message: `Failed to create work history: ${workHistoryResult.error}`,
                        data: null,
                    });
                }
                workHistoryId = workHistoryResult.data.id;
            }

            // Create reference employee record if provided
            if (referenceEmployeeData) {
                const referenceEmployeeResult = await EmployeeService.create(
                    referenceEmployeeData
                );

                if (!referenceEmployeeResult.success) {
                    return res.status(400).json({
                        success: false,
                        message: `Failed to create reference employee: ${referenceEmployeeResult.error}`,
                        data: null,
                    });
                }
                referenceEmployeeId = referenceEmployeeResult.data.id;
            }

            // Add language_id, education_id, work_id, and reference_employee_id to employee data
            const employeeDataWithReferences = {
                ...employeeData,
                language_id: languageId,
                education_id: educationId,
                work_id: workHistoryId,
                reference_employee_id: referenceEmployeeId,
            };

            // Create employee with all foreign keys
            const employee = await EmployeeService.create(
                employeeDataWithReferences
            );

            res.status(201).json({
                success: true,
                message: "Employee created successfully",
                data: employee,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
                data: null,
            });
        }
    };

    updateEmployee = async (req, res) => {
        try {
            const { id } = req.params;
            const {
                educationData,
                workHistoryData,
                languageData,
                ...employeeData
            } = req.body;

            let educationId = null;
            let workHistoryId = null;
            let languageId = null;

            //update or create education record if provided
            if (educationData) {
                const educationResult =
                    await ApplicantEducationService.addEducation(educationData);

                if (!educationResult.success) {
                    return res.status(400).json({
                        success: false,
                        message: `Failed to create education: ${educationResult.error}`,
                        data: null,
                    });
                }
                educationId = educationResult.Data.id;
            }

            //update or create work history record if provided
            if (workHistoryData) {
                const workHistoryResult =
                    await ApplicantWorkHistoryService.addWorkHistory(
                        workHistoryData
                    );

                if (!workHistoryResult.success) {
                    return res.status(400).json({
                        success: false,
                        message: `Failed to create work history: ${workHistoryResult.error}`,
                        data: null,
                    });
                }

                workHistoryId = workHistoryResult.data.id;
            }

            //update or create language record
            if (languageData) {
                const languageResult = await LanguageService.addLanguage(
                    languageData
                );

                if (!languageResult.success) {
                    return res.status(400).json({
                        success: false,
                        message: `Failed to create language: ${languageResult.error}`,
                        data: null,
                    });
                }

                languageId = languageResult.data.id;
            }

            // Add foreign key references to employee data
            const employeeDataWithReferences = {
                ...employeeData,
                ...(educationId && { education_id: educationId }),
                ...(workHistoryId && { work_id: workHistoryId }),
                ...(languageId && { language_id: languageId }),
            };

            // Update employee with foreign keys
            const employee = await EmployeeService.update(
                id,
                employeeDataWithReferences
            );

            res.status(200).json({
                success: true,
                message: "Employee updated successfully",
                data: employee,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
                data: null,
            });
        }
    };
}

module.exports = new EmployeeController();
