import React, { useState, forwardRef } from "react";

// Mock components based on your descriptions
const CustomContainer = forwardRef(
    (
        {
            children,
            className = "",
            title = "",
            description = "",
            titleRequired = false,
            elevation = "low",
            padding = "medium",
            border = true,
            rounded = "medium",
            backgroundColor = "white",
            customBackgroundColor = "",
            width = "auto",
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
            overflowContent = false,
            isFixedFooter,
            ...rest
        },
        ref
    ) => {
        const elevationClasses = {
            none: "",
            low: "shadow-sm",
            medium: "shadow-md",
            high: "shadow-lg",
        };

        const paddingClasses = {
            none: "p-0",
            small: "p-2",
            medium: "p-4",
            large: "p-6",
        };

        const roundedClasses = {
            none: "",
            small: "rounded-sm",
            medium: "rounded-md",
            large: "rounded-lg",
            full: "rounded-full",
        };

        const bgClasses = {
            white: "bg-white",
            light: "bg-gray-50",
            dark: "bg-gray-800",
            primary: "bg-blue-50",
            accent: "bg-indigo-50",
        };

        return (
            <div
                ref={ref}
                className={`
                    ${elevationClasses[elevation]}
                    ${paddingClasses[padding]}
                    ${roundedClasses[rounded]}
                    ${bgClasses[backgroundColor]}
                    ${border ? "border border-gray-200" : ""}
                    ${
                        width === "full"
                            ? "w-full"
                            : width === "half"
                            ? "w-1/2"
                            : ""
                    }
                    ${hasError ? "border-red-300" : ""}
                    ${className}
                `}
                style={{
                    backgroundColor: customBackgroundColor || undefined,
                    width: customWidth || undefined,
                    minHeight: minHeight || undefined,
                    maxHeight: maxHeight || undefined,
                }}
                {...rest}
            >
                {(title || headerActions) && (
                    <div
                        className={`mb-4 ${
                            headerBorder ? "border-b border-gray-200 pb-4" : ""
                        } ${headerClassName}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {icon}
                                {title && (
                                    <h3
                                        className={`text-lg font-semibold text-gray-900 ${titleCssClass}`}
                                    >
                                        {title}
                                        {titleRequired && (
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        )}
                                    </h3>
                                )}
                            </div>
                            {headerActions}
                        </div>
                        {description && (
                            <p className="text-sm text-gray-600 mt-1">
                                {description}
                            </p>
                        )}
                    </div>
                )}

                <div className={overflowContent ? "overflow-auto" : ""}>
                    {children}
                </div>

                {footerContent && (
                    <div
                        className={`mt-4 ${
                            footerBorder ? "border-t border-gray-200 pt-4" : ""
                        }`}
                    >
                        {footerContent}
                    </div>
                )}
            </div>
        );
    }
);

const CustomTextInput = forwardRef(
    (
        {
            label,
            type = "text",
            placeholder,
            value,
            onChange,
            onClear,
            onlyNumbers = false,
            required = false,
            className = "",
            error = "",
            icon = null,
            autoComplete,
            maxLength,
            minLength,
            pattern,
            readOnly = false,
            disabled = false,
            helperText = "",
            ...rest
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);

        const handleInputChange = (e) => {
            let inputValue = e.target.value;

            if (onlyNumbers) {
                inputValue = inputValue.replace(/[^0-9]/g, "");
            }

            if (onChange) {
                onChange(inputValue);
            }
        };

        const inputType = type === "password" && showPassword ? "text" : type;

        return (
            <div className={`mb-4 ${className}`}>
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                        {required && (
                            <span className="text-red-500 ml-1">*</span>
                        )}
                    </label>
                )}

                <div className="relative">
                    {icon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {icon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        type={inputType}
                        value={value || ""}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        maxLength={maxLength}
                        minLength={minLength}
                        pattern={pattern}
                        readOnly={readOnly}
                        disabled={disabled}
                        className={`
                            w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                            ${icon ? "pl-10" : ""}
                            ${
                                error
                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300"
                            }
                            ${
                                disabled
                                    ? "bg-gray-100 cursor-not-allowed"
                                    : "bg-white"
                            }
                            ${readOnly ? "bg-gray-50" : ""}
                        `}
                        {...rest}
                    />

                    {type === "password" && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    )}

                    {onClear && value && (
                        <button
                            type="button"
                            onClick={onClear}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                {helperText && !error && (
                    <p className="mt-1 text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

function EmailSettings() {
    const [selectedProvider, setSelectedProvider] = useState("");
    const [formData, setFormData] = useState({
        emailAddress: "",
        password: "",
        imapServer: "",
        imapPort: "993",
        imapSecurity: "SSL",
        smtpServer: "",
        smtpPort: "587",
        smtpSecurity: "TLS",
    });
    const [errors, setErrors] = useState({});
    const [isTestingConnection, setIsTestingConnection] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState("");

    const emailProviders = [
        { value: "", label: "Select your email provider" },
        { value: "gmail", label: "Gmail" },
        { value: "outlook", label: "Outlook/Hotmail" },
        { value: "yahoo", label: "Yahoo Mail" },
        { value: "zoho", label: "Zoho Mail" },
        { value: "custom", label: "Custom/Other" },
    ];

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const handleProviderChange = (e) => {
        const provider = e.target.value;
        setSelectedProvider(provider);

        // Reset form data when provider changes
        setFormData({
            emailAddress: "",
            password: "",
            imapServer: "",
            imapPort: "993",
            imapSecurity: "SSL",
            smtpServer: "",
            smtpPort: "587",
            smtpSecurity: "TLS",
        });
        setErrors({});
        setConnectionStatus("");
    };

    const getEmailDomain = () => {
        switch (selectedProvider) {
            case "gmail":
                return "@gmail.com";
            case "yahoo":
                return "@yahoo.com";
            default:
                return "";
        }
    };

    const getHelpText = () => {
        switch (selectedProvider) {
            case "gmail":
                return "💡 Help: You need an App Password, not your regular Gmail password. Go to Gmail → Security → 2-Step Verification → App Passwords";
            case "outlook":
                return "💡 Help: You need an App Password from Microsoft Security settings.";
            case "yahoo":
                return "💡 Help: Enable 2FA first, then create App Password in Yahoo Account Security.";
            case "zoho":
                return "💡 Note: You can use your regular Zoho password or create an App Password.";
            default:
                return "";
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!selectedProvider) {
            newErrors.provider = "Please select an email provider";
        }

        if (!formData.emailAddress) {
            newErrors.emailAddress = "Email address is required";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        if (selectedProvider === "custom") {
            if (!formData.imapServer) {
                newErrors.imapServer = "IMAP server is required";
            }
            if (!formData.smtpServer) {
                newErrors.smtpServer = "SMTP server is required";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleTestConnection = async () => {
        if (!validateForm()) return;

        setIsTestingConnection(true);
        setConnectionStatus("");

        // Simulate connection test
        setTimeout(() => {
            setIsTestingConnection(false);
            setConnectionStatus("success");
        }, 2000);
    };

    const handleSave = () => {
        if (!validateForm()) return;

        console.log("Saving email settings:", { selectedProvider, formData });
        alert("Email settings saved successfully!");
    };

    const renderProviderSpecificFields = () => {
        if (!selectedProvider) return null;

        const domain = getEmailDomain();

        return (
            <>
                <CustomTextInput
                    label="Email Address"
                    type="email"
                    placeholder={
                        domain
                            ? `Enter username${domain}`
                            : "Enter your email address"
                    }
                    value={formData.emailAddress}
                    onChange={(value) =>
                        handleInputChange("emailAddress", value)
                    }
                    required
                    error={errors.emailAddress}
                />

                <CustomTextInput
                    label={
                        selectedProvider === "zoho"
                            ? "Password"
                            : "App Password"
                    }
                    type="password"
                    placeholder={
                        selectedProvider === "gmail"
                            ? "16 characters with dashes"
                            : selectedProvider === "yahoo"
                            ? "16 characters without dashes"
                            : selectedProvider === "outlook"
                            ? "16 characters"
                            : "Enter password"
                    }
                    value={formData.password}
                    onChange={(value) => handleInputChange("password", value)}
                    required
                    error={errors.password}
                />

                {selectedProvider === "custom" && (
                    <>
                        <div className="grid md:grid-cols-2 gap-4">
                            <CustomTextInput
                                label="IMAP Server"
                                placeholder="e.g., mail.company.com"
                                value={formData.imapServer}
                                onChange={(value) =>
                                    handleInputChange("imapServer", value)
                                }
                                required
                                error={errors.imapServer}
                            />

                            <CustomTextInput
                                label="IMAP Port"
                                placeholder="993"
                                value={formData.imapPort}
                                onChange={(value) =>
                                    handleInputChange("imapPort", value)
                                }
                                onlyNumbers
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                IMAP Security{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-4">
                                {["SSL", "TLS", "None"].map((option) => (
                                    <label
                                        key={option}
                                        className="flex items-center"
                                    >
                                        <input
                                            type="radio"
                                            name="imapSecurity"
                                            value={option}
                                            checked={
                                                formData.imapSecurity === option
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "imapSecurity",
                                                    e.target.value
                                                )
                                            }
                                            className="mr-2"
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <CustomTextInput
                                label="SMTP Server"
                                placeholder="e.g., mail.company.com"
                                value={formData.smtpServer}
                                onChange={(value) =>
                                    handleInputChange("smtpServer", value)
                                }
                                required
                                error={errors.smtpServer}
                            />

                            <CustomTextInput
                                label="SMTP Port"
                                placeholder="587"
                                value={formData.smtpPort}
                                onChange={(value) =>
                                    handleInputChange("smtpPort", value)
                                }
                                onlyNumbers
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                SMTP Security{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-4">
                                {["TLS", "SSL", "None"].map((option) => (
                                    <label
                                        key={option}
                                        className="flex items-center"
                                    >
                                        <input
                                            type="radio"
                                            name="smtpSecurity"
                                            value={option}
                                            checked={
                                                formData.smtpSecurity === option
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "smtpSecurity",
                                                    e.target.value
                                                )
                                            }
                                            className="mr-2"
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {getHelpText() && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                        <p className="text-sm text-blue-800">{getHelpText()}</p>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 p-4">
            <div className="w-full">
                <CustomContainer
                    title="Email Settings"
                    description="Configure your email account to send and receive messages"
                    icon={<span className="text-2xl">📧</span>}
                    elevation="medium"
                    padding="large"
                    className="mb-6"
                >
                    <div className="space-y-6">
                        {/* Provider Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select your email provider{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedProvider}
                                onChange={handleProviderChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.provider
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                            >
                                {emailProviders.map((provider) => (
                                    <option
                                        key={provider.value}
                                        value={provider.value}
                                    >
                                        {provider.label}
                                    </option>
                                ))}
                            </select>
                            {errors.provider && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.provider}
                                </p>
                            )}
                        </div>

                        {/* Dynamic Fields Based on Provider */}
                        {renderProviderSpecificFields()}

                        {/* Connection Status */}
                        {connectionStatus && (
                            <div
                                className={`p-3 rounded-md ${
                                    connectionStatus === "success"
                                        ? "bg-green-50 border border-green-200"
                                        : "bg-red-50 border border-red-200"
                                }`}
                            >
                                <p
                                    className={`text-sm ${
                                        connectionStatus === "success"
                                            ? "text-green-800"
                                            : "text-red-800"
                                    }`}
                                >
                                    {connectionStatus === "success"
                                        ? "✅ Connection successful! Your email settings are working correctly."
                                        : "❌ Connection failed. Please check your settings and try again."}
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        {selectedProvider && (
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <button
                                    onClick={handleTestConnection}
                                    disabled={isTestingConnection}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isTestingConnection ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Testing Connection...
                                        </>
                                    ) : (
                                        <>🔍 Test Connection</>
                                    )}
                                </button>

                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    💾 Save & Continue
                                </button>

                                {selectedProvider === "custom" && (
                                    <button
                                        onClick={() => {
                                            // Auto-detect logic would go here
                                            alert(
                                                "Auto-detect feature coming soon!"
                                            );
                                        }}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        🔍 Auto-detect settings
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </CustomContainer>

                {/* Additional Settings */}
                {/* <CustomContainer
                    title="Advanced Settings"
                    description="Optional configuration for power users"
                    elevation="low"
                    padding="large"
                    className="mt-6"
                >
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">
                                Sync Options
                            </h4>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        defaultChecked
                                    />
                                    <span className="text-sm">
                                        Sync sent items
                                    </span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        defaultChecked
                                    />
                                    <span className="text-sm">
                                        Sync deleted items
                                    </span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" />
                                    <span className="text-sm">
                                        Download attachments automatically
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">
                                Notification Settings
                            </h4>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        defaultChecked
                                    />
                                    <span className="text-sm">
                                        Email notifications
                                    </span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" />
                                    <span className="text-sm">
                                        Desktop notifications
                                    </span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" />
                                    <span className="text-sm">
                                        Sound notifications
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </CustomContainer> */}
            </div>
        </div>
    );
}

export default EmailSettings;
