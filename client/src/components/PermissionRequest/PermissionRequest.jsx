import React, { useState, useEffect } from "react";
import "./permissionRequestStyles.css";

/**
 * PermissionRequest - A customizable component for requesting user permissions
 *
 * @param {Object} props - Component props
 * @param {string} props.permissionType - Type of permission ('notifications', 'microphone', 'camera', 'location', 'storage', 'custom')
 * @param {string} props.reason - Clear explanation of why the permission is needed
 * @param {string} props.permissionName - Custom permission name for the 'custom' type
 * @param {Function} props.onPermissionChange - Callback when permission status changes
 * @param {React.ReactNode} props.fallbackContent - Content to show when permission is denied
 * @param {string} props.variant - Visual style variant ('default', 'compact', 'detailed')
 * @param {boolean} props.showStatus - Whether to display the current permission status
 * @param {boolean} props.rememberChoice - Whether to store user preference in localStorage
 * @param {string} props.storageKey - Key for storing preference (defaults to `permission_${permissionType}`)
 * @param {boolean} props.contextual - When true, only shows request UI when needed
 * @param {React.ReactNode} props.children - Optional child content (for contextual triggers)
 * @param {Function} props.onBeforeRequest - Called before permission is requested
 * @param {Function} props.onAfterRequest - Called after permission request completes
 * @param {string} props.className - Additional CSS class names
 */
