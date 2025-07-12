// src/services/WhatsappService.js
import axios from "axios";

const WHATSAPP_ENDPOINT = `/api/whatsapp`;

// Create axios instance with base URL and default headers
const whatsappApi = axios.create({
    baseURL: WHATSAPP_ENDPOINT,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor for logging/debugging
whatsappApi.interceptors.request.use(
    (config) => {
        // Only log in development
        if (import.meta.env.MODE === "development") {
            // console.log(
            //     `API Request: ${config.method.toUpperCase()} ${config.url}`
            // );
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Store EventSource instances
const eventSources = {
    status: null,
    progress: null,
};

/**
 * Service for handling WhatsApp operations
 */
class WhatsappService {
    /**
     * Generate a QR code for WhatsApp authentication
     * @returns {Promise<Object>} - Response with QR code data
     */
    async generateQRCode() {
        try {
            const response = await whatsappApi.get("/generate-qr");
            return response.data;
        } catch (error) {
            return this._handleError(error);
        }
    }

    /**
     * Get current WhatsApp connection status
     * @returns {Promise<Object>} - Response with connection status
     */
    async getStatus() {
        try {
            const response = await whatsappApi.get("/status");
            return response.data;
        } catch (error) {
            return this._handleError(error);
        }
    }

    /**
     * Check current WhatsApp connection status (explicit check)
     * @returns {Promise<Object>} - Response with connection status
     */
    async checkStatus() {
        try {
            const response = await whatsappApi.get("/status");
            return response.data;
        } catch (error) {
            return this._handleError(error);
        }
    }

    /**
     * Disconnect the WhatsApp session
     * @returns {Promise<Object>} - Response with operation result
     */
    async disconnectSession() {
        try {
            const response = await whatsappApi.post("/disconnect");
            return response.data;
        } catch (error) {
            return this._handleError(error);
        }
    }

    /**
     * Start sending PDFs to contacts
     * @param {Array} contacts - List of contacts with mapped PDFs
     * @param {Object} settings - Settings for the sending process
     * @returns {Promise<Object>} - Response with operation result
     */
    async startSendingPDFs(contacts, settings) {
        try {
            const response = await whatsappApi.post("/send-pdfs", {
                contacts,
                settings,
            });
            return response.data;
        } catch (error) {
            return this._handleError(error);
        }
    }

    /**
     * Pause the sending process
     * @returns {Promise<Object>} - Response with operation result
     */
    async pauseSending() {
        try {
            const response = await whatsappApi.post("/pause");
            return response.data;
        } catch (error) {
            return this._handleError(error);
        }
    }

    /**
     * Resume the sending process
     * @returns {Promise<Object>} - Response with operation result
     */
    async resumeSending() {
        try {
            const response = await whatsappApi.post("/resume");
            return response.data;
        } catch (error) {
            return this._handleError(error);
        }
    }

    /**
     * Retry failed sends
     * @returns {Promise<Object>} - Response with operation result
     */
    async retryFailed() {
        try {
            const response = await whatsappApi.post("/retry-failed");
            return response.data;
        } catch (error) {
            return this._handleError(error);
        }
    }

    /**
     * Get the progress of the sending process
     * @returns {Promise<Object>} - Response with progress information
     */
    async getProgress() {
        try {
            const response = await whatsappApi.get("/progress");
            return response.data;
        } catch (error) {
            return this._handleError(error);
        }
    }

    /**
     * Start streaming WhatsApp status using SSE
     * @param {Function} onStatusUpdate - Callback function to handle status updates
     * @param {Function} onError - Callback function to handle errors
     * @returns {Object} - Methods to close the connection
     */
    streamStatus(onStatusUpdate, onError) {
        // Close any existing connection first
        this.closeStatusStream();

        try {
            // Create a new EventSource connection
            const source = new EventSource(
                `${WHATSAPP_ENDPOINT}/stream-status`
            );

            // Set up event handlers
            source.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    onStatusUpdate(data);
                } catch (err) {
                    console.error("Error parsing status SSE data:", err);
                    if (onError) onError(err);
                }
            };

            source.onerror = (error) => {
                console.error("Status SSE error:", error);
                if (onError) onError(error);

                // Auto-reconnect strategy:
                // Only reconnect if we didn't close it intentionally
                if (eventSources.status === source) {
                    // Wait a bit before reconnecting
                    setTimeout(() => {
                        this.streamStatus(onStatusUpdate, onError);
                    }, 5000);
                }
            };

            // Store the event source
            eventSources.status = source;

            // console.log("Status SSE connection established");

            // Return control methods
            return {
                close: () => this.closeStatusStream(),
            };
        } catch (error) {
            console.error("Failed to establish status SSE connection:", error);
            if (onError) onError(error);

            // Return placeholder control methods
            return {
                close: () => {},
            };
        }
    }

    /**
     * Close the status SSE stream
     */
    closeStatusStream() {
        if (eventSources.status) {
            eventSources.status.close();
            eventSources.status = null;
            // console.log("Status SSE connection closed");
        }
    }

    /**
     * Start streaming sending progress using SSE
     * @param {Function} onProgressUpdate - Callback function to handle progress updates
     * @param {Function} onError - Callback function to handle errors
     * @returns {Object} - Methods to close the connection
     */
    // In WhatsappService.js
    // In WhatsappService.js
    streamProgress(onProgressUpdate, onError) {
        // Close any existing connection first
        this.closeProgressStream();
        // console.log("Starting progress stream connection...");
    
        // Add a reconnection flag
        let isReconnecting = false;
    
        // Add a heartbeat to keep the connection alive
        let heartbeatInterval = null;
    
        try {
            // Create a new EventSource connection with a timestamp to prevent caching
            const timestamp = new Date().getTime();
            const source = new EventSource(
                `${WHATSAPP_ENDPOINT}/stream-progress?t=${timestamp}`
            );
    
            // Set up event handlers
            source.onopen = () => {
                // console.log("Progress SSE connection opened successfully");
                
                // Setup heartbeat to keep connection alive once the connection is open
                source.onopen = () => {
                    // console.log("Progress SSE connection opened successfully");
                    isReconnecting = false;
                };
            };
    
            // Remove this line - can't set readyState as it's read-only
            // source.readyState = 1; // Force ready state to OPEN
    
            source.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    // console.log("Progress SSE data received:", data);
                    onProgressUpdate(data);
                } catch (err) {
                    console.error("Error parsing progress SSE data:", err);
                    if (onError) onError(err);
                }
            };
    
            source.onerror = (error) => {
                console.error("Progress SSE error:", error);
                if (onError) onError(error);
    
                // Auto-reconnect strategy
                if (eventSources.progress === source && 
                    !isReconnecting && 
                    source.readyState === EventSource.CLOSED) {
                    
                    // Mark as reconnecting
                    isReconnecting = true;
                    // console.log("Will attempt to reconnect progress stream in 5 seconds...");
    
                    // Wait before reconnecting
                    setTimeout(() => {
                        if (eventSources.progress === source) {
                            // console.log("Attempting to reconnect progress stream...");
                            // Create a new stream connection
                            this.streamProgress(onProgressUpdate, onError);
                        }
                    }, 5000);
                }    
            };
    
            // Store the event source
            eventSources.progress = source;
    
            // console.log("Progress SSE connection established");
    
            // Return control methods
            return {
                close: () => {
                    if (heartbeatInterval) {
                        clearInterval(heartbeatInterval);
                    }
                    this.closeProgressStream();
                }
            };
        } catch (error) {
            console.error("Failed to establish progress SSE connection:", error);
            if (heartbeatInterval) {
                clearInterval(heartbeatInterval);
            }
            if (onError) onError(error);
            
            return { close: () => {} };
        }
    }

    /**
     * Close the progress SSE stream
     */
    closeProgressStream() {
        if (eventSources.progress) {
            // console.log("Closing progress SSE connection...");
            eventSources.progress.close();
            eventSources.progress = null;
            // console.log("Progress SSE connection closed");
        }
    }

    /**
     * Close all SSE connections
     */
    closeAllStreams() {
        this.closeStatusStream();
        this.closeProgressStream();
    }

    /**
     * Handle API errors consistently
     * @private
     * @param {Error} error - The error object from axios
     */
    _handleError(error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const errorMessage = error.response.data.message || "Server error";
            console.error("API Error:", errorMessage);
            throw new Error(errorMessage);
        } else if (error.request) {
            // The request was made but no response was received
            const errorMessage =
                "No response from server. Please try again later.";
            console.error("API Error:", errorMessage);
            throw new Error(errorMessage);
        } else {
            // Something happened in setting up the request
            const errorMessage = "Error setting up request: " + error.message;
            console.error("API Error:", errorMessage);
            throw new Error(errorMessage);
        }
    }
}

export default new WhatsappService();
