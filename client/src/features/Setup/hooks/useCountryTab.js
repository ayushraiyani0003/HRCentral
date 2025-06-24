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
    updatePagination,
    // Selectors
    selectCountries,
    selectSelectedCountry,
    selectLoading,
    selectError,
    selectMessage,
    selectPagination,
    selectFilters,
    selectIsLoading,
} from "../../../store/countrySlice";

const useCountryTab = ({
    setOpenDeleteModel,
    setRowData = () => {},
    setOpenAddEditModel = () => {},
    setModelType = () => {},
}) => {
    console.log(setRowData);

    const dispatch = useDispatch();

    // Redux state selectors
    const countries = useSelector(selectCountries);
    const selectedCountry = useSelector(selectSelectedCountry);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const message = useSelector(selectMessage);
    const pagination = useSelector(selectPagination);
    const filters = useSelector(selectFilters);
    const isLoading = useSelector(selectIsLoading);

    // Local state for search
    const [searchValue, setSearchValue] = useState(filters.search || "");

    // Ref to track if initial load is done
    const initialLoadDone = useRef(false);

    // Ref to prevent duplicate API calls
    const lastFetchParams = useRef(null);

    // Load countries on component mount and when relevant parameters change
    useEffect(() => {
        const fetchParams = {
            page: pagination.page,
            limit: pagination.limit,
            search: filters.search,
            region: filters.region,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
        };

        // Convert to string for comparison to prevent duplicate calls
        const paramsString = JSON.stringify(fetchParams);

        // Skip if this exact request was already made
        if (lastFetchParams.current === paramsString) {
            return;
        }

        // Update the ref with current params
        lastFetchParams.current = paramsString;

        // Make the API call
        dispatch(fetchCountries(fetchParams));

        // Mark initial load as done
        if (!initialLoadDone.current) {
            initialLoadDone.current = true;
        }
    }, [
        dispatch,
        pagination.page,
        pagination.limit,
        filters.search,
        filters.region,
        filters.sortBy,
        filters.sortOrder,
    ]);

    // Filter data based on search value (local filtering for immediate feedback)
    const filteredData = useMemo(() => {
        if (!searchValue.trim()) {
            return countries;
        }
        const searchTerm = searchValue.toLowerCase().trim();
        return countries.filter((country) => {
            return (
                country.name?.toLowerCase().includes(searchTerm) ||
                country.code?.toLowerCase().includes(searchTerm) ||
                country.region?.toLowerCase().includes(searchTerm)
            );
        });
    }, [searchValue, countries]);

    // Action handlers for modal operations
    const handleAddNew = useCallback(() => {
        console.log("handleAddNew called");
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

    // Debounced search to prevent too many API calls
    const searchTimeoutRef = useRef(null);

    const handleSearch = useCallback(
        (value) => {
            setSearchValue(value);

            // Clear existing timeout
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }

            // Debounce the search API call
            searchTimeoutRef.current = setTimeout(() => {
                // Update Redux filters for server-side search
                dispatch(updateFilters({ search: value }));

                // Reset pagination when searching
                dispatch(updatePagination({ page: 1 }));
            }, 300); // 300ms debounce
        },
        [dispatch]
    );

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

    // Pagination handlers
    const handlePageChange = useCallback(
        (page) => {
            dispatch(updatePagination({ page }));
        },
        [dispatch]
    );

    const handleLimitChange = useCallback(
        (limit) => {
            dispatch(updatePagination({ limit, page: 1 }));
        },
        [dispatch]
    );

    // Filter handlers
    const handleRegionFilter = useCallback(
        (region) => {
            dispatch(updateFilters({ region }));
            dispatch(updatePagination({ page: 1 }));
        },
        [dispatch]
    );

    const handleSortChange = useCallback(
        (sortBy, sortOrder) => {
            dispatch(updateFilters({ sortBy, sortOrder }));
            dispatch(updatePagination({ page: 1 }));
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

    const refreshData = useCallback(() => {
        // Reset the ref to allow fresh API call
        lastFetchParams.current = null;

        dispatch(
            fetchCountries({
                page: pagination.page,
                limit: pagination.limit,
                search: filters.search,
                region: filters.region,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
            })
        );
    }, [dispatch, pagination, filters]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    return {
        // Data
        countries,
        filteredData,
        selectedCountry,

        // State
        loading,
        error,
        message,
        pagination,
        filters,
        isLoading,
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

        // Pagination
        handlePageChange,
        handleLimitChange,

        // Filtering & Sorting
        handleRegionFilter,
        handleSortChange,

        // Utility
        clearErrorMessage,
        clearSuccessMessage,
        refreshData,
    };
};

export default useCountryTab;
