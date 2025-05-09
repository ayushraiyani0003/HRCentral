import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadSlipExcel, streamSlipProgress } from "../services/slipGenerateService";

// Thunk for uploading the file
export const generateSlips = createAsyncThunk(
    "slipGenerate/generateSlips",
    async (formData, { rejectWithValue, dispatch }) => {
        try {
            // Upload the file
            const uploadResponse = await uploadSlipExcel(formData);
            const filePath = uploadResponse.filePath;

            // Start streaming the progress after file upload
            dispatch(startStreamProgress(filePath)); // Start streaming the progress

            return uploadResponse; // Return the upload response
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Thunk to handle the streaming progress
export const startStreamProgress = createAsyncThunk(
    "slipGenerate/startStreamProgress",
    async (filePath, { rejectWithValue }) => {
        try {
            const response = await streamSlipProgress(filePath); // This could be a WebSocket or EventSource
            return response;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const slipGenerateSlice = createSlice({
    name: "slipGenerate",
    initialState: {
        loading: false,
        success: false,
        error: null,
        progress: [],
        zipFiles: [],
        rows: [],
    },
    reducers: {
        resetSlipGeneration: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.progress = [];
            state.zipFiles = [];
            state.rows = [];
        },
        updateProgress: (state, action) => {
            state.progress = action.payload.tracking;
            state.zipFiles = action.payload.zipFiles || [];

            if (Array.isArray(action.payload.slipRows)) {
                state.rows = action.payload.slipRows;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(generateSlips.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
                state.progress = [];
                state.zipFiles = [];
                state.rows = [];
            })
            .addCase(generateSlips.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.progress = action.payload.tracking;
                state.zipFiles = action.payload.zipFiles || [];

                if (Array.isArray(action.payload.slipRows)) {
                    state.rows = action.payload.slipRows;
                }
            })
            .addCase(generateSlips.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to generate slips.";
            })
            .addCase(startStreamProgress.fulfilled, (state, action) => {
                // When the streaming process is finished
                state.loading = false;
                state.success = true;
                state.progress = action.payload.tracking;
                state.zipFiles = action.payload.zipFiles || [];

                if (Array.isArray(action.payload.slipRows)) {
                    state.rows = action.payload.slipRows;
                }
            })
            .addCase(startStreamProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to stream progress.";
            });
    },
});

export const { resetSlipGeneration, updateProgress } = slipGenerateSlice.actions;
export default slipGenerateSlice.reducer;
