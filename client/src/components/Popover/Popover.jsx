import React, { useState, useRef, useEffect } from "react";
import "./popoverStyles.css";

// Usage:=
// <Popover
// title="Need help?"
// content="This is a popover with more information. Click outside to close."
// position="bottom">
// <button style={{
// padding: "0.5rem 1rem",
// background: "#f3f4f6",
// border: "1px solid #e5e7eb",
// borderRadius: "0.375rem",
// fontSize: "0.875rem",
// cursor: "pointer"
// }}
// >
// Click me
// </button>
// </Popover>
{
    /* <Popover
    title="Notification Settings"
    content={richPopoverContent}
    position="left"
    maxWidth={250}
>
    <button
        style={{
            padding: "0.5rem 1rem",
            background: "#6366f1",
            border: "none",
            borderRadius: "0.375rem",
            fontSize: "0.875rem",
            color: "white",
            cursor: "pointer",
        }}
    >
        Rich popover
    </button>
</Popover>; */
}

const Popover = ({
    children,
    content,
    title,
    position = "bottom", // top, right, bottom, left
    arrow = true,
    closeButton = true,
    maxWidth = 300,
    className = "",
    disabled = false,
    onClose = () => {},
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const triggerRef = useRef(null);
    const popoverRef = useRef(null);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

    // Toggle popover visibility
    const togglePopover = (e) => {
        e.stopPropagation();
        if (!disabled) {
            setIsVisible(!isVisible);
            if (isVisible) {
                onClose();
            }
        }
    };

    // Close popover
    const closePopover = () => {
        setIsVisible(false);
        onClose();
    };

    // Handle click outside
    useEffect(() => {
        if (isVisible) {
            const handleClickOutside = (e) => {
                if (
                    triggerRef.current &&
                    !triggerRef.current.contains(e.target) &&
                    popoverRef.current &&
                    !popoverRef.current.contains(e.target)
                ) {
                    closePopover();
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [isVisible]);

    // Calculate position when popover becomes visible
    useEffect(() => {
        if (isVisible && triggerRef.current && popoverRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const popoverRect = popoverRef.current.getBoundingClientRect();

            let top = 0;
            let left = 0;

            // Position calculations
            switch (position) {
                case "top":
                    top = -popoverRect.height - 10;
                    left = (triggerRect.width - popoverRect.width) / 2;
                    break;
                case "right":
                    top = (triggerRect.height - popoverRect.height) / 2;
                    left = triggerRect.width + 10;
                    break;
                case "bottom":
                    top = triggerRect.height + 10;
                    left = (triggerRect.width - popoverRect.width) / 2;
                    break;
                case "left":
                    top = (triggerRect.height - popoverRect.height) / 2;
                    left = -popoverRect.width - 10;
                    break;
                default:
                    top = triggerRect.height + 10;
                    left = (triggerRect.width - popoverRect.width) / 2;
            }

            setPopoverPosition({ top, left });
        }
    }, [isVisible, position]);

    return (
        <div className={`popover-container ${className}`} ref={triggerRef}>
            <div className="popover-trigger" onClick={togglePopover}>
                {children}
            </div>

            {isVisible && (
                <div
                    className={`popover-content popover-${position} ${
                        arrow ? "popover-has-arrow" : ""
                    }`}
                    ref={popoverRef}
                    style={{
                        top: popoverPosition.top,
                        left: popoverPosition.left,
                        maxWidth: `${maxWidth}px`,
                    }}
                >
                    {closeButton && (
                        <button
                            className="popover-close-button"
                            onClick={closePopover}
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
                    )}

                    {title && <div className="popover-title">{title}</div>}
                    <div className="popover-body">{content}</div>

                    {arrow && (
                        <div
                            className={`popover-arrow popover-arrow-${position}`}
                        ></div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Popover;
