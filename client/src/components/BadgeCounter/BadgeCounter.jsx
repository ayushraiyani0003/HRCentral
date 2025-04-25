import React, { forwardRef } from "react";
import "./badgeCounterStyles.css";

/**
 * BadgeCounter - A customizable notification indicator
 *
 * @param {Object} props - Component props
 * @param {number|string} props.count - The notification count to display
 * @param {boolean} props.showZero - Whether to show the badge when count is zero
 * @param {string} props.position - Badge position ('top-right', 'top-left', 'bottom-right', 'bottom-left')
 * @param {string} props.size - Badge size ('small', 'medium', 'large')
 * @param {string} props.variant - Color variant ('primary', 'danger', 'warning', 'success', 'neutral')
 * @param {boolean} props.pulsing - Whether to add a pulse animation for new notifications
 * @param {number} props.maxCount - Maximum count to display before showing "+"
 * @param {Function} props.onClick - Optional click handler
 * @param {string} props.className - Additional CSS class names
 * @param {React.ReactNode} props.children - The content to which the badge is attached
 */
const BadgeCounter = forwardRef(
    (
        {
            count = 0,
            showZero = false,
            position = "top-right",
            size = "medium",
            variant = "primary",
            pulsing = false,
            maxCount = 99,
            onClick,
            className = "",
            children,
            ...rest
        },
        ref
    ) => {
        // Don't show badge if count is zero and showZero is false
        const shouldShow = count > 0 || showZero;

        // Format the display count (e.g., "99+")
        const displayCount = count > maxCount ? `${maxCount}+` : count;

        // Build class names based on props
        const badgeClasses = [
            "badge-counter",
            `badge-${size}`,
            `badge-${variant}`,
            `badge-${position}`,
            pulsing ? "badge-pulsing" : "",
            onClick ? "badge-clickable" : "",
            className,
        ]
            .filter(Boolean)
            .join(" ");

        return (
            <div className="badge-container" ref={ref} {...rest}>
                {children}

                {shouldShow && (
                    <span
                        className={badgeClasses}
                        onClick={
                            onClick
                                ? (e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      onClick(e);
                                  }
                                : undefined
                        }
                        role={onClick ? "button" : undefined}
                        tabIndex={onClick ? 0 : undefined}
                        onKeyDown={
                            onClick
                                ? (e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                          e.preventDefault();
                                          onClick(e);
                                      }
                                  }
                                : undefined
                        }
                    >
                        {displayCount}
                    </span>
                )}
            </div>
        );
    }
);

// Named export for specific badge variants
export const PrimaryBadge = (props) => (
    <BadgeCounter variant="primary" {...props} />
);
export const DangerBadge = (props) => (
    <BadgeCounter variant="danger" {...props} />
);
export const WarningBadge = (props) => (
    <BadgeCounter variant="warning" {...props} />
);
export const SuccessBadge = (props) => (
    <BadgeCounter variant="success" {...props} />
);
export const NeutralBadge = (props) => (
    <BadgeCounter variant="neutral" {...props} />
);

// Default export
export default BadgeCounter;


// Usage: 
// import React, { useState } from "react";
// import BadgeCounter, {
//     DangerBadge,
//     WarningBadge,
//     SuccessBadge,
//     NeutralBadge,
// } from "./components/BadgeCounter/BadgeCounter";
// import CustomTextInput from "./components/CustomTextInput/CustomTextInput"; // Your existing component

// // Example component showing various badge counter usage
// const BadgeCounterExamples = () => {
//     const [messageCount, setMessageCount] = useState(5);
//     const [alertCount, setAlertCount] = useState(103);

//     // Handler for interactive badge
//     const handleBadgeClick = () => {
//         alert("Badge clicked! You could clear notifications here.");
//         setMessageCount(0);
//     };

//     return (
//         <div
//             className="examples-container"
//             style={{ padding: "2rem", maxWidth: "800px" }}
//         >
//             <h1>Badge Counter Examples</h1>

