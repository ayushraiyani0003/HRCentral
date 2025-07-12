import React, { useState } from "react";
import {
    CustomModal,
    FileUpload,
    CustomizableTimeline,
    CustomTextInput,
    ModernDateRangePicker,
    CustomDropdown,
} from "../../../../components";

function LeavePageModels({
    addEmployeeModelOpen,
    setAddEmployeeModelOpen,
    uploadEmployeeModelOpen,
    setUploadEmployeeModelOpen,
}) {
    // Timeline state management
    const [currentStep, setCurrentStep] = useState(0);
    const [employeeFormData, setEmployeeFormData] = useState({});
    const [completedSteps, setCompletedSteps] = useState([]);

    const handleFilesSelected = (files) => {
        // console.log("Selected files:", files);
        // TODO: Handle file upload logic here
        // Handle file upload logic here
    };

    const handleFileRemove = (fileIndex) => {
        // console.log("Remove file at index:", fileIndex);
        // TODO: Handle file removal logic here
    };

    const handleFileError = (error) => {
        // console.error("File upload error:", error);
        // TODO: Handle file upload errors here
    };

    // Handler for when a step is clicked
    const handleStepClick = (stepIndex, step, status) => {
        // console.log("Step clicked:", stepIndex, step, status);
        if (status !== "disabled") {
            setCurrentStep(stepIndex);
        }
    };

    // Handler for next step
    const handleNext = () => {
        // Validate current step before proceeding
        if (validateCurrentStep()) {
            // Mark current step as completed
            if (!completedSteps.includes(currentStep)) {
                setCompletedSteps([...completedSteps, currentStep]);
            }

            // Move to next step
            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
            } else {
                // All steps completed
                handleCompleteAll();
            }
        }
    };

    // Handler for previous step
    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Handler for step change
    const handleStepChange = (stepIndex, step) => {
        // console.log("Step changed to:", stepIndex, step);
        // TODO: You can add additional logic here when step changes
    };

    // Validate current step
    const validateCurrentStep = () => {
        const currentStepData = steps[currentStep];
        if (!currentStepData) return false;

        // Check if all required fields are filled
        for (const field of currentStepData.fields) {
            if (field.required && !employeeFormData[field.name]) {
                alert(`Please fill in ${field.label}`);
                return false;
            }
        }
        return true;
    };

    // Handler for when all phases are completed
    const handleCompleteAll = () => {
        // console.log("All phases completed", employeeFormData);
        // TODO: Handle completion logic here {add tost hear}
        alert("Employee onboarding completed successfully!");
        // Close modal or redirect
        setAddEmployeeModelOpen(false);
    };

    // Handle form input changes - FIXED VERSION
    const handleInputChange = (fieldName, value) => {
        setEmployeeFormData((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
    };

    // Create individual setter functions for each field - THIS IS THE FIX
    const createFieldSetter = (fieldName) => {
        return (value) => {
            handleInputChange(fieldName, value);
        };
    };

    // Employee phases with form fields
    const steps = [
        {
            id: "personal",
            title: "Personal Information",
            description: "Basic personal details of the employee",
            fields: [
                {
                    name: "firstName",
                    label: "First Name",
                    required: true,
                    type: "text",
                },
                {
                    name: "lastName",
                    label: "Last Name",
                    required: true,
                    type: "text",
                },
                {
                    name: "email",
                    label: "Email Address",
                    required: true,
                    type: "email",
                },
                {
                    name: "phone",
                    label: "Phone Number",
                    required: true,
                    type: "tel",
                },
                { name: "dateOfBirth", label: "Date of Birth", type: "date" },
                { name: "address", label: "Address", type: "textarea" },
            ],
        },
        {
            id: "employment",
            title: "Employment Details",
            description: "Job role and employment information",
            fields: [
                {
                    name: "department",
                    label: "Department",
                    required: true,
                    type: "dropdown",
                    options: [
                        { value: "hr", label: "Human Resources" },
                        { value: "it", label: "Information Technology" },
                        { value: "finance", label: "Finance" },
                        { value: "marketing", label: "Marketing" },
                        { value: "sales", label: "Sales" },
                    ],
                },
                {
                    name: "position",
                    label: "Position",
                    required: true,
                    type: "text",
                },
                {
                    name: "employeeId",
                    label: "Employee ID",
                    required: true,
                    type: "text",
                },
                {
                    name: "startDate",
                    label: "Start Date",
                    type: "date",
                    required: true,
                },
                { name: "manager", label: "Reporting Manager", type: "text" },
                { name: "salary", label: "Base Salary", type: "number" },
            ],
        },
        {
            id: "benefits",
            title: "Benefits & Documentation",
            description: "Employee benefits and required documentation",
            fields: [
                {
                    name: "insurancePlan",
                    label: "Insurance Plan",
                    required: true,
                    type: "dropdown",
                    options: [
                        { value: "basic", label: "Basic Plan" },
                        { value: "premium", label: "Premium Plan" },
                        { value: "family", label: "Family Plan" },
                    ],
                },
                {
                    name: "bankAccount",
                    label: "Bank Account Details",
                    required: true,
                    type: "text",
                },
                {
                    name: "taxNumber",
                    label: "Tax ID Number",
                    required: true,
                    type: "text",
                },
                {
                    name: "emergencyContact",
                    label: "Emergency Contact Name",
                    required: true,
                    type: "text",
                },
                {
                    name: "emergencyPhone",
                    label: "Emergency Contact Phone",
                    required: true,
                    type: "tel",
                },
            ],
        },
    ];

    // Custom theme for timeline with enhanced styling options
    const timelineTheme = {
        colors: {
            completed: "bg-emerald-500 border-emerald-500 text-white",
            active: "bg-blue-500 border-blue-500 text-white",
            pending: "bg-white border-gray-300 text-gray-500",
            disabled: "bg-gray-100 border-gray-200 text-gray-400",
        },
        size: "md", // Options: 'sm', 'md', 'lg'
        animated: true, // Enable/disable animations
        indicatorSize: 36,
        stepSpacing: 32,
        containerStyle: {
            width: "100%",
            padding: "0",
        },
        cardStyle: {
            padding: "24px",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            backgroundColor: "white",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
    };

    // Custom step content renderer
    const renderStepContent = (step, stepIndex) => {
        const isActive = stepIndex === currentStep;
        const isCompleted = completedSteps.includes(stepIndex);

        return (
            <div className="step-content">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        {step.description}
                    </p>
                </div>

                {/* Form Fields in Grid Layout */}
                {isActive && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {step.fields.map((field) => (
                            <div key={field.name} className="form-group">
                                {field.type === "textarea" ? (
                                    <div className="xl:col-span-2">
                                        <CustomTextInput
                                            label={field.label}
                                            type="textarea"
                                            value={
                                                employeeFormData[field.name] ||
                                                ""
                                            }
                                            onChange={createFieldSetter(
                                                field.name
                                            )} // FIXED: Direct setter function
                                            required={field.required}
                                            placeholder={`Enter ${field.label.toLowerCase()}`}
                                            className="w-full !mb-0"
                                        />
                                    </div>
                                ) : field.type === "dropdown" ? (
                                    <CustomDropdown
                                        label={field.label}
                                        options={field.options}
                                        value={
                                            employeeFormData[field.name]
                                                ? [employeeFormData[field.name]]
                                                : []
                                        }
                                        onChange={(selectedValues) =>
                                            handleInputChange(
                                                field.name,
                                                selectedValues[0] || ""
                                            )
                                        }
                                        placeholder={`Select ${field.label}`}
                                        required={field.required}
                                        mode="single"
                                        className="w-full"
                                    />
                                ) : field.type === "date" ? (
                                    <ModernDateRangePicker
                                        label={field.label}
                                        isSingle={true}
                                        selectionMode="single"
                                        onChange={(date) =>
                                            handleInputChange(field.name, date)
                                        }
                                        initialStartDate={
                                            employeeFormData[field.name]
                                                ? new Date(
                                                      employeeFormData[
                                                          field.name
                                                      ]
                                                  )
                                                : null
                                        }
                                        placeholder={`Select ${field.label.toLowerCase()}`}
                                        isRequired={field.required}
                                        className="!w-full"
                                    />
                                ) : (
                                    <CustomTextInput
                                        label={field.label}
                                        type={field.type || "text"}
                                        value={
                                            employeeFormData[field.name] || ""
                                        }
                                        onChange={createFieldSetter(field.name)} // FIXED: Direct setter function
                                        required={field.required}
                                        placeholder={`Enter ${field.label.toLowerCase()}`}
                                        onlyNumbers={field.type === "number"}
                                        className="w-full !mb-0"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Completed Step Summary */}
                {isCompleted && !isActive && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                        <div className="flex items-center">
                            <svg
                                className="w-5 h-5 text-green-500 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                ></path>
                            </svg>
                            <span className="text-sm font-medium text-green-800">
                                Step completed
                            </span>
                        </div>
                        <div className="mt-2 text-sm text-green-700">
                            {
                                step.fields.filter(
                                    (f) => employeeFormData[f.name]
                                ).length
                            }{" "}
                            of {step.fields.length} fields filled
                        </div>
                    </div>
                )}

                {/* Pending Step Info */}
                {!isActive && !isCompleted && (
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                        <div className="text-sm text-gray-600">
                            Complete previous steps to unlock this section
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Reset form when modal closes
    const handleModalClose = () => {
        setCurrentStep(0);
        setEmployeeFormData({});
        setCompletedSteps([]);
        setAddEmployeeModelOpen(false);
    };

    return (
        <>
            {/* Add Employee Modal */}
            <CustomModal
                isOpen={addEmployeeModelOpen}
                onClose={handleModalClose}
                title="Add New Employee"
                size="large"
                showCloseButton={true}
                closeOnOverlayClick={false} // Prevent accidental closes
                closeOnEscape={true}
                bodyClassName="!px-6 !py-3"
            >
                <div className="px-6 py-0">
                    {/* Timeline Component */}
                    <CustomizableTimeline
                        steps={steps}
                        currentStep={currentStep}
                        orientation="horizontal"
                        theme={timelineTheme}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        onStepClick={handleStepClick}
                        showNavigationButtons={true}
                        onStepChange={handleStepChange}
                        renderStepContent={renderStepContent}
                        clickableSteps={true}
                        allowSkipSteps={false}
                    />
                </div>
            </CustomModal>

            {/* Upload Employees Modal */}
            <CustomModal
                isOpen={uploadEmployeeModelOpen}
                onClose={() => setUploadEmployeeModelOpen(false)}
                title="Upload Employees"
                size="medium"
                showCloseButton={true}
                closeOnOverlayClick={true}
                closeOnEscape={true}
            >
                <div className="p-4">
                    <FileUpload
                        label="Upload Employee Data"
                        accept=".csv,.xlsx,.xls"
                        multiple={false}
                        maxFileSize={10 * 1024 * 1024} // 10MB
                        maxFiles={1}
                        onFilesSelected={handleFilesSelected}
                        onFileRemove={handleFileRemove}
                        onError={handleFileError}
                        showPreview={true}
                        required={false}
                        buttonText="Choose File"
                        dragDropText="Drag & drop your employee file here"
                        size="medium"
                        variant="default"
                        color="primary"
                    />
                </div>
            </CustomModal>
        </>
    );
}

export default LeavePageModels;
