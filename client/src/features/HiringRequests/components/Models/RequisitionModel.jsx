import React, { useEffect } from "react";
import {
    CustomTextInput,
    CustomButton,
    RichTextEditor,
    CustomDropdown,
    CustomModal,
    ModernDateRangePicker,
} from "../../../../components";
import useRequisitionModel from "../../hooks/useRequisitionModel";
import useHiringRequests from "../../hooks/useHiringRequests";

function RequisitionModel({
    requisitionModel,
    setRequisitionModel,
    modelType,
    requisition,
    departments = [], // Array of departments for RequirementForDepartment dropdown
    designations = [], // Array of all designations in the company
    employees = [], // Array of employees for requestedBy and agreedBy dropdowns
    handleCloseRequisitionModel,
}) {
    const {
        userRole,
        requirementCategories,
        requirementTypes,
        requisitionStatusOptions,
        approvedStatusOptions,
    } = useHiringRequests();

    const {
        formData,
        errors,
        isLoading,
        departmentOptions,
        designationOptions,
        employeeOptions,
        handleInputChange,
        handleSubmit,
        handleCancel,
        setErrors,
    } = useRequisitionModel({
        userRole,
        modelType,
        requisition,
        departments,
        designations,
        employees,
        handleCloseRequisitionModel,
        setRequisitionModel,
    });

    console.log("formData", formData);

    // Helper function to convert string date to Date object
    const parseDate = (dateValue) => {
        if (!dateValue) return null;
        if (dateValue instanceof Date) return dateValue;

        // Handle string dates in various formats
        if (typeof dateValue === "string") {
            // Try parsing the date string
            const parsedDate = new Date(dateValue);
            // Check if the date is valid
            if (!isNaN(parsedDate.getTime())) {
                return parsedDate;
            }

            // If direct parsing fails, try to handle common formats like "3/1/2024"
            const parts = dateValue.split("/");
            if (parts.length === 3) {
                // Assuming MM/DD/YYYY or M/D/YYYY format
                const month = parseInt(parts[0]) - 1; // Month is 0-indexed
                const day = parseInt(parts[1]);
                const year = parseInt(parts[2]);
                return new Date(year, month, day);
            }
        }

        return null;
    };

    // Get the parsed date for the date picker
    const expectedJoiningDateValue = parseDate(formData.expectedJoiningDate);

    // Footer buttons - only render if not view mode
    const modalFooter =
        modelType !== "view" ? (
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
        ) : (
            <></>
        );

    // Handle modal close to prevent glitch
    const handleModalClose = () => {
        setTimeout(() => {
            setRequisitionModel(false);
        }, 50);
    };

    return (
        <CustomModal
            isOpen={requisitionModel}
            onClose={handleModalClose}
            title={`${
                modelType === "view"
                    ? "View"
                    : modelType === "edit"
                    ? "Edit"
                    : "Add"
            } Requisition`}
            size="large"
            showCloseButton={true}
            closeOnOverlayClick={false}
            closeOnEscape={true}
            bodyClassName="!px-0 !py-0"
            footer={modalFooter}
        >
            <div className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="text-lg font-medium text-gray-800 mb-2">
                        {modelType === "view"
                            ? "Requisition Information"
                            : modelType === "edit"
                            ? "Update Requisition Information"
                            : "Create New Requisition"}
                    </h4>
                    <p className="text-sm text-gray-600">
                        {modelType === "view"
                            ? "View the complete requisition details below."
                            : `Fill in the required information to ${
                                  modelType === "edit" ? "update" : "create"
                              } the requisition.`}
                    </p>
                </div>

                {/* Department and Designation Row */}
                <div className="flex flex-col md:flex-row gap-4 w-full">
                    <div className="md:w-1/2 w-full flex flex-col">
                        <div className="w-full">
                            <CustomDropdown
                                label="Department"
                                options={departmentOptions}
                                value={formData.requirementForDepartment}
                                onChange={(value) => {
                                    handleInputChange(
                                        "requirementForDepartment",
                                        value
                                    );
                                    if (value) {
                                        setErrors({
                                            ...errors,
                                            requirementForDepartment: "",
                                        });
                                    }
                                }}
                                placeholder="Select department"
                                required={modelType !== "view"}
                                mode="single"
                                className="shadow-none relative !mb-2 rounded-lg border-none !w-full"
                                isSearchable={true}
                                style={{ width: "100%" }}
                                containerStyle={{ width: "100%" }}
                                readOnly={modelType === "view"}
                            />
                            {errors.requirementForDepartment && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.requirementForDepartment}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="md:w-1/2 w-full flex flex-col">
                        <div className="w-full">
                            <CustomDropdown
                                label="Designation"
                                options={designationOptions}
                                value={formData.requirementForDesignation}
                                onChange={(value) => {
                                    handleInputChange(
                                        "requirementForDesignation",
                                        value
                                    );
                                    if (value) {
                                        setErrors({
                                            ...errors,
                                            requirementForDesignation: "",
                                        });
                                    }
                                }}
                                placeholder="Select designation"
                                required={modelType !== "view"}
                                mode="single"
                                className="shadow-none relative !mb-2 rounded-lg border-none !w-full"
                                isSearchable={true}
                                style={{ width: "100%" }}
                                containerStyle={{ width: "100%" }}
                                readOnly={modelType === "view"}
                            />
                            {errors.requirementForDesignation && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.requirementForDesignation}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Number of Positions and Experience Required Row */}
                <div className="flex flex-col md:flex-row gap-4 w-full">
                    <div className="md:w-1/2 w-full">
                        <CustomTextInput
                            label="Number of Positions"
                            placeholder="Enter number of positions"
                            value={formData.numberOfPositions}
                            onChange={(value) => {
                                handleInputChange("numberOfPositions", value);
                                if (value && value > 0) {
                                    setErrors({
                                        ...errors,
                                        numberOfPositions: "",
                                    });
                                }
                            }}
                            type="number"
                            min="1"
                            required={modelType !== "view"}
                            error={errors.numberOfPositions}
                            className="w-full !mb-0"
                            readOnly={modelType === "view"}
                        />
                    </div>
                    <div className="md:w-1/2 w-full">
                        <CustomTextInput
                            label="Experience Required (Years)"
                            placeholder="Enter years of experience"
                            value={formData.experienceRequired}
                            onChange={(value) => {
                                handleInputChange("experienceRequired", value);
                                if (value && value >= 0) {
                                    setErrors({
                                        ...errors,
                                        experienceRequired: "",
                                    });
                                }
                            }}
                            type="number"
                            min="0"
                            required={modelType !== "view"}
                            error={errors.experienceRequired}
                            className="w-full !mb-0"
                            readOnly={modelType === "view"}
                        />
                    </div>
                </div>

                {/* Category and Type Row */}
                <div className="flex flex-col md:flex-row gap-4 w-full">
                    <div className="md:w-1/2 w-full flex flex-col">
                        <div className="w-full">
                            <CustomDropdown
                                label="Requirement Category"
                                options={requirementCategories}
                                value={formData.requirementForCategory}
                                onChange={(value) => {
                                    handleInputChange(
                                        "requirementForCategory",
                                        value
                                    );
                                    if (value) {
                                        setErrors({
                                            ...errors,
                                            requirementForCategory: "",
                                        });
                                    }
                                }}
                                placeholder="Select requirement category"
                                required={modelType !== "view"}
                                mode="single"
                                className="shadow-none relative !mb-2 rounded-lg border-none !w-full"
                                isSearchable={false}
                                style={{ width: "100%" }}
                                containerStyle={{ width: "100%" }}
                                readOnly={modelType === "view"}
                            />
                            {errors.requirementForCategory && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.requirementForCategory}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="md:w-1/2 w-full flex flex-col">
                        <div className="w-full">
                            <CustomDropdown
                                label="Requirement Type"
                                options={requirementTypes}
                                value={formData.requirementType}
                                onChange={(value) => {
                                    handleInputChange("requirementType", value);
                                    if (value) {
                                        setErrors({
                                            ...errors,
                                            requirementType: "",
                                        });
                                    }
                                }}
                                placeholder="Select requirement type"
                                required={modelType !== "view"}
                                mode="single"
                                className="shadow-none relative !mb-2 rounded-lg border-none !w-full"
                                isSearchable={false}
                                style={{ width: "100%" }}
                                containerStyle={{ width: "100%" }}
                                readOnly={modelType === "view"}
                            />
                            {errors.requirementType && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.requirementType}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full">
                    {/* Expected Joining Date */}
                    <div className="md:w-1/2 w-full flex flex-col">
                        <div className="w-full">
                            <ModernDateRangePicker
                                label="Expected Joining Date"
                                onChange={(date) => {
                                    handleInputChange(
                                        "expectedJoiningDate",
                                        date
                                    );
                                    if (date) {
                                        setErrors({
                                            ...errors,
                                            expectedJoiningDate: "",
                                        });
                                    }
                                }}
                                initialStartDate={expectedJoiningDateValue}
                                isSingle={true}
                                selectionMode="single"
                                placeholder="Select expected joining date"
                                isRequired={modelType !== "view"}
                                isDisabled={modelType === "view"}
                                className="!w-full"
                                shouldCloseOnSelect={true}
                            />
                            {errors.expectedJoiningDate && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.expectedJoiningDate}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="md:w-1/2 w-full flex flex-col"></div>
                </div>

                {/* Job Description */}
                <div>
                    <RichTextEditor
                        label="Job Description"
                        value={formData.jobDescription}
                        onChange={(value) => {
                            handleInputChange("jobDescription", value);
                            if (value.trim()) {
                                setErrors({
                                    ...errors,
                                    jobDescription: "",
                                });
                            }
                        }}
                        placeholder="Enter detailed job description..."
                        required={modelType !== "view"}
                        error={errors.jobDescription}
                        minHeight="150px"
                        maxHeight="250px"
                        toolbarOptions={modelType === "view" ? [] : []}
                        readOnly={modelType === "view"}
                    />
                </div>

                {/* Requested By */}
                <div className="flex flex-col md:flex-row gap-4 w-full">
                    <div className="md:w-1/2 w-full flex flex-col">
                        <div className="w-full">
                            <CustomDropdown
                                label="Requested By"
                                options={employeeOptions}
                                value={formData.requestedBy}
                                onChange={(value) => {
                                    handleInputChange("requestedBy", value);
                                    if (value) {
                                        setErrors({
                                            ...errors,
                                            requestedBy: "",
                                        });
                                    }
                                }}
                                placeholder="Select requesting person"
                                required={modelType !== "view"}
                                mode="single"
                                className="shadow-none relative !mb-2 rounded-lg border-none !w-full"
                                isSearchable={true}
                                style={{ width: "100%" }}
                                containerStyle={{ width: "100%" }}
                                readOnly={modelType === "view"}
                                dropdownPosition="top"
                            />
                            {errors.requestedBy && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.requestedBy}
                                </p>
                            )}
                        </div>
                    </div>
                    {/* Agreed By Dropdown */}
                    <div className="md:w-1/2 w-full flex flex-col">
                        <div className="w-full">
                            <CustomDropdown
                                label="Agreed By"
                                options={employeeOptions}
                                value={formData.agreedBy}
                                onChange={(value) => {
                                    handleInputChange("agreedBy", value);
                                    if (value) {
                                        setErrors({
                                            ...errors,
                                            agreedBy: "",
                                        });
                                    }
                                }}
                                placeholder="Select agreeing person"
                                required={modelType !== "view"}
                                mode="single"
                                className="shadow-none relative !mb-2 rounded-lg border-none !w-full"
                                isSearchable={true}
                                style={{ width: "100%" }}
                                dropdownPosition="top"
                                containerStyle={{ width: "100%" }}
                                readOnly={
                                    modelType === "view" ||
                                    !formData.isAgreedByDifferent
                                }
                            />
                            {errors.agreedBy && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.agreedBy}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Agreed By Section */}
                {modelType !== "view" && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                id="isAgreedByDifferent"
                                checked={formData.isAgreedByDifferent}
                                onChange={(e) =>
                                    handleInputChange(
                                        "isAgreedByDifferent",
                                        e.target.checked
                                    )
                                }
                                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                                htmlFor="isAgreedByDifferent"
                                className="text-sm font-medium text-gray-700"
                            >
                                Agreed by is different from requested by
                            </label>
                        </div>
                    </div>
                )}

                {/* Status */}
                <div className="flex flex-col md:flex-row gap-4 w-full">
                    {/* Approval Status Dropdown */}
                    <div className="md:w-1/2 w-full flex flex-col">
                        <div className="w-full">
                            <CustomDropdown
                                label="Approval Status"
                                options={approvedStatusOptions}
                                value={formData.approvalStatus}
                                onChange={(value) => {
                                    handleInputChange("approvalStatus", value);
                                    if (value) {
                                        setErrors({
                                            ...errors,
                                            approvalStatus: "",
                                        });
                                    }
                                }}
                                placeholder="Select approval status"
                                required={false}
                                mode="single"
                                className="shadow-none relative !mb-2 rounded-lg border-none !w-full"
                                isSearchable={true}
                                style={{ width: "100%" }}
                                containerStyle={{ width: "100%" }}
                                readOnly={
                                    userRole === "level_1" ||
                                    userRole === "level_2" ||
                                    modelType === "view"
                                }
                                dropdownPosition="top"
                            />
                            {errors.approvalStatus && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.approvalStatus}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Requisition Status Dropdown */}
                    <div className="md:w-1/2 w-full flex flex-col">
                        <div className="w-full">
                            <CustomDropdown
                                label="Requisition Status"
                                options={requisitionStatusOptions}
                                value={formData.status}
                                onChange={(value) => {
                                    handleInputChange("status", value);
                                    if (value) {
                                        setErrors({
                                            ...errors,
                                            status: "",
                                        });
                                    }
                                }}
                                placeholder="Select requisition status"
                                required={false}
                                mode="single"
                                className="shadow-none relative !mb-2 rounded-lg border-none !w-full"
                                isSearchable={true}
                                style={{ width: "100%" }}
                                dropdownPosition="top"
                                containerStyle={{ width: "100%" }}
                                readOnly={
                                    userRole === "level_1" ||
                                    modelType === "view"
                                }
                            />
                            {errors.status && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.status}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </CustomModal>
    );
}

export default RequisitionModel;