const PermissionRequest = ({
    permissionType = "notifications",
    reason = "",
    permissionName = "",
    onPermissionChange = () => {},
    fallbackContent = null,
    variant = "default",
    showStatus = true,
    rememberChoice = true,
    storageKey = "",
    contextual = false,
    children = null,
    onBeforeRequest = () => {},
    onAfterRequest = () => {},
    className = "",
    ...rest
}) => {
    // States
    const [permissionStatus, setPermissionStatus] = useState("prompt"); // 'prompt', 'granted', 'denied'
    const [isRequesting, setIsRequesting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(!contextual);
    const [currentStep, setCurrentStep] = useState(1);
    const [browserInfo, setBrowserInfo] = useState({
        name: "",
        isFirefox: false,
        isChrome: false,
        isSafari: false,
    });

    // Generate storage key
    const permissionStorageKey = storageKey || `permission_${permissionType}`;

    // Detect browser
    useEffect(() => {
        const detectBrowser = () => {
            const userAgent = navigator.userAgent;
            const isFirefox = userAgent.indexOf("Firefox") > -1;
            const isChrome =
                userAgent.indexOf("Chrome") > -1 &&
                userAgent.indexOf("Edge") === -1;
            const isSafari =
                userAgent.indexOf("Safari") > -1 &&
                userAgent.indexOf("Chrome") === -1;

            let browserName = "your browser";
            if (isFirefox) browserName = "Firefox";
            else if (isChrome) browserName = "Chrome";
            else if (isSafari) browserName = "Safari";

            setBrowserInfo({
                name: browserName,
                isFirefox,
                isChrome,
                isSafari,
            });
        };

        detectBrowser();
    }, []);

    // Check permission status
    useEffect(() => {
        const checkPermissionStatus = async () => {
            try {
                // Check for saved preference first if rememberChoice is enabled
                if (rememberChoice) {
                    const savedPermission =
                        localStorage.getItem(permissionStorageKey);
                    if (savedPermission) {
                        setPermissionStatus(savedPermission);
                        onPermissionChange(savedPermission);
                        return;
                    }
                }

                // Handle different permission types
                if (
                    permissionType === "notifications" &&
                    "Notification" in window
                ) {
                    const status = Notification.permission;
                    setPermissionStatus(status);
                    onPermissionChange(status);
                } else if (
                    permissionType === "microphone" ||
                    permissionType === "camera" ||
                    permissionType === "location"
                ) {
                    // For media permissions, we can only check if they've been granted before
                    // We'll need to attempt to access to determine current status
                    const permissionName =
                        permissionType === "microphone"
                            ? "microphone"
                            : permissionType === "camera"
                            ? "camera"
                            : "geolocation";

                    if ("permissions" in navigator) {
                        try {
                            const permissionStatus =
                                await navigator.permissions.query({
                                    name: permissionName,
                                });
                            setPermissionStatus(permissionStatus.state);
                            onPermissionChange(permissionStatus.state);
                        } catch (error) {
                            // console.log(
                            //     "Permission API not fully supported, status unknown"
                            // );
                            setPermissionStatus("prompt");
                            
                        }
                    }
                } else if (
                    permissionType === "storage" &&
                    "storage" in navigator &&
                    "persist" in navigator.storage
                ) {
                    const isPersisted = await navigator.storage.persisted();
                    setPermissionStatus(isPersisted ? "granted" : "prompt");
                    onPermissionChange(isPersisted ? "granted" : "prompt");
                }
            } catch (error) {
                console.error("Error checking permission status:", error);
            }
        };

        checkPermissionStatus();
    }, [
        permissionType,
        permissionStorageKey,
        rememberChoice,
        onPermissionChange,
    ]);

    // Request permission handler
    const requestPermission = async () => {
        setIsRequesting(true);
        setCurrentStep(2);

        // Call onBeforeRequest callback
        onBeforeRequest();

        try {
            let result = "prompt";

            // Handle different permission types
            if (
                permissionType === "notifications" &&
                "Notification" in window
            ) {
                result = await Notification.requestPermission();
            } else if (permissionType === "microphone") {
                try {
                    await navigator.mediaDevices.getUserMedia({ audio: true });
                    result = "granted";
                } catch (error) {
                    result = "denied";
                }
            } else if (permissionType === "camera") {
                try {
                    await navigator.mediaDevices.getUserMedia({ video: true });
                    result = "granted";
                } catch (error) {
                    result = "denied";
                }
            } else if (permissionType === "location") {
                try {
                    await new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(
                            resolve,
                            reject
                        );
                    });
                    result = "granted";
                } catch (error) {
                    result = "denied";
                }
            } else if (permissionType === "storage") {
                const isPersisted = await navigator.storage.persist();
                result = isPersisted ? "granted" : "denied";
            }

            // Store the result if rememberChoice is enabled
            if (rememberChoice) {
                localStorage.setItem(permissionStorageKey, result);
            }

            // Update state and notify parent
            setPermissionStatus(result);
            onPermissionChange(result);

            // Update step
            setCurrentStep(result === "granted" ? 3 : 4);
        } catch (error) {
            console.error("Error requesting permission:", error);
            setPermissionStatus("denied");
            onPermissionChange("denied");
            setCurrentStep(4);
        } finally {
            setIsRequesting(false);

            // Call onAfterRequest callback
            onAfterRequest();
        }
    };

    // Handle contextual trigger
    const handleContextualTrigger = (e) => {
        if (contextual && !isExpanded) {
            e.preventDefault();
            setIsExpanded(true);
        }
    };

    // Reset to default state
    const resetPermissionFlow = () => {
        if (rememberChoice) {
            localStorage.removeItem(permissionStorageKey);
        }
        setPermissionStatus("prompt");
        setCurrentStep(1);
        onPermissionChange("prompt");
    };

    // Close the UI
    const handleClose = () => {
        setIsExpanded(false);
    };

    // Get display name for permission
    const getPermissionDisplayName = () => {
        if (permissionType === "custom" && permissionName) {
            return permissionName;
        }

        const displayNames = {
            notifications: "Notifications",
            microphone: "Microphone",
            camera: "Camera",
            location: "Location",
            storage: "Storage",
        };

        return displayNames[permissionType] || "Permission";
    };

    // Get permission icon
    const getPermissionIcon = () => {
        switch (permissionType) {
            case "notifications":
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="permission-icon"
                    >
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                );
            case "microphone":
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="permission-icon"
                    >
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="23"></line>
                        <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                );
            case "camera":
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="permission-icon"
                    >
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                        <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                );
            case "location":
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="permission-icon"
                    >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                );
            case "storage":
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="permission-icon"
                    >
                        <path d="M22 12H2"></path>
                        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                        <line x1="6" y1="16" x2="6.01" y2="16"></line>
                        <line x1="10" y1="16" x2="10.01" y2="16"></line>
                    </svg>
                );
            default:
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="permission-icon"
                    >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                );
        }
    };

    // Generate browser-specific instructions
    const getBrowserInstructions = () => {
        const { name, isFirefox, isChrome, isSafari } = browserInfo;

        if (permissionStatus === "denied") {
            if (isFirefox) {
                return (
                    <ol className="browser-instructions">
                        <li>Click the lock icon in the address bar</li>
                        <li>Select "Connection Secure"</li>
                        <li>
                            Under "Permissions", find{" "}
                            {getPermissionDisplayName()}
                        </li>
                        <li>Change setting to "Allow"</li>
                    </ol>
                );
            } else if (isChrome) {
                return (
                    <ol className="browser-instructions">
                        <li>Click the lock icon in the address bar</li>
                        <li>Click on "Site settings"</li>
                        <li>
                            Find {getPermissionDisplayName()} and click on it
                        </li>
                        <li>Change from "Block" to "Allow"</li>
                    </ol>
                );
            } else if (isSafari) {
                return (
                    <ol className="browser-instructions">
                        <li>Click Safari in the menu bar</li>
                        <li>Select "Preferences"</li>
                        <li>Go to "Websites" tab</li>
                        <li>
                            Find {getPermissionDisplayName()} in the sidebar
                        </li>
                        <li>
                            Locate this website and change permission to "Allow"
                        </li>
                    </ol>
                );
            } else {
                return (
                    <p className="browser-instructions">
                        To enable {getPermissionDisplayName()}, please check
                        your browser settings and allow{" "}
                        {getPermissionDisplayName().toLowerCase()} for this
                        website.
                    </p>
                );
            }
        }

        return null;
    };

    // Status indicators
    const getStatusIndicator = () => {
        const statusClasses = [
            "permission-status",
            `permission-status-${permissionStatus}`,
        ].join(" ");

        const statusLabels = {
            prompt: "Not requested",
            granted: "Granted",
            denied: "Denied",
        };

        return (
            <div className={statusClasses}>
                <span className="permission-status-dot"></span>
                <span className="permission-status-text">
                    {statusLabels[permissionStatus]}
                </span>
            </div>
        );
    };

    // Build component classes
    const componentClasses = [
        "permission-request",
        `permission-request-${variant}`,
        `permission-type-${permissionType}`,
        `permission-status-${permissionStatus}`,
        isRequesting ? "permission-requesting" : "",
        isExpanded ? "permission-expanded" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    // If contextual and not expanded, just render the trigger
    if (contextual && !isExpanded) {
        return (
            <div
                className="permission-contextual-trigger"
                onClick={handleContextualTrigger}
                {...rest}
            >
                {children}
            </div>
        );
    }

    // Determine what content to show based on current status and step
    let content = null;

    if (permissionStatus === "prompt" || currentStep === 1) {
        // Initial request screen
        content = (
            <>
                <div className="permission-header">
                    <div className="permission-icon-wrapper">
                        {getPermissionIcon()}
                    </div>
                    <h3 className="permission-title">
                        {getPermissionDisplayName()} access
                    </h3>
                    {contextual && (
                        <button
                            className="permission-close-button"
                            onClick={handleClose}
                            aria-label="Close"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    )}
                </div>

                <div className="permission-content">
                    <p className="permission-reason">
                        {reason ||
                            `We need your permission to use the ${getPermissionDisplayName().toLowerCase()}.`}
                    </p>

                    {showStatus && (
                        <div className="permission-current-status">
                            Current status: {getStatusIndicator()}
                        </div>
                    )}
                </div>

                <div className="permission-actions">
                    <button
                        className="permission-allow-button"
                        onClick={requestPermission}
                        disabled={isRequesting}
                    >
                        {isRequesting
                            ? "Requesting..."
                            : `Allow ${getPermissionDisplayName()}`}
                    </button>
                    {contextual && (
                        <button
                            className="permission-deny-button"
                            onClick={handleClose}
                        >
                            Not now
                        </button>
                    )}
                </div>
            </>
        );
    } else if (currentStep === 2) {
        // Processing request
        content = (
            <>
                <div className="permission-header">
                    <div className="permission-icon-wrapper permission-icon-processing">
                        {getPermissionIcon()}
                    </div>
                    <h3 className="permission-title">Requesting permission</h3>
                    {contextual && (
                        <button
                            className="permission-close-button"
                            onClick={handleClose}
                            aria-label="Close"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    )}
                </div>

                <div className="permission-content">
                    <p className="permission-message">
                        Please respond to the browser's permission request
                        dialog...
                    </p>
                    <div className="permission-loading">
                        <div className="permission-loading-indicator"></div>
                    </div>
                </div>
            </>
        );
    } else if (permissionStatus === "granted" || currentStep === 3) {
        // Permission granted
        content = (
            <>
                <div className="permission-header">
                    <div className="permission-icon-wrapper permission-icon-success">
                        {getPermissionIcon()}
                    </div>
                    <h3 className="permission-title">Permission granted</h3>
                    {contextual && (
                        <button
                            className="permission-close-button"
                            onClick={handleClose}
                            aria-label="Close"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    )}
                </div>

                <div className="permission-content">
                    <p className="permission-message">
                        Thank you! We now have access to your{" "}
                        {getPermissionDisplayName().toLowerCase()}.
                    </p>

                    {showStatus && (
                        <div className="permission-current-status">
                            Status: {getStatusIndicator()}
                        </div>
                    )}
                </div>

                <div className="permission-actions">
                    <button
                        className="permission-done-button"
                        onClick={handleClose}
                    >
                        Done
                    </button>
                </div>
            </>
        );
    } else if (permissionStatus === "denied" || currentStep === 4) {
        // Permission denied
        content = (
            <>
                <div className="permission-header">
                    <div className="permission-icon-wrapper permission-icon-error">
                        {getPermissionIcon()}
                    </div>
                    <h3 className="permission-title">Permission denied</h3>
                    {contextual && (
                        <button
                            className="permission-close-button"
                            onClick={handleClose}
                            aria-label="Close"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    )}
                </div>

                <div className="permission-content">
                    <p className="permission-message">
                        We need access to your{" "}
                        {getPermissionDisplayName().toLowerCase()} for this
                        feature to work.
                    </p>

                    {showStatus && (
                        <div className="permission-current-status">
                            Status: {getStatusIndicator()}
                        </div>
                    )}

                    <div className="permission-browser-instructions">
                        <h4>How to enable in {browserInfo.name}:</h4>
                        {getBrowserInstructions()}
                    </div>

                    {fallbackContent && (
                        <div className="permission-fallback">
                            <h4>Alternative option:</h4>
                            <div className="permission-fallback-content">
                                {fallbackContent}
                            </div>
                        </div>
                    )}
                </div>

                <div className="permission-actions">
                    <button
                        className="permission-retry-button"
                        onClick={resetPermissionFlow}
                    >
                        Try again
                    </button>

                    {fallbackContent && (
                        <button
                            className="permission-fallback-button"
                            onClick={handleClose}
                        >
                            Use alternative
                        </button>
                    )}
                </div>
            </>
        );
    }

    return (
        <div className={componentClasses} {...rest}>
            {content}
        </div>
    );
};

