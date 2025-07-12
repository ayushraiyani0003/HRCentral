import { useState, useEffect } from "react";

const useRequisitionModel = ({
    modelType,
    requisition,
    departments = [],
    designations = [],
    employees = [],
    handleCloseRequisitionModel,
    setRequisitionModel,
    userRole,
}) => {
    const [formData, setFormData] = useState({
        requirementForDepartment: "",
        requirementForDesignation: "",
        numberOfPositions: "",
        requirementForCategory: "",
        requirementType: "",
        expectedJoiningDate: null,
        experienceRequired: "",
        jobDescription: "",
        requestedBy: "",
        isAgreedByDifferent: false,
        agreedBy: "",
        status: "pending", // Default value
        approvalStatus: "pending", // Default value
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Convert departments to dropdown options
    const departmentOptions = departments.map((dept) => ({
        label: dept.name,
        value: dept.id,
    }));

    // Convert designations to dropdown options
    const designationOptions = designations.map((designation) => ({
        label: designation.name,
        value: designation.id,
    }));

    // Convert employees to dropdown options
    const employeeOptions = employees.map((employee) => ({
        label: employee.name,
        value: employee.id,
    }));

    // Initialize form data when editing or viewing
    useEffect(() => {
        if ((modelType === "edit" || modelType === "view") && requisition) {
            setFormData({
                // Fixed field mapping - using actual requisition object field names
                requirementForDepartment:
                    requisition.requirementForDepartment || "",
                requirementForDesignation:
                    requisition.requirementForDesignation || "",
                numberOfPositions: requisition.numberOfPositions || "",
                requirementForCategory:
                    requisition.requirementForCategory || "",
                requirementType: requisition.requirementType || "",
                expectedJoiningDate: requisition.expectedJoiningDate || null,
                experienceRequired: requisition.experienceRequired || "",
                jobDescription: requisition.jobDescription || "",
                requestedBy: requisition.requestedBy || "",
                isAgreedByDifferent: requisition.isAgreedByDifferent || false,
                agreedBy: requisition.agreedBy || "",
                status: requisition.status || "pending",
                approvalStatus: requisition.approvalStatus || "pending",
            });
        } else if (modelType === "add") {
            // Set default department based on user info if available
            const defaultDepartment =
                departments.find((dept) => dept.isUserDefault)?.id || "";
            setFormData({
                requirementForDepartment: defaultDepartment,
                requirementForDesignation: "",
                numberOfPositions: "",
                requirementForCategory: "",
                requirementType: "",
                expectedJoiningDate: null,
                experienceRequired: "",
                jobDescription: "",
                requestedBy: "",
                isAgreedByDifferent: false,
                agreedBy: "",
                status: "pending",
                approvalStatus: "pending",
            });
        }
    }, [modelType, requisition, departments]);

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

        // Handle special logic for agreed by checkbox
        if (field === "isAgreedByDifferent") {
            if (!value) {
                // If unchecked, set agreedBy same as requestedBy
                setFormData((prev) => ({
                    ...prev,
                    [field]: value,
                    agreedBy: prev.requestedBy,
                }));
            } else {
                setFormData((prev) => ({
                    ...prev,
                    [field]: value,
                    agreedBy: "",
                }));
            }
        }

        // If requestedBy changes and isAgreedByDifferent is false, update agreedBy
        if (field === "requestedBy" && !formData.isAgreedByDifferent) {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
                agreedBy: value,
            }));
        }
    };

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        if (!formData.requirementForDepartment) {
            newErrors.requirementForDepartment = "Department is required";
        }

        if (!formData.requirementForDesignation) {
            newErrors.requirementForDesignation = "Designation is required";
        }

        if (!formData.numberOfPositions || formData.numberOfPositions <= 0) {
            newErrors.numberOfPositions =
                "Number of positions is required and must be greater than 0";
        }

        if (!formData.requirementForCategory) {
            newErrors.requirementForCategory =
                "Requirement category is required";
        }

        if (!formData.requirementType) {
            newErrors.requirementType = "Requirement type is required";
        }

        if (!formData.expectedJoiningDate) {
            newErrors.expectedJoiningDate = "Expected joining date is required";
        }

        if (
            formData.experienceRequired === "" ||
            formData.experienceRequired < 0
        ) {
            newErrors.experienceRequired =
                "Experience required is required and must be 0 or greater";
        }

        if (!formData.jobDescription.trim()) {
            newErrors.jobDescription = "Job description is required";
        }

        if (!formData.requestedBy) {
            newErrors.requestedBy = "Requested by is required";
        }

        if (!formData.agreedBy) {
            newErrors.agreedBy = "Agreed by is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSave = (data) => {
        // Handle save logic here
        console.log("Saving new requisition:", data);
        handleCloseRequisitionModel();
    };

    const onUpdate = (data) => {
        // Handle update logic here
        console.log("Updating requisition:", data);
        handleCloseRequisitionModel();
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
            setRequisitionModel(false);
        } catch (error) {
            console.error("Error saving requisition:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        setFormData({
            requirementForDepartment: "",
            requirementForDesignation: "",
            numberOfPositions: "",
            requirementForCategory: "",
            requirementType: "",
            expectedJoiningDate: null,
            experienceRequired: "",
            jobDescription: "",
            requestedBy: "",
            isAgreedByDifferent: false,
            agreedBy: "",
            status: "pending",
            approvalStatus: "pending",
        });
        setErrors({});
        setRequisitionModel(false);
    };

    return {
        formData,
        errors,
        isLoading,
        userRole,
        departmentOptions,
        designationOptions,
        employeeOptions,
        handleInputChange,
        validateForm,
        handleSubmit,
        handleCancel,
        setErrors,
    };
};

export default useRequisitionModel;
