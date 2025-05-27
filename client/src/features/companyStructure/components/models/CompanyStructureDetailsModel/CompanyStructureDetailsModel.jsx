import React, { useState, useEffect } from "react";
import {
    CustomTextInput,
    CustomButton,
    RichTextEditor,
    CustomDropdown,
    CustomModal,
} from "../../../../../components";

function CompanyStructureDetailsModel({
    openStructureModel,
    setOpenStructureModel,
    modelType,
    companyStructure,
    existingStructures = [], // Array of existing structures for parent dropdown
    departmentHeads = [], // Array of department heads
    onSave,
    onUpdate,
}) {
    const [formData, setFormData] = useState({
        name: "",
        details: "",
        address: "",
        type: "",
        country: "India",
        parentStructure: "",
        heads: "",
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Structure type options
    const structureTypes = [
        { label: "Company", value: "company" },
        { label: "Head Office", value: "head_office" },
        { label: "Regional Office", value: "regional_office" },
        { label: "Department", value: "department" },
        { label: "Unit", value: "unit" },
        { label: "Sub Unit", value: "sub_unit" },
    ];

    // Country options (you can expand this list)
    const countries = [
        { label: "India", value: "India" },
        { label: "United States", value: "United States" },
        { label: "United Kingdom", value: "United Kingdom" },
        { label: "Canada", value: "Canada" },
        { label: "Australia", value: "Australia" },
        { label: "Germany", value: "Germany" },
        { label: "France", value: "France" },
        { label: "Japan", value: "Japan" },
        { label: "Singapore", value: "Singapore" },
        { label: "UAE", value: "UAE" },
    ];

    // Convert existing structures to dropdown options
    const parentStructureOptions = existingStructures.map((structure) => ({
        label: structure.name,
        value: structure.id || structure.name,
    }));

    // Convert department heads to dropdown options
    const headsOptions = departmentHeads.map((head) => ({
        label: head.name,
        value: head.id || head.name,
    }));

    // Initialize form data when editing or viewing
    useEffect(() => {
        if (
            (modelType === "edit" || modelType === "view") &&
            companyStructure
        ) {
            setFormData({
                name: companyStructure.name || "",
                details: companyStructure.details || "",
                address: companyStructure.address || "",
                type: companyStructure.type || "",
                country: companyStructure.country || "India",
                parentStructure: companyStructure.parentStructure || "",
                heads: companyStructure.heads || "",
            });
        } else if (modelType === "add") {
            setFormData({
                name: "",
                details: "",
                address: "",
                type: "",
                country: "India",
                parentStructure: "",
                heads: "",
            });
        }
    }, [modelType, companyStructure]);

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

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.details.trim()) {
            newErrors.details = "Details are required";
        }

        if (!formData.type) {
            newErrors.type = "Type is required";
        }

        if (!formData.country) {
            newErrors.country = "Country is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            if (modelType === "edit") {
                await onUpdate?.(formData);
            } else {
                await onSave?.(formData);
            }
            setOpenStructureModel(false);
        } catch (error) {
            console.error("Error saving structure:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        setFormData({
            name: "",
            details: "",
            address: "",
            type: "",
            country: "India",
            parentStructure: "",
            heads: "",
        });
        setErrors({});
        setOpenStructureModel(false);
    };

    // Footer buttons
    const modalFooter = (
        <div className="flex justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
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
            isOpen={openStructureModel}
            onClose={() => setOpenStructureModel(false)}
            title={`${
                modelType === "view"
                    ? "View"
                    : modelType === "edit"
                    ? "Edit"
                    : "Add"
            } Company Structure`}
            size="large"
            showCloseButton={true}
            closeOnOverlayClick={false}
            closeOnEscape={true}
            bodyClassName="!px-0 !py-0"
            footer={modelType !== "view" ? modalFooter : null}
        >
            <div className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="text-lg font-medium text-gray-800 mb-2">
                        {modelType === "view"
                            ? "Structure Information"
                            : modelType === "edit"
                            ? "Update Structure Information"
                            : "Create New Structure"}
                    </h4>
                    <p className="text-sm text-gray-600">
                        {modelType === "view"
                            ? "View the complete structure details below."
                            : `Fill in the required information to ${
                                  modelType === "edit" ? "update" : "create"
                              } the company structure.`}
                    </p>
                </div>

                {/* Name Field */}
                <div>
                    <CustomTextInput
                        label="Structure Name"
                        placeholder="Enter structure name"
                        value={formData.name}
                        onChange={(e) => {
                            handleInputChange("name", e.target.value);
                            if (e.target.value.trim()) {
                                setErrors({
                                    ...errors,
                                    name: "",
                                });
                            }
                        }}
                        required={modelType !== "view"}
                        error={errors.name}
                        className="w-full"
                        disabled={modelType === "view"}
                        readOnly={modelType === "view"}
                    />
                </div>

                {/* Details Field */}
                <div>
                    <RichTextEditor
                        label="Basic Details"
                        value={formData.details}
                        onChange={(value) => {
                            handleInputChange("details", value);
                            if (value.trim()) {
                                setErrors({
                                    ...errors,
                                    details: "",
                                });
                            }
                        }}
                        placeholder="Enter basic details about the structure..."
                        required={modelType !== "view"}
                        error={errors.details}
                        minHeight="120px"
                        maxHeight="200px"
                        toolbarOptions={modelType === "view" ? [] : []}
                        readOnly={modelType === "view"}
                        disabled={modelType === "view"}
                    />
                </div>

                {/* Address Field */}
                <div>
                    <RichTextEditor
                        label="Address"
                        value={formData.address}
                        onChange={(value) =>
                            handleInputChange("address", value)
                        }
                        placeholder="Enter complete address..."
                        required={false}
                        minHeight="100px"
                        maxHeight="150px"
                        toolbarOptions={modelType === "view" ? [] : []}
                        readOnly={modelType === "view"}
                        disabled={modelType === "view"}
                    />
                </div>

                {/* Structure Type and Country Row */}
                <div className="flex flex-col md:flex-row gap-4 w-full">
                    <div className="md:w-1/2 w-full flex flex-col">
                        <div className="w-full">
                            <CustomDropdown
                                label="Structure Type"
                                options={structureTypes}
                                value={formData.type}
                                onChange={(value) => {
                                    handleInputChange("type", value);
                                    if (value) {
                                        setErrors({
                                            ...errors,
                                            type: "",
                                        });
                                    }
                                }}
                                placeholder="Select structure type"
                                required={modelType !== "view"}
                                mode="single"
                                className="shadow-none relative !mb-2 rounded-lg border-none !w-full"
                                isSearchable={false}
                                style={{ width: "100%" }}
                                containerStyle={{ width: "100%" }}
                                disabled={modelType === "view"}
                                readOnly={modelType === "view"}
                            />
                            {errors.type && (
                                <p className="text-red-500 text-xs mt-1">
                                    Structure type is required
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="md:w-1/2 w-full flex flex-col">
                        <div className="w-full">
                            <CustomDropdown
                                label="Country"
                                options={countries}
                                value={formData.country}
                                onChange={(value) => {
                                    handleInputChange("country", value);
                                    if (value) {
                                        setErrors({
                                            ...errors,
                                            country: "",
                                        });
                                    }
                                }}
                                placeholder="Select country"
                                required={modelType !== "view"}
                                mode="single"
                                className="shadow-none relative !mb-2 rounded-lg border-none !w-full"
                                isSearchable={false}
                                style={{ width: "100%" }}
                                containerStyle={{ width: "100%" }}
                                disabled={modelType === "view"}
                                readOnly={modelType === "view"}
                            />
                            {errors.country && (
                                <p className="text-red-500 text-xs mt-1">
                                    Country is required
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Parent Structure and Heads Row */}
                <div className="flex flex-col md:flex-row gap-4 w-full">
                    <div className="md:w-1/2 w-full flex flex-col">
                        <div className="w-full">
                            <CustomDropdown
                                label="Parent Structure"
                                options={parentStructureOptions}
                                value={formData.parentStructure}
                                onChange={(value) => {
                                    handleInputChange(
                                        "parentStructure",
                                        value || ""
                                    );
                                }}
                                placeholder="Select parent structure (optional)"
                                required={false}
                                mode="single"
                                className="shadow-none relative !mb-2 rounded-lg border-none !w-full"
                                isSearchable={false}
                                style={{ width: "100%" }}
                                containerStyle={{ width: "100%" }}
                                disabled={modelType === "view"}
                                readOnly={modelType === "view"}
                            />
                            {errors.parentStructure && (
                                <p className="text-red-500 text-xs mt-1">
                                    Parent structure is required
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="md:w-1/2 w-full flex flex-col">
                        <div className="w-full">
                            <CustomDropdown
                                label="Department Head"
                                options={headsOptions}
                                value={formData.heads}
                                onChange={(value) => {
                                    handleInputChange("heads", value || "");
                                }}
                                placeholder="Select department head (optional)"
                                required={false}
                                mode="single"
                                className="shadow-none relative !mb-2 rounded-lg border-none !w-full"
                                isSearchable={false}
                                style={{ width: "100%" }}
                                containerStyle={{ width: "100%" }}
                                disabled={modelType === "view"}
                                readOnly={modelType === "view"}
                            />
                            {errors.heads && (
                                <p className="text-red-500 text-xs mt-1">
                                    Department head is required
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </CustomModal>
    );
}

export default CompanyStructureDetailsModel;
