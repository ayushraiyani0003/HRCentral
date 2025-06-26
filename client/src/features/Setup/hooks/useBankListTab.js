import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllBanks,
    fetchBankById,
    createBank,
    updateBank,
    deleteBank,
    searchBanks,
    clearError,
    clearCurrentBank,
    clearSearchResults,
    setCurrentBank,
    updateFilters,
    updatePagination,
    // Selectors
    selectBanks,
    selectCurrentBank,
    selectSearchResults,
    selectPagination,
    selectLoading,
    selectError,
    selectFilters,
    selectLastAction,
    selectIsLoading,
} from "../../../store/BankListSlice";

const useBankListTab = ({
    setOpenDeleteModel,
    setRowData = () => {},
    setOpenAddEditModel = () => {},
    setModelType = () => {},
}) => {
    console.log(setRowData);

    const dispatch = useDispatch();

    // Redux state selectors
    const banks = useSelector(selectBanks);
    const currentBank = useSelector(selectCurrentBank);
    const searchResults = useSelector(selectSearchResults);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const pagination = useSelector(selectPagination);
    const filters = useSelector(selectFilters);
    const lastAction = useSelector(selectLastAction);
    const isLoading = useSelector(selectIsLoading);

    // Local state for search
    const [searchValue, setSearchValue] = useState(filters.searchTerm || "");

    // Ref to track if initial load is done
    const initialLoadDone = useRef(false);

    // Ref to prevent duplicate API calls
    const lastFetchParams = useRef(null);

    // Load banks on component mount and when relevant parameters change
    useEffect(() => {
        const fetchParams = {
            limit: pagination.limit,
            offset: pagination.offset,
            orderBy: filters.orderBy,
            orderDirection: filters.orderDirection,
            searchTerm: filters.searchTerm,
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
        dispatch(fetchAllBanks(fetchParams));

        // Mark initial load as done
        if (!initialLoadDone.current) {
            initialLoadDone.current = true;
        }
    }, [
        dispatch,
        pagination.limit,
        pagination.offset,
        filters.orderBy,
        filters.orderDirection,
        filters.searchTerm,
    ]);

    // Determine which data to display (search results or regular banks)
    const displayData = useMemo(() => {
        return filters.searchTerm ? searchResults : banks;
    }, [filters.searchTerm, searchResults, banks]);

    // Filter data based on search value (local filtering for immediate feedback)
    const filteredData = useMemo(() => {
        if (!searchValue.trim()) {
            return displayData;
        }
        const searchTerm = searchValue.toLowerCase().trim();
        return displayData.filter((bank) => {
            return (
                bank.name?.toLowerCase().includes(searchTerm) ||
                bank.code?.toLowerCase().includes(searchTerm) ||
                bank.branch?.toLowerCase().includes(searchTerm) ||
                bank.ifsc?.toLowerCase().includes(searchTerm)
            );
        });
    }, [searchValue, displayData]);

    // Action handlers for modal operations
    const handleAddNew = useCallback(() => {
        console.log("handleAddNew called");
        setOpenAddEditModel(true);
        setModelType("add");
        setRowData(null);
        dispatch(clearCurrentBank());
    }, [setOpenAddEditModel, setModelType, setRowData, dispatch]);

    const handleView = useCallback(
        (row) => {
            setOpenAddEditModel(true);
            setModelType("view");
            setRowData(row);
            dispatch(setCurrentBank(row));

            // Optionally fetch full bank details
            if (row.id) {
                dispatch(fetchBankById(row.id));
            }
        },
        [setOpenAddEditModel, setModelType, setRowData, dispatch]
    );

    const handleEdit = useCallback(
        (row) => {
            setOpenAddEditModel(true);
            setModelType("edit");
            setRowData(row);
            dispatch(setCurrentBank(row));

            // Optionally fetch full bank details
            if (row.id) {
                dispatch(fetchBankById(row.id));
            }
        },
        [setOpenAddEditModel, setModelType, setRowData, dispatch]
    );

    const handleDelete = useCallback(
        (row) => {
            setRowData(row);
            setOpenDeleteModel(true);
            dispatch(setCurrentBank(row));
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
                        searchBanks({
                            searchTerm: value,
                            options: {
                                limit: pagination.limit,
                                orderBy: filters.orderBy,
                                orderDirection: filters.orderDirection,
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
        [dispatch, pagination.limit, filters.orderBy, filters.orderDirection]
    );

    // CRUD operations - These will be called from the modal
    const handleCreateBankList = useCallback(
        async (bankData) => {
            try {
                const result = await dispatch(createBank(bankData));
                if (createBank.fulfilled.match(result)) {
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

    const handleUpdateBankList = useCallback(
        async (id, bankData) => {
            try {
                const result = await dispatch(updateBank({ id, bankData }));
                if (updateBank.fulfilled.match(result)) {
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

    const handleDeleteBank = useCallback(
        async (bankId) => {
            try {
                const result = await dispatch(deleteBank(bankId));
                if (deleteBank.fulfilled.match(result)) {
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
            const offset = (page - 1) * pagination.limit;
            dispatch(updatePagination({ currentPage: page, offset }));
        },
        [dispatch, pagination.limit]
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

    const clearCurrentBankData = useCallback(() => {
        dispatch(clearCurrentBank());
    }, [dispatch]);

    const clearSearchResultsData = useCallback(() => {
        dispatch(clearSearchResults());
        setSearchValue("");
    }, [dispatch]);

    const refreshData = useCallback(() => {
        // Reset the ref to allow fresh API call
        lastFetchParams.current = null;

        if (filters.searchTerm) {
            // If currently searching, refresh search results
            dispatch(
                searchBanks({
                    searchTerm: filters.searchTerm,
                    options: {
                        limit: pagination.limit,
                        offset: pagination.offset,
                        orderBy: filters.orderBy,
                        orderDirection: filters.orderDirection,
                    },
                })
            );
        } else {
            // Otherwise, refresh regular bank list
            dispatch(
                fetchAllBanks({
                    limit: pagination.limit,
                    offset: pagination.offset,
                    orderBy: filters.orderBy,
                    orderDirection: filters.orderDirection,
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
        banks,
        filteredData,
        currentBank,
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
        handleCreateBankList,
        handleUpdateBankList,
        handleDeleteBank,

        // Pagination
        handlePageChange,
        handleLimitChange,

        // Filtering & Sorting
        handleSortChange,

        // Utility
        clearErrorMessage,
        clearCurrentBankData,
        clearSearchResultsData,
        refreshData,
    };
};

export default useBankListTab;