//             {/* Basic usage */}
//             <section style={{ marginBottom: "2rem" }}>
//                 <h2>Basic Usage</h2>
//                 <div
//                     style={{
//                         display: "flex",
//                         gap: "1.5rem",
//                         alignItems: "center",
//                     }}
//                 >
//                     <BadgeCounter count={messageCount}>
//                         <button
//                             style={{
//                                 padding: "0.5rem 1rem",
//                                 backgroundColor: "#f3f4f6",
//                                 border: "1px solid #e5e7eb",
//                                 borderRadius: "0.5rem",
//                             }}
//                         >
//                             Messages
//                         </button>
//                     </BadgeCounter>

//                     <DangerBadge count={alertCount} maxCount={99}>
//                         <button
//                             style={{
//                                 padding: "0.5rem 1rem",
//                                 backgroundColor: "#f3f4f6",
//                                 border: "1px solid #e5e7eb",
//                                 borderRadius: "0.5rem",
//                             }}
//                         >
//                             Alerts
//                         </button>
//                     </DangerBadge>
//                 </div>
//             </section>

//             {/* Different positions */}
//             <section style={{ marginBottom: "2rem" }}>
//                 <h2>Position Variants</h2>
//                 <div
//                     style={{
//                         display: "flex",
//                         gap: "1.5rem",
//                         alignItems: "center",
//                     }}
//                 >
//                     <BadgeCounter count={8} position="top-right">
//                         <div
//                             style={{
//                                 width: "48px",
//                                 height: "48px",
//                                 backgroundColor: "#e5e7eb",
//                                 borderRadius: "8px",
//                             }}
//                         ></div>
//                     </BadgeCounter>

//                     <BadgeCounter
//                         count={8}
//                         position="top-left"
//                         variant="warning"
//                     >
//                         <div
//                             style={{
//                                 width: "48px",
//                                 height: "48px",
//                                 backgroundColor: "#e5e7eb",
//                                 borderRadius: "8px",
//                             }}
//                         ></div>
//                     </BadgeCounter>

//                     <BadgeCounter
//                         count={8}
//                         position="bottom-right"
//                         variant="success"
//                     >
//                         <div
//                             style={{
//                                 width: "48px",
//                                 height: "48px",
//                                 backgroundColor: "#e5e7eb",
//                                 borderRadius: "8px",
//                             }}
//                         ></div>
//                     </BadgeCounter>

//                     <BadgeCounter
//                         count={8}
//                         position="bottom-left"
//                         variant="neutral"
//                     >
//                         <div
//                             style={{
//                                 width: "48px",
//                                 height: "48px",
//                                 backgroundColor: "#e5e7eb",
//                                 borderRadius: "8px",
//                             }}
//                         ></div>
//                     </BadgeCounter>
//                 </div>
//             </section>

//             {/* Size variants */}
//             <section style={{ marginBottom: "2rem" }}>
//                 <h2>Size Variants</h2>
//                 <div
//                     style={{
//                         display: "flex",
//                         gap: "1.5rem",
//                         alignItems: "center",
//                     }}
//                 >
//                     <BadgeCounter count={5} size="small">
//                         <div
//                             style={{
//                                 width: "32px",
//                                 height: "32px",
//                                 backgroundColor: "#e5e7eb",
//                                 borderRadius: "8px",
//                             }}
//                         ></div>
//                     </BadgeCounter>

//                     <BadgeCounter count={5} size="medium">
//                         <div
//                             style={{
//                                 width: "48px",
//                                 height: "48px",
//                                 backgroundColor: "#e5e7eb",
//                                 borderRadius: "8px",
//                             }}
//                         ></div>
//                     </BadgeCounter>

//                     <BadgeCounter count={5} size="large">
//                         <div
//                             style={{
//                                 width: "64px",
//                                 height: "64px",
//                                 backgroundColor: "#e5e7eb",
//                                 borderRadius: "8px",
//                             }}
//                         ></div>
//                     </BadgeCounter>
//                 </div>
//             </section>

