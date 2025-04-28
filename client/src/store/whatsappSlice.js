import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import whatsappService from "../services/WhatsappService";

// Create a reusable function for handling common async thunk patterns
const createWhatsappThunk = (
    name,
    serviceMethod,
    payloadTransformer = null
) => {
    return createAsyncThunk(
        `whatsapp/${name}`,
        async (arg, { rejectWithValue }) => {
            try {
                // Call the service method with the argument if provided
                const response = await (arg
                    ? serviceMethod(arg)
                    : serviceMethod());

                // Transform the payload if a transformer function is provided
                return payloadTransformer
                    ? payloadTransformer(response)
                    : response;
            } catch (error) {
                return rejectWithValue(error.message);
            }
        }
    );
};

// Async thunks for WhatsApp operations
export const generateQRCode = createWhatsappThunk(
    "generateQRCode",
    whatsappService.generateQRCode.bind(whatsappService)
);

export const getStatus = createWhatsappThunk(
    "status",
    whatsappService.getStatus.bind(whatsappService)
);

// Add checkWhatsappStatus action using the same pattern as getStatus
export const checkWhatsappStatus = createWhatsappThunk(
    "checkStatus",
    whatsappService.checkStatus.bind(whatsappService)
);

export const disconnectSession = createWhatsappThunk(
    "disconnectSession",
    whatsappService.disconnectSession.bind(whatsappService)
);

