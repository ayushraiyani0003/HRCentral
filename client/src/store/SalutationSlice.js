// /**
//  * @fileoverview Redux reducer for Salutation state management
//  * @version 1.0.0
//  */

// Action Types
export const SALUTATION_ACTIONS = {
    // Loading states
    SET_LOADING: "salutation/SET_LOADING",
    SET_ERROR: "salutation/SET_ERROR",
    CLEAR_ERROR: "salutation/CLEAR_ERROR",

    // CRUD operations
    CREATE_SALUTATION_REQUEST: "salutation/CREATE_SALUTATION_REQUEST",
    CREATE_SALUTATION_SUCCESS: "salutation/CREATE_SALUTATION_SUCCESS",
    CREATE_SALUTATION_FAILURE: "salutation/CREATE_SALUTATION_FAILURE",

    GET_ALL_SALUTATIONS_REQUEST: "salutation/GET_ALL_SALUTATIONS_REQUEST",
    GET_ALL_SALUTATIONS_SUCCESS: "salutation/GET_ALL_SALUTATIONS_SUCCESS",
    GET_ALL_SALUTATIONS_FAILURE: "salutation/GET_ALL_SALUTATIONS_FAILURE",

    GET_SALUTATION_BY_ID_REQUEST: "salutation/GET_SALUTATION_BY_ID_REQUEST",
    GET_SALUTATION_BY_ID_SUCCESS: "salutation/GET_SALUTATION_BY_ID_SUCCESS",
    GET_SALUTATION_BY_ID_FAILURE: "salutation/GET_SALUTATION_BY_ID_FAILURE",

    UPDATE_SALUTATION_REQUEST: "salutation/UPDATE_SALUTATION_REQUEST",
    UPDATE_SALUTATION_SUCCESS: "salutation/UPDATE_SALUTATION_SUCCESS",
    UPDATE_SALUTATION_FAILURE: "salutation/UPDATE_SALUTATION_FAILURE",

    DELETE_SALUTATION_REQUEST: "salutation/DELETE_SALUTATION_REQUEST",
    DELETE_SALUTATION_SUCCESS: "salutation/DELETE_SALUTATION_SUCCESS",
    DELETE_SALUTATION_FAILURE: "salutation/DELETE_SALUTATION_FAILURE",

    // Search operations
    SEARCH_SALUTATIONS_REQUEST: "salutation/SEARCH_SALUTATIONS_REQUEST",
    SEARCH_SALUTATIONS_SUCCESS: "salutation/SEARCH_SALUTATIONS_SUCCESS",
    SEARCH_SALUTATIONS_FAILURE: "salutation/SEARCH_SALUTATIONS_FAILURE",

    // Bulk operations
    BULK_CREATE_SALUTATIONS_REQUEST:
        "salutation/BULK_CREATE_SALUTATIONS_REQUEST",
    BULK_CREATE_SALUTATIONS_SUCCESS:
        "salutation/BULK_CREATE_SALUTATIONS_SUCCESS",
    BULK_CREATE_SALUTATIONS_FAILURE:
        "salutation/BULK_CREATE_SALUTATIONS_FAILURE",

    // Utility operations
    GET_SALUTATIONS_COUNT_SUCCESS: "salutation/GET_SALUTATIONS_COUNT_SUCCESS",
    GET_SORTED_SALUTATIONS_SUCCESS: "salutation/GET_SORTED_SALUTATIONS_SUCCESS",
    CHECK_SALUTATION_EXISTS_SUCCESS:
        "salutation/CHECK_SALUTATION_EXISTS_SUCCESS",

    // Pagination and filtering
    SET_PAGINATION: "salutation/SET_PAGINATION",
    SET_FILTERS: "salutation/SET_FILTERS",
    RESET_FILTERS: "salutation/RESET_FILTERS",
};

// Initial State
const initialState = {
    // Data
    items: [],
    currentItem: null,
    sortedItems: [],
    searchResults: [],

    // Pagination
    pagination: {
        total: 0,
        limit: 10,
        offset: 0,
        totalPages: 0,
        currentPage: 1,
    },

    // Filters and sorting
    filters: {
        orderBy: "name",
        orderDirection: "ASC",
        searchTerm: "",
    },

    // Loading states
    loading: {
        create: false,
        read: false,
        update: false,
        delete: false,
        search: false,
        bulk: false,
    },

    // Error handling
    error: null,

    // Utility data
    totalCount: 0,
    existsCheck: null,
};

