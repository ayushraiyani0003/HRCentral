/**
 * @fileoverview Redux slice for Salutation state management
 * @version 1.0.0
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import SalutationService from "../services/SalutationService";

/**
 * Initial state for salutations
 */
const initialState = {
    // Data
    salutations: [],
    currentSalutation: null,

    // Pagination
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    },

    // Filters and sorting
    filters: {
        search: "",
        sortBy: "name",
        sortOrder: "asc",
    },

    // Loading states
    loading: {
        list: false,
        create: false,
        update: false,
        delete: false,
        single: false,
    },

    // Error states
    errors: {
        list: null,
        create: null,
        update: null,
        delete: null,
        single: null,
    },

    // UI states
    ui: {
        isModalOpen: false,
        selectedIds: [],
        lastUpdated: null,
    },
};

// Async Thunks

/**
 * Fetch all salutations with pagination and filters
 */
export const fetchSalutations = createAsyncThunk(
    "salutations/fetchAll",
    async (params = {}, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const { pagination, filters } = state.salutations;

            const queryParams = {
                page: params.page || pagination.page,
                limit: params.limit || pagination.limit,
                search:
                    params.search !== undefined
                        ? params.search
                        : filters.search,
                sortBy: params.sortBy || filters.sortBy,
                sortOrder: params.sortOrder || filters.sortOrder,
                ...params,
            };

            const response = await SalutationService.getAllSalutations(
                queryParams
            );
            return {
                data: response.data || response,
                pagination: response.pagination || {
                    page: queryParams.page,
                    limit: queryParams.limit,
                    total: response.data?.length || 0,
                    totalPages: Math.ceil(
                        (response.data?.length || 0) / queryParams.limit
                    ),
                },
                filters: {
                    search: queryParams.search,
                    sortBy: queryParams.sortBy,
                    sortOrder: queryParams.sortOrder,
                },
            };
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                status: error.status,
                data: error.data,
            });
        }
    }
);

/**
 * Fetch a single salutation by ID
 */
export const fetchSalutationById = createAsyncThunk(
    "salutations/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await SalutationService.getSalutationById(id);
            return response;
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                status: error.status,
                data: error.data,
            });
        }
    }
);

/**
 * Create a new salutation
 */
export const createSalutation = createAsyncThunk(
    "salutations/create",
    async (salutationData, { rejectWithValue, dispatch }) => {
        try {
            // Validate data before sending
            const validation =
                SalutationService.validateSalutationData(salutationData);
            if (!validation.isValid) {
                return rejectWithValue({
                    message: "Validation failed",
                    errors: validation.errors,
                });
            }

            const response = await SalutationService.createSalutation(
                salutationData
            );

            // Refresh the list after creation
            dispatch(fetchSalutations({}));

            return response;
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                status: error.status,
                data: error.data,
            });
        }
    }
);

/**
 * Update an existing salutation
 */
export const updateSalutation = createAsyncThunk(
    "salutations/update",
    async ({ id, salutationData }, { rejectWithValue, dispatch }) => {
        try {
            // Validate data before sending
            const validation =
                SalutationService.validateSalutationData(salutationData);
            if (!validation.isValid) {
                return rejectWithValue({
                    message: "Validation failed",
                    errors: validation.errors,
                });
            }

            const response = await SalutationService.updateSalutation(
                id,
                salutationData
            );

            // Refresh the list after update
            dispatch(fetchSalutations({}));

            return response;
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                status: error.status,
                data: error.data,
            });
        }
    }
);

/**
 * Delete a salutation
 */
export const deleteSalutation = createAsyncThunk(
    "salutations/delete",
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const response = await SalutationService.deleteSalutation(id);

            // Refresh the list after deletion
            dispatch(fetchSalutations({}));

            return { id, ...response };
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                status: error.status,
                data: error.data,
            });
        }
    }
);

/**
 * Check if salutation name exists
 */
export const checkSalutationExists = createAsyncThunk(
    "salutations/checkExists",
    async (name, { rejectWithValue }) => {
        try {
            const exists = await SalutationService.checkSalutationExists(name);
            return { name, exists };
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                status: error.status,
                data: error.data,
            });
        }
    }
);

