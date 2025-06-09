import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
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

// TODO: Import your city slice when it's available
// import {
//     fetchCities,
//     selectCities,
//     selectLoading as selectCitiesLoading,
// } from "../../../store/citySlice";

// TODO: Import your employee slice when it's available
// import {
//     fetchEmployees,
//     selectEmployees,
//     selectLoading as selectEmployeesLoading,
// } from "../../../store/employeeSlice";

const useCompanyStructureDetailsModel = ({
    setOpenStructureModel,
    modelType,
    companyStructure,
    handleCloseStructureModel,
}) => {
    const dispatch = useDispatch();

    // Redux state selectors
    const existingCompanyStructures = useSelector(selectCompanyStructures);
    const loading = useSelector(selectLoading);
    const errors = useSelector(selectErrors);

    // Country data selectors - with error handling and proper data extraction
    const countries = useSelector((state) => {
        try {
            const countryState = selectCountries(state);
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
    });

    const countriesLoading = useSelector((state) => {
        try {
            return selectCountriesLoading(state) || { fetch: false };
        } catch (error) {
            console.warn("Error accessing countries loading:", error);
            return { fetch: false };
        }
    });

    // TODO: Uncomment when city slice is available
    // const cities = useSelector((state) => {
    //     try {
    //         const cityState = selectCities(state);
    //         if (cityState?.data && Array.isArray(cityState.data)) {
    //             return cityState.data;
    //         }
    //         if (Array.isArray(cityState)) {
    //             return cityState;
    //         }
    //         return [];
    //     } catch (error) {
    //         console.warn("Error accessing cities:", error);
    //         return [];
    //     }
    // });

    // TODO: Uncomment when employee slice is available
    // const employees = useSelector((state) => {
    //     try {
    //         const employeeState = selectEmployees(state);
    //         if (employeeState?.data && Array.isArray(employeeState.data)) {
    //             return employeeState.data;
    //         }
    //         if (Array.isArray(employeeState)) {
    //             return employeeState;
    //         }
    //         return [];
    //     } catch (error) {
    //         console.warn("Error accessing employees:", error);
    //         return [];
    //     }
    // });

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        details: "",
        address: "",
        type: "",
        country: "",
        countryId: "",
        city: "",
        cityId: "",
        parentStructure: "",
        parentStructureId: "",
        heads: "",
        headsId: "",
    });

    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch countries on component mount
    useEffect(() => {
        if (countries.length === 0 && !countriesLoading.fetch) {
            dispatch(
                fetchCountries({
                    limit: 1000,
                    page: 1,
                })
            );
        }
    }, [dispatch, countries.length, countriesLoading.fetch]);

    // Fetch existing company structures for parent dropdown
    useEffect(() => {
        if (existingCompanyStructures.length === 0 && !loading.entities) {
            dispatch(
                fetchAllCompanyStructures({
                    page: 1,
                    pageSize: 1000, // Get all structures for dropdown
                })
            );
        }
    }, [dispatch, existingCompanyStructures.length, loading.entities]);

    // TODO: Fetch cities when country is selected
    // useEffect(() => {
    //     if (formData.countryId && !citiesLoading.fetch) {
    //         dispatch(fetchCities({
    //             countryId: formData.countryId,
    //             limit: 1000,
    //             page: 1,
    //         }));
    //     }
    // }, [dispatch, formData.countryId, citiesLoading.fetch]);

    // TODO: Fetch employees for heads dropdown
    // useEffect(() => {
    //     if (employees.length === 0 && !employeesLoading.fetch) {
    //         dispatch(fetchEmployees({
    //             limit: 1000,
    //             page: 1,
    //             // You might want to filter by role or department
    //             role: 'manager', // or whatever role should be eligible as heads
    //         }));
    //     }
    // }, [dispatch, employees.length, employeesLoading.fetch]);

    // Structure type options
    const structureTypes = [
        { label: "Company", value: "company" },
        { label: "Head Office", value: "head_office" },
        { label: "Regional Office", value: "regional_office" },
        { label: "Department", value: "department" },
        { label: "Unit", value: "unit" },
        { label: "Sub Unit", value: "sub_unit" },
        { label: "Other", value: "other" },
    ];

    // Dynamic country options from Redux store
    const countryOptions = useMemo(() => {
        return countries.map((country) => ({
            label: country.name || country.label,
            value: country.name || country.label,
            id: country.id || country.uuid,
            code: country.code || country.countryCode,
            phoneCode: country.phone_code,
        }));
    }, [countries]);

    // TODO: Dynamic city options (uncomment when city slice is available)
    // const cityOptions = useMemo(() => {
    //     return cities
    //         .filter(city => city.countryId === formData.countryId)
    //         .map((city) => ({
    //             label: city.name,
    //             value: city.name,
    //             id: city.id || city.uuid,
    //             countryId: city.countryId,
    //         }));
    // }, [cities, formData.countryId]);

    // Dynamic parent structure options from existing structures
    const parentStructureOptions = useMemo(() => {
        return existingCompanyStructures
            .filter((structure) => structure.id !== companyStructure?.id) // Exclude current structure when editing
            .map((structure) => ({
                label: structure.name,
                value: structure.name,
                id: structure.id || structure.uuid,
                type: structure.type,
            }));
    }, [existingCompanyStructures, companyStructure?.id]);

    // TODO: Dynamic heads options from employees (uncomment when employee slice is available)
    // const headsOptions = useMemo(() => {
    //     return employees.map((employee) => ({
    //         label: `${employee.firstName} ${employee.lastName}`,
    //         value: `${employee.firstName} ${employee.lastName}`,
    //         id: employee.id || employee.uuid,
    //         email: employee.email,
    //         department: employee.department,
    //     }));
    // }, [employees]);

    // Temporary static heads options (remove when employee slice is available)
    const headsOptions = [
        { label: "John Doe", value: "John Doe", id: "1" },
        { label: "Jane Smith", value: "Jane Smith", id: "2" },
        { label: "Mike Johnson", value: "Mike Johnson", id: "3" },
        { label: "Sarah Wilson", value: "Sarah Wilson", id: "4" },
    ];

    // Initialize form data when editing or viewing
    useEffect(() => {
        if (
            (modelType === "edit" || modelType === "view") &&
            companyStructure
        ) {
            // Find country ID from country name/label
            const selectedCountry = countries.find(
                (country) =>
                    (country.name || country.label) === companyStructure.country
            );

            // Find parent structure ID from parent structure name
            const selectedParent = existingCompanyStructures.find(
                (structure) =>
                    structure.name === companyStructure.parentStructure
            );

            setFormData({
                name: companyStructure.name || "",
                details: companyStructure.details || "",
                address: companyStructure.address || "",
                type: companyStructure.type || "",
                country: companyStructure.country || "",
                countryId: selectedCountry?.id || selectedCountry?.uuid || "",
                city: companyStructure.city || "",
                cityId: companyStructure.cityId || "",
                parentStructure: companyStructure.parentStructure || "",
                parentStructureId:
                    selectedParent?.id || selectedParent?.uuid || "",
                heads: companyStructure.heads || companyStructure.Head || "",
                headsId: companyStructure.headsId || "",
            });
        } else if (modelType === "add") {
            setFormData({
                name: "",
                details: "",
                address: "",
                type: "",
                country: "",
                countryId: "",
                city: "",
                cityId: "",
                parentStructure: "",
                parentStructureId: "",
                heads: "",
                headsId: "",
            });
        }
    }, [modelType, companyStructure, countries, existingCompanyStructures]);

    // Handle input changes
    const handleInputChange = useCallback(
        (field, value, additionalData = {}) => {
            setFormData((prev) => {
                const newData = { ...prev, [field]: value };

                // Handle special cases for dropdowns with IDs
                if (field === "country") {
                    const selectedCountry = countryOptions.find(
                        (country) => country.value === value
                    );
                    newData.countryId = selectedCountry?.id || "";
                    // Reset city when country changes
                    newData.city = "";
                    newData.cityId = "";
                } else if (field === "parentStructure") {
                    const selectedParent = parentStructureOptions.find(
                        (parent) => parent.value === value
                    );
                    newData.parentStructureId = selectedParent?.id || "";
                } else if (field === "heads") {
                    const selectedHead = headsOptions.find(
                        (head) => head.value === value
                    );
                    newData.headsId = selectedHead?.id || "";
                }

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
        [countryOptions, parentStructureOptions, headsOptions, formErrors]
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

        if (!formData.country) {
            newErrors.country = "Country is required";
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
                name: formData.name,
                details: formData.details,
                address: formData.address,
                type: formData.type,
                country: formData.country,
                countryId: formData.countryId,
                city: formData.city,
                cityId: formData.cityId,
                parentStructure: formData.parentStructure,
                parentStructureId: formData.parentStructureId,
                heads: formData.heads,
                headsId: formData.headsId,
            };

            if (modelType === "edit") {
                await dispatch(
                    updateCompanyStructure({
                        id: companyStructure.id,
                        ...submitData,
                    })
                ).unwrap();
            } else {
                await dispatch(createCompanyStructure(submitData)).unwrap();
            }

            // Refresh the company structures list
            dispatch(
                fetchAllCompanyStructures({
                    page: 1,
                    pageSize: 10, // Use your default page size
                })
            );

            setOpenStructureModel(false);
            handleCloseStructureModel?.();
        } catch (error) {
            console.error("Error saving structure:", error);
            // Handle specific error cases if needed
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
        setFormData({
            name: "",
            details: "",
            address: "",
            type: "",
            country: "",
            countryId: "",
            city: "",
            cityId: "",
            parentStructure: "",
            parentStructureId: "",
            heads: "",
            headsId: "",
        });
        setFormErrors({});
        setOpenStructureModel(false);
        handleCloseStructureModel?.();
    }, [setOpenStructureModel, handleCloseStructureModel]);

    return {
        // Form data and state
        formData,
        errors: formErrors,
        isLoading: isSubmitting,
        isSubmitting,

        // Loading states from Redux
        countriesLoading: countriesLoading?.fetch || false,
        structuresLoading: loading?.entities || false,
        // citiesLoading: citiesLoading?.fetch || false, // TODO: Uncomment when available
        // employeesLoading: employeesLoading?.fetch || false, // TODO: Uncomment when available

        // Redux errors
        reduxErrors: errors,

        // Form handlers
        handleInputChange,
        handleCancel,
        handleSubmit,

        // Options for dropdowns
        structureTypes,
        countryOptions,
        // cityOptions, // TODO: Uncomment when available
        parentStructureOptions,
        headsOptions,

        // Raw data (for debugging or additional processing)
        countries,
        existingCompanyStructures,
        // cities, // TODO: Uncomment when available
        // employees, // TODO: Uncomment when available

        // Utility functions
        setErrors: setFormErrors,
        validateForm,
    };
};

export default useCompanyStructureDetailsModel;
