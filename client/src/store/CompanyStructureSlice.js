import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CompanyStructureService from "../services/CompanyStructureService";

// Initialize service instance
const companyService = new CompanyStructureService();

// ==============================
// Async Thunks
// ==============================

// Basic CRUD Operations
export const createCompanyStructure = createAsyncThunk(
    "companyStructure/create",
    async (data, { rejectWithValue }) => {
        try {
            const response = await companyService.create(data);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAllCompanyStructures = createAsyncThunk(
    "companyStructure/fetchAll",
    async (options = {}, { rejectWithValue }) => {
        try {
            const response = await companyService.getAll(options);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCompanyStructureById = createAsyncThunk(
    "companyStructure/fetchById",
    async ({ id, includeCountry = false }, { rejectWithValue }) => {
        try {
            const response = await companyService.getById(id, includeCountry);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateCompanyStructure = createAsyncThunk(
    "companyStructure/update",
    async ({ id, data }, { rejectWithValue }) => {
        console.log("companay data service", data);

        try {
            const response = await companyService.update(id, data);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteCompanyStructure = createAsyncThunk(
    "companyStructure/delete",
    async (id, { rejectWithValue }) => {
        try {
            const response = await companyService.delete(id);
            return { id, ...response };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Hierarchical Operations
export const fetchHierarchy = createAsyncThunk(
    "companyStructure/fetchHierarchy",
    async ({ id, includeCountry = false }, { rejectWithValue }) => {
        try {
            const response = await companyService.getHierarchy(
                id,
                includeCountry
            );
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCompanyTree = createAsyncThunk(
    "companyStructure/fetchTree",
    async (includeCountry = false, { rejectWithValue }) => {
        try {
            const response = await companyService.getTree(includeCountry);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchChildren = createAsyncThunk(
    "companyStructure/fetchChildren",
    async ({ parentId, includeCountry = false }, { rejectWithValue }) => {
        try {
            const response = await companyService.getChildren(
                parentId,
                includeCountry
            );
            return { parentId, children: response };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAncestors = createAsyncThunk(
    "companyStructure/fetchAncestors",
    async ({ id, includeCountry = false }, { rejectWithValue }) => {
        try {
            const response = await companyService.getAncestors(
                id,
                includeCountry
            );
            return { id, ancestors: response };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const moveEntity = createAsyncThunk(
    "companyStructure/moveEntity",
    async ({ id, newParentId, additionalData = {} }, { rejectWithValue }) => {
        try {
            const response = await companyService.moveEntity(
                id,
                newParentId,
                additionalData
            );
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Country/Region Operations
export const fetchByCountry = createAsyncThunk(
    "companyStructure/fetchByCountry",
    async ({ countryId, options = {} }, { rejectWithValue }) => {
        try {
            const response = await companyService.getByCountry(
                countryId,
                options
            );
            return { countryId, data: response };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchByRegion = createAsyncThunk(
    "companyStructure/fetchByRegion",
    async ({ region, options = {} }, { rejectWithValue }) => {
        try {
            const response = await companyService.getByRegion(region, options);
            return { region, data: response };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCountryStats = createAsyncThunk(
    "companyStructure/fetchCountryStats",
    async (_, { rejectWithValue }) => {
        try {
            const response = await companyService.getCountryStats();
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// ==============================
// Initial State
// ==============================

const initialState = {
    // Data
    entities: [], // All company structures
    currentEntity: null, // Currently selected entity
    tree: null, // Hierarchical tree structure
    hierarchy: {}, // Hierarchies by entity ID
    children: {}, // Children by parent ID
    ancestors: {}, // Ancestors by entity ID
    countryData: {}, // Data grouped by country
    regionData: {}, // Data grouped by region
    countryStats: null, // Country statistics

    // Loading states
    loading: {
        entities: false,
        currentEntity: false,
        tree: false,
        hierarchy: false,
        children: false,
        ancestors: false,
        create: false,
        update: false,
        delete: false,
        move: false,
        countryData: false,
        regionData: false,
        countryStats: false,
    },

    // Error states
    errors: {
        entities: null,
        currentEntity: null,
        tree: null,
        hierarchy: null,
        children: null,
        ancestors: null,
        create: null,
        update: null,
        delete: null,
        move: null,
        countryData: null,
        regionData: null,
        countryStats: null,
    },

    // UI state
    pagination: {
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 0,
    },

    // Filters
    filters: {
        country_id: null,
        region: null,
        includeCountry: false,
    },
};

// ==============================
// Helper Functions
// ==============================

const updateEntityInList = (entities, updatedEntity) => {
    return entities.map((entity) =>
        entity.id === updatedEntity.id
            ? { ...entity, ...updatedEntity }
            : entity
    );
};

const removeEntityFromList = (entities, entityId) => {
    return entities.filter((entity) => entity.id !== entityId);
};

// ==============================
// Slice Definition
// ==============================

const companyStructureSlice = createSlice({
    name: "companyStructure",
    initialState,
    reducers: {
        // Clear specific data
        clearCurrentEntity: (state) => {
            state.currentEntity = null;
            state.errors.currentEntity = null;
        },

        clearTree: (state) => {
            state.tree = null;
            state.errors.tree = null;
        },

        clearHierarchy: (state, action) => {
            if (action.payload) {
                delete state.hierarchy[action.payload];
                delete state.errors.hierarchy;
            } else {
                state.hierarchy = {};
                state.errors.hierarchy = null;
            }
        },

        clearChildren: (state, action) => {
            if (action.payload) {
                delete state.children[action.payload];
            } else {
                state.children = {};
            }
            state.errors.children = null;
        },

        clearAncestors: (state, action) => {
            if (action.payload) {
                delete state.ancestors[action.payload];
            } else {
                state.ancestors = {};
            }
            state.errors.ancestors = null;
        },

        // Update filters
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },

        clearFilters: (state) => {
            state.filters = initialState.filters;
        },

        // Update pagination
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },

        // Clear all errors
        clearAllErrors: (state) => {
            state.errors = initialState.errors;
        },

        clearError: (state, action) => {
            if (action.payload && state.errors[action.payload] !== undefined) {
                state.errors[action.payload] = null;
            }
        },

        // Set auth token
        setAuthToken: (state, action) => {
            // This would typically be handled in middleware or service initialization
            companyService.setAuthToken(action.payload);
        },
    },
    extraReducers: (builder) => {
        // Create Company Structure
        builder
            .addCase(createCompanyStructure.pending, (state) => {
                state.loading.create = true;
                state.errors.create = null;
            })
            .addCase(createCompanyStructure.fulfilled, (state, action) => {
                state.loading.create = false;
                state.entities.unshift(action.payload);
                state.pagination.totalItems += 1;
            })
            .addCase(createCompanyStructure.rejected, (state, action) => {
                state.loading.create = false;
                state.errors.create = action.payload;
            });

        // Fetch All Company Structures
        builder
            .addCase(fetchAllCompanyStructures.pending, (state) => {
                state.loading.entities = true;
                state.errors.entities = null;
            })
            .addCase(fetchAllCompanyStructures.fulfilled, (state, action) => {
                state.loading.entities = false;
                state.entities = action.payload.data || action.payload;

                // Update pagination if provided
                if (action.payload.pagination) {
                    state.pagination = {
                        ...state.pagination,
                        ...action.payload.pagination,
                    };
                }
            })
            .addCase(fetchAllCompanyStructures.rejected, (state, action) => {
                state.loading.entities = false;
                state.errors.entities = action.payload;
            });

        // Fetch Company Structure By ID
        builder
            .addCase(fetchCompanyStructureById.pending, (state) => {
                state.loading.currentEntity = true;
                state.errors.currentEntity = null;
            })
            .addCase(fetchCompanyStructureById.fulfilled, (state, action) => {
                state.loading.currentEntity = false;
                state.currentEntity = action.payload;
            })
            .addCase(fetchCompanyStructureById.rejected, (state, action) => {
                state.loading.currentEntity = false;
                state.errors.currentEntity = action.payload;
            });

        // Update Company Structure
        builder
            .addCase(updateCompanyStructure.pending, (state) => {
                state.loading.update = true;
                state.errors.update = null;
            })
            .addCase(updateCompanyStructure.fulfilled, (state, action) => {
                state.loading.update = false;
                state.entities = updateEntityInList(
                    state.entities,
                    action.payload
                );

                // Update current entity if it's the same
                if (
                    state.currentEntity &&
                    state.currentEntity.id === action.payload.id
                ) {
                    state.currentEntity = {
                        ...state.currentEntity,
                        ...action.payload,
                    };
                }
            })
            .addCase(updateCompanyStructure.rejected, (state, action) => {
                state.loading.update = false;
                state.errors.update = action.payload;
            });

        // Delete Company Structure
        builder
            .addCase(deleteCompanyStructure.pending, (state) => {
                state.loading.delete = true;
                state.errors.delete = null;
            })
            .addCase(deleteCompanyStructure.fulfilled, (state, action) => {
                state.loading.delete = false;
                state.entities = removeEntityFromList(
                    state.entities,
                    action.payload.id
                );
                state.pagination.totalItems = Math.max(
                    0,
                    state.pagination.totalItems - 1
                );

                // Clear current entity if it was deleted
                if (
                    state.currentEntity &&
                    state.currentEntity.id === action.payload.id
                ) {
                    state.currentEntity = null;
                }
            })
            .addCase(deleteCompanyStructure.rejected, (state, action) => {
                state.loading.delete = false;
                state.errors.delete = action.payload;
            });

        // Fetch Hierarchy
        builder
            .addCase(fetchHierarchy.pending, (state) => {
                state.loading.hierarchy = true;
                state.errors.hierarchy = null;
            })
            .addCase(fetchHierarchy.fulfilled, (state, action) => {
                state.loading.hierarchy = false;
                // Store hierarchy data by entity ID for easy lookup
                const entityId = action.meta.arg.id;
                state.hierarchy[entityId] = action.payload;
            })
            .addCase(fetchHierarchy.rejected, (state, action) => {
                state.loading.hierarchy = false;
                state.errors.hierarchy = action.payload;
            });

        // Fetch Company Tree
        builder
            .addCase(fetchCompanyTree.pending, (state) => {
                state.loading.tree = true;
                state.errors.tree = null;
            })
            .addCase(fetchCompanyTree.fulfilled, (state, action) => {
                state.loading.tree = false;
                state.tree = action.payload;
            })
            .addCase(fetchCompanyTree.rejected, (state, action) => {
                state.loading.tree = false;
                state.errors.tree = action.payload;
            });

        // Fetch Children
        builder
            .addCase(fetchChildren.pending, (state) => {
                state.loading.children = true;
                state.errors.children = null;
            })
            .addCase(fetchChildren.fulfilled, (state, action) => {
                state.loading.children = false;
                state.children[action.payload.parentId] =
                    action.payload.children;
            })
            .addCase(fetchChildren.rejected, (state, action) => {
                state.loading.children = false;
                state.errors.children = action.payload;
            });

        // Fetch Ancestors
        builder
            .addCase(fetchAncestors.pending, (state) => {
                state.loading.ancestors = true;
                state.errors.ancestors = null;
            })
            .addCase(fetchAncestors.fulfilled, (state, action) => {
                state.loading.ancestors = false;
                state.ancestors[action.payload.id] = action.payload.ancestors;
            })
            .addCase(fetchAncestors.rejected, (state, action) => {
                state.loading.ancestors = false;
                state.errors.ancestors = action.payload;
            });

        // Move Entity
        builder
            .addCase(moveEntity.pending, (state) => {
                state.loading.move = true;
                state.errors.move = null;
            })
            .addCase(moveEntity.fulfilled, (state, action) => {
                state.loading.move = false;
                state.entities = updateEntityInList(
                    state.entities,
                    action.payload
                );

                // Update current entity if it's the same
                if (
                    state.currentEntity &&
                    state.currentEntity.id === action.payload.id
                ) {
                    state.currentEntity = {
                        ...state.currentEntity,
                        ...action.payload,
                    };
                }

                // Clear related cached data that might be affected
                state.tree = null;
                state.hierarchy = {};
                state.children = {};
                state.ancestors = {};
            })
            .addCase(moveEntity.rejected, (state, action) => {
                state.loading.move = false;
                state.errors.move = action.payload;
            });

        // Fetch By Country
        builder
            .addCase(fetchByCountry.pending, (state) => {
                state.loading.countryData = true;
                state.errors.countryData = null;
            })
            .addCase(fetchByCountry.fulfilled, (state, action) => {
                state.loading.countryData = false;
                state.countryData[action.payload.countryId] =
                    action.payload.data;
            })
            .addCase(fetchByCountry.rejected, (state, action) => {
                state.loading.countryData = false;
                state.errors.countryData = action.payload;
            });

        // Fetch By Region
        builder
            .addCase(fetchByRegion.pending, (state) => {
                state.loading.regionData = true;
                state.errors.regionData = null;
            })
            .addCase(fetchByRegion.fulfilled, (state, action) => {
                state.loading.regionData = false;
                state.regionData[action.payload.region] = action.payload.data;
            })
            .addCase(fetchByRegion.rejected, (state, action) => {
                state.loading.regionData = false;
                state.errors.regionData = action.payload;
            });

        // Fetch Country Stats
        builder
            .addCase(fetchCountryStats.pending, (state) => {
                state.loading.countryStats = true;
                state.errors.countryStats = null;
            })
            .addCase(fetchCountryStats.fulfilled, (state, action) => {
                state.loading.countryStats = false;
                state.countryStats = action.payload;
            })
            .addCase(fetchCountryStats.rejected, (state, action) => {
                state.loading.countryStats = false;
                state.errors.countryStats = action.payload;
            });
    },
});

// ==============================
// Exports
// ==============================

export const {
    clearCurrentEntity,
    clearTree,
    clearHierarchy,
    clearChildren,
    clearAncestors,
    setFilters,
    clearFilters,
    setPagination,
    clearAllErrors,
    clearError,
    setAuthToken,
} = companyStructureSlice.actions;

// Selectors
export const selectCompanyStructures = (state) =>
    state.companyStructure.entities;
export const selectCurrentEntity = (state) =>
    state.companyStructure.currentEntity;
export const selectCompanyTree = (state) => state.companyStructure.tree;
export const selectHierarchyById = (id) => (state) =>
    state.companyStructure.hierarchy[id];
export const selectChildrenByParentId = (parentId) => (state) =>
    state.companyStructure.children[parentId];
export const selectAncestorsById = (id) => (state) =>
    state.companyStructure.ancestors[id];
export const selectCountryData = (countryId) => (state) =>
    state.companyStructure.countryData[countryId];
export const selectRegionData = (region) => (state) =>
    state.companyStructure.regionData[region];
export const selectCountryStats = (state) =>
    state.companyStructure.countryStats;
export const selectLoading = (state) => state.companyStructure.loading;
export const selectErrors = (state) => state.companyStructure.errors;
export const selectFilters = (state) => state.companyStructure.filters;
export const selectPagination = (state) => state.companyStructure.pagination;

// Computed selectors
export const selectIsLoading = (state) => {
    const loading = state.companyStructure.loading;
    return Object.values(loading).some((isLoading) => isLoading);
};

export const selectHasErrors = (state) => {
    const errors = state.companyStructure.errors;
    return Object.values(errors).some((error) => error !== null);
};

export default companyStructureSlice.reducer;

// Fix : Uncaught TypeError: Cannot read properties of undefined (reading 'entities')
