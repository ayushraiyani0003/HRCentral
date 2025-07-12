/**
 * @fileoverview Redux store configuration for Bank List management
 * @version 1.0.0
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import BankListService from "../services/BankListService";

// Initialize service
const bankService = new BankListService();

// Initial state - simplified for getting all data
const initialState = {
    banks: [],
    currentBank: null,
    loading: {
        fetchAll: false,
        fetchById: false,
        create: false,
        update: false,
        delete: false,
    },
    error: null,
    lastAction: null,
};

// Async Thunks (Action Creators)

/**
 * Create a new bank
 */
export const createBank = createAsyncThunk(
    "banks/create",
    async (bankData, { rejectWithValue }) => {
        try {
            const response = await bankService.createBank(bankData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Fetch all banks - simplified to get all data without pagination
 */
export const fetchAllBanks = createAsyncThunk(
    "banks/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            // Remove pagination parameters to get all data
            const response = await bankService.getAllBanks();
            return response.data; // Return just the data array
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Fetch bank by ID
 */
export const fetchBankById = createAsyncThunk(
    "banks/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await bankService.getBankById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Update bank
 */
export const updateBank = createAsyncThunk(
    "banks/update",
    async ({ id, bankData }, { rejectWithValue }) => {
        try {
            const response = await bankService.updateBank(id, bankData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Delete bank
 */
export const deleteBank = createAsyncThunk(
    "banks/delete",
    async (id, { rejectWithValue }) => {
        try {
            await bankService.deleteBank(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Bank Slice
const bankSlice = createSlice({
    name: "banks",
    initialState,
    reducers: {
        // Synchronous actions
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentBank: (state) => {
            state.currentBank = null;
        },
        resetBankState: () => initialState,
        setCurrentBank: (state, action) => {
            state.currentBank = action.payload;
        },
        updateBankInList: (state, action) => {
            const { id, updates } = action.payload;
            const index = state.banks.findIndex((bank) => bank.id === id);
            if (index !== -1) {
                state.banks[index] = { ...state.banks[index], ...updates };
            }
        },
        removeBankFromList: (state, action) => {
            const id = action.payload;
            state.banks = state.banks.filter((bank) => bank.id !== id);
        },
        addBankToList: (state, action) => {
            state.banks.unshift(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Bank
            .addCase(createBank.pending, (state) => {
                state.loading.create = true;
                state.error = null;
            })
            .addCase(createBank.fulfilled, (state, action) => {
                state.loading.create = false;
                state.banks.unshift(action.payload);
                state.lastAction = "create";
                state.error = null;
            })
            .addCase(createBank.rejected, (state, action) => {
                state.loading.create = false;
                state.error = action.payload;
                state.lastAction = "create";
            })

            // Fetch All Banks - simplified for all data
            .addCase(fetchAllBanks.pending, (state) => {
                state.loading.fetchAll = true;
                state.error = null;
            })
            .addCase(fetchAllBanks.fulfilled, (state, action) => {
                state.loading.fetchAll = false;
                state.banks = action.payload; // Direct assignment of banks array
                state.lastAction = "fetchAll";
                state.error = null;
            })
            .addCase(fetchAllBanks.rejected, (state, action) => {
                state.loading.fetchAll = false;
                state.error = action.payload;
                state.lastAction = "fetchAll";
            })

            // Fetch Bank by ID
            .addCase(fetchBankById.pending, (state) => {
                state.loading.fetchById = true;
                state.error = null;
            })
            .addCase(fetchBankById.fulfilled, (state, action) => {
                state.loading.fetchById = false;
                state.currentBank = action.payload;
                state.lastAction = "fetchById";
                state.error = null;
            })
            .addCase(fetchBankById.rejected, (state, action) => {
                state.loading.fetchById = false;
                state.error = action.payload;
                state.lastAction = "fetchById";
            })

            // Update Bank
            .addCase(updateBank.pending, (state) => {
                state.loading.update = true;
                state.error = null;
            })
            .addCase(updateBank.fulfilled, (state, action) => {
                state.loading.update = false;
                const updatedBank = action.payload;

                // Update in banks array
                const index = state.banks.findIndex(
                    (bank) => bank.id === updatedBank.id
                );
                if (index !== -1) {
                    state.banks[index] = updatedBank;
                }

                // Update current bank if it's the same
                if (
                    state.currentBank &&
                    state.currentBank.id === updatedBank.id
                ) {
                    state.currentBank = updatedBank;
                }

                state.lastAction = "update";
                state.error = null;
            })
            .addCase(updateBank.rejected, (state, action) => {
                state.loading.update = false;
                state.error = action.payload;
                state.lastAction = "update";
            })

            // Delete Bank
            .addCase(deleteBank.pending, (state) => {
                state.loading.delete = true;
                state.error = null;
            })
            .addCase(deleteBank.fulfilled, (state, action) => {
                state.loading.delete = false;
                const deletedId = action.payload;

                // Remove from banks array
                state.banks = state.banks.filter(
                    (bank) => bank.id !== deletedId
                );

                // Clear current bank if it was deleted
                if (state.currentBank && state.currentBank.id === deletedId) {
                    state.currentBank = null;
                }

                state.lastAction = "delete";
                state.error = null;
            })
            .addCase(deleteBank.rejected, (state, action) => {
                state.loading.delete = false;
                state.error = action.payload;
                state.lastAction = "delete";
            });
    },
});

// Export actions
export const {
    clearError,
    clearCurrentBank,
    resetBankState,
    setCurrentBank,
    updateBankInList,
    removeBankFromList,
    addBankToList,
} = bankSlice.actions;

// Selectors
export const selectBanks = (state) => state.banks.banks;
export const selectCurrentBank = (state) => state.banks.currentBank;
export const selectLoading = (state) => state.banks.loading;
export const selectError = (state) => state.banks.error;
export const selectLastAction = (state) => state.banks.lastAction;

// Complex selectors
export const selectIsLoading = (state) =>
    Object.values(state.banks.loading).some((loading) => loading);

export const selectBankById = (id) => (state) =>
    state.banks.banks.find((bank) => bank.id === id);

export const selectBanksByName = (name) => (state) =>
    state.banks.banks.filter((bank) =>
        bank.name.toLowerCase().includes(name.toLowerCase())
    );

// Export reducer
export default bankSlice.reducer;
