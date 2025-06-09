import React from "react";
import {
    CustomTextInput,
    CustomButton,
    RichTextEditor,
    CustomDropdown,
    CustomModal,
} from "../../../../../components";

import useCompanyStructureDetailsModel from "../../../hooks/useCompanyStructureDetailsModel";

function CompanyStructureDetailsModel({
    openStructureModel,
    setOpenStructureModel,
    modelType,
    companyStructure,
    handleCloseStructureModel,
}) {
    const {
        formData,
        errors,
        isLoading,
        handleInputChange,
        handleCancel,
        handleSubmit,
        structureTypes,
        countryOptions,
        parentStructureOptions,
        headsOptions,
        setErrors,
    } = useCompanyStructureDetailsModel(
        setOpenStructureModel,
        modelType,
        companyStructure,
        handleCloseStructureModel
    );

    // Footer buttons
    const modalFooter = (
        <div className="flex justify-end space-x-3 px-6 py-4 border-none ">
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
                        onChange={(name) => {
                            handleInputChange("name", name);
                            if (name.trim()) {
                                setErrors({
                                    ...errors,
                                    name: "",
                                });
                            }
                            // console.log(e);
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
                                dropdownPosition="top"
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
                                options={countryOptions}
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
                                dropdownPosition="top"
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
                                dropdownPosition="top"
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
                                dropdownPosition="top"
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
