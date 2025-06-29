import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import {
    fetchAllHiringSources,
    fetchHiringSourceById,
    createHiringSource,
    updateHiringSource,
    deleteHiringSource,
    clearError,
    clearCurrentHiringSource,
    // Base selectors
    selectHiringSources,
    selectCurrentHiringSource,
    selectErrors,
    selectLoading,
} from "../../../store/HiringSourceSlice";

// Derived selectors
const selectLoadingState = createSelector(
    [(state) => state.hiringSource.loading],
    (loading) => ({ ...loading }) // Create shallow copy to avoid returning same reference
);

const selectIsLoadingState = createSelector(
    [(state) => state.hiringSource.loading],
    (loading) => Object.values(loading).some((isLoading) => isLoading)
);

const useHiringSourceTab = ({
    setOpenDeleteModel,
    setRowData = () => {},
    setOpenAddEditModel = () => {},
    setModelType = () => {},
}) => {
    const dispatch = useDispatch();

    // Redux state selectors
    const hiringSources = useSelector(selectHiringSources);
    const currentHiringSource = useSelector(selectCurrentHiringSource);
    const loading = useSelector(selectLoadingState);
    const error = useSelector(selectErrors);
    const isLoading = useSelector(selectIsLoadingState);

    const [searchValue, setSearchValue] = useState("");
    const initialLoadDone = useRef(false);

    // Initial data fetch
    useEffect(() => {
        if (!initialLoadDone.current) {
            dispatch(fetchAllHiringSources());
            initialLoadDone.current = true;
        }
    }, [dispatch]);

    // Filter data based on search value
    const filteredData = useMemo(() => {
        if (!searchValue.trim()) return hiringSources || [];

        const searchTerm = searchValue.toLowerCase().trim();
        return (hiringSources || []).filter((hiringSource) =>
            hiringSource.name?.toLowerCase().includes(searchTerm)
        );
    }, [searchValue, hiringSources]);

    // Action handlers
    const handleAddNew = useCallback(() => {
        setOpenAddEditModel(true);
        setModelType("add");
        setRowData(null);
        dispatch(clearCurrentHiringSource());
    }, [setOpenAddEditModel, setModelType, setRowData, dispatch]);

    const handleView = useCallback(
        (row) => {
            setOpenAddEditModel(true);
            setModelType("view");
            setRowData(row);
            if (row.id) dispatch(fetchHiringSourceById(row.id));
        },
        [setOpenAddEditModel, setModelType, setRowData, dispatch]
    );

    const handleEdit = useCallback(
        (row) => {
            setOpenAddEditModel(true);
            setModelType("edit");
            setRowData(row);
            if (row.id) dispatch(fetchHiringSourceById(row.id));
        },
        [setOpenAddEditModel, setModelType, setRowData, dispatch]
    );

    const handleDelete = useCallback(
        (row) => {
            setRowData(row);
            setOpenDeleteModel(true);
        },
        [setRowData, setOpenDeleteModel]
    );

    const handleSearch = useCallback((value) => {
        setSearchValue(value);
    }, []);

    // CRUD operations
    const handleCreateHiringSources = useCallback(
        async (hiringSourceData) => {
            try {
                const result = await dispatch(
                    createHiringSource(hiringSourceData)
                );
                if (createHiringSource.fulfilled.match(result)) {
                    dispatch(fetchAllHiringSources());
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

    const handleUpdateHiringSources = useCallback(
        async (id, hiringSourceData) => {
            try {
                const result = await dispatch(
                    updateHiringSource({
                        hiringSourceId: id,
                        hiringSourceData,
                    })
                );
                if (updateHiringSource.fulfilled.match(result)) {
                    dispatch(fetchAllHiringSources());
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

    const handleDeleteHiringSources = useCallback(
        async (hiringSourceId) => {
            try {
                const result = await dispatch(
                    deleteHiringSource(hiringSourceId)
                );
                if (deleteHiringSource.fulfilled.match(result)) {
                    dispatch(fetchAllHiringSources());
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

    const clearCurrentHiringSourceData = useCallback(() => {
        dispatch(clearCurrentHiringSource());
    }, [dispatch]);

    const clearSearchValue = useCallback(() => {
        setSearchValue("");
    }, []);

    const refreshData = useCallback(() => {
        dispatch(fetchAllHiringSources());
    }, [dispatch]);
    console.log(filteredData);

    return {
        // Data
        hiringSources: hiringSources || [],
        filteredData,
        currentHiringSource,
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
        handleCreateHiringSources,
        handleUpdateHiringSources,
        handleDeleteHiringSources,

        // Utility functions
        clearErrorMessage,
        clearCurrentHiringSourceData,
        clearSearchValue,
        refreshData,
    };
};

export default useHiringSourceTab;
