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
    setupType = "EmployeeType", // Default type
}) {
    const [formData, setFormData] = useState({
        name: "",
        shiftName: "",
        timeFrom: "",
        timeTo: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

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
        HiringSource: {
            title: "Hiring Source",
            fields: ["name"],
            nameLabel: "Hiring Source",
            namePlaceholder:
                "Enter hiring source (e.g., Job Portal, Referral, Campus)",
        },
        JobLocation: {
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
        },
    };

    const currentConfig = setupConfig[setupType] || setupConfig.EmployeeType;

    // Reset form when modal opens or setup type changes
    useEffect(() => {
        if (openAddEditModel) {
            setFormData({
                name: "",
                shiftName: "",
                timeFrom: "",
                timeTo: "",
            });
            setErrors({});
        }
    }, [openAddEditModel, setupType]);

    // Validation function for time format
    const validateTimeFormat = (time) => {
        const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
        return timeRegex.test(time);
    };

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (
            currentConfig.fields.includes("name") ||
            currentConfig.fields.includes("shiftName")
        ) {
            const nameField = currentConfig.fields.includes("shiftName")
                ? "shiftName"
                : "name";
            if (!formData[nameField]?.trim()) {
                newErrors[nameField] = `${currentConfig.nameLabel} is required`;
            }
        }

        if (setupType === "WorkShift") {
            if (!formData.timeFrom?.trim()) {
                newErrors.timeFrom = "Start time is required";
            } else if (!validateTimeFormat(formData.timeFrom)) {
                newErrors.timeFrom =
                    "Invalid time format. Use format like '10:00 AM'";
            }

            if (!formData.timeTo?.trim()) {
                newErrors.timeTo = "End time is required";
            } else if (!validateTimeFormat(formData.timeTo)) {
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
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            console.log("Form submitted:", formData);
            setOpenAddEditModel(false);
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setOpenAddEditModel(false);
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
                        onChange={(e) =>
                            handleInputChange("shiftName", e.target.value)
                        }
                        required
                        error={errors.shiftName}
                        disabled={modelType === "view"}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomTextInput
                            label="Start Time"
                            placeholder="10:00 AM"
                            value={formData.timeFrom}
                            onChange={(e) =>
                                handleInputChange("timeFrom", e.target.value)
                            }
                            required
                            error={errors.timeFrom}
                            disabled={modelType === "view"}
                            helperText="Format: 10:00 AM"
                        />
                        <CustomTextInput
                            label="End Time"
                            placeholder="5:00 PM"
                            value={formData.timeTo}
                            onChange={(e) =>
                                handleInputChange("timeTo", e.target.value)
                            }
                            required
                            error={errors.timeTo}
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
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                error={errors.name}
                disabled={modelType === "view"}
            />
        );
    };

    // Footer buttons
    const modalFooter = (
        <div className="flex justify-end space-x-3 px-6 py-4 border-none">
            <CustomButton
                variant="secondary"
                onClick={handleCancel}
                disabled={isLoading}
                className="px-6 py-2"
            >
                Cancel
            </CustomButton>
            <CustomButton
                variant="primary"
                onClick={handleSubmit}
                loading={isLoading}
                className="px-6 py-2"
            >
                {modelType === "edit" ? "Update" : "Save"}
            </CustomButton>
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
            showCloseButton={true}
            closeOnOverlayClick={false}
            closeOnEscape={true}
            bodyClassName="px-6 py-4"
            footer={modelType !== "view" ? modalFooter : null}
        >
            <div className="space-y-4">{renderFormFields()}</div>
        </CustomModal>
    );
}

export default RecruitmentSetupModal;
