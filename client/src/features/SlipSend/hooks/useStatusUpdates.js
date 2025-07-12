// src/hooks/useStatusUpdates.js
import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    startStatusStream as startStatusStreamAction,
    stopStatusStream as stopStatusStreamAction,
    startProgressStream as startProgressStreamAction,
    stopProgressStream as stopProgressStreamAction,
} from "../../../store/whatsappSlice";

/**
 * Custom hook to handle real-time status and progress updates using SSE
 * @returns {Object} Object containing update state and control functions
 */
const useStatusUpdates = () => {
    const dispatch = useDispatch();

    // Track whether we've initiated connection in this session
    const hasInitiatedStatusConnection = useRef(false);
    const hasInitiatedProgressConnection = useRef(false);

    // Track if streams are in the process of connecting/disconnecting
    const statusStreamConnecting = useRef(false);
    const progressStreamConnecting = useRef(false);
    
    // Keep track of the keepAlive interval
    const keepAliveIntervalRef = useRef(null);

    const connectionStatus = useSelector(
        (state) => state.whatsapp.connectionStatus
    );
    const sendingStatus = useSelector((state) => state.whatsapp.sendingStatus);
    const streams = useSelector((state) => state.whatsapp.streams);

    // Prevent connecting again if we're already in active state
    const isStatusStreamActive = streams.status.active;
    const isProgressStreamActive = streams.progress.active;

    // Start streaming status updates
    const startStatusStream = useCallback(() => {
        // Only start if not already active and not in the process of connecting
        if (!isStatusStreamActive && !statusStreamConnecting.current) {
            // console.log("Starting status SSE stream");

            // Mark that we're connecting
            statusStreamConnecting.current = true;

            // Dispatch the action to start the stream
            dispatch(startStatusStreamAction())
                .then(() => {
                    // Connection complete
                    statusStreamConnecting.current = false;
                    hasInitiatedStatusConnection.current = true;
                })
                .catch(() => {
                    // Connection failed
                    statusStreamConnecting.current = false;
                });
        }
    }, [dispatch, isStatusStreamActive]);

    // Stop streaming status updates
    const stopStatusStream = useCallback(() => {
        // Only stop if already active and not in the process of disconnecting
        if (
            (isStatusStreamActive || hasInitiatedStatusConnection.current) &&
            !statusStreamConnecting.current
        ) {
            // console.log("Stopping status SSE stream");

            // Mark that we're disconnecting
            statusStreamConnecting.current = true;

            // Dispatch the action to stop the stream
            dispatch(stopStatusStreamAction())
                .then(() => {
                    // Disconnection complete
                    statusStreamConnecting.current = false;
                    hasInitiatedStatusConnection.current = false;
                })
                .catch(() => {
                    // Disconnection failed
                    statusStreamConnecting.current = false;
                });
        }
    }, [dispatch, isStatusStreamActive]);

    // Start streaming progress updates with improved connection stability
    const startProgressStream = useCallback(() => {
        // Only start if not already active and not in the process of connecting
        if (!isProgressStreamActive && !progressStreamConnecting.current) {
            // console.log("Starting progress SSE stream");

            // Mark that we're connecting
            progressStreamConnecting.current = true;
            
            // Clear any existing keepAlive interval
        if (keepAliveIntervalRef.current) {
            clearInterval(keepAliveIntervalRef.current);
            keepAliveIntervalRef.current = null;
        }

            // Dispatch the action to start the stream
            dispatch(startProgressStreamAction())
                .then(() => {
                    // Connection complete
                    progressStreamConnecting.current = false;
                    hasInitiatedProgressConnection.current = true;
                })
                .catch(() => {
                    // Connection failed
                    progressStreamConnecting.current = false;
                });
        } else {
            // console.log("Progress stream already active or connecting");
        }
    }, [dispatch, isProgressStreamActive, streams.progress.active]);

    // Stop streaming progress updates
    const stopProgressStream = useCallback(() => {
        // Clear the keepAlive interval
        if (keepAliveIntervalRef.current) {
            clearInterval(keepAliveIntervalRef.current);
            keepAliveIntervalRef.current = null;
        }
        
        // Only stop if already active and not in the process of disconnecting
        if (
            (isProgressStreamActive || hasInitiatedProgressConnection.current) &&
            !progressStreamConnecting.current
        ) {
            // console.log("Stopping progress SSE stream");

            // Mark that we're disconnecting
            progressStreamConnecting.current = true;

            // Dispatch the action to stop the stream
            dispatch(stopProgressStreamAction())
                .then(() => {
                    // Disconnection complete
                    progressStreamConnecting.current = false;
                    hasInitiatedProgressConnection.current = false;
                })
                .catch(() => {
                    // Disconnection failed
                    progressStreamConnecting.current = false;
                });
        }
    }, [dispatch, isProgressStreamActive]);

    // Effect to manage status stream based on connection status
    useEffect(() => {
        let isMounted = true;

        const handleStatusStream = async () => {
            if (connectionStatus === "connected" && isMounted) {
                startStatusStream();
            } else if (connectionStatus !== "connected" && isMounted) {
                stopStatusStream();
                // Only stop progress stream if we're fully disconnected
                if (connectionStatus === "disconnected") {
                    stopProgressStream();
                }
            }
        };

        handleStatusStream();

        return () => {
            isMounted = false;
        };
    }, [connectionStatus, startStatusStream, stopStatusStream, stopProgressStream]);

    // Effect to manage progress stream based on sending status
    // This only starts the progress stream, it never automatically stops it
    useEffect(() => {
        let isMounted = true;
        // console.log("Current sendingStatus:", sendingStatus);

        const handleProgressStream = async () => {
            // Only start the progress stream when sending becomes active
            if (
                ["processing", "sending", "paused"].includes(sendingStatus) &&
                isMounted &&
                !isProgressStreamActive && 
                !progressStreamConnecting.current &&
                connectionStatus === "connected"
            ) {
                // console.log("Sending status indicates we should start progress stream");
                startProgressStream();
            }
        };

        handleProgressStream();

        return () => {
            isMounted = false;
        };
    }, [sendingStatus, startProgressStream, isProgressStreamActive, progressStreamConnecting, connectionStatus]);

    // Clean up all resources on unmount
    useEffect(() => {
        return () => {
            // Clear any intervals
            if (keepAliveIntervalRef.current) {
                clearInterval(keepAliveIntervalRef.current);
                keepAliveIntervalRef.current = null;
            }
            
            // Stop both streams
            stopStatusStream();
            stopProgressStream();
        };
    }, [stopStatusStream, stopProgressStream]);

    return {
        // Status of streams
        statusStreaming: isStatusStreamActive,
        progressStreaming: isProgressStreamActive,

        // Stream control methods
        startStatusStream,
        stopStatusStream,
        startProgressStream,
        stopProgressStream,

        // Stream errors
        statusStreamError: streams.status.error,
        progressStreamError: streams.progress.error,
    };
};

export default useStatusUpdates;