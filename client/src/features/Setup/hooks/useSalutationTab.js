import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllSalutations,
    fetchSalutationById,
    createSalutation,
    updateSalutation,
    deleteSalutation,
    searchSalutations,
    clearError,
    clearCurrentSalutation,
    clearSearchResults,
    setCurrentSalutation,
    updateFilters,
    updatePagination,
    // Selectors
    selectSalutations,
    selectCurrentSalutation,
    selectSearchResults,
    selectPagination,
    selectLoading,
    selectError,
    selectFilters,
    selectLastAction,
    selectIsLoading,
} from "../../../store/SalutationSlice"; // Adjust path as needed

const useSalutationTab = ({
    setOpenDeleteModel,
    setRowData = () => {},
    setOpenAddEditModel = () => {},
    setModelType = () => {},
}) => {
    console.log(setRowData);

    const dispatch = useDispatch();

    // Redux state selectors with fallback defaults
    const salutations = useSelector(selectSalutations) || [];
    const currentSalutation = useSelector(selectCurrentSalutation);
    const searchResults = useSelector(selectSearchResults) || [];
    const loading = useSelector(selectLoading) || {};
    const error = useSelector(selectError);
    const pagination = useSelector(selectPagination) || {
        total: 0,
        limit: 10,
        offset: 0,
        totalPages: 0,
        currentPage: 1,
    };
    const filters = useSelector(selectFilters) || {
        orderBy: "name",
        orderDirection: "ASC",
        searchTerm: "",
    };
    const lastAction = useSelector(selectLastAction);
    const isLoading = useSelector(selectIsLoading);

    // Local state for search
    const [searchValue, setSearchValue] = useState(filters.searchTerm || "");

    // Ref to track if initial load is done
    const initialLoadDone = useRef(false);

    // Ref to prevent duplicate API calls
    const lastFetchParams = useRef(null);

    // Load salutations on component mount and when relevant parameters change
    useEffect(() => {
        // Ensure pagination and filters exist before proceeding
        if (!pagination || !filters) {
            return;
        }

        const fetchParams = {
            limit: pagination.limit || 10,
            offset: pagination.offset || 0,
            orderBy: filters.orderBy || "name",
            orderDirection: filters.orderDirection || "ASC",
            searchTerm: filters.searchTerm || "",
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
        dispatch(fetchAllSalutations(fetchParams));

        // Mark initial load as done
        if (!initialLoadDone.current) {
            initialLoadDone.current = true;
        }
    }, [
        dispatch,
        pagination?.limit,
        pagination?.offset,
        filters?.orderBy,
        filters?.orderDirection,
        filters?.searchTerm,
    ]);

    // Determine which data to display (search results or regular salutations)
    const displayData = useMemo(() => {
        return filters?.searchTerm ? searchResults : salutations;
    }, [filters?.searchTerm, searchResults, salutations]);

    // Filter data based on search value (local filtering for immediate feedback)
    const filteredData = useMemo(() => {
        if (!searchValue.trim()) {
            return displayData;
        }
        const searchTerm = searchValue.toLowerCase().trim();
        return displayData.filter((salutation) => {
            return (
                salutation.name?.toLowerCase().includes(searchTerm) ||
                salutation.code?.toLowerCase().includes(searchTerm) ||
                salutation.description?.toLowerCase().includes(searchTerm)
            );
        });
    }, [searchValue, displayData]);

    // Action handlers for modal operations
    const handleAddNew = useCallback(() => {
        console.log("handleAddNew called");
        setOpenAddEditModel(true);
        setModelType("add");
        setRowData(null);
        dispatch(clearCurrentSalutation());
    }, [setOpenAddEditModel, setModelType, setRowData, dispatch]);

    const handleView = useCallback(
        (row) => {
            setOpenAddEditModel(true);
            setModelType("view");
            setRowData(row);
            dispatch(setCurrentSalutation(row));

            // Optionally fetch full salutation details
            if (row.id) {
                dispatch(fetchSalutationById(row.id));
            }
        },
        [setOpenAddEditModel, setModelType, setRowData, dispatch]
    );

    const handleEdit = useCallback(
        (row) => {
            setOpenAddEditModel(true);
            setModelType("edit");
            setRowData(row);
            dispatch(setCurrentSalutation(row));

            // Optionally fetch full salutation details
            if (row.id) {
                dispatch(fetchSalutationById(row.id));
            }
        },
        [setOpenAddEditModel, setModelType, setRowData, dispatch]
    );

    const handleDelete = useCallback(
        (row) => {
            setRowData(row);
            setOpenDeleteModel(true);
            dispatch(setCurrentSalutation(row));
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
                if (value.trim()) {
                    // Perform server-side search
                    dispatch(
                        searchSalutations({
                            searchTerm: value,
                            options: {
                                limit: pagination?.limit || 10,
                                orderBy: filters?.orderBy || "name",
                                orderDirection:
                                    filters?.orderDirection || "ASC",
                            },
                        })
                    );
                } else {
                    // Clear search results and update filters
                    dispatch(clearSearchResults());
                    dispatch(updateFilters({ searchTerm: "" }));
                }

                // Reset pagination when searching
                dispatch(updatePagination({ currentPage: 1, offset: 0 }));
            }, 300); // 300ms debounce
        },
        [dispatch, pagination?.limit, filters?.orderBy, filters?.orderDirection]
    );

    // CRUD operations - These will be called from the modal
    const handleCreateSalutation = useCallback(
        async (salutationData) => {
            try {
                const result = await dispatch(createSalutation(salutationData));
                if (createSalutation.fulfilled.match(result)) {
                    lastFetchParams.current = null;

                    // ✅ Force refresh
                    refreshData();

                    // Close modal
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

    const handleUpdateSalutation = useCallback(
        async (id, salutationData) => {
            try {
                const result = await dispatch(
                    updateSalutation({ id, salutationData })
                );
                if (updateSalutation.fulfilled.match(result)) {
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

    const handleDeleteSalutation = useCallback(
        async (salutationId) => {
            try {
                const result = await dispatch(deleteSalutation(salutationId));
                if (deleteSalutation.fulfilled.match(result)) {
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
            const limit = pagination?.limit || 10;
            const offset = (page - 1) * limit;
            dispatch(updatePagination({ currentPage: page, offset }));
        },
        [dispatch, pagination?.limit]
    );

    const handleLimitChange = useCallback(
        (limit) => {
            dispatch(
                updatePagination({
                    limit,
                    currentPage: 1,
                    offset: 0,
                })
            );
        },
        [dispatch]
    );

    // Filter handlers
    const handleSortChange = useCallback(
        (orderBy, orderDirection) => {
            dispatch(updateFilters({ orderBy, orderDirection }));
            dispatch(updatePagination({ currentPage: 1, offset: 0 }));
        },
        [dispatch]
    );

    // Utility functions
    const clearErrorMessage = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const clearCurrentSalutationData = useCallback(() => {
        dispatch(clearCurrentSalutation());
    }, [dispatch]);

    const clearSearchResultsData = useCallback(() => {
        dispatch(clearSearchResults());
        setSearchValue("");
    }, [dispatch]);

    const refreshData = useCallback(() => {
        // Reset the ref to allow fresh API call
        lastFetchParams.current = null;

        const currentFilters = filters || {};
        const currentPagination = pagination || { limit: 10, offset: 0 };

        if (currentFilters.searchTerm) {
            // If currently searching, refresh search results
            dispatch(
                searchSalutations({
                    searchTerm: currentFilters.searchTerm,
                    options: {
                        limit: currentPagination.limit || 10,
                        offset: currentPagination.offset || 0,
                        orderBy: currentFilters.orderBy || "name",
                        orderDirection: currentFilters.orderDirection || "ASC",
                    },
                })
            );
        } else {
            // Otherwise, refresh regular salutation list
            dispatch(
                fetchAllSalutations({
                    limit: currentPagination.limit || 10,
                    offset: currentPagination.offset || 0,
                    orderBy: currentFilters.orderBy || "name",
                    orderDirection: currentFilters.orderDirection || "ASC",
                })
            );
        }
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
        salutations,
        filteredData,
        currentSalutation,
        searchResults,
        displayData,

        // State
        loading,
        error,
        pagination,
        filters,
        lastAction,
        isLoading,
        searchValue,

        // Modal handlers (for opening modals)
        handleAddNew,
        handleView,
        handleEdit,
        handleDelete,
        handleSearch,

        // CRUD operations (for modal to call)
        handleCreateSalutation,
        handleUpdateSalutation,
        handleDeleteSalutation,

        // Pagination
        handlePageChange,
        handleLimitChange,

        // Filtering & Sorting
        handleSortChange,

        // Utility
        clearErrorMessage,
        clearCurrentSalutationData,
        clearSearchResultsData,
        refreshData,
    };
};

export default useSalutationTab;
