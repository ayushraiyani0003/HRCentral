import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    uploadSlipExcel,
    connectToSlipProgressStream
} from "../services/slipGenerateService";

// Upload and start slip generation
export const generateSlips = createAsyncThunk(
    "slipGenerate/generateSlips",
    async (formData, { rejectWithValue, dispatch }) => {
        try {
            const uploadResponse = await uploadSlipExcel(formData);

            if (uploadResponse.success && uploadResponse.filePath) {
                dispatch(startStreamProgress(uploadResponse.filePath));
                return uploadResponse;
            } else {
                return rejectWithValue(uploadResponse.error || "Upload successful but no file path returned");
            }
        } catch (err) {
            return rejectWithValue(err.message || "Failed to upload file");
        }
    }
);

// Connect to SSE for progress tracking
export const startStreamProgress = createAsyncThunk(
    "slipGenerate/startStreamProgress",
    async (filePath, { dispatch }) => {
        const progressStream = connectToSlipProgressStream(filePath, {
            onInfo: (data) => dispatch(updateInfo(data)),
            onProgress: (data) => dispatch(updateProgress(data)),
            onComplete: (data) => dispatch(streamCompleted(data)),
            onError: (error) => dispatch(streamError(error))
        });

        return { started: true, filePath, progressStream };
    }
);

const initialState = {
    loading: false,
    streaming: false,
    success: false,
    error: null,
    message: "",

    total: 0,
    generated: 0,
    failed: 0,
    pending: 0,
    processed: 0,
    percentage: 0,
    tracking: [],

    zipPath: null,
    zipFilename: null,
    completed: false,

    downloading: false,
    downloadSuccess: false,
    downloadError: null,
};

const slipGenerateSlice = createSlice({
    name: "slipGenerate",
    initialState,
    reducers: {
        resetSlipGeneration: () => ({ ...initialState }),

        updateInfo: (state, action) => {
            state.message = action.payload.message || "";
        },

        updateProgress: (state, action) => {
            const payload = action.payload;
            if (payload.total !== undefined) state.total = payload.total;
            if (payload.generated !== undefined) state.generated = payload.generated;
            if (payload.failed !== undefined) state.failed = payload.failed;
            if (payload.pending !== undefined) state.pending = payload.pending;
            if (payload.processed !== undefined) state.processed = payload.processed;
            if (payload.percentage !== undefined) state.percentage = payload.percentage;
            if (payload.tracking) state.tracking = payload.tracking;
            if (payload.message) state.message = payload.message;
            if (payload.error) {
                state.error = payload.error;
                state.streaming = false;
            }
        },

        streamCompleted: (state, action) => {
            const payload = action.payload;
            state.streaming = false;
            state.completed = true;
            state.success = true;
            state.message = "Processing completed successfully";
            if (payload.zipPath) state.zipPath = payload.zipPath;
            if (payload.zipFilename) state.zipFilename = payload.zipFilename;
            if (payload.total !== undefined) state.total = payload.total;
            if (payload.generated !== undefined) state.generated = payload.generated;
            if (payload.failed !== undefined) state.failed = payload.failed;
            if (payload.tracking) state.tracking = payload.tracking;
            state.percentage = 100;
        },

        streamError: (state, action) => {
            state.streaming = false;
            state.error = action.payload || "Stream connection error";
            state.message = "Processing failed: " + (action.payload || "Unknown error");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(generateSlips.pending, (state) => {
                Object.assign(state, {
                    loading: true,
                    streaming: false,
                    success: false,
                    error: null,
                    message: "Uploading file...",
                    completed: false,
                    total: 0,
                    generated: 0,
                    failed: 0,
                    pending: 0,
                    processed: 0,
                    percentage: 0,
                    tracking: [],
                    zipPath: null,
                    zipFilename: null,
                });
            })
            .addCase(generateSlips.fulfilled, (state) => {
                state.loading = false;
                state.message = "File uploaded successfully. Starting processing...";
            })
            .addCase(generateSlips.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to upload file";
                state.message = "Upload failed: " + (action.payload || "Unknown error");
            })

            .addCase(startStreamProgress.pending, (state) => {
                state.streaming = true;
                state.message = "Connecting to stream...";
            })
            .addCase(startStreamProgress.fulfilled, (state) => {
                state.message = "Processing payslips...";
            })
            .addCase(startStreamProgress.rejected, (state, action) => {
                state.streaming = false;
                state.error = action.payload || "Failed to connect to stream";
                state.message = "Connection failed: " + (action.payload || "Unknown error");
            })

           
    },
});

export const {
    resetSlipGeneration,
    updateInfo,
    updateProgress,
    streamCompleted,
    streamError
} = slipGenerateSlice.actions;

export default slipGenerateSlice.reducer;