//             {/* Animation */}
//             <section style={{ marginBottom: "2rem" }}>
//                 <h2>Animation Effect</h2>
//                 <div
//                     style={{
//                         display: "flex",
//                         gap: "1.5rem",
//                         alignItems: "center",
//                     }}
//                 >
//                     <BadgeCounter count={3} pulsing>
//                         <div
//                             style={{
//                                 width: "48px",
//                                 height: "48px",
//                                 backgroundColor: "#e5e7eb",
//                                 borderRadius: "8px",
//                             }}
//                         ></div>
//                     </BadgeCounter>

//                     <WarningBadge count={12} pulsing>
//                         <div
//                             style={{
//                                 width: "48px",
//                                 height: "48px",
//                                 backgroundColor: "#e5e7eb",
//                                 borderRadius: "8px",
//                             }}
//                         ></div>
//                     </WarningBadge>
//                 </div>
//             </section>

//             {/* Zero state handling */}
//             <section style={{ marginBottom: "2rem" }}>
//                 <h2>Zero State Handling</h2>
//                 <div
//                     style={{
//                         display: "flex",
//                         gap: "1.5rem",
//                         alignItems: "center",
//                     }}
//                 >
//                     <BadgeCounter count={0} showZero={false}>
//                         <div
//                             style={{
//                                 width: "48px",
//                                 height: "48px",
//                                 backgroundColor: "#e5e7eb",
//                                 borderRadius: "8px",
//                             }}
//                         >
//                             <span
//                                 style={{
//                                     padding: "16px 0",
//                                     display: "block",
//                                     textAlign: "center",
//                                 }}
//                             >
//                                 Hide
//                             </span>
//                         </div>
//                     </BadgeCounter>

//                     <BadgeCounter count={0} showZero={true}>
//                         <div
//                             style={{
//                                 width: "48px",
//                                 height: "48px",
//                                 backgroundColor: "#e5e7eb",
//                                 borderRadius: "8px",
//                             }}
//                         >
//                             <span
//                                 style={{
//                                     padding: "16px 0",
//                                     display: "block",
//                                     textAlign: "center",
//                                 }}
//                             >
//                                 Show
//                             </span>
//                         </div>
//                     </BadgeCounter>
//                 </div>
//             </section>

//             {/* Interactive badge */}
//             <section style={{ marginBottom: "2rem" }}>
//                 <h2>Interactive Badge</h2>
//                 <div
//                     style={{
//                         display: "flex",
//                         gap: "1.5rem",
//                         alignItems: "center",
//                     }}
//                 >
//                     <BadgeCounter
//                         count={messageCount}
//                         onClick={handleBadgeClick}
//                         pulsing={messageCount > 0}
//                     >
//                         <button
//                             style={{
//                                 padding: "0.5rem 1rem",
//                                 backgroundColor: "#f3f4f6",
//                                 border: "1px solid #e5e7eb",
//                                 borderRadius: "0.5rem",
//                             }}
//                         >
//                             Click the badge to clear
//                         </button>
//                     </BadgeCounter>
//                 </div>
//             </section>

//             {/* With your existing CustomTextInput */}
//             <section style={{ marginBottom: "2rem" }}>
//                 <h2>With CustomTextInput</h2>
//                 <div
//                     style={{
//                         display: "flex",
//                         gap: "1.5rem",
//                         alignItems: "flex-start",
//                         flexDirection: "column",
//                     }}
//                 >
//                     <BadgeCounter
//                         count={3}
//                         position="top-right"
//                         variant="danger"
//                     >
//                         <div style={{ width: "100%" }}>
//                             <CustomTextInput
//                                 label="Messages"
//                                 placeholder="Type your message"
//                                 value=""
//                                 onChange={() => {}}
//                             />
//                         </div>
//                     </BadgeCounter>
//                 </div>
//             </section>
//         </div>
//     );
// };

// export default BadgeCounterExamples;
