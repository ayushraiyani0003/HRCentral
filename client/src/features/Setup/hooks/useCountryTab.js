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
    updateFilters,
    // Use the optimized selectors
    selectCountries,
    selectSelectedCountry,
    selectError,
    selectMessage,
    selectFilters,
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

    // Redux state selectors - using optimized memoized selectors
    const countries = useSelector(selectCountries);
    // DEBUG: Add direct state access to compare
    const directCountries = useSelector(
        (state) => state.country?.countries || []
    );
    // const wholeCountryState = useSelector((state) => state.country);

    const selectedCountry = useSelector(selectSelectedCountry);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const message = useSelector(selectMessage);
    const filters = useSelector(selectFilters);
    const isLoading = useSelector(selectIsLoading);
    const isFetchLoading = useSelector(selectIsFetchLoading);

    // Local state for client-side search
    const [searchValue, setSearchValue] = useState("");

    // Ref to track if initial load is done
    const initialLoadDone = useRef(false);

    // Ref to prevent duplicate API calls
    const lastFetchParams = useRef(null);

    // DEBUG: Add console logs to debug the data flow
    // useEffect(() => {
    //     console.log("🔍 DEBUG - Redux State Comparison:", {
    //         // From selector
    //         countries,
    //         countriesType: typeof countries,
    //         countriesLength: Array.isArray(countries)
    //             ? countries.length
    //             : "Not an array",

    //         // Direct access
    //         directCountries,
    //         directCountriesType: typeof directCountries,
    //         directCountriesLength: Array.isArray(directCountries)
    //             ? directCountries.length
    //             : "Not an array",

    //         // Whole state
    //         wholeCountryState,

    //         // Other state
    //         loading,
    //         error,
    //         filters,
    //     });
    // }, [
    //     countries,
    //     directCountries,
    //     wholeCountryState,
    //     loading,
    //     error,
    //     filters,
    // ]);

    // Memoize fetch parameters to prevent unnecessary effect triggers
    const fetchParams = useMemo(
        () => ({
            region: filters.region,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
        }),
        [filters.region, filters.sortBy, filters.sortOrder]
    );

    // Load countries on component mount and when relevant parameters change
    useEffect(() => {
        // Convert to string for comparison to prevent duplicate calls
        const paramsString = JSON.stringify(fetchParams);

        // console.log("🚀 DEBUG - useEffect triggered:", {
        //     fetchParams,
        //     paramsString,
        //     lastFetchParams: lastFetchParams.current,
        //     shouldSkip: lastFetchParams.current === paramsString,
        // });

        // Skip if this exact request was already made
        if (lastFetchParams.current === paramsString) {
            // console.log("⏭️ Skipping duplicate API call");
            return;
        }

        // Update the ref with current params
        lastFetchParams.current = paramsString;

        // console.log("📡 Making API call with params:", fetchParams);

        // Make the API call (fetch all data without pagination)
        const fetchPromise = dispatch(fetchCountries(fetchParams));

        // DEBUG: Log the promise result
        fetchPromise
            .then((result) => {
                // console.log("✅ API call completed:", result);
            })
            .catch((err) => {
                console.error("❌ API call failed:", err);
            });

        // Mark initial load as done
        if (!initialLoadDone.current) {
            initialLoadDone.current = true;
            // console.log("✨ Initial load marked as done");
        }
    }, [dispatch, fetchParams]);

    // Client-side filtering based on search value - properly memoized
    // Use directCountries for now to test if selector is the issue
    const filteredData = useMemo(() => {
        // Use the data that actually has content
        const dataToFilter =
            directCountries.length > 0 ? directCountries : countries;

        // console.log("🔎 DEBUG - Filtering data:", {
        //     countries,
        //     countriesIsArray: Array.isArray(countries),
        //     countriesLength: Array.isArray(countries)
        //         ? countries.length
        //         : "Not an array",
        //     directCountries,
        //     directCountriesIsArray: Array.isArray(directCountries),
        //     directCountriesLength: Array.isArray(directCountries)
        //         ? directCountries.length
        //         : "Not an array",
        //     dataToFilter,
        //     dataToFilterLength: Array.isArray(dataToFilter)
        //         ? dataToFilter.length
        //         : "Not an array",
        //     searchValue: searchValue.trim(),
        // });

        if (!Array.isArray(dataToFilter)) {
            console.warn("⚠️ DataToFilter is not an array:", dataToFilter);
            return [];
        }

        if (!searchValue.trim()) {
            // console.log(
            //     "📋 Returning all countries (no search):",
            //     dataToFilter.length
            // );
            return dataToFilter;
        }

        const searchTerm = searchValue.toLowerCase().trim();
        const filtered = dataToFilter.filter((country) => {
            const matches =
                country.name?.toLowerCase().includes(searchTerm) ||
                country.code?.toLowerCase().includes(searchTerm) ||
                country.region?.toLowerCase().includes(searchTerm);
            return matches;
        });

        // console.log("🔍 Filtered results:", {
        //     searchTerm,
        //     originalCount: dataToFilter.length,
        //     filteredCount: filtered.length,
        // });

        return filtered;
    }, [searchValue, countries, directCountries]);

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

            // Optionally fetch full country details
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

            // Optionally fetch full country details
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

    // Simple client-side search handler (no debouncing needed for client-side)
    const handleSearch = useCallback((value) => {
        // console.log("🔍 Search value changed:", value);
        setSearchValue(value);
    }, []);

    // CRUD operations - These will be called from the modal
    const handleCreateCountry = useCallback(
        async (countryData) => {
            try {
                const result = await dispatch(createCountry(countryData));
                if (createCountry.fulfilled.match(result)) {
                    // Refresh data after successful creation
                    lastFetchParams.current = null; // Reset to allow refresh

                    // Close the modal
                    setOpenAddEditModel(false);
                    setRowData(null);
                    setModelType("");

                    return { success: true, data: result.payload };
                } else {
                    return { success: false, error: result.payload };
                }
            } catch (error) {
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
                    // Refresh data after successful update
                    lastFetchParams.current = null; // Reset to allow refresh

                    // Close the modal
                    setOpenAddEditModel(false);
                    setRowData(null);
                    setModelType("");

                    return { success: true, data: result.payload };
                } else {
                    return { success: false, error: result.payload };
                }
            } catch (error) {
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
                    // Refresh data after successful deletion
                    lastFetchParams.current = null; // Reset to allow refresh

                    // Close the delete modal
                    setOpenDeleteModel(false);
                    setRowData(null);

                    return { success: true, data: result.payload };
                } else {
                    return { success: false, error: result.payload };
                }
            } catch (error) {
                return { success: false, error: error.message };
            }
        },
        [dispatch, setOpenDeleteModel, setRowData]
    );

    // Filter handlers
    const handleRegionFilter = useCallback(
        (region) => {
            dispatch(updateFilters({ region }));
        },
        [dispatch]
    );

    const handleSortChange = useCallback(
        (sortBy, sortOrder) => {
            dispatch(updateFilters({ sortBy, sortOrder }));
        },
        [dispatch]
    );

    // Utility functions
    const clearErrorMessage = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const clearSuccessMessage = useCallback(() => {
        dispatch(clearMessage());
    }, [dispatch]);

    const clearSearchValue = useCallback(() => {
        setSearchValue("");
    }, []);

    const refreshData = useCallback(() => {
        // console.log("🔄 Refreshing data manually");
        // Reset the ref to allow fresh API call
        lastFetchParams.current = null;

        // Refresh data (fetch all data)
        dispatch(fetchCountries(fetchParams));
    }, [dispatch, fetchParams]);

    // DEBUG: Final return values
    // console.log("📤 DEBUG - Hook return values:", {
    //     countries: countries?.length || 0,
    //     directCountries: directCountries?.length || 0,
    //     filteredData: filteredData?.length || 0,
    //     displayData: filteredData?.length || 0,
    //     loading,
    //     error,
    // });

    return {
        // Data
        countries: directCountries.length > 0 ? directCountries : countries, // Use working data
        filteredData,
        selectedCountry,
        displayData: filteredData, // Always use filteredData for display

        // State
        loading,
        error,
        message,
        filters,
        isLoading,
        isFetchLoading,
        searchValue,

        // Modal handlers (for opening modals)
        handleAddNew,
        handleView,
        handleEdit,
        handleDelete,
        handleSearch,

        // CRUD operations (for modal to call)
        handleCreateCountry,
        handleUpdateCountry,
        handleDeleteCountry,

        // Filtering & Sorting
        handleRegionFilter,
        handleSortChange,

        // Utility
        clearErrorMessage,
        clearSuccessMessage,
        clearSearchValue,
        refreshData,
    };
};

export default useCountryTab;
