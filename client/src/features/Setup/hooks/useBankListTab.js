import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import {
    fetchAllBanks,
    fetchBankById,
    createBank,
    updateBank,
    deleteBank,
    clearError,
    clearCurrentBank,
    setCurrentBank,
    // Base selectors
    selectBanks,
    selectCurrentBank,
    selectError,
    selectLastAction,
} from "../../../store/BankListSlice";

// Derived selectors
const selectLoadingState = createSelector(
    [(state) => state.banks.loading],
    (loading) => ({ ...loading }) // Create shallow copy to avoid returning same reference
);

const selectIsLoadingState = createSelector(
    [(state) => state.banks.loading],
    (loading) => Object.values(loading).some((isLoading) => isLoading)
);

const useBankListTab = ({
    setOpenDeleteModel,
    setRowData = () => {},
    setOpenAddEditModel = () => {},
    setModelType = () => {},
}) => {
    const dispatch = useDispatch();

    // Redux state selectors
    const banks = useSelector(selectBanks);
    const currentBank = useSelector(selectCurrentBank);
    const loading = useSelector(selectLoadingState);
    const error = useSelector(selectError);
    const lastAction = useSelector(selectLastAction);
    const isLoading = useSelector(selectIsLoadingState);

    const [searchValue, setSearchValue] = useState("");
    const initialLoadDone = useRef(false);

    useEffect(() => {
        if (!initialLoadDone.current) {
            dispatch(fetchAllBanks());
            initialLoadDone.current = true;
        }
    }, [dispatch]);

    const filteredData = useMemo(() => {
        if (!searchValue.trim()) return banks || [];

        const searchTerm = searchValue.toLowerCase().trim();
        return (banks || []).filter((bank) =>
            ["name", "code", "branch", "ifsc"].some((key) =>
                bank[key]?.toLowerCase().includes(searchTerm)
            )
        );
    }, [searchValue, banks]);

    const handleAddNew = useCallback(() => {
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
            if (row.id) dispatch(fetchBankById(row.id));
        },
        [setOpenAddEditModel, setModelType, setRowData, dispatch]
    );

    const handleEdit = useCallback(
        (row) => {
            setOpenAddEditModel(true);
            setModelType("edit");
            setRowData(row);
            dispatch(setCurrentBank(row));
            if (row.id) dispatch(fetchBankById(row.id));
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

    const handleSearch = useCallback((value) => {
        setSearchValue(value);
    }, []);

    const handleCreateBankList = useCallback(
        async (bankData) => {
            try {
                const result = await dispatch(createBank(bankData));
                if (createBank.fulfilled.match(result)) {
                    dispatch(fetchAllBanks());
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

    const handleUpdateBankList = useCallback(
        async (id, bankData) => {
            try {
                const result = await dispatch(updateBank({ id, bankData }));
                if (updateBank.fulfilled.match(result)) {
                    dispatch(fetchAllBanks());
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

    const handleDeleteBank = useCallback(
        async (bankId) => {
            try {
                const result = await dispatch(deleteBank(bankId));
                if (deleteBank.fulfilled.match(result)) {
                    dispatch(fetchAllBanks());
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

    const clearErrorMessage = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const clearCurrentBankData = useCallback(() => {
        dispatch(clearCurrentBank());
    }, [dispatch]);

    const clearSearchValue = useCallback(() => {
        setSearchValue("");
    }, []);

    const refreshData = useCallback(() => {
        dispatch(fetchAllBanks());
    }, [dispatch]);

    return {
        banks: banks || [],
        filteredData,
        currentBank,
        displayData: filteredData,

        loading,
        error,
        lastAction,
        isLoading,
        searchValue,

        handleAddNew,
        handleView,
        handleEdit,
        handleDelete,
        handleSearch,

        handleCreateBankList,
        handleUpdateBankList,
        handleDeleteBank,

        clearErrorMessage,
        clearCurrentBankData,
        clearSearchValue,
        refreshData,
    };
};

export default useBankListTab;
