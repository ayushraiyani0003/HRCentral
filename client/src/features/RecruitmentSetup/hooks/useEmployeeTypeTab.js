import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import {
    fetchEmployeeTypes,
    fetchEmployeeTypeById,
    createEmployeeType,
    updateEmployeeType,
    deleteEmployeeType,
    searchEmployeeTypes,
    checkNameExists,
    clearErrors,
    clearError,
    clearCurrentItem,
    setCurrentItem,
    clearSearchResults,
    setSearchTerm,
    setSorting,
    // Base selectors
    selectEmployeeTypes,
    selectCurrentEmployeeType,
    selectSearchResults,
    selectLoading,
    selectErrors,
    selectSearchTerm,
    selectNameExists,
    selectSorting,
    selectIsLoading,
    selectHasErrors,
} from "../../../store/EmployeeTypeSlice";

// Derived selectors
const selectLoadingState = createSelector(
    [selectLoading],
    (loading) => ({ ...loading }) // Create shallow copy to avoid returning same reference
);

const selectErrorState = createSelector(
    [selectErrors],
    (error) => ({ ...error }) // Create shallow copy to avoid returning same reference
);

const useEmployeeTypeTab = ({
    setOpenDeleteModel,
    setRowData = () => {},
    setOpenAddEditModel = () => {},
    setModelType = () => {},
}) => {
    const dispatch = useDispatch();

    // Redux state selectors
    const employeeTypes = useSelector(selectEmployeeTypes);
    const currentEmployeeType = useSelector(selectCurrentEmployeeType);
    const loading = useSelector(selectLoadingState);
    const error = useSelector(selectErrorState);
    const searchResults = useSelector(selectSearchResults);
    const searchTerm = useSelector(selectSearchTerm);
    const nameExists = useSelector(selectNameExists);
    const sorting = useSelector(selectSorting);
    const isLoading = useSelector(selectIsLoading);
    const hasErrors = useSelector(selectHasErrors);

    const [searchValue, setSearchValue] = useState("");
    const initialLoadDone = useRef(false);

    // Initial data fetch
    useEffect(() => {
        if (!initialLoadDone.current) {
            dispatch(fetchEmployeeTypes());
            initialLoadDone.current = true;
        }
    }, [dispatch]);

    // Filtered data based on local search
    const filteredData = useMemo(() => {
        if (!searchValue.trim()) return employeeTypes || [];

        const searchTermLocal = searchValue.toLowerCase().trim();
        return (employeeTypes || []).filter((employeeType) =>
            ["name", "description"].some((key) =>
                employeeType[key]?.toLowerCase().includes(searchTermLocal)
            )
        );
    }, [searchValue, employeeTypes]);

    // Handle add new employee type
    const handleAddNew = useCallback(() => {
        setOpenAddEditModel(true);
        setModelType("add");
        setRowData(null);
        dispatch(clearCurrentItem());
    }, [setOpenAddEditModel, setModelType, setRowData, dispatch]);

    // Handle view employee type
    const handleView = useCallback(
        (row) => {
            setOpenAddEditModel(true);
            setModelType("view");
            setRowData(row);
            dispatch(setCurrentItem(row));
            if (row.id) dispatch(fetchEmployeeTypeById(row.id));
        },
        [setOpenAddEditModel, setModelType, setRowData, dispatch]
    );

    // Handle edit employee type
    const handleEdit = useCallback(
        (row) => {
            setOpenAddEditModel(true);
            setModelType("edit");
            setRowData(row);
            dispatch(setCurrentItem(row));
            if (row.id) dispatch(fetchEmployeeTypeById(row.id));
        },
        [setOpenAddEditModel, setModelType, setRowData, dispatch]
    );

    // Handle delete employee type
    const handleDelete = useCallback(
        (row) => {
            setRowData(row);
            setOpenDeleteModel(true);
            dispatch(setCurrentItem(row));
        },
        [setRowData, setOpenDeleteModel, dispatch]
    );

    // Handle local search
    const handleSearch = useCallback((value) => {
        setSearchValue(value);
    }, []);

    // Handle remote search (using Redux search)
    const handleRemoteSearch = useCallback(
        (searchTerm) => {
            if (searchTerm.trim()) {
                dispatch(searchEmployeeTypes(searchTerm));
                dispatch(setSearchTerm(searchTerm));
            } else {
                dispatch(clearSearchResults());
            }
        },
        [dispatch]
    );

    // Create employee type
    const handleCreateEmployeeType = useCallback(
        async (employeeTypeData) => {
            try {
                const result = await dispatch(
                    createEmployeeType(employeeTypeData)
                );
                if (createEmployeeType.fulfilled.match(result)) {
                    dispatch(fetchEmployeeTypes());
                    setOpenAddEditModel(false);
                    setRowData(null);
                    setModelType("");
                    return { success: true, data: result.payload };
                }
                return { success: false, error: result.payload };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },
        [dispatch, setOpenAddEditModel, setRowData, setModelType]
    );

    // Update employee type
    const handleUpdateEmployeeType = useCallback(
        async (employeeTypeId, employeeTypeData) => {
            try {
                const result = await dispatch(
                    updateEmployeeType({ employeeTypeId, employeeTypeData })
                );
                if (updateEmployeeType.fulfilled.match(result)) {
                    dispatch(fetchEmployeeTypes());
                    setOpenAddEditModel(false);
                    setRowData(null);
                    setModelType("");
                    return { success: true, data: result.payload };
                }
                return { success: false, error: result.payload };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },
        [dispatch, setOpenAddEditModel, setRowData, setModelType]
    );

    // Delete employee type
    const handleDeleteEmployeeType = useCallback(
        async (employeeTypeId) => {
            console.log("Deleting employee type:", employeeTypeId);

            try {
                const result = await dispatch(
                    deleteEmployeeType(employeeTypeId)
                );
                if (deleteEmployeeType.fulfilled.match(result)) {
                    dispatch(fetchEmployeeTypes());
                    setOpenDeleteModel(false);
                    setRowData(null);
                    return { success: true, data: result.payload };
                }
                return { success: false, error: result.payload };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },
        [dispatch, setOpenDeleteModel, setRowData]
    );

    // Check if name exists
    const handleCheckNameExists = useCallback(
        async (name, excludeId = null) => {
            try {
                const result = await dispatch(
                    checkNameExists({ name, excludeId })
                );
                if (checkNameExists.fulfilled.match(result)) {
                    return { success: true, exists: result.payload.exists };
                }
                return { success: false, error: result.payload };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },
        [dispatch]
    );

    // Handle sorting
    const handleSorting = useCallback(
        (sortBy, sortOrder) => {
            dispatch(setSorting({ sortBy, sortOrder }));
        },
        [dispatch]
    );

    // Clear error messages
    const clearErrorMessage = useCallback(
        (errorType = null) => {
            if (errorType) {
                dispatch(clearError(errorType));
            } else {
                dispatch(clearErrors());
            }
        },
        [dispatch]
    );

    // Clear current employee type data
    const clearCurrentEmployeeTypeData = useCallback(() => {
        dispatch(clearCurrentItem());
    }, [dispatch]);

    // Clear local search value
    const clearSearchValue = useCallback(() => {
        setSearchValue("");
    }, []);

    // Clear remote search results
    const clearRemoteSearchResults = useCallback(() => {
        dispatch(clearSearchResults());
    }, [dispatch]);

    // Refresh data
    const refreshData = useCallback(() => {
        dispatch(fetchEmployeeTypes());
    }, [dispatch]);

    // Get sorted and filtered data
    const displayData = useMemo(() => {
        let data = [...filteredData];

        if (sorting.sortBy) {
            data.sort((a, b) => {
                const aValue = a[sorting.sortBy] || "";
                const bValue = b[sorting.sortBy] || "";

                if (sorting.sortOrder === "ASC") {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });
        }

        return data;
    }, [filteredData, sorting]);

    return {
        // Data
        employeeTypes: employeeTypes || [],
        filteredData,
        displayData,
        currentEmployeeType,
        searchResults: searchResults || [],
        searchTerm,
        nameExists,
        sorting,

        // Loading and error states
        loading,
        error,
        isLoading,
        hasErrors,
        searchValue,

        // Action handlers
        handleAddNew,
        handleView,
        handleEdit,
        handleDelete,
        handleSearch,
        handleRemoteSearch,
        handleSorting,

        // CRUD operations
        handleCreateEmployeeType,
        handleUpdateEmployeeType,
        handleDeleteEmployeeType,
        handleCheckNameExists,

        // Utility functions
        clearErrorMessage,
        clearCurrentEmployeeTypeData,
        clearSearchValue,
        clearRemoteSearchResults,
        refreshData,
    };
};

export default useEmployeeTypeTab;
