import React, { forwardRef } from "react";
import "./customContainerStyles.css";

const CustomContainer = forwardRef(
    (
        {
            children,
            className = "",
            title = "",
            description = "",
            titleRequired = false,
            elevation = "low", // "none", "low", "medium", "high"
            padding = "medium", // "none", "small", "medium", "large"
            border = true,
            rounded = "medium", // "none", "small", "medium", "large", "full"
            backgroundColor = "white", // "white", "light", "dark", "primary", "accent", "custom"
            customBackgroundColor = "",
            width = "auto", // "auto", "full", "half", "custom"
            customWidth = "",
            minHeight = "",
            maxHeight = "",
            withOverflow = false,
            hasError = false,
            headerActions = null,
            footerContent = null,
            footerBorder = true,
            headerBorder = true,
            headerClassName = "",
            icon = null,
            titleCssClass = "",
            overflowContent=false,
            isFixedFooter,
            ...rest
        },
        ref
    ) => {
        // Helper function to generate container classes
        const getContainerClasses = () => {
            const classes = ["custom-container"];

            // Apply elevation
            classes.push(`elevation-${elevation}`);

            // Apply padding
            classes.push(`padding-${padding}`);

            // Apply border
            if (border) classes.push("with-border");

            // Apply rounded corners
            classes.push(`rounded-${rounded}`);

            // Apply background color
            classes.push(`bg-${backgroundColor}`);

            // Apply width
            classes.push(`width-${width}`);

            // Apply error state
            if (hasError) classes.push("has-error");

            // Apply overflow
            if (withOverflow) classes.push("with-overflow");

            // Apply custom class
            if (className) classes.push(className);

            return classes.join(" ");
        };

        const containerStyle = {
            ...(customBackgroundColor && {
                backgroundColor: customBackgroundColor,
            }),
            ...(customWidth && { width: customWidth }),
            ...(minHeight && { minHeight }),
            ...(maxHeight && { maxHeight }),
        };

        return (
            <div
                ref={ref}
                className={getContainerClasses()}
                style={containerStyle}
                {...rest}
            >
                {/* Container Header with Title */}
                {(title || headerActions) && (
                    <div
                        className={`container-header ${
                            headerBorder ? "with-border" : ""
                        }
                        ${headerClassName}
                        `}
                    >
                        {title && (
                            <div className="container-title flex flex-col justify-start">
                                <div className="flex flex-row gap-1.5 items-center">
                                    {icon && (
                                        <div className="container-icon">{icon}</div>
                                    )}
                                <h3 className={`title-text ${titleCssClass}`}>
                                    {title}
                                    {titleRequired && (
                                        <span className="required-mark">*</span>
                                    )}
                                </h3></div>
                                <h4 className="title-subtext">
                                    {description}
                                </h4>
                            </div>
                        )}
                        {headerActions && (
                            <div className="container-header-actions">
                                {headerActions}
                            </div>
                        )}
                    </div>
                )}

                {/* Container Content */}
                <div className={`container-content ${overflowContent ? "overflow-content" : ""}`} >{children}</div>

                {/* Container Footer */}
                {footerContent && (
                    <div
                        className={`container-footer ${
                            footerBorder ? "with-border" : ""
                        }`}
                    >
                        {footerContent}
                    </div>
                )}
            </div>
        );
    }
);

export default CustomContainer;

// Usage: - - - - - - - - - - - - - - - - - - - - -
// import React from "react";
// import CustomContainer from "./components/CustomContainer/CustomContainer";

// const ExampleUsage = () => {
//     // Example content for the containers
//     const renderActions = () => (
//         <div style={{ display: "flex", gap: "8px" }}>
//             <button className="action-button">
//                 <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="20"
//                     height="20"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                 >
//                     <path
//                         fillRule="evenodd"
//                         d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7.805V10a1 1 0 01-2 0V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H16a1 1 0 110 2h-5a1 1 0 01-1-1v-5a1 1 0 112 0v2.5a3.002 3.002 0 01-2.83 2.994 1 1 0 01-.61-1.276l.447-1.16z"
//                         clipRule="evenodd"
//                     />
//                 </svg>
//             </button>
//             <button className="action-button">
//                 <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="20"
//                     height="20"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                 >
//                     <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
//                 </svg>
//             </button>
//         </div>
//     );

//     // Icon example
//     const infoIcon = (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="20"
//             height="20"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//         >
//             <path
//                 fillRule="evenodd"
//                 d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
//                 clipRule="evenodd"
//             />
//         </svg>
//     );

//     // Footer content example
//     const footerContent = (
//         <div
//             style={{
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 gap: "8px",
//             }}
//         >
//             <button
//                 style={{
//                     padding: "0.5rem 1rem",
//                     backgroundColor: "#f3f4f6",
//                     border: "1px solid #d1d5db",
//                     borderRadius: "0.375rem",
//                     fontSize: "0.875rem",
//                 }}
//             >
//                 Cancel
//             </button>
//             <button
//                 style={{
//                     padding: "0.5rem 1rem",
//                     backgroundColor: "#6366f1",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "0.375rem",
//                     fontSize: "0.875rem",
//                 }}
//             >
//                 Save
//             </button>
//         </div>
//     );

//     return (
//         <div
//             style={{
//                 padding: "2rem",
//                 backgroundColor: "#f9fafb",
//                 minHeight: "100vh",
//             }}
//         >
//             <h1
//                 style={{
//                     marginBottom: "2rem",
//                     fontSize: "1.5rem",
//                     fontWeight: "600",
//                 }}
//             >
//                 CustomContainer Examples
//             </h1>

//             {/* Default Container */}
//             <CustomContainer title="Default Container">
//                 <p>
//                     This is the default container with medium elevation and
//                     padding.
//                 </p>
//             </CustomContainer>

//             {/* Container with header actions */}
//             <CustomContainer
//                 title="With Header Actions"
//                 headerActions={renderActions()}
//                 elevation="high"
//             >
//                 <p>
//                     This container includes action buttons in the header and has
//                     higher elevation.
//                 </p>
//             </CustomContainer>

//             {/* Container with icon */}
//             <CustomContainer
//                 title="With Icon"
//                 icon={infoIcon}
//                 backgroundColor="light"
//             >
//                 <p>
//                     This container has an info icon and light background color.
//                 </p>
//             </CustomContainer>

//             {/* Container with footer */}
//             <CustomContainer
//                 title="With Footer"
//                 footerContent={footerContent}
//                 padding="large"
//             >
//                 <p>
//                     This container includes a footer with action buttons and has
//                     larger padding.
//                 </p>
//             </CustomContainer>

//             {/* Container with error state */}
//             <CustomContainer
//                 title="Error State"
//                 hasError={true}
//                 rounded="large"
//             >
//                 <p>
//                     This container is displaying an error state and has larger
//                     rounded corners.
//                 </p>
//             </CustomContainer>

//             {/* Container with custom width and background */}
//             <CustomContainer
//                 title="Custom Styling"
//                 rounded="small"
//                 backgroundColor="custom"
//                 customBackgroundColor="#f0f9ff"
//                 customWidth="75%"
//                 elevation="low"
//             >
//                 <p>This container has custom width and background color.</p>
//             </CustomContainer>

//             {/* Container without title */}
//             <CustomContainer padding="small" border={false} elevation="high">
//                 <p>
//                     This container has no title, smaller padding, and no border
//                     (shadow only).
//                 </p>
//             </CustomContainer>
//         </div>
//     );
// };

// export default ExampleUsage;
