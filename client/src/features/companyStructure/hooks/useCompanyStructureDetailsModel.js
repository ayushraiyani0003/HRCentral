import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
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
} from "../../../store/countrySlice";

// Memoized selectors to prevent unnecessary re-renders
const selectMemoizedCountries = createSelector(
    [selectCountries],
    (countryState) => {
        try {
            if (countryState?.data && Array.isArray(countryState.data)) {
                return countryState.data;
            }
            if (Array.isArray(countryState)) {
                return countryState;
            }
            return [];
        } catch (error) {
            console.warn("Error accessing countries:", error);
            return [];
        }
    }
);

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

const useCompanyStructureDetailsModel = ({
    setOpenStructureModel,
    modelType,
    companyStructure,
    handleCloseStructureModel,
}) => {
    const dispatch = useDispatch();

    // Redux state selectors with memoization
    const existingCompanyStructures = useSelector(selectCompanyStructures);
    const loading = useSelector(selectLoading);
    const errors = useSelector(selectErrors);
    const countries = useSelector(selectMemoizedCountries);
    const countriesLoading = useSelector(selectMemoizedCountriesLoading);

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

    // Fetch countries on component mount
    useEffect(() => {
        if (countries.length === 0 && !countriesLoading.fetch) {
            dispatch(fetchCountries({ limit: 1000, page: 1 }));
        }
    }, [dispatch, countries.length, countriesLoading.fetch]);

    // Fetch existing company structures
    useEffect(() => {
        if (existingCompanyStructures.length === 0 && !loading.entities) {
            dispatch(fetchAllCompanyStructures({ page: 1, pageSize: 1000 }));
        }
    }, [dispatch, existingCompanyStructures.length, loading.entities]);

    // Initialize form data for edit/view mode
    const initializeFormData = useCallback(() => {
        if (!companyStructure || isInitialized) return;

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

        console.log(existingCompanyStructures);

        // hear i get parent_id and uuid null
        console.log("selectedParent", selectedParent);
        console.log("selectedParent?.id", selectedParent?.parent_id);
        console.log("selectedParent?.uuid", selectedParent?.uuid);

        const newFormData = {
            name: companyStructure.name || "",
            details: companyStructure.details || "",
            address: companyStructure.address || "",
            type: companyStructure.type || "",
            country_id: selectedCountry?.id || selectedCountry?.uuid || "",
            parent_id: selectedParent?.id || selectedParent?.uuid || "",
            head_id: companyStructure.head || "",
        };

        console.log("Setting form data:", newFormData);

        setFormData(newFormData);
        setFormErrors({});
        setIsInitialized(true);
    }, [companyStructure, countries, existingCompanyStructures, isInitialized]);

    // Reset form data for add mode
    const resetFormData = useCallback(() => {
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

    // Handle input changes
    const handleInputChange = useCallback(
        (field, value) => {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));

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
        return Object.keys(newErrors).length === 0;
    }, [formData]);

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

            console.log("Submitting data:", submitData);
            // Submitting data:{
            //     "name": "dfg",
            //     "details": "sazedg&nbsp;",
            //     "address": "sz dgetr seg xzdga seg Za4erwgxzd",
            //     "type": "department",
            //     "country_id": "13bb64b5-44e9-11f0-9a31-d843aea192eb",
            //     "parent_id": null,
            //     "head_id": null
            // }
            // country_id is not change even i change the value in dropdown.
            console.log("Model type:", modelType); // Model type: edit
            console.log("Company structure ID:", companyStructure?.id); // Company structure ID: 19c5e35d-4294-4047-8bc3-5f1aaa413431

            if (modelType === "edit" && companyStructure?.id) {
                console.log("on edit this called");
                await dispatch(
                    updateCompanyStructure({
                        id: companyStructure.id,
                        data: submitData,
                    })
                ).unwrap();
            } else {
                await dispatch(createCompanyStructure(submitData)).unwrap();
            }

            // Refresh the company structures list
            dispatch(fetchAllCompanyStructures({ page: 1, pageSize: 10 }));

            // Close modal
            setOpenStructureModel(false);
            handleCloseStructureModel?.();

            // Reset initialization flag
            setIsInitialized(false);
        } catch (error) {
            console.error("Error saving structure:", error);
            // Specific error handling can be added here
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
    ]);

    // Handle cancel
    const handleCancel = useCallback(() => {
        resetFormData();
        setOpenStructureModel(false);
        handleCloseStructureModel?.();
    }, [setOpenStructureModel, handleCloseStructureModel, resetFormData]);

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
            heads: heads?.name || "",
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
    };
};

export default useCompanyStructureDetailsModel;

// because on the load i need default value like in this my ui need
