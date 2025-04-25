import React, {
    useState,
    useEffect,
    createContext,
    useContext,
    useRef,
} from "react";
import "./toastStyles.css";


// Usage:
// const ToastButtonsDemo = () => {
//     const { addToast } = useToast();
//     const [position, setPosition] = useState("bottom-right");
//     const [duration, setDuration] = useState(5000);
//     // Button styles
//     const buttonStyle = {
//         padding: "0.5rem 1rem",
//         border: "none",
//         borderRadius: "0.375rem",
//         fontSize: "0.875rem",
//         fontWeight: "500",
//         cursor: "pointer",
//         transition: "background-color 0.2s",
//     };
//     // Different toast types with their styles
//     const toastTypes = {
//         success: {
//             ...buttonStyle,
//             backgroundColor: "#10b981",
//             color: "white",
//             hoverBg: "#059669",
//         },
//         error: {
//             ...buttonStyle,
//             backgroundColor: "#ef4444",
//             color: "white",
//             hoverBg: "#dc2626",
//         },
//         warning: {
//             ...buttonStyle,
//             backgroundColor: "#f59e0b",
//             color: "white",
//             hoverBg: "#d97706",
//         },
//         info: {
//             ...buttonStyle,
//             backgroundColor: "#3b82f6",
//             color: "white",
//             hoverBg: "#2563eb",
//         },
//     };
//     // Show toast handler
//     const handleShowToast = (type) => {
//         const messages = {
//             success: "Operation completed successfully!",
//             error: "An error occurred. Please try again.",
//             warning: "Please be careful with this action.",
//             info: "Here's some information you might want to know.",
//         };

//         addToast(messages[type], type, duration, position);
//     };
//     // Handle hover effects
//     const handleMouseEnter = (e, hoverBg) => {
//         e.target.style.backgroundColor = hoverBg;
//     };

//     const handleMouseLeave = (e, normalBg) => {
//         e.target.style.backgroundColor = normalBg;
//     };
//     // Position options
//     const positionOptions = [
//         { value: "top-left", label: "Top Left" },
//         { value: "top-center", label: "Top Center" },
//         { value: "top-right", label: "Top Right" },
//         { value: "bottom-left", label: "Bottom Left" },
//         { value: "bottom-center", label: "Bottom Center" },
//         { value: "bottom-right", label: "Bottom Right" },
//     ];
//     // Duration options
//     const durationOptions = [
//         { value: 3000, label: "3 seconds" },
//         { value: 5000, label: "5 seconds" },
//         { value: 8000, label: "8 seconds" },
//         { value: null, label: "Persistent" },
//     ];
//     return (
//         <div
//             style={{
//                 padding: "2rem",
//                 maxWidth: "600px",
//                 backgroundColor: "white",
//                 borderRadius: "0.5rem",
//                 boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
//             }}
//         >
//             <h2
//                 style={{
//                     marginBottom: "1.5rem",
//                     fontSize: "1.5rem",
//                     fontWeight: "600",
//                     color: "#374151",
//                 }}
//             >
//                 Toast Notifications
//             </h2>
//             {/* Toast Configuration */}
//             <div style={{ marginBottom: "2rem" }}>
//                 <h3
//                     style={{
//                         fontSize: "1rem",
//                         fontWeight: "600",
//                         color: "#4b5563",
//                         marginBottom: "1rem",
//                     }}
//                 >
//                     Configuration
//                 </h3>
//                 <div
//                     style={{
//                         display: "flex",
//                         gap: "1rem",
//                         marginBottom: "1rem",
//                     }}
//                 >
//                     {/* Position selector */}
//                     <div style={{ flex: 1 }}>
//                         <label
//                             style={{
//                                 display: "block",
//                                 fontSize: "0.875rem",
//                                 fontWeight: "500",
//                                 color: "#374151",
//                                 marginBottom: "0.5rem",
//                             }}
//                         >
//                             Position
//                         </label>
//                         <select
//                             value={position}
//                             onChange={(e) => setPosition(e.target.value)}
//                             style={{
//                                 width: "100%",
//                                 padding: "0.5rem",
//                                 border: "1px solid #e5e7eb",
//                                 borderRadius: "0.375rem",
//                                 fontSize: "0.875rem",
//                                 color: "#111827",
//                                 backgroundColor: "#fff",
//                             }}
//                         >
//                             {positionOptions.map((option) => (
//                                 <option key={option.value} value={option.value}>
//                                     {option.label}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                     {/* Duration selector */}
//                     <div style={{ flex: 1 }}>
//                         <label
//                             style={{
//                                 display: "block",
//                                 fontSize: "0.875rem",
//                                 fontWeight: "500",
//                                 color: "#374151",
//                                 marginBottom: "0.5rem",
//                             }}
//                         >
//                             Duration
//                         </label>
//                         <select
//                             value={duration || "null"}
//                             onChange={(e) =>
//                                 setDuration(
//                                     e.target.value === "null"
//                                         ? null
//                                         : Number(e.target.value)
//                                 )
//                             }
//                             style={{
//                                 width: "100%",
//                                 padding: "0.5rem",
//                                 border: "1px solid #e5e7eb",
//                                 borderRadius: "0.375rem",
//                                 fontSize: "0.875rem",
//                                 color: "#111827",
//                                 backgroundColor: "#fff",
//                             }}
//                         >
//                             {durationOptions.map((option) => (
//                                 <option
//                                     key={option.label}
//                                     value={
//                                         option.value === null
//                                             ? "null"
//                                             : option.value
//                                     }
//                                 >
//                                     {option.label}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>
//             </div>
//             {/* Toast Trigger Buttons */}
//             <div>
//                 <h3
//                     style={{
//                         fontSize: "1rem",
//                         fontWeight: "600",
//                         color: "#4b5563",
//                         marginBottom: "1rem",
//                     }}
//                 >
//                     Show Toast Notifications
//                 </h3>
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
//                     {Object.entries(toastTypes).map(([type, style]) => (
//                         <button
//                             key={type}
//                             onClick={() => handleShowToast(type)}
//                             onMouseEnter={(e) =>
//                                 handleMouseEnter(e, style.hoverBg)
//                             }
//                             onMouseLeave={(e) =>
//                                 handleMouseLeave(e, style.backgroundColor)
//                             }
//                             style={style}
//                         >
//                             Show {type.charAt(0).toUpperCase() + type.slice(1)}
//                         </button>
//                     ))}
//                 </div>
//                 <div
//                     style={{
//                         marginTop: "1.5rem",
//                         fontSize: "0.875rem",
//                         color: "#6b7280",
//                     }}
//                 >
//                     Click on a notification to dismiss it, or wait for it to
//                     disappear automatically (except for persistent toasts).
//                 </div>
//             </div>
//         </div>
//     );
// };