// Predefined permission type components
export const NotificationPermission = (props) => (
    <PermissionRequest permissionType="notifications" {...props} />
);
export const MicrophonePermission = (props) => (
    <PermissionRequest permissionType="microphone" {...props} />
);
export const CameraPermission = (props) => (
    <PermissionRequest permissionType="camera" {...props} />
);
export const LocationPermission = (props) => (
    <PermissionRequest permissionType="location" {...props} />
);
export const StoragePermission = (props) => (
    <PermissionRequest permissionType="storage" {...props} />
);

export default PermissionRequest;

//Usage
// import React, { useState, useEffect } from "react";
// import PermissionRequest, {
//     NotificationPermission,
//     LocationPermission,
//     CameraPermission,
//     MicrophonePermission,
// } from "./components/PermissionRequest/PermissionRequest";
// import BadgeCounter from "./components/BadgeCounter/BadgeCounter";

// const PermissionRequestExamples = () => {
//     const [activeTab, setActiveTab] = useState("basic");
//     const [permissionStatus, setPermissionStatus] = useState({
//         notifications: "prompt",
//         location: "prompt",
//         camera: "prompt",
//         microphone: "prompt",
//     });

//     // Handle tab change
//     const handleTabChange = (tab) => {
//         setActiveTab(tab);
//     };

