import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getEducationLevelService } from "../services/EducationLevelsService";

const educationLevelService = getEducationLevelService();

// Initial state
const initialState = {
    educationLevels: [], // This should be a direct array
    currentEducationLevel: null,
    searchResults: [],
    filteredEducationLevels: [],
    loading: false,
    error: null,
    lastOperation: null,
    filters: {
        level: null,
        searchTerm: "",
    },
    sortOrder: "asc",
};

// Async Thunks
export const fetchAllEducationLevels = createAsyncThunk(
    "educationLevels/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response =
                await educationLevelService.getAllEducationLevels();
            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to fetch education levels"
                );
            }

            // FIX: Access the nested educationLevels array
            const educationLevels =
                response.data?.educationLevels || response.data;
            return Array.isArray(educationLevels) ? educationLevels : [];
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to fetch education levels"
            );
        }
    }
);

export const fetchEducationLevelById = createAsyncThunk(
    "educationLevels/fetchById",
    async (educationLevelId, { rejectWithValue }) => {
        try {
            const response = await educationLevelService.getEducationLevelById(
                educationLevelId
            );
            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to fetch education level"
                );
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to fetch education level"
            );
        }
    }
);

export const createEducationLevel = createAsyncThunk(
    "educationLevels/create",
    async (educationLevelData, { rejectWithValue, dispatch }) => {
        try {
            // Validate data first
            const validation =
                educationLevelService.validateData(educationLevelData);
            if (!validation.isValid) {
                return rejectWithValue(validation.errors.join(", "));
            }

            // Check if name already exists
            const nameExists = await educationLevelService.doesNameExist(
                educationLevelData.name
            );
            if (nameExists) {
                return rejectWithValue("Education level name already exists");
            }

            const response = await educationLevelService.createEducationLevel(
                educationLevelData
            );
            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to create education level"
                );
            }

            // Refresh the education levels list after successful creation
            dispatch(fetchAllEducationLevels());

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to create education level"
            );
        }
    }
);

export const updateEducationLevel = createAsyncThunk(
    "educationLevels/update",
    async (
        { educationLevelId, educationLevelData },
        { rejectWithValue, dispatch }
    ) => {
        try {
            // Validate data first
            const validation =
                educationLevelService.validateData(educationLevelData);
            if (!validation.isValid) {
                return rejectWithValue(validation.errors.join(", "));
            }

            // Check if name already exists (excluding current education level)
            if (educationLevelData.name) {
                const nameExists = await educationLevelService.doesNameExist(
                    educationLevelData.name,
                    educationLevelId
                );
                if (nameExists) {
                    return rejectWithValue(
                        "Education level name already exists"
                    );
                }
            }

            const response = await educationLevelService.updateEducationLevel(
                educationLevelId,
                educationLevelData
            );
            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to update education level"
                );
            }

            // Refresh the education levels list after successful update
            dispatch(fetchAllEducationLevels());

            return { id: educationLevelId, data: response.data };
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to update education level"
            );
        }
    }
);

export const deleteEducationLevel = createAsyncThunk(
    "educationLevels/delete",
    async (educationLevelId, { rejectWithValue, dispatch }) => {
        try {
            const response = await educationLevelService.deleteEducationLevel(
                educationLevelId
            );
            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to delete education level"
                );
            }

            // Refresh the education levels list after successful deletion
            dispatch(fetchAllEducationLevels());

            return educationLevelId;
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to delete education level"
            );
        }
    }
);

export const searchEducationLevels = createAsyncThunk(
    "educationLevels/search",
    async (searchTerm, { rejectWithValue }) => {
        try {
            const results = await educationLevelService.searchByName(
                searchTerm
            );
            return {
                searchTerm,
                results: Array.isArray(results) ? results : [],
            };
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to search education levels"
            );
        }
    }
);

export const fetchEducationLevelsSortedByLevel = createAsyncThunk(
    "educationLevels/fetchSortedByLevel",
    async (order = "asc", { rejectWithValue }) => {
        try {
            const results = await educationLevelService.getSortedByLevel(order);
            return { order, results: Array.isArray(results) ? results : [] };
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to fetch sorted education levels"
            );
        }
    }
);

