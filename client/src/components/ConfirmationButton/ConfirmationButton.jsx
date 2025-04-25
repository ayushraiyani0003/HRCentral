import React, { useState, useEffect, useRef, forwardRef } from "react";
import "./confirmationButtonStyles.css";

/**
 * ConfirmationButton - A two-step action button to prevent accidental operations
 *
 * @param {Object} props - Component props
 * @param {string} props.initialLabel - Initial button text
 * @param {string} props.confirmLabel - Text shown during confirmation step
 * @param {string} props.cancelLabel - Text for cancel button (if displayType is "inline-double" or "popup")
 * @param {string} props.displayType - How confirmation is displayed: "inline", "inline-double", or "popup"
 * @param {string} props.variant - Visual style: "primary", "danger", "neutral"
 * @param {number} props.timeout - Time in ms before confirmation state resets (0 to disable)
 * @param {Function} props.onConfirm - Function called when action is confirmed
 * @param {Function} props.onCancel - Optional function called when action is cancelled
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {string} props.size - Button size: "small", "medium", "large"
 * @param {boolean} props.fullWidth - Whether button should take full width
 * @param {string} props.popupPosition - Position of popup: "top", "bottom", "left", "right"
 * @param {string} props.popupMessage - Additional message to show in popup mode
 * @param {React.ReactNode} props.icon - Optional icon element
 * @param {string} props.className - Additional CSS class names
 * @param {Object} props.buttonProps - Props to pass to the button element
 */