//     // Handle permission status change
//     const handlePermissionChange = (type, status) => {
//         setPermissionStatus((prevState) => ({
//             ...prevState,
//             [type]: status,
//         }));
//     };

//     return (
//         <div
//             className="examples-container"
//             style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}
//         >
//             <h1>Permission Request Examples</h1>

//             {/* Tabs navigation */}
//             <div
//                 style={{
//                     display: "flex",
//                     borderBottom: "1px solid #e5e7eb",
//                     marginBottom: "2rem",
//                 }}
//             >
//                 <button
//                     onClick={() => handleTabChange("basic")}
//                     style={{
//                         padding: "0.75rem 1.5rem",
//                         backgroundColor: "transparent",
//                         border: "none",
//                         borderBottom:
//                             activeTab === "basic"
//                                 ? "2px solid #6366f1"
//                                 : "2px solid transparent",
//                         color: activeTab === "basic" ? "#111827" : "#6b7280",
//                         fontWeight: activeTab === "basic" ? "600" : "normal",
//                         cursor: "pointer",
//                     }}
//                 >
//                     Basic Usage
//                 </button>
//                 <button
//                     onClick={() => handleTabChange("contextual")}
//                     style={{
//                         padding: "0.75rem 1.5rem",
//                         backgroundColor: "transparent",
//                         border: "none",
//                         borderBottom:
//                             activeTab === "contextual"
//                                 ? "2px solid #6366f1"
//                                 : "2px solid transparent",
//                         color:
//                             activeTab === "contextual" ? "#111827" : "#6b7280",
//                         fontWeight:
//                             activeTab === "contextual" ? "600" : "normal",
//                         cursor: "pointer",
//                     }}
//                 >
//                     Contextual Triggers
//                 </button>
//                 <button
//                     onClick={() => handleTabChange("variants")}
//                     style={{
//                         padding: "0.75rem 1.5rem",
//                         backgroundColor: "transparent",
//                         border: "none",
//                         borderBottom:
//                             activeTab === "variants"
//                                 ? "2px solid #6366f1"
//                                 : "2px solid transparent",
//                         color: activeTab === "variants" ? "#111827" : "#6b7280",
//                         fontWeight: activeTab === "variants" ? "600" : "normal",
//                         cursor: "pointer",
//                     }}
//                 >
//                     Style Variants
//                 </button>
//                 <button
//                     onClick={() => handleTabChange("fallback")}
//                     style={{
//                         padding: "0.75rem 1.5rem",
//                         backgroundColor: "transparent",
//                         border: "none",
//                         borderBottom:
//                             activeTab === "fallback"
//                                 ? "2px solid #6366f1"
//                                 : "2px solid transparent",
//                         color: activeTab === "fallback" ? "#111827" : "#6b7280",
//                         fontWeight: activeTab === "fallback" ? "600" : "normal",
//                         cursor: "pointer",
//                     }}
//                 >
//                     Fallback Options
//                 </button>
//             </div>

