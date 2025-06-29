import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDesignationService } from "../services/DesignationsService";

const designationService = getDesignationService();

// Initial state
const initialState = {
    designations: [],
    currentDesignation: null,
    searchResults: [],
    filteredDesignations: [],
    loading: false,
    error: null,
    lastOperation: null,
    filters: {
        department: "",
        level: null,
        searchTerm: "",
    },
};

// Async Thunks
export const fetchAllDesignations = createAsyncThunk(
    "designations/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await designationService.getAllDesignations();
            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to fetch designations"
                );
            }
            // Fix: Extract the array from nested structure
            const data = response.data || [];
            return Array.isArray(data) ? data : data.designations || [];
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to fetch designations"
            );
        }
    }
);

export const fetchDesignationById = createAsyncThunk(
    "designations/fetchById",
    async (designationId, { rejectWithValue }) => {
        try {
            const response = await designationService.getDesignationById(
                designationId
            );
            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to fetch designation"
                );
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to fetch designation"
            );
        }
    }
);

export const createDesignation = createAsyncThunk(
    "designations/create",
    async (designationData, { rejectWithValue, dispatch }) => {
        try {
            // Validate data first
            const validation = designationService.validateData(designationData);
            if (!validation.isValid) {
                return rejectWithValue(validation.errors.join(", "));
            }

            // Check if name already exists
            const nameExists = await designationService.doesNameExist(
                designationData.name
            );
            if (nameExists) {
                return rejectWithValue("Designation name already exists");
            }

            const response = await designationService.createDesignation(
                designationData
            );
            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to create designation"
                );
            }

            // Refresh the designations list after successful creation
            dispatch(fetchAllDesignations());

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to create designation"
            );
        }
    }
);

export const updateDesignation = createAsyncThunk(
    "designations/update",
    async (
        { designationId, designationData },
        { rejectWithValue, dispatch }
    ) => {
        try {
            // Validate data first
            const validation = designationService.validateData(designationData);
            if (!validation.isValid) {
                return rejectWithValue(validation.errors.join(", "));
            }

            // Check if name already exists (excluding current designation)
            if (designationData.name) {
                const nameExists = await designationService.doesNameExist(
                    designationData.name,
                    designationId
                );
                if (nameExists) {
                    return rejectWithValue("Designation name already exists");
                }
            }

            const response = await designationService.updateDesignation(
                designationId,
                designationData
            );
            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to update designation"
                );
            }

            // Refresh the designations list after successful update
            dispatch(fetchAllDesignations());

            return { id: designationId, data: response.data };
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to update designation"
            );
        }
    }
);

export const deleteDesignation = createAsyncThunk(
    "designations/delete",
    async (designationId, { rejectWithValue, dispatch }) => {
        try {
            const response = await designationService.deleteDesignation(
                designationId
            );
            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to delete designation"
                );
            }

            // Refresh the designations list after successful deletion
            dispatch(fetchAllDesignations());

            return designationId;
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to delete designation"
            );
        }
    }
);

export const searchDesignations = createAsyncThunk(
    "designations/search",
    async (searchTerm, { rejectWithValue }) => {
        try {
            const results = await designationService.searchByName(searchTerm);
            return { searchTerm, results };
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to search designations"
            );
        }
    }
);

export const fetchDesignationsByDepartment = createAsyncThunk(
    "designations/fetchByDepartment",
    async (department, { rejectWithValue }) => {
        try {
            const results = await designationService.getByDepartment(
                department
            );
            return { department, results };
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to fetch designations by department"
            );
        }
    }
);

export const fetchDesignationsSortedByLevel = createAsyncThunk(
    "designations/fetchSortedByLevel",
    async (order = "asc", { rejectWithValue }) => {
        try {
            const results = await designationService.getSortedByLevel(order);
            return { order, results };
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to fetch sorted designations"
            );
        }
    }
);

