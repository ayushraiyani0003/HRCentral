import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchCountries,
    fetchCountryById,
    createCountry,
    updateCountry,
    deleteCountry,
    clearError,
    clearMessage,
    setSelectedCountry,
    // Use the available selectors from the slice
    selectCountries,
    selectSelectedCountry,
    selectError,
    selectMessage,
    selectLoading,
    selectIsLoading,
    selectIsFetchLoading,
} from "../../../store/countrySlice";

const useCountryTab = ({
    setOpenDeleteModel,
    setRowData = () => {},
    setOpenAddEditModel = () => {},
    setModelType = () => {},
}) => {
    const dispatch = useDispatch();

    // Redux state selectors - using available selectors from slice
    const countries = useSelector(selectCountries) || []; // Ensure it's always an array
    const selectedCountry = useSelector(selectSelectedCountry);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const message = useSelector(selectMessage);
    const isLoading = useSelector(selectIsLoading);
    const isFetchLoading = useSelector(selectIsFetchLoading);

    // Local state for client-side filtering and search
    const [localSearchValue, setLocalSearchValue] = useState("");
    const [regionFilter, setRegionFilter] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("ASC");

    // Ref to track if initial load is done
    const initialLoadDone = useRef(false);

    // Load countries on component mount - only once
    useEffect(() => {
        // Check if we need to load data
        const shouldLoadData =
            !initialLoadDone.current &&
            !isFetchLoading &&
            (!countries || countries.length === 0);

        if (shouldLoadData) {
            console.log("🚀 Loading initial countries data");
            dispatch(fetchCountries());
            initialLoadDone.current = true;
        }
    }, [dispatch, isFetchLoading, countries]);

    // Debug effect to monitor data changes
    useEffect(() => {
        console.log("Countries data updated:", {
            count: countries?.length || 0,
            countries: countries,
            loading: loading,
            isFetchLoading: isFetchLoading,
        });
    }, [countries, loading, isFetchLoading]);

    // Client-side filtering and search
    const filteredAndSortedCountries = useMemo(() => {
        // Ensure countries is an array before processing
        if (!Array.isArray(countries) || countries.length === 0) {
            console.log("No countries data available for filtering");
            return [];
        }

        let filtered = [...countries];

        // Apply search filter
        if (localSearchValue.trim()) {
            const searchTerm = localSearchValue.toLowerCase().trim();
            filtered = filtered.filter((country) => {
                return (
                    country.name?.toLowerCase().includes(searchTerm) ||
                    country.code?.toLowerCase().includes(searchTerm) ||
                    country.region?.toLowerCase().includes(searchTerm) ||
                    country.phone_code?.toLowerCase().includes(searchTerm)
                );
            });
        }

        // Apply region filter
        if (regionFilter) {
            filtered = filtered.filter(
                (country) => country.region === regionFilter
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            const aValue = a[sortBy]?.toString().toLowerCase() || "";
            const bValue = b[sortBy]?.toString().toLowerCase() || "";

            if (sortOrder === "ASC") {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });

        console.log("Filtered countries:", filtered.length);
        return filtered;
    }, [countries, localSearchValue, regionFilter, sortBy, sortOrder]);

    // Action handlers for modal operations
    const handleAddNew = useCallback(() => {
        setOpenAddEditModel(true);
        setModelType("add");
        setRowData(null);
        dispatch(setSelectedCountry(null));
    }, [setOpenAddEditModel, setModelType, setRowData, dispatch]);

    const handleView = useCallback(
        (row) => {
            setOpenAddEditModel(true);
            setModelType("view");
            setRowData(row);
            dispatch(setSelectedCountry(row));

            // Optionally fetch full country details if needed
            if (row.id) {
                dispatch(fetchCountryById(row.id));
            }
        },
        [setOpenAddEditModel, setModelType, setRowData, dispatch]
    );

    const handleEdit = useCallback(
        (row) => {
            setOpenAddEditModel(true);
            setModelType("edit");
            setRowData(row);
            dispatch(setSelectedCountry(row));

            // Optionally fetch full country details if needed
            if (row.id) {
                dispatch(fetchCountryById(row.id));
            }
        },
        [setOpenAddEditModel, setModelType, setRowData, dispatch]
    );

    const handleDelete = useCallback(
        (row) => {
            setRowData(row);
            setOpenDeleteModel(true);
            dispatch(setSelectedCountry(row));
        },
        [setRowData, setOpenDeleteModel, dispatch]
    );

    // Local search handler
    const handleSearch = useCallback((value) => {
        setLocalSearchValue(value);
    }, []);

    // CRUD operations
    const handleCreateCountry = useCallback(
        async (countryData) => {
            try {
                const result = await dispatch(createCountry(countryData));

                if (createCountry.fulfilled.match(result)) {
                    // Close the modal
                    setOpenAddEditModel(false);
                    setRowData(null);
                    setModelType("");

                    return { success: true, data: result.payload };
                } else {
                    return {
                        success: false,
                        error: result.payload || "Failed to create country",
                    };
                }
            } catch (error) {
                console.error("Create country error:", error);
                return { success: false, error: error.message };
            }
        },
        [dispatch, setOpenAddEditModel, setRowData, setModelType]
    );

    const handleUpdateCountry = useCallback(
        async (id, countryData) => {
            try {
                const result = await dispatch(
                    updateCountry({ id, data: countryData })
                );

                if (updateCountry.fulfilled.match(result)) {
                    // Close the modal
                    setOpenAddEditModel(false);
                    setRowData(null);
                    setModelType("");

                    return { success: true, data: result.payload };
                } else {
                    return {
                        success: false,
                        error: result.payload || "Failed to update country",
                    };
                }
            } catch (error) {
                console.error("Update country error:", error);
                return { success: false, error: error.message };
            }
        },
        [dispatch, setOpenAddEditModel, setRowData, setModelType]
    );

    const handleDeleteCountry = useCallback(
        async (countryId) => {
            try {
                const result = await dispatch(deleteCountry(countryId));

                if (deleteCountry.fulfilled.match(result)) {
                    // Close the delete modal
                    setOpenDeleteModel(false);
                    setRowData(null);

                    return { success: true, data: result.payload };
                } else {
                    return {
                        success: false,
                        error: result.payload || "Failed to delete country",
                    };
                }
            } catch (error) {
                console.error("Delete country error:", error);
                return { success: false, error: error.message };
            }
        },
        [dispatch, setOpenDeleteModel, setRowData]
    );

    // Local filter handlers
    const handleRegionFilter = useCallback((region) => {
        setRegionFilter(region);
    }, []);

    const handleSortChange = useCallback((newSortBy, newSortOrder = "ASC") => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
    }, []);

    // Clear filters
    const clearFilters = useCallback(() => {
        setRegionFilter("");
        setLocalSearchValue("");
        setSortBy("name");
        setSortOrder("ASC");
    }, []);

    // Utility functions
    const clearErrorMessage = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const clearSuccessMessage = useCallback(() => {
        dispatch(clearMessage());
    }, [dispatch]);

    const clearLocalSearch = useCallback(() => {
        setLocalSearchValue("");
    }, []);

    const refreshData = useCallback(() => {
        console.log("🔄 Refreshing countries data");
        initialLoadDone.current = false; // Reset the flag to allow re-fetch
        dispatch(fetchCountries());
    }, [dispatch]);

    // Get unique regions for filter dropdown
    const uniqueRegions = useMemo(() => {
        if (!Array.isArray(countries) || countries.length === 0) {
            return [];
        }

        const regions = countries
            .map((country) => country.region)
            .filter(Boolean);
        return [...new Set(regions)].sort();
    }, [countries]);

    // Statistics
    const stats = useMemo(
        () => ({
            total: Array.isArray(countries) ? countries.length : 0,
            filtered: Array.isArray(filteredAndSortedCountries)
                ? filteredAndSortedCountries.length
                : 0,
            displayed: Array.isArray(filteredAndSortedCountries)
                ? filteredAndSortedCountries.length
                : 0,
            regions: Array.isArray(uniqueRegions) ? uniqueRegions.length : 0,
        }),
        [countries, filteredAndSortedCountries, uniqueRegions]
    );

    // Create filters object for backward compatibility
    const filters = useMemo(
        () => ({
            region: regionFilter,
            search: localSearchValue,
            sortBy,
            sortOrder,
        }),
        [regionFilter, localSearchValue, sortBy, sortOrder]
    );

    // Debug log for final return values
    useEffect(() => {
        console.log("Hook return values:", {
            countriesCount: countries?.length || 0,
            displayDataCount: filteredAndSortedCountries?.length || 0,
            stats: stats,
            loading: loading,
            isFetchLoading: isFetchLoading,
        });
    }, [countries, filteredAndSortedCountries, stats, loading, isFetchLoading]);

    return {
        // Data
        countries: countries || [],
        filteredCountries: filteredAndSortedCountries || [],
        displayData: filteredAndSortedCountries || [],
        selectedCountry,
        uniqueRegions: uniqueRegions || [],
        stats,

        // State
        loading,
        error,
        message,
        filters,
        isLoading,
        isFetchLoading,
        localSearchValue,

        // Modal handlers
        handleAddNew,
        handleView,
        handleEdit,
        handleDelete,

        // Search handlers
        handleSearch,

        // CRUD operations
        handleCreateCountry,
        handleUpdateCountry,
        handleDeleteCountry,

        // Filtering & Sorting
        handleRegionFilter,
        handleSortChange,
        clearFilters,

        // Utility
        clearErrorMessage,
        clearSuccessMessage,
        clearLocalSearch,
        refreshData,
    };
};

export default useCountryTab;