//             {/* Basic Usage Tab */}
//             {activeTab === "basic" && (
//                 <div className="basic-examples">
//                     <h2>Standard Permission Requests</h2>
//                     <p>
//                         These examples show basic permission requests for
//                         different types of browser permissions.
//                     </p>

//                     <div
//                         style={{
//                             display: "grid",
//                             gridTemplateColumns:
//                                 "repeat(auto-fill, minmax(350px, 1fr))",
//                             gap: "2rem",
//                             marginTop: "2rem",
//                         }}
//                     >
//                         <NotificationPermission
//                             reason="We'd like to send you notifications for important updates and messages."
//                             onPermissionChange={(status) =>
//                                 handlePermissionChange("notifications", status)
//                             }
//                         />

//                         <LocationPermission
//                             reason="We need your location to show you nearby stores and offers."
//                             onPermissionChange={(status) =>
//                                 handlePermissionChange("location", status)
//                             }
//                         />

//                         <CameraPermission
//                             reason="Access to your camera is needed for video calls and profile photos."
//                             onPermissionChange={(status) =>
//                                 handlePermissionChange("camera", status)
//                             }
//                         />

//                         <MicrophonePermission
//                             reason="Microphone access allows you to send voice messages and make calls."
//                             onPermissionChange={(status) =>
//                                 handlePermissionChange("microphone", status)
//                             }
//                         />
//                     </div>

