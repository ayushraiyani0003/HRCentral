import React, { forwardRef } from "react";
import "./toggleSwitchStyles.css";

// Usage:
{
    /* <div style={{ padding: "2rem", maxWidth: "500px", backgroundColor: "white", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}>
    <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: "600", color: "#374151" }}>Toggle Switch Examples</h2> */
}

{
    /* Default size (medium) with right label */
}
// <ToggleSwitch
//     label="Enable notifications"
//     checked={notifications}
//     onChange={handleNotificationsToggle}
// />

{
    /* Small size with left label */
}
// <ToggleSwitch
//     label="Dark mode"
//     checked={darkMode}
//     onChange={handleDarkModeToggle}
//     size="small"
//     labelPosition="left"
//     error={error}
// />

{
    /* Large size with right label */
}
// <ToggleSwitch
//     label="Auto-save documents"
//     checked={autoSave}
//     onChange={setAutoSave}
//     size="large"
// />

{
    /* Disabled toggle */
}
// <ToggleSwitch
//     label="Email subscription"
//     checked={emailSubscription}
//     onChange={setEmailSubscription}
//     disabled={true}
// />

{
    /* Required toggle */
}
//         <ToggleSwitch
//             label="Accept terms and conditions"
//             checked={false}
//             onChange={() => {}}
//             required={true}
//         />
//     </div>
// </div>

const ToggleSwitch = forwardRef(
    (
        {
            label,
            checked = false,
            onChange,
            disabled = false,
            required = false,
            className = "",
            error = "",
            size = "medium", // small, medium, large
            labelPosition = "right", // left, right
            ...rest
        },
        ref
    ) => {
        // Handle toggle change - this is the key part for functionality
        const handleToggle = (e) => {
            e.preventDefault(); // Prevent default to manage state manually

            if (!disabled && onChange) {
                // Call onChange with the opposite of current checked state
                onChange(!checked);
            }
        };

        // Determine size classes
        const sizeClasses = {
            small: "toggle-switch-small",
            medium: "toggle-switch-medium",
            large: "toggle-switch-large",
        };

        // Determine label position classes
        const labelPositionClasses = {
            left: "toggle-label-left",
            right: "toggle-label-right",
        };

        return (
            <div className={`toggle-switch-container ${className}`}>
                <div
                    className={`toggle-switch-wrapper gap-2 ${
                        labelPositionClasses[labelPosition] ||
                        "toggle-label-right"
                    }`}
                >
                    {label && labelPosition === "left" && (
                        <label
                            className="toggle-switch-label"
                            onClick={!disabled ? handleToggle : undefined}
                        >
                            {label}
                            {required && (
                                <span className="required-mark">*</span>
                            )}
                        </label>
                    )}

                    <div
                        className={`toggle-switch ${
                            sizeClasses[size] || "toggle-switch-medium"
                        } ${disabled ? "disabled" : ""} ${
                            checked ? "checked" : ""
                        }`}
                        onClick={handleToggle}
                    >
                        <input
                            ref={ref}
                            type="checkbox"
                            className="toggle-switch-input"
                            checked={checked}
                            disabled={disabled}
                            onChange={(e) => {
                                // This is needed to satisfy React's controlled component pattern
                                // The actual state change is handled by handleToggle
                                if (onChange) onChange(e.target.checked);
                            }}
                            {...rest}
                        />
                        <span className="toggle-slider"></span>
                    </div>

                    {label && labelPosition === "right" && (
                        <label
                            className="toggle-switch-label"
                            onClick={!disabled ? handleToggle : undefined}
                        >
                            {label}
                            {required && (
                                <span className="required-mark">*</span>
                            )}
                        </label>
                    )}
                </div>

                {error && <div className="input-error-message">{error}</div>}
            </div>
        );
    }
);

export default ToggleSwitch;
