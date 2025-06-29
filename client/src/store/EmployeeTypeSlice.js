// employeeTypesSlice.js - Redux Toolkit slice for employee types management

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getEmployeeTypeService } from "../services/EmployeeTypeService";

const employeeTypeService = getEmployeeTypeService();

// ==============================
// Async Thunks
// ==============================

/**
 * Fetch all employee types
 */
export const fetchEmployeeTypes = createAsyncThunk(
    "employeeTypes/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await employeeTypeService.getAllEmployeeTypes();
            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to fetch employee types"
                );
            }
            return response;
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to fetch employee types"
            );
        }
    }
);

/**
 * Fetch single employee type by ID
 */
export const fetchEmployeeTypeById = createAsyncThunk(
    "employeeTypes/fetchById",
    async (employeeTypeId, { rejectWithValue }) => {
        try {
            const response = await employeeTypeService.getEmployeeTypeById(
                employeeTypeId
            );
            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to fetch employee type"
                );
            }
            return response;
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to fetch employee type"
            );
        }
    }
);

/**
 * Create new employee type
 */
export const createEmployeeType = createAsyncThunk(
    "employeeTypes/create",
    async (employeeTypeData, { rejectWithValue }) => {
        try {
            const response = await employeeTypeService.createEmployeeType(
                employeeTypeData
            );
            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to create employee type"
                );
            }
            return response;
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to create employee type"
            );
        }
    }
);

/**
 * Update existing employee type
 */
export const updateEmployeeType = createAsyncThunk(
    "employeeTypes/update",
    async ({ employeeTypeId, employeeTypeData }, { rejectWithValue }) => {
        try {
            const response = await employeeTypeService.updateEmployeeType(
                employeeTypeId,
                employeeTypeData
            );
            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to update employee type"
                );
            }
            return { ...response, id: employeeTypeId };
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to update employee type"
            );
        }
    }
);

/**
 * Delete employee type
 */
export const deleteEmployeeType = createAsyncThunk(
    "employeeTypes/delete",
    async (employeeTypeId, { rejectWithValue }) => {
        try {
            const response = await employeeTypeService.deleteEmployeeType(
                employeeTypeId
            );
            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to delete employee type"
                );
            }
            return { ...response, id: employeeTypeId };
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to delete employee type"
            );
        }
    }
);

/**
 * Search employee types by name
 */
export const searchEmployeeTypes = createAsyncThunk(
    "employeeTypes/search",
    async (searchTerm, { rejectWithValue }) => {
        try {
            const response = await employeeTypeService.searchEmployeeTypes(
                searchTerm
            );
            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to search employee types"
                );
            }
            return { ...response, searchTerm };
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to search employee types"
            );
        }
    }
);

/**
 * Check if employee type name exists
 */
export const checkNameExists = createAsyncThunk(
    "employeeTypes/checkNameExists",
    async ({ name, excludeId = null }, { rejectWithValue }) => {
        try {
            const exists = await employeeTypeService.isNameExists(
                name,
                excludeId
            );
            return { name, exists, excludeId };
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to check name existence"
            );
        }
    }
);

// ==============================
// Initial State
// ==============================

const initialState = {
    // Data
    items: [],
    currentItem: null,
    searchResults: [],

    // Loading states
    loading: {
        fetch: false,
        create: false,
        update: false,
        delete: false,
        search: false,
        checkName: false,
    },

    // Error states
    error: {
        fetch: null,
        create: null,
        update: null,
        delete: null,
        search: null,
        checkName: null,
    },

    // UI state
    searchTerm: "",
    lastFetch: null,
    nameExists: false,

    // Sorting
    sortBy: "created_at",
    sortOrder: "DESC",
};

// ==============================
// Slice Definition
// ==============================

