import { useState } from "react";

const CustomButton = ({
    children,
    variant = "primary",
    size = "medium",
    disabled = false,
    fullWidth = false,
    leftIcon = null,
    rightIcon = null,
    onClick,
    type = "button",
    loading = false,
    className = "",
    // New parameters
    padding = "", // Custom padding override
    margin = "", // Custom margin override
    color = "", // Custom text color
    bgColor = "", // Custom background color
    hoverColor = "", // Custom hover background color
    borderColor = "", // Custom border color
    borderWidth = "", // Custom border width
    borderRadius = "", // Custom border radius
    fontWeight = "", // Custom font weight
    fontSize = "", // Custom font size
    shadow = "", // Custom shadow
    transition = "", // Custom transition
    ariaLabel = "", // Accessibility label
    testId = "", // Test ID for automated testing

    // Customizable hover effects
    hoverScale = "", // e.g. "scale-105", "scale-110"
    hoverRotate = "", // e.g. "rotate-1", "rotate-3"
    hoverTranslate = "", // e.g. "translate-y-1"
    hoverShadow = "", // e.g. "shadow-lg"
    hoverAnimation = "", // Any custom animation class
    customHoverEffect = "", // For any other tailwind hover effect
}) => {
    const [isPressed, setIsPressed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Base styles
    const baseStyles =
        "font-medium focus:outline-none transition-all duration-200";

    // Border radius style with override
    const radiusStyle = borderRadius || "rounded";

    // Focus ring style
    const focusRingStyle = "focus:ring-2 focus:ring-offset-2";

    // Size styles with override
    const sizeStyles = {
        small: padding || "py-1 px-3",
        medium: padding || "py-2 px-4",
        large: padding || "py-3 px-6",
    };

    // Font size with override
    const fontSizeStyles = {
        small: fontSize || "text-xs",
        medium: fontSize || "text-sm",
        large: fontSize || "text-base",
    };

    // Custom hover effect
    const getHoverEffectClasses = () => {
        if (!isHovered || disabled) return "";

        const effects = [];

        // Only apply these effects when hovered but not pressed
        if (!isPressed) {
            // Apply scale effect if provided
            if (hoverScale) effects.push(`transform ${hoverScale}`);

            // Apply rotate effect if provided
            if (hoverRotate) effects.push(`transform ${hoverRotate}`);

            // Apply translate effect if provided
            if (hoverTranslate) effects.push(`transform ${hoverTranslate}`);

            // Apply shadow effect if provided
            if (hoverShadow) effects.push(hoverShadow);

            // Apply animation if provided
            if (hoverAnimation) effects.push(hoverAnimation);

            // Apply any custom hover effect if provided
            if (customHoverEffect) effects.push(customHoverEffect);
        }

        return effects.join(" ");
    };

    // Custom color generation
    const generateCustomColors = () => {
        if (bgColor) {
            const hoverStyles = hoverColor || "hover:opacity-90";
            const pressedStyles = isPressed ? "opacity-80" : "";
            const hoveredStyles =
                isHovered && !isPressed && !hoverColor ? "opacity-95" : "";

            return `${bgColor} ${hoverStyles} ${
                color || "text-white"
            } ${pressedStyles} ${hoveredStyles}`;
        }
        return "";
    };

    // Variant styles with custom color override
    const variantStyles = {
        primary:
            generateCustomColors() ||
            `bg-blue-600 ${
                isHovered ? "bg-blue-700" : ""
            } hover:bg-blue-700 focus:ring-blue-500 text-white ${
                isPressed ? "bg-blue-800" : ""
            }`,
        secondary:
            generateCustomColors() ||
            `bg-gray-200 ${
                isHovered ? "bg-gray-300" : ""
            } hover:bg-gray-300 focus:ring-gray-500 text-gray-800 ${
                isPressed ? "bg-gray-400" : ""
            }`,
        success:
            generateCustomColors() ||
            `bg-green-600 ${
                isHovered ? "bg-green-700" : ""
            } hover:bg-green-700 focus:ring-green-500 text-white ${
                isPressed ? "bg-green-800" : ""
            }`,
        danger:
            generateCustomColors() ||
            `bg-red-600 ${
                isHovered ? "bg-red-700" : ""
            } hover:bg-red-700 focus:ring-red-500 text-white ${
                isPressed ? "bg-red-800" : ""
            }`,
        warning:
            generateCustomColors() ||
            `bg-yellow-500 ${
                isHovered ? "bg-yellow-600" : ""
            } hover:bg-yellow-600 focus:ring-yellow-500 text-white ${
                isPressed ? "bg-yellow-700" : ""
            }`,
        info:
            generateCustomColors() ||
            `bg-cyan-500 ${
                isHovered ? "bg-cyan-600" : ""
            } hover:bg-cyan-600 focus:ring-cyan-500 text-white ${
                isPressed ? "bg-cyan-700" : ""
            }`,
        light:
            generateCustomColors() ||
            `bg-gray-100 ${
                isHovered ? "bg-gray-200" : ""
            } hover:bg-gray-200 focus:ring-gray-400 text-gray-800 ${
                isPressed ? "bg-gray-300" : ""
            }`,
        dark:
            generateCustomColors() ||
            `bg-gray-800 ${
                isHovered ? "bg-gray-900" : ""
            } hover:bg-gray-900 focus:ring-gray-600 text-white ${
                isPressed ? "bg-gray-950" : ""
            }`,
        outline:
            generateCustomColors() ||
            `bg-transparent ${isHovered ? "bg-opacity-10" : ""} border ${
                borderColor ? borderColor : "border-current"
            } hover:bg-opacity-10 ${color || "text-blue-600"} ${
                isPressed ? "bg-blue-100" : ""
            }`,
        ghost:
            generateCustomColors() ||
            `bg-transparent ${
                isHovered ? "bg-gray-100" : ""
            } hover:bg-gray-100 ${color || "text-gray-800"} ${
                isPressed ? "bg-gray-200" : ""
            }`,
    };

    // Width style
    const widthStyle = fullWidth ? "w-full" : "";

    // Margin style with override
    const marginStyle = margin || "";

    // Border width style with override
    const borderWidthStyle = borderWidth || "";

    // Font weight style with override
    const fontWeightStyle = fontWeight || "";

    // Shadow style with override
    const shadowStyle = shadow || "";

    // Transition style with override
    const transitionStyle = transition || "";

    // Disabled style
    const disabledStyle = disabled
        ? "opacity-50 cursor-not-allowed"
        : "cursor-pointer";

    // Loading animation
    const LoadingSpinner = () => (
        <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
    );

    const handleMouseDown = () => {
        if (!disabled) setIsPressed(true);
    };

    const handleMouseUp = () => {
        if (!disabled) setIsPressed(false);
    };

    const handleMouseEnter = () => {
        if (!disabled) setIsHovered(true);
    };

    const handleMouseLeave = () => {
        if (!disabled) {
            setIsHovered(false);
            setIsPressed(false);
        }
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label={ariaLabel || children}
            data-testid={testId}
            className={`
        ${baseStyles}
        ${radiusStyle}
        ${focusRingStyle}
        ${sizeStyles[size]}
        ${fontSizeStyles[size]}
        ${variantStyles[variant]}
        ${widthStyle}
        ${marginStyle}
        ${borderWidthStyle}
        ${fontWeightStyle}
        ${shadowStyle}
        ${transitionStyle}
        ${getHoverEffectClasses()}
        ${disabledStyle}
        ${className}
        ${loading ? "cursor-wait" : ""}
        flex items-center justify-center
        `}
        >
            {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}
            {loading && <LoadingSpinner />}
            {children}
            {rightIcon && !loading && <span className="ml-2">{rightIcon}</span>}
        </button>
    );
};

export default CustomButton;

// Usage:
// import React from "react";
// import { CustomButton } from "./components";

// const CustomButtonDemo = () => {
//     const variants = [
//         "primary",
//         "secondary",
//         "success",
//         "danger",
//         "warning",
//         "info",
//         "light",
//         "dark",
//         "outline",
//         "ghost",
//     ];
//     const sizes = ["small", "medium", "large"];

//     return (
//         <div className="p-6 w-3xl space-y-6 bg-gray-50 rounded-lg">
//             <h2 className="text-xl font-bold mb-4">CustomButton Variants</h2>
//             <div className="flex flex-wrap gap-3">
//                 {variants.map((variant) => (
//                     <CustomButton key={variant} variant={variant}>
//                         {variant.charAt(0).toUpperCase() + variant.slice(1)}
//                     </CustomButton>
//                 ))}
//             </div>
//             <h2 className="text-xl font-bold mb-4">CustomButton Sizes</h2>
//             <div className="flex items-center gap-3">
//                 {sizes.map((size) => (
//                     <CustomButton key={size} size={size}>
//                         {size.charAt(0).toUpperCase() + size.slice(1)}
//                     </CustomButton>
//                 ))}
//             </div>
//             <h2 className="text-xl font-bold mb-4">CustomButton States</h2>
//             <div className="flex flex-wrap gap-3">
//                 <CustomButton disabled>Disabled</CustomButton>
//                 <CustomButton loading>Loading</CustomButton>
//                 <CustomButton fullWidth>Full Width</CustomButton>
//             </div>
//             <h2 className="text-xl font-bold mb-4">CustomButtons with Icons</h2>
//             <div className="flex flex-wrap gap-3">
//                 <CustomButton
//                     leftIcon={
//                         <svg
//                             className="w-4 h-4"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                             xmlns="http://www.w3.org/2000/svg"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="2"
//                                 d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                             ></path>
//                         </svg>
//                     }
//                 >
//                     Add Item
//                 </CustomButton>
//                 <CustomButton
//                     rightIcon={
//                         <svg
//                             className="w-4 h-4"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                             xmlns="http://www.w3.org/2000/svg"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="2"
//                                 d="M17 8l4 4m0 0l-4 4m4-4H3"
//                             ></path>
//                         </svg>
//                     }
//                     variant="success"
//                 >
//                     Continue
//                 </CustomButton>
//                 <CustomButton
//                     leftIcon={
//                         <svg
//                             className="w-4 h-4"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                             xmlns="http://www.w3.org/2000/svg"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="2"
//                                 d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
//                             ></path>
//                         </svg>
//                     }
//                     variant="info"
//                 >
//                     Download
//                 </CustomButton>
//             </div>
//             {/* // Basic usage with custom styling */}
//             <CustomButton
//                 padding="py-4 px-8"
//                 margin="mt-4"
//                 bgColor="bg-purple-600"
//                 hoverColor="hover:bg-purple-700"
//                 color="text-white"
//                 borderRadius="rounded-full"
//             >
//                 Custom Styled Button
//             </CustomButton>
//             {/* // Custom border */}
//             <CustomButton
//                 variant="outline"
//                 borderColor="border-red-500"
//                 borderWidth="border-2"
//                 color="text-red-500"
//             >
//                 Outlined Button
//             </CustomButton>
//             {/* // With shadow a    nd custom transition */}
//             <CustomButton
//                 shadow="shadow-lg"
//                 transition="transition-all duration-300"
//             >
//                 Shadowed Button
//             </CustomButton>
//             // Button that scales up on hover
//             <CustomButton hoverScale="scale-110">Scale on Hover</CustomButton>
//             // Button that moves up slightly on hover
//             <CustomButton hoverTranslate="-translate-y-1" variant="success">
//                 Float Up
//             </CustomButton>
//             // Button with shadow effect on hover
//             <CustomButton hoverShadow="shadow-xl" variant="primary">
//                 Shadow on Hover
//             </CustomButton>
//             // Combined hover effects
//             <CustomButton
//                 hoverScale="scale-105"
//                 hoverShadow="shadow-lg"
//                 hoverTranslate="-translate-y-1"
//                 transition="transition-all duration-300"
//             >
//                 Multiple Effects
//             </CustomButton>
//             // Custom animation
//             <CustomButton
//                 className="gradient-bg text-white"
//                 customHoverEffect="animate-gradient-flow"
//             >
//                 Animated Gradient on Hover
//             </CustomButton>
//         </div>
//     );
// };

// export default CustomButtonDemo;
