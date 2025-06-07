// src/store/rolesPermissionsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import { getRolesPermissionsService } from "../services/RolesPermissionsService";

const rolesService = getRolesPermissionsService();

// Async thunks for API operations
export const fetchAllRoles = createAsyncThunk(
    "roles/fetchAllRoles",
    async (_, { rejectWithValue }) => {
        const response = await rolesService.getAllRoles();
        if (!response.success) {
            return rejectWithValue(response.error);
        }

        return {
            roles: response.data.data.roles || [],
            total: response.data.data.total || 0,
        };
    }
);

export const fetchRoleById = createAsyncThunk(
    "roles/fetchRoleById",
    async (roleId, { rejectWithValue }) => {
        const response = await rolesService.getRoleById(roleId);
        if (!response.success) {
            return rejectWithValue(response.error);
        }
        return response.data;
    }
);

export const createRole = createAsyncThunk(
    "roles/createRole",
    async (roleData, { rejectWithValue }) => {
        const response = await rolesService.createRole(roleData);
        if (!response.success) {
            return rejectWithValue(response.error);
        }

        // Debug: Log the response structure to understand the format
        // console.log("Create Role Response:", response);

        // Try different possible response structures
        let newRole = null;

        // Check common response patterns
        if (response.data?.data?.role) {
            newRole = response.data.data.role;
        } else if (response.data?.data) {
            newRole = response.data.data;
        } else if (response.data?.role) {
            newRole = response.data.role;
        } else if (response.data) {
            newRole = response.data;
        } else if (response.role) {
            newRole = response.role;
        }

        // If we still don't have the role object, return the full response temporarily
        if (!newRole || typeof newRole !== "object") {
            console.warn(
                "Could not extract role object, returning full response:",
                response
            );
            return response.data || response;
        }

        // Return only the essential role fields if they exist
        const cleanRole = {};
        if (newRole.id) cleanRole.id = newRole.id;
        if (newRole.name) cleanRole.name = newRole.name;
        if (newRole.permissions) cleanRole.permissions = newRole.permissions;
        if (newRole.createdAt) cleanRole.createdAt = newRole.createdAt;
        if (newRole.updatedAt) cleanRole.updatedAt = newRole.updatedAt;

        // console.log("Cleaned Role Object:", cleanRole);
        return cleanRole;
    }
);

export const updateRole = createAsyncThunk(
    "roles/updateRole",
    async ({ roleId, roleData }, { rejectWithValue }) => {
        const response = await rolesService.updateRole(roleId, roleData);
        if (!response.success) {
            return rejectWithValue(response.error);
        }

        // Debug: Log the response structure to understand the format
        // console.log("Update Role Response:", response);

        // Try different possible response structures
        let updatedRole = null;

        // Check common response patterns
        if (response.data?.data?.role) {
            updatedRole = response.data.data.role;
        } else if (response.data?.data) {
            updatedRole = response.data.data;
        } else if (response.data?.role) {
            updatedRole = response.data.role;
        } else if (response.data) {
            updatedRole = response.data;
        } else if (response.role) {
            updatedRole = response.role;
        }

        // If we still don't have the role object, return the full response temporarily
        if (!updatedRole || typeof updatedRole !== "object") {
            console.warn(
                "Could not extract role object, returning full response:",
                response
            );
            return response.data || response;
        }

        // Return only the essential role fields if they exist
        const cleanRole = {};
        if (updatedRole.id) cleanRole.id = updatedRole.id;
        if (updatedRole.name) cleanRole.name = updatedRole.name;
        if (updatedRole.permissions)
            cleanRole.permissions = updatedRole.permissions;
        if (updatedRole.createdAt) cleanRole.createdAt = updatedRole.createdAt;
        if (updatedRole.updatedAt) cleanRole.updatedAt = updatedRole.updatedAt;

        // console.log("Cleaned Role Object:", cleanRole);
        return cleanRole;
    }
);

export const deleteRole = createAsyncThunk(
    "roles/deleteRole",
    async (roleId, { rejectWithValue }) => {
        const response = await rolesService.deleteRole(roleId);
        if (!response.success) {
            return rejectWithValue(response.error);
        }
        return roleId;
    }
);

export const bulkRoleOperations = createAsyncThunk(
    "roles/bulkRoleOperations",
    async (operations, { rejectWithValue }) => {
        const response = await rolesService.bulkRoleOperations(operations);
        if (!response.success) {
            return rejectWithValue(response.error);
        }
        return response.data;
    }
);

// Initial state
const initialState = {
    roles: [],
    selectedRole: null,
    loading: false,
    error: null,
    total: 0,

    // UI state
    ui: {
        roleFormOpen: false,
        bulkSelectMode: false,
        selectedRoleIds: [],
    },
};

