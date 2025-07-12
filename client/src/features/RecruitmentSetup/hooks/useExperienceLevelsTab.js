import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import {
    fetchExperienceLevels,
    fetchExperienceLevelById,
    createExperienceLevel,
    updateExperienceLevel,
    deleteExperienceLevel,
    clearError,
    clearCurrentItem,
    setCurrentItem,
    // Base selectors
    selectExperienceLevels,
    selectCurrentExperienceLevel,
    selectErrors,
    selectLoading,
} from "../../../store/ExperienceLevelsSlice";

// Derived selectors
const selectLoadingState = createSelector(
    [(state) => state.experienceLevels.loading],
    (loading) => ({ ...loading }) // Create shallow copy to avoid returning same reference
);

const selectIsLoadingState = createSelector(
    [(state) => state.experienceLevels.loading],
    (loading) => Object.values(loading).some((isLoading) => isLoading)
);

const useExperienceLevelsTab = ({
    setOpenDeleteModel,
    setRowData = () => {},
    setOpenAddEditModel = () => {},
    setModelType = () => {},
}) => {
    const dispatch = useDispatch();

    // Redux state selectors
    const experienceLevels = useSelector(selectExperienceLevels);
    const currentExperienceLevel = useSelector(selectCurrentExperienceLevel);
    const loading = useSelector(selectLoadingState);
    const error = useSelector(selectErrors);
    const isLoading = useSelector(selectIsLoadingState);

    const [searchValue, setSearchValue] = useState("");
    const initialLoadDone = useRef(false);

    // Initial data fetch
    useEffect(() => {
        if (!initialLoadDone.current) {
            dispatch(fetchExperienceLevels());
            initialLoadDone.current = true;
        }
    }, [dispatch]);

    // Filter data based on search value
    const filteredData = useMemo(() => {
        if (!searchValue.trim()) return experienceLevels || [];

        const searchTerm = searchValue.toLowerCase().trim();
        return (experienceLevels || []).filter((experienceLevel) =>
            experienceLevel.name?.toLowerCase().includes(searchTerm)
        );
    }, [searchValue, experienceLevels]);

    // Action handlers
    const handleAddNew = useCallback(() => {
        setOpenAddEditModel(true);
        setModelType("add");
        setRowData(null);
        dispatch(clearCurrentItem());
    }, [setOpenAddEditModel, setModelType, setRowData, dispatch]);

    const handleView = useCallback(
        (row) => {
            setOpenAddEditModel(true);
            setModelType("view");
            setRowData(row);
            dispatch(setCurrentItem(row));
            if (row.id) dispatch(fetchExperienceLevelById(row.id));
        },
        [setOpenAddEditModel, setModelType, setRowData, dispatch]
    );

    const handleEdit = useCallback(
        (row) => {
            setOpenAddEditModel(true);
            setModelType("edit");
            setRowData(row);
            dispatch(setCurrentItem(row));
            if (row.id) dispatch(fetchExperienceLevelById(row.id));
        },
        [setOpenAddEditModel, setModelType, setRowData, dispatch]
    );

    const handleDelete = useCallback(
        (row) => {
            setRowData(row);
            setOpenDeleteModel(true);
            dispatch(setCurrentItem(row));
        },
        [setRowData, setOpenDeleteModel, dispatch]
    );

    const handleSearch = useCallback((value) => {
        setSearchValue(value);
    }, []);

    // CRUD operations
    const handleCreateExperienceLevels = useCallback(
        async (experienceLevelData) => {
            try {
                const result = await dispatch(
                    createExperienceLevel(experienceLevelData)
                );
                if (createExperienceLevel.fulfilled.match(result)) {
                    dispatch(fetchExperienceLevels());
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

    const handleUpdateExperienceLevels = useCallback(
        async (id, experienceLevelData) => {
            try {
                const result = await dispatch(
                    updateExperienceLevel({
                        experienceLevelId: id,
                        experienceLevelData,
                    })
                );
                if (updateExperienceLevel.fulfilled.match(result)) {
                    dispatch(fetchExperienceLevels());
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

    const handleDeleteExperienceLevels = useCallback(
        async (experienceLevelId) => {
            try {
                const result = await dispatch(
                    deleteExperienceLevel(experienceLevelId)
                );
                if (deleteExperienceLevel.fulfilled.match(result)) {
                    dispatch(fetchExperienceLevels());
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
            dispatch(clearError(errorType));
        },
        [dispatch]
    );

    const clearCurrentExperienceLevelData = useCallback(() => {
        dispatch(clearCurrentItem());
    }, [dispatch]);

    const clearSearchValue = useCallback(() => {
        setSearchValue("");
    }, []);

    const refreshData = useCallback(() => {
        dispatch(fetchExperienceLevels());
    }, [dispatch]);

    return {
        // Data
        experienceLevels: experienceLevels || [],
        filteredData,
        currentExperienceLevel,
        displayData: filteredData,

        // State
        loading,
        error,
        isLoading,
        searchValue,

        // Basic handlers
        handleAddNew,
        handleView,
        handleEdit,
        handleDelete,
        handleSearch,

        // CRUD operations
        handleCreateExperienceLevels,
        handleUpdateExperienceLevels,
        handleDeleteExperienceLevels,

        // Utility functions
        clearErrorMessage,
        clearCurrentExperienceLevelData,
        clearSearchValue,
        refreshData,
    };
};

export default useExperienceLevelsTab;