// Create Toast Context
const ToastContext = createContext(null);

// Toast Provider Component
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const timersRef = useRef({});

    // Add a new toast
    const addToast = (
        message,
        type = "info",
        duration = 5000,
        position = "bottom-right"
    ) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = {
            id,
            message,
            type,
            duration,
            position,
            state: "enter", // Initial state for animation
            createdAt: Date.now(), // Track when the toast was created
        };

        setToasts((prev) => [...prev, newToast]);

        // Set up auto-dismissal timer if duration is provided
        if (duration) {
            timersRef.current[id] = setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    };

    // Remove a toast with exit animation
    const removeToast = (id) => {
        // First set the exit state to trigger animation
        setToasts((prev) =>
            prev.map((toast) =>
                toast.id === id ? { ...toast, state: "exit" } : toast
            )
        );

        // Clear timer if it exists
        if (timersRef.current[id]) {
            clearTimeout(timersRef.current[id]);
            delete timersRef.current[id];
        }

        // Actually remove after animation completes
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 300); // Match animation duration
    };

    // Clean up timers when component unmounts
    useEffect(() => {
        return () => {
            Object.values(timersRef.current).forEach((timer) => {
                clearTimeout(timer);
            });
        };
    }, []);

    // Group toasts by position
    const groupedToasts = toasts.reduce((acc, toast) => {
        if (!acc[toast.position]) {
            acc[toast.position] = [];
        }
        acc[toast.position].push(toast);
        return acc;
    }, {});

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            {Object.entries(groupedToasts).map(([position, positionToasts]) => (
                <div
                    key={position}
                    className={`toast-container toast-${position}`}
                >
                    {/* Sort toasts by creation time to maintain order */}
                    {positionToasts
                        .sort((a, b) => a.createdAt - b.createdAt)
                        .map((toast) => (
                            <div
                                key={toast.id}
                                className={`toast-item toast-${toast.type} toast-${toast.state}-${toast.position}`}
                                onClick={() => removeToast(toast.id)}
                            >
                                <div className="toast-icon">
                                    {getToastIcon(toast.type)}
                                </div>
                                <div className="toast-message">
                                    {toast.message}
                                </div>
                                <button
                                    className="toast-close"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeToast(toast.id);
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        width="16"
                                        height="16"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                {toast.duration && toast.state === "enter" && (
                                    <div
                                        className="toast-progress"
                                        style={{
                                            animation: `toast-progress ${toast.duration}ms linear forwards`,
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                </div>
            ))}
        </ToastContext.Provider>
    );
};

// Hook to use the toast context
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

// Helper function to get appropriate icon based on toast type
const getToastIcon = (type) => {
    switch (type) {
        case "success":
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    width="20"
                    height="20"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                    />
                </svg>
            );
        case "error":
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    width="20"
                    height="20"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                    />
                </svg>
            );
        case "warning":
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    width="20"
                    height="20"
                >
                    <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
            );
        case "info":
        default:
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    width="20"
                    height="20"
                >
                    <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
            );
    }
};
