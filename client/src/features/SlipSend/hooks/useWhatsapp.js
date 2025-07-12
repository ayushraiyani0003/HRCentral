// src/hooks/useWhatsapp.js
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import useStatusUpdates from "./useStatusUpdates";
import {
    generateQRCode,
    disconnectSession,
    startSendingPDFs,
    pauseSending,
    resumeSending,
    retryFailed,
    resetWhatsappState,
    checkWhatsappStatus,
    setInitialContacts,
    stopAllStreams,
    getProgress
} from "../../../store/whatsappSlice";

/**
 * Custom hook for handling WhatsApp operations
 * @returns {Object} WhatsApp methods and state
 */
export const useWhatsapp = () => {
    const dispatch = useDispatch();

    // Get WhatsApp state from Redux
    const {
        qrCode,
        connectionStatus,
        sendingStatus,
        progress,
        loading,
        error,
        lastMessage,
        contacts,
        streams
    } = useSelector((state) => state.whatsapp);

    // Use the status updates hook for SSE streams
    const {
        statusStreaming,
        progressStreaming,
        startStatusStream: startStatus,
        stopStatusStream: stopStatus,
        startProgressStream: startProgress,
        stopProgressStream: stopProgress
    } = useStatusUpdates();

    /**
     * Connect to WhatsApp by generating a QR code
     * @returns {Promise<Object>} - Result of the connection attempt
     */
    const connect = useCallback(async () => {
        try {
            await dispatch(generateQRCode()).unwrap();

            // Status stream will start automatically when status changes to "connected"
            
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.message || "Failed to generate QR code",
            };
        }
    }, [dispatch]);

    /**
     * Check WhatsApp connection status
     * @returns {Promise<Object>} - Result of the status check
     */
    const checkStatus = useCallback(async () => {
        try {
            const result = await dispatch(checkWhatsappStatus()).unwrap();

            return {
                success: true,
                connected: result.success && result.status === "connected",
                message: result.success
                    ? `WhatsApp is ${result.status}`
                    : "WhatsApp is not connected",
            };
        } catch (error) {
            return {
                success: false,
                connected: false,
                message: error.message || "Failed to check WhatsApp status",
            };
        }
    }, [dispatch]);

    /**
     * Disconnect WhatsApp session
     * @returns {Promise<Object>} - Result of the disconnection
     */
    const disconnect = useCallback(async () => {
        try {
            // Stop all SSE streams first
            await dispatch(stopAllStreams()).unwrap();
            
            const result = await dispatch(disconnectSession()).unwrap();

            return {
                success: true,
                message: result?.message || "Disconnected successfully",
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || "Failed to disconnect",
            };
        }
    }, [dispatch]);

    /**
     * Start sending PDFs to contacts
     * @param {Array} contacts - List of contacts with mapped PDFs
     * @param {Object} settings - Settings for sending process
     * @returns {Promise<Object>} - Result of the operation
     */
    const startSending = useCallback(
        async (contacts, settings) => {
            try {
                // Set initial contacts in Redux store
                dispatch(setInitialContacts(contacts));
                
                const result = await dispatch(
                    startSendingPDFs({ contacts, settings })
                ).unwrap();

                // Progress stream will start automatically when sendingStatus changes
                
                return {
                    success: true,
                    message: result?.message || "Started sending PDFs",
                };
            } catch (error) {
                return {
                    success: false,
                    message: error.message || "Failed to start sending process",
                };
            }
        },
        [dispatch]
    );

    /**
     * Pause the sending process
     * @returns {Promise<Object>} - Result of the operation
     */
    const pauseProcess = useCallback(async () => {
        try {
            const result = await dispatch(pauseSending()).unwrap();
            
            return {
                success: true,
                message: result?.message || "Process paused",
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || "Failed to pause process",
            };
        }
    }, [dispatch]);

    /**
     * Resume the sending process
     * @returns {Promise<Object>} - Result of the operation
     */
    const resumeProcess = useCallback(async () => {
        try {
            const result = await dispatch(resumeSending()).unwrap();
            
            return {
                success: true,
                message: result?.message || "Process resumed",
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || "Failed to resume process",
            };
        }
    }, [dispatch]);

    /**
     * Retry failed sends
     * @returns {Promise<Object>} - Result of the operation
     */
    const retryFailedSends = useCallback(async () => {
        try {
            const result = await dispatch(retryFailed()).unwrap();
            
            return {
                success: true,
                message: result?.message || "Retrying failed sends",
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || "Failed to retry process",
            };
        }
    }, [dispatch]);

    /**
     * Get current progress manually if needed
     * @returns {Promise<Object>} - Current progress
     */
    const checkProgress = useCallback(async () => {
        return await dispatch(getProgress()).unwrap();
    }, [dispatch]);

    /**
     * Reset WhatsApp state
     */
    const resetState = useCallback(() => {
        // Stop all SSE streams first
        dispatch(stopAllStreams());
        dispatch(resetWhatsappState());
    }, [dispatch]);

    return {
        // Methods
        connect,
        disconnect,
        startSending,
        pauseProcess,
        resumeProcess,
        retryFailedSends,
        checkProgress,
        checkStatus,
        resetState,
        
        // SSE stream control methods
        startStatusStream: startStatus,
        stopStatusStream: stopStatus,
        startProgressStream: startProgress,
        stopProgressStream: stopProgress,

        // State
        qrCode,
        connectionStatus,
        sendingStatus,
        progress,
        loading,
        error,
        lastMessage,
        contacts,
        isConnected: connectionStatus === "connected",
        isConnecting: connectionStatus === "connecting",
        isSending: sendingStatus === "sending" || sendingStatus === "processing",
        isPaused: sendingStatus === "paused",
        isCompleted: sendingStatus === "completed",
        
        // Stream status
        statusStreaming,
        progressStreaming,
        streams
    };
};