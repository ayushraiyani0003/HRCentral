// useCompanyStructureTab.js

import { useState, useCallback, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllCompanyStructures,
    deleteCompanyStructure,
    selectCompanyStructures,
    selectLoading,
    selectErrors,
    selectPagination,
    selectFilters,
    setPagination,
    setFilters,
    clearError,
} from "../../../store/CompanyStructureSlice";

import {
    fetchCountries,
    selectCountries,
    selectLoading as selectCountriesLoading,
} from "../../../store/countrySlice";

const useCompanyStructureTab = ({
    setOpenDeleteModel,
    setCompanyStructure = () => {},
    setOpenStructureModel = () => {},
    setModelType = () => {},
}) => {
    const dispatch = useDispatch();

    // Redux state selectors
    const companyStructureData = useSelector(selectCompanyStructures);
    const loading = useSelector(selectLoading);
    const errors = useSelector(selectErrors);
    const pagination = useSelector(selectPagination);
    const filters = useSelector(selectFilters);

    // Country data selectors - with error handling and proper data extraction
    const countries = useSelector((state) => {
        try {
            const countryState = selectCountries(state);
            // Handle the nested data structure from API response
            if (countryState?.data && Array.isArray(countryState.data)) {
                return countryState.data;
            }
            // Fallback for direct array
            if (Array.isArray(countryState)) {
                return countryState;
            }
            return [];
        } catch (error) {
            console.warn("Error accessing countries:", error);
            return [];
        }
    });

    // console.log("Countries data:", countries); // Debug only

    const countriesLoading = useSelector((state) => {
        try {
            return selectCountriesLoading(state) || { fetch: false };
        } catch (error) {
            console.warn("Error accessing countries loading:", error);
            return { fetch: false };
        }
    });

    // Local state for search
    const [searchValue, setSearchValue] = useState("");

    // Extract unique country IDs from company structure data
    const countryIds = useMemo(() => {
        const ids = new Set();
        companyStructureData.forEach((item) => {
            const countryId =
                item.countryId || item.country_id || item.countryID;
            if (countryId) {
                ids.add(countryId);
            }
        });
        return Array.from(ids);
    }, [companyStructureData]);

    // Create a map of country ID to country data for quick lookup
    const countryMap = useMemo(() => {
        const map = {};
        countries.forEach((country) => {
            // Handle different possible ID field names
            const id = country.id || country.uuid || country.countryId;
            if (id) {
                map[id] = {
                    name: country.name,
                    code: country.code || country.countryCode,
                    phoneCode: country.phone_code,
                    region: country.region,
                    ...country,
                };
            }
        });
        return map;
    }, [countries]);

    // Fetch company structures on component mount
    useEffect(() => {
        if (companyStructureData.length === 0 && !loading.entities) {
            dispatch(
                fetchAllCompanyStructures({
                    page: pagination.currentPage,
                    pageSize: pagination.pageSize,
                    ...filters,
                })
            );
        }
    }, [
        dispatch,
        companyStructureData.length,
        loading.entities,
        pagination.currentPage,
        pagination.pageSize,
        filters,
    ]);

    // Fetch countries when we have company structure data
    useEffect(() => {
        // Always fetch countries if we don't have them and we have company structure data
        if (
            companyStructureData.length > 0 &&
            countries.length === 0 &&
            !countriesLoading.fetch
        ) {
            // Fetch all countries - you might want to modify this based on your API
            dispatch(
                fetchCountries({
                    limit: 1000, // Fetch a large number to get all countries
                    page: 1,
                })
            );
        }
    }, [
        dispatch,
        companyStructureData.length,
        countries.length,
        countriesLoading.fetch,
    ]);

    // Enhanced filtered data that includes country information
    const filteredData = useMemo(() => {
        let dataWithCountryInfo = companyStructureData.map((item) => {
            const countryId =
                item.countryId || item.country_id || item.countryID;
            const countryInfo = countryMap[countryId];

            return {
                ...item,
                countryName:
                    countryInfo?.name || item.country || "Unknown Country",
                countryCode: countryInfo?.code || item.countryCode || "",
                countryRegion: countryInfo?.region || "",
                countryPhoneCode: countryInfo?.phoneCode || "",
                originalCountry: item.country,

                // ✅ This will ensure `country` is filled with the actual name (e.g., "India")
                country: countryInfo?.name || item.country || "Unknown Country",
            };
        });

        // Apply search filter
        if (!searchValue.trim()) {
            return dataWithCountryInfo;
        }

        const searchTerm = searchValue.toLowerCase().trim();

        return dataWithCountryInfo.filter((item) => {
            return (
                item.name?.toLowerCase().includes(searchTerm) ||
                item.address?.toLowerCase().includes(searchTerm) ||
                item.type?.toLowerCase().includes(searchTerm) ||
                item.country?.toLowerCase().includes(searchTerm) || // include the computed "country"
                item.countryName?.toLowerCase().includes(searchTerm) ||
                item.countryCode?.toLowerCase().includes(searchTerm) ||
                item.countryRegion?.toLowerCase().includes(searchTerm) ||
                item.originalCountry?.toLowerCase().includes(searchTerm) ||
                item.parentStructure?.toLowerCase().includes(searchTerm) ||
                item.Head?.toLowerCase().includes(searchTerm) ||
                item.head?.toLowerCase().includes(searchTerm)
            );
        });
    }, [searchValue, companyStructureData, countryMap]);

    // Debug function to check data mapping
    // const debugCountryMapping = useCallback(() => {
    //     console.log("Company Structure Data:", companyStructureData);
    //     console.log("Country IDs found:", countryIds);
    //     console.log("Countries available:", countries);
    //     console.log("Country Map:", countryMap);
    //     console.log("Filtered Data with Countries:", filteredData);
    // }, [companyStructureData, countryIds, countries, countryMap, filteredData]);

    // Action handlers
    const handleAddNew = useCallback(() => {
        setOpenStructureModel(true);
        setModelType("add");
        setCompanyStructure(null);
    }, [setOpenStructureModel, setModelType, setCompanyStructure]);

    const handleView = useCallback(
        (row) => {
            setOpenStructureModel(true);
            setModelType("view");
            setCompanyStructure(row);
        },
        [setOpenStructureModel, setModelType, setCompanyStructure]
    );

    const handleEdit = useCallback(
        (row) => {
            setOpenStructureModel(true);
            setModelType("edit");
            setCompanyStructure(row);
        },
        [setOpenStructureModel, setModelType, setCompanyStructure]
    );

    const handleDelete = useCallback(
        async (row) => {
            setCompanyStructure(row);
            setOpenDeleteModel(true);
        },
        [setCompanyStructure, setOpenDeleteModel]
    );

    const handleConfirmDelete = useCallback(
        async (id) => {
            try {
                await dispatch(deleteCompanyStructure(id)).unwrap();
                setOpenDeleteModel(false);
                setCompanyStructure(null);
                // Refresh the data after successful deletion
                dispatch(
                    fetchAllCompanyStructures({
                        page: pagination.currentPage,
                        pageSize: pagination.pageSize,
                        ...filters,
                    })
                );
            } catch (error) {
                console.error("Delete failed:", error);
            }
        },
        [dispatch, setOpenDeleteModel, setCompanyStructure, pagination, filters]
    );

    const handleSearch = useCallback((value) => {
        setSearchValue(value);
    }, []);

    const handleMoreInfo = useCallback(() => {
        // TODO: put external site link here for documentation
        console.log("More info clicked");
    }, []);

    // Pagination handlers
    const handlePageChange = useCallback(
        (page) => {
            dispatch(setPagination({ currentPage: page }));
            dispatch(
                fetchAllCompanyStructures({
                    page,
                    pageSize: pagination.pageSize,
                    ...filters,
                })
            );
        },
        [dispatch, pagination.pageSize, filters]
    );

    const handlePageSizeChange = useCallback(
        (pageSize) => {
            dispatch(
                setPagination({
                    pageSize,
                    currentPage: 1,
                })
            );
            dispatch(
                fetchAllCompanyStructures({
                    page: 1,
                    pageSize,
                    ...filters,
                })
            );
        },
        [dispatch, filters]
    );

    // Filter handlers
    const handleFilterChange = useCallback(
        (newFilters) => {
            dispatch(setFilters(newFilters));
            dispatch(setPagination({ currentPage: 1 }));
            dispatch(
                fetchAllCompanyStructures({
                    page: 1,
                    pageSize: pagination.pageSize,
                    ...newFilters,
                })
            );
        },
        [dispatch, pagination.pageSize]
    );

    // Refresh data
    const handleRefresh = useCallback(() => {
        dispatch(
            fetchAllCompanyStructures({
                page: pagination.currentPage,
                pageSize: pagination.pageSize,
                ...filters,
            })
        );
        // Also refresh countries if needed
        if (countries.length === 0) {
            dispatch(fetchCountries({ limit: 1000, page: 1 }));
        }
    }, [
        dispatch,
        pagination.currentPage,
        pagination.pageSize,
        filters,
        countries.length,
    ]);

    // Clear specific errors
    const handleClearError = useCallback(
        (errorType) => {
            dispatch(clearError(errorType));
        },
        [dispatch]
    );
    // DEBUG: only for debugging purposes for get is structure data correct
    // console.log(companyStructureData);

    return {
        // Data
        searchValue,
        companyStructureData,
        filteredData,
        countries,
        countryMap,
        countryIds, // Expose this for debugging

        // Loading states
        loading,
        isLoading: loading?.entities || false,
        isDeleting: loading?.delete || false,
        countriesLoading: countriesLoading?.fetch || false,

        // Error states
        errors,

        // Pagination
        pagination,

        // Filters
        filters,

        // Action handlers
        handleAddNew,
        handleView,
        handleEdit,
        handleDelete,
        handleConfirmDelete,
        handleSearch,
        handleMoreInfo,
        handlePageChange,
        handlePageSizeChange,
        handleFilterChange,
        handleRefresh,
        handleClearError,

        // Debug helper
        // debugCountryMapping, // Uncomment for debugging
    };
};

export default useCompanyStructureTab;
