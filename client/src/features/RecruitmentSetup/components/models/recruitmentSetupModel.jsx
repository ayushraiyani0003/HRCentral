import React, { useState, useEffect } from "react";
import {
    CustomTextInput,
    CustomDropdown,
    CustomModal,
    CustomButton,
} from "../../../../components";

function RecruitmentSetupModal({
    openAddEditModel,
    setOpenAddEditModel,
    modelType,
    setupType = "EmployeeType",
    handleCloseModel,
    rowData,
    crudHandlers = {}, // New: Consolidated handlers
}) {
    const [formData, setFormData] = useState({
        name: "",
        shiftName: "",
        timeFrom: "",
        timeTo: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    console.log(crudHandlers);

    // Configuration for different setup types
    const setupConfig = {
        EmployeeType: {
            title: "Employee Type",
            fields: ["name"],
            nameLabel: "Employee Type Name",
            namePlaceholder:
                "Enter employee type (e.g., Full-time, Part-time, Contract)",
        },
        Designations: {
            title: "Designation",
            fields: ["name"],
            nameLabel: "Designation Name",
            namePlaceholder:
                "Enter designation (e.g., Software Engineer, Manager)",
        },
        EducationLevels: {
            title: "Education Level",
            fields: ["name"],
            nameLabel: "Education Level",
            namePlaceholder:
                "Enter education level (e.g., Bachelor's, Master's, PhD)",
        },
        ExperienceLevels: {
            title: "Experience Level",
            fields: ["name"],
            nameLabel: "Experience Level",
            namePlaceholder:
                "Enter experience level (e.g., Entry Level, Mid Level, Senior)",
        },
        HiringSources: {
            title: "Hiring Source",
            fields: ["name"],
            nameLabel: "Hiring Source",
            namePlaceholder:
                "Enter hiring source (e.g., Job Portal, Referral, Campus)",
        },
        JobLocationsTypes: {
            title: "Job Location",
            fields: ["name"],
            nameLabel: "Location Name",
            namePlaceholder:
                "Enter job location (e.g., New York, Remote, Hybrid)",
        },
        Skills: {
            title: "Skill",
            fields: ["name"],
            nameLabel: "Skill Name",
            namePlaceholder:
                "Enter skill (e.g., JavaScript, Project Management, Communication)",
        },
        WorkShift: {
            title: "Work Shift",
            fields: ["shiftName", "timeFrom", "timeTo"],
            nameLabel: "Shift Name",
            namePlaceholder:
                "Enter shift name (e.g., Morning Shift, Night Shift)",
            timeFromLabel: "Start Time",
            timeFromPlaceholder: "10:00 AM",
            timeToLabel: "End Time",
            timeToPlaceholder: "5:00 PM",
        },
    };

    const currentConfig = setupConfig[setupType] || setupConfig.EmployeeType;

    // Helper function to convert 24-hour time to 12-hour AM/PM format
    const convertTo12HourFormat = (time24) => {
        if (!time24) return "";

        // Handle formats like "10:00:00" or "10:00"
        const timeParts = time24.split(":");
        let hours = parseInt(timeParts[0]);
        const minutes = timeParts[1];

        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12

        return `${hours}:${minutes} ${ampm}`;
    };

    useEffect(() => {
        if (openAddEditModel) {
            if (modelType === "add") {
                setFormData({
                    name: "",
                    shiftName: "",
                    timeFrom: "",
                    timeTo: "",
                });
            } else if (
                (modelType === "edit" || modelType === "view") &&
                rowData
            ) {
                // Fixed: Handle WorkShift data loading properly
                if (setupType === "WorkShift") {
                    setFormData({
                        name: rowData.name || "",
                        shiftName: rowData.shiftName || rowData.name || "", // Try both shiftName and name
                        timeFrom:
                            convertTo12HourFormat(
                                rowData.timeFrom || rowData.start_time
                            ) || "", // Convert to 12-hour format
                        timeTo:
                            convertTo12HourFormat(
                                rowData.timeTo || rowData.end_time
                            ) || "", // Convert to 12-hour format
                    });
                } else {
                    setFormData({
                        name: rowData.name || "",
                        shiftName: "",
                        timeFrom: "",
                        timeTo: "",
                    });
                }
            }
            setErrors({});
        }
    }, [openAddEditModel, setupType, modelType, rowData]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => {
            const newFormData = { ...prev, [field]: value };

            // FIXED: Synchronize name and shiftName for WorkShift
            if (setupType === "WorkShift" && field === "shiftName") {
                newFormData.name = value; // Keep name in sync with shiftName
            }

            return newFormData;
        });

        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    // Validation function for time format
    const validateTimeFormat = (time) => {
        const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
        return timeRegex.test(time);
    };

    const validateForm = () => {
        const newErrors = {};

        currentConfig.fields.forEach((field) => {
            if (!formData[field]?.trim()) {
                const fieldLabels = {
                    name: currentConfig.nameLabel,
                    shiftName: currentConfig.nameLabel,
                    timeFrom: currentConfig.timeFromLabel || "Start Time",
                    timeTo: currentConfig.timeToLabel || "End Time",
                };
                newErrors[field] = `${fieldLabels[field]} is required`;
            }
        });

        // Additional validation for WorkShift time format
        if (setupType === "WorkShift") {
            if (formData.timeFrom && !validateTimeFormat(formData.timeFrom)) {
                newErrors.timeFrom =
                    "Invalid time format. Use format like '10:00 AM'";
            }
            if (formData.timeTo && !validateTimeFormat(formData.timeTo)) {
                newErrors.timeTo =
                    "Invalid time format. Use format like '5:00 PM'";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const handlerMap = {
                add: `handleCreate${setupType}`,
                edit: `handleUpdate${setupType}`,
            };

            const handlerKey = handlerMap[modelType];
            const handler = crudHandlers[handlerKey];

            if (!handler) {
                console.error(`Handler not provided: ${handlerKey}`);
                return;
            }

            // FIXED: Prepare data with synchronized name and shiftName for WorkShift
            const submitData = { ...formData };
            if (setupType === "WorkShift") {
                // Ensure both name and shiftName have the same value
                submitData.name = formData.shiftName;
                submitData.shiftName = formData.shiftName;
            }

            console.log("Original update data:", submitData);

            const result =
                modelType === "add"
                    ? await handler(submitData)
                    : await handler(rowData?.id, submitData);

            if (result?.success) {
                setOpenAddEditModel(false);
                handleCloseModel?.();
            } else {
                console.error("Operation failed:", result?.error);
            }
        } catch (error) {
            console.error("Unexpected error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setOpenAddEditModel(false);
        handleCloseModel?.();
    };

    // Render form fields based on setup type
    const renderFormFields = () => {
        if (setupType === "WorkShift") {
            return (
                <div className="space-y-4">
                    <CustomTextInput
                        label={currentConfig.nameLabel}
                        placeholder={currentConfig.namePlaceholder}
                        value={formData.shiftName}
                        onChange={(value) =>
                            handleInputChange("shiftName", value)
                        }
                        error={errors.shiftName}
                        required
                        disabled={modelType === "view"}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomTextInput
                            label={currentConfig.timeFromLabel}
                            placeholder={currentConfig.timeFromPlaceholder}
                            value={formData.timeFrom}
                            onChange={(value) =>
                                handleInputChange("timeFrom", value)
                            }
                            error={errors.timeFrom}
                            required
                            disabled={modelType === "view"}
                            helperText="Format: 10:00 AM"
                        />
                        <CustomTextInput
                            label={currentConfig.timeToLabel}
                            placeholder={currentConfig.timeToPlaceholder}
                            value={formData.timeTo}
                            onChange={(value) =>
                                handleInputChange("timeTo", value)
                            }
                            error={errors.timeTo}
                            required
                            disabled={modelType === "view"}
                            helperText="Format: 5:00 PM"
                        />
                    </div>
                </div>
            );
        }

        return (
            <CustomTextInput
                label={currentConfig.nameLabel}
                placeholder={currentConfig.namePlaceholder}
                value={formData.name}
                onChange={(value) => handleInputChange("name", value)}
                error={errors.name}
                required
                disabled={modelType === "view"}
            />
        );
    };

    const modalFooter = (
        <div className="flex justify-end space-x-3 px-6 py-4 border-none">
            <CustomButton
                variant="secondary"
                onClick={handleCancel}
                disabled={isLoading}
                className="px-6 py-2"
            >
                {modelType === "view" ? "Close" : "Cancel"}
            </CustomButton>
            {modelType !== "view" && (
                <CustomButton
                    variant="primary"
                    onClick={handleSubmit}
                    loading={isLoading}
                    className="px-6 py-2"
                >
                    {modelType === "edit" ? "Update" : "Save"}
                </CustomButton>
            )}
        </div>
    );

    return (
        <CustomModal
            isOpen={openAddEditModel}
            onClose={() => setOpenAddEditModel(false)}
            title={`${
                modelType === "view"
                    ? "View"
                    : modelType === "edit"
                    ? "Edit"
                    : "Add"
            } ${currentConfig.title}`}
            size="large"
            showCloseButton
            closeOnOverlayClick={false}
            closeOnEscape
            bodyClassName="px-6 py-4"
            footer={modalFooter}
        >
            <div className="space-y-4">{renderFormFields()}</div>
        </CustomModal>
    );
}

export default RecruitmentSetupModal;
