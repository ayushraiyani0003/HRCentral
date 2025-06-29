import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import {
    fetchJobLocationTypes,
    fetchJobLocationTypeById,
    createJobLocationType,
    updateJobLocationType,
    deleteJobLocationType,
    searchJobLocationTypes,
    clearErrors,
    clearError,
    clearMessage,
    setSelectedJobLocationType,
    clearSelectedJobLocationType,
    setSearchTerm,
    clearSearch,
    // Base selectors
    selectJobLocationTypes,
    selectSelectedJobLocationType,
    selectJobLocationTypesLoading,
    selectJobLocationTypesError,
    selectJobLocationTypesMessage,
    selectJobLocationTypesSearchResults,
    selectJobLocationTypesSearchTerm,
    selectIsCreatingJobLocationType,
    selectIsUpdatingJobLocationType,
    selectIsDeletingJobLocationType,
    selectIsSearchingJobLocationTypes,
    selectJobLocationTypesIsLoading,
    selectJobLocationTypesCreateError,
    selectJobLocationTypesUpdateError,
    selectJobLocationTypesDeleteError,
    selectJobLocationTypesSearchError,
} from "../../../store/JobLocationTypeSlice";

// Derived selectors
const selectLoadingState = createSelector(
    [
        selectJobLocationTypesLoading,
        selectIsCreatingJobLocationType,
        selectIsUpdatingJobLocationType,
        selectIsDeletingJobLocationType,
        selectIsSearchingJobLocationTypes,
    ],
    (loading, creating, updating, deleting, searching) => ({
        loading,
        creating,
        updating,
        deleting,
        searching,
    })
);

const selectErrorState = createSelector(
    [
        selectJobLocationTypesError,
        selectJobLocationTypesCreateError,
        selectJobLocationTypesUpdateError,
        selectJobLocationTypesDeleteError,
        selectJobLocationTypesSearchError,
    ],
    (error, createError, updateError, deleteError, searchError) => ({
        error,
        createError,
        updateError,
        deleteError,
        searchError,
    })
);