//                     <div
//                         style={{
//                             marginTop: "2rem",
//                             padding: "1rem",
//                             backgroundColor: "#f3f4f6",
//                             borderRadius: "0.5rem",
//                         }}
//                     >
//                         <h3>Permission Statuses</h3>
//                         <div
//                             style={{
//                                 display: "grid",
//                                 gridTemplateColumns:
//                                     "repeat(auto-fill, minmax(200px, 1fr))",
//                                 gap: "1rem",
//                             }}
//                         >
//                             {Object.entries(permissionStatus).map(
//                                 ([type, status]) => (
//                                     <div
//                                         key={type}
//                                         style={{
//                                             padding: "0.5rem",
//                                             backgroundColor: "#ffffff",
//                                             borderRadius: "0.375rem",
//                                             border: "1px solid #e5e7eb",
//                                         }}
//                                     >
//                                         <div
//                                             style={{
//                                                 fontWeight: "500",
//                                                 textTransform: "capitalize",
//                                             }}
//                                         >
//                                             {type}
//                                         </div>
//                                         <div
//                                             style={{
//                                                 color:
//                                                     status === "granted"
//                                                         ? "#059669"
//                                                         : status === "denied"
//                                                         ? "#dc2626"
//                                                         : "#6b7280",
//                                                 fontWeight: "600",
//                                             }}
//                                         >
//                                             {status}
//                                         </div>
//                                     </div>
//                                 )
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Contextual Triggers Tab */}
//             {activeTab === "contextual" && (
//                 <div className="contextual-examples">
//                     <h2>Contextual Permission Requests</h2>
//                     <p>
//                         These examples show how to request permissions at
//                         appropriate moments based on user interaction.
//                     </p>

//                     <div
//                         style={{
//                             display: "flex",
//                             flexDirection: "column",
//                             gap: "2rem",
//                             marginTop: "2rem",
//                             maxWidth: "600px",
//                         }}
//                     >
//                         {/* Comment section example */}
//                         <div
//                             style={{
//                                 padding: "1.5rem",
//                                 backgroundColor: "#ffffff",
//                                 borderRadius: "0.5rem",
//                                 border: "1px solid #e5e7eb",
//                                 boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
//                             }}
//                         >
//                             <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>
//                                 Comment with Notifications
//                             </h3>

//                             <div style={{ marginBottom: "1rem" }}>
//                                 <textarea
//                                     placeholder="Write your comment..."
//                                     style={{
//                                         width: "100%",
//                                         padding: "0.75rem",
//                                         borderRadius: "0.375rem",
//                                         border: "1px solid #e5e7eb",
//                                         minHeight: "100px",
//                                         resize: "vertical",
//                                     }}
//                                 />
//                             </div>

//                             <div
//                                 style={{
//                                     display: "flex",
//                                     justifyContent: "space-between",
//                                     alignItems: "center",
//                                 }}
//                             >
//                                 <NotificationPermission
//                                     contextual={true}
//                                     reason="Get notified when someone replies to your comment."
//                                     onPermissionChange={(status) =>
//                                         handlePermissionChange(
//                                             "notifications",
//                                             status
//                                         )
//                                     }
//                                 >
//                                     <label
//                                         style={{
//                                             display: "flex",
//                                             alignItems: "center",
//                                             gap: "0.5rem",
//                                             cursor: "pointer",
//                                         }}
//                                     >
//                                         <input type="checkbox" />
//                                         <span>Notify me of replies</span>
//                                     </label>
//                                 </NotificationPermission>

//                                 <button
//                                     style={{
//                                         padding: "0.5rem 1rem",
//                                         backgroundColor: "#6366f1",
//                                         color: "#ffffff",
//                                         border: "none",
//                                         borderRadius: "0.375rem",
//                                         cursor: "pointer",
//                                     }}
//                                 >
//                                     Post Comment
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Location search example */}
//                         <div
//                             style={{
//                                 padding: "1.5rem",
//                                 backgroundColor: "#ffffff",
//                                 borderRadius: "0.5rem",
//                                 border: "1px solid #e5e7eb",
//                                 boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
//                             }}
//                         >
//                             <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>
//                                 Search Nearby
//                             </h3>

//                             <div
//                                 style={{
//                                     display: "flex",
//                                     gap: "0.5rem",
//                                     marginBottom: "1rem",
//                                 }}
//                             >
//                                 <input
//                                     type="text"
//                                     placeholder="Search for services..."
//                                     style={{
//                                         flex: 1,
//                                         padding: "0.75rem",
//                                         borderRadius: "0.375rem",
//                                         border: "1px solid #e5e7eb",
//                                     }}
//                                 />

