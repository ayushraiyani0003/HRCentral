/**
 * @fileoverview Redux store configuration for Bank List management
 * @version 1.0.0
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import BankListService from "../services/BankListService";

// Initialize service
const bankService = new BankListService();

// Initial state
const initialState = {
    banks: [],
    currentBank: null,
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
 * Create a new bank
 */
export const createBank = createAsyncThunk(
    "banks/create",
    async (bankData, { rejectWithValue }) => {
        try {
            const response = await bankService.createBank(bankData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Fetch all banks with pagination and sorting
 */
export const fetchAllBanks = createAsyncThunk(
    "banks/fetchAll",
    async (options = {}, { rejectWithValue }) => {
        try {
            const response = await bankService.getAllBanks(options);
            return {
                banks: response.data,
                pagination: response.pagination,
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Fetch bank by ID
 */
export const fetchBankById = createAsyncThunk(
    "banks/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await bankService.getBankById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Update bank
 */
export const updateBank = createAsyncThunk(
    "banks/update",
    async ({ id, bankData }, { rejectWithValue }) => {
        try {
            const response = await bankService.updateBank(id, bankData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Delete bank
 */
export const deleteBank = createAsyncThunk(
    "banks/delete",
    async (id, { rejectWithValue }) => {
        try {
            await bankService.deleteBank(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Search banks
 */
export const searchBanks = createAsyncThunk(
    "banks/search",
    async ({ searchTerm, options = {} }, { rejectWithValue }) => {
        try {
            const response = await bankService.searchBanks(searchTerm, options);
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
 * Get bank by name
 */
export const fetchBankByName = createAsyncThunk(
    "banks/fetchByName",
    async (name, { rejectWithValue }) => {
        try {
            const response = await bankService.getBankByName(name);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Check if bank exists by name
 */
export const checkBankExistsByName = createAsyncThunk(
    "banks/checkExistsByName",
    async (name, { rejectWithValue }) => {
        try {
            const response = await bankService.checkBankExistsByName(name);
            return { name, exists: response.exists };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Check if bank exists by ID
 */
export const checkBankExistsById = createAsyncThunk(
    "banks/checkExistsById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await bankService.checkBankExistsById(id);
            return { id, exists: response.exists };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Get all banks sorted (for dropdowns)
 */
export const fetchSortedBanks = createAsyncThunk(
    "banks/fetchSorted",
    async (_, { rejectWithValue }) => {
        try {
            const response = await bankService.getAllBanksSorted();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Get banks count
 */
export const fetchBanksCount = createAsyncThunk(
    "banks/fetchCount",
    async (_, { rejectWithValue }) => {
        try {
            const response = await bankService.getBanksCount();
            return response.count;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Bulk create banks
 */
export const bulkCreateBanks = createAsyncThunk(
    "banks/bulkCreate",
    async (banksData, { rejectWithValue }) => {
        try {
            const response = await bankService.bulkCreateBanks(banksData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Bank Slice
const bankSlice = createSlice({
    name: "banks",
    initialState,
    reducers: {
        // Synchronous actions
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentBank: (state) => {
            state.currentBank = null;
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
        resetBankState: () => initialState,
        setCurrentBank: (state, action) => {
            state.currentBank = action.payload;
        },
        updateBankInList: (state, action) => {
            const { id, updates } = action.payload;
            const index = state.banks.findIndex((bank) => bank.id === id);
            if (index !== -1) {
                state.banks[index] = { ...state.banks[index], ...updates };
            }
        },
        removeBankFromList: (state, action) => {
            const id = action.payload;
            state.banks = state.banks.filter((bank) => bank.id !== id);
        },
        addBankToList: (state, action) => {
            state.banks.unshift(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Bank
            .addCase(createBank.pending, (state) => {
                state.loading.create = true;
                state.error = null;
            })
            .addCase(createBank.fulfilled, (state, action) => {
                state.loading.create = false;
                state.banks.unshift(action.payload);
                state.lastAction = "create";
                state.error = null;
            })
            .addCase(createBank.rejected, (state, action) => {
                state.loading.create = false;
                state.error = action.payload;
                state.lastAction = "create";
            })

            // Fetch All Banks
            .addCase(fetchAllBanks.pending, (state) => {
                state.loading.fetchAll = true;
                state.error = null;
            })
            .addCase(fetchAllBanks.fulfilled, (state, action) => {
                state.loading.fetchAll = false;
                state.banks = action.payload.banks;
                state.pagination = action.payload.pagination;
                state.lastAction = "fetchAll";
                state.error = null;
            })
            .addCase(fetchAllBanks.rejected, (state, action) => {
                state.loading.fetchAll = false;
                state.error = action.payload;
                state.lastAction = "fetchAll";
            })

            // Fetch Bank by ID
            .addCase(fetchBankById.pending, (state) => {
                state.loading.fetchById = true;
                state.error = null;
            })
            .addCase(fetchBankById.fulfilled, (state, action) => {
                state.loading.fetchById = false;
                state.currentBank = action.payload;
                state.lastAction = "fetchById";
                state.error = null;
            })
            .addCase(fetchBankById.rejected, (state, action) => {
                state.loading.fetchById = false;
                state.error = action.payload;
                state.lastAction = "fetchById";
            })

            // Update Bank
            .addCase(updateBank.pending, (state) => {
                state.loading.update = true;
                state.error = null;
            })
            .addCase(updateBank.fulfilled, (state, action) => {
                state.loading.update = false;
                const updatedBank = action.payload;

                // Update in banks array
                const index = state.banks.findIndex(
                    (bank) => bank.id === updatedBank.id
                );
                if (index !== -1) {
                    state.banks[index] = updatedBank;
                }

                // Update current bank if it's the same
                if (
                    state.currentBank &&
                    state.currentBank.id === updatedBank.id
                ) {
                    state.currentBank = updatedBank;
                }

                state.lastAction = "update";
                state.error = null;
            })
            .addCase(updateBank.rejected, (state, action) => {
                state.loading.update = false;
                state.error = action.payload;
                state.lastAction = "update";
            })

            // Delete Bank
            .addCase(deleteBank.pending, (state) => {
                state.loading.delete = true;
                state.error = null;
            })
            .addCase(deleteBank.fulfilled, (state, action) => {
                state.loading.delete = false;
                const deletedId = action.payload;

                // Remove from banks array
                state.banks = state.banks.filter(
                    (bank) => bank.id !== deletedId
                );

                // Clear current bank if it was deleted
                if (state.currentBank && state.currentBank.id === deletedId) {
                    state.currentBank = null;
                }

                state.lastAction = "delete";
                state.error = null;
            })
            .addCase(deleteBank.rejected, (state, action) => {
                state.loading.delete = false;
                state.error = action.payload;
                state.lastAction = "delete";
            })

            // Search Banks
            .addCase(searchBanks.pending, (state) => {
                state.loading.search = true;
                state.error = null;
            })
            .addCase(searchBanks.fulfilled, (state, action) => {
                state.loading.search = false;
                state.searchResults = action.payload.results;
                state.pagination = action.payload.pagination;
                state.filters.searchTerm = action.payload.searchTerm;
                state.lastAction = "search";
                state.error = null;
            })
            .addCase(searchBanks.rejected, (state, action) => {
                state.loading.search = false;
                state.error = action.payload;
                state.lastAction = "search";
            })

            // Fetch Bank by Name
            .addCase(fetchBankByName.fulfilled, (state, action) => {
                state.currentBank = action.payload;
                state.lastAction = "fetchByName";
                state.error = null;
            })
            .addCase(fetchBankByName.rejected, (state, action) => {
                state.error = action.payload;
                state.lastAction = "fetchByName";
            })

            // Check Bank Exists by Name
            .addCase(checkBankExistsByName.fulfilled, (state, action) => {
                state.lastAction = "checkExistsByName";
                state.error = null;
            })
            .addCase(checkBankExistsByName.rejected, (state, action) => {
                state.error = action.payload;
                state.lastAction = "checkExistsByName";
            })

            // Check Bank Exists by ID
            .addCase(checkBankExistsById.fulfilled, (state, action) => {
                state.lastAction = "checkExistsById";
                state.error = null;
            })
            .addCase(checkBankExistsById.rejected, (state, action) => {
                state.error = action.payload;
                state.lastAction = "checkExistsById";
            })

            // Fetch Sorted Banks
            .addCase(fetchSortedBanks.fulfilled, (state, action) => {
                state.banks = action.payload;
                state.lastAction = "fetchSorted";
                state.error = null;
            })
            .addCase(fetchSortedBanks.rejected, (state, action) => {
                state.error = action.payload;
                state.lastAction = "fetchSorted";
            })

            // Fetch Banks Count
            .addCase(fetchBanksCount.fulfilled, (state, action) => {
                state.pagination.total = action.payload;
                state.lastAction = "fetchCount";
                state.error = null;
            })
            .addCase(fetchBanksCount.rejected, (state, action) => {
                state.error = action.payload;
                state.lastAction = "fetchCount";
            })

            // Bulk Create Banks
            .addCase(bulkCreateBanks.pending, (state) => {
                state.loading.bulkCreate = true;
                state.error = null;
            })
            .addCase(bulkCreateBanks.fulfilled, (state, action) => {
                state.loading.bulkCreate = false;
                state.banks = [...action.payload, ...state.banks];
                state.lastAction = "bulkCreate";
                state.error = null;
            })
            .addCase(bulkCreateBanks.rejected, (state, action) => {
                state.loading.bulkCreate = false;
                state.error = action.payload;
                state.lastAction = "bulkCreate";
            });
    },
});

// Export actions
export const {
    clearError,
    clearCurrentBank,
    clearSearchResults,
    updateFilters,
    updatePagination,
    resetBankState,
    setCurrentBank,
    updateBankInList,
    removeBankFromList,
    addBankToList,
} = bankSlice.actions;

// Selectors
export const selectBanks = (state) => state.banks.banks;
export const selectCurrentBank = (state) => state.banks.currentBank;
export const selectSearchResults = (state) => state.banks.searchResults;
export const selectPagination = (state) => state.banks.pagination;
export const selectLoading = (state) => state.banks.loading;
export const selectError = (state) => state.banks.error;
export const selectFilters = (state) => state.banks.filters;
export const selectLastAction = (state) => state.banks.lastAction;

// Complex selectors
export const selectIsLoading = (state) =>
    Object.values(state.banks.loading).some((loading) => loading);

export const selectBankById = (id) => (state) =>
    state.banks.banks.find((bank) => bank.id === id);

export const selectBanksByName = (name) => (state) =>
    state.banks.banks.filter((bank) =>
        bank.name.toLowerCase().includes(name.toLowerCase())
    );

export const selectFormattedBanks = (state) => {
    const service = new BankListService();
    return service.formatBanksForDisplay(state.banks.banks);
};

// Export reducer
export default bankSlice.reducer;

// Usage Examples:
/*
// In your store configuration (store.js)
import { configureStore } from '@reduxjs/toolkit';
import bankReducer from './bankSlice';

export const store = configureStore({
  reducer: {
    banks: bankReducer,
  },
});

// In your React components
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchAllBanks,
  createBank,
  updateBank,
  deleteBank,
  searchBanks,
  selectBanks,
  selectLoading,
  selectError,
  clearError
} from './bankSlice';

function BankList() {
  const dispatch = useDispatch();
  const banks = useSelector(selectBanks);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchAllBanks({ limit: 20, orderBy: 'name' }));
  }, [dispatch]);

  const handleCreateBank = (bankData) => {
    dispatch(createBank(bankData));
  };

  const handleUpdateBank = (id, bankData) => {
    dispatch(updateBank({ id, bankData }));
  };

  const handleDeleteBank = (id) => {
    dispatch(deleteBank(id));
  };

  const handleSearch = (searchTerm) => {
    dispatch(searchBanks({ searchTerm, options: { limit: 10 } }));
  };

  if (loading.fetchAll) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {banks.map(bank => (
        <div key={bank.id}>
          <h3>{bank.name}</h3>
          <button onClick={() => handleUpdateBank(bank.id, { name: 'Updated Name' })}>
            Update
          </button>
          <button onClick={() => handleDeleteBank(bank.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
*/
