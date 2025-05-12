import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadSlipExcel, connectToSlipProgressStream } from "../services/slipGenerateService";

// Thunk for uploading the file
export const generateSlips = createAsyncThunk(
    "slipGenerate/generateSlips",
    async (formData, { rejectWithValue, dispatch }) => {
        try {
            // Upload the file
            const uploadResponse = await uploadSlipExcel(formData);

            if (uploadResponse.success && uploadResponse.filePath) {
                // Start streaming the progress after file upload
                dispatch(startStreamProgress(uploadResponse.filePath));
                return uploadResponse;
            } else {
                return rejectWithValue("Upload successful but no file path returned");
            }
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Thunk to handle the streaming progress
export const startStreamProgress = createAsyncThunk(
    "slipGenerate/startStreamProgress",
    async (filePath, { dispatch }) => {
        // This doesn't return anything immediately - it sets up the SSE connection
        // and dispatches actions as messages arrive
        const progressStream = connectToSlipProgressStream(filePath, {
            onProgress: (data) => {
                dispatch(updateProgress(data));
            },
            onComplete: (data) => {
                dispatch(streamCompleted(data));
            },
            onError: (error) => {
                dispatch(streamError(error));
            }
        });

        return { started: true, filePath, progressStream };
    }
);

const slipGenerateSlice = createSlice({
    name: "slipGenerate",
    initialState: {
        loading: false,
        streaming: false,
        success: false,
        error: null,
        progress: [],
        zipFiles: [],
        rows: [],
        completed: false,
    },
    reducers: {
        resetSlipGeneration: (state) => {
            state.loading = false;
            state.streaming = false;
            state.success = false;
            state.error = null;
            state.progress = [];
            state.zipFiles = [];
            state.rows = [];
            state.completed = false;
        },
        updateProgress: (state, action) => {
            // Track ongoing progress (e.g., percentage or status updates)
            state.progress = action.payload.tracking || state.progress;
            state.zipFiles = action.payload.zipFiles || state.zipFiles;

            if (Array.isArray(action.payload.slipRows)) {
                state.rows = action.payload.slipRows;
            }
        },
        streamCompleted: (state, action) => {
            // Mark streaming as complete and set the necessary data
            state.streaming = false;
            state.completed = true;
            state.success = true;

            if (action.payload) {
                state.progress = action.payload.tracking || state.progress;
                state.zipFiles = action.payload.zipFiles || state.zipFiles;

                if (Array.isArray(action.payload.slipRows)) {
                    state.rows = action.payload.slipRows;
                }
            }
        },
        streamError: (state, action) => {
            // Mark streaming as failed
            state.streaming = false;
            state.error = action.payload || "Stream connection error";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(generateSlips.pending, (state) => {
                state.loading = true;
                state.streaming = false;
                state.success = false;
                state.error = null;
                state.progress = [];
                state.zipFiles = [];
                state.rows = [];
                state.completed = false;
            })
            .addCase(generateSlips.fulfilled, (state) => {
                state.loading = false;
                // Do not set success=true here since the process continues with streaming
            })
            .addCase(generateSlips.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to generate slips.";
            })
            .addCase(startStreamProgress.pending, (state) => {
                state.streaming = true;
            })
            .addCase(startStreamProgress.fulfilled, (state) => {
                // This action only confirms that streaming has started
                state.success = true;
            });
    },
});

export const { 
    resetSlipGeneration, 
    updateProgress, 
    streamCompleted, 
    streamError 
} = slipGenerateSlice.actions;

export default slipGenerateSlice.reducer;