export const startSendingPDFs = createAsyncThunk(
    "whatsapp/startSendingPDFs",
    async ({ contacts, settings }, { rejectWithValue }) => {
        try {
            const response = await whatsappService.startSendingPDFs(
                contacts,
                settings
            );
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const pauseSending = createWhatsappThunk(
    "pauseSending",
    whatsappService.pauseSending.bind(whatsappService)
);

export const resumeSending = createWhatsappThunk(
    "resumeSending",
    whatsappService.resumeSending.bind(whatsappService)
);

export const retryFailed = createWhatsappThunk(
    "retryFailed",
    whatsappService.retryFailed.bind(whatsappService)
);

export const getProgress = createWhatsappThunk(
    "getProgress",
    whatsappService.getProgress.bind(whatsappService)
);

// New thunks for SSE streams
export const startStatusStream = createAsyncThunk(
    "whatsapp/startStatusStream",
    async (_, { dispatch }) => {
        return whatsappService.streamStatus(
            // On status update
            (data) => {
                if (data.success) {
                    // If the response includes status information
                    if (data.status) {
                        dispatch(setConnectionStatus(data.status));
                    }

                    // If the response includes sending status
                    if (data.sendingStatus) {
                        dispatch(setSendingStatus(data.sendingStatus));
                    }

                    // Update any other relevant status info
                    dispatch(updateStatusInfo(data));
                } else {
                    // Handle error case
                    dispatch(
                        setStatusError(data.message || "Status update failed")
                    );
                }
            },
            // On error
            (error) => {
                dispatch(
                    setStatusError(error.message || "Status stream error")
                );
            }
        );
    }
);

export const stopStatusStream = createAsyncThunk(
    "whatsapp/stopStatusStream",
    async () => {
        whatsappService.closeStatusStream();
        return { success: true };
    }
);
// In whatsappSlice.js, modify the startProgressStream thunk to:

export const startProgressStream = createAsyncThunk(
    "whatsapp/startProgressStream",
    async (_, { dispatch }) => {
        // Force the stream to stay active by using an existing action
        dispatch(setForceProgressActive(true));

        return whatsappService.streamProgress(
            // On progress update
            (data) => {
                if (data.success) {
                    // Make sure we're passing the data in a consistent structure
                    if (data.progress) {
                        // Force the sendingStatus to be processing if appropriate
                        if (
                            data.progress.status === "processing" ||
                            data.progress.currentBatch > 0
                        ) {
                            dispatch(setSendingStatus("processing"));
                        }

                        // Pass the entire progress object structure
                        dispatch(updateProgressInfo(data.progress));
                    }
                } else {
                    dispatch(
                        setProgressError(
                            data.message || "Progress update failed"
                        )
                    );
                }
            },
            // On error
            (error) => {
                dispatch(
                    setProgressError(error.message || "Progress stream error")
                );
            }
        );
    }
);

// Add a new reducer to directly set the progress stream active state
export const setProgressStreamActive = (active) => ({
    type: "whatsapp/setProgressStreamActive",
    payload: active,
});

export const stopProgressStream = createAsyncThunk(
    "whatsapp/stopProgressStream",
    async () => {
        whatsappService.closeProgressStream();
        return { success: true };
    }
);

export const stopAllStreams = createAsyncThunk(
    "whatsapp/stopAllStreams",
    async () => {
        whatsappService.closeAllStreams();
        return { success: true };
    }
);

// Initial state
const initialState = {
    qrCode: null,
    connectionStatus: "disconnected", // disconnected, connected, connecting
    sendingStatus: "idle", // idle, processing, paused, completed
    progress: {
        overallProgress: 0,
        batchProgress: 0,
        currentBatch: 0,
        totalBatches: 0,
        stats: {
            total: 0,
            sent: 0,
            failed: 0,
        },
    },
    loading: false,
    error: null,
    lastMessage: "",
    contacts: [], // Store contacts with their current send status

    // New state for SSE
    streams: {
        status: {
            active: false,
            error: null,
        },
        progress: {
            active: false,
            error: null,
            forced: false, // Add this new flag
        },
    },
};

// WhatsApp slice
const whatsappSlice = createSlice({
    name: "whatsapp",
    initialState,
    reducers: {
        resetWhatsappState: (state) => {
            state.loading = false;
            state.error = null;
            state.lastMessage = "";
        },
        clearQRCode: (state) => {
            state.qrCode = null;
        },
        setConnectionStatus: (state, action) => {
            state.connectionStatus = action.payload;
        },
        setSendingStatus: (state, action) => {
            state.sendingStatus = action.payload;
        },
        // Helper reducer to update contacts when starting sending process
        setInitialContacts: (state, action) => {
            state.contacts = action.payload;
        },
        // New reducers for SSE
        updateStatusInfo: (state, action) => {
            // Update any additional status information that comes from SSE
            if (action.payload.status) {
                state.connectionStatus = action.payload.status;
            }

            if (action.payload.sendingStatus) {
                state.sendingStatus = action.payload.sendingStatus;
            }

            // You can add more status properties here as needed
        },
        updateProgressInfo: (state, action) => {
            // Update progress information from SSE
            updateProgressState(state, action.payload);

            // Update contacts if they're included
            if (action.payload.contacts) {
                state.contacts = action.payload.contacts;
            }
        },
        setStatusError: (state, action) => {
            state.streams.status.error = action.payload;
        },
        setProgressError: (state, action) => {
            state.streams.progress.error = action.payload;
        },
        setForceProgressActive: (state, action) => {
            state.streams.progress.active = action.payload;
            // Also set a flag to indicate this was forced
            state.streams.progress.forced = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Generate QR Code
            .addCase(generateQRCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateQRCode.fulfilled, (state, action) => {
                state.loading = false;
                state.qrCode = action.payload.qrCode;
                state.connectionStatus = "connecting";
            })
            .addCase(generateQRCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.connectionStatus = "disconnected";
            })

            .addCase(getStatus.fulfilled, (state, action) => {
                state.loading = false;
                // Updated to handle both API response formats
                if (
                    action.payload.success &&
                    action.payload.status === "connected"
                ) {
                    state.connectionStatus = "connected";
                } else if (action.payload.connectionStatus) {
                    state.connectionStatus = action.payload.connectionStatus;
                } else {
                    state.connectionStatus = "disconnected";
                }

                if (action.payload.sendingStatus) {
                    state.sendingStatus = action.payload.sendingStatus;
                }
            })
            .addCase(getStatus.rejected, (state, action) => {
                state.error = action.payload;
                // Don't set loading to false here to avoid UI flicker during polling
            })

            // Ensure the extraReducers section has these cases for checkWhatsappStatus
            .addCase(checkWhatsappStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.lastMessage = "Checking WhatsApp connection...";
            })
            .addCase(checkWhatsappStatus.fulfilled, (state, action) => {
                state.loading = false;
                // Update based on the API response format
                if (
                    action.payload.success &&
                    action.payload.status === "connected"
                ) {
                    state.connectionStatus = "connected";
                } else {
                    state.connectionStatus = "disconnected";
                }
                state.lastMessage = action.payload.success
                    ? `WhatsApp is ${action.payload.status}`
                    : "WhatsApp is not connected";
            })
            .addCase(checkWhatsappStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.connectionStatus = "disconnected"; // Set to disconnected on error
                state.lastMessage = "Failed to check WhatsApp status";
            })

            // Disconnect Session
            .addCase(disconnectSession.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(disconnectSession.fulfilled, (state, action) => {
                state.loading = false;
                state.connectionStatus = "disconnected";
                state.qrCode = null;
                state.lastMessage =
                    action.payload.message || "Disconnected successfully";
                state.sendingStatus = "idle";
                // Reset contacts
                state.contacts = [];
                // Reset progress data
                state.progress = initialState.progress;
            })
            .addCase(disconnectSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Start Sending PDFs
            .addCase(startSendingPDFs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(startSendingPDFs.fulfilled, (state, action) => {
                // console.log("startSendingPDFs.fulfilled", action.payload);

                state.loading = false;
                state.sendingStatus = "processing"; // Updated to match backend state
                state.lastMessage =
                    action.payload.message || "Started sending PDFs";

                // Store initial contacts if they exist in the payload
                if (action.payload.contacts) {
                    state.contacts = action.payload.contacts;
                }

                // Update progress if included in response
                if (action.payload.progress) {
                    updateProgressState(state, action.payload.progress);
                }
            })
            .addCase(startSendingPDFs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Pause Sending
            .addCase(pauseSending.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(pauseSending.fulfilled, (state, action) => {
                state.loading = false;
                state.sendingStatus = "paused";
                state.lastMessage = action.payload.message || "Paused sending";

                // Update progress and contacts if included in response
                if (action.payload.progress) {
                    updateProgressState(state, action.payload.progress);

                    if (action.payload.progress.contacts) {
                        state.contacts = action.payload.progress.contacts;
                    }
                }
            })
            .addCase(pauseSending.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Resume Sending
            .addCase(resumeSending.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resumeSending.fulfilled, (state, action) => {
                state.loading = false;
                state.sendingStatus = "processing"; // Updated to match backend state
                state.lastMessage = action.payload.message || "Resumed sending";

                // Update progress and contacts if included in response
                if (action.payload.progress) {
                    updateProgressState(state, action.payload.progress);

                    if (action.payload.progress.contacts) {
                        state.contacts = action.payload.progress.contacts;
                    }
                }
            })
            .addCase(resumeSending.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Retry Failed
            .addCase(retryFailed.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(retryFailed.fulfilled, (state, action) => {
                state.loading = false;
                state.sendingStatus = "processing"; // Updated to match backend state
                state.lastMessage =
                    action.payload.message || "Retrying failed sends";

                // Update progress and contacts if included in response
                if (action.payload.progress) {
                    updateProgressState(state, action.payload.progress);

                    if (action.payload.progress.contacts) {
                        state.contacts = action.payload.progress.contacts;
                    }
                }
            })
            .addCase(retryFailed.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getProgress.fulfilled, (state, action) => {
                state.loading = false;

                // Extract progress and contacts data from response
                if (action.payload.progress) {
                    // New format with nested progress object
                    updateProgressState(state, action.payload.progress);

                    // Update contacts array if available
                    if (action.payload.progress.contacts) {
                        state.contacts = action.payload.progress.contacts;
                    }
                } else {
                    // Old format with progress data at the top level
                    updateProgressState(state, action.payload);

                    // Update contacts array if available at top level
                    if (action.payload.contacts) {
                        state.contacts = action.payload.contacts;
                    }
                }

                // Update sending status if provided
                if (action.payload.status) {
                    state.sendingStatus = action.payload.status;
                }

                // Auto-set completed status if processing is completed
                if (state.sendingStatus === "completed") {
                    state.progress.overallProgress = 100;
                }
            })
            .addCase(getProgress.rejected, (state, action) => {
                // Don't set loading to false here to avoid UI flicker during polling
                state.error = action.payload;
            })

            // SSE Status Stream cases
            .addCase(startStatusStream.pending, (state) => {
                state.streams.status.error = null;
            })
            .addCase(startStatusStream.fulfilled, (state) => {
                state.streams.status.active = true;
            })
            .addCase(startStatusStream.rejected, (state, action) => {
                state.streams.status.active = false;
                state.streams.status.error =
                    action.payload || "Failed to start status stream";
            })
            .addCase(stopStatusStream.fulfilled, (state) => {
                state.streams.status.active = false;
            })

            // SSE Progress Stream cases
            .addCase(startProgressStream.pending, (state) => {
                state.streams.progress.error = null;
            })
            .addCase(startProgressStream.fulfilled, (state) => {
                state.streams.progress.active = true;
            })
            .addCase(startProgressStream.rejected, (state, action) => {
                state.streams.progress.active = false;
                state.streams.progress.error =
                    action.payload || "Failed to start progress stream";
            })
            .addCase(stopProgressStream.fulfilled, (state) => {
                state.streams.progress.active = false;
            })

            // Stop all streams
            .addCase(stopAllStreams.fulfilled, (state) => {
                state.streams.status.active = false;
                state.streams.progress.active = false;
            });
    },
});

// Helper function to update progress state
const updateProgressState = (state, progressData) => {
    // Update overall progress metrics
    if (progressData.overallProgress !== undefined) {
        state.progress.overallProgress = progressData.overallProgress;
    }

    if (progressData.batchProgress !== undefined) {
        state.progress.batchProgress = progressData.batchProgress;
    }

    if (progressData.currentBatch !== undefined) {
        state.progress.currentBatch = progressData.currentBatch;
    }

    if (progressData.totalBatches !== undefined) {
        state.progress.totalBatches = progressData.totalBatches;
    }

    // Update stats
    if (progressData.stats) {
        state.progress.stats = {
            total: progressData.stats.total || 0,
            sent: progressData.stats.sent || 0,
            failed: progressData.stats.failed || 0,
        };
    }
};

// Export actions and reducer
export const {
    resetWhatsappState,
    clearQRCode,
    setConnectionStatus,
    setSendingStatus,
    setInitialContacts,
    updateStatusInfo,
    updateProgressInfo,
    setStatusError,
    setProgressError,
    setForceProgressActive, // Add this new export
} = whatsappSlice.actions;

export default whatsappSlice.reducer;
