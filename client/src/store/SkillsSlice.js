// SkillsSlice.js - Redux Toolkit slice for skills management

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSkillService } from "../services/SkillsService";

const skillService = getSkillService();

// ==============================
// Async Thunks
// ==============================

/**
 * Fetch all skills with optional filtering
 */
export const fetchSkills = createAsyncThunk(
    "skills/fetchSkills",
    async (options = {}, { rejectWithValue }) => {
        try {
            const response = await skillService.getAllSkills(options);

            if (!response.success) {
                return rejectWithValue(response.error);
            }

            // Handle nested response structure - extract skills array from response.data.skills
            const skillsData = response.data;
            if (
                skillsData &&
                skillsData.skills &&
                Array.isArray(skillsData.skills)
            ) {
                return skillsData.skills;
            }
            // Fallback: if response.data is already an array
            if (Array.isArray(skillsData)) {
                return skillsData;
            }
            // Default fallback
            return [];
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Fetch a single skill by ID
 */
export const fetchSkillById = createAsyncThunk(
    "skills/fetchSkillById",
    async (skillId, { rejectWithValue }) => {
        try {
            const response = await skillService.getSkillById(skillId);

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
 * Create a new skill
 */
export const createSkill = createAsyncThunk(
    "skills/createSkill",
    async (skillData, { rejectWithValue }) => {
        try {
            const response = await skillService.createSkill(skillData);

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
 * Update an existing skill
 */
export const updateSkill = createAsyncThunk(
    "skills/updateSkill",
    async ({ skillId, skillData }, { rejectWithValue }) => {
        try {
            const response = await skillService.updateSkill(skillId, skillData);

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
 * Delete a skill
 */
export const deleteSkill = createAsyncThunk(
    "skills/deleteSkill",
    async (skillId, { rejectWithValue }) => {
        try {
            const response = await skillService.deleteSkill(skillId);

            if (!response.success) {
                return rejectWithValue(response.error);
            }

            return { skillId, message: response.message };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Search skills by term
 */
export const searchSkills = createAsyncThunk(
    "skills/searchSkills",
    async ({ searchTerm, options = {} }, { rejectWithValue }) => {
        try {
            const response = await skillService.searchSkills(
                searchTerm,
                options
            );

            if (!response.success) {
                return rejectWithValue(response.error);
            }

            return {
                skills: response.data || [],
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
    // Data - skills is now a direct array
    skills: [],
    selectedSkill: null,

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
// Skills Slice
// ==============================

const skillsSlice = createSlice({
    name: "skills",
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

        // Set selected skill
        setSelectedSkill: (state, action) => {
            state.selectedSkill = action.payload;
        },

        // Clear selected skill
        clearSelectedSkill: (state) => {
            state.selectedSkill = null;
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
        resetSkillsState: () => initialState,
    },

    extraReducers: (builder) => {
        // ==============================
        // Fetch Skills
        // ==============================
        builder
            .addCase(fetchSkills.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSkills.fulfilled, (state, action) => {
                state.loading = false;
                // action.payload is now the skills array directly
                state.skills = action.payload;
                state.message = "Skills retrieved successfully";
                state.lastUpdated = Date.now();
            })
            .addCase(fetchSkills.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ==============================
            // Fetch Skill by ID
            // ==============================
            .addCase(fetchSkillById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSkillById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedSkill = action.payload;
                state.lastUpdated = Date.now();
            })
            .addCase(fetchSkillById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ==============================
            // Create Skill
            // ==============================
            .addCase(createSkill.pending, (state) => {
                state.creating = true;
                state.createError = null;
            })
            .addCase(createSkill.fulfilled, (state, action) => {
                state.creating = false;
                state.skills.unshift(action.payload); // Add to beginning of array
                state.message = "Skill created successfully";
                state.lastUpdated = Date.now();
            })
            .addCase(createSkill.rejected, (state, action) => {
                state.creating = false;
                state.createError = action.payload;
            })

            // ==============================
            // Update Skill
            // ==============================
            .addCase(updateSkill.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(updateSkill.fulfilled, (state, action) => {
                state.updating = false;
                const updatedSkill = action.payload;

                // Update in skills array
                const index = state.skills.findIndex(
                    (skill) => skill.id === updatedSkill.id
                );
                if (index !== -1) {
                    state.skills[index] = updatedSkill;
                }

                // Update selected skill if it's the same one
                if (
                    state.selectedSkill &&
                    state.selectedSkill.id === updatedSkill.id
                ) {
                    state.selectedSkill = updatedSkill;
                }

                state.message = "Skill updated successfully";
                state.lastUpdated = Date.now();
            })
            .addCase(updateSkill.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload;
            })

            // ==============================
            // Delete Skill
            // ==============================
            .addCase(deleteSkill.pending, (state) => {
                state.deleting = true;
                state.deleteError = null;
            })
            .addCase(deleteSkill.fulfilled, (state, action) => {
                state.deleting = false;
                const { skillId } = action.payload;

                // Remove from skills array
                state.skills = state.skills.filter(
                    (skill) => skill.id !== skillId
                );

                // Clear selected skill if it was deleted
                if (state.selectedSkill && state.selectedSkill.id === skillId) {
                    state.selectedSkill = null;
                }

                state.message =
                    action.payload.message || "Skill deleted successfully";
                state.lastUpdated = Date.now();
            })
            .addCase(deleteSkill.rejected, (state, action) => {
                state.deleting = false;
                state.deleteError = action.payload;
            })

            // ==============================
            // Search Skills
            // ==============================
            .addCase(searchSkills.pending, (state) => {
                state.searching = true;
                state.searchError = null;
            })
            .addCase(searchSkills.fulfilled, (state, action) => {
                state.searching = false;
                state.searchResults = action.payload.skills;
                state.searchTerm = action.payload.searchTerm;
                state.message = action.payload.message;
            })
            .addCase(searchSkills.rejected, (state, action) => {
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
    setSelectedSkill,
    clearSelectedSkill,
    setSearchTerm,
    clearSearch,
    resetSkillsState,
} = skillsSlice.actions;

// ==============================
// Selectors
// ==============================

export const selectSkills = (state) => state.skills.skills;
export const selectSelectedSkill = (state) => state.skills.selectedSkill;
export const selectSkillsLoading = (state) => state.skills.loading;
export const selectSkillsError = (state) => state.skills.error;
export const selectSkillsMessage = (state) => state.skills.message;
export const selectSearchResults = (state) => state.skills.searchResults;
export const selectSearchTerm = (state) => state.skills.searchTerm;
export const selectIsCreating = (state) => state.skills.creating;
export const selectIsUpdating = (state) => state.skills.updating;
export const selectIsDeleting = (state) => state.skills.deleting;
export const selectIsSearching = (state) => state.skills.searching;

// Combined loading selector
export const selectIsLoading = (state) =>
    state.skills.loading ||
    state.skills.creating ||
    state.skills.updating ||
    state.skills.deleting ||
    state.skills.searching;

// Skills by ID selector (memoized for performance)
export const selectSkillById = (skillId) => (state) =>
    state.skills.skills.find((skill) => skill.id === skillId);

// Search results count
export const selectSearchResultsCount = (state) =>
    state.skills.searchResults.length;

// Has skills selector
export const selectHasSkills = (state) => state.skills.skills.length > 0;

// ==============================
// Reducer Export
// ==============================

export default skillsSlice.reducer;
