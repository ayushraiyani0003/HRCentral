// experienceLevelsSlice.js - Redux Toolkit slice for experience levels management

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getExperienceLevelService } from "../services/ExperienceLevelsService";

const experienceLevelService = getExperienceLevelService();

// ==============================
// Async Thunks
// ==============================

/**
 * Fetch all experience levels
 */
export const fetchExperienceLevels = createAsyncThunk(
    "experienceLevels/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response =
                await experienceLevelService.getAllExperienceLevels();
            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to fetch experience levels"
                );
            }
            return response;
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to fetch experience levels"
            );
        }
    }
);

/**
 * Fetch single experience level by ID
 */
export const fetchExperienceLevelById = createAsyncThunk(
    "experienceLevels/fetchById",
    async (experienceLevelId, { rejectWithValue }) => {
        try {
            const response =
                await experienceLevelService.getExperienceLevelById(
                    experienceLevelId
                );
            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to fetch experience level"
                );
            }
            return response;
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to fetch experience level"
            );
        }
    }
);

/**
 * Fetch experience level by name
 */
export const fetchExperienceLevelByName = createAsyncThunk(
    "experienceLevels/fetchByName",
    async (name, { rejectWithValue }) => {
        try {
            const response =
                await experienceLevelService.getExperienceLevelByName(name);
            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to fetch experience level"
                );
            }
            return response;
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to fetch experience level"
            );
        }
    }
);

/**
 * Create new experience level
 */
export const createExperienceLevel = createAsyncThunk(
    "experienceLevels/create",
    async (experienceLevelData, { rejectWithValue }) => {
        try {
            const response = await experienceLevelService.createExperienceLevel(
                experienceLevelData
            );
            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to create experience level"
                );
            }
            return response;
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to create experience level"
            );
        }
    }
);

/**
 * Update existing experience level
 */
export const updateExperienceLevel = createAsyncThunk(
    "experienceLevels/update",
    async ({ experienceLevelId, experienceLevelData }, { rejectWithValue }) => {
        try {
            const response = await experienceLevelService.updateExperienceLevel(
                experienceLevelId,
                experienceLevelData
            );
            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to update experience level"
                );
            }
            return { ...response, id: experienceLevelId };
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to update experience level"
            );
        }
    }
);

/**
 * Delete experience level
 */
export const deleteExperienceLevel = createAsyncThunk(
    "experienceLevels/delete",
    async (experienceLevelId, { rejectWithValue }) => {
        try {
            const response = await experienceLevelService.deleteExperienceLevel(
                experienceLevelId
            );
            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to delete experience level"
                );
            }
            return { ...response, id: experienceLevelId };
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to delete experience level"
            );
        }
    }
);

/**
 * Search experience levels by name
 */
export const searchExperienceLevels = createAsyncThunk(
    "experienceLevels/search",
    async (searchTerm, { rejectWithValue }) => {
        try {
            const response =
                await experienceLevelService.searchExperienceLevels(searchTerm);
            if (!response.success) {
                return rejectWithValue(
                    response.error || "Failed to search experience levels"
                );
            }
            return { ...response, searchTerm };
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to search experience levels"
            );
        }
    }
);

/**
 * Check if experience level exists by name
 */
export const checkExperienceLevelExists = createAsyncThunk(
    "experienceLevels/checkExists",
    async (name, { rejectWithValue }) => {
        try {
            const exists = await experienceLevelService.experienceLevelExists(
                name
            );
            return { name, exists };
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to check experience level existence"
            );
        }
    }
);

/**
 * Fetch experience level names only
 */
