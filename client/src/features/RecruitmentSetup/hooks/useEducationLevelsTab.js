import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import {
    fetchAllEducationLevels,
    fetchEducationLevelById,
    createEducationLevel,
    updateEducationLevel,
    deleteEducationLevel,
    searchEducationLevels,
    fetchEducationLevelsSortedByLevel,
    clearError,
    clearCurrentEducationLevel,
    setCurrentEducationLevel,
    updateFilters,
    clearFilters,
    setSortOrder,
    toggleSortOrder,
    // Base selectors
    selectEducationLevels,
    selectCurrentEducationLevel,
    selectError,
    selectLastOperation,
    selectLoading,
    selectFilters,
    selectSortOrder,
    selectSortedEducationLevels,
    selectEducationLevelsWithFilters,
} from "../../../store/EducationLevelsSlice";

// Derived selectors
const selectLoadingState = createSelector(
    [(state) => state.educationLevels.loading],
    (loading) => loading
);

const selectIsLoadingState = createSelector(
    [(state) => state.educationLevels.loading],
    (loading) => loading
);

const useEducationLevelsTab = ({
    setOpenDeleteModel,
    setRowData = () => {},
    setOpenAddEditModel = () => {},
    setModelType = () => {},
}) => {
    const dispatch = useDispatch();

    // Redux state selectors
    const educationLevels = useSelector(selectEducationLevels);
    const currentEducationLevel = useSelector(selectCurrentEducationLevel);
    const loading = useSelector(selectLoadingState);
    const error = useSelector(selectError);
    const lastOperation = useSelector(selectLastOperation);
    const isLoading = useSelector(selectIsLoadingState);
    const filters = useSelector(selectFilters);
    const sortOrder = useSelector(selectSortOrder);
    const sortedEducationLevels = useSelector(selectSortedEducationLevels);
    const filteredEducationLevels = useSelector(
        selectEducationLevelsWithFilters
    );

    const [searchValue, setSearchValue] = useState("");
    const initialLoadDone = useRef(false);

    useEffect(() => {
        if (!initialLoadDone.current) {
            dispatch(fetchAllEducationLevels());
            initialLoadDone.current = true;
        }
    }, [dispatch]);

    const filteredData = useMemo(() => {
        if (!searchValue.trim()) return educationLevels || [];

        const searchTerm = searchValue.toLowerCase().trim();
        return (educationLevels || []).filter((level) =>
            ["name", "description"].some((key) =>
                level[key]?.toLowerCase().includes(searchTerm)
            )
        );
    }, [searchValue, educationLevels]);

    const handleAddNew = useCallback(() => {
        setOpenAddEditModel(true);
        setModelType("add");
        setRowData(null);
        dispatch(clearCurrentEducationLevel());
    }, [setOpenAddEditModel, setModelType, setRowData, dispatch]);

    const handleView = useCallback(
        (row) => {
            setOpenAddEditModel(true);
            setModelType("view");
            setRowData(row);
            dispatch(setCurrentEducationLevel(row));
            if (row.id) dispatch(fetchEducationLevelById(row.id));
        },
        [setOpenAddEditModel, setModelType, setRowData, dispatch]
    );

    const handleEdit = useCallback(
        (row) => {
            setOpenAddEditModel(true);
            setModelType("edit");
            setRowData(row);
            dispatch(setCurrentEducationLevel(row));
            if (row.id) dispatch(fetchEducationLevelById(row.id));
        },
        [setOpenAddEditModel, setModelType, setRowData, dispatch]
    );

    const handleDelete = useCallback(
        (row) => {
            setRowData(row);
            setOpenDeleteModel(true);
            dispatch(setCurrentEducationLevel(row));
        },
        [setRowData, setOpenDeleteModel, dispatch]
    );

    const handleSearch = useCallback(
        (value) => {
            setSearchValue(value);
            // Also dispatch search to Redux if you want to use the slice's search
            if (value.trim()) {
                dispatch(searchEducationLevels(value));
            }
        },
        [dispatch]
    );

    const handleCreateEducationLevels = useCallback(
        async (educationLevelData) => {
            try {
                const result = await dispatch(
                    createEducationLevel(educationLevelData)
                );
                if (createEducationLevel.fulfilled.match(result)) {
                    dispatch(fetchAllEducationLevels());
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

    const handleUpdateEducationLevels = useCallback(
        async (educationLevelId, educationLevelData) => {
            try {
                const result = await dispatch(
                    updateEducationLevel({
                        educationLevelId,
                        educationLevelData,
                    })
                );
                if (updateEducationLevel.fulfilled.match(result)) {
                    dispatch(fetchAllEducationLevels());
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

    const handleDeleteEducationLevels = useCallback(
        async (educationLevelId) => {
            try {
                const result = await dispatch(
                    deleteEducationLevel(educationLevelId)
                );
                if (deleteEducationLevel.fulfilled.match(result)) {
                    dispatch(fetchAllEducationLevels());
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

    const handleUpdateFilters = useCallback(
        (newFilters) => {
            dispatch(updateFilters(newFilters));
        },
        [dispatch]
    );

    const handleSortByLevel = useCallback(
        (order = "asc") => {
            dispatch(fetchEducationLevelsSortedByLevel(order));
        },
        [dispatch]
    );

    const handleSetSortOrder = useCallback(
        (order) => {
            dispatch(setSortOrder(order));
        },
        [dispatch]
    );

    const handleToggleSortOrder = useCallback(() => {
        dispatch(toggleSortOrder());
    }, [dispatch]);

    const clearErrorMessage = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const clearCurrentEducationLevelData = useCallback(() => {
        dispatch(clearCurrentEducationLevel());
    }, [dispatch]);

    const clearSearchValue = useCallback(() => {
        setSearchValue("");
    }, []);

    const clearAllFilters = useCallback(() => {
        dispatch(clearFilters());
        setSearchValue("");
    }, [dispatch]);

    const refreshData = useCallback(() => {
        dispatch(fetchAllEducationLevels());
    }, [dispatch]);

    const refreshSortedData = useCallback(() => {
        dispatch(fetchEducationLevelsSortedByLevel(sortOrder));
    }, [dispatch, sortOrder]);

    return {
        // Data
        educationLevels: educationLevels || [],
        filteredData,
        currentEducationLevel,
        displayData: filteredData,
        sortedEducationLevels,
        filteredEducationLevels,

        // State
        loading,
        error,
        lastOperation,
        isLoading,
        searchValue,
        filters,
        sortOrder,

        // Basic actions
        handleAddNew,
        handleView,
        handleEdit,
        handleDelete,
        handleSearch,

        // CRUD operations
        handleCreateEducationLevels,
        handleUpdateEducationLevels,
        handleDeleteEducationLevels,

        // Filter operations
        handleUpdateFilters,
        clearAllFilters,

        // Sort operations
        handleSortByLevel,
        handleSetSortOrder,
        handleToggleSortOrder,

        // Utility functions
        clearErrorMessage,
        clearCurrentEducationLevelData,
        clearSearchValue,
        refreshData,
        refreshSortedData,
    };
};

export default useEducationLevelsTab;
