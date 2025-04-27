// src/services/WhatsappService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "";
const WHATSAPP_ENDPOINT = `${API_URL}/api/whatsapp`;

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
            console.log(
                `API Request: ${config.method.toUpperCase()} ${config.url}`
            );
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

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