// Helper function to update loading state
const setLoadingState = (state, operation, isLoading) => ({
    ...state,
    loading: {
        ...state.loading,
        [operation]: isLoading,
    },
    ...(isLoading ? {} : { error: null }), // Clear error when starting new operation
});

// Helper function to handle errors
const setErrorState = (state, operation, error) => ({
    ...state,
    loading: {
        ...state.loading,
        [operation]: false,
    },
    error: error,
});

// Helper function to update item in array
const updateItemInArray = (items, updatedItem) => {
    return items.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
    );
};

// Helper function to remove item from array
const removeItemFromArray = (items, itemId) => {
    return items.filter((item) => item.id !== itemId);
};

// Reducer
const salutationReducer = (state = initialState, action) => {
    switch (action.type) {
        // Loading and error management
        case SALUTATION_ACTIONS.SET_LOADING:
            return setLoadingState(
                state,
                action.payload.operation,
                action.payload.isLoading
            );

        case SALUTATION_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
            };

        case SALUTATION_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null,
            };

        // Create Salutation
        case SALUTATION_ACTIONS.CREATE_SALUTATION_REQUEST:
            return setLoadingState(state, "create", true);

        case SALUTATION_ACTIONS.CREATE_SALUTATION_SUCCESS:
            return {
                ...setLoadingState(state, "create", false),
                items: [...state.items, action.payload],
                totalCount: state.totalCount + 1,
            };

        case SALUTATION_ACTIONS.CREATE_SALUTATION_FAILURE:
            return setErrorState(state, "create", action.payload);

        // Get All Salutations
        case SALUTATION_ACTIONS.GET_ALL_SALUTATIONS_REQUEST:
            return setLoadingState(state, "read", true);

        case SALUTATION_ACTIONS.GET_ALL_SALUTATIONS_SUCCESS:
            return {
                ...setLoadingState(state, "read", false),
                items: action.payload.data || action.payload,
                pagination: {
                    ...state.pagination,
                    total:
                        action.payload.total ||
                        action.payload.data?.length ||
                        0,
                    totalPages:
                        action.payload.totalPages ||
                        Math.ceil(
                            (action.payload.total || 0) / state.pagination.limit
                        ),
                },
            };

        case SALUTATION_ACTIONS.GET_ALL_SALUTATIONS_FAILURE:
            return setErrorState(state, "read", action.payload);

        // Get Salutation by ID
        case SALUTATION_ACTIONS.GET_SALUTATION_BY_ID_REQUEST:
            return setLoadingState(state, "read", true);

        case SALUTATION_ACTIONS.GET_SALUTATION_BY_ID_SUCCESS:
            return {
                ...setLoadingState(state, "read", false),
                currentItem: action.payload,
            };

        case SALUTATION_ACTIONS.GET_SALUTATION_BY_ID_FAILURE:
            return setErrorState(state, "read", action.payload);

        // Update Salutation
        case SALUTATION_ACTIONS.UPDATE_SALUTATION_REQUEST:
            return setLoadingState(state, "update", true);

        case SALUTATION_ACTIONS.UPDATE_SALUTATION_SUCCESS:
            return {
                ...setLoadingState(state, "update", false),
                items: updateItemInArray(state.items, action.payload),
                currentItem:
                    state.currentItem?.id === action.payload.id
                        ? action.payload
                        : state.currentItem,
            };

        case SALUTATION_ACTIONS.UPDATE_SALUTATION_FAILURE:
            return setErrorState(state, "update", action.payload);

        // Delete Salutation
        case SALUTATION_ACTIONS.DELETE_SALUTATION_REQUEST:
            return setLoadingState(state, "delete", true);

        case SALUTATION_ACTIONS.DELETE_SALUTATION_SUCCESS:
            return {
                ...setLoadingState(state, "delete", false),
                items: removeItemFromArray(state.items, action.payload.id),
                currentItem:
                    state.currentItem?.id === action.payload.id
                        ? null
                        : state.currentItem,
                totalCount: Math.max(0, state.totalCount - 1),
            };

        case SALUTATION_ACTIONS.DELETE_SALUTATION_FAILURE:
            return setErrorState(state, "delete", action.payload);

        // Search Salutations
        case SALUTATION_ACTIONS.SEARCH_SALUTATIONS_REQUEST:
            return setLoadingState(state, "search", true);

        case SALUTATION_ACTIONS.SEARCH_SALUTATIONS_SUCCESS:
            return {
                ...setLoadingState(state, "search", false),
                searchResults: action.payload.data || action.payload,
                filters: {
                    ...state.filters,
                    searchTerm:
                        action.payload.searchTerm || state.filters.searchTerm,
                },
            };

        case SALUTATION_ACTIONS.SEARCH_SALUTATIONS_FAILURE:
            return setErrorState(state, "search", action.payload);

        // Bulk Create Salutations
        case SALUTATION_ACTIONS.BULK_CREATE_SALUTATIONS_REQUEST:
            return setLoadingState(state, "bulk", true);

        case SALUTATION_ACTIONS.BULK_CREATE_SALUTATIONS_SUCCESS:
            return {
                ...setLoadingState(state, "bulk", false),
                items: [
                    ...state.items,
                    ...(action.payload.data || action.payload),
                ],
                totalCount:
                    state.totalCount +
                    (action.payload.data?.length || action.payload.length || 0),
            };

        case SALUTATION_ACTIONS.BULK_CREATE_SALUTATIONS_FAILURE:
            return setErrorState(state, "bulk", action.payload);

        // Utility Actions
        case SALUTATION_ACTIONS.GET_SALUTATIONS_COUNT_SUCCESS:
            return {
                ...state,
                totalCount: action.payload.count || action.payload,
            };

        case SALUTATION_ACTIONS.GET_SORTED_SALUTATIONS_SUCCESS:
            return {
                ...state,
                sortedItems: action.payload.data || action.payload,
            };

        case SALUTATION_ACTIONS.CHECK_SALUTATION_EXISTS_SUCCESS:
            return {
                ...state,
                existsCheck: action.payload,
            };

        // Pagination and Filtering
        case SALUTATION_ACTIONS.SET_PAGINATION:
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    ...action.payload,
                },
            };

        case SALUTATION_ACTIONS.SET_FILTERS:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    ...action.payload,
                },
            };

        case SALUTATION_ACTIONS.RESET_FILTERS:
            return {
                ...state,
                filters: initialState.filters,
                searchResults: [],
            };

        default:
            return state;
    }
};

