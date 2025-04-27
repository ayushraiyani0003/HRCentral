// src/hooks/useWhatsapp.js
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import useStatusPoller from "./useStatusPoller";
import {
    generateQRCode,
    disconnectSession,
    startSendingPDFs,
    pauseSending,
    resumeSending,
    retryFailed,
    resetWhatsappState,
    checkWhatsappStatus,
    setInitialContacts, // Add this action import
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
        contacts, // Add contacts from the store
    } = useSelector((state) => state.whatsapp);

    // Use the status poller hook for managed polling
    const {
        statusPolling,
        progressPolling,
        startStatusPolling,
        stopStatusPolling,
        startProgressPolling,
        stopProgressPolling,
        checkProgressOnce,
    } = useStatusPoller();

    /**
     * Connect to WhatsApp by generating a QR code
     * @returns {Promise<Object>} - Result of the connection attempt
     */
    const connect = useCallback(async () => {
        try {
            await dispatch(generateQRCode()).unwrap();

            // Start polling for status to detect when QR is scanned
            startStatusPolling();

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.message || "Failed to generate QR code",
            };
        }
    }, [dispatch, startStatusPolling]);

    /**
     * Check WhatsApp connection status
     * @returns {Promise<Object>} - Result of the status check
     */
    const checkStatus = useCallback(async () => {
        try {
            const result = await dispatch(checkWhatsappStatus()).unwrap();

            // Start polling for status if connected
            if (result.success && result.status === "connected") {
                startStatusPolling();
            }

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
    }, [dispatch, startStatusPolling]);

    /**
     * Disconnect WhatsApp session
     * @returns {Promise<Object>} - Result of the disconnection
     */
    const disconnect = useCallback(async () => {
        try {
            const result = await dispatch(disconnectSession()).unwrap();

            // Stop all polling
            stopStatusPolling();
            stopProgressPolling();

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
    }, [dispatch, stopStatusPolling, stopProgressPolling]);

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

                // Force start polling for immediate feedback
                startProgressPolling();

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
        [dispatch, startProgressPolling]
    );

    /**
     * Pause the sending process
     * @returns {Promise<Object>} - Result of the operation
     */
    const pauseProcess = useCallback(async () => {
        try {
            const result = await dispatch(pauseSending()).unwrap();
            
            // Check progress once to update contacts immediately
            checkProgressOnce();
            
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
    }, [dispatch, checkProgressOnce]);

    /**
     * Resume the sending process
     * @returns {Promise<Object>} - Result of the operation
     */
    const resumeProcess = useCallback(async () => {
        try {
            const result = await dispatch(resumeSending()).unwrap();
            
            // Check progress once to update contacts immediately
            checkProgressOnce();
            
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
    }, [dispatch, checkProgressOnce]);

    /**
     * Retry failed sends
     * @returns {Promise<Object>} - Result of the operation
     */
    const retryFailedSends = useCallback(async () => {
        try {
            const result = await dispatch(retryFailed()).unwrap();
            
            // Check progress once to update contacts immediately
            checkProgressOnce();
            
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
    }, [dispatch, checkProgressOnce]);

    /**
     * Get current progress manually (usually handled by polling)
     * @returns {Promise<Object>} - Current progress
     */
    const checkProgress = useCallback(async () => {
        return await checkProgressOnce();
    }, [checkProgressOnce]);

    /**
     * Reset WhatsApp state
     */
    const resetState = useCallback(() => {
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
        startStatusPolling,
        stopStatusPolling,
        startProgressPolling,
        stopProgressPolling,
        resetState,

        // State
        qrCode,
        connectionStatus,
        sendingStatus,
        progress,
        loading,
        error,
        lastMessage,
        contacts, // Expose contacts to components
        isConnected: connectionStatus === "connected",
        isConnecting: connectionStatus === "connecting",
        isSending: sendingStatus === "sending" || sendingStatus === "processing",
        isPaused: sendingStatus === "paused",
        isCompleted: sendingStatus === "completed",
        isPolling: statusPolling || progressPolling,
    };
};