const rolesPermissionsSlice = createSlice({
    name: "rolesPermissions",
    initialState,
    reducers: {
        // Form management
        openRoleForm: (state) => {
            state.ui.roleFormOpen = true;
            state.error = null;
        },
        closeRoleForm: (state) => {
            state.ui.roleFormOpen = false;
            state.selectedRole = null;
            state.error = null;
        },

        // Bulk selection
        toggleBulkSelectMode: (state) => {
            state.ui.bulkSelectMode = !state.ui.bulkSelectMode;
            state.ui.selectedRoleIds = [];
        },
        toggleRoleSelection: (state, action) => {
            const roleId = action.payload;
            const index = state.ui.selectedRoleIds.indexOf(roleId);
            if (index === -1) {
                state.ui.selectedRoleIds.push(roleId);
            } else {
                state.ui.selectedRoleIds.splice(index, 1);
            }
        },
        selectAllRoles: (state) => {
            state.ui.selectedRoleIds = state.roles.map((role) => role.id);
        },
        deselectAllRoles: (state) => {
            state.ui.selectedRoleIds = [];
        },

        // Error management
        clearError: (state) => {
            state.error = null;
        },

        // Reset
        resetState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Fetch all roles
            .addCase(fetchAllRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = Array.isArray(action.payload.roles)
                    ? action.payload.roles
                    : [];
                state.total = action.payload.total || 0;
            })
            .addCase(fetchAllRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.roles = []; // Ensure roles is always an array
                state.total = 0;
            })

            // Fetch role by ID
            .addCase(fetchRoleById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoleById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedRole = action.payload;
            })
            .addCase(fetchRoleById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create role
            .addCase(createRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRole.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(state.roles)) {
                    // Now action.payload contains only the clean role object
                    state.roles.push(action.payload);
                    state.total += 1; // Increment total count
                }
                state.ui.roleFormOpen = false;
            })
            .addCase(createRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update role
            .addCase(updateRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRole.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(state.roles)) {
                    const index = state.roles.findIndex(
                        (role) => role.id === action.payload.id
                    );
                    if (index !== -1) {
                        // Now action.payload contains only the clean role object
                        state.roles[index] = action.payload;
                    }
                }
                state.selectedRole = action.payload;
                state.ui.roleFormOpen = false;
            })
            .addCase(updateRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete role
            .addCase(deleteRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(state.roles)) {
                    state.roles = state.roles.filter(
                        (role) => role.id !== action.payload
                    );
                    state.total = Math.max(0, state.total - 1); // Decrement total count
                }
                if (state.selectedRole?.id === action.payload) {
                    state.selectedRole = null;
                }
            })
            .addCase(deleteRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Bulk operations
            .addCase(bulkRoleOperations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(bulkRoleOperations.fulfilled, (state, action) => {
                state.loading = false;
                state.ui.bulkSelectMode = false;
                state.ui.selectedRoleIds = [];
                // Note: You might want to refresh the roles list here
                // depending on what bulk operations were performed
            })
            .addCase(bulkRoleOperations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions
export const {
    openRoleForm,
    closeRoleForm,
    toggleBulkSelectMode,
    toggleRoleSelection,
    selectAllRoles,
    deselectAllRoles,
    clearError,
    resetState,
} = rolesPermissionsSlice.actions;

// Base selectors
export const selectRolesState = (state) => state.rolesPermissions;
export const selectRoles = (state) => state.rolesPermissions.roles || [];
export const selectSelectedRole = (state) =>
    state.rolesPermissions.selectedRole;
export const selectLoading = (state) => state.rolesPermissions.loading;
export const selectError = (state) => state.rolesPermissions.error;
export const selectUI = (state) => state.rolesPermissions.ui;
export const selectTotal = (state) => state.rolesPermissions.total;

// Memoized selectors using createSelector
export const selectRoleById = createSelector(
    [selectRoles, (state, roleId) => roleId],
    (roles, roleId) => roles.find((role) => role.id === roleId)
);

export const selectSelectedRoles = createSelector(
    [selectRoles, selectUI],
    (roles, ui) => {
        if (!Array.isArray(roles) || !ui?.selectedRoleIds) return [];
        return roles.filter((role) => ui.selectedRoleIds.includes(role.id));
    }
);

export const selectIsRoleSelected = createSelector(
    [selectUI, (state, roleId) => roleId],
    (ui, roleId) => ui?.selectedRoleIds?.includes(roleId) || false
);

// Additional useful selectors
export const selectRolesCount = createSelector([selectRoles], (roles) =>
    Array.isArray(roles) ? roles.length : 0
);

export const selectSelectedRolesCount = createSelector(
    [selectSelectedRoles],
    (selectedRoles) => selectedRoles.length
);

// Export reducer
export default rolesPermissionsSlice.reducer;
