import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import {
    fetchAllDesignations,
    fetchDesignationById,
    createDesignation,
    updateDesignation,
    deleteDesignation,
    clearError,
    clearCurrentDesignation,
    setCurrentDesignation,
    updateFilters,
    clearFilters,
    // Base selectors
    selectDesignations,
    selectCurrentDesignation,
    selectError,
    selectLastOperation,
    selectLoading,
    selectFilters,
} from "../../../store/DesignationsSlice";

// Derived selectors
const selectLoadingState = createSelector(
    [(state) => state.designations.loading],
    (loading) => loading
);

const selectIsLoadingState = createSelector(
    [(state) => state.designations.loading],
    (loading) => loading
);

const useDesignationsTab = ({
    setOpenDeleteModel,
    setRowData = () => {},
    setOpenAddEditModel = () => {},
    setModelType = () => {},
}) => {
    const dispatch = useDispatch();

    // Redux state selectors
    const designations = useSelector(selectDesignations);
    const currentDesignation = useSelector(selectCurrentDesignation);
    const loading = useSelector(selectLoadingState);
    const error = useSelector(selectError);
    const lastOperation = useSelector(selectLastOperation);
    const isLoading = useSelector(selectIsLoadingState);
    const filters = useSelector(selectFilters);

    const [searchValue, setSearchValue] = useState("");
    const initialLoadDone = useRef(false);

    useEffect(() => {
        if (!initialLoadDone.current) {
            dispatch(fetchAllDesignations());
            initialLoadDone.current = true;
        }
    }, [dispatch]);

    const filteredData = useMemo(() => {
        if (!searchValue.trim()) return designations || [];

        const searchTerm = searchValue.toLowerCase().trim();
        return (designations || []).filter((designation) =>
            ["name", "description", "department"].some((key) =>
                designation[key]?.toLowerCase().includes(searchTerm)
            )
        );
    }, [searchValue, designations]);

    const handleAddNew = useCallback(() => {
        setOpenAddEditModel(true);
        setModelType("add");
        setRowData(null);
        dispatch(clearCurrentDesignation());
    }, [setOpenAddEditModel, setModelType, setRowData, dispatch]);

    const handleView = useCallback(
        (row) => {
            setOpenAddEditModel(true);
            setModelType("view");
            setRowData(row);
            dispatch(setCurrentDesignation(row));
            if (row.id) dispatch(fetchDesignationById(row.id));
        },
        [setOpenAddEditModel, setModelType, setRowData, dispatch]
    );

    const handleEdit = useCallback(
        (row) => {
            setOpenAddEditModel(true);
            setModelType("edit");
            setRowData(row);
            dispatch(setCurrentDesignation(row));
            if (row.id) dispatch(fetchDesignationById(row.id));
        },
        [setOpenAddEditModel, setModelType, setRowData, dispatch]
    );

    const handleDelete = useCallback(
        (row) => {
            setRowData(row);
            setOpenDeleteModel(true);
            dispatch(setCurrentDesignation(row));
        },
        [setRowData, setOpenDeleteModel, dispatch]
    );

    const handleSearch = useCallback((value) => {
        setSearchValue(value);
    }, []);

    const handleCreateDesignations = useCallback(
        async (designationData) => {
            try {
                const result = await dispatch(
                    createDesignation(designationData)
                );
                if (createDesignation.fulfilled.match(result)) {
                    dispatch(fetchAllDesignations());
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

    const handleUpdateDesignations = useCallback(
        async (designationId, designationData) => {
            try {
                const result = await dispatch(
                    updateDesignation({ designationId, designationData })
                );
                if (updateDesignation.fulfilled.match(result)) {
                    dispatch(fetchAllDesignations());
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

    const handleDeleteDesignations = useCallback(
        async (designationId) => {
            try {
                const result = await dispatch(deleteDesignation(designationId));
                if (deleteDesignation.fulfilled.match(result)) {
                    dispatch(fetchAllDesignations());
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

    const clearErrorMessage = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const clearCurrentDesignationData = useCallback(() => {
        dispatch(clearCurrentDesignation());
    }, [dispatch]);

    const clearSearchValue = useCallback(() => {
        setSearchValue("");
    }, []);

    const clearAllFilters = useCallback(() => {
        dispatch(clearFilters());
        setSearchValue("");
    }, [dispatch]);

    const refreshData = useCallback(() => {
        dispatch(fetchAllDesignations());
    }, [dispatch]);

    return {
        // Data
        designations: designations || [],
        filteredData,
        currentDesignation,
        displayData: filteredData,

        // State
        loading,
        error,
        lastOperation,
        isLoading,
        searchValue,
        filters,

        // Basic actions
        handleAddNew,
        handleView,
        handleEdit,
        handleDelete,
        handleSearch,

        // CRUD operations
        handleCreateDesignations,
        handleUpdateDesignations,
        handleDeleteDesignations,

        // Filter operations
        handleUpdateFilters,
        clearAllFilters,

        // Utility functions
        clearErrorMessage,
        clearCurrentDesignationData,
        clearSearchValue,
        refreshData,
    };
};

export default useDesignationsTab;
