/**
 * @fileoverview Redux Toolkit slice for WorkShift operations
 * @version 1.0.0
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getWorkShiftService } from "../services/WorkShiftService"; // Adjust import path as needed

const workShiftService = getWorkShiftService();

// Async Thunks
/**
 * Create a new work shift
 */
export const createWorkShift = createAsyncThunk(
    "workShift/create",
    async (shiftData, { rejectWithValue }) => {
        try {
            const response = await workShiftService.create(shiftData);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Fetch all work shifts with optional query parameters
 */
export const fetchWorkShifts = createAsyncThunk(
    "workShift/fetchAll",
    async (queryParams = {}, { rejectWithValue }) => {
        try {
            const response = await workShiftService.getAll(queryParams);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Fetch work shift by ID
 */
export const fetchWorkShiftById = createAsyncThunk(
    "workShift/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await workShiftService.getById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Update work shift by ID
 */
export const updateWorkShift = createAsyncThunk(
    "workShift/update",
    async ({ id, updateData }, { rejectWithValue }) => {
        try {
            const response = await workShiftService.update(id, updateData);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Delete work shift by ID
 */
export const deleteWorkShift = createAsyncThunk(
    "workShift/delete",
    async (id, { rejectWithValue }) => {
        try {
            const response = await workShiftService.delete(id);
            return { id, ...response };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Check if shift exists by name
 */
export const checkShiftExists = createAsyncThunk(
    "workShift/checkExists",
    async ({ name, excludeId = null }, { rejectWithValue }) => {
        try {
            const exists = await workShiftService.checkIfExists(
                name,
                excludeId
            );
            return { name, excludeId, exists };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Search work shifts
 */
export const searchWorkShifts = createAsyncThunk(
    "workShift/search",
    async (searchTerm, { rejectWithValue }) => {
        try {
            const response = await workShiftService.search(searchTerm);
            return { ...response, searchTerm };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Initial State
const initialState = {
    shifts: [],
    currentShift: null,
    searchResults: [],
    searchTerm: "",
    existsCheck: {
        name: "",
        exists: false,
        checking: false,
    },
    loading: {
        fetchAll: false,
        fetchById: false,
        create: false,
        update: false,
        delete: false,
        search: false,
        checkExists: false,
    },
    error: {
        fetchAll: null,
        fetchById: null,
        create: null,
        update: null,
        delete: null,
        search: null,
        checkExists: null,
    },
    lastUpdated: null,
};

// Slice
const workShiftSlice = createSlice({
    name: "workShift",
    initialState,
    reducers: {
        // Clear errors
        clearErrors: (state) => {
            state.error = {
                fetchAll: null,
                fetchById: null,
                create: null,
                update: null,
                delete: null,
                search: null,
                checkExists: null,
            };
        },

        // Clear current shift
        clearCurrentShift: (state) => {
            state.currentShift = null;
        },

        // Clear search results
        clearSearchResults: (state) => {
            state.searchResults = [];
            state.searchTerm = "";
        },

        // Reset exists check
        resetExistsCheck: (state) => {
            state.existsCheck = {
                name: "",
                exists: false,
                checking: false,
            };
        },

        // Reset state
        resetWorkShiftState: (state) => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Work Shift
            .addCase(createWorkShift.pending, (state) => {
                state.loading.create = true;
                state.error.create = null;
            })
            .addCase(createWorkShift.fulfilled, (state, action) => {
                state.loading.create = false;
                if (action.payload?.success && action.payload?.data) {
                    // Handle potential nested structure for single item
                    const shiftData =
                        action.payload.data.workShift || action.payload.data;
                    state.shifts.unshift(shiftData);
                    state.lastUpdated = new Date().toISOString();
                }
            })
            .addCase(createWorkShift.rejected, (state, action) => {
                state.loading.create = false;
                state.error.create = action.payload;
            })

            // Fetch All Work Shifts
            .addCase(fetchWorkShifts.pending, (state) => {
                state.loading.fetchAll = true;
                state.error.fetchAll = null;
            })
            .addCase(fetchWorkShifts.fulfilled, (state, action) => {
                state.loading.fetchAll = false;
                if (action.payload?.success && action.payload?.data) {
                    // Handle nested data structure - extract workShifts array
                    const workShiftsData =
                        action.payload.data.workShifts || action.payload.data;
                    state.shifts = Array.isArray(workShiftsData)
                        ? workShiftsData
                        : [];
                    state.lastUpdated = new Date().toISOString();
                }
            })
            .addCase(fetchWorkShifts.rejected, (state, action) => {
                state.loading.fetchAll = false;
                state.error.fetchAll = action.payload;
            })

            // Fetch Work Shift By ID
            .addCase(fetchWorkShiftById.pending, (state) => {
                state.loading.fetchById = true;
                state.error.fetchById = null;
            })
            .addCase(fetchWorkShiftById.fulfilled, (state, action) => {
                state.loading.fetchById = false;
                if (action.payload?.success && action.payload?.data) {
                    // Handle potential nested structure for single item
                    const shiftData =
                        action.payload.data.workShift || action.payload.data;
                    state.currentShift = shiftData;
                }
            })
            .addCase(fetchWorkShiftById.rejected, (state, action) => {
                state.loading.fetchById = false;
                state.error.fetchById = action.payload;
            })

            // Update Work Shift
            .addCase(updateWorkShift.pending, (state) => {
                state.loading.update = true;
                state.error.update = null;
            })
            .addCase(updateWorkShift.fulfilled, (state, action) => {
                state.loading.update = false;
                if (action.payload?.success && action.payload?.data) {
                    // Handle potential nested structure for single item
                    const shiftData =
                        action.payload.data.workShift || action.payload.data;
                    const index = state.shifts.findIndex(
                        (shift) => shift.id === shiftData.id
                    );
                    if (index !== -1) {
                        state.shifts[index] = shiftData;
                    }
                    if (
                        state.currentShift &&
                        state.currentShift.id === shiftData.id
                    ) {
                        state.currentShift = shiftData;
                    }
                    state.lastUpdated = new Date().toISOString();
                }
            })
            .addCase(updateWorkShift.rejected, (state, action) => {
                state.loading.update = false;
                state.error.update = action.payload;
            })

            // Delete Work Shift
            .addCase(deleteWorkShift.pending, (state) => {
                state.loading.delete = true;
                state.error.delete = null;
            })
            .addCase(deleteWorkShift.fulfilled, (state, action) => {
                state.loading.delete = false;
                if (action.payload?.success) {
                    state.shifts = state.shifts.filter(
                        (shift) => shift.id !== action.payload.id
                    );
                    if (
                        state.currentShift &&
                        state.currentShift.id === action.payload.id
                    ) {
                        state.currentShift = null;
                    }
                    state.lastUpdated = new Date().toISOString();
                }
            })
            .addCase(deleteWorkShift.rejected, (state, action) => {
                state.loading.delete = false;
                state.error.delete = action.payload;
            })

            // Check Shift Exists
            .addCase(checkShiftExists.pending, (state) => {
                state.loading.checkExists = true;
                state.error.checkExists = null;
                state.existsCheck.checking = true;
            })
            .addCase(checkShiftExists.fulfilled, (state, action) => {
                state.loading.checkExists = false;
                state.existsCheck = {
                    name: action.payload.name,
                    exists: action.payload.exists,
                    checking: false,
                };
            })
            .addCase(checkShiftExists.rejected, (state, action) => {
                state.loading.checkExists = false;
                state.error.checkExists = action.payload;
                state.existsCheck.checking = false;
            })

            // Search Work Shifts
            .addCase(searchWorkShifts.pending, (state) => {
                state.loading.search = true;
                state.error.search = null;
            })
            .addCase(searchWorkShifts.fulfilled, (state, action) => {
                state.loading.search = false;
                if (action.payload?.success && action.payload?.data) {
                    // Handle nested data structure for search results
                    const searchData =
                        action.payload.data.workShifts || action.payload.data;
                    state.searchResults = Array.isArray(searchData)
                        ? searchData
                        : [];
                    state.searchTerm = action.payload.searchTerm;
                }
            })
            .addCase(searchWorkShifts.rejected, (state, action) => {
                state.loading.search = false;
                state.error.search = action.payload;
            });
    },
});

// Export actions
export const {
    clearErrors,
    clearCurrentShift,
    clearSearchResults,
    resetExistsCheck,
    resetWorkShiftState,
} = workShiftSlice.actions;

// FIXED SELECTORS - Added null safety checks
export const selectWorkShifts = (state) => state.workShift?.shifts || [];
export const selectCurrentWorkShift = (state) =>
    state.workShift?.currentShift || null;
export const selectWorkShiftLoading = (state) => state.workShift?.loading || {};
export const selectWorkShiftErrors = (state) => state.workShift?.error || {};
export const selectSearchResults = (state) =>
    state.workShift?.searchResults || [];
export const selectSearchTerm = (state) => state.workShift?.searchTerm || "";
export const selectExistsCheck = (state) =>
    state.workShift?.existsCheck || {
        name: "",
        exists: false,
        checking: false,
    };
export const selectLastUpdated = (state) =>
    state.workShift?.lastUpdated || null;

// Computed selectors
export const selectIsAnyLoading = (state) =>
    Object.values(state.workShift?.loading || {}).some((loading) => loading);

export const selectHasAnyError = (state) =>
    Object.values(state.workShift?.error || {}).some((error) => error !== null);

export const selectWorkShiftById = (id) => (state) =>
    state.workShift?.shifts?.find((shift) => shift.id === id) || null;

export default workShiftSlice.reducer;
