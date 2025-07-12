import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { useToast } from "../../../components";
import {
    createCompanyStructure,
    updateCompanyStructure,
    fetchAllCompanyStructures,
    selectCompanyStructures,
    selectLoading,
    selectErrors,
} from "../../../store/CompanyStructureSlice";

import {
    fetchCountries,
    selectCountries,
    selectLoading as selectCountriesLoading,
    selectError as selectCountriesError,
} from "../../../store/countrySlice";

// Simplified memoized selector since selectCountries already returns an array
const selectMemoizedCountries = createSelector(
    [selectCountries],
    (countries) => {
        // selectCountries already handles the data transformation and returns an array
        return countries || [];
    }
);

// Memoized loading selector for countries
const selectMemoizedCountriesLoading = createSelector(
    [selectCountriesLoading],
    (loadingState) => {
        try {
            return loadingState || { fetch: false };
        } catch (error) {
            console.warn("Error accessing countries loading:", error);
            return { fetch: false };
        }
    }
);

// Memoized error selector for countries
const selectMemoizedCountriesError = createSelector(
    [selectCountriesError],
    (error) => error || null
);

const useCompanyStructureDetailsModel = ({
    setOpenStructureModel,
    modelType,
    companyStructure,
    handleCloseStructureModel,
}) => {
    const dispatch = useDispatch();
    const { addToast } = useToast();

    // Redux state selectors with memoization
    const existingCompanyStructures = useSelector(selectCompanyStructures);
    const loading = useSelector(selectLoading);
    const errors = useSelector(selectErrors);
    const countries = useSelector(selectMemoizedCountries);
    const countriesLoading = useSelector(selectMemoizedCountriesLoading);
    const countriesError = useSelector(selectMemoizedCountriesError);

    // Form state - backend compatible fields
    const [formData, setFormData] = useState({
        name: "",
        details: "",
        address: "",
        type: "",
        country_id: "",
        parent_id: "",
        head_id: "",
    });

    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Structure type options
    const structureTypes = useMemo(
        () => [
            { label: "Company", value: "company" },
            { label: "Head Office", value: "head office" },
            { label: "Regional Office", value: "regional office" },
            { label: "Department", value: "department" },
            { label: "Unit", value: "unit" },
            { label: "Sub Unit", value: "subUnit" },
            { label: "Other", value: "other" },
        ],
        []
    );

    // Memoized country options
    const countryOptions = useMemo(() => {
        return countries.map((country) => ({
            label: country.name || country.label,
            value: country.id || country.uuid,
            id: country.id || country.uuid,
            name: country.name || country.label,
            code: country.code || country.countryCode,
            phoneCode: country.phone_code,
        }));
    }, [countries]);

    // Memoized parent structure options
    const parentStructureOptions = useMemo(() => {
        return existingCompanyStructures
            .filter((structure) => structure.id !== companyStructure?.id)
            .map((structure) => ({
                label: structure.name,
                value: structure.id || structure.uuid,
                id: structure.id || structure.uuid,
                name: structure.name,
                type: structure.type,
            }));
    }, [existingCompanyStructures, companyStructure?.id]);

    // Department heads options
    const headsOptions = useMemo(() => {
        const departmentHeads = [
            { name: "Company", id: "company" },
            { name: "Head Office", id: "head office" },
            { name: "Regional Office", id: "regional office" },
            { name: "Department", id: "department" },
            { name: "Unit", id: "unit" },
            { name: "Sub Unit", id: "subUnit" },
        ];

        return departmentHeads.map((head) => ({
            label: head.name,
            value: head.id || head.name,
        }));
    }, []);

    // Helper function to parse and display detailed error messages
    const parseErrorMessage = useCallback((error) => {
        if (typeof error === "string") {
            return error;
        }

        // Handle validation errors (usually an object with field-specific errors)
        if (error && typeof error === "object") {
            // Check for common error structures
            if (error.message) {
                return error.message;
            }

            if (error.error) {
                return error.error;
            }

            if (error.data) {
                if (error.data.message) {
                    return error.data.message;
                }

                // Handle validation errors structure like { field: ["error message"] }
                if (typeof error.data === "object") {
                    const errorMessages = [];
                    Object.entries(error.data).forEach(([field, messages]) => {
                        if (Array.isArray(messages)) {
                            messages.forEach((msg) =>
                                errorMessages.push(`${field}: ${msg}`)
                            );
                        } else if (typeof messages === "string") {
                            errorMessages.push(`${field}: ${messages}`);
                        }
                    });
                    if (errorMessages.length > 0) {
                        return errorMessages.join(", ");
                    }
                }
            }

            // Handle response errors
            if (error.response?.data) {
                if (error.response.data.message) {
                    return error.response.data.message;
                }

                if (typeof error.response.data === "object") {
                    const errorMessages = [];
                    Object.entries(error.response.data).forEach(
                        ([field, messages]) => {
                            if (Array.isArray(messages)) {
                                messages.forEach((msg) =>
                                    errorMessages.push(`${field}: ${msg}`)
                                );
                            } else if (typeof messages === "string") {
                                errorMessages.push(`${field}: ${messages}`);
                            }
                        }
                    );
                    if (errorMessages.length > 0) {
                        return errorMessages.join(", ");
                    }
                }
            }

            // Handle rejected promise errors
            if (error.rejectedValue) {
                return parseErrorMessage(error.rejectedValue);
            }
        }

        return "An unexpected error occurred";
    }, []);

    // Helper function to display error messages via toast
    const displayErrorToast = useCallback(
        (error, defaultMessage = "An error occurred") => {
            const errorMessage = parseErrorMessage(error) || defaultMessage;
            addToast(errorMessage, "error", 6000);
        },
        [addToast, parseErrorMessage]
    );

    // Helper function to display success messages via toast
    const displaySuccessToast = useCallback(
        (message) => {
            addToast(message, "success", 4000);
        },
        [addToast]
    );

    // Helper function to display validation errors via toast
    const displayValidationErrors = useCallback(
        (errors) => {
            const errorMessages = Object.entries(errors)
                .filter(([_, value]) => value)
                .map(([field, message]) => `${field}: ${message}`);

            if (errorMessages.length > 0) {
                addToast(
                    `Please fix the following errors: ${errorMessages.join(
                        ", "
                    )}`,
                    "warning",
                    7000
                );
            }
        },
        [addToast]
    );

    // Watch for countries errors and display them
    useEffect(() => {
        if (countriesError) {
            displayErrorToast(countriesError, "Failed to load countries");
        }
    }, [countriesError, displayErrorToast]);

    // Fetch countries on component mount - Updated to use simplified call
    useEffect(() => {
        if (countries.length === 0 && !countriesLoading.fetch) {
            dispatch(fetchCountries())
                .unwrap()
                .then(() => {
                    // debug only
                    console.log("Countries fetched successfully");
                })
                .catch((error) => {
                    displayErrorToast(error, "Failed to fetch countries");
                });
        }
    }, [dispatch, countries.length, countriesLoading.fetch, displayErrorToast]);

    // Fetch existing company structures
    useEffect(() => {
        if (existingCompanyStructures.length === 0 && !loading.entities) {
            dispatch(fetchAllCompanyStructures({ page: 1, pageSize: 1000 }))
                .unwrap()
                .then(() => {
                    // debug only
                    console.log("Company structures fetched successfully");
                })
                .catch((error) => {
                    displayErrorToast(
                        error,
                        "Failed to fetch company structures"
                    );
                });
        }
    }, [
        dispatch,
        existingCompanyStructures.length,
        loading.entities,
        displayErrorToast,
    ]);

    // Initialize form data for edit/view mode
    const initializeFormData = useCallback(() => {
        if (!companyStructure || isInitialized) return;

        // debug only
        console.log("Initializing form data:", {
            companyStructure,
            countries: countries.length,
        });

        // Find country by name/label and get its ID
        const selectedCountry = countries.find(
            (country) =>
                (country.name || country.label) === companyStructure.country
        );

        // Find parent structure by name and get its ID
        const selectedParent = existingCompanyStructures.find(
            (structure) => structure.id === companyStructure.parent_id
        );

        const newFormData = {
            name: companyStructure.name || "",
            details: companyStructure.details || "",
            address: companyStructure.address || "",
            type: companyStructure.type || "",
            country_id: selectedCountry?.id || selectedCountry?.uuid || "",
            parent_id: selectedParent?.id || selectedParent?.uuid || "",
            head_id: companyStructure.head || "",
        };

        // debug only
        console.log("Setting form data:", newFormData);

        setFormData(newFormData);
        setFormErrors({});
        setIsInitialized(true);

        displaySuccessToast("Form initialized successfully");
    }, [
        companyStructure,
        countries,
        existingCompanyStructures,
        isInitialized,
        displaySuccessToast,
    ]);

    // Reset form data for add mode
    const resetFormData = useCallback(() => {
        // debug only
        console.log("Resetting form data");
        setFormData({
            name: "",
            details: "",
            address: "",
            type: "",
            country_id: "",
            parent_id: "",
            head_id: "",
        });
        setFormErrors({});
        setIsInitialized(false);
    }, []);

    // Main initialization effect
    useEffect(() => {
        // debug only
        console.log("Initialization effect:", {
            modelType,
            hasCompanyStructure: !!companyStructure,
            isInitialized,
            countriesLength: countries.length,
        });

        if (modelType === "add") {
            resetFormData();
        } else if (
            (modelType === "edit" || modelType === "view") &&
            companyStructure
        ) {
            // Only initialize if we have countries loaded and haven't initialized yet
            if (countries.length > 0 && !isInitialized) {
                initializeFormData();
            }
        }
    }, [
        modelType,
        companyStructure,
        countries.length,
        isInitialized,
        initializeFormData,
        resetFormData,
    ]);

    // Handle input changes - FIXED VERSION
    const handleInputChange = useCallback(
        (field, value) => {
            // debug only
            console.log(`Updating ${field} with value:`, value);

            setFormData((prev) => {
                const newData = {
                    ...prev,
                    [field]: value,
                };

                // debug only
                console.log("New form data:", newData);
                return newData;
            });

            // Clear error when user starts typing
            if (formErrors[field]) {
                setFormErrors((prev) => ({
                    ...prev,
                    [field]: "",
                }));
            }
        },
        [formErrors]
    );

    // Watch for Redux errors and display them
    useEffect(() => {
        if (errors?.create) {
            displayErrorToast(
                errors.create,
                "Failed to create company structure"
            );
        }
        if (errors?.update) {
            displayErrorToast(
                errors.update,
                "Failed to update company structure"
            );
        }
        if (errors?.fetch) {
            displayErrorToast(
                errors.fetch,
                "Failed to fetch company structures"
            );
        }
    }, [errors, displayErrorToast]);

    // Validation function
    const validateForm = useCallback(() => {
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

        if (!formData.country_id) {
            newErrors.country_id = "Country is required";
        }

        if (!formData.address.trim()) {
            newErrors.address = "Address is required";
        }

        setFormErrors(newErrors);

        // Display validation errors if any
        if (Object.keys(newErrors).length > 0) {
            displayValidationErrors(newErrors);
            return false;
        }

        return true;
    }, [formData, displayValidationErrors]);

    // Handle form submission
    const handleSubmit = useCallback(async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const submitData = {
                name: formData.name.trim(),
                details: formData.details.trim(),
                address: formData.address.trim(),
                type: formData.type,
                country_id: formData.country_id,
                parent_id: formData.parent_id || null,
                head_id: formData.head_id || null,
            };

            // debug only
            console.log("Submitting data:", submitData);
            console.log("Model type:", modelType);
            console.log("Company structure ID:", companyStructure?.id);

            let result;
            if (modelType === "edit" && companyStructure?.id) {
                // debug only
                console.log("Updating company structure");
                result = await dispatch(
                    updateCompanyStructure({
                        id: companyStructure.id,
                        data: submitData,
                    })
                ).unwrap();
                displaySuccessToast("Company structure updated successfully!");
            } else {
                // debug only
                console.log("Creating new company structure");
                result = await dispatch(
                    createCompanyStructure(submitData)
                ).unwrap();
                displaySuccessToast("Company structure created successfully!");
            }

            // debug only
            console.log("Operation result:", result);

            // Refresh the company structures list
            await dispatch(
                fetchAllCompanyStructures({ page: 1, pageSize: 10 })
            );

            // Close modal
            setOpenStructureModel(false);
            handleCloseStructureModel?.();

            // Reset initialization flag
            setIsInitialized(false);
        } catch (error) {
            console.error("Error saving structure:", error);
            displayErrorToast(
                error,
                modelType === "edit"
                    ? "Failed to update company structure"
                    : "Failed to create company structure"
            );
        } finally {
            setIsSubmitting(false);
        }
    }, [
        validateForm,
        formData,
        modelType,
        companyStructure?.id,
        dispatch,
        setOpenStructureModel,
        handleCloseStructureModel,
        displaySuccessToast,
        displayErrorToast,
    ]);

    // Handle cancel
    const handleCancel = useCallback(() => {
        resetFormData();
        setOpenStructureModel(false);
        handleCloseStructureModel?.();
        displaySuccessToast("Operation cancelled");
    }, [
        setOpenStructureModel,
        handleCloseStructureModel,
        resetFormData,
        displaySuccessToast,
    ]);

    // Get display values for form fields (for UI components that need display values)
    const getDisplayValues = useMemo(() => {
        const selectedCountry = countryOptions.find(
            (country) => country.id === formData.country_id
        );
        const selectedParent = parentStructureOptions.find(
            (parent) => parent.id === formData.parent_id
        );

        const heads = headsOptions.find(
            (head) => head.value === formData.head_id
        );

        return {
            country: selectedCountry?.name || "",
            parentStructure: selectedParent?.name || "",
            heads: heads?.label || "",
        };
    }, [
        formData.country_id,
        formData.parent_id,
        countryOptions,
        parentStructureOptions,
        headsOptions,
        formData.head_id,
    ]);

    return {
        // Form data and state
        formData,
        displayValues: getDisplayValues,
        errors: formErrors,
        isLoading: isSubmitting,
        isSubmitting,
        isInitialized,

        // Loading states from Redux
        countriesLoading: countriesLoading?.fetch || false,
        structuresLoading: loading?.entities || false,

        // Redux errors
        reduxErrors: errors,
        countriesError,

        // Form handlers
        handleInputChange,
        handleCancel,
        handleSubmit,

        // Options for dropdowns
        structureTypes,
        countryOptions,
        parentStructureOptions,
        headsOptions,

        // Raw data (for debugging or additional processing)
        countries,
        existingCompanyStructures,

        // Utility functions
        setErrors: setFormErrors,
        validateForm,
        initializeFormData,
        resetFormData,

        // Toast functions for external use
        displayErrorToast,
        displaySuccessToast,
        displayValidationErrors,
    };
};

export default useCompanyStructureDetailsModel;