//                                 <LocationPermission
//                                     contextual={true}
//                                     variant="compact"
//                                     reason="We need your location to find services near you."
//                                     onPermissionChange={(status) =>
//                                         handlePermissionChange(
//                                             "location",
//                                             status
//                                         )
//                                     }
//                                 >
//                                     <button
//                                         style={{
//                                             padding: "0.75rem",
//                                             backgroundColor: "#f3f4f6",
//                                             border: "1px solid #e5e7eb",
//                                             borderRadius: "0.375rem",
//                                             display: "flex",
//                                             alignItems: "center",
//                                             justifyContent: "center",
//                                             cursor: "pointer",
//                                         }}
//                                     >
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             viewBox="0 0 24 24"
//                                             fill="none"
//                                             stroke="currentColor"
//                                             strokeWidth="2"
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             width="20"
//                                             height="20"
//                                         >
//                                             <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
//                                             <circle
//                                                 cx="12"
//                                                 cy="10"
//                                                 r="3"
//                                             ></circle>
//                                         </svg>
//                                     </button>
//                                 </LocationPermission>
//                             </div>

//                             <div
//                                 style={{
//                                     fontSize: "0.875rem",
//                                     color: "#6b7280",
//                                 }}
//                             >
//                                 Search for restaurants, shops, and services in
//                                 your area
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Style Variants Tab */}
//             {activeTab === "variants" && (
//                 <div className="variant-examples">
//                     <h2>Style Variants</h2>
//                     <p>
//                         These examples show different visual styles for
//                         permission requests.
//                     </p>

//                     <div
//                         style={{
//                             display: "grid",
//                             gridTemplateColumns:
//                                 "repeat(auto-fill, minmax(350px, 1fr))",
//                             gap: "2rem",
//                             marginTop: "2rem",
//                         }}
//                     >
//                         <div>
//                             <h3>Default Style</h3>
//                             <NotificationPermission
//                                 reason="We'd like to send you notifications for important updates."
//                                 variant="default"
//                             />
//                         </div>

//                         <div>
//                             <h3>Compact Style</h3>
//                             <NotificationPermission
//                                 reason="Enable notifications for updates."
//                                 variant="compact"
//                             />
//                         </div>

//                         <div>
//                             <h3>Detailed Style</h3>
//                             <NotificationPermission
//                                 reason="We'd like to send you notifications for important updates, messages, and activity on your account."
//                                 variant="detailed"
//                             />
//                         </div>

//                         <div>
//                             <h3>With Badge Counter</h3>
//                             <div style={{ position: "relative" }}>
//                                 <BadgeCounter
//                                     count={3}
//                                     position="top-right"
//                                     variant="danger"
//                                 >
//                                     <NotificationPermission
//                                         reason="You have 3 unread notifications. Enable notifications to stay updated."
//                                         variant="default"
//                                     />
//                                 </BadgeCounter>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Fallback Options Tab */}
//             {activeTab === "fallback" && (
//                 <div className="fallback-examples">
//                     <h2>Fallback Options</h2>
//                     <p>
//                         These examples show how to provide alternative options
//                         when permissions are denied.
//                     </p>

//                     <div
//                         style={{
//                             display: "grid",
//                             gridTemplateColumns:
//                                 "repeat(auto-fill, minmax(350px, 1fr))",
//                             gap: "2rem",
//                             marginTop: "2rem",
//                         }}
//                     >
//                         <NotificationPermission
//                             reason="We'd like to send you notifications for important updates and messages."
//                             fallbackContent={
//                                 <div>
//                                     <p>You can still get updates via:</p>
//                                     <ul
//                                         style={{
//                                             paddingLeft: "1.5rem",
//                                             margin: "0.5rem 0",
//                                         }}
//                                     >
//                                         <li>Email notifications</li>
//                                         <li>SMS alerts</li>
//                                         <li>In-app notification center</li>
//                                     </ul>
//                                 </div>
//                             }
//                         />

//                         <LocationPermission
//                             reason="We need your location to show you nearby stores and offers."
//                             fallbackContent={
//                                 <div>
//                                     <p>You can manually enter your location:</p>
//                                     <input
//                                         type="text"
//                                         placeholder="Enter zip code or city"
//                                         style={{
//                                             width: "100%",
//                                             padding: "0.5rem",
//                                             marginTop: "0.5rem",
//                                             borderRadius: "0.25rem",
//                                             border: "1px solid #d1d5db",
//                                         }}
//                                     />
//                                 </div>
//                             }
//                         />
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PermissionRequestExamples;