const employeeTypesSlice = createSlice({
    name: "employeeTypes",
    initialState,
    reducers: {
        // Clear all errors
        clearErrors: (state) => {
            state.error = {
                fetch: null,
                create: null,
                update: null,
                delete: null,
                search: null,
                checkName: null,
            };
        },

        // Clear specific error
        clearError: (state, action) => {
            const errorType = action.payload;
            if (state.error.hasOwnProperty(errorType)) {
                state.error[errorType] = null;
            }
        },

        // Set current item
        setCurrentItem: (state, action) => {
            state.currentItem = action.payload;
        },

        // Clear current item
        clearCurrentItem: (state) => {
            state.currentItem = null;
        },

        // Set search term
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },

        // Clear search results
        clearSearchResults: (state) => {
            state.searchResults = [];
            state.searchTerm = "";
        },

        // Set sorting
        setSorting: (state, action) => {
            state.sortBy = action.payload.sortBy;
            state.sortOrder = action.payload.sortOrder;
        },

        // Reset state
        resetState: () => initialState,
    },

    extraReducers: (builder) => {
        // ==============================
        // Fetch All Employee Types
        // ==============================
        builder
            .addCase(fetchEmployeeTypes.pending, (state) => {
                state.loading.fetch = true;
                state.error.fetch = null;
            })
            .addCase(fetchEmployeeTypes.fulfilled, (state, action) => {
                state.loading.fetch = false;
                state.items = action.payload.data || [];
                state.lastFetch = new Date().toISOString();
            })
            .addCase(fetchEmployeeTypes.rejected, (state, action) => {
                state.loading.fetch = false;
                state.error.fetch = action.payload;
                state.items = [];
            });

        // ==============================
        // Fetch Employee Type By ID
        // ==============================
        builder
            .addCase(fetchEmployeeTypeById.pending, (state) => {
                state.loading.fetch = true;
                state.error.fetch = null;
            })
            .addCase(fetchEmployeeTypeById.fulfilled, (state, action) => {
                state.loading.fetch = false;
                state.currentItem = action.payload.data;
            })
            .addCase(fetchEmployeeTypeById.rejected, (state, action) => {
                state.loading.fetch = false;
                state.error.fetch = action.payload;
                state.currentItem = null;
            });

        // ==============================
        // Create Employee Type
        // ==============================
        builder
            .addCase(createEmployeeType.pending, (state) => {
                state.loading.create = true;
                state.error.create = null;
            })
            .addCase(createEmployeeType.fulfilled, (state, action) => {
                state.loading.create = false;
                if (action.payload.data) {
                    state.items.unshift(action.payload.data);
                }
            })
            .addCase(createEmployeeType.rejected, (state, action) => {
                state.loading.create = false;
                state.error.create = action.payload;
            });

        // ==============================
        // Update Employee Type
        // ==============================
        builder
            .addCase(updateEmployeeType.pending, (state) => {
                state.loading.update = true;
                state.error.update = null;
            })
            .addCase(updateEmployeeType.fulfilled, (state, action) => {
                state.loading.update = false;
                if (action.payload.data) {
                    const index = state.items.findIndex(
                        (item) => item.id === action.payload.id
                    );
                    if (index !== -1) {
                        state.items[index] = action.payload.data;
                    }
                    // Update current item if it's the same
                    if (
                        state.currentItem &&
                        state.currentItem.id === action.payload.id
                    ) {
                        state.currentItem = action.payload.data;
                    }
                }
            })
            .addCase(updateEmployeeType.rejected, (state, action) => {
                state.loading.update = false;
                state.error.update = action.payload;
            });

        // ==============================
        // Delete Employee Type
        // ==============================
        builder
            .addCase(deleteEmployeeType.pending, (state) => {
                state.loading.delete = true;
                state.error.delete = null;
            })
            .addCase(deleteEmployeeType.fulfilled, (state, action) => {
                state.loading.delete = false;
                state.items = state.items.filter(
                    (item) => item.id !== action.payload.id
                );
                // Clear current item if it's the deleted one
                if (
                    state.currentItem &&
                    state.currentItem.id === action.payload.id
                ) {
                    state.currentItem = null;
                }
            })
            .addCase(deleteEmployeeType.rejected, (state, action) => {
                state.loading.delete = false;
                state.error.delete = action.payload;
            });

        // ==============================
        // Search Employee Types
        // ==============================
        builder
            .addCase(searchEmployeeTypes.pending, (state) => {
                state.loading.search = true;
                state.error.search = null;
            })
            .addCase(searchEmployeeTypes.fulfilled, (state, action) => {
                state.loading.search = false;
                state.searchResults = action.payload.data || [];
                state.searchTerm = action.payload.searchTerm;
            })
            .addCase(searchEmployeeTypes.rejected, (state, action) => {
                state.loading.search = false;
                state.error.search = action.payload;
                state.searchResults = [];
            });

        // ==============================
        // Check Name Exists
        // ==============================
        builder
            .addCase(checkNameExists.pending, (state) => {
                state.loading.checkName = true;
                state.error.checkName = null;
            })
            .addCase(checkNameExists.fulfilled, (state, action) => {
                state.loading.checkName = false;
                state.nameExists = action.payload.exists;
            })
            .addCase(checkNameExists.rejected, (state, action) => {
                state.loading.checkName = false;
                state.error.checkName = action.payload;
                state.nameExists = false;
            });
    },
});

// ==============================
// Actions Export
// ==============================

export const {
    clearErrors,
    clearError,
    setCurrentItem,
    clearCurrentItem,
    setSearchTerm,
    clearSearchResults,
    setSorting,
    resetState,
} = employeeTypesSlice.actions;

// ==============================
// Selectors
// ==============================

export const selectEmployeeTypes = (state) => state.employeeTypes.items;
export const selectCurrentEmployeeType = (state) =>
    state.employeeTypes.currentItem;
export const selectSearchResults = (state) => state.employeeTypes.searchResults;
export const selectLoading = (state) => state.employeeTypes.loading;
export const selectErrors = (state) => state.employeeTypes.error;
export const selectSearchTerm = (state) => state.employeeTypes.searchTerm;
export const selectNameExists = (state) => state.employeeTypes.nameExists;
export const selectSorting = (state) => ({
    sortBy: state.employeeTypes.sortBy,
    sortOrder: state.employeeTypes.sortOrder,
});

// Computed selectors
export const selectIsLoading = (state) =>
    Object.values(state.employeeTypes.loading).some((loading) => loading);

export const selectHasErrors = (state) =>
    Object.values(state.employeeTypes.error).some((error) => error !== null);

export const selectEmployeeTypeById = (state, id) =>
    state.employeeTypes.items.find((item) => item.id === id);

export const selectFilteredEmployeeTypes = (state, searchTerm) => {
    if (!searchTerm) return state.employeeTypes.items;
    return state.employeeTypes.items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
};

// ==============================
// Reducer Export
// ==============================

export default employeeTypesSlice.reducer;
