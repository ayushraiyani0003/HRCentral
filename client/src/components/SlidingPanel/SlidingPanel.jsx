import React, { forwardRef, useState, useEffect } from "react";
import "./slidingPanelStyles.css";

const SlidingPanel = forwardRef(
    (
        {
            children,
            className = "",
            title = "",
            description = "",
            titleRequired = false,
            isOpen = false,
            onClose = () => {},
            direction = "right", // "top", "right", "bottom", "left"
            size = "medium", // "small", "medium", "large", "custom"
            customSize = "",
            elevation = "medium", // "none", "low", "medium", "high"
            padding = "medium", // "none", "small", "medium", "large"
            border = true,
            rounded = "medium", // "none", "small", "medium", "large", "full"
            backgroundColor = "white", // "white", "light", "dark", "primary", "accent", "custom"
            customBackgroundColor = "",
            withOverflow = true,
            hasError = false,
            headerActions = null,
            footerContent = null,
            footerBorder = true,
            headerBorder = true,
            icon = null,
            titleCssClass = "",
            closeButton = true,
            backdrop = true,
            closeOnBackdropClick = true,
            animationDuration = 300, // in milliseconds
            onOpen = () => {},
            ...rest
        },
        ref
    ) => {
        const [isVisible, setIsVisible] = useState(false);
        const [isAnimating, setIsAnimating] = useState(false);

        useEffect(() => {
            if (isOpen) {
                setIsVisible(true);
                setIsAnimating(true);
                setTimeout(() => {
                    setIsAnimating(false);
                    onOpen();
                }, animationDuration);
            } else {
                setIsAnimating(true);
                setTimeout(() => {
                    setIsVisible(false);
                    setIsAnimating(false);
                }, animationDuration);
            }
        }, [isOpen, animationDuration, onOpen]);

        const handleBackdropClick = () => {
            if (closeOnBackdropClick) {
                onClose();
            }
        };

        // Helper function to generate panel classes
        const getPanelClasses = () => {
            const classes = [
                "sliding-panel",
                `panel-${direction}`,
                `panel-size-${size}`,
                `elevation-${elevation}`,
                `padding-${padding}`,
                `rounded-${rounded}`,
                `bg-${backgroundColor}`,
            ];

            if (border) classes.push("with-border");
            if (hasError) classes.push("has-error");
            if (withOverflow) classes.push("with-overflow");
            if (isOpen) classes.push("panel-open");
            if (isAnimating) classes.push("panel-animating");
            if (className) classes.push(className);

            return classes.join(" ");
        };

        const panelStyle = {
            transition: `transform ${animationDuration}ms ease-in-out`,
            ...(customBackgroundColor && {
                backgroundColor: customBackgroundColor,
            }),
            ...(customSize && {
                [direction === "left" || direction === "right"
                    ? "width"
                    : "height"]: customSize,
            }),
        };

        if (!isVisible) {
            return null;
        }

        return (
            <>
                {backdrop && (
                    <div 
                        className={`panel-backdrop ${isOpen ? "backdrop-visible" : ""}`}
                        onClick={handleBackdropClick}
                        style={{ transition: `opacity ${animationDuration}ms ease-in-out` }}
                    />
                )}
                <div
                    ref={ref}
                    className={getPanelClasses()}
                    style={panelStyle}
                    {...rest}
                >
                    {/* Panel Header with Title */}
                    {(title || headerActions || closeButton) && (
                        <div
                            className={`panel-header ${
                                headerBorder ? "with-border" : ""
                            }`}
                        >
                            <div className="header-content">
                                {icon && <div className="panel-icon">{icon}</div>}
                                {title && (
                                    <div className="panel-title">
                                        <h3 className={`title-text ${titleCssClass}`}>
                                            {title}
                                            {titleRequired && (
                                                <span className="required-mark">*</span>
                                            )}
                                        </h3>
                                        {description && (
                                            <h4 className="title-subtext">{description}</h4>
                                        )}
                                    </div>
                                )}
                                {headerActions && (
                                    <div className="panel-header-actions">
                                        {headerActions}
                                    </div>
                                )}
                                {closeButton && (
                                    <button
                                        className="panel-close-button"
                                        onClick={onClose}
                                        aria-label="Close panel"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Panel Content */}
                    <div className="panel-content">{children}</div>

                    {/* Panel Footer */}
                    {footerContent && (
                        <div
                            className={`panel-footer ${
                                footerBorder ? "with-border" : ""
                            }`}
                        >
                            {footerContent}
                        </div>
                    )}
                </div>
            </>
        );
    }
);

export default SlidingPanel;


// Usage:
// import React, { useState } from "react";
// import SlidingPanel from "./SlidingPanel";

// // Sample usage component to demonstrate the SlidingPanel
// const SlidingPanelDemo = () => {
//   const [panels, setPanels] = useState({
//     right: false,
//     left: false,
//     top: false,
//     bottom: false,
//   });

//   const togglePanel = (direction) => {
//     setPanels((prev) => ({
//       ...prev,
//       [direction]: !prev[direction],
//     }));
//   };

//   // Sample footer content
//   const footerContent = (
//     <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
//       <button 
//         onClick={() => {}} 
//         style={{ 
//           padding: "8px 16px", 
//           background: "#f1f1f1", 
//           border: "1px solid #ddd",
//           borderRadius: "4px"
//         }}
//       >
//         Cancel
//       </button>
//       <button 
//         onClick={() => {}} 
//         style={{ 
//           padding: "8px 16px", 
//           background: "#4a90e2", 
//           color: "white",
//           border: "none",
//           borderRadius: "4px"
//         }}
//       >
//         Save
//       </button>
//     </div>
//   );

//   // Sample header actions
//   const headerActions = (
//     <button 
//       style={{ 
//         background: "none", 
//         border: "none", 
//         cursor: "pointer",
//         padding: "4px 8px",
//         color: "#4a90e2"
//       }}
//     >
//       Edit
//     </button>
//   );

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Sliding Panel Demo</h1>
//       <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
//         <button onClick={() => togglePanel("right")}>Open Right Panel</button>
//         <button onClick={() => togglePanel("left")}>Open Left Panel</button>
//         <button onClick={() => togglePanel("top")}>Open Top Panel</button>
//         <button onClick={() => togglePanel("bottom")}>Open Bottom Panel</button>
//       </div>

//       {/* Right Panel */}
//       <SlidingPanel
//         isOpen={panels.right}
//         onClose={() => togglePanel("right")}
//         direction="right"
//         title="Right Panel"
//         description="This panel slides in from the right"
//         size="medium"
//         elevation="medium"
//         rounded="medium"
//         headerActions={headerActions}
//         footerContent={footerContent}
//       >
//         <div style={{ padding: "20px 0" }}>
//           <p>This is content in the right sliding panel.</p>
//           <p>You can customize the size, elevation, and many other properties.</p>
//         </div>
//       </SlidingPanel>

//       {/* Left Panel */}
//       <SlidingPanel
//         isOpen={panels.left}
//         onClose={() => togglePanel("left")}
//         direction="left"
//         title="Left Panel"
//         description="This panel slides in from the left"
//         size="large"
//         backgroundColor="light"
//         elevation="high"
//       >
//         <div style={{ padding: "20px 0" }}>
//           <p>This is content in the left sliding panel.</p>
//           <p>This panel has a light background and high elevation.</p>
//         </div>
//       </SlidingPanel>

//       {/* Top Panel */}
//       <SlidingPanel
//         isOpen={panels.top}
//         onClose={() => togglePanel("top")}
//         direction="top"
//         title="Top Panel"
//         description="This panel slides in from the top"
//         size="small"
//         backgroundColor="primary"
//         rounded="none"
//         footerContent={footerContent}
//       >
//         <div style={{ padding: "20px 0" }}>
//           <p>This is content in the top sliding panel.</p>
//           <p>This panel has a primary color background.</p>
//         </div>
//       </SlidingPanel>

//       {/* Bottom Panel */}
//       <SlidingPanel
//         isOpen={panels.bottom}
//         onClose={() => togglePanel("bottom")}
//         direction="bottom"
//         title="Bottom Panel"
//         description="This panel slides in from the bottom"
//         size="custom"
//         customSize="200px"
//         backgroundColor="custom"
//         customBackgroundColor="#f9f3e6"
//         closeButton={false}
//         headerBorder={false}
//       >
//         <div style={{ padding: "20px 0", textAlign: "center" }}>
//           <p>This is a custom height bottom panel with custom background color.</p>
//           <button onClick={() => togglePanel("bottom")}>Close Panel</button>
//         </div>
//       </SlidingPanel>
//     </div>
//   );
// };

// export default SlidingPanelDemo;