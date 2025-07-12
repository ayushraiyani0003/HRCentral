import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchSalutations,
    fetchSalutationById,
    createSalutation,
    updateSalutation,
    deleteSalutation,
    clearErrors,
    clearCurrentSalutation,
    setCurrentSalutation,
    // Selectors
    selectSalutations,
    selectCurrentSalutation,
    selectLoading,
    selectErrors,
    selectIsLoading,
} from "../../../store/SalutationSlice"; // Adjust path as needed

const useSalutationTab = ({
    setOpenDeleteModel,
    setRowData = () => {},
    setOpenAddEditModel = () => {},
    setModelType = () => {},
}) => {
    const dispatch = useDispatch();

    // Redux state selectors with fallback defaults - ENSURE ARRAYS
    const salutations = useSelector(selectSalutations) || [];
    const currentSalutation = useSelector(selectCurrentSalutation);
    const loading = useSelector(selectLoading) || {};
    const errors = useSelector(selectErrors) || {};
    const isLoading = useSelector(selectIsLoading);

    // Local state for client-side search and sorting
    const [searchValue, setSearchValue] = useState("");
    const [sortConfig, setSortConfig] = useState({
        key: "name",
        direction: "asc",
    });

    // Ref to track if initial load is done
    const initialLoadDone = useRef(false);

    // Load ALL salutations on component mount (no pagination parameters)
    useEffect(() => {
        if (!initialLoadDone.current) {
            dispatch(fetchSalutations());
            initialLoadDone.current = true;
        }
    }, [dispatch]);

    // Client-side filtering based on search value - ENSURE ARRAY RETURN
    const filteredData = useMemo(() => {
        // Ensure salutations is an array
        const salutationsArray = Array.isArray(salutations) ? salutations : [];

        if (!searchValue.trim()) {
            return salutationsArray;
        }

        const searchTerm = searchValue.toLowerCase().trim();
        return salutationsArray.filter((salutation) => {
            return (
                salutation.name?.toLowerCase().includes(searchTerm) ||
                salutation.code?.toLowerCase().includes(searchTerm) ||
                salutation.description?.toLowerCase().includes(searchTerm)
            );
        });
    }, [searchValue, salutations]);

    // Client-side sorting - ENSURE ARRAY INPUT
    const sortedAndFilteredData = useMemo(() => {
        if (!sortConfig.key) {
            return filteredData;
        }

        // Ensure filteredData is an array before spreading
        const dataArray = Array.isArray(filteredData) ? filteredData : [];

        return [...dataArray].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            if (typeof aValue === "string" && typeof bValue === "string") {
                const comparison = aValue
                    .toLowerCase()
                    .localeCompare(bValue.toLowerCase());
                return sortConfig.direction === "asc"
                    ? comparison
                    : -comparison;
            }

            if (aValue < bValue) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    }, [filteredData, sortConfig]);

    // Action handlers for modal operations
    const handleAddNew = useCallback(() => {
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

    // Client-side search handler
    const handleSearch = useCallback((value) => {
        setSearchValue(value);
    }, []);

    // Client-side sort handler
    const handleSort = useCallback((key) => {
        setSortConfig((prevConfig) => ({
            key,
            direction:
                prevConfig.key === key && prevConfig.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
    }, []);

    // Refresh data handler
    const refreshData = useCallback(() => {
        dispatch(fetchSalutations());
    }, [dispatch]);

    // CRUD operations - These will be called from the modal
    const handleCreateSalutation = useCallback(
        async (salutationData) => {
            try {
                const result = await dispatch(createSalutation(salutationData));
                if (createSalutation.fulfilled.match(result)) {
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

    // Utility functions
    const clearErrorMessage = useCallback(() => {
        dispatch(clearErrors());
    }, [dispatch]);

    const clearCurrentSalutationData = useCallback(() => {
        dispatch(clearCurrentSalutation());
    }, [dispatch]);

    const clearSearchValue = useCallback(() => {
        setSearchValue("");
    }, []);

    const clearSort = useCallback(() => {
        setSortConfig({ key: "name", direction: "asc" });
    }, []);

    // Statistics - ENSURE ARRAYS FOR LENGTH CALCULATION
    const salutationsArray = Array.isArray(salutations) ? salutations : [];
    const displayDataArray = Array.isArray(sortedAndFilteredData)
        ? sortedAndFilteredData
        : [];

    const totalRecords = salutationsArray.length;
    const filteredRecords = displayDataArray.length;

    return {
        // Data
        salutations: salutationsArray,
        filteredData: Array.isArray(filteredData) ? filteredData : [],
        currentSalutation,
        displayData: displayDataArray, // Use sorted and filtered data for display

        // State
        loading,
        errors, // Changed from error to errors to match slice
        isLoading,
        searchValue,
        sortConfig,

        // Statistics
        totalRecords,
        filteredRecords,

        // Modal handlers (for opening modals)
        handleAddNew,
        handleView,
        handleEdit,
        handleDelete,
        handleSearch,
        handleSort,

        // CRUD operations (for modal to call)
        handleCreateSalutation,
        handleUpdateSalutation,
        handleDeleteSalutation,

        // Utility
        clearErrorMessage,
        clearCurrentSalutationData,
        clearSearchValue,
        clearSort,
        refreshData,
    };
};

export default useSalutationTab;
