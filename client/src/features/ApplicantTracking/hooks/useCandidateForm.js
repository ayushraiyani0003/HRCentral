import { useState, useEffect } from "react";
3;
import useApplicantTrackingPage from "./useApplicantTrackingPage";

// Initial form state
const initialFormState = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    department: { value: "", label: "" },
    position: "",
    employeeId: "",
    startDate: "",
    manager: "",
    salary: "",
    insurancePlan: "",
    bankAccount: "",
    taxNumber: "",
    emergencyContact: "",
    emergencyPhone: "",
    fatherName: "",
    casteName: "",
    gender: "",
    maritalStatus: "",
    phone1: "",
    phone2: "",
    whatsapp: "",
    refEmpId: "",
    resume: "",
    profileSummary: "",
    totalExperience: "",
    relevantExperience: "",
};

const useCandidateForm = ({
    candidate = null,
    modalType = "add",
    openCandidateModal = false,
    onModalClose,
    steps = [],
}) => {
    const { userLevels } = useApplicantTrackingPage;
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [formData, setFormData] = useState(initialFormState);

    // Initialize form data when modal opens or candidate changes
    useEffect(() => {
        if (candidate && (modalType === "view" || modalType === "edit")) {
            setFormData({
                firstName: candidate.firstName || "",
                lastName: candidate.lastName || "",
                email: candidate.email || "",
                phone: candidate.phone || "",
                dateOfBirth: candidate.dateOfBirth || "",
                address: candidate.address || "",
                department: candidate.department || "",
                position: candidate.position || "",
                employeeId: candidate.employeeId || "",
                startDate: candidate.startDate || "",
                manager: candidate.manager || "",
                salary: candidate.salary || "",
                insurancePlan: candidate.insurancePlan || "",
                bankAccount: candidate.bankAccount || "",
                taxNumber: candidate.taxNumber || "",
                emergencyContact: candidate.emergencyContact || "",
                emergencyPhone: candidate.emergencyPhone || "",
                fatherName: candidate.fatherName || "",
                casteName: candidate.casteName || "",
                gender: candidate.gender || "",
                maritalStatus: candidate.maritalStatus || "",
                phone1: candidate.phone1 || "",
                phone2: candidate.phone2 || "",
                whatsapp: candidate.whatsapp || "",
                refEmpId: candidate.refEmpId || "",
                resume: candidate.resume || "",
                profileSummary: candidate.profileSummary || "",
                totalExperience: candidate.totalExperience || "",
                relevantExperience: candidate.relevantExperience || "",
            });
        } else if (modalType === "add") {
            // Reset form for add mode
            setFormData(initialFormState);
        }
    }, [candidate, modalType, openCandidateModal]);

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Create individual setter functions for each field
    const createFieldSetter = (fieldName) => {
        return (value) => {
            handleInputChange(fieldName, value);
        };
    };

    // Helper function to extract fields from different layout types
    const extractFieldsFromLayout = (step) => {
        let fields = [];

        if (step.fields) {
            fields = [...fields, ...step.fields];
        }

        if (step.layout?.sections) {
            step.layout.sections.forEach((section) => {
                if (section.fields) {
                    fields = [...fields, ...section.fields];
                }
            });
        }

        return fields;
    };

    // Validation for current step
    const validateCurrentStep = () => {
        const currentStepData = steps[currentStep];
        if (!currentStepData) return false;

        // For steps with custom layout, you might need custom validation
        if (currentStepData.layout?.type === "custom") {
            return true; // Add custom validation logic here
        }

        // Extract fields from various layout types
        const fieldsToValidate = extractFieldsFromLayout(currentStepData);

        for (const field of fieldsToValidate) {
            if (field.required && !formData[field.name]) {
                alert(`Please fill in ${field.label}`);
                return false;
            }
        }
        return true;
    };

    // Step navigation handlers
    const handleNext = () => {
        if (validateCurrentStep()) {
            if (!completedSteps.includes(currentStep)) {
                setCompletedSteps([...completedSteps, currentStep]);
            }

            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
            } else {
                handleCompleteAll();
            }
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleStepClick = (stepIndex, step, status) => {
        // debug only
        console.log("Step clicked:", stepIndex, step, status);
        if (status !== "disabled") {
            setCurrentStep(stepIndex);
        }
    };

    const handleStepChange = (stepIndex, step) => {
        // debug only
        console.log("Step changed to:", stepIndex, step);
    };

    // Complete all steps
    const handleCompleteAll = () => {
        // debug only
        console.log("All phases completed", formData);
        alert("Candidate information completed successfully!");
        handleSubmit();
    };

    // Form submission
    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            // Debug only
            console.log("Submitting form data:", formData);
            console.log("Modal type:", modalType);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // You can add actual API call here
            // const response = await submitCandidateData(formData, modalType);

            handleModalClose();
        } catch (error) {
            console.error("Error submitting form:", error);
            // Handle error appropriately
        } finally {
            setIsLoading(false);
        }
    };

    // Cancel form
    const handleCancel = () => {
        handleModalClose();
    };

    // Close modal and reset state
    const handleModalClose = () => {
        setCurrentStep(0);
        setFormData(initialFormState);
        setCompletedSteps([]);
        if (onModalClose) {
            onModalClose();
        }
    };

    // Reset form to initial state
    const resetForm = () => {
        setFormData(initialFormState);
        setCurrentStep(0);
        setCompletedSteps([]);
    };

    // Update specific field
    const updateField = (fieldName, value) => {
        handleInputChange(fieldName, value);
    };

    // Bulk update form data
    const updateFormData = (newData) => {
        setFormData((prev) => ({
            ...prev,
            ...newData,
        }));
    };

    // Get current step data
    const getCurrentStepData = () => {
        return steps[currentStep] || null;
    };

    // Check if current step is valid
    const isCurrentStepValid = () => {
        return validateCurrentStep();
    };

    // Check if step is completed
    const isStepCompleted = (stepIndex) => {
        return completedSteps.includes(stepIndex);
    };

    // Mark step as completed
    const markStepCompleted = (stepIndex) => {
        if (!completedSteps.includes(stepIndex)) {
            setCompletedSteps([...completedSteps, stepIndex]);
        }
    };

    // Check if form has unsaved changes
    const hasUnsavedChanges = () => {
        if (!candidate)
            return Object.values(formData).some((value) => value !== "");

        return Object.keys(formData).some((key) => {
            return formData[key] !== (candidate[key] || "");
        });
    };

    return {
        // State
        isLoading,
        currentStep,
        completedSteps,
        formData,

        // Handlers
        handleInputChange,
        createFieldSetter,
        handleNext,
        handlePrevious,
        handleStepClick,
        handleStepChange,
        handleSubmit,
        handleCancel,
        handleModalClose,
        handleCompleteAll,

        // Validation
        validateCurrentStep,
        isCurrentStepValid,
        extractFieldsFromLayout,

        // Utilities
        resetForm,
        updateField,
        updateFormData,
        getCurrentStepData,
        isStepCompleted,
        markStepCompleted,
        hasUnsavedChanges,

        // Setters (if you need direct access)
        setCurrentStep,
        setCompletedSteps,
        setFormData,
        setIsLoading,
    };
};

export default useCandidateForm;
