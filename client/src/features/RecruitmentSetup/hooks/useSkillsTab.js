import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import {
    fetchSkills,
    fetchSkillById,
    createSkill,
    updateSkill,
    deleteSkill,
    searchSkills,
    clearErrors,
    clearError,
    clearMessage,
    setSelectedSkill,
    clearSelectedSkill,
    setSearchTerm,
    clearSearch,
    // Base selectors
    selectSkills,
    selectSelectedSkill,
    selectSkillsLoading,
    selectSkillsError,
    selectSkillsMessage,
    selectSearchResults,
    selectSearchTerm,
    selectIsCreating,
    selectIsUpdating,
    selectIsDeleting,
    selectIsSearching,
    selectIsLoading,
} from "../../../store/SkillsSlice";

// Derived selectors
const selectLoadingState = createSelector(
    [
        selectSkillsLoading,
        selectIsCreating,
        selectIsUpdating,
        selectIsDeleting,
        selectIsSearching,
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
    [(state) => state.skills],
    (skillsState) => ({
        error: skillsState.error,
        createError: skillsState.createError,
        updateError: skillsState.updateError,
        deleteError: skillsState.deleteError,
        searchError: skillsState.searchError,
    })
);

const useSkillsTab = ({
    setOpenDeleteModel,
    setRowData = () => {},
    setOpenAddEditModel = () => {},
    setModelType = () => {},
}) => {
    const dispatch = useDispatch();

    // Redux state selectors
    const skills = useSelector(selectSkills);
    const selectedSkill = useSelector(selectSelectedSkill);
    const loadingState = useSelector(selectLoadingState);
    const errorState = useSelector(selectErrorState);
    const message = useSelector(selectSkillsMessage);
    const searchResults = useSelector(selectSearchResults);
    const searchTerm = useSelector(selectSearchTerm);
    const isLoading = useSelector(selectIsLoading);

    const [localSearchValue, setLocalSearchValue] = useState("");
    const initialLoadDone = useRef(false);

    // Load skills on mount
    useEffect(() => {
        if (!initialLoadDone.current) {
            dispatch(fetchSkills());
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
        if (!localSearchValue.trim()) return skills || [];

        const searchTermLower = localSearchValue.toLowerCase().trim();
        return (skills || []).filter((skill) =>
            ["name", "description", "category", "level"].some((key) =>
                skill[key]?.toLowerCase().includes(searchTermLower)
            )
        );
    }, [localSearchValue, skills, searchTerm, searchResults]);

    // Action handlers
    const handleAddNew = useCallback(() => {
        setOpenAddEditModel(true);
        setModelType("add");
        setRowData(null);
        dispatch(clearSelectedSkill());
    }, [setOpenAddEditModel, setModelType, setRowData, dispatch]);

    const handleView = useCallback(
        (row) => {
            setOpenAddEditModel(true);
            setModelType("view");
            setRowData(row);
            dispatch(setSelectedSkill(row));
            if (row.id) {
                dispatch(fetchSkillById(row.id));
            }
        },
        [setOpenAddEditModel, setModelType, setRowData, dispatch]
    );

    const handleEdit = useCallback(
        (row) => {
            setOpenAddEditModel(true);
            setModelType("edit");
            setRowData(row);
            dispatch(setSelectedSkill(row));
            if (row.id) {
                dispatch(fetchSkillById(row.id));
            }
        },
        [setOpenAddEditModel, setModelType, setRowData, dispatch]
    );

    const handleDelete = useCallback(
        (row) => {
            setRowData(row);
            setOpenDeleteModel(true);
            dispatch(setSelectedSkill(row));
        },
        [setRowData, setOpenDeleteModel, dispatch]
    );

    const handleSearch = useCallback(
        (value) => {
            setLocalSearchValue(value);
            // Optionally trigger Redux search for server-side filtering
            if (value.trim()) {
                dispatch(setSearchTerm(value));
                dispatch(searchSkills({ searchTerm: value }));
            } else {
                dispatch(clearSearch());
            }
        },
        [dispatch]
    );

    // CRUD operations
    const handleCreateSkills = useCallback(
        async (skillData) => {
            try {
                const result = await dispatch(createSkill(skillData));
                if (createSkill.fulfilled.match(result)) {
                    dispatch(fetchSkills()); // Refresh the list
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

    const handleUpdateSkills = useCallback(
        async (id, skillData) => {
            try {
                const result = await dispatch(
                    updateSkill({ skillId: id, skillData })
                );
                if (updateSkill.fulfilled.match(result)) {
                    dispatch(fetchSkills()); // Refresh the list
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

    const handleDeleteSkills = useCallback(
        async (skillId) => {
            try {
                const result = await dispatch(deleteSkill(skillId));
                if (deleteSkill.fulfilled.match(result)) {
                    dispatch(fetchSkills()); // Refresh the list
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

    // Search with options
    const handleSearchSkills = useCallback(
        async (searchTerm, options = {}) => {
            try {
                const result = await dispatch(
                    searchSkills({ searchTerm, options })
                );
                if (searchSkills.fulfilled.match(result)) {
                    return { success: true, data: result.payload };
                }
                return { success: false, error: result.payload };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },
        [dispatch]
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

    const clearSelectedSkillData = useCallback(() => {
        dispatch(clearSelectedSkill());
    }, [dispatch]);

    const clearSearchValue = useCallback(() => {
        setLocalSearchValue("");
        dispatch(clearSearch());
    }, [dispatch]);

    const refreshData = useCallback(() => {
        dispatch(fetchSkills());
    }, [dispatch]);
    console.log(filteredData);

    return {
        // Data
        skills: skills || [],
        filteredData,
        selectedSkill,
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
        handleCreateSkills,
        handleUpdateSkills,
        handleDeleteSkills,
        handleSearchSkills,

        // Utility functions
        clearErrorMessage,
        clearMessageData,
        clearSelectedSkillData,
        clearSearchValue,
        refreshData,
    };
};

export default useSkillsTab;
