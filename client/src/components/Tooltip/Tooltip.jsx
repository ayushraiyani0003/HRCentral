import React, { useState, useRef, useEffect } from "react";
import "./tooltipStyles.css";

// Usage:
/** <div style={{ marginBottom: "2rem" }}>
    <h3
        style={{
            fontSize: "1rem",
            fontWeight: "600",
            color: "#4b5563",
            marginBottom: "1rem",
        }}
    >
        Tooltips & Popovers
    </h3>

    <div
        style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
        }}
    >
        //{ Simple tooltip }
        <Tooltip
            content={
                <div style={{ width: "100px" }}>This is a simple tooltip</div>
            }
            position="top"
            maxWidth={800}
        >
            <button
                style={{
                    padding: "0.5rem 1rem",
                    background: "#f3f4f6",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                }}
            >
                Hover me
            </button>
        </Tooltip>

        {/* Tooltip with HTML content }
        <Tooltip
            content={
                <div style={{ width: "100px" }}>
                    <strong>Bold text</strong> and <em>italic text</em>
                </div>
            }
            position="bottom"
        >
            <button
                style={{
                    padding: "0.5rem 1rem",
                    background: "#f3f4f6",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                }}
            >
                Rich tooltip
            </button>
        </Tooltip>

        {/* Popover with title and content }
        <Popover
            title="Need help?"
            content="This is a popover with more information. Click outside to close."
            position="bottom"
        >
            <button
                style={{
                    padding: "0.5rem 1rem",
                    background: "#f3f4f6",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                }}
            >
                Click me
            </button>
        </Popover>

        {/* Rich popover with formatted content }
        <Popover
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
        </Popover>
    </div>
</div>; */

const Tooltip = ({
    children,
    content,
    position = "top", // top, right, bottom, left
    trigger = "hover", // hover, click
    arrow = true,
    maxWidth = 250,
    className = "",
    disabled = false,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const triggerRef = useRef(null);
    const tooltipRef = useRef(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

    // Handle showing/hiding tooltip
    const showTooltip = () => {
        if (!disabled) {
            setIsVisible(true);
        }
    };

    const hideTooltip = () => {
        setIsVisible(false);
    };

    // Handle click outside for click trigger
    useEffect(() => {
        if (trigger === "click" && isVisible) {
            const handleClickOutside = (e) => {
                if (
                    triggerRef.current &&
                    !triggerRef.current.contains(e.target) &&
                    tooltipRef.current &&
                    !tooltipRef.current.contains(e.target)
                ) {
                    hideTooltip();
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [trigger, isVisible]);

    // Calculate position when tooltip becomes visible
    useEffect(() => {
        if (isVisible && triggerRef.current && tooltipRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();

            let top = 0;
            let left = 0;

            // Position calculations
            switch (position) {
                case "top":
                    top = -tooltipRect.height - 10;
                    left = (triggerRect.width - tooltipRect.width) / 2;
                    break;
                case "right":
                    top = (triggerRect.height - tooltipRect.height) / 2;
                    left = triggerRect.width + 10;
                    break;
                case "bottom":
                    top = triggerRect.height + 10;
                    left = (triggerRect.width - tooltipRect.width) / 2;
                    break;
                case "left":
                    top = (triggerRect.height - tooltipRect.height) / 2;
                    left = -tooltipRect.width - 10;
                    break;
                default:
                    top = -tooltipRect.height - 10;
                    left = (triggerRect.width - tooltipRect.width) / 2;
            }

            setTooltipPosition({ top, left });
        }
    }, [isVisible, position]);

    // Event handlers based on trigger type
    const triggerEvents =
        trigger === "hover"
            ? {
                  onMouseEnter: showTooltip,
                  onMouseLeave: hideTooltip,
                  onFocus: showTooltip,
                  onBlur: hideTooltip,
              }
            : {
                  onClick: (e) => {
                      e.stopPropagation();
                      setIsVisible(!isVisible);
                  },
              };

    return (
        <div
            className={`tooltip-container ${className}`}
            ref={triggerRef}
            {...triggerEvents}
        >
            {children}

            {isVisible && (
                <div
                    className={`tooltip-content tooltip-${position} ${
                        arrow ? "tooltip-has-arrow" : ""
                    }`}
                    ref={tooltipRef}
                    style={{
                        top: tooltipPosition.top,
                        left: tooltipPosition.left,
                        maxWidth: `${maxWidth}px`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {content}
                    {arrow && (
                        <div
                            className={`tooltip-arrow tooltip-arrow-${position}`}
                        ></div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
