/**
 * @fileoverview Redux store configuration for Salutation management
 * @version 1.0.0
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import SalutationService from "../services/SalutationService";

// Initialize service
const salutationService = new SalutationService();

// Initial state
const initialState = {
    salutations: [],
    currentSalutation: null,
    searchResults: [],
    pagination: {
        total: 0,
        limit: 10,
        offset: 0,
        totalPages: 0,
        currentPage: 1,
    },
    loading: {
        fetchAll: false,
        fetchById: false,
        create: false,
        update: false,
        delete: false,
        search: false,
        bulkCreate: false,
    },
    error: null,
    lastAction: null,
    filters: {
        orderBy: "name",
        orderDirection: "ASC",
        searchTerm: "",
    },
};

// Async Thunks (Action Creators)

/**
 * Create a new salutation
 */
export const createSalutation = createAsyncThunk(
    "salutations/create",
    async (salutationData, { rejectWithValue }) => {
        try {
            const response = await salutationService.createSalutation(
                salutationData
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Fetch all salutations with pagination and sorting
 */
export const fetchAllSalutations = createAsyncThunk(
    "salutations/fetchAll",
    async (options = {}, { rejectWithValue }) => {
        try {
            const response = await salutationService.getAllSalutations(options);
            return {
                salutations: response.data,
                pagination: response.pagination,
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Fetch salutation by ID
 */
export const fetchSalutationById = createAsyncThunk(
    "salutations/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await salutationService.getSalutationById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Update salutation
 */
export const updateSalutation = createAsyncThunk(
    "salutations/update",
    async ({ id, salutationData }, { rejectWithValue }) => {
        try {
            const response = await salutationService.updateSalutation(
                id,
                salutationData
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Delete salutation
 */
export const deleteSalutation = createAsyncThunk(
    "salutations/delete",
    async (id, { rejectWithValue }) => {
        try {
            await salutationService.deleteSalutation(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Search salutations
 */
export const searchSalutations = createAsyncThunk(
    "salutations/search",
    async ({ searchTerm, options = {} }, { rejectWithValue }) => {
        try {
            const response = await salutationService.searchSalutations(
                searchTerm,
                options
            );
            return {
                results: response.data,
                pagination: response.pagination,
                searchTerm,
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Get salutation by name
 */
export const fetchSalutationByName = createAsyncThunk(
    "salutations/fetchByName",
    async (name, { rejectWithValue }) => {
        try {
            const response = await salutationService.getSalutationByName(name);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Check if salutation exists by name
 */
export const checkSalutationExistsByName = createAsyncThunk(
    "salutations/checkExistsByName",
    async (name, { rejectWithValue }) => {
        try {
            const response =
                await salutationService.checkSalutationExistsByName(name);
            return { name, exists: response.exists };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Check if salutation exists by ID
 */
export const checkSalutationExistsById = createAsyncThunk(
    "salutations/checkExistsById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await salutationService.checkSalutationExistsById(
                id
            );
            return { id, exists: response.exists };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Get all salutations sorted (for dropdowns)
 */
export const fetchSortedSalutations = createAsyncThunk(
    "salutations/fetchSorted",
    async (_, { rejectWithValue }) => {
        try {
            const response = await salutationService.getAllSalutationsSorted();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Get salutations count
 */
export const fetchSalutationsCount = createAsyncThunk(
    "salutations/fetchCount",
    async (_, { rejectWithValue }) => {
        try {
            const response = await salutationService.getSalutationsCount();
            return response.count;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Bulk create salutations
 */
export const bulkCreateSalutations = createAsyncThunk(
    "salutations/bulkCreate",
    async (salutationsData, { rejectWithValue }) => {
        try {
            const response = await salutationService.bulkCreateSalutations(
                salutationsData
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Salutation Slice
const salutationSlice = createSlice({
    name: "salutations",
    initialState,
    reducers: {
        // Synchronous actions
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentSalutation: (state) => {
            state.currentSalutation = null;
        },
        clearSearchResults: (state) => {
            state.searchResults = [];
            state.filters.searchTerm = "";
        },
        updateFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        updatePagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        resetSalutationState: () => initialState,
        setCurrentSalutation: (state, action) => {
            state.currentSalutation = action.payload;
        },
        updateSalutationInList: (state, action) => {
            const { id, updates } = action.payload;
            const index = state.salutations.findIndex(
                (salutation) => salutation.id === id
            );
            if (index !== -1) {
                state.salutations[index] = {
                    ...state.salutations[index],
                    ...updates,
                };
            }
        },
        removeSalutationFromList: (state, action) => {
            const id = action.payload;
            state.salutations = state.salutations.filter(
                (salutation) => salutation.id !== id
            );
        },
        addSalutationToList: (state, action) => {
            state.salutations.unshift(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Salutation
            .addCase(createSalutation.pending, (state) => {
                state.loading.create = true;
                state.error = null;
            })
            .addCase(createSalutation.fulfilled, (state, action) => {
                state.loading.create = false;
                state.salutations.unshift(action.payload);
                state.lastAction = "create";
                state.error = null;
            })
            .addCase(createSalutation.rejected, (state, action) => {
                state.loading.create = false;
                state.error = action.payload;
                state.lastAction = "create";
            })

            // Fetch All Salutations
            .addCase(fetchAllSalutations.pending, (state) => {
                state.loading.fetchAll = true;
                state.error = null;
            })
            .addCase(fetchAllSalutations.fulfilled, (state, action) => {
                state.loading.fetchAll = false;
                state.salutations = action.payload.salutations.data; // FIXED
                state.pagination = action.payload.pagination;
                state.lastAction = "fetchAll";
                state.error = null;
            })
            .addCase(fetchAllSalutations.rejected, (state, action) => {
                state.loading.fetchAll = false;
                state.error = action.payload;
                state.lastAction = "fetchAll";
            })

            // Fetch Salutation by ID
            .addCase(fetchSalutationById.pending, (state) => {
                state.loading.fetchById = true;
                state.error = null;
            })
            .addCase(fetchSalutationById.fulfilled, (state, action) => {
                state.loading.fetchById = false;
                state.currentSalutation = action.payload;
                state.lastAction = "fetchById";
                state.error = null;
            })
            .addCase(fetchSalutationById.rejected, (state, action) => {
                state.loading.fetchById = false;
                state.error = action.payload;
                state.lastAction = "fetchById";
            })

            // Update Salutation
            .addCase(updateSalutation.pending, (state) => {
                state.loading.update = true;
                state.error = null;
            })
            .addCase(updateSalutation.fulfilled, (state, action) => {
                state.loading.update = false;
                const updatedSalutation = action.payload;

                // Update in salutations array
                const index = state.salutations.findIndex(
                    (salutation) => salutation.id === updatedSalutation.id
                );
                if (index !== -1) {
                    state.salutations[index] = updatedSalutation;
                }

                // Update current salutation if it's the same
                if (
                    state.currentSalutation &&
                    state.currentSalutation.id === updatedSalutation.id
                ) {
                    state.currentSalutation = updatedSalutation;
                }

                state.lastAction = "update";
                state.error = null;
            })
            .addCase(updateSalutation.rejected, (state, action) => {
                state.loading.update = false;
                state.error = action.payload;
                state.lastAction = "update";
            })

            // Delete Salutation
            .addCase(deleteSalutation.pending, (state) => {
                state.loading.delete = true;
                state.error = null;
            })
            .addCase(deleteSalutation.fulfilled, (state, action) => {
                state.loading.delete = false;
                const deletedId = action.payload;

                // Remove from salutations array
                state.salutations = state.salutations.filter(
                    (salutation) => salutation.id !== deletedId
                );

                // Clear current salutation if it was deleted
                if (
                    state.currentSalutation &&
                    state.currentSalutation.id === deletedId
                ) {
                    state.currentSalutation = null;
                }

                state.lastAction = "delete";
                state.error = null;
            })
            .addCase(deleteSalutation.rejected, (state, action) => {
                state.loading.delete = false;
                state.error = action.payload;
                state.lastAction = "delete";
            })

            // Search Salutations
            .addCase(searchSalutations.pending, (state) => {
                state.loading.search = true;
                state.error = null;
            })
            .addCase(searchSalutations.fulfilled, (state, action) => {
                state.loading.search = false;
                state.searchResults = action.payload.results;
                state.pagination = action.payload.pagination;
                state.filters.searchTerm = action.payload.searchTerm;
                state.lastAction = "search";
                state.error = null;
            })
            .addCase(searchSalutations.rejected, (state, action) => {
                state.loading.search = false;
                state.error = action.payload;
                state.lastAction = "search";
            })

            // Fetch Salutation by Name
            .addCase(fetchSalutationByName.fulfilled, (state, action) => {
                state.currentSalutation = action.payload;
                state.lastAction = "fetchByName";
                state.error = null;
            })
            .addCase(fetchSalutationByName.rejected, (state, action) => {
                state.error = action.payload;
                state.lastAction = "fetchByName";
            })

            // Check Salutation Exists by Name
            .addCase(checkSalutationExistsByName.fulfilled, (state, action) => {
                state.lastAction = "checkExistsByName";
                state.error = null;
            })
            .addCase(checkSalutationExistsByName.rejected, (state, action) => {
                state.error = action.payload;
                state.lastAction = "checkExistsByName";
            })

            // Check Salutation Exists by ID
            .addCase(checkSalutationExistsById.fulfilled, (state, action) => {
                state.lastAction = "checkExistsById";
                state.error = null;
            })
            .addCase(checkSalutationExistsById.rejected, (state, action) => {
                state.error = action.payload;
                state.lastAction = "checkExistsById";
            })

            // Fetch Sorted Salutations
            .addCase(fetchSortedSalutations.fulfilled, (state, action) => {
                state.salutations = action.payload;
                state.lastAction = "fetchSorted";
                state.error = null;
            })
            .addCase(fetchSortedSalutations.rejected, (state, action) => {
                state.error = action.payload;
                state.lastAction = "fetchSorted";
            })

            // Fetch Salutations Count
            .addCase(fetchSalutationsCount.fulfilled, (state, action) => {
                state.pagination.total = action.payload;
                state.lastAction = "fetchCount";
                state.error = null;
            })
            .addCase(fetchSalutationsCount.rejected, (state, action) => {
                state.error = action.payload;
                state.lastAction = "fetchCount";
            })

            // Bulk Create Salutations
            .addCase(bulkCreateSalutations.pending, (state) => {
                state.loading.bulkCreate = true;
                state.error = null;
            })
            .addCase(bulkCreateSalutations.fulfilled, (state, action) => {
                state.loading.bulkCreate = false;
                state.salutations = [...action.payload, ...state.salutations];
                state.lastAction = "bulkCreate";
                state.error = null;
            })
            .addCase(bulkCreateSalutations.rejected, (state, action) => {
                state.loading.bulkCreate = false;
                state.error = action.payload;
                state.lastAction = "bulkCreate";
            });
    },
});

// Export actions
export const {
    clearError,
    clearCurrentSalutation,
    clearSearchResults,
    updateFilters,
    updatePagination,
    resetSalutationState,
    setCurrentSalutation,
    updateSalutationInList,
    removeSalutationFromList,
    addSalutationToList,
} = salutationSlice.actions;

// Selectors
export const selectSalutations = (state) => state.salutations.salutations;
export const selectCurrentSalutation = (state) =>
    state.salutations.currentSalutation;
export const selectSearchResults = (state) => state.salutations.searchResults;
export const selectPagination = (state) => state.salutations.pagination;
export const selectLoading = (state) => state.salutations.loading;
export const selectError = (state) => state.salutations.error;
export const selectFilters = (state) => state.salutations.filters;
export const selectLastAction = (state) => state.salutations.lastAction;

// Complex selectors
export const selectIsLoading = (state) =>
    Object.values(state.salutations.loading).some((loading) => loading);

export const selectSalutationById = (id) => (state) =>
    state.salutations.salutations.find((salutation) => salutation.id === id);

export const selectSalutationsByName = (name) => (state) =>
    state.salutations.salutations.filter((salutation) =>
        salutation.name.toLowerCase().includes(name.toLowerCase())
    );

export const selectFormattedSalutations = (state) => {
    const service = new SalutationService();
    return (
        service.formatSalutationsForDisplay?.(state.salutations.salutations) ||
        state.salutations.salutations
    );
};

// Export reducer
export default salutationSlice.reducer;

// Usage Examples:
/*
// In your store configuration (store.js)
import { configureStore } from '@reduxjs/toolkit';
import salutationReducer from './salutationSlice';

export const store = configureStore({
  reducer: {
    salutations: salutationReducer,
  },
});

// In your React components
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchAllSalutations,
  createSalutation,
  updateSalutation,
  deleteSalutation,
  searchSalutations,
  selectSalutations,
  selectLoading,
  selectError,
  clearError
} from './salutationSlice';

function SalutationList() {
  const dispatch = useDispatch();
  const salutations = useSelector(selectSalutations);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchAllSalutations({ limit: 20, orderBy: 'name' }));
  }, [dispatch]);

  const handleCreateSalutation = (salutationData) => {
    dispatch(createSalutation(salutationData));
  };

  const handleUpdateSalutation = (id, salutationData) => {
    dispatch(updateSalutation({ id, salutationData }));
  };

  const handleDeleteSalutation = (id) => {
    dispatch(deleteSalutation(id));
  };

  const handleSearch = (searchTerm) => {
    dispatch(searchSalutations({ searchTerm, options: { limit: 10 } }));
  };

  if (loading.fetchAll) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {salutations.map(salutation => (
        <div key={salutation.id}>
          <h3>{salutation.name}</h3>
          <button onClick={() => handleUpdateSalutation(salutation.id, { name: 'Updated Name' })}>
            Update
          </button>
          <button onClick={() => handleDeleteSalutation(salutation.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
*/

// in this store salutation
// salutations have data and inside but i need direct like
// banks have
// only data is not i need like salutations
// banks: {
//     banks: [
//         {
//             id: '338657f9-71c2-42b4-9aa2-b29ebebadb5b',
//             name: 'add new',
//             createdAt: '2025-06-26T05:58:53.000Z',
//             updatedAt: '2025-06-26T05:59:01.000Z'
//         },
//         {
//             id: '0f172859-6337-4092-9966-4e4767316d36',
//             name: 'Beta Savings new',
//             createdAt: '2025-06-20T06:09:15.000Z',
//             updatedAt: '2025-06-26T05:50:00.000Z'
//         },]
// }
// salutations: {
//     salutations: {
//       success: true,
//       data: [
//         {
//           id: '964d014d-c112-451b-bb57-9d2695da4057',
//           name: 'Mr',
//           createdAt: '2025-06-20T09:34:22.000Z',
//           updatedAt: '2025-06-20T09:34:22.000Z'
//         },
//         {
//           id: '912b1a4f-9740-486f-ba75-465b70219036',
//           name: 'Mrs',
//           createdAt: '2025-06-20T09:34:22.000Z',
//           updatedAt: '2025-06-20T09:34:22.000Z'
//         },
//         {
//           id: '242b1fcb-032a-4cd7-9946-ac054bf26194',
//           name: 'Ms',
//           createdAt: '2025-06-20T09:34:22.000Z',
//           updatedAt: '2025-06-20T09:34:22.000Z'
//         }
//       ],
//       pagination: {
//         total: 3,
//         limit: 10,
//         offset: 0,
//         pages: 1
//       },
//       message: 'Salutations retrieved successfully'
//     },
//     currentSalutation: null,
//     searchResults: [],
//     loading: {
//       fetchAll: false,
//       fetchById: false,
//       create: false,
//       update: false,
//       'delete': false,
//       search: false,
//       bulkCreate: false
//     },
//     error: null,
//     lastAction: 'fetchAll',
//     filters: {
//       orderBy: 'name',
//       orderDirection: 'ASC',
//       searchTerm: ''
//     }
//   }