export const fetchExperienceLevelNames = createAsyncThunk(
    "experienceLevels/fetchNames",
    async (_, { rejectWithValue }) => {
        try {
            const names =
                await experienceLevelService.getExperienceLevelNames();
            return { names: Array.isArray(names) ? names : [] };
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to fetch experience level names"
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
    names: [], // For dropdown/select components

    // Loading states
    loading: {
        fetch: false,
        fetchById: false,
        fetchByName: false,
        create: false,
        update: false,
        delete: false,
        search: false,
        checkExists: false,
        fetchNames: false,
    },

    // Error states
    error: {
        fetch: null,
        fetchById: null,
        fetchByName: null,
        create: null,
        update: null,
        delete: null,
        search: null,
        checkExists: null,
        fetchNames: null,
    },

    // UI state
    searchTerm: "",
    lastFetch: null,
    exists: false, // For name existence check

    // Cache for individual items fetched by ID/name
    cache: {},
};

// ==============================
// Slice Definition
// ==============================

const experienceLevelsSlice = createSlice({
    name: "experienceLevels",
    initialState,
    reducers: {
        // Clear all errors
        clearErrors: (state) => {
            state.error = {
                fetch: null,
                fetchById: null,
                fetchByName: null,
                create: null,
                update: null,
                delete: null,
                search: null,
                checkExists: null,
                fetchNames: null,
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

        // Add item to cache
        addToCache: (state, action) => {
            const { key, data } = action.payload;
            state.cache[key] = data;
        },

        // Clear cache
        clearCache: (state) => {
            state.cache = {};
        },

        // Reset state
        resetState: () => initialState,
    },

    extraReducers: (builder) => {
        // ==============================
        // Fetch All Experience Levels
        // ==============================
        builder
            .addCase(fetchExperienceLevels.pending, (state) => {
                state.loading.fetch = true;
                state.error.fetch = null;
            })
            .addCase(fetchExperienceLevels.fulfilled, (state, action) => {
                state.loading.fetch = false;

                // The service now returns the experienceLevels array directly in data
                const data = Array.isArray(action.payload.data)
                    ? action.payload.data
                    : [];

                console.log("Redux slice - received data:", data);

                state.items = data;
                state.lastFetch = new Date().toISOString();

                // Update names array for convenience
                state.names = data
                    .filter(
                        (item) => item && typeof item === "object" && item.name
                    )
                    .map((item) => item.name);
            })
            .addCase(fetchExperienceLevels.rejected, (state, action) => {
                state.loading.fetch = false;
                state.error.fetch = action.payload;
                state.items = [];
                console.error("Redux slice - fetch rejected:", action.payload);
            });

        // ==============================
        // Fetch Experience Level By ID
        // ==============================
        builder
            .addCase(fetchExperienceLevelById.pending, (state) => {
                state.loading.fetchById = true;
                state.error.fetchById = null;
            })
            .addCase(fetchExperienceLevelById.fulfilled, (state, action) => {
                state.loading.fetchById = false;
                state.currentItem = action.payload.data;

                // Add to cache
                if (action.payload.data && action.payload.data.id) {
                    state.cache[action.payload.data.id] = action.payload.data;
                }
            })
            .addCase(fetchExperienceLevelById.rejected, (state, action) => {
                state.loading.fetchById = false;
                state.error.fetchById = action.payload;
                state.currentItem = null;
            });

        // ==============================
        // Fetch Experience Level By Name
        // ==============================
        builder
            .addCase(fetchExperienceLevelByName.pending, (state) => {
                state.loading.fetchByName = true;
                state.error.fetchByName = null;
            })
            .addCase(fetchExperienceLevelByName.fulfilled, (state, action) => {
                state.loading.fetchByName = false;
                state.currentItem = action.payload.data;

                // Add to cache with name as key
                if (action.payload.data && action.payload.data.name) {
                    state.cache[action.payload.data.name] = action.payload.data;
                }
            })
            .addCase(fetchExperienceLevelByName.rejected, (state, action) => {
                state.loading.fetchByName = false;
                state.error.fetchByName = action.payload;
                state.currentItem = null;
            });

        // ==============================
        // Create Experience Level
        // ==============================
        builder
            .addCase(createExperienceLevel.pending, (state) => {
                state.loading.create = true;
                state.error.create = null;
            })
            .addCase(createExperienceLevel.fulfilled, (state, action) => {
                state.loading.create = false;
                if (action.payload.data) {
                    state.items.unshift(action.payload.data);
                    // Update names array
                    if (action.payload.data.name) {
                        state.names.unshift(action.payload.data.name);
                    }
                    // Add to cache
                    if (action.payload.data.id) {
                        state.cache[action.payload.data.id] =
                            action.payload.data;
                    }
                }
            })
            .addCase(createExperienceLevel.rejected, (state, action) => {
                state.loading.create = false;
                state.error.create = action.payload;
            });

        // ==============================
        // Update Experience Level
        // ==============================
        builder
            .addCase(updateExperienceLevel.pending, (state) => {
                state.loading.update = true;
                state.error.update = null;
            })
            .addCase(updateExperienceLevel.fulfilled, (state, action) => {
                state.loading.update = false;
                if (action.payload.data) {
                    const index = state.items.findIndex(
                        (item) => item.id === action.payload.id
                    );
                    if (index !== -1) {
                        const oldName = state.items[index].name;
                        state.items[index] = action.payload.data;

                        // Update names array
                        if (oldName && action.payload.data.name) {
                            const nameIndex = state.names.indexOf(oldName);
                            if (nameIndex !== -1) {
                                state.names[nameIndex] =
                                    action.payload.data.name;
                            }
                        }
                    }

                    // Update current item if it's the same
                    if (
                        state.currentItem &&
                        state.currentItem.id === action.payload.id
                    ) {
                        state.currentItem = action.payload.data;
                    }

                    // Update cache
                    state.cache[action.payload.id] = action.payload.data;
                    if (action.payload.data.name) {
                        state.cache[action.payload.data.name] =
                            action.payload.data;
                    }
                }
            })
            .addCase(updateExperienceLevel.rejected, (state, action) => {
                state.loading.update = false;
                state.error.update = action.payload;
            });

        // ==============================
        // Delete Experience Level
        // ==============================
        builder
            .addCase(deleteExperienceLevel.pending, (state) => {
                state.loading.delete = true;
                state.error.delete = null;
            })
            .addCase(deleteExperienceLevel.fulfilled, (state, action) => {
                state.loading.delete = false;

                // Find and remove from items
                const itemToDelete = state.items.find(
                    (item) => item.id === action.payload.id
                );
                state.items = state.items.filter(
                    (item) => item.id !== action.payload.id
                );

                // Remove from names array
                if (itemToDelete && itemToDelete.name) {
                    state.names = state.names.filter(
                        (name) => name !== itemToDelete.name
                    );
                }

                // Clear current item if it's the deleted one
                if (
                    state.currentItem &&
                    state.currentItem.id === action.payload.id
                ) {
                    state.currentItem = null;
                }

                // Remove from cache
                delete state.cache[action.payload.id];
                if (itemToDelete && itemToDelete.name) {
                    delete state.cache[itemToDelete.name];
                }
            })
            .addCase(deleteExperienceLevel.rejected, (state, action) => {
                state.loading.delete = false;
                state.error.delete = action.payload;
            });

        // ==============================
        // Search Experience Levels
        // ==============================
        builder
            .addCase(searchExperienceLevels.pending, (state) => {
                state.loading.search = true;
                state.error.search = null;
            })
            .addCase(searchExperienceLevels.fulfilled, (state, action) => {
                state.loading.search = false;
                // Ensure data is an array before setting
                const data = Array.isArray(action.payload.data)
                    ? action.payload.data
                    : [];
                state.searchResults = data;
                state.searchTerm = action.payload.searchTerm;
            })
            .addCase(searchExperienceLevels.rejected, (state, action) => {
                state.loading.search = false;
                state.error.search = action.payload;
                state.searchResults = [];
            });

        // ==============================
        // Check Experience Level Exists
        // ==============================
        builder
            .addCase(checkExperienceLevelExists.pending, (state) => {
                state.loading.checkExists = true;
                state.error.checkExists = null;
            })
            .addCase(checkExperienceLevelExists.fulfilled, (state, action) => {
                state.loading.checkExists = false;
                state.exists = action.payload.exists;
            })
            .addCase(checkExperienceLevelExists.rejected, (state, action) => {
                state.loading.checkExists = false;
                state.error.checkExists = action.payload;
                state.exists = false;
            });

        // ==============================
        // Fetch Experience Level Names
        // ==============================
        builder
            .addCase(fetchExperienceLevelNames.pending, (state) => {
                state.loading.fetchNames = true;
                state.error.fetchNames = null;
            })
            .addCase(fetchExperienceLevelNames.fulfilled, (state, action) => {
                state.loading.fetchNames = false;
                // Ensure names is an array before setting
                const names = Array.isArray(action.payload.names)
                    ? action.payload.names
                    : [];
                state.names = names;
            })
            .addCase(fetchExperienceLevelNames.rejected, (state, action) => {
                state.loading.fetchNames = false;
                state.error.fetchNames = action.payload;
                state.names = [];
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
    addToCache,
    clearCache,
    resetState,
} = experienceLevelsSlice.actions;

// ==============================
// Selectors
// ==============================

export const selectExperienceLevels = (state) => state.experienceLevels.items;
export const selectCurrentExperienceLevel = (state) =>
    state.experienceLevels.currentItem;
export const selectSearchResults = (state) =>
    state.experienceLevels.searchResults;
export const selectExperienceLevelNames = (state) =>
    state.experienceLevels.names;
export const selectLoading = (state) => state.experienceLevels.loading;
export const selectErrors = (state) => state.experienceLevels.error;
export const selectSearchTerm = (state) => state.experienceLevels.searchTerm;
export const selectExperienceLevelExists = (state) =>
    state.experienceLevels.exists;
export const selectCache = (state) => state.experienceLevels.cache;

// Computed selectors
export const selectIsLoading = (state) =>
    Object.values(state.experienceLevels.loading).some((loading) => loading);

export const selectHasErrors = (state) =>
    Object.values(state.experienceLevels.error).some((error) => error !== null);

export const selectExperienceLevelById = (state, id) =>
    state.experienceLevels.items.find((item) => item.id === id) ||
    state.experienceLevels.cache[id];

export const selectExperienceLevelByName = (state, name) =>
    state.experienceLevels.items.find((item) => item.name === name) ||
    state.experienceLevels.cache[name];

export const selectFilteredExperienceLevels = (state, searchTerm) => {
    if (!searchTerm) return state.experienceLevels.items;
    return state.experienceLevels.items.filter(
        (item) =>
            item &&
            item.name &&
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
};

// Selector for dropdown options
export const selectExperienceLevelOptions = (state) =>
    state.experienceLevels.items
        .filter((item) => item && item.id && item.name)
        .map((item) => ({
            value: item.id,
            label: item.name,
            ...item,
        }));

// ==============================
// Reducer Export
// ==============================

export default experienceLevelsSlice.reducer;
