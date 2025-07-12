// JobLocationTypeSlice.js - Redux Toolkit slice for job location types management

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getJobLocationTypeService } from "../services/JobLocationTypeService";

const jobLocationTypeService = getJobLocationTypeService();

// ==============================
// Async Thunks
// ==============================

/**
 * Fetch all job location types with optional filtering
 */
export const fetchJobLocationTypes = createAsyncThunk(
    "jobLocationTypes/fetchJobLocationTypes",
    async (params = {}, { rejectWithValue }) => {
        try {
            const response =
                await jobLocationTypeService.getAllJobLocationTypes(params);

            if (!response.success) {
                return rejectWithValue(response.error);
            }

            // Fix: Extract the actual array from the nested structure
            const jobLocationTypes =
                response.data?.jobLocations || response.data || [];

            return {
                jobLocationTypes,
                message: response.message,
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Fetch a single job location type by ID
 */
export const fetchJobLocationTypeById = createAsyncThunk(
    "jobLocationTypes/fetchJobLocationTypeById",
    async (jobLocationTypeId, { rejectWithValue }) => {
        try {
            const response =
                await jobLocationTypeService.getJobLocationTypeById(
                    jobLocationTypeId
                );

            if (!response.success) {
                return rejectWithValue(response.error);
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Create a new job location type
 */
export const createJobLocationType = createAsyncThunk(
    "jobLocationTypes/createJobLocationType",
    async (jobLocationTypeData, { rejectWithValue }) => {
        try {
            const response = await jobLocationTypeService.createJobLocationType(
                jobLocationTypeData
            );

            if (!response.success) {
                return rejectWithValue(response.error);
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Update an existing job location type
 */
export const updateJobLocationType = createAsyncThunk(
    "jobLocationTypes/updateJobLocationType",
    async ({ jobLocationTypeId, jobLocationTypeData }, { rejectWithValue }) => {
        try {
            const response = await jobLocationTypeService.updateJobLocationType(
                jobLocationTypeId,
                jobLocationTypeData
            );

            if (!response.success) {
                return rejectWithValue(response.error);
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Delete a job location type
 */
export const deleteJobLocationType = createAsyncThunk(
    "jobLocationTypes/deleteJobLocationType",
    async (jobLocationTypeId, { rejectWithValue }) => {
        try {
            const response = await jobLocationTypeService.deleteJobLocationType(
                jobLocationTypeId
            );

            if (!response.success) {
                return rejectWithValue(response.error);
            }

            return { jobLocationTypeId, message: response.message };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Search job location types by term
 */
export const searchJobLocationTypes = createAsyncThunk(
    "jobLocationTypes/searchJobLocationTypes",
    async (searchTerm, { rejectWithValue }) => {
        try {
            const response =
                await jobLocationTypeService.searchJobLocationTypes(searchTerm);

            if (!response.success) {
                return rejectWithValue(response.error);
            }

            // Fix: Extract the actual array from the nested structure
            const jobLocationTypes =
                response.data?.jobLocations || response.data || [];

            return {
                jobLocationTypes,
                searchTerm,
                message: response.message,
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// ==============================
// Initial State
// ==============================

const initialState = {
    // Data - Fix: Direct array instead of nested object
    jobLocationTypes: [],
    selectedJobLocationType: null,

    // Loading states
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    searching: false,

    // Error states
    error: null,
    createError: null,
    updateError: null,
    deleteError: null,
    searchError: null,

    // UI state
    searchTerm: "",
    searchResults: [],

    // Messages
    message: null,

    // Last updated timestamp
    lastUpdated: null,
};

// ==============================
// Job Location Types Slice
// ==============================

const jobLocationTypesSlice = createSlice({
    name: "jobLocationTypes",
    initialState,
    reducers: {
        // Clear all errors
        clearErrors: (state) => {
            state.error = null;
            state.createError = null;
            state.updateError = null;
            state.deleteError = null;
            state.searchError = null;
        },

        // Clear specific error
        clearError: (state, action) => {
            const errorType = action.payload;
            if (state.hasOwnProperty(errorType)) {
                state[errorType] = null;
            }
        },

        // Clear message
        clearMessage: (state) => {
            state.message = null;
        },

        // Set selected job location type
        setSelectedJobLocationType: (state, action) => {
            state.selectedJobLocationType = action.payload;
        },

        // Clear selected job location type
        clearSelectedJobLocationType: (state) => {
            state.selectedJobLocationType = null;
        },

        // Set search term
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },

        // Clear search
        clearSearch: (state) => {
            state.searchTerm = "";
            state.searchResults = [];
            state.searchError = null;
        },

        // Reset entire state
        resetJobLocationTypesState: () => initialState,
    },

    extraReducers: (builder) => {
        // ==============================
        // Fetch Job Location Types
        // ==============================
        builder
            .addCase(fetchJobLocationTypes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJobLocationTypes.fulfilled, (state, action) => {
                state.loading = false;
                // Fix: Direct assignment of array
                state.jobLocationTypes = action.payload.jobLocationTypes;
                state.message = action.payload.message;
                state.lastUpdated = Date.now();
            })
            .addCase(fetchJobLocationTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ==============================
            // Fetch Job Location Type by ID
            // ==============================
            .addCase(fetchJobLocationTypeById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJobLocationTypeById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedJobLocationType = action.payload;
                state.lastUpdated = Date.now();
            })
            .addCase(fetchJobLocationTypeById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ==============================
            // Create Job Location Type
            // ==============================
            .addCase(createJobLocationType.pending, (state) => {
                state.creating = true;
                state.createError = null;
            })
            .addCase(createJobLocationType.fulfilled, (state, action) => {
                state.creating = false;
                state.jobLocationTypes.unshift(action.payload); // Add to beginning of array
                state.message = "Job location type created successfully";
                state.lastUpdated = Date.now();
            })
            .addCase(createJobLocationType.rejected, (state, action) => {
                state.creating = false;
                state.createError = action.payload;
            })

            // ==============================
            // Update Job Location Type
            // ==============================
            .addCase(updateJobLocationType.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(updateJobLocationType.fulfilled, (state, action) => {
                state.updating = false;
                const updatedJobLocationType = action.payload;

                // Update in job location types array
                const index = state.jobLocationTypes.findIndex(
                    (jobLocationType) =>
                        jobLocationType.id === updatedJobLocationType.id
                );
                if (index !== -1) {
                    state.jobLocationTypes[index] = updatedJobLocationType;
                }

                // Update selected job location type if it's the same one
                if (
                    state.selectedJobLocationType &&
                    state.selectedJobLocationType.id ===
                        updatedJobLocationType.id
                ) {
                    state.selectedJobLocationType = updatedJobLocationType;
                }

                state.message = "Job location type updated successfully";
                state.lastUpdated = Date.now();
            })
            .addCase(updateJobLocationType.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload;
            })

            // ==============================
            // Delete Job Location Type
            // ==============================
            .addCase(deleteJobLocationType.pending, (state) => {
                state.deleting = true;
                state.deleteError = null;
            })
            .addCase(deleteJobLocationType.fulfilled, (state, action) => {
                state.deleting = false;
                const { jobLocationTypeId } = action.payload;

                // Remove from job location types array
                state.jobLocationTypes = state.jobLocationTypes.filter(
                    (jobLocationType) =>
                        jobLocationType.id !== jobLocationTypeId
                );

                // Clear selected job location type if it was deleted
                if (
                    state.selectedJobLocationType &&
                    state.selectedJobLocationType.id === jobLocationTypeId
                ) {
                    state.selectedJobLocationType = null;
                }

                state.message =
                    action.payload.message ||
                    "Job location type deleted successfully";
                state.lastUpdated = Date.now();
            })
            .addCase(deleteJobLocationType.rejected, (state, action) => {
                state.deleting = false;
                state.deleteError = action.payload;
            })

            // ==============================
            // Search Job Location Types
            // ==============================
            .addCase(searchJobLocationTypes.pending, (state) => {
                state.searching = true;
                state.searchError = null;
            })
            .addCase(searchJobLocationTypes.fulfilled, (state, action) => {
                state.searching = false;
                state.searchResults = action.payload.jobLocationTypes;
                state.searchTerm = action.payload.searchTerm;
                state.message = action.payload.message;
            })
            .addCase(searchJobLocationTypes.rejected, (state, action) => {
                state.searching = false;
                state.searchError = action.payload;
            });
    },
});

// ==============================
// Actions Export
// ==============================

export const {
    clearErrors,
    clearError,
    clearMessage,
    setSelectedJobLocationType,
    clearSelectedJobLocationType,
    setSearchTerm,
    clearSearch,
    resetJobLocationTypesState,
} = jobLocationTypesSlice.actions;

// ==============================
// Selectors
// ==============================

export const selectJobLocationTypes = (state) =>
    state.jobLocationTypes.jobLocationTypes;
export const selectSelectedJobLocationType = (state) =>
    state.jobLocationTypes.selectedJobLocationType;
export const selectJobLocationTypesLoading = (state) =>
    state.jobLocationTypes.loading;
export const selectJobLocationTypesError = (state) =>
    state.jobLocationTypes.error;
export const selectJobLocationTypesMessage = (state) =>
    state.jobLocationTypes.message;
export const selectJobLocationTypesSearchResults = (state) =>
    state.jobLocationTypes.searchResults;
export const selectJobLocationTypesSearchTerm = (state) =>
    state.jobLocationTypes.searchTerm;
export const selectIsCreatingJobLocationType = (state) =>
    state.jobLocationTypes.creating;
export const selectIsUpdatingJobLocationType = (state) =>
    state.jobLocationTypes.updating;
export const selectIsDeletingJobLocationType = (state) =>
    state.jobLocationTypes.deleting;
export const selectIsSearchingJobLocationTypes = (state) =>
    state.jobLocationTypes.searching;

// Combined loading selector
export const selectJobLocationTypesIsLoading = (state) =>
    state.jobLocationTypes.loading ||
    state.jobLocationTypes.creating ||
    state.jobLocationTypes.updating ||
    state.jobLocationTypes.deleting ||
    state.jobLocationTypes.searching;

// Job location type by ID selector (memoized for performance)
export const selectJobLocationTypeById = (jobLocationTypeId) => (state) =>
    state.jobLocationTypes.jobLocationTypes.find(
        (jobLocationType) => jobLocationType.id === jobLocationTypeId
    );

// Search results count
export const selectJobLocationTypesSearchResultsCount = (state) =>
    state.jobLocationTypes.searchResults.length;

// Has job location types selector
export const selectHasJobLocationTypes = (state) =>
    state.jobLocationTypes.jobLocationTypes.length > 0;

// Error selectors
export const selectJobLocationTypesCreateError = (state) =>
    state.jobLocationTypes.createError;
export const selectJobLocationTypesUpdateError = (state) =>
    state.jobLocationTypes.updateError;
export const selectJobLocationTypesDeleteError = (state) =>
    state.jobLocationTypes.deleteError;
export const selectJobLocationTypesSearchError = (state) =>
    state.jobLocationTypes.searchError;

// Last updated selector
export const selectJobLocationTypesLastUpdated = (state) =>
    state.jobLocationTypes.lastUpdated;

// ==============================
// Reducer Export
// ==============================

export default jobLocationTypesSlice.reducer;
