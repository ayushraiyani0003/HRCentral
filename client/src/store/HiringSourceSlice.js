// HiringSourceSlice.js - Redux Toolkit slice for hiring source management

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getHiringSourceService } from "../services/HiringSourceService";

const hiringSourceService = getHiringSourceService();

// ==============================
// Initial State
// ==============================

const initialState = {
    // Data
    hiringSources: [],
    currentHiringSource: null,
    searchResults: [],

    // Loading states
    loading: {
        fetchAll: false,
        fetchById: false,
        create: false,
        update: false,
        delete: false,
        search: false,
    },

    // Error states
    errors: {
        fetchAll: null,
        fetchById: null,
        create: null,
        update: null,
        delete: null,
        search: null,
    },

    // UI state
    searchTerm: "",
};

// ==============================
// Async Thunks
// ==============================

/**
 * Fetch all hiring sources with optional parameters
 */
export const fetchAllHiringSources = createAsyncThunk(
    "hiringSource/fetchAll",
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await hiringSourceService.getAllHiringSources(
                params
            );

            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to fetch hiring sources"
                );
            }

            // Extract the hiringSources array from the response data
            const hiringSources =
                response.data?.hiringSources || response.data || [];

            return {
                data: hiringSources,
                message: response.message,
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Fetch hiring source by ID
 */
export const fetchHiringSourceById = createAsyncThunk(
    "hiringSource/fetchById",
    async (hiringSourceId, { rejectWithValue }) => {
        try {
            const response = await hiringSourceService.getHiringSourceById(
                hiringSourceId
            );

            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to fetch hiring source"
                );
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Create new hiring source
 */
export const createHiringSource = createAsyncThunk(
    "hiringSource/create",
    async (hiringSourceData, { rejectWithValue }) => {
        try {
            const response = await hiringSourceService.createHiringSource(
                hiringSourceData
            );

            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to create hiring source"
                );
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Update existing hiring source
 */
export const updateHiringSource = createAsyncThunk(
    "hiringSource/update",
    async ({ hiringSourceId, hiringSourceData }, { rejectWithValue }) => {
        try {
            const response = await hiringSourceService.updateHiringSource(
                hiringSourceId,
                hiringSourceData
            );

            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to update hiring source"
                );
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Delete hiring source
 */
export const deleteHiringSource = createAsyncThunk(
    "hiringSource/delete",
    async (hiringSourceId, { rejectWithValue }) => {
        try {
            const response = await hiringSourceService.deleteHiringSource(
                hiringSourceId
            );

            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to delete hiring source"
                );
            }

            return { hiringSourceId, message: response.message };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Search hiring sources by name
 */
export const searchHiringSourcesByName = createAsyncThunk(
    "hiringSource/searchByName",
    async (searchTerm, { rejectWithValue }) => {
        try {
            const response =
                await hiringSourceService.searchHiringSourcesByName(searchTerm);

            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to search hiring sources"
                );
            }

            // Extract the hiringSources array from the response data
            const hiringSources =
                response.data?.hiringSources || response.data || [];

            return {
                data: hiringSources,
                searchTerm,
                message: response.message,
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// ==============================
// Slice Definition
// ==============================

const hiringSourceSlice = createSlice({
    name: "hiringSource",
    initialState,
    reducers: {
        // Clear current hiring source
        clearCurrentHiringSource: (state) => {
            state.currentHiringSource = null;
            state.errors.fetchById = null;
        },

        // Clear search results
        clearSearchResults: (state) => {
            state.searchResults = [];
            state.searchTerm = "";
            state.errors.search = null;
        },

        // Update search term
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },

        // Clear all errors
        clearErrors: (state) => {
            state.errors = {
                fetchAll: null,
                fetchById: null,
                create: null,
                update: null,
                delete: null,
                search: null,
            };
        },

        // Clear specific error
        clearError: (state, action) => {
            const errorType = action.payload;
            if (state.errors.hasOwnProperty(errorType)) {
                state.errors[errorType] = null;
            }
        },

        // Reset state
        resetState: () => initialState,
    },
    extraReducers: (builder) => {
        // Fetch All Hiring Sources
        builder
            .addCase(fetchAllHiringSources.pending, (state) => {
                state.loading.fetchAll = true;
                state.errors.fetchAll = null;
            })
            .addCase(fetchAllHiringSources.fulfilled, (state, action) => {
                state.loading.fetchAll = false;
                state.hiringSources = action.payload.data;
                state.errors.fetchAll = null;
            })
            .addCase(fetchAllHiringSources.rejected, (state, action) => {
                state.loading.fetchAll = false;
                state.errors.fetchAll = action.payload;
            });

        // Fetch Hiring Source By ID
        builder
            .addCase(fetchHiringSourceById.pending, (state) => {
                state.loading.fetchById = true;
                state.errors.fetchById = null;
            })
            .addCase(fetchHiringSourceById.fulfilled, (state, action) => {
                state.loading.fetchById = false;
                state.currentHiringSource = action.payload;
                state.errors.fetchById = null;
            })
            .addCase(fetchHiringSourceById.rejected, (state, action) => {
                state.loading.fetchById = false;
                state.errors.fetchById = action.payload;
                state.currentHiringSource = null;
            });

        // Create Hiring Source
        builder
            .addCase(createHiringSource.pending, (state) => {
                state.loading.create = true;
                state.errors.create = null;
            })
            .addCase(createHiringSource.fulfilled, (state, action) => {
                state.loading.create = false;
                state.hiringSources.unshift(action.payload); // Add to beginning of array
                state.errors.create = null;
            })
            .addCase(createHiringSource.rejected, (state, action) => {
                state.loading.create = false;
                state.errors.create = action.payload;
            });

        // Update Hiring Source
        builder
            .addCase(updateHiringSource.pending, (state) => {
                state.loading.update = true;
                state.errors.update = null;
            })
            .addCase(updateHiringSource.fulfilled, (state, action) => {
                state.loading.update = false;
                const updatedHiringSource = action.payload;

                // Update in hiringSources array
                const index = state.hiringSources.findIndex(
                    (source) => source.id === updatedHiringSource.id
                );
                if (index !== -1) {
                    state.hiringSources[index] = updatedHiringSource;
                }

                // Update current hiring source if it's the same one
                if (state.currentHiringSource?.id === updatedHiringSource.id) {
                    state.currentHiringSource = updatedHiringSource;
                }

                state.errors.update = null;
            })
            .addCase(updateHiringSource.rejected, (state, action) => {
                state.loading.update = false;
                state.errors.update = action.payload;
            });

        // Delete Hiring Source
        builder
            .addCase(deleteHiringSource.pending, (state) => {
                state.loading.delete = true;
                state.errors.delete = null;
            })
            .addCase(deleteHiringSource.fulfilled, (state, action) => {
                state.loading.delete = false;
                const { hiringSourceId } = action.payload;

                // Remove from hiringSources array
                state.hiringSources = state.hiringSources.filter(
                    (source) => source.id !== hiringSourceId
                );

                // Clear current hiring source if it's the deleted one
                if (state.currentHiringSource?.id === hiringSourceId) {
                    state.currentHiringSource = null;
                }

                state.errors.delete = null;
            })
            .addCase(deleteHiringSource.rejected, (state, action) => {
                state.loading.delete = false;
                state.errors.delete = action.payload;
            });

        // Search Hiring Sources By Name
        builder
            .addCase(searchHiringSourcesByName.pending, (state) => {
                state.loading.search = true;
                state.errors.search = null;
            })
            .addCase(searchHiringSourcesByName.fulfilled, (state, action) => {
                state.loading.search = false;
                state.searchResults = action.payload.data;
                state.searchTerm = action.payload.searchTerm;
                state.errors.search = null;
            })
            .addCase(searchHiringSourcesByName.rejected, (state, action) => {
                state.loading.search = false;
                state.errors.search = action.payload;
                state.searchResults = [];
            });
    },
});

// ==============================
// Actions Export
// ==============================

export const {
    clearCurrentHiringSource,
    clearSearchResults,
    setSearchTerm,
    clearErrors,
    clearError,
    resetState,
} = hiringSourceSlice.actions;

// ==============================
// Selectors
// ==============================

export const selectHiringSources = (state) => state.hiringSource.hiringSources;
export const selectCurrentHiringSource = (state) =>
    state.hiringSource.currentHiringSource;
export const selectSearchResults = (state) => state.hiringSource.searchResults;
export const selectLoading = (state) => state.hiringSource.loading;
export const selectErrors = (state) => state.hiringSource.errors;
export const selectSearchTerm = (state) => state.hiringSource.searchTerm;

// Specific loading selectors
export const selectIsLoadingFetchAll = (state) =>
    state.hiringSource.loading.fetchAll;
export const selectIsLoadingCreate = (state) =>
    state.hiringSource.loading.create;
export const selectIsLoadingUpdate = (state) =>
    state.hiringSource.loading.update;
export const selectIsLoadingDelete = (state) =>
    state.hiringSource.loading.delete;
export const selectIsLoadingSearch = (state) =>
    state.hiringSource.loading.search;

// Specific error selectors
export const selectFetchAllError = (state) =>
    state.hiringSource.errors.fetchAll;
export const selectCreateError = (state) => state.hiringSource.errors.create;
export const selectUpdateError = (state) => state.hiringSource.errors.update;
export const selectDeleteError = (state) => state.hiringSource.errors.delete;
export const selectSearchError = (state) => state.hiringSource.errors.search;

// Combined selectors
export const selectIsAnyLoading = (state) => {
    const loading = state.hiringSource.loading;
    return Object.values(loading).some((isLoading) => isLoading);
};

export const selectHasAnyError = (state) => {
    const errors = state.hiringSource.errors;
    return Object.values(errors).some((error) => error !== null);
};

// Export reducer
export default hiringSourceSlice.reducer;
