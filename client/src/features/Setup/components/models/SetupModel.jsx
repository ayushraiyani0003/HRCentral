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
    setupType = "BankList",
    handleCloseModel,
    rowData,
    crudHandlers = {}, // New: Consolidated handlers
}) {
    console.log(crudHandlers);

    const [formData, setFormData] = useState({
        name: "",
        code: "",
        phone_code: "",
        region: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

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
            namePlaceholder: "Enter a country name (e.g., India, USA)",
            codeLabel: "Country Code",
            codePlaceholder: "Enter code (e.g., IN, US)",
            phoneCodeLabel: "Phone Code",
            phoneCodePlaceholder: "Enter phone code (e.g., +91, +1)",
            regionLabel: "Region",
            regionPlaceholder: "Enter region (e.g., asia, europe)",
        },
        Salutation: {
            title: "Salutation",
            fields: ["name"],
            nameLabel: "Salutation",
            namePlaceholder: "Enter a salutation (e.g., Mr., Mrs.)",
        },
    };

    const currentConfig = setupConfig[setupType] || setupConfig.BankList;

    useEffect(() => {
        if (openAddEditModel) {
            if (modelType === "add") {
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
                setFormData({
                    name: rowData.name || "",
                    code: rowData.code || "",
                    phone_code: rowData.phone_code || "",
                    region: rowData.region || "",
                });
            }
            setErrors({});
        }
    }, [openAddEditModel, setupType, modelType, rowData]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        currentConfig.fields.forEach((field) => {
            if (!formData[field]?.trim()) {
                const fieldLabels = {
                    name: currentConfig.nameLabel,
                    code: currentConfig.codeLabel || "Code",
                    phone_code: currentConfig.phoneCodeLabel || "Phone Code",
                    region: currentConfig.regionLabel || "Region",
                };
                newErrors[field] = `${fieldLabels[field]} is required`;
            }
        });

        if (
            setupType === "Country" &&
            formData.phone_code &&
            !formData.phone_code.startsWith("+")
        ) {
            newErrors.phone_code = "Phone code must start with +";
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

            const result =
                modelType === "add"
                    ? await handler({ ...formData })
                    : await handler(rowData?.id, { ...formData });

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

    const renderFormFields = () => {
        if (setupType === "Country") {
            return (
                <div className="space-y-4">
                    <CustomTextInput
                        label={currentConfig.nameLabel}
                        placeholder={currentConfig.namePlaceholder}
                        value={formData.name}
                        onChange={(value) => handleInputChange("name", value)}
                        error={errors.name}
                        required
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
                            error={errors.code}
                            required
                            disabled={modelType === "view"}
                        />
                        <CustomTextInput
                            label={currentConfig.phoneCodeLabel}
                            placeholder={currentConfig.phoneCodePlaceholder}
                            value={formData.phone_code}
                            onChange={(value) =>
                                handleInputChange("phone_code", value)
                            }
                            error={errors.phone_code}
                            required
                            disabled={modelType === "view"}
                        />
                    </div>
                    <CustomTextInput
                        label={currentConfig.regionLabel}
                        placeholder={currentConfig.regionPlaceholder}
                        value={formData.region}
                        onChange={(value) => handleInputChange("region", value)}
                        error={errors.region}
                        required
                        disabled={modelType === "view"}
                    />
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

export default SetupModal;
