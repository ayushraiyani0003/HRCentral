// store/countrySlice.js

/**
 * @fileoverview Simplified Redux slice for country management
 * @version 1.0.0
 */

import {
    createSlice,
    createAsyncThunk,
    createSelector,
} from "@reduxjs/toolkit";
import { getCountryService } from "../services/CountryService";

const countryService = getCountryService();

const initialState = {
    countries: [],
    selectedCountry: null,
    loading: {
        fetch: false,
        create: false,
        update: false,
        delete: false,
    },
    error: null,
    message: null,
};

// ===== ASYNC THUNKS =====

export const fetchCountries = createAsyncThunk(
    "country/fetchAll", // Changed from "countries/fetchAll"
    async (_, { rejectWithValue }) => {
        try {
            const response = await countryService.getAllCountries();
            console.log("Slice received response:", response); // Debug log
            if (!response.success) {
                return rejectWithValue(response.error);
            }
            return {
                countries: response.data || [],
                message: response.message,
            };
        } catch (error) {
            return rejectWithValue(
                error.message || "Failed to fetch countries"
            );
        }
    }
);

export const fetchCountryById = createAsyncThunk(
    "country/fetchById", // Changed from "countries/fetchById"
    async (countryId, { rejectWithValue }) => {
        try {
            const response = await countryService.getCountryById(countryId);
            if (!response.success) {
                return rejectWithValue(response.error);
            }
            return {
                country: response.data,
                message: response.message,
            };
        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch country");
        }
    }
);

export const createCountry = createAsyncThunk(
    "country/create", // Changed from "countries/create"
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
            return rejectWithValue(error.message || "Failed to create country");
        }
    }
);

export const updateCountry = createAsyncThunk(
    "country/update", // Changed from "countries/update"
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
            return rejectWithValue(error.message || "Failed to update country");
        }
    }
);

export const deleteCountry = createAsyncThunk(
    "country/delete", // Changed from "countries/delete"
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
            return rejectWithValue(error.message || "Failed to delete country");
        }
    }
);

// ===== SLICE =====

const countrySlice = createSlice({
    name: "country", // Changed from "countries" to match your store structure
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        },
        setSelectedCountry: (state, action) => {
            state.selectedCountry = action.payload;
        },
        clearSelectedCountry: (state) => {
            state.selectedCountry = null;
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Countries
            .addCase(fetchCountries.pending, (state) => {
                state.loading.fetch = true;
                state.error = null;
            })
            .addCase(fetchCountries.fulfilled, (state, action) => {
                console.log("Reducer received payload:", action.payload); // Debug log
                state.loading.fetch = false;
                state.countries = action.payload.countries;
                state.message = action.payload.message;
                state.error = null;
            })
            .addCase(fetchCountries.rejected, (state, action) => {
                console.log("Reducer rejected with:", action.payload); // Debug log
                state.loading.fetch = false;
                state.error = action.payload;
            })

            // Fetch Country By ID
            .addCase(fetchCountryById.pending, (state) => {
                state.loading.fetch = true;
                state.error = null;
            })
            .addCase(fetchCountryById.fulfilled, (state, action) => {
                state.loading.fetch = false;
                state.selectedCountry = action.payload.country;
                state.message = action.payload.message;
                state.error = null;
            })
            .addCase(fetchCountryById.rejected, (state, action) => {
                state.loading.fetch = false;
                state.error = action.payload;
            })

            // Create Country
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
            })

            // Update Country
            .addCase(updateCountry.pending, (state) => {
                state.loading.update = true;
                state.error = null;
            })
            .addCase(updateCountry.fulfilled, (state, action) => {
                state.loading.update = false;
                const index = state.countries.findIndex(
                    (c) => c.id === action.payload.country.id
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
            })

            // Delete Country
            .addCase(deleteCountry.pending, (state) => {
                state.loading.delete = true;
                state.error = null;
            })
            .addCase(deleteCountry.fulfilled, (state, action) => {
                state.loading.delete = false;
                state.countries = state.countries.filter(
                    (c) => c.id !== action.payload.countryId
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
    },
});

export const {
    clearError,
    clearMessage,
    setSelectedCountry,
    clearSelectedCountry,
    resetState,
} = countrySlice.actions;

// ===== SELECTORS =====

// Base selectors - Fixed to match your store structure (state.country)
const selectCountryState = (state) => state.country;
const selectCountriesArray = (state) => state.country?.countries;
const selectSelectedCountryState = (state) => state.country?.selectedCountry;
const selectLoadingState = (state) => state.country?.loading;
const selectErrorState = (state) => state.country?.error;
const selectMessageState = (state) => state.country?.message;

// Memoized selectors
export const selectCountries = createSelector(
    [selectCountriesArray],
    (countries) => {
        console.log("Selector selectCountries called with:", countries); // Debug log
        return countries || [];
    }
);

export const selectSelectedCountry = createSelector(
    [selectSelectedCountryState],
    (selectedCountry) => selectedCountry
);

export const selectLoading = createSelector(
    [selectLoadingState],
    (loading) => loading || initialState.loading
);

export const selectError = createSelector([selectErrorState], (error) => error);

export const selectMessage = createSelector(
    [selectMessageState],
    (message) => message
);

// Derived selectors
export const selectIsLoading = createSelector([selectLoading], (loading) =>
    Object.values(loading).some(Boolean)
);

export const selectCountriesCount = createSelector(
    [selectCountries],
    (countries) => countries.length
);

// Specific loading selectors
export const selectIsFetchLoading = createSelector(
    [selectLoading],
    (loading) => loading.fetch
);

export const selectIsCreateLoading = createSelector(
    [selectLoading],
    (loading) => loading.create
);

export const selectIsUpdateLoading = createSelector(
    [selectLoading],
    (loading) => loading.update
);

export const selectIsDeleteLoading = createSelector(
    [selectLoading],
    (loading) => loading.delete
);

export default countrySlice.reducer;
