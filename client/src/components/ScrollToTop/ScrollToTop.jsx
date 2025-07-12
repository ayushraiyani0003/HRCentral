import React, { useState, useEffect, forwardRef } from "react";
import "./scrollToTopStyles.css";

/**
 * ScrollToTop - A customizable button that appears when users scroll down the page
 *
 * @param {Object} props - Component props
 * @param {number} props.threshold - Scroll distance in pixels before showing the button
 * @param {string} props.position - Position on screen ('bottom-right', 'bottom-left', 'bottom-center')
 * @param {string} props.variant - Visual style variant ('primary', 'neutral', 'minimal')
 * @param {string} props.size - Button size ('small', 'medium', 'large')
 * @param {number} props.zIndex - Z-index for the button
 * @param {boolean} props.showShadow - Whether to show drop shadow
 * @param {string} props.ariaLabel - Accessibility label for screen readers
 * @param {string} props.icon - Custom icon element
 * @param {boolean} props.mobileOptimized - Apply touch-friendly sizing on small screens
 * @param {string} props.className - Additional CSS class names
 * @param {Function} props.onClick - Optional callback when button is clicked
 */
const ScrollToTop = forwardRef(
    (
        {
            threshold = 300,
            position = "bottom-right",
            variant = "primary",
            size = "medium",
            zIndex = 40,
            showShadow = true,
            ariaLabel = "Scroll to top",
            icon = null,
            mobileOptimized = true,
            className = "",
            onClick,
            ...rest
        },
        ref
    ) => {
        const [isVisible, setIsVisible] = useState(false);

        // Monitor scroll position
        useEffect(() => {
            const toggleVisibility = () => {
                if (window.pageYOffset > threshold) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            };

            // Set initial visibility
            toggleVisibility();

            // Add scroll event listener
            window.addEventListener("scroll", toggleVisibility);

            // Clean up
            return () => window.removeEventListener("scroll", toggleVisibility);
        }, [threshold]);

        // Scroll to top handler
        const scrollToTop = (e) => {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

            // Call custom onClick handler if provided
            if (onClick) {
                onClick(e);
            }
        };

        // Build class names based on props
        const buttonClasses = [
            "scroll-top-button",
            `scroll-top-${variant}`,
            `scroll-top-${size}`,
            `scroll-top-${position}`,
            showShadow ? "scroll-top-shadow" : "",
            mobileOptimized ? "scroll-top-mobile-optimized" : "",
            isVisible ? "scroll-top-visible" : "",
            className,
        ]
            .filter(Boolean)
            .join(" ");

        // Default arrow icon if no custom icon provided
        const defaultIcon = (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="scroll-top-icon"
            >
                <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
        );

        return (
            <button
                ref={ref}
                className={buttonClasses}
                onClick={scrollToTop}
                aria-label={ariaLabel}
                style={{ zIndex }}
                {...rest}
            >
                {icon || defaultIcon}
            </button>
        );
    }
);

// Named export for specific variants
export const PrimaryScrollToTop = (props) => (
    <ScrollToTop variant="primary" {...props} />
);
export const NeutralScrollToTop = (props) => (
    <ScrollToTop variant="neutral" {...props} />
);
export const MinimalScrollToTop = (props) => (
    <ScrollToTop variant="minimal" {...props} />
);

// Default export
export default ScrollToTop;

// Usage:
// import React, { useState } from "react";
// import ScrollToTop, {
//     NeutralScrollToTop,
//     MinimalScrollToTop,
// } from "./components/ScrollToTop/ScrollToTop";
// import BadgeCounter from "./components/BadgeCounter/BadgeCounter";

// const ScrollToTopExamples = () => {
//     // For tracking which example is active
//     const [activeVariant, setActiveVariant] = useState("primary");

//     // Generate dummy content to make the page scrollable
//     const generateDummyContent = () => {
//         return Array(10)
//             .fill()
//             .map((_, index) => (
//                 <div
//                     key={index}
//                     style={{
//                         padding: "2rem",
//                         margin: "1rem 0",
//                         backgroundColor: "#f9fafb",
//                         borderRadius: "0.5rem",
//                         border: "1px solid #e5e7eb",
//                     }}
//                 >
//                     <h3>Section {index + 1}</h3>
//                     <p>
//                         This is some dummy content to make the page scrollable.
//                         Scroll down to see the ScrollToTop button appear.
//                     </p>
//                     <p>
//                         Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//                         Nulla facilisi. Phasellus euismod, nisl vel ultricies
//                         tristique, nibh nisl vestibulum nisl, eget tincidunt
//                         nisi nisl vel nunc.
//                     </p>
//                 </div>
//             ));
//     };