// Slice
const designationSlice = createSlice({
    name: "designations",
    initialState,
    reducers: {
        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Clear current designation
        clearCurrentDesignation: (state) => {
            state.currentDesignation = null;
        },

        // Clear search results
        clearSearchResults: (state) => {
            state.searchResults = [];
            state.filters.searchTerm = "";
        },

        // Set current designation
        setCurrentDesignation: (state, action) => {
            state.currentDesignation = action.payload;
        },

        // Update filters
        updateFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };

            // Apply filters to designations
            let filtered = [...state.designations];

            if (state.filters.department) {
                filtered = filtered.filter(
                    (designation) =>
                        designation.department &&
                        designation.department.toLowerCase() ===
                            state.filters.department.toLowerCase()
                );
            }

            if (
                state.filters.level !== null &&
                state.filters.level !== undefined
            ) {
                filtered = filtered.filter(
                    (designation) => designation.level === state.filters.level
                );
            }

            if (state.filters.searchTerm) {
                const term = state.filters.searchTerm.toLowerCase();
                filtered = filtered.filter(
                    (designation) =>
                        designation.name.toLowerCase().includes(term) ||
                        (designation.description &&
                            designation.description
                                .toLowerCase()
                                .includes(term))
                );
            }

            state.filteredDesignations = filtered;
        },

        // Clear filters
        clearFilters: (state) => {
            state.filters = {
                department: "",
                level: null,
                searchTerm: "",
            };
            state.filteredDesignations = [];
        },

        // Reset state
        resetState: (state) => {
            return { ...initialState };
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all designations
            .addCase(fetchAllDesignations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllDesignations.fulfilled, (state, action) => {
                state.loading = false;
                state.designations = action.payload; // This will now be a flat array
                state.error = null;
                state.lastOperation = "fetchAll";
            })
            .addCase(fetchAllDesignations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.designations = [];
            })

            // Fetch designation by ID
            .addCase(fetchDesignationById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDesignationById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentDesignation = action.payload;
                state.error = null;
                state.lastOperation = "fetchById";
            })
            .addCase(fetchDesignationById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.currentDesignation = null;
            })

            // Create designation
            .addCase(createDesignation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDesignation.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.lastOperation = "create";

                // Add new designation to the list if not already there
                if (
                    action.payload &&
                    !state.designations.find((d) => d.id === action.payload.id)
                ) {
                    state.designations.push(action.payload);
                }
            })
            .addCase(createDesignation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update designation
            .addCase(updateDesignation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDesignation.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.lastOperation = "update";

                // Update designation in the list
                const index = state.designations.findIndex(
                    (d) => d.id === action.payload.id
                );
                if (index !== -1 && action.payload.data) {
                    state.designations[index] = action.payload.data;
                }

                // Update current designation if it's the same one
                if (
                    state.currentDesignation &&
                    state.currentDesignation.id === action.payload.id
                ) {
                    state.currentDesignation = action.payload.data;
                }
            })
            .addCase(updateDesignation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete designation
            .addCase(deleteDesignation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDesignation.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.lastOperation = "delete";

                // Remove designation from the list
                state.designations = state.designations.filter(
                    (d) => d.id !== action.payload
                );

                // Clear current designation if it was deleted
                if (
                    state.currentDesignation &&
                    state.currentDesignation.id === action.payload
                ) {
                    state.currentDesignation = null;
                }
            })
            .addCase(deleteDesignation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Search designations
            .addCase(searchDesignations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchDesignations.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResults = action.payload.results;
                state.filters.searchTerm = action.payload.searchTerm;
                state.error = null;
                state.lastOperation = "search";
            })
            .addCase(searchDesignations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.searchResults = [];
            })

            // Fetch by department
            .addCase(
                fetchDesignationsByDepartment.fulfilled,
                (state, action) => {
                    state.filteredDesignations = action.payload.results;
                    state.filters.department = action.payload.department;
                    state.lastOperation = "filterByDepartment";
                }
            )

            // Fetch sorted by level
            .addCase(
                fetchDesignationsSortedByLevel.fulfilled,
                (state, action) => {
                    state.designations = action.payload.results;
                    state.lastOperation = `sortByLevel_${action.payload.order}`;
                }
            );
    },
});

// Export actions
export const {
    clearError,
    clearCurrentDesignation,
    clearSearchResults,
    setCurrentDesignation,
    updateFilters,
    clearFilters,
    resetState,
} = designationSlice.actions;

// Selectors
export const selectDesignations = (state) => state.designations.designations;
export const selectCurrentDesignation = (state) =>
    state.designations.currentDesignation;
export const selectSearchResults = (state) => state.designations.searchResults;
export const selectFilteredDesignations = (state) =>
    state.designations.filteredDesignations;
export const selectLoading = (state) => state.designations.loading;
export const selectError = (state) => state.designations.error;
export const selectFilters = (state) => state.designations.filters;
export const selectLastOperation = (state) => state.designations.lastOperation;

// Computed selectors
export const selectDesignationById = (state, id) =>
    state.designations.designations.find(
        (designation) => designation.id === id
    );

export const selectDesignationsByDepartment = (state, department) =>
    state.designations.designations.filter(
        (designation) =>
            designation.department &&
            designation.department.toLowerCase() === department.toLowerCase()
    );

export const selectDesignationsWithFilters = (state) => {
    const { designations, filters } = state.designations;

    if (!filters.department && !filters.level && !filters.searchTerm) {
        return designations;
    }

    return state.designations.filteredDesignations;
};

// Export reducer
export default designationSlice.reducer;

// Now your state structure will be:
// {
//   designations: {
//     designations: [  // Direct array, no nested object
//       {
//         id: '0aec5bc0-3700-45a4-8cbc-2aba5b4bb936',
//         name: 'Manager',
//         createdAt: '2025-06-26T12:44:25.000Z',
//         updatedAt: '2025-06-26T12:44:25.000Z'
//       }
//     ],
//     currentDesignation: null,
//     searchResults: [],
//     filteredDesignations: [],
//     loading: false,
//     error: null,
//     lastOperation: 'fetchAll',
//     filters: {
//       department: '',
//       level: null,
//       searchTerm: ''
//     }
//   }
// }
