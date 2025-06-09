// store/countrySlice.js;

/**
 * @fileoverview Redux slice for country management
 * @version 1.0.0
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCountryService } from "../services/CountryService";

const countryService = getCountryService();

// ==============================
// Initial State
// ==============================

/**
 * Initial state for country slice
 */
const initialState = {
    // Countries data
    countries: [],
    selectedCountry: null,
    regions: [],
    regionCounts: [],

    // Pagination
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    },

    // Filters and search
    filters: {
        region: "",
        search: "",
        sortBy: "name",
        sortOrder: "ASC",
    },

    // Loading states
    loading: {
        fetch: false,
        create: false,
        update: false,
        delete: false,
        bulk: false,
    },

    // Error handling
    error: null,
    message: null,
};

// ==============================
// Async Thunks
// ==============================

/**
 * Fetch all countries with pagination and filters
 * @param {Object} options - Query options
 */
export const fetchCountries = createAsyncThunk(
    "countries/fetchAll",
    async (options = {}, { rejectWithValue }) => {
        try {
            const response = await countryService.getAllCountries(options);
            if (!response.success) {
                return rejectWithValue(response.error);
            }
            return {
                countries: response.data,
                pagination: response.pagination,
                message: response.message,
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Fetch country by ID
 * @param {string} countryId - Country UUID
 */
export const fetchCountryById = createAsyncThunk(
    "countries/fetchById",
    async (countryId, { rejectWithValue }) => {
        try {
            const response = await countryService.getCountryById(countryId);
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
 * Create new country
 * @param {Object} countryData - Country data
 */
export const createCountry = createAsyncThunk(
    "countries/create",
    async (countryData, { rejectWithValue }) => {
        try {
            const response = await countryService.createCountry(countryData);
            if (!response.success) {
                return rejectWithValue(response.error);
            }
            return {
                country: response.data,
                message: response.message,
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Update existing country
 * @param {Object} payload - Update payload
 * @param {string} payload.id - Country ID
 * @param {Object} payload.data - Updated country data
 */
export const updateCountry = createAsyncThunk(
    "countries/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await countryService.updateCountry(id, data);
            if (!response.success) {
                return rejectWithValue(response.error);
            }
            return {
                country: response.data,
                message: response.message,
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Delete country
 * @param {string} countryId - Country UUID
 */
export const deleteCountry = createAsyncThunk(
    "countries/delete",
    async (countryId, { rejectWithValue }) => {
        try {
            const response = await countryService.deleteCountry(countryId);
            if (!response.success) {
                return rejectWithValue(response.error);
            }
            return {
                countryId,
                message: response.message,
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Fetch country by code
 * @param {string} code - ISO country code
 */
export const fetchCountryByCode = createAsyncThunk(
    "countries/fetchByCode",
    async (code, { rejectWithValue }) => {
        try {
            const response = await countryService.getCountryByCode(code);
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
 * Fetch countries by region
 * @param {Object} payload - Fetch payload
 * @param {string} payload.region - Geographic region
 * @param {Object} payload.options - Query options
 */
export const fetchCountriesByRegion = createAsyncThunk(
    "countries/fetchByRegion",
    async ({ region, options = {} }, { rejectWithValue }) => {
        try {
            const response = await countryService.getCountriesByRegion(
                region,
                options
            );
            if (!response.success) {
                return rejectWithValue(response.error);
            }
            return {
                countries: response.data,
                count: response.count,
                message: response.message,
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Fetch unique regions
 */
export const fetchUniqueRegions = createAsyncThunk(
    "countries/fetchRegions",
    async (_, { rejectWithValue }) => {
        try {
            const response = await countryService.getUniqueRegions();
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
 * Fetch country count by region
 */
export const fetchRegionCounts = createAsyncThunk(
    "countries/fetchRegionCounts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await countryService.getCountByRegion();
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
 * Bulk create countries
 * @param {Array} countries - Array of country objects
 */
export const bulkCreateCountries = createAsyncThunk(
    "countries/bulkCreate",
    async (countries, { rejectWithValue }) => {
        try {
            const response = await countryService.bulkCreateCountries(
                countries
            );
            if (!response.success) {
                return rejectWithValue(response.error);
            }
            return {
                countries: response.data,
                message: response.message,
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Search countries
 * @param {Object} payload - Search payload
 * @param {string} payload.searchTerm - Search term
 * @param {Object} payload.options - Additional options
 */
export const searchCountries = createAsyncThunk(
    "countries/search",
    async ({ searchTerm, options = {} }, { rejectWithValue }) => {
        try {
            const response = await countryService.searchCountries(
                searchTerm,
                options
            );
            if (!response.success) {
                return rejectWithValue(response.error);
            }
            return {
                countries: response.data,
                pagination: response.pagination,
                message: response.message,
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// ==============================
// Country Slice
// ==============================

const countrySlice = createSlice({
    name: "countries",
    initialState,
    reducers: {
        /**
         * Clear error state
         */
        clearError: (state) => {
            state.error = null;
        },

        /**
         * Clear message state
         */
        clearMessage: (state) => {
            state.message = null;
        },

        /**
         * Set selected country
         * @param {Object} state - Current state
         * @param {Object} action - Action with country payload
         */
        setSelectedCountry: (state, action) => {
            state.selectedCountry = action.payload;
        },

        /**
         * Clear selected country
         */
        clearSelectedCountry: (state) => {
            state.selectedCountry = null;
        },

        /**
         * Update filters
         * @param {Object} state - Current state
         * @param {Object} action - Action with filters payload
         */
        updateFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },

        /**
         * Reset filters to default
         */
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },

        /**
         * Update pagination
         * @param {Object} state - Current state
         * @param {Object} action - Action with pagination payload
         */
        updatePagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },

        /**
         * Reset entire state
         */
        resetState: () => initialState,
    },
    extraReducers: (builder) => {
        // Fetch Countries
        builder
            .addCase(fetchCountries.pending, (state) => {
                state.loading.fetch = true;
                state.error = null;
            })
            .addCase(fetchCountries.fulfilled, (state, action) => {
                state.loading.fetch = false;
                state.countries = action.payload.countries;
                state.pagination =
                    action.payload.pagination || state.pagination;
                state.message = action.payload.message;
                state.error = null;
            })
            .addCase(fetchCountries.rejected, (state, action) => {
                state.loading.fetch = false;
                state.error = action.payload;
            });

        // Fetch Country By ID
        builder
            .addCase(fetchCountryById.pending, (state) => {
                state.loading.fetch = true;
                state.error = null;
            })
            .addCase(fetchCountryById.fulfilled, (state, action) => {
                state.loading.fetch = false;
                state.selectedCountry = action.payload;
                state.error = null;
            })
            .addCase(fetchCountryById.rejected, (state, action) => {
                state.loading.fetch = false;
                state.error = action.payload;
            });

        // Create Country
        builder
            .addCase(createCountry.pending, (state) => {
                state.loading.create = true;
                state.error = null;
            })
            .addCase(createCountry.fulfilled, (state, action) => {
                state.loading.create = false;
                state.countries.unshift(action.payload.country);
                state.message = action.payload.message;
                state.error = null;
            })
            .addCase(createCountry.rejected, (state, action) => {
                state.loading.create = false;
                state.error = action.payload;
            });

        // Update Country
        builder
            .addCase(updateCountry.pending, (state) => {
                state.loading.update = true;
                state.error = null;
            })
            .addCase(updateCountry.fulfilled, (state, action) => {
                state.loading.update = false;
                const index = state.countries.findIndex(
                    (country) => country.id === action.payload.country.id
                );
                if (index !== -1) {
                    state.countries[index] = action.payload.country;
                }
                if (state.selectedCountry?.id === action.payload.country.id) {
                    state.selectedCountry = action.payload.country;
                }
                state.message = action.payload.message;
                state.error = null;
            })
            .addCase(updateCountry.rejected, (state, action) => {
                state.loading.update = false;
                state.error = action.payload;
            });

        // Delete Country
        builder
            .addCase(deleteCountry.pending, (state) => {
                state.loading.delete = true;
                state.error = null;
            })
            .addCase(deleteCountry.fulfilled, (state, action) => {
                state.loading.delete = false;
                state.countries = state.countries.filter(
                    (country) => country.id !== action.payload.countryId
                );
                if (state.selectedCountry?.id === action.payload.countryId) {
                    state.selectedCountry = null;
                }
                state.message = action.payload.message;
                state.error = null;
            })
            .addCase(deleteCountry.rejected, (state, action) => {
                state.loading.delete = false;
                state.error = action.payload;
            });

        // Fetch Countries By Region
        builder.addCase(fetchCountriesByRegion.fulfilled, (state, action) => {
            state.countries = action.payload.countries;
            state.message = action.payload.message;
        });

        // Fetch Unique Regions
        builder.addCase(fetchUniqueRegions.fulfilled, (state, action) => {
            state.regions = action.payload;
        });

        // Fetch Region Counts
        builder.addCase(fetchRegionCounts.fulfilled, (state, action) => {
            state.regionCounts = action.payload;
        });

        // Bulk Create Countries
        builder
            .addCase(bulkCreateCountries.pending, (state) => {
                state.loading.bulk = true;
                state.error = null;
            })
            .addCase(bulkCreateCountries.fulfilled, (state, action) => {
                state.loading.bulk = false;
                state.countries = [
                    ...action.payload.countries,
                    ...state.countries,
                ];
                state.message = action.payload.message;
                state.error = null;
            })
            .addCase(bulkCreateCountries.rejected, (state, action) => {
                state.loading.bulk = false;
                state.error = action.payload;
            });

        // Search Countries
        builder.addCase(searchCountries.fulfilled, (state, action) => {
            state.countries = action.payload.countries;
            state.pagination = action.payload.pagination || state.pagination;
            state.message = action.payload.message;
        });
    },
});

// ==============================
// Actions Export
// ==============================

export const {
    clearError,
    clearMessage,
    setSelectedCountry,
    clearSelectedCountry,
    updateFilters,
    resetFilters,
    updatePagination,
    resetState,
} = countrySlice.actions;

// ==============================
// Selectors
// ==============================

/**
 * Get all countries from state
 */
/**
 * Get all countries from state - with error handling
 */
export const selectCountries = (state) => {
    try {
        // Check different possible state structures
        if (state.countries && Array.isArray(state.countries.countries)) {
            return state.countries.countries;
        }
        if (state.countries && Array.isArray(state.countries)) {
            return state.countries;
        }
        if (state.country && Array.isArray(state.country.countries)) {
            return state.country.countries;
        }
        console.warn("Countries not found in expected state structure:", state);
        return [];
    } catch (error) {
        console.error("Error in selectCountries selector:", error);
        return [];
    }
};

/**
 * Get selected country from state - with error handling
 */
export const selectSelectedCountry = (state) => {
    try {
        return state.countries?.selectedCountry || null;
    } catch (error) {
        console.error("Error in selectSelectedCountry selector:", error);
        return null;
    }
};

/**
 * Get loading states from state - with error handling
 */
export const selectLoading = (state) => {
    try {
        return (
            state.countries?.loading || {
                fetch: false,
                create: false,
                update: false,
                delete: false,
                bulk: false,
            }
        );
    } catch (error) {
        console.error("Error in selectLoading selector:", error);
        return {
            fetch: false,
            create: false,
            update: false,
            delete: false,
            bulk: false,
        };
    }
};

/**
 * Get error from state - with error handling
 */
export const selectError = (state) => {
    try {
        return state.countries?.error || null;
    } catch (error) {
        console.error("Error in selectError selector:", error);
        return null;
    }
};

/**
 * Get message from state - with error handling
 */
export const selectMessage = (state) => {
    try {
        return state.countries?.message || null;
    } catch (error) {
        console.error("Error in selectMessage selector:", error);
        return null;
    }
};

/**
 * Get pagination from state - with error handling
 */
export const selectPagination = (state) => {
    try {
        return (
            state.countries?.pagination || {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0,
            }
        );
    } catch (error) {
        console.error("Error in selectPagination selector:", error);
        return {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
        };
    }
};

/**
 * Get filters from state - with error handling
 */
export const selectFilters = (state) => {
    try {
        return (
            state.countries?.filters || {
                region: "",
                search: "",
                sortBy: "name",
                sortOrder: "ASC",
            }
        );
    } catch (error) {
        console.error("Error in selectFilters selector:", error);
        return {
            region: "",
            search: "",
            sortBy: "name",
            sortOrder: "ASC",
        };
    }
};

/**
 * Get regions from state - with error handling
 */
export const selectRegions = (state) => {
    try {
        return state.countries?.regions || [];
    } catch (error) {
        console.error("Error in selectRegions selector:", error);
        return [];
    }
};

/**
 * Get region counts from state - with error handling
 */
export const selectRegionCounts = (state) => {
    try {
        return state.countries?.regionCounts || [];
    } catch (error) {
        console.error("Error in selectRegionCounts selector:", error);
        return [];
    }
};

/**
 * Check if any operation is loading - with error handling
 */
export const selectIsLoading = (state) => {
    try {
        const loading = state.countries?.loading || {};
        return Object.values(loading).some((loadingState) => loadingState);
    } catch (error) {
        console.error("Error in selectIsLoading selector:", error);
        return false;
    }
};

// Alternative selectors for debugging
export const selectCountriesDebug = (state) => {
    console.log("Full state structure:", state);
    console.log("Countries slice:", state.countries);
    return state;
};

export default countrySlice.reducer;