//     // Custom icon example
//     const customIcon = (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M12 19V5M5 12l7-7 7 7" />
//         </svg>
//     );

//     // Handle variant selection
//     const handleVariantChange = (variant) => {
//         setActiveVariant(variant);
//     };

//     return (
//         <div
//             className="examples-container"
//             style={{
//                 padding: "2rem",
//                 maxWidth: "800px",
//                 margin: "0 auto",
//             }}
//         >
//             <h1>Scroll To Top Examples</h1>
//             <p>
//                 Scroll down to see the button appear, then click it to return to
//                 the top.
//             </p>

//             {/* Variant selector */}
//             <div
//                 style={{
//                     display: "flex",
//                     gap: "1rem",
//                     marginBottom: "2rem",
//                     position: "sticky",
//                     top: "1rem",
//                     zIndex: 30,
//                     backgroundColor: "white",
//                     padding: "1rem",
//                     borderRadius: "0.5rem",
//                     boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//                 }}
//             >
//                 <button
//                     onClick={() => handleVariantChange("primary")}
//                     style={{
//                         padding: "0.5rem 1rem",
//                         backgroundColor:
//                             activeVariant === "primary" ? "#6366f1" : "#f3f4f6",
//                         color:
//                             activeVariant === "primary" ? "white" : "#111827",
//                         border: "1px solid #e5e7eb",
//                         borderRadius: "0.5rem",
//                         cursor: "pointer",
//                     }}
//                 >
//                     Primary
//                 </button>
//                 <button
//                     onClick={() => handleVariantChange("neutral")}
//                     style={{
//                         padding: "0.5rem 1rem",
//                         backgroundColor:
//                             activeVariant === "neutral" ? "#6366f1" : "#f3f4f6",
//                         color:
//                             activeVariant === "neutral" ? "white" : "#111827",
//                         border: "1px solid #e5e7eb",
//                         borderRadius: "0.5rem",
//                         cursor: "pointer",
//                     }}
//                 >
//                     Neutral
//                 </button>
//                 <button
//                     onClick={() => handleVariantChange("minimal")}
//                     style={{
//                         padding: "0.5rem 1rem",
//                         backgroundColor:
//                             activeVariant === "minimal" ? "#6366f1" : "#f3f4f6",
//                         color:
//                             activeVariant === "minimal" ? "white" : "#111827",
//                         border: "1px solid #e5e7eb",
//                         borderRadius: "0.5rem",
//                         cursor: "pointer",
//                     }}
//                 >
//                     Minimal
//                 </button>
//                 <button
//                     onClick={() => handleVariantChange("custom")}
//                     style={{
//                         padding: "0.5rem 1rem",
//                         backgroundColor:
//                             activeVariant === "custom" ? "#6366f1" : "#f3f4f6",
//                         color: activeVariant === "custom" ? "white" : "#111827",
//                         border: "1px solid #e5e7eb",
//                         borderRadius: "0.5rem",
//                         cursor: "pointer",
//                     }}
//                 >
//                     Custom
//                 </button>
//             </div>

//             {/* Rendered content */}
//             {generateDummyContent()}

//             {/* Different ScrollToTop variations based on selection */}
//             {activeVariant === "primary" && (
//                 <ScrollToTop
//                     threshold={200}
//                     position="bottom-right"
//                     size="medium"
//                 />
//             )}

//             {activeVariant === "neutral" && (
//                 <NeutralScrollToTop
//                     threshold={200}
//                     position="bottom-left"
//                     size="medium"
//                 />
//             )}

//             {activeVariant === "minimal" && (
//                 <MinimalScrollToTop
//                     threshold={200}
//                     position="bottom-center"
//                     size="medium"
//                 />
//             )}

//             {activeVariant === "custom" && (
//                 <ScrollToTop
//                     threshold={200}
//                     position="bottom-right"
//                     size="large"
//                     variant="primary"
//                     icon={customIcon}
//                     onClick={() => console.log("Custom scroll to top clicked")}
//                     // Example of combining with BadgeCounter
//                     children={
//                         <BadgeCounter
//                             count={3}
//                             position="top-right"
//                             size="small"
//                             variant="danger"
//                         >
//                             <div
//                                 style={{ width: "100%", height: "100%" }}
//                             ></div>
//                         </BadgeCounter>
//                     }
//                 />
//             )}
//         </div>
//     );
// };

// export default ScrollToTopExamples;
