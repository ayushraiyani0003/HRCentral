import React, { useState, useEffect } from "react";
import {
    CustomTextInput,
    CustomModal,
    CustomButton,
} from "../../../../components";

function SetupModal({
    openAddEditModel,
    setOpenAddEditModel,
    modelType,
    setupType = "BankList", // Default type
    handleCloseModel,
    rowData,
    // CRUD handlers from the hook
    handleCreateCountry,
    handleUpdateCountry,
    // Add other CRUD handlers as needed
}) {
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        phone_code: "",
        region: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Configuration for different setup types
    const setupConfig = {
        BankList: {
            title: "Bank List",
            fields: ["name"],
            nameLabel: "Bank Name",
            namePlaceholder: "Enter a bank name (e.g., HDFC Bank, ICICI Bank)",
        },
        Country: {
            title: "Country",
            fields: ["name", "code", "phone_code", "region"],
            nameLabel: "Country Name",
            namePlaceholder: "Enter a country name (e.g., India, USA, Canada)",
            codeLabel: "Country Code",
            codePlaceholder: "Enter country code (e.g., IN, US, CA)",
            phoneCodeLabel: "Phone Code",
            phoneCodePlaceholder: "Enter phone code (e.g., +91, +1)",
            regionLabel: "Region",
            regionPlaceholder: "Enter region (e.g., asia, north-america)",
        },
        Salutation: {
            title: "Salutation",
            fields: ["name"],
            nameLabel: "Salutation",
            namePlaceholder: "Enter a salutation (e.g., Mr., Mrs., Miss)",
        },
    };

    const currentConfig = setupConfig[setupType] || setupConfig.BankList;

    // Reset form when modal opens, setup type changes, or rowData changes
    useEffect(() => {
        if (openAddEditModel) {
            if (modelType === "add") {
                // Reset form for add mode
                setFormData({
                    name: "",
                    code: "",
                    phone_code: "",
                    region: "",
                });
            } else if (
                (modelType === "edit" || modelType === "view") &&
                rowData
            ) {
                // Populate form with existing data for edit/view mode
                setFormData({
                    name: rowData.name || "",
                    code: rowData.code || "",
                    phone_code: rowData.phone_code || "",
                    region: rowData.region || "",
                    shiftName: rowData.shiftName || "",
                    timeFrom: rowData.timeFrom || "",
                    timeTo: rowData.timeTo || "",
                });
            }
            setErrors({});
        }
    }, [openAddEditModel, setupType, modelType, rowData]);

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

        // Validate required fields based on setup type
        currentConfig.fields.forEach((field) => {
            if (!formData[field]?.trim()) {
                const fieldConfig = {
                    name: currentConfig.nameLabel,
                    code: currentConfig.codeLabel || "Code",
                    phone_code: currentConfig.phoneCodeLabel || "Phone Code",
                    region: currentConfig.regionLabel || "Region",
                    shiftName: currentConfig.nameLabel,
                };
                newErrors[field] = `${fieldConfig[field]} is required`;
            }
        });

        // Special validation for WorkShift
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

        // Special validation for Country
        if (setupType === "Country") {
            if (formData.phone_code && !formData.phone_code.startsWith("+")) {
                newErrors.phone_code = "Phone code must start with +";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        console.log("handleSubmit called");

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            let result;

            if (modelType === "add") {
                console.log("handleCreateCountry", handleCreateCountry);

                // Create new record
                if (setupType === "Country" && handleCreateCountry) {
                    result = await handleCreateCountry(formData);
                }
                // Add other setup types here as needed
                // else if (setupType === "BankList" && handleCreateBank) {
                //     result = await handleCreateBank(formData);
                // }
            } else if (modelType === "edit") {
                // Update existing record
                if (
                    setupType === "Country" &&
                    handleUpdateCountry &&
                    rowData?.id
                ) {
                    result = await handleUpdateCountry(rowData.id, formData);
                }
                // Add other setup types here as needed
                // else if (setupType === "BankList" && handleUpdateBank && rowData?.id) {
                //     result = await handleUpdateBank(rowData.id, formData);
                // }
            }

            if (result && result.success) {
                console.log("Form submitted successfully:", result.data);
                // Modal will be closed by the hook
            } else if (result && !result.success) {
                console.error("Error submitting form:", result.error);
                // Handle error - maybe show error message
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setOpenAddEditModel(false);
        if (handleCloseModel) {
            handleCloseModel();
        }
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
                        required
                        error={errors.shiftName}
                        disabled={modelType === "view"}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomTextInput
                            label="Start Time"
                            placeholder="10:00 AM"
                            value={formData.timeFrom}
                            onChange={(value) =>
                                handleInputChange("timeFrom", value)
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
                            onChange={(value) =>
                                handleInputChange("timeTo", value)
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

        if (setupType === "Country") {
            return (
                <div className="space-y-4">
                    <CustomTextInput
                        label={currentConfig.nameLabel}
                        placeholder={currentConfig.namePlaceholder}
                        value={formData.name}
                        onChange={(value) => handleInputChange("name", value)}
                        required
                        error={errors.name}
                        disabled={modelType === "view"}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomTextInput
                            label={currentConfig.codeLabel}
                            placeholder={currentConfig.codePlaceholder}
                            value={formData.code}
                            onChange={(value) =>
                                handleInputChange("code", value)
                            }
                            required
                            error={errors.code}
                            disabled={modelType === "view"}
                        />
                        <CustomTextInput
                            label={currentConfig.phoneCodeLabel}
                            placeholder={currentConfig.phoneCodePlaceholder}
                            value={formData.phone_code}
                            onChange={(value) =>
                                handleInputChange("phone_code", value)
                            }
                            required
                            error={errors.phone_code}
                            disabled={modelType === "view"}
                        />
                    </div>
                    <CustomTextInput
                        label={currentConfig.regionLabel}
                        placeholder={currentConfig.regionPlaceholder}
                        value={formData.region}
                        onChange={(value) => handleInputChange("region", value)}
                        required
                        error={errors.region}
                        disabled={modelType === "view"}
                    />
                </div>
            );
        }

        // Default single field (for BankList, Salutation, etc.)
        return (
            <CustomTextInput
                label={currentConfig.nameLabel}
                placeholder={currentConfig.namePlaceholder}
                value={formData.name}
                onChange={(value) => handleInputChange("name", value)}
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
            showCloseButton={true}
            closeOnOverlayClick={false}
            closeOnEscape={true}
            bodyClassName="px-6 py-4"
            footer={modalFooter}
        >
            <div className="space-y-4">{renderFormFields()}</div>
        </CustomModal>
    );
}

export default SetupModal;
