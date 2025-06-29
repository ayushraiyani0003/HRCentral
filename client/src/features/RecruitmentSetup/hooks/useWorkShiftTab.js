import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import {
    fetchWorkShifts,
    fetchWorkShiftById,
    createWorkShift,
    updateWorkShift,
    deleteWorkShift,
    checkShiftExists,
    searchWorkShifts,
    clearErrors,
    clearCurrentShift,
    clearSearchResults,
    resetExistsCheck,
    resetWorkShiftState,
    // Base selectors
    selectWorkShifts,
    selectCurrentWorkShift,
    selectWorkShiftErrors,
    selectWorkShiftLoading,
    selectSearchResults,
    selectSearchTerm,
    selectExistsCheck,
    selectLastUpdated,
    selectIsAnyLoading,
    selectHasAnyError,
    selectWorkShiftById,
} from "../../../store/WorkShiftSlice";
import {
    formatTime,
    convertTo24Hour,
    createTimeRange,
    isValidTimeFormat,
    getCurrentTime,
} from "../../../utils/timeConversion";

// Fixed selectors to access the correct path in state
const selectWorkShiftsData = createSelector(
    [(state) => state.workShifts?.shifts || []],
    (shifts) => shifts
);

const selectCurrentWorkShiftData = createSelector(
    [(state) => state.workShifts?.currentShift || null],
    (currentShift) => currentShift
);

const selectWorkShiftLoadingState = createSelector(
    [(state) => state.workShifts?.loading || {}],
    (loading) => ({ ...loading })
);

const selectWorkShiftErrorState = createSelector(
    [(state) => state.workShifts?.error || {}],
    (error) => ({ ...error })
);

const selectWorkShiftSearchResults = createSelector(
    [(state) => state.workShifts?.searchResults || []],
    (searchResults) => searchResults
);

const selectWorkShiftSearchTerm = createSelector(
    [(state) => state.workShifts?.searchTerm || ""],
    (searchTerm) => searchTerm
);

const selectWorkShiftExistsCheck = createSelector(
    [
        (state) =>
            state.workShifts?.existsCheck || {
                name: "",
                exists: false,
                checking: false,
            },
    ],
    (existsCheck) => existsCheck
);

const selectWorkShiftLastUpdated = createSelector(
    [(state) => state.workShifts?.lastUpdated || null],
    (lastUpdated) => lastUpdated
);

// Enhanced derived selectors with memoization
const selectShiftStats = createSelector([selectWorkShiftsData], (shifts) => ({
    total: shifts.length,
    active: shifts.filter((shift) => shift.isActive !== false).length,
    inactive: shifts.filter((shift) => shift.isActive === false).length,
}));

const selectIsAnyWorkShiftLoading = createSelector(
    [selectWorkShiftLoadingState],
    (loading) => Object.values(loading).some(Boolean)
);

const selectHasAnyWorkShiftError = createSelector(
    [selectWorkShiftErrorState],
    (error) => Object.values(error).some((err) => err !== null)
);

