/**
 * EmployeeTypeSlice.js
 * Redux slice for Employee Type state management
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { employeeTypeService } from "../services/EmployeeTypeService";

// Initial state
const initialState = {
    employeeTypes: [],
    currentEmployeeType: null,
    loading: false,
    error: null,
    searchResults: [],
    searchTerm: "",
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
    },
};

// Async thunks for API calls
export const fetchAllEmployeeTypes = createAsyncThunk(
    "employeeType/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await employeeTypeService.getAllEmployeeTypes();
            return response.data || [];
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchEmployeeTypeById = createAsyncThunk(
    "employeeType/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await employeeTypeService.getEmployeeTypeById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createEmployeeType = createAsyncThunk(
    "employeeType/create",
    async (employeeTypeData, { rejectWithValue }) => {
        try {
            const response = await employeeTypeService.createEmployeeType(
                employeeTypeData
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateEmployeeType = createAsyncThunk(
    "employeeType/update",
    async ({ id, updateData }, { rejectWithValue }) => {
        try {
            const response = await employeeTypeService.updateEmployeeType(
                id,
                updateData
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteEmployeeType = createAsyncThunk(
    "employeeType/delete",
    async (id, { rejectWithValue }) => {
        try {
            await employeeTypeService.deleteEmployeeType(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const searchEmployeeTypes = createAsyncThunk(
    "employeeType/search",
    async (searchTerm, { rejectWithValue }) => {
        try {
            const results = await employeeTypeService.searchEmployeeTypes(
                searchTerm
            );
            return { results, searchTerm };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const checkEmployeeTypeExists = createAsyncThunk(
    "employeeType/checkExists",
    async (name, { rejectWithValue }) => {
        try {
            const exists = await employeeTypeService.employeeTypeExists(name);
            return { name, exists };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Create the slice
const employeeTypeSlice = createSlice({
    name: "employeeType",
    initialState,
    reducers: {
        // Synchronous actions
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentEmployeeType: (state) => {
            state.currentEmployeeType = null;
        },
        clearSearchResults: (state) => {
            state.searchResults = [];
            state.searchTerm = "";
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        resetEmployeeTypeState: (state) => {
            return { ...initialState };
        },
        // Optimistic updates for better UX
        optimisticAddEmployeeType: (state, action) => {
            const newEmployeeType = {
                id: `temp-${Date.now()}`,
                name: action.payload.name,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                isOptimistic: true,
            };
            state.employeeTypes.push(newEmployeeType);
        },
        optimisticUpdateEmployeeType: (state, action) => {
            const { id, updateData } = action.payload;
            const index = state.employeeTypes.findIndex(
                (type) => type.id === id
            );
            if (index !== -1) {
                state.employeeTypes[index] = {
                    ...state.employeeTypes[index],
                    ...updateData,
                    updated_at: new Date().toISOString(),
                    isOptimistic: true,
                };
            }
        },
        optimisticDeleteEmployeeType: (state, action) => {
            const id = action.payload;
            state.employeeTypes = state.employeeTypes.filter(
                (type) => type.id !== id
            );
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all employee types
            .addCase(fetchAllEmployeeTypes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllEmployeeTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.employeeTypes = action.payload;
                state.pagination.total = action.payload.length;
                state.error = null;
            })
            .addCase(fetchAllEmployeeTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch employee type by ID
            .addCase(fetchEmployeeTypeById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployeeTypeById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentEmployeeType = action.payload;
                state.error = null;
            })
            .addCase(fetchEmployeeTypeById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.currentEmployeeType = null;
            })

            // Create employee type
            .addCase(createEmployeeType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEmployeeType.fulfilled, (state, action) => {
                state.loading = false;
                // Remove optimistic entry if exists and add real one
                state.employeeTypes = state.employeeTypes.filter(
                    (type) => !type.isOptimistic
                );
                state.employeeTypes.push(action.payload);
                state.pagination.total += 1;
                state.error = null;
            })
            .addCase(createEmployeeType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                // Remove optimistic entry on failure
                state.employeeTypes = state.employeeTypes.filter(
                    (type) => !type.isOptimistic
                );
            })

            // Update employee type
            .addCase(updateEmployeeType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEmployeeType.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.employeeTypes.findIndex(
                    (type) => type.id === action.payload.id
                );
                if (index !== -1) {
                    state.employeeTypes[index] = action.payload;
                }
                if (
                    state.currentEmployeeType &&
                    state.currentEmployeeType.id === action.payload.id
                ) {
                    state.currentEmployeeType = action.payload;
                }
                state.error = null;
            })
            .addCase(updateEmployeeType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                // Revert optimistic update by refetching (you might want to implement a better revert strategy)
            })

            // Delete employee type
            .addCase(deleteEmployeeType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEmployeeType.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload;
                state.employeeTypes = state.employeeTypes.filter(
                    (type) => type.id !== deletedId
                );
                if (
                    state.currentEmployeeType &&
                    state.currentEmployeeType.id === deletedId
                ) {
                    state.currentEmployeeType = null;
                }
                state.pagination.total -= 1;
                state.error = null;
            })
            .addCase(deleteEmployeeType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Search employee types
            .addCase(searchEmployeeTypes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchEmployeeTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResults = action.payload.results;
                state.searchTerm = action.payload.searchTerm;
                state.error = null;
            })
            .addCase(searchEmployeeTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Check employee type exists
            .addCase(checkEmployeeTypeExists.fulfilled, (state, action) => {
                // You can use this for validation feedback in forms
                state.error = null;
            })
            .addCase(checkEmployeeTypeExists.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

// Export actions
export const {
    clearError,
    clearCurrentEmployeeType,
    clearSearchResults,
    setSearchTerm,
    resetEmployeeTypeState,
    optimisticAddEmployeeType,
    optimisticUpdateEmployeeType,
    optimisticDeleteEmployeeType,
} = employeeTypeSlice.actions;

// Selectors
export const selectAllEmployeeTypes = (state) =>
    state.employeeType.employeeTypes;
export const selectCurrentEmployeeType = (state) =>
    state.employeeType.currentEmployeeType;
export const selectEmployeeTypeLoading = (state) => state.employeeType.loading;
export const selectEmployeeTypeError = (state) => state.employeeType.error;
export const selectSearchResults = (state) => state.employeeType.searchResults;
export const selectSearchTerm = (state) => state.employeeType.searchTerm;
export const selectEmployeeTypePagination = (state) =>
    state.employeeType.pagination;

// Complex selectors
export const selectEmployeeTypeById = (state, id) =>
    state.employeeType.employeeTypes.find((type) => type.id === id);

export const selectEmployeeTypeByName = (state, name) =>
    state.employeeType.employeeTypes.find(
        (type) => type.name.toLowerCase() === name.toLowerCase()
    );

export const selectSortedEmployeeTypes = (state) =>
    [...state.employeeType.employeeTypes].sort((a, b) =>
        a.name.localeCompare(b.name)
    );

export const selectEmployeeTypeStats = (state) => ({
    total: state.employeeType.employeeTypes.length,
    hasData: state.employeeType.employeeTypes.length > 0,
    isEmpty: state.employeeType.employeeTypes.length === 0,
});

// Export reducer
export default employeeTypeSlice.reducer;

/**
 * Usage Examples:
 *
 * // In your store configuration (store.js)
 * import { configureStore } from '@reduxjs/toolkit';
 * import employeeTypeReducer from './slices/EmployeeTypeSlice';
 *
 * export const store = configureStore({
 *   reducer: {
 *     employeeType: employeeTypeReducer,
 *   },
 * });
 *
 * // In your React components
 * import React, { useEffect } from 'react';
 * import { useDispatch, useSelector } from 'react-redux';
 * import {
 *   fetchAllEmployeeTypes,
 *   createEmployeeType,
 *   updateEmployeeType,
 *   deleteEmployeeType,
 *   selectAllEmployeeTypes,
 *   selectEmployeeTypeLoading,
 *   selectEmployeeTypeError,
 *   clearError
 * } from './slices/EmployeeTypeSlice';
 *
 * function EmployeeTypeList() {
 *   const dispatch = useDispatch();
 *   const employeeTypes = useSelector(selectAllEmployeeTypes);
 *   const loading = useSelector(selectEmployeeTypeLoading);
 *   const error = useSelector(selectEmployeeTypeError);
 *
 *   useEffect(() => {
 *     dispatch(fetchAllEmployeeTypes());
 *   }, [dispatch]);
 *
 *   const handleCreate = async (name) => {
 *     try {
 *       await dispatch(createEmployeeType({ name })).unwrap();
 *       // Success handling
 *     } catch (error) {
 *       // Error handling
 *     }
 *   };
 *
 *   const handleUpdate = async (id, name) => {
 *     try {
 *       await dispatch(updateEmployeeType({ id, updateData: { name } })).unwrap();
 *       // Success handling
 *     } catch (error) {
 *       // Error handling
 *     }
 *   };
 *
 *   const handleDelete = async (id) => {
 *     try {
 *       await dispatch(deleteEmployeeType(id)).unwrap();
 *       // Success handling
 *     } catch (error) {
 *       // Error handling
 *     }
 *   };
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *
 *   return (
 *     <div>
 *       {employeeTypes.map(type => (
 *         <div key={type.id}>
 *           <span>{type.name}</span>
 *           <button onClick={() => handleUpdate(type.id, 'Updated Name')}>
 *             Update
 *           </button>
 *           <button onClick={() => handleDelete(type.id)}>
 *             Delete
 *           </button>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 */