// Slice
const salutationSlice = createSlice({
    name: "salutations",
    initialState,
    reducers: {
        // UI Actions
        setModalOpen: (state, action) => {
            state.ui.isModalOpen = action.payload;
        },

        setSelectedIds: (state, action) => {
            state.ui.selectedIds = action.payload;
        },

        toggleSelectId: (state, action) => {
            const id = action.payload;
            const index = state.ui.selectedIds.indexOf(id);
            if (index > -1) {
                state.ui.selectedIds.splice(index, 1);
            } else {
                state.ui.selectedIds.push(id);
            }
        },

        selectAllIds: (state) => {
            state.ui.selectedIds = state.salutations.map(
                (salutation) => salutation.id
            );
        },

        clearSelectedIds: (state) => {
            state.ui.selectedIds = [];
        },

        // Filter Actions
        setSearch: (state, action) => {
            state.filters.search = action.payload;
        },

        setSortBy: (state, action) => {
            state.filters.sortBy = action.payload;
        },

        setSortOrder: (state, action) => {
            state.filters.sortOrder = action.payload;
        },

        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },

        resetFilters: (state) => {
            state.filters = initialState.filters;
        },

        // Pagination Actions
        setPage: (state, action) => {
            state.pagination.page = action.payload;
        },

        setLimit: (state, action) => {
            state.pagination.limit = action.payload;
        },

        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },

        // Data Actions
        setCurrentSalutation: (state, action) => {
            state.currentSalutation = action.payload;
        },

        clearCurrentSalutation: (state) => {
            state.currentSalutation = null;
        },

        // Error Actions
        clearErrors: (state) => {
            state.errors = initialState.errors;
        },

        clearError: (state, action) => {
            const errorType = action.payload;
            if (state.errors[errorType]) {
                state.errors[errorType] = null;
            }
        },

        // Reset Actions
        resetState: () => initialState,

        resetUI: (state) => {
            state.ui = initialState.ui;
        },
    },
    extraReducers: (builder) => {
        // Fetch All Salutations
        builder
            .addCase(fetchSalutations.pending, (state) => {
                state.loading.list = true;
                state.errors.list = null;
            })
            .addCase(fetchSalutations.fulfilled, (state, action) => {
                state.loading.list = false;
                state.salutations = action.payload.data;
                state.pagination = action.payload.pagination;
                state.filters = action.payload.filters;
                state.ui.lastUpdated = new Date().toISOString();
            })
            .addCase(fetchSalutations.rejected, (state, action) => {
                state.loading.list = false;
                state.errors.list = action.payload;
            });

        // Fetch Single Salutation
        builder
            .addCase(fetchSalutationById.pending, (state) => {
                state.loading.single = true;
                state.errors.single = null;
            })
            .addCase(fetchSalutationById.fulfilled, (state, action) => {
                state.loading.single = false;
                state.currentSalutation = action.payload;
            })
            .addCase(fetchSalutationById.rejected, (state, action) => {
                state.loading.single = false;
                state.errors.single = action.payload;
            });

        // Create Salutation
        builder
            .addCase(createSalutation.pending, (state) => {
                state.loading.create = true;
                state.errors.create = null;
            })
            .addCase(createSalutation.fulfilled, (state, action) => {
                state.loading.create = false;
                state.ui.isModalOpen = false;
            })
            .addCase(createSalutation.rejected, (state, action) => {
                state.loading.create = false;
                state.errors.create = action.payload;
            });

        // Update Salutation
        builder
            .addCase(updateSalutation.pending, (state) => {
                state.loading.update = true;
                state.errors.update = null;
            })
            .addCase(updateSalutation.fulfilled, (state, action) => {
                state.loading.update = false;
                state.currentSalutation = action.payload;
                state.ui.isModalOpen = false;
            })
            .addCase(updateSalutation.rejected, (state, action) => {
                state.loading.update = false;
                state.errors.update = action.payload;
            });

        // Delete Salutation
        builder
            .addCase(deleteSalutation.pending, (state) => {
                state.loading.delete = true;
                state.errors.delete = null;
            })
            .addCase(deleteSalutation.fulfilled, (state, action) => {
                state.loading.delete = false;
                // Remove deleted ID from selected IDs
                state.ui.selectedIds = state.ui.selectedIds.filter(
                    (id) => id !== action.payload.id
                );
            })
            .addCase(deleteSalutation.rejected, (state, action) => {
                state.loading.delete = false;
                state.errors.delete = action.payload;
            });

        // Check Salutation Exists
        builder.addCase(checkSalutationExists.fulfilled, (state, action) => {
            // This can be used for real-time validation feedback
            // You might want to store this in a separate validation state
        });
    },
});

// Export actions
export const {
    setModalOpen,
    setSelectedIds,
    toggleSelectId,
    selectAllIds,
    clearSelectedIds,
    setSearch,
    setSortBy,
    setSortOrder,
    setFilters,
    resetFilters,
    setPage,
    setLimit,
    setPagination,
    setCurrentSalutation,
    clearCurrentSalutation,
    clearErrors,
    clearError,
    resetState,
    resetUI,
} = salutationSlice.actions;

// Selectors
export const selectSalutations = (state) => state.salutations.salutations;
export const selectCurrentSalutation = (state) =>
    state.salutations.currentSalutation;
export const selectPagination = (state) => state.salutations.pagination;
export const selectFilters = (state) => state.salutations.filters;
export const selectLoading = (state) => state.salutations.loading;
export const selectErrors = (state) => state.salutations.errors;
export const selectUI = (state) => state.salutations.ui;
export const selectSelectedIds = (state) => state.salutations.ui.selectedIds;
export const selectIsLoading = (state) =>
    Object.values(state.salutations.loading).some(Boolean);

// Complex selectors
export const selectFilteredSalutations = (state) => {
    const { salutations, filters } = state.salutations;
    if (!filters.search) return salutations;

    return salutations.filter((salutation) =>
        salutation.name.toLowerCase().includes(filters.search.toLowerCase())
    );
};

export const selectHasErrors = (state) =>
    Object.values(state.salutations.errors).some((error) => error !== null);

export const selectTotalSelected = (state) =>
    state.salutations.ui.selectedIds.length;

export default salutationSlice.reducer;
