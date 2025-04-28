// controllers/whatsapp.controller.js
const whatsappService = require("../../services/whatsapp.service");

// Helper function for delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Track active SSE clients for each feature
const sseClients = {
    status: new Set(),
    progress: new Set(),
};

// Helper function to send SSE update to all clients for a specific feature
const notifyClients = (feature, data) => {
    if (sseClients[feature] && sseClients[feature].size > 0) {
        const eventData = JSON.stringify(data);
        sseClients[feature].forEach((client) => {
            client.write(`data: ${eventData}\n\n`);
        });
    }
};

// Generate QR code for WhatsApp authentication
const generateQRCode = async (req, res) => {
    try {
        // Step 1: Check if session exists and disconnect it
        const currentStatus = await whatsappService.getConnectionStatus();

        if (
            currentStatus &&
            ["connected", "connecting"].includes(currentStatus.status)
        ) {
            console.log("Existing session detected. Disconnecting...");
            await whatsappService.disconnect();
            await delay(1000); // Give time to cleanup
        }

        // Step 2: Initialize QR generation
        console.log("Initializing QR code generation...");
        whatsappService.getQRCode(); // Just initialize

        const maxWaitTime = 30000; // 30 seconds
        const pollInterval = 500; // 500ms
        const startTime = Date.now();

        let qrData = null;

        // Step 3: Poll until QR is generated
        while (Date.now() - startTime < maxWaitTime) {
            const result = whatsappService.getQRCode(); // Try fetching QR
            if (result && result.qrCode) {
                qrData = result;
                break;
            }
            console.log("Waiting for QR...");
            await delay(pollInterval);
        }

        if (!qrData) {
            return res.status(400).json({
                success: false,
                message: "Failed to generate QR code. Try again later.",
            });
        }

        // Step 4: Successfully send QR
        return res.status(200).json({
            success: true,
            qrCode: qrData.qrCode,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("QR generation error:", error.message || error);

        try {
            await whatsappService.disconnect();
        } catch (cleanupError) {
            console.error(
                "Failed during cleanup after QR error:",
                cleanupError.message || cleanupError
            );
        }

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Internal server error during QR code generation",
        });
    }
};

// Get current WhatsApp connection status (Regular REST endpoint)
const getStatus = async (req, res) => {
    try {
        const status = await whatsappService.getConnectionStatus();

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Could not retrieve connection status",
            });
        }

        return res.status(200).json({
            success: true,
            ...status,
        });
    } catch (error) {
        console.error("Status check error:", error);
        return res.status(500).json({
            success: false,
            message:
                error.message || "Internal server error while checking status",
        });
    }
};

// SSE endpoint for real-time status updates is now defined as createStatusStream

// Disconnect WhatsApp session
const disconnectSession = async (req, res) => {
    try {
        const result = await whatsappService.disconnect();

        if (!result || !result.success) {
            return res.status(400).json({
                success: false,
                message: result?.message || "Failed to disconnect session",
            });
        }

        // Since status has changed, notify all status clients
        const newStatus = await whatsappService.getConnectionStatus();
        if (newStatus) {
            notifyClients("status", { success: true, ...newStatus });
        }

        return res.status(200).json({
            success: true,
            message: result.message || "Successfully disconnected",
        });
    } catch (error) {
        console.error("Disconnect error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error during disconnect",
        });
    }
};

// Start sending PDFs
const startSendingPDFs = async (req, res) => {
    try {
        const { settings, contacts } = req.body;

        if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid contacts provided",
            });
        }

        if (!settings) {
            return res.status(400).json({
                success: false,
                message: "No settings provided",
            });
        }

        // Setup contacts with settings
        const setupResult = await whatsappService.setupContacts(
            contacts,
            settings
        );

        if (!setupResult || !setupResult.success) {
            return res.status(400).json({
                success: false,
                message: setupResult?.message || "Failed to setup contacts",
            });
        }

        // Start sending process
        const result = await whatsappService.startSending();

        if (!result || !result.success) {
            return res.status(400).json({
                success: false,
                message: result?.message || "Failed to start sending process",
            });
        }

        // Get initial progress to return to client
        const initialProgress = await whatsappService.getProgress();

        // Notify progress clients that progress has started/changed
        notifyClients("progress", { success: true, progress: initialProgress });

        // Notify status clients about potential status change
        const newStatus = await whatsappService.getConnectionStatus();
        if (newStatus) {
            notifyClients("status", { success: true, ...newStatus });
        }

        return res.status(200).json({
            success: true,
            message: result.message || "Started sending PDFs successfully",
            progress: initialProgress,
        });
    } catch (error) {
        console.error("Start sending error:", error);
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Internal server error while starting send process",
        });
    }
};