// Action Creators
export const salutationActions = {
    // Loading and error actions
    setLoading: (operation, isLoading) => ({
        type: SALUTATION_ACTIONS.SET_LOADING,
        payload: { operation, isLoading },
    }),

    setError: (error) => ({
        type: SALUTATION_ACTIONS.SET_ERROR,
        payload: error,
    }),

    clearError: () => ({
        type: SALUTATION_ACTIONS.CLEAR_ERROR,
    }),

    // Create actions
    createSalutationRequest: () => ({
        type: SALUTATION_ACTIONS.CREATE_SALUTATION_REQUEST,
    }),

    createSalutationSuccess: (salutation) => ({
        type: SALUTATION_ACTIONS.CREATE_SALUTATION_SUCCESS,
        payload: salutation,
    }),

    createSalutationFailure: (error) => ({
        type: SALUTATION_ACTIONS.CREATE_SALUTATION_FAILURE,
        payload: error,
    }),

    // Read actions
    getAllSalutationsRequest: () => ({
        type: SALUTATION_ACTIONS.GET_ALL_SALUTATIONS_REQUEST,
    }),

    getAllSalutationsSuccess: (data) => ({
        type: SALUTATION_ACTIONS.GET_ALL_SALUTATIONS_SUCCESS,
        payload: data,
    }),

    getAllSalutationsFailure: (error) => ({
        type: SALUTATION_ACTIONS.GET_ALL_SALUTATIONS_FAILURE,
        payload: error,
    }),

    getSalutationByIdRequest: () => ({
        type: SALUTATION_ACTIONS.GET_SALUTATION_BY_ID_REQUEST,
    }),

    getSalutationByIdSuccess: (salutation) => ({
        type: SALUTATION_ACTIONS.GET_SALUTATION_BY_ID_SUCCESS,
        payload: salutation,
    }),

    getSalutationByIdFailure: (error) => ({
        type: SALUTATION_ACTIONS.GET_SALUTATION_BY_ID_FAILURE,
        payload: error,
    }),

    // Update actions
    updateSalutationRequest: () => ({
        type: SALUTATION_ACTIONS.UPDATE_SALUTATION_REQUEST,
    }),

    updateSalutationSuccess: (salutation) => ({
        type: SALUTATION_ACTIONS.UPDATE_SALUTATION_SUCCESS,
        payload: salutation,
    }),

    updateSalutationFailure: (error) => ({
        type: SALUTATION_ACTIONS.UPDATE_SALUTATION_FAILURE,
        payload: error,
    }),

    // Delete actions
    deleteSalutationRequest: () => ({
        type: SALUTATION_ACTIONS.DELETE_SALUTATION_REQUEST,
    }),

    deleteSalutationSuccess: (deletedItem) => ({
        type: SALUTATION_ACTIONS.DELETE_SALUTATION_SUCCESS,
        payload: deletedItem,
    }),

    deleteSalutationFailure: (error) => ({
        type: SALUTATION_ACTIONS.DELETE_SALUTATION_FAILURE,
        payload: error,
    }),

    // Search actions
    searchSalutationsRequest: () => ({
        type: SALUTATION_ACTIONS.SEARCH_SALUTATIONS_REQUEST,
    }),

    searchSalutationsSuccess: (data) => ({
        type: SALUTATION_ACTIONS.SEARCH_SALUTATIONS_SUCCESS,
        payload: data,
    }),

    searchSalutationsFailure: (error) => ({
        type: SALUTATION_ACTIONS.SEARCH_SALUTATIONS_FAILURE,
        payload: error,
    }),

    // Bulk actions
    bulkCreateSalutationsRequest: () => ({
        type: SALUTATION_ACTIONS.BULK_CREATE_SALUTATIONS_REQUEST,
    }),

    bulkCreateSalutationsSuccess: (salutations) => ({
        type: SALUTATION_ACTIONS.BULK_CREATE_SALUTATIONS_SUCCESS,
        payload: salutations,
    }),

    bulkCreateSalutationsFailure: (error) => ({
        type: SALUTATION_ACTIONS.BULK_CREATE_SALUTATIONS_FAILURE,
        payload: error,
    }),

    // Utility actions
    getSalutationsCountSuccess: (count) => ({
        type: SALUTATION_ACTIONS.GET_SALUTATIONS_COUNT_SUCCESS,
        payload: count,
    }),

    getSortedSalutationsSuccess: (salutations) => ({
        type: SALUTATION_ACTIONS.GET_SORTED_SALUTATIONS_SUCCESS,
        payload: salutations,
    }),

    checkSalutationExistsSuccess: (existsData) => ({
        type: SALUTATION_ACTIONS.CHECK_SALUTATION_EXISTS_SUCCESS,
        payload: existsData,
    }),

    // Pagination and filtering actions
    setPagination: (paginationData) => ({
        type: SALUTATION_ACTIONS.SET_PAGINATION,
        payload: paginationData,
    }),

    setFilters: (filters) => ({
        type: SALUTATION_ACTIONS.SET_FILTERS,
        payload: filters,
    }),

    resetFilters: () => ({
        type: SALUTATION_ACTIONS.RESET_FILTERS,
    }),
};