// Slice
const educationLevelSlice = createSlice({
    name: "educationLevels",
    initialState,
    reducers: {
        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Clear current education level
        clearCurrentEducationLevel: (state) => {
            state.currentEducationLevel = null;
        },

        // Clear search results
        clearSearchResults: (state) => {
            state.searchResults = [];
            state.filters.searchTerm = "";
        },

        // Set current education level
        setCurrentEducationLevel: (state, action) => {
            state.currentEducationLevel = action.payload;
        },

        // Update filters
        updateFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };

            // Apply filters to education levels
            let filtered = Array.isArray(state.educationLevels)
                ? [...state.educationLevels]
                : [];

            if (
                state.filters.level !== null &&
                state.filters.level !== undefined
            ) {
                filtered = filtered.filter(
                    (level) => level.level === state.filters.level
                );
            }

            if (state.filters.searchTerm) {
                const term = state.filters.searchTerm.toLowerCase();
                filtered = filtered.filter(
                    (level) =>
                        level.name.toLowerCase().includes(term) ||
                        (level.description &&
                            level.description.toLowerCase().includes(term))
                );
            }

            state.filteredEducationLevels = filtered;
        },

        // Clear filters
        clearFilters: (state) => {
            state.filters = {
                level: null,
                searchTerm: "",
            };
            state.filteredEducationLevels = [];
        },

        // Set sort order
        setSortOrder: (state, action) => {
            state.sortOrder = action.payload;

            // Sort education levels by level
            if (Array.isArray(state.educationLevels)) {
                const sorted = [...state.educationLevels].sort((a, b) => {
                    const levelA = a.level || 0;
                    const levelB = b.level || 0;
                    return state.sortOrder === "asc"
                        ? levelA - levelB
                        : levelB - levelA;
                });

                state.educationLevels = sorted;
            }
        },

        // Toggle sort order
        toggleSortOrder: (state) => {
            state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";

            // Sort education levels by level
            if (Array.isArray(state.educationLevels)) {
                const sorted = [...state.educationLevels].sort((a, b) => {
                    const levelA = a.level || 0;
                    const levelB = b.level || 0;
                    return state.sortOrder === "asc"
                        ? levelA - levelB
                        : levelB - levelA;
                });

                state.educationLevels = sorted;
            }
        },

        // Reset state
        resetState: (state) => {
            return { ...initialState };
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all education levels
            .addCase(fetchAllEducationLevels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllEducationLevels.fulfilled, (state, action) => {
                state.loading = false;
                // Ensure we set an array, not an object
                state.educationLevels = Array.isArray(action.payload)
                    ? action.payload
                    : [];
                state.error = null;
                state.lastOperation = "fetchAll";

                // DEBUG: Log the payload to see what we're receiving
                console.log("Fetched education levels:", action.payload);
            })
            .addCase(fetchAllEducationLevels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.educationLevels = [];

                // DEBUG: Log the error
                console.error(
                    "Failed to fetch education levels:",
                    action.payload
                );
            })

            // Fetch education level by ID
            .addCase(fetchEducationLevelById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEducationLevelById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentEducationLevel = action.payload;
                state.error = null;
                state.lastOperation = "fetchById";
            })
            .addCase(fetchEducationLevelById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.currentEducationLevel = null;
            })

            // Create education level
            .addCase(createEducationLevel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEducationLevel.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.lastOperation = "create";

                // Add new education level to the list if not already there
                if (
                    action.payload &&
                    Array.isArray(state.educationLevels) &&
                    !state.educationLevels.find(
                        (level) => level.id === action.payload.id
                    )
                ) {
                    state.educationLevels.push(action.payload);
                }
            })
            .addCase(createEducationLevel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update education level
            .addCase(updateEducationLevel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEducationLevel.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.lastOperation = "update";

                // Update education level in the list
                if (Array.isArray(state.educationLevels)) {
                    const index = state.educationLevels.findIndex(
                        (level) => level.id === action.payload.id
                    );
                    if (index !== -1 && action.payload.data) {
                        state.educationLevels[index] = action.payload.data;
                    }
                }

                // Update current education level if it's the same one
                if (
                    state.currentEducationLevel &&
                    state.currentEducationLevel.id === action.payload.id
                ) {
                    state.currentEducationLevel = action.payload.data;
                }
            })
            .addCase(updateEducationLevel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete education level
            .addCase(deleteEducationLevel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEducationLevel.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.lastOperation = "delete";

                // Remove education level from the list
                if (Array.isArray(state.educationLevels)) {
                    state.educationLevels = state.educationLevels.filter(
                        (level) => level.id !== action.payload
                    );
                }

                // Clear current education level if it was deleted
                if (
                    state.currentEducationLevel &&
                    state.currentEducationLevel.id === action.payload
                ) {
                    state.currentEducationLevel = null;
                }
            })
            .addCase(deleteEducationLevel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Search education levels
            .addCase(searchEducationLevels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchEducationLevels.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResults = action.payload.results;
                state.filters.searchTerm = action.payload.searchTerm;
                state.error = null;
                state.lastOperation = "search";
            })
            .addCase(searchEducationLevels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.searchResults = [];
            })

            // Fetch sorted by level
            .addCase(fetchEducationLevelsSortedByLevel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchEducationLevelsSortedByLevel.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.educationLevels = action.payload.results;
                    state.sortOrder = action.payload.order;
                    state.error = null;
                    state.lastOperation = `sortByLevel_${action.payload.order}`;
                }
            )
            .addCase(
                fetchEducationLevelsSortedByLevel.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    },
});