// Pause sending process
const pauseSending = async (req, res) => {
    try {
        const result = await whatsappService.pauseSending();

        if (!result || !result.success) {
            return res.status(400).json({
                success: false,
                message: result?.message || "Failed to pause sending",
            });
        }

        // Get current progress after pausing
        const currentProgress = await whatsappService.getProgress();

        // Notify progress clients that progress has changed
        notifyClients("progress", { success: true, progress: currentProgress });

        // Notify status clients about potential status change
        const newStatus = await whatsappService.getConnectionStatus();
        if (newStatus) {
            notifyClients("status", { success: true, ...newStatus });
        }

        return res.status(200).json({
            success: true,
            message: result.message || "Sending paused successfully",
            progress: currentProgress,
        });
    } catch (error) {
        console.error("Pause error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error while pausing",
        });
    }
};

// Resume sending process
const resumeSending = async (req, res) => {
    try {
        const result = await whatsappService.resumeSending();

        if (!result || !result.success) {
            return res.status(400).json({
                success: false,
                message: result?.message || "Failed to resume sending",
            });
        }

        // Get current progress after resuming
        const currentProgress = await whatsappService.getProgress();

        // Notify progress clients that progress has changed
        notifyClients("progress", { success: true, progress: currentProgress });

        // Notify status clients about potential status change
        const newStatus = await whatsappService.getConnectionStatus();
        if (newStatus) {
            notifyClients("status", { success: true, ...newStatus });
        }

        return res.status(200).json({
            success: true,
            message: result.message || "Sending resumed successfully",
            progress: currentProgress,
        });
    } catch (error) {
        console.error("Resume error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error while resuming",
        });
    }
};

// Retry failed sends
const retryFailed = async (req, res) => {
    try {
        const result = await whatsappService.retryFailed();

        if (!result || !result.success) {
            return res.status(400).json({
                success: false,
                message: result?.message || "Failed to retry failed sends",
            });
        }

        // Get current progress after retrying failed messages
        const currentProgress = await whatsappService.getProgress();

        // Notify progress clients that progress has changed
        notifyClients("progress", { success: true, progress: currentProgress });

        return res.status(200).json({
            success: true,
            message: result.message || "Retrying failed sends",
            progress: currentProgress,
        });
    } catch (error) {
        console.error("Retry error:", error);
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Internal server error while retrying failed sends",
        });
    }
};

// Get progress of sending process (Regular REST endpoint)
const getProgress = async (req, res) => {
    try {
        const progress = await whatsappService.getProgress();

        if (!progress) {
            return res.status(400).json({
                success: false,
                message: "Could not retrieve progress information",
            });
        }

        return res.status(200).json({
            success: true,
            progress,
        });
    } catch (error) {
        console.error("Get progress error:", error);
        return res.status(500).json({
            success: false,
            message:
                error.message || "Internal server error while getting progress",
        });
    }
};

// SSE endpoint for real-time progress updates is now defined as createProgressStream

// Setup periodic checks for progress and status changes
// This is optional - you may instead want to trigger updates only when actions occur
let statusMonitorInterval = null;
let progressMonitorInterval = null;