// Selectors
export const salutationSelectors = {
    // Basic selectors
    getAllSalutations: (state) => state.salutation.items,
    getCurrentSalutation: (state) => state.salutation.currentItem,
    getSortedSalutations: (state) => state.salutation.sortedItems,
    getSearchResults: (state) => state.salutation.searchResults,

    // Loading selectors
    getLoadingState: (state) => state.salutation.loading,
    isCreating: (state) => state.salutation.loading.create,
    isReading: (state) => state.salutation.loading.read,
    isUpdating: (state) => state.salutation.loading.update,
    isDeleting: (state) => state.salutation.loading.delete,
    isSearching: (state) => state.salutation.loading.search,
    isBulkOperating: (state) => state.salutation.loading.bulk,

    // Error selectors
    getError: (state) => state.salutation.error,

    // Pagination selectors
    getPagination: (state) => state.salutation.pagination,
    getFilters: (state) => state.salutation.filters,
    getTotalCount: (state) => state.salutation.totalCount,

    // Utility selectors
    getExistsCheck: (state) => state.salutation.existsCheck,

    // Computed selectors
    getSalutationById: (state, id) =>
        state.salutation.items.find((item) => item.id === id),

    getSalutationByName: (state, name) =>
        state.salutation.items.find(
            (item) => item.name.toLowerCase() === name.toLowerCase()
        ),

    getFilteredSalutations: (state) => {
        const { items } = state.salutation;
        const { searchTerm, orderBy, orderDirection } =
            state.salutation.filters;

        let filtered = items;

        if (searchTerm) {
            filtered = items.filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (orderBy) {
            filtered = [...filtered].sort((a, b) => {
                const aVal = a[orderBy];
                const bVal = b[orderBy];

                if (orderDirection === "ASC") {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });
        }

        return filtered;
    },
};

export default salutationReducer;