// Export actions
export const {
    clearError,
    clearCurrentEducationLevel,
    clearSearchResults,
    setCurrentEducationLevel,
    updateFilters,
    clearFilters,
    setSortOrder,
    toggleSortOrder,
    resetState,
} = educationLevelSlice.actions;

// Selectors
export const selectEducationLevels = (state) =>
    state.educationLevels.educationLevels;

export const selectCurrentEducationLevel = (state) =>
    state.educationLevels.currentEducationLevel;

export const selectSearchResults = (state) =>
    state.educationLevels.searchResults;

export const selectFilteredEducationLevels = (state) =>
    state.educationLevels.filteredEducationLevels;

export const selectLoading = (state) => state.educationLevels.loading;

export const selectError = (state) => state.educationLevels.error;

export const selectFilters = (state) => state.educationLevels.filters;

export const selectLastOperation = (state) =>
    state.educationLevels.lastOperation;

export const selectSortOrder = (state) => state.educationLevels.sortOrder;

// Computed selectors
export const selectEducationLevelById = (state, id) => {
    const educationLevels = state.educationLevels.educationLevels;
    return Array.isArray(educationLevels)
        ? educationLevels.find((level) => level.id === id)
        : null;
};

export const selectEducationLevelsByLevel = (state, levelNumber) => {
    const educationLevels = state.educationLevels.educationLevels;
    return Array.isArray(educationLevels)
        ? educationLevels.filter((level) => level.level === levelNumber)
        : [];
};

export const selectEducationLevelsWithFilters = (state) => {
    const { educationLevels, filters } = state.educationLevels;

    if (!filters.level && !filters.searchTerm) {
        return Array.isArray(educationLevels) ? educationLevels : [];
    }

    return state.educationLevels.filteredEducationLevels;
};

export const selectSortedEducationLevels = (state) => {
    const { educationLevels, sortOrder } = state.educationLevels;

    if (!Array.isArray(educationLevels)) {
        return [];
    }

    return [...educationLevels].sort((a, b) => {
        const levelA = a.level || 0;
        const levelB = b.level || 0;
        return sortOrder === "asc" ? levelA - levelB : levelB - levelA;
    });
};

export const selectEducationLevelOptions = (state) => {
    const educationLevels = state.educationLevels.educationLevels;
    return Array.isArray(educationLevels)
        ? educationLevels.map((level) => ({
              value: level.id,
              label: level.name,
              level: level.level,
          }))
        : [];
};

export const selectMinMaxLevels = (state) => {
    const educationLevels = state.educationLevels.educationLevels;

    if (!Array.isArray(educationLevels)) {
        return { min: 0, max: 0 };
    }

    const levels = educationLevels
        .map((level) => level.level || 0)
        .filter((level) => level > 0);

    return {
        min: levels.length > 0 ? Math.min(...levels) : 0,
        max: levels.length > 0 ? Math.max(...levels) : 0,
    };
};

// Export reducer
export default educationLevelSlice.reducer;
