// src/hooks/useStatusPoller.js
import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStatus, getProgress } from "../../../store/whatsappSlice";

/**
 * Custom hook to handle polling of WhatsApp status and progress
 * @param {number} statusInterval - Interval for status polling in ms (default: 5000)
 * @param {number} progressInterval - Interval for progress polling in ms (default: 2000)
 * @returns {Object} Object containing polling state and control functions
 */
const useStatusPoller = (statusInterval = 5000, progressInterval = 2000) => {
    const dispatch = useDispatch();
    const statusTimerRef = useRef(null);
    const progressTimerRef = useRef(null);

    const connectionStatus = useSelector(
        (state) => state.whatsapp.connectionStatus
    );
    const sendingStatus = useSelector((state) => state.whatsapp.sendingStatus);

    // Start polling status
    const startStatusPolling = useCallback(() => {
        if (!statusTimerRef.current) {
            // Poll once immediately
            dispatch(getStatus());

            // Then set up the interval
            statusTimerRef.current = setInterval(() => {
                dispatch(getStatus());
            }, statusInterval);

            console.log("Status polling started");
        }
    }, [dispatch, statusInterval]);

    // Stop polling status
    const stopStatusPolling = useCallback(() => {
        if (statusTimerRef.current) {
            clearInterval(statusTimerRef.current);
            statusTimerRef.current = null;
            console.log("Status polling stopped");
        }
    }, []);

    // Start polling progress
    const startProgressPolling = useCallback(() => {
        if (!progressTimerRef.current) {
            // Poll once immediately
            dispatch(getProgress());

            // Then set up the interval
            progressTimerRef.current = setInterval(() => {
                dispatch(getProgress());
            }, progressInterval);

            console.log("Progress polling started");
        }
    }, [dispatch, progressInterval]);

    // Stop polling progress
    const stopProgressPolling = useCallback(() => {
        if (progressTimerRef.current) {
            clearInterval(progressTimerRef.current);
            progressTimerRef.current = null;
            console.log("Progress polling stopped");
        }
    }, []);

    // Effect to automatically manage polling based on connection status
    useEffect(() => {
        // If connected, start status polling
        if (connectionStatus === "connected") {
            startStatusPolling();
        } else if (connectionStatus === "disconnected") {
            // If disconnected, stop all polling
            stopStatusPolling();
            stopProgressPolling();
        }

        // Clean up on unmount
        return () => {
            stopStatusPolling();
            stopProgressPolling();
        };
    }, [
        connectionStatus,
        startStatusPolling,
        stopStatusPolling,
        stopProgressPolling,
    ]);

    // Effect to automatically manage progress polling based on sending status
    useEffect(() => {
        // If processing or paused, start progress polling
        if (["processing", "sending", "paused"].includes(sendingStatus)) {
            startProgressPolling();
        } else if (sendingStatus === "idle" || sendingStatus === "completed") {
            // If idle or completed, stop progress polling
            stopProgressPolling();
            
            // If completed, poll once more to get final results
            if (sendingStatus === "completed") {
                dispatch(getProgress());
            }
        }

        // Clean up on unmount
        return () => {
            stopProgressPolling();
        };
    }, [sendingStatus, startProgressPolling, stopProgressPolling, dispatch]);

    return {
        statusPolling: !!statusTimerRef.current,
        progressPolling: !!progressTimerRef.current,
        startStatusPolling,
        stopStatusPolling,
        startProgressPolling,
        stopProgressPolling,

        // Additional method to manually trigger status check once
        checkStatusOnce: () => dispatch(getStatus()),

        // Additional method to manually trigger progress check once
        checkProgressOnce: () => dispatch(getProgress()),
    };
};

export default useStatusPoller;