const ConfirmationButton = forwardRef(
    (
        {
            initialLabel = "Delete",
            confirmLabel = "Are you sure?",
            cancelLabel = "Cancel",
            displayType = "inline",
            variant = "primary",
            timeout = 3000,
            onConfirm,
            onCancel,
            disabled = false,
            size = "medium",
            fullWidth = false,
            popupPosition = "top",
            popupMessage = "",
            icon = null,
            className = "",
            buttonProps = {},
            ...rest
        },
        ref
    ) => {
        // State for tracking confirmation state
        const [isConfirming, setIsConfirming] = useState(false);
        const [isAnimating, setIsAnimating] = useState(false);

        // Refs
        const timeoutRef = useRef(null);
        const buttonRef = useRef(null);

        // Combined ref handling
        const handleRef = (element) => {
            buttonRef.current = element;

            // Handle forwarded ref
            if (ref) {
                if (typeof ref === "function") {
                    ref(element);
                } else {
                    ref.current = element;
                }
            }
        };

        // Cleanup timeout on unmount
        useEffect(() => {
            return () => {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            };
        }, []);

        // Set up timeout for resetting confirmation state
        useEffect(() => {
            if (isConfirming && timeout > 0) {
                timeoutRef.current = setTimeout(() => {
                    cancelConfirmation();
                }, timeout);
            }

            return () => {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            };
        }, [isConfirming, timeout]);

        // Handle initial click
        const handleInitialClick = () => {
            setIsAnimating(true);
            setTimeout(() => {
                setIsConfirming(true);
                setIsAnimating(false);
            }, 150); // Match animation duration
        };

        // Handle confirmation click
        const handleConfirmClick = (e) => {
            e.stopPropagation(); // Prevent event bubbling

            setIsAnimating(true);
            setTimeout(() => {
                if (onConfirm) {
                    onConfirm();
                }
                setIsConfirming(false);
                setIsAnimating(false);
            }, 150); // Match animation duration

            // Clear any existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };

        // Handle cancel
        const cancelConfirmation = (e) => {
            if (e) {
                e.stopPropagation(); // Prevent event bubbling
            }

            setIsAnimating(true);
            setTimeout(() => {
                setIsConfirming(false);
                setIsAnimating(false);

                if (e && onCancel) {
                    onCancel();
                }
            }, 150); // Match animation duration

            // Clear any existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };

        // Handle keyboard events
        const handleKeyDown = (e) => {
            if (isConfirming) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleConfirmClick(e);
                } else if (e.key === "Escape") {
                    e.preventDefault();
                    cancelConfirmation(e);
                }
            }
        };

        // Handle click outside (for popup type)
        useEffect(() => {
            if (displayType === "popup" && isConfirming) {
                const handleClickOutside = (e) => {
                    if (
                        buttonRef.current &&
                        !buttonRef.current.contains(e.target)
                    ) {
                        cancelConfirmation();
                    }
                };

                document.addEventListener("mousedown", handleClickOutside);
                return () => {
                    document.removeEventListener(
                        "mousedown",
                        handleClickOutside
                    );
                };
            }
        }, [displayType, isConfirming]);

        // Build class names
        const buttonClasses = [
            "confirmation-button",
            `confirmation-${variant}`,
            `confirmation-${size}`,
            `confirmation-${displayType}`,
            isConfirming ? "is-confirming" : "",
            isAnimating ? "is-animating" : "",
            fullWidth ? "confirmation-full-width" : "",
            className,
        ]
            .filter(Boolean)
            .join(" ");

        // Popup confirmation dialog
        const renderPopup = () => {
            if (!isConfirming || displayType !== "popup") {
                return null;
            }

            return (
                <div
                    className={`confirmation-popup confirmation-popup-${popupPosition}`}
                >
                    {popupMessage && (
                        <div className="confirmation-popup-message">
                            {popupMessage}
                        </div>
                    )}
                    <div className="confirmation-popup-actions">
                        <button
                            className="confirmation-popup-confirm"
                            onClick={handleConfirmClick}
                            onKeyDown={handleKeyDown}
                        >
                            {confirmLabel}
                        </button>
                        <button
                            className="confirmation-popup-cancel"
                            onClick={cancelConfirmation}
                        >
                            {cancelLabel}
                        </button>
                    </div>
                </div>
            );
        };

        // Render based on display type
        if (displayType === "inline") {
            return (
                <button
                    ref={handleRef}
                    className={buttonClasses}
                    onClick={
                        isConfirming ? handleConfirmClick : handleInitialClick
                    }
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    onMouseLeave={
                        isConfirming ? () => cancelConfirmation() : undefined
                    }
                    {...buttonProps}
                    {...rest}
                >
                    {icon && <span className="confirmation-icon">{icon}</span>}
                    <span className="confirmation-label">
                        {isConfirming ? confirmLabel : initialLabel}
                    </span>
                </button>
            );
        } else if (displayType === "inline-double") {
            return (
                <div
                    className={`confirmation-container ${
                        fullWidth ? "confirmation-full-width" : ""
                    }`}
                    ref={handleRef}
                    {...rest}
                >
                    {!isConfirming ? (
                        <button
                            className={buttonClasses}
                            onClick={handleInitialClick}
                            disabled={disabled}
                            {...buttonProps}
                        >
                            {icon && (
                                <span className="confirmation-icon">
                                    {icon}
                                </span>
                            )}
                            <span className="confirmation-label">
                                {initialLabel}
                            </span>
                        </button>
                    ) : (
                        <div className="confirmation-buttons-group">
                            <button
                                className={`${buttonClasses} confirmation-confirm-button`}
                                onClick={handleConfirmClick}
                                onKeyDown={handleKeyDown}
                                disabled={disabled}
                            >
                                <span className="confirmation-label">
                                    {confirmLabel}
                                </span>
                            </button>
                            <button
                                className="confirmation-cancel-button"
                                onClick={cancelConfirmation}
                                disabled={disabled}
                            >
                                <span className="confirmation-label">
                                    {cancelLabel}
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            );
        } else if (displayType === "popup") {
            return (
                <div
                    className="confirmation-popup-container"
                    ref={handleRef}
                    {...rest}
                >
                    <button
                        className={buttonClasses}
                        onClick={isConfirming ? undefined : handleInitialClick}
                        disabled={disabled}
                        {...buttonProps}
                    >
                        {icon && (
                            <span className="confirmation-icon">{icon}</span>
                        )}
                        <span className="confirmation-label">
                            {initialLabel}
                        </span>
                    </button>

                    {renderPopup()}
                </div>
            );
        }

        return null;
    }
);

// Predefined variants
export const DangerConfirmationButton = (props) => (
    <ConfirmationButton variant="danger" {...props} />
);
export const NeutralConfirmationButton = (props) => (
    <ConfirmationButton variant="neutral" {...props} />
);

export default ConfirmationButton;


// Usage :
// import React, { useState } from "react";
// import ConfirmationButton, {
//     DangerConfirmationButton,
//     NeutralConfirmationButton,
// } from "./components/ConfirmationButton/ConfirmationButton";

// const ConfirmationButtonExamples = () => {
//     // State for success messages
//     const [actionLogs, setActionLogs] = useState([]);

//     // Log actions with timestamps
//     const logAction = (action) => {
//         const timestamp = new Date().toLocaleTimeString();
//         const newLog = `${timestamp}: ${action}`;
//         setActionLogs([newLog, ...actionLogs].slice(0, 5)); // Keep last 5 logs
//     };

//     // Handler for confirmation
//     const handleConfirm = (action) => {
//         logAction(`Confirmed: ${action}`);
//     };

//     // Handler for cancel
//     const handleCancel = (action) => {
//         logAction(`Cancelled: ${action}`);
//     };

//     // Trash icon for delete buttons
//     const trashIcon = (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//             width="16"
//             height="16"
//         >
//             <path
//                 fillRule="evenodd"
//                 d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
//                 clipRule="evenodd"
//             />
//         </svg>
//     );

//     return (
//         <div
//             className="examples-container"
//             style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}
//         >
//             <h1>Confirmation Button Examples</h1>

//             {/* Action log display */}
//             <div
//                 style={{
//                     marginBottom: "2rem",
//                     padding: "1rem",
//                     backgroundColor: "#f9fafb",
//                     borderRadius: "0.5rem",
//                     border: "1px solid #e5e7eb",
//                 }}
//             >
//                 <h3 style={{ marginTop: 0, marginBottom: "0.5rem" }}>
//                     Action Log
//                 </h3>
//                 {actionLogs.length > 0 ? (
//                     <ul style={{ margin: 0, padding: "0 0 0 1.5rem" }}>
//                         {actionLogs.map((log, index) => (
//                             <li key={index} style={{ marginBottom: "0.25rem" }}>
//                                 {log}
//                             </li>
//                         ))}
//                     </ul>
//                 ) : (
//                     <p style={{ color: "#6b7280", fontStyle: "italic" }}>
//                         No actions yet. Try clicking a button!
//                     </p>
//                 )}
//             </div>

//             {/* Display type examples */}
//             <section style={{ marginBottom: "3rem" }}>
//                 <h2>Display Types</h2>
//                 <div
//                     style={{
//                         display: "grid",
//                         gridTemplateColumns:
//                             "repeat(auto-fill, minmax(200px, 1fr))",
//                         gap: "1.5rem",
//                         alignItems: "start",
//                     }}
//                 >
//                     {/* Inline mode */}
//                     <div>
//                         <h3>Inline</h3>
//                         <div style={{ marginBottom: "1rem" }}>
//                             <DangerConfirmationButton
//                                 initialLabel="Delete Item"
//                                 confirmLabel="Confirm Delete"
//                                 displayType="inline"
//                                 timeout={3000}
//                                 onConfirm={() =>
//                                     handleConfirm("Deleted item (inline)")
//                                 }
//                                 onCancel={() =>
//                                     handleCancel("Delete item (inline)")
//                                 }
//                                 icon={trashIcon}
//                             />
//                         </div>
//                         <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
//                             Button changes to confirmation state when clicked
//                         </p>
//                     </div>

//                     {/* Inline-double mode */}
//                     <div>
//                         <h3>Inline Double</h3>
//                         <div style={{ marginBottom: "1rem" }}>
//                             <DangerConfirmationButton
//                                 initialLabel="Delete Item"
//                                 confirmLabel="Confirm"
//                                 cancelLabel="Cancel"
//                                 displayType="inline-double"
//                                 timeout={3000}
//                                 onConfirm={() =>
//                                     handleConfirm(
//                                         "Deleted item (inline-double)"
//                                     )
//                                 }
//                                 onCancel={() =>
//                                     handleCancel("Delete item (inline-double)")
//                                 }
//                                 icon={trashIcon}
//                             />
//                         </div>
//                         <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
//                             Shows both confirm and cancel buttons
//                         </p>
//                     </div>

//                     {/* Popup mode */}
//                     <div>
//                         <h3>Popup</h3>
//                         <div style={{ marginBottom: "1rem" }}>
//                             <DangerConfirmationButton
//                                 initialLabel="Delete Item"
//                                 confirmLabel="Yes, Delete"
//                                 cancelLabel="Cancel"
//                                 displayType="popup"
//                                 popupPosition="top"
//                                 popupMessage="This action cannot be undone. Are you sure?"
//                                 timeout={5000}
//                                 onConfirm={() =>
//                                     handleConfirm("Deleted item (popup)")
//                                 }
//                                 onCancel={() =>
//                                     handleCancel("Delete item (popup)")
//                                 }
//                                 icon={trashIcon}
//                             />
//                         </div>
//                         <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
//                             Shows a popup with confirmation message
//                         </p>
//                     </div>
//                 </div>
//             </section>

//             {/* Style variants examples */}
//             <section style={{ marginBottom: "3rem" }}>
//                 <h2>Style Variants</h2>
//                 <div
//                     style={{
//                         display: "grid",
//                         gridTemplateColumns:
//                             "repeat(auto-fill, minmax(200px, 1fr))",
//                         gap: "1.5rem",
//                     }}
//                 >
//                     {/* Primary variant */}
//                     <div>
//                         <h3>Primary</h3>
//                         <ConfirmationButton
//                             initialLabel="Submit Form"
//                             confirmLabel="Confirm Submit"
//                             displayType="inline"
//                             variant="primary"
//                             timeout={3000}
//                             onConfirm={() => handleConfirm("Submitted form")}
//                         />
//                     </div>

//                     {/* Danger variant */}
//                     <div>
//                         <h3>Danger</h3>
//                         <DangerConfirmationButton
//                             initialLabel="Delete Account"
//                             confirmLabel="Yes, Delete"
//                             displayType="inline"
//                             timeout={3000}
//                             onConfirm={() => handleConfirm("Deleted account")}
//                         />
//                     </div>

//                     {/* Neutral variant */}
//                     <div>
//                         <h3>Neutral</h3>
//                         <NeutralConfirmationButton
//                             initialLabel="Archive"
//                             confirmLabel="Confirm Archive"
//                             displayType="inline"
//                             timeout={3000}
//                             onConfirm={() => handleConfirm("Archived item")}
//                         />
//                     </div>
//                 </div>
//             </section>

//             {/* Size variants examples */}
//             <section style={{ marginBottom: "3rem" }}>
//                 <h2>Size Variants</h2>
//                 <div
//                     style={{
//                         display: "flex",
//                         gap: "1.5rem",
//                         alignItems: "center",
//                     }}
//                 >
//                     {/* Small size */}
//                     <ConfirmationButton
//                         initialLabel="Delete"
//                         confirmLabel="Confirm"
//                         displayType="inline"
//                         variant="danger"
//                         size="small"
//                         timeout={3000}
//                         onConfirm={() => handleConfirm("Small button action")}
//                     />

//                     {/* Medium size */}
//                     <ConfirmationButton
//                         initialLabel="Delete"
//                         confirmLabel="Confirm"
//                         displayType="inline"
//                         variant="danger"
//                         size="medium"
//                         timeout={3000}
//                         onConfirm={() => handleConfirm("Medium button action")}
//                     />

//                     {/* Large size */}
//                     <ConfirmationButton
//                         initialLabel="Delete"
//                         confirmLabel="Confirm"
//                         displayType="inline"
//                         variant="danger"
//                         size="large"
//                         timeout={3000}
//                         onConfirm={() => handleConfirm("Large button action")}
//                     />
//                 </div>
//             </section>

//             {/* Popup position examples */}
//             <section style={{ marginBottom: "3rem" }}>
//                 <h2>Popup Positions</h2>
//                 <div
//                     style={{
//                         display: "grid",
//                         gridTemplateColumns: "repeat(2, 1fr)",
//                         gap: "2rem",
//                         padding: "3rem",
//                         alignItems: "center",
//                         justifyItems: "center",
//                     }}
//                 >
//                     {/* Top position */}
//                     <ConfirmationButton
//                         initialLabel="Top Popup"
//                         confirmLabel="Confirm"
//                         cancelLabel="Cancel"
//                         displayType="popup"
//                         variant="danger"
//                         popupPosition="top"
//                         popupMessage="Confirmation popup positioned at the top"
//                         timeout={5000}
//                         onConfirm={() => handleConfirm("Top popup action")}
//                     />

//                     {/* Bottom position */}
//                     <ConfirmationButton
//                         initialLabel="Bottom Popup"
//                         confirmLabel="Confirm"
//                         cancelLabel="Cancel"
//                         displayType="popup"
//                         variant="danger"
//                         popupPosition="bottom"
//                         popupMessage="Confirmation popup positioned at the bottom"
//                         timeout={5000}
//                         onConfirm={() => handleConfirm("Bottom popup action")}
//                     />

//                     {/* Left position */}
//                     <ConfirmationButton
//                         initialLabel="Left Popup"
//                         confirmLabel="Confirm"
//                         cancelLabel="Cancel"
//                         displayType="popup"
//                         variant="danger"
//                         popupPosition="left"
//                         popupMessage="Confirmation popup positioned at the left"
//                         timeout={5000}
//                         onConfirm={() => handleConfirm("Left popup action")}
//                     />

//                     {/* Right position */}
//                     <ConfirmationButton
//                         initialLabel="Right Popup"
//                         confirmLabel="Confirm"
//                         cancelLabel="Cancel"
//                         displayType="popup"
//                         variant="danger"
//                         popupPosition="right"
//                         popupMessage="Confirmation popup positioned at the right"
//                         timeout={5000}
//                         onConfirm={() => handleConfirm("Right popup action")}
//                     />
//                 </div>
//             </section>

//             {/* Integration examples */}
//             <section style={{ marginBottom: "3rem" }}>
//                 <h2>Real-world Examples</h2>

//                 {/* Table with delete action */}
//                 <div style={{ marginBottom: "2rem" }}>
//                     <h3>Data Table with Delete Actions</h3>
//                     <table
//                         style={{
//                             width: "100%",
//                             borderCollapse: "collapse",
//                             marginTop: "1rem",
//                             border: "1px solid #e5e7eb",
//                         }}
//                     >
//                         <thead>
//                             <tr
//                                 style={{
//                                     backgroundColor: "#f9fafb",
//                                     borderBottom: "1px solid #e5e7eb",
//                                 }}
//                             >
//                                 <th
//                                     style={{
//                                         padding: "0.75rem",
//                                         textAlign: "left",
//                                     }}
//                                 >
//                                     ID
//                                 </th>
//                                 <th
//                                     style={{
//                                         padding: "0.75rem",
//                                         textAlign: "left",
//                                     }}
//                                 >
//                                     Name
//                                 </th>
//                                 <th
//                                     style={{
//                                         padding: "0.75rem",
//                                         textAlign: "left",
//                                     }}
//                                 >
//                                     Status
//                                 </th>
//                                 <th
//                                     style={{
//                                         padding: "0.75rem",
//                                         textAlign: "right",
//                                     }}
//                                 >
//                                     Actions
//                                 </th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {[
//                                 {
//                                     id: 1,
//                                     name: "Project Alpha",
//                                     status: "Active",
//                                 },
//                                 {
//                                     id: 2,
//                                     name: "Project Beta",
//                                     status: "Pending",
//                                 },
//                                 {
//                                     id: 3,
//                                     name: "Project Gamma",
//                                     status: "Completed",
//                                 },
//                             ].map((item) => (
//                                 <tr
//                                     key={item.id}
//                                     style={{
//                                         borderBottom: "1px solid #e5e7eb",
//                                     }}
//                                 >
//                                     <td style={{ padding: "0.75rem" }}>
//                                         {item.id}
//                                     </td>
//                                     <td style={{ padding: "0.75rem" }}>
//                                         {item.name}
//                                     </td>
//                                     <td style={{ padding: "0.75rem" }}>
//                                         <span
//                                             style={{
//                                                 display: "inline-block",
//                                                 padding: "0.25rem 0.5rem",
//                                                 borderRadius: "9999px",
//                                                 fontSize: "0.75rem",
//                                                 fontWeight: "500",
//                                                 backgroundColor:
//                                                     item.status === "Active"
//                                                         ? "#dcfce7"
//                                                         : item.status ===
//                                                           "Pending"
//                                                         ? "#fef9c3"
//                                                         : "#f3f4f6",
//                                                 color:
//                                                     item.status === "Active"
//                                                         ? "#166534"
//                                                         : item.status ===
//                                                           "Pending"
//                                                         ? "#854d0e"
//                                                         : "#4b5563",
//                                             }}
//                                         >
//                                             {item.status}
//                                         </span>
//                                     </td>
//                                     <td
//                                         style={{
//                                             padding: "0.75rem",
//                                             textAlign: "right",
//                                         }}
//                                     >
//                                         <DangerConfirmationButton
//                                             initialLabel="Delete"
//                                             confirmLabel="Confirm"
//                                             displayType="inline"
//                                             size="small"
//                                             timeout={3000}
//                                             onConfirm={() =>
//                                                 handleConfirm(
//                                                     `Deleted ${item.name}`
//                                                 )
//                                             }
//                                         />
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Form with submit confirmation */}
//                 <div
//                     style={{
//                         marginBottom: "2rem",
//                         padding: "1.5rem",
//                         border: "1px solid #e5e7eb",
//                         borderRadius: "0.5rem",
//                     }}
//                 >
//                     <h3 style={{ marginTop: 0 }}>
//                         Form with Submit Confirmation
//                     </h3>
//                     <form onSubmit={(e) => e.preventDefault()}>
//                         <div style={{ marginBottom: "1rem" }}>
//                             <label
//                                 style={{
//                                     display: "block",
//                                     marginBottom: "0.5rem",
//                                     fontWeight: "500",
//                                 }}
//                             >
//                                 Form Title
//                             </label>
//                             <input
//                                 type="text"
//                                 style={{
//                                     width: "100%",
//                                     padding: "0.75rem",
//                                     borderRadius: "0.375rem",
//                                     border: "1px solid #e5e7eb",
//                                 }}
//                                 placeholder="Enter title"
//                             />
//                         </div>

//                         <div style={{ marginBottom: "1.5rem" }}>
//                             <label
//                                 style={{
//                                     display: "block",
//                                     marginBottom: "0.5rem",
//                                     fontWeight: "500",
//                                 }}
//                             >
//                                 Description
//                             </label>
//                             <textarea
//                                 style={{
//                                     width: "100%",
//                                     padding: "0.75rem",
//                                     borderRadius: "0.375rem",
//                                     border: "1px solid #e5e7eb",
//                                     minHeight: "100px",
//                                 }}
//                                 placeholder="Enter description"
//                             />
//                         </div>

//                         <div
//                             style={{
//                                 display: "flex",
//                                 justifyContent: "flex-end",
//                                 gap: "1rem",
//                             }}
//                         >
//                             <button
//                                 type="button"
//                                 style={{
//                                     padding: "0.5rem 1rem",
//                                     backgroundColor: "#f3f4f6",
//                                     color: "#4b5563",
//                                     border: "1px solid #e5e7eb",
//                                     borderRadius: "0.375rem",
//                                     fontWeight: "500",
//                                     cursor: "pointer",
//                                 }}
//                             >
//                                 Cancel
//                             </button>

//                             <ConfirmationButton
//                                 initialLabel="Submit Form"
//                                 confirmLabel="Confirm Submit"
//                                 displayType="popup"
//                                 popupPosition="top"
//                                 popupMessage="This will submit your form. Continue?"
//                                 timeout={5000}
//                                 onConfirm={() =>
//                                     handleConfirm("Form submitted")
//                                 }
//                                 fullWidth={false}
//                             />
//                         </div>
//                     </form>
//                 </div>

//                 {/* Settings panel with destructive action */}
//                 <div
//                     style={{
//                         padding: "1.5rem",
//                         border: "1px solid #e5e7eb",
//                         borderRadius: "0.5rem",
//                     }}
//                 >
//                     <h3 style={{ marginTop: 0 }}>Account Settings Panel</h3>

//                     <div
//                         style={{
//                             padding: "1rem",
//                             borderBottom: "1px solid #e5e7eb",
//                         }}
//                     >
//                         <div
//                             style={{
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 alignItems: "center",
//                             }}
//                         >
//                             <div>
//                                 <h4 style={{ margin: 0, fontWeight: "600" }}>
//                                     Email Notifications
//                                 </h4>
//                                 <p
//                                     style={{
//                                         margin: "0.25rem 0 0 0",
//                                         fontSize: "0.875rem",
//                                         color: "#6b7280",
//                                     }}
//                                 >
//                                     Receive email notifications for important
//                                     updates
//                                 </p>
//                             </div>
//                             <label
//                                 className="toggle-switch"
//                                 style={{
//                                     position: "relative",
//                                     display: "inline-block",
//                                     width: "48px",
//                                     height: "24px",
//                                 }}
//                             >
//                                 <input
//                                     type="checkbox"
//                                     defaultChecked
//                                     style={{ opacity: 0, width: 0, height: 0 }}
//                                 />
//                                 <span
//                                     style={{
//                                         position: "absolute",
//                                         cursor: "pointer",
//                                         top: 0,
//                                         left: 0,
//                                         right: 0,
//                                         bottom: 0,
//                                         backgroundColor: "#6366f1",
//                                         borderRadius: "24px",
//                                         transition: "0.4s",
//                                     }}
//                                 >
//                                     <span
//                                         style={{
//                                             position: "absolute",
//                                             content: "",
//                                             height: "18px",
//                                             width: "18px",
//                                             left: "3px",
//                                             bottom: "3px",
//                                             backgroundColor: "white",
//                                             borderRadius: "50%",
//                                             transition: "0.4s",
//                                             transform: "translateX(21px)",
//                                         }}
//                                     ></span>
//                                 </span>
//                             </label>
//                         </div>
//                     </div>

//                     <div
//                         style={{
//                             padding: "1rem",
//                             borderBottom: "1px solid #e5e7eb",
//                         }}
//                     >
//                         <div
//                             style={{
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 alignItems: "center",
//                             }}
//                         >
//                             <div>
//                                 <h4 style={{ margin: 0, fontWeight: "600" }}>
//                                     Two-Factor Authentication
//                                 </h4>
//                                 <p
//                                     style={{
//                                         margin: "0.25rem 0 0 0",
//                                         fontSize: "0.875rem",
//                                         color: "#6b7280",
//                                     }}
//                                 >
//                                     Add an extra layer of security to your
//                                     account
//                                 </p>
//                             </div>
//                             <button
//                                 style={{
//                                     padding: "0.5rem 1rem",
//                                     backgroundColor: "#f3f4f6",
//                                     color: "#4b5563",
//                                     border: "1px solid #e5e7eb",
//                                     borderRadius: "0.375rem",
//                                     fontWeight: "500",
//                                     cursor: "pointer",
//                                 }}
//                             >
//                                 Enable
//                             </button>
//                         </div>
//                     </div>

//                     <div style={{ padding: "1.5rem 1rem 0.5rem" }}>
//                         <h4
//                             style={{
//                                 color: "#dc2626",
//                                 fontWeight: "600",
//                                 marginBottom: "0.5rem",
//                             }}
//                         >
//                             Danger Zone
//                         </h4>

//                         <div
//                             style={{
//                                 padding: "1rem",
//                                 backgroundColor: "#fee2e2",
//                                 borderRadius: "0.375rem",
//                                 border: "1px solid #fecaca",
//                             }}
//                         >
//                             <div
//                                 style={{
//                                     display: "flex",
//                                     justifyContent: "space-between",
//                                     alignItems: "center",
//                                 }}
//                             >
//                                 <div>
//                                     <h5
//                                         style={{
//                                             margin: 0,
//                                             fontWeight: "600",
//                                             color: "#dc2626",
//                                         }}
//                                     >
//                                         Delete Account
//                                     </h5>
//                                     <p
//                                         style={{
//                                             margin: "0.25rem 0 0 0",
//                                             fontSize: "0.875rem",
//                                             color: "#b91c1c",
//                                         }}
//                                     >
//                                         Permanently delete your account and all
//                                         of your data
//                                     </p>
//                                 </div>

//                                 <DangerConfirmationButton
//                                     initialLabel="Delete Account"
//                                     confirmLabel="Confirm Delete"
//                                     cancelLabel="Cancel"
//                                     displayType="inline-double"
//                                     timeout={5000}
//                                     onConfirm={() =>
//                                         handleConfirm("Account deleted")
//                                     }
//                                     onCancel={() =>
//                                         handleCancel("Account deletion")
//                                     }
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// };

// export default ;
