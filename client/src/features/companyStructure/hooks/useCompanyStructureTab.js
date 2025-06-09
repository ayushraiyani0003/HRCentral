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
    console.log(setOpenDeleteModel);

    const dispatch = useDispatch();

    // Redux state selectors
    const companyStructureData = useSelector(selectCompanyStructures);
    const loading = useSelector(selectLoading);
    const errors = useSelector(selectErrors);
    const pagination = useSelector(selectPagination);
    const filters = useSelector(selectFilters);

    // ✅ Use regular selectors with proper memoization using useMemo
    const countries = useSelector(selectCountries);
    const countriesLoading = useSelector(selectCountriesLoading);

    // ✅ Process countries data with useMemo to prevent unnecessary recalculations
    const processedCountries = useMemo(() => {
        try {
            // Handle the nested data structure from API response
            if (countries?.data && Array.isArray(countries.data)) {
                return countries.data;
            }
            // Fallback for direct array
            if (Array.isArray(countries)) {
                return countries;
            }
            return [];
        } catch (error) {
            console.warn("Error accessing countries:", error);
            return [];
        }
    }, [countries]);

    // ✅ Process countries loading state with useMemo
    const processedCountriesLoading = useMemo(() => {
        try {
            return countriesLoading || { fetch: false };
        } catch (error) {
            console.warn("Error accessing countries loading:", error);
            return { fetch: false };
        }
    }, [countriesLoading]);
    // console.log("companyStructureData", companyStructureData);

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
        processedCountries.forEach((country) => {
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
    }, [processedCountries]);

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
            processedCountries.length === 0 &&
            !processedCountriesLoading.fetch
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
        processedCountries.length,
        processedCountriesLoading.fetch,
    ]);

    // Create a map of all company structures by ID for quick lookup
    const structureMap = useMemo(() => {
        const map = {};
        companyStructureData.forEach((item) => {
            const id = item.id || item.uuid || item.structureId; // adjust ID keys as needed
            if (id) {
                map[id] = item;
            }
        });
        return map;
    }, [companyStructureData]);

    // Enhanced filtered data that includes country and parent structure info
    const filteredData = useMemo(() => {
        let dataWithEnhancements = companyStructureData.map((item) => {
            const countryId =
                item.countryId || item.country_id || item.countryID;
            const parentId = item.parentId || item.parent_id || item.parentID;
            const countryInfo = countryMap[countryId];
            const parentStructure = structureMap[parentId] || null;

            return {
                ...item,
                countryName:
                    countryInfo?.name || item.country || "Unknown Country",
                countryCode: countryInfo?.code || item.countryCode || "",
                countryRegion: countryInfo?.region || "",
                countryPhoneCode: countryInfo?.phoneCode || "",
                country: countryInfo?.name || item.country || "Unknown Country",
                parentStructure: parentStructure?.name || "-", // ✅ Add parent structure reference here
            };
        });

        if (!searchValue.trim()) {
            return dataWithEnhancements;
        }

        const searchTerm = searchValue.toLowerCase().trim();

        return dataWithEnhancements.filter((item) => {
            return (
                item.name?.toLowerCase().includes(searchTerm) ||
                item.address?.toLowerCase().includes(searchTerm) ||
                item.type?.toLowerCase().includes(searchTerm) ||
                item.country?.toLowerCase().includes(searchTerm) ||
                item.countryName?.toLowerCase().includes(searchTerm) ||
                item.countryCode?.toLowerCase().includes(searchTerm) ||
                item.countryRegion?.toLowerCase().includes(searchTerm) ||
                item.originalCountry?.toLowerCase().includes(searchTerm) ||
                item.parent_id?.toLowerCase?.().includes(searchTerm) ||
                item.Head?.toLowerCase?.().includes(searchTerm) ||
                item.head?.toLowerCase?.().includes(searchTerm) ||
                item.parentStructure?.name?.toLowerCase?.().includes(searchTerm) // ✅ Optional: search by parent name
            );
        });
    }, [searchValue, companyStructureData, countryMap, structureMap]);

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
        if (processedCountries.length === 0) {
            dispatch(fetchCountries({ limit: 1000, page: 1 }));
        }
    }, [
        dispatch,
        pagination.currentPage,
        pagination.pageSize,
        filters,
        processedCountries.length,
    ]);

    // Clear specific errors
    const handleClearError = useCallback(
        (errorType) => {
            dispatch(clearError(errorType));
        },
        [dispatch]
    );

    return {
        // Data
        searchValue,
        companyStructureData,
        filteredData,
        countries: processedCountries,
        countryMap,
        countryIds,

        // Loading states
        loading,
        isLoading: loading?.entities || false,
        isDeleting: loading?.delete || false,
        countriesLoading: processedCountriesLoading?.fetch || false,

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
    };
};

export default useCompanyStructureTab;