// Function to start monitors if not already running
const ensureMonitorsRunning = () => {
    // Start status monitor if it's not running and we have clients
    if (!statusMonitorInterval && sseClients.status.size > 0) {
        let lastStatusJson = "";

        statusMonitorInterval = setInterval(async () => {
            try {
                // Only check if we have connected clients
                if (sseClients.status.size === 0) {
                    clearInterval(statusMonitorInterval);
                    statusMonitorInterval = null;
                    return;
                }

                const status = await whatsappService.getConnectionStatus();
                if (status) {
                    const statusJson = JSON.stringify(status);
                    // Only notify if status has changed
                    if (statusJson !== lastStatusJson) {
                        lastStatusJson = statusJson;
                        notifyClients("status", { success: true, ...status });
                    }
                }
            } catch (error) {
                console.error("Status monitor error:", error);
            }
        }, 2000); // Check every 2 seconds
    }

    // Start progress monitor if it's not running and we have clients
    if (!progressMonitorInterval && sseClients.progress.size > 0) {
        let lastProgressJson = "";

        progressMonitorInterval = setInterval(async () => {
            try {
                // Only check if we have connected clients
                if (sseClients.progress.size === 0) {
                    clearInterval(progressMonitorInterval);
                    progressMonitorInterval = null;
                    return;
                }

                const progress = await whatsappService.getProgress();
                if (progress) {
                    const progressJson = JSON.stringify(progress);
                    // Only notify if progress has changed
                    if (progressJson !== lastProgressJson) {
                        lastProgressJson = progressJson;
                        notifyClients("progress", { success: true, progress });
                    }
                }
            } catch (error) {
                console.error("Progress monitor error:", error);
            }
        }, 1000); // Check every second
    }
};

// Create stream handlers that include monitor initialization
const createStatusStream = async (req, res) => {
    // Set headers for SSE
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
    });

    // Send an initial status update immediately
    try {
        const status = await whatsappService.getConnectionStatus();
        if (status) {
            const data = { success: true, ...status };
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        } else {
            const data = {
                success: false,
                message: "Could not retrieve connection status",
            };
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        }
    } catch (error) {
        console.error("Initial status stream error:", error);
        const data = {
            success: false,
            message: error.message || "Error retrieving connection status",
        };
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    }

    // Add this client to our set of active status clients
    sseClients.status.add(res);

    // Remove client when connection closes
    req.on("close", () => {
        sseClients.status.delete(res);
        console.log(
            `Status SSE client disconnected. Active clients: ${sseClients.status.size}`
        );
    });

    console.log(
        `New status SSE client connected. Active clients: ${sseClients.status.size}`
    );

    // Ensure monitors are running when a client connects
    ensureMonitorsRunning();
};

const createProgressStream = async (req, res) => {
    // Set headers for SSE
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no", // Prevents buffering for Nginx
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control",
    });
    // Send a comment to keep the connection alive initially
    res.write(":\n\n");

    // Send periodic keepalive pings
    const pingInterval = setInterval(() => {
        res.write(":\n\n"); // Send an empty comment line as a heartbeat
    }, 30000);

    // Send an initial progress update immediately
    try {
        const progress = await whatsappService.getProgress();
        if (progress) {
            const data = { success: true, progress };
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        } else {
            const data = {
                success: false,
                message: "Could not retrieve progress information",
            };
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        }
    } catch (error) {
        console.error("Initial progress stream error:", error);
        const data = {
            success: false,
            message: error.message || "Error retrieving progress",
        };
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    }

    // Add this client to our set of active progress clients
    sseClients.progress.add(res);

    // Remove client when connection closes
    req.on("close", () => {
        clearInterval(pingInterval);
        sseClients.progress.delete(res);
        console.log(
            `Progress SSE client disconnected. Active clients: ${sseClients.progress.size}`
        );
    });

    console.log(
        `New progress SSE client connected. Active clients: ${sseClients.progress.size}`
    );

    // Ensure monitors are running when a client connects
    ensureMonitorsRunning();
};

// Expose a function to notify about progress changes from the service
const updateProgressFromService = (progress) => {
    if (progress && sseClients.progress.size > 0) {
        notifyClients("progress", { success: true, progress });
    }
};

// Expose a function to notify about status changes from the service
const updateStatusFromService = (status) => {
    if (status && sseClients.status.size > 0) {
        notifyClients("status", { success: true, ...status });
    }
};

module.exports = {
    generateQRCode,
    getStatus,
    streamStatus: createStatusStream,
    disconnectSession,
    startSendingPDFs,
    pauseSending,
    resumeSending,
    retryFailed,
    getProgress,
    streamProgress: createProgressStream,
    updateProgressFromService,
    updateStatusFromService,
};