const useWorkShiftTab = ({
    setOpenDeleteModel,
    setRowData = () => {},
    setOpenAddEditModel = () => {},
    setModelType = () => {},
}) => {
    const dispatch = useDispatch();

    // Fixed Redux state selectors
    const workShifts = useSelector(selectWorkShiftsData);
    const currentWorkShift = useSelector(selectCurrentWorkShiftData);
    const loading = useSelector(selectWorkShiftLoadingState);
    const error = useSelector(selectWorkShiftErrorState);
    const searchResults = useSelector(selectWorkShiftSearchResults);
    const searchTerm = useSelector(selectWorkShiftSearchTerm);
    const existsCheck = useSelector(selectWorkShiftExistsCheck);
    const lastUpdated = useSelector(selectWorkShiftLastUpdated);
    const isLoading = useSelector(selectIsAnyWorkShiftLoading);
    const hasAnyError = useSelector(selectHasAnyWorkShiftError);
    const shiftStats = useSelector(selectShiftStats);

    // Local state
    const [searchValue, setSearchValue] = useState("");
    const [selectedFilters, setSelectedFilters] = useState({
        status: "all", // all, active, inactive
        sortBy: "name", // name, start_time, end_time, createdAt, updatedAt
        sortOrder: "asc", // asc, desc
    });
    const initialLoadDone = useRef(false);

    // Initial data fetch
    useEffect(() => {
        if (!initialLoadDone.current) {
            dispatch(fetchWorkShifts());
            initialLoadDone.current = true;
        }
    }, [dispatch]);

    // Filtered and sorted data based on local search and filters
    const filteredData = useMemo(() => {
        let data = [...(workShifts || [])]; // Create a copy to avoid mutating original array

        // Transform data to include timeRange property
        data = data.map((shift) => ({
            ...shift,
            timeRange: createTimeRange(shift.start_time, shift.end_time),
        }));

        // Apply search filter
        if (searchValue.trim()) {
            const searchTermLocal = searchValue.toLowerCase().trim();
            data = data.filter((shift) => {
                // Check if shift exists and has the required properties
                if (!shift) return false;

                return ["name", "start_time", "end_time", "timeRange"].some(
                    (key) => {
                        const value = shift[key];
                        return (
                            value &&
                            typeof value === "string" &&
                            value.toLowerCase().includes(searchTermLocal)
                        );
                    }
                );
            });
        }

        // Apply status filter
        if (selectedFilters.status !== "all") {
            if (selectedFilters.status === "active") {
                data = data.filter((shift) => shift?.isActive !== false);
            } else if (selectedFilters.status === "inactive") {
                data = data.filter((shift) => shift?.isActive === false);
            }
        }

        // Apply sorting
        data.sort((a, b) => {
            const { sortBy, sortOrder } = selectedFilters;

            // Null safety checks
            if (!a || !b) return 0;

            let aValue = a[sortBy];
            let bValue = b[sortBy];

            // Handle null/undefined values
            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return sortOrder === "asc" ? -1 : 1;
            if (bValue == null) return sortOrder === "asc" ? 1 : -1;

            // Handle string values
            if (typeof aValue === "string" && typeof bValue === "string") {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            // Handle date sorting
            if (sortBy === "createdAt" || sortBy === "updatedAt") {
                aValue = new Date(aValue);
                bValue = new Date(bValue);

                // Check for invalid dates
                if (isNaN(aValue.getTime()) && isNaN(bValue.getTime()))
                    return 0;
                if (isNaN(aValue.getTime()))
                    return sortOrder === "asc" ? -1 : 1;
                if (isNaN(bValue.getTime()))
                    return sortOrder === "asc" ? 1 : -1;
            }

            // Perform comparison
            let comparison = 0;
            if (aValue > bValue) comparison = 1;
            else if (aValue < bValue) comparison = -1;

            return sortOrder === "desc" ? -comparison : comparison;
        });

        return data;
    }, [searchValue, workShifts, selectedFilters]);

    // Handle add new work shift
    const handleAddNew = useCallback(() => {
        setOpenAddEditModel(true);
        setModelType("add");
        setRowData(null);
        dispatch(clearCurrentShift());
        dispatch(resetExistsCheck());
    }, [setOpenAddEditModel, setModelType, setRowData, dispatch]);

    // Handle view work shift
    const handleView = useCallback(
        (row) => {
            if (!row?.id) {
                console.warn("No valid row data provided for view operation");
                return;
            }

            setOpenAddEditModel(true);
            setModelType("view");
            setRowData(row);
            dispatch(fetchWorkShiftById(row.id));
        },
        [setOpenAddEditModel, setModelType, setRowData, dispatch]
    );

    // Handle edit work shift
    const handleEdit = useCallback(
        (row) => {
            if (!row?.id) {
                console.warn("No valid row data provided for edit operation");
                return;
            }

            setOpenAddEditModel(true);
            setModelType("edit");
            setRowData(row);
            dispatch(fetchWorkShiftById(row.id));
        },
        [setOpenAddEditModel, setModelType, setRowData, dispatch]
    );

    // Handle delete work shift
    const handleDelete = useCallback(
        (row) => {
            if (!row) {
                console.warn("No valid row data provided for delete operation");
                return;
            }

            setRowData(row);
            setOpenDeleteModel(true);
        },
        [setRowData, setOpenDeleteModel]
    );

    // Handle local search
    const handleSearch = useCallback((value) => {
        setSearchValue(value || "");
    }, []);

    // Handle filter changes
    const handleFilterChange = useCallback((filterType, value) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [filterType]: value,
        }));
    }, []);

    // Handle remote search (using Redux search)
    const handleRemoteSearch = useCallback(
        (searchTerm) => {
            if (searchTerm && searchTerm.trim()) {
                dispatch(searchWorkShifts(searchTerm.trim()));
            } else {
                dispatch(clearSearchResults());
            }
        },
        [dispatch]
    );

    // Check if shift name exists - Fixed to not use selector inside callback
    const handleCheckShiftExists = useCallback(
        async (name, excludeId = null) => {
            if (!name || typeof name !== "string") {
                console.warn("Invalid name provided for existence check");
                return false;
            }

            try {
                const result = await dispatch(
                    checkShiftExists({ name: name.trim(), excludeId })
                );
                if (checkShiftExists.fulfilled.match(result)) {
                    return result.payload.exists;
                }
                return false;
            } catch (error) {
                console.error("Error checking shift existence:", error);
                return false;
            }
        },
        [dispatch]
    );

    // Create work shift - FIXED: Enhanced to handle time conversion with proper field mapping
    const handleCreateWorkShift = useCallback(
        async (shiftData) => {
            if (!shiftData) {
                return { success: false, error: "No shift data provided" };
            }

            try {
                // Map form fields to database fields and convert times to 24-hour format
                const processedData = {
                    ...shiftData,
                    // Map timeFrom/timeTo to start_time/end_time if they exist
                    start_time: shiftData.timeFrom
                        ? convertTo24Hour(shiftData.timeFrom)
                        : shiftData.start_time
                        ? convertTo24Hour(shiftData.start_time)
                        : null,
                    end_time: shiftData.timeTo
                        ? convertTo24Hour(shiftData.timeTo)
                        : shiftData.end_time
                        ? convertTo24Hour(shiftData.end_time)
                        : null,
                    // Map shiftName to name if name is empty
                    name: shiftData.name || shiftData.shiftName || "",
                };

                // Remove the form fields that shouldn't be sent to the server
                delete processedData.timeFrom;
                delete processedData.timeTo;
                delete processedData.shiftName;

                console.log("Original data:", shiftData);
                console.log("Processed data for server:", processedData);

                const result = await dispatch(createWorkShift(processedData));
                if (createWorkShift.fulfilled.match(result)) {
                    setOpenAddEditModel(false);
                    setRowData(null);
                    setModelType("");
                    dispatch(resetExistsCheck());
                    return { success: true, data: result.payload };
                }
                return {
                    success: false,
                    error: result.payload || "Creation failed",
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message || "Unknown error occurred",
                };
            }
        },
        [dispatch, setOpenAddEditModel, setRowData, setModelType]
    );

    // Update work shift - FIXED: Enhanced to handle time conversion with proper field mapping
    const handleUpdateWorkShift = useCallback(
        async (id, updateData) => {
            if (!id || !updateData) {
                return { success: false, error: "Invalid parameters provided" };
            }

            try {
                // Map form fields to database fields and convert times to 24-hour format
                const processedData = {
                    ...updateData,
                    // Map timeFrom/timeTo to start_time/end_time if they exist
                    start_time: updateData.timeFrom
                        ? convertTo24Hour(updateData.timeFrom)
                        : updateData.start_time
                        ? convertTo24Hour(updateData.start_time)
                        : null,
                    end_time: updateData.timeTo
                        ? convertTo24Hour(updateData.timeTo)
                        : updateData.end_time
                        ? convertTo24Hour(updateData.end_time)
                        : null,
                    // Map shiftName to name if name is empty
                    name: updateData.name || updateData.shiftName || "",
                };

                // Remove the form fields that shouldn't be sent to the server
                delete processedData.timeFrom;
                delete processedData.timeTo;
                delete processedData.shiftName;

                console.log("Original update data:", updateData);
                console.log("Processed update data for server:", processedData);

                const result = await dispatch(
                    updateWorkShift({ id, updateData: processedData })
                );
                if (updateWorkShift.fulfilled.match(result)) {
                    setOpenAddEditModel(false);
                    setRowData(null);
                    setModelType("");
                    dispatch(resetExistsCheck());
                    return { success: true, data: result.payload };
                }
                return {
                    success: false,
                    error: result.payload || "Update failed",
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message || "Unknown error occurred",
                };
            }
        },
        [dispatch, setOpenAddEditModel, setRowData, setModelType]
    );

    // Delete work shift
    const handleDeleteWorkShift = useCallback(
        async (shiftId) => {
            if (!shiftId) {
                return { success: false, error: "No shift ID provided" };
            }

            try {
                const result = await dispatch(deleteWorkShift(shiftId));
                if (deleteWorkShift.fulfilled.match(result)) {
                    setOpenDeleteModel(false);
                    setRowData(null);
                    return { success: true, data: result.payload };
                }
                return {
                    success: false,
                    error: result.payload || "Deletion failed",
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message || "Unknown error occurred",
                };
            }
        },
        [dispatch, setOpenDeleteModel, setRowData]
    );

    // Get work shift by ID - Fixed implementation
    const getWorkShiftById = useCallback(
        (id) => {
            if (!id) return null;

            // Return the shift from current workShifts array
            const shift = workShifts.find((shift) => shift?.id === id);
            if (shift) {
                return {
                    ...shift,
                    timeRange: createTimeRange(
                        shift.start_time,
                        shift.end_time
                    ),
                };
            }
            return null;
        },
        [workShifts]
    );

    // Clear error messages
    const clearErrorMessage = useCallback(() => {
        dispatch(clearErrors());
    }, [dispatch]);

    // Clear specific error (since slice doesn't support this, we clear all)
    const clearSpecificError = useCallback(
        (errorType) => {
            console.warn(
                `Clearing specific error type '${errorType}' - clearing all errors instead`
            );
            dispatch(clearErrors());
        },
        [dispatch]
    );

    // Clear current work shift data
    const clearCurrentWorkShiftData = useCallback(() => {
        dispatch(clearCurrentShift());
    }, [dispatch]);

    // Clear local search value
    const clearSearchValue = useCallback(() => {
        setSearchValue("");
    }, []);

    // Clear remote search results
    const clearRemoteSearchResults = useCallback(() => {
        dispatch(clearSearchResults());
    }, [dispatch]);

    // Reset exists check
    const resetExistsCheckData = useCallback(() => {
        dispatch(resetExistsCheck());
    }, [dispatch]);

    // Reset entire state
    const resetState = useCallback(() => {
        dispatch(resetWorkShiftState());
        setSearchValue("");
        setSelectedFilters({
            status: "all",
            sortBy: "name",
            sortOrder: "asc",
        });
        initialLoadDone.current = false; // Reset initial load flag
    }, [dispatch]);

    // Refresh data
    const refreshData = useCallback(() => {
        dispatch(fetchWorkShifts());
    }, [dispatch]);

    // Bulk operations
    const handleBulkDelete = useCallback(
        async (shiftIds) => {
            if (!Array.isArray(shiftIds) || shiftIds.length === 0) {
                return { success: false, error: "No valid shift IDs provided" };
            }

            try {
                const results = await Promise.allSettled(
                    shiftIds.map((id) => dispatch(deleteWorkShift(id)))
                );

                const successful = results.filter(
                    (result) =>
                        result.status === "fulfilled" &&
                        deleteWorkShift.fulfilled.match(result.value)
                ).length;

                return {
                    success: successful > 0,
                    total: shiftIds.length,
                    successful,
                    failed: shiftIds.length - successful,
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message || "Bulk delete failed",
                };
            }
        },
        [dispatch]
    );

    // Debug logging (remove in production)
    useEffect(() => {
        console.log("shiftStats", shiftStats);
        console.log("filteredData", filteredData);
        console.log("workShifts", workShifts);
    }, [shiftStats, filteredData, workShifts]);

    return {
        // Data
        workShifts: workShifts || [],
        filteredData,
        currentWorkShift,
        displayData: filteredData, // Keep this for backward compatibility
        searchResults: searchResults || [],
        searchTerm,
        existsCheck,
        lastUpdated,
        shiftStats,

        // Loading and error states
        loading,
        error,
        isLoading,
        hasAnyError,
        searchValue,
        selectedFilters,

        // Action handlers
        handleAddNew,
        handleView,
        handleEdit,
        handleDelete,
        handleSearch,
        handleFilterChange,
        handleRemoteSearch,
        handleCheckShiftExists,

        // CRUD operations
        handleCreateWorkShift,
        handleUpdateWorkShift,
        handleDeleteWorkShift,
        handleBulkDelete,

        // Utility functions
        getWorkShiftById,
        clearErrorMessage,
        clearSpecificError,
        clearCurrentWorkShiftData,
        clearSearchValue,
        clearRemoteSearchResults,
        resetExistsCheckData,
        resetState,
        refreshData,

        // Time utility functions
        formatTime,
        convertTo24Hour,
        createTimeRange,
        isValidTimeFormat,
        getCurrentTime,
    };
};

export default useWorkShiftTab;