const useJobLocationTypeTab = ({
    setOpenDeleteModel,
    setRowData = () => {},
    setOpenAddEditModel = () => {},
    setModelType = () => {},
}) => {
    const dispatch = useDispatch();

    // Redux state selectors
    const jobLocationTypes = useSelector(selectJobLocationTypes);
    const selectedJobLocationType = useSelector(selectSelectedJobLocationType);
    const loadingState = useSelector(selectLoadingState);
    const errorState = useSelector(selectErrorState);
    const message = useSelector(selectJobLocationTypesMessage);
    const searchResults = useSelector(selectJobLocationTypesSearchResults);
    const searchTerm = useSelector(selectJobLocationTypesSearchTerm);
    const isLoading = useSelector(selectJobLocationTypesIsLoading);

    const [localSearchValue, setLocalSearchValue] = useState("");
    const initialLoadDone = useRef(false);

    // Load job location types on mount
    useEffect(() => {
        if (!initialLoadDone.current) {
            dispatch(fetchJobLocationTypes());
            initialLoadDone.current = true;
        }
    }, [dispatch]);

    // Filtered data based on local search or Redux search results
    const filteredData = useMemo(() => {
        // If using Redux search and there's a search term, return search results
        if (searchTerm && searchResults.length >= 0) {
            return searchResults;
        }

        // Otherwise, filter locally
        if (!localSearchValue.trim()) return jobLocationTypes || [];

        const searchTermLower = localSearchValue.toLowerCase().trim();
        return (jobLocationTypes || []).filter((jobLocationType) =>
            ["name", "description", "code"].some((key) =>
                jobLocationType[key]?.toLowerCase().includes(searchTermLower)
            )
        );
    }, [localSearchValue, jobLocationTypes, searchTerm, searchResults]);

    // Action handlers
    const handleAddNew = useCallback(() => {
        setOpenAddEditModel(true);
        setModelType("add");
        setRowData(null);
        dispatch(clearSelectedJobLocationType());
    }, [setOpenAddEditModel, setModelType, setRowData, dispatch]);

    const handleView = useCallback(
        (row) => {
            setOpenAddEditModel(true);
            setModelType("view");
            setRowData(row);
            dispatch(setSelectedJobLocationType(row));
            if (row.id) {
                dispatch(fetchJobLocationTypeById(row.id));
            }
        },
        [setOpenAddEditModel, setModelType, setRowData, dispatch]
    );

    const handleEdit = useCallback(
        (row) => {
            setOpenAddEditModel(true);
            setModelType("edit");
            setRowData(row);
            dispatch(setSelectedJobLocationType(row));
            if (row.id) {
                dispatch(fetchJobLocationTypeById(row.id));
            }
        },
        [setOpenAddEditModel, setModelType, setRowData, dispatch]
    );

    const handleDelete = useCallback(
        (row) => {
            setRowData(row);
            setOpenDeleteModel(true);
            dispatch(setSelectedJobLocationType(row));
        },
        [setRowData, setOpenDeleteModel, dispatch]
    );

    const handleSearch = useCallback(
        (value) => {
            setLocalSearchValue(value);
            // Optionally trigger Redux search for server-side filtering
            if (value.trim()) {
                dispatch(setSearchTerm(value));
                dispatch(searchJobLocationTypes(value));
            } else {
                dispatch(clearSearch());
            }
        },
        [dispatch]
    );

    // CRUD operations
    const handleCreateJobLocationsTypes = useCallback(
        async (jobLocationTypeData) => {
            try {
                const result = await dispatch(
                    createJobLocationType(jobLocationTypeData)
                );
                if (createJobLocationType.fulfilled.match(result)) {
                    dispatch(fetchJobLocationTypes()); // Refresh the list
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

    const handleUpdateJobLocationsTypes = useCallback(
        async (id, jobLocationTypeData) => {
            try {
                const result = await dispatch(
                    updateJobLocationType({
                        jobLocationTypeId: id,
                        jobLocationTypeData,
                    })
                );
                if (updateJobLocationType.fulfilled.match(result)) {
                    dispatch(fetchJobLocationTypes()); // Refresh the list
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

    const handleDeleteJobLocationsTypes = useCallback(
        async (jobLocationTypeId) => {
            try {
                const result = await dispatch(
                    deleteJobLocationType(jobLocationTypeId)
                );
                if (deleteJobLocationType.fulfilled.match(result)) {
                    dispatch(fetchJobLocationTypes()); // Refresh the list
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

    // Utility functions
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

    const clearMessageData = useCallback(() => {
        dispatch(clearMessage());
    }, [dispatch]);

    const clearSelectedJobLocationTypeData = useCallback(() => {
        dispatch(clearSelectedJobLocationType());
    }, [dispatch]);

    const clearSearchValue = useCallback(() => {
        setLocalSearchValue("");
        dispatch(clearSearch());
    }, [dispatch]);

    const refreshData = useCallback(() => {
        dispatch(fetchJobLocationTypes());
    }, [dispatch]);

    return {
        // Data
        jobLocationTypes: jobLocationTypes || [],
        filteredData,
        selectedJobLocationType,
        displayData: filteredData,

        // Loading states
        loading: loadingState,
        error: errorState,
        message,
        isLoading,
        searchValue: localSearchValue,
        searchTerm,
        searchResults,

        // Action handlers
        handleAddNew,
        handleView,
        handleEdit,
        handleDelete,
        handleSearch,

        // CRUD operations
        handleCreateJobLocationsTypes,
        handleUpdateJobLocationsTypes,
        handleDeleteJobLocationsTypes,

        // Utility functions
        clearErrorMessage,
        clearMessageData,
        clearSelectedJobLocationTypeData,
        clearSearchValue,
        refreshData,
    };
};

export default useJobLocationTypeTab;
