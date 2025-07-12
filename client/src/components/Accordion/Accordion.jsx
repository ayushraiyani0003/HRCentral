import React, { useState, useRef, useEffect } from "react";
import "./accordionStyles.css";

const AccordionItem = ({
    title,
    children,
    isOpen,
    toggleItem,
    index,
    disabled = false,
    icon = null,
    badge = null,
}) => {
    const contentRef = useRef(null);
    const [height, setHeight] = useState(0);

    // Calculate height for smooth animation
    useEffect(() => {
        if (contentRef.current) {
            setHeight(isOpen ? contentRef.current.scrollHeight : 0);
        }
    }, [isOpen, children]);

    // Handle click event
    const handleClick = () => {
        if (!disabled) {
            toggleItem(index);
        }
    };

    return (
        <div
            className={`accordion-item ${isOpen ? "open" : ""} ${
                disabled ? "disabled" : ""
            }`}
        >
            <button
                className="accordion-header"
                onClick={handleClick}
                disabled={disabled}
                aria-expanded={isOpen}
            >
                {icon && <span className="accordion-icon">{icon}</span>}
                <span className="accordion-title">{title}</span>
                {badge && <span className="accordion-badge">{badge}</span>}
                <span className="accordion-arrow">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-chevron-down"
                    >
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
            </button>
            <div
                className="accordion-content"
                style={{ height: `${height}px` }}
            >
                <div className="accordion-content-inner" ref={contentRef}>
                    {children}
                </div>
            </div>
        </div>
    );
};

const Accordion = ({
    items,
    allowMultiple = false,
    defaultOpen = [],
    onChange = () => {},
    className = "",
}) => {
    const [openItems, setOpenItems] = useState(defaultOpen);

    // Toggle accordion item
    const toggleItem = (index) => {
        if (allowMultiple) {
            // If multiple is allowed, toggle the clicked item
            setOpenItems((prev) =>
                prev.includes(index)
                    ? prev.filter((item) => item !== index)
                    : [...prev, index]
            );
        } else {
            // If single only, set the clicked item as the only open one
            // or close it if it's already open
            setOpenItems((prev) => (prev.includes(index) ? [] : [index]));
        }
    };

    // Call onChange when open items change
    useEffect(() => {
        onChange(openItems);
    }, [openItems, onChange]);

    return (
        <div className={`accordion-container ${className}`}>
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.title}
                    index={index}
                    isOpen={openItems.includes(index)}
                    toggleItem={toggleItem}
                    disabled={item.disabled}
                    icon={item.icon}
                    badge={item.badge}
                >
                    {item.content}
                </AccordionItem>
            ))}
        </div>
    );
};

export default Accordion;

// Usages:

// function App() {
//     const [notifications, setNotifications] = useState(true);
//     const [darkMode, setDarkMode] = useState(false);
//     const [autoSave, setAutoSave] = useState(true);
//     const [emailSubscription, setEmailSubscription] = useState(false);
//     const [error, setError] = useState("");
//     const [openAccordionItems, setOpenAccordionItems] = useState([0]); // First accordion item open by default

//     const handleNotificationsToggle = (checked) => {
//         setNotifications(checked);
//     };

//     const handleDarkModeToggle = (checked) => {
//         setDarkMode(checked);
//         // Example of setting an error based on toggle state
//         if (checked) {
//             setError("Dark mode is in beta and might have some issues");
//         } else {
//             setError("");
//         }
//     };

//     // Example rich content for popover
//     const richPopoverContent = (
//         <div>
//             <h4>Personalized notifications</h4>
//             <p>Receive updates about:</p>
//             <ul>
//                 <li>Account activity</li>
//                 <li>New features and updates</li>
//                 <li>Security alerts</li>
//             </ul>
//             <p>
//                 You can customize your notification preferences in{" "}
//                 <a href="#settings">Settings</a>.
//             </p>
//         </div>
//     );

//     // Help icon for tooltips and popovers
//     const HelpIcon = () => (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//             width="16"
//             height="16"
//             style={{ color: "#6b7280" }}
//         >
//             <path
//                 fillRule="evenodd"
//                 d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
//                 clipRule="evenodd"
//             />
//         </svg>
//     );

//     // Settings icon for accordion
//     const SettingsIcon = () => (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//             width="16"
//             height="16"
//         >
//             <path
//                 fillRule="evenodd"
//                 d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
//                 clipRule="evenodd"
//             />
//         </svg>
//     );

//     // Security icon for accordion
//     const SecurityIcon = () => (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//             width="16"
//             height="16"
//         >
//             <path
//                 fillRule="evenodd"
//                 d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                 clipRule="evenodd"
//             />
//         </svg>
//     );

//     // Account icon for accordion
//     const AccountIcon = () => (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//             width="16"
//             height="16"
//         >
//             <path
//                 fillRule="evenodd"
//                 d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
//                 clipRule="evenodd"
//             />
//         </svg>
//     );

//     // FAQ icon for accordion
//     const FaqIcon = () => (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//             width="16"
//             height="16"
//         >
//             <path
//                 fillRule="evenodd"
//                 d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
//                 clipRule="evenodd"
//             />
//         </svg>
//     );

//     // Accordion items for settings
//     const settingsAccordionItems = [
//         {
//             title: "General Settings",
//             icon: <SettingsIcon />,
//             content: (
//                 <div>
//                     <p>Configure your general application preferences.</p>
//                     <div style={{ marginTop: "1rem" }}>
//                         <ToggleSwitch
//                             label="Enable notifications"
//                             checked={notifications}
//                             onChange={handleNotificationsToggle}
//                         />

//                         <ToggleSwitch
//                             label="Dark mode"
//                             checked={darkMode}
//                             onChange={handleDarkModeToggle}
//                             error={error}
//                         />

//                         <ToggleSwitch
//                             label="Auto-save documents"
//                             checked={autoSave}
//                             onChange={setAutoSave}
//                         />
//                     </div>
//                 </div>
//             ),
//         },
//         {
//             title: "Security",
//             icon: <SecurityIcon />,
//             badge: "Important",
//             content: (
//                 <div>
//                     <p>Manage your security and privacy settings.</p>
//                     <div style={{ marginTop: "1rem" }}>
//                         <ToggleSwitch
//                             label="Two-factor authentication"
//                             checked={true}
//                             onChange={() => {}}
//                         />

//                         <ToggleSwitch
//                             label="Password reset email"
//                             checked={true}
//                             onChange={() => {}}
//                         />
//                     </div>
//                 </div>
//             ),
//         },
//         {
//             title: "Account Information",
//             icon: <AccountIcon />,
//             content: (
//                 <div>
//                     <p>View and update your account details.</p>
//                     <div style={{ marginTop: "1rem" }}>
//                         <div style={{ marginBottom: "0.75rem" }}>
//                             <strong>Email:</strong> user@example.com
//                         </div>
//                         <div style={{ marginBottom: "0.75rem" }}>
//                             <strong>Plan:</strong> Premium
//                         </div>
//                         <div>
//                             <strong>Member since:</strong> Jan 15, 2023
//                         </div>
//                     </div>
//                 </div>
//             ),
//         },
//         {
//             title: "Subscription",
//             icon: <SettingsIcon />,
//             disabled: true,
//             content: "This section is currently unavailable.",
//         },
//     ];

//     // Accordion items for FAQ
//     const faqAccordionItems = [
//         {
//             title: "How do I reset my password?",
//             icon: <FaqIcon />,
//             content: (
//                 <div>
//                     <p>To reset your password:</p>
//                     <ol>
//                         <li>Click on "Forgot Password" on the login screen</li>
//                         <li>Enter your email address</li>
//                         <li>Check your email for a password reset link</li>
//                         <li>
//                             Click the link and follow the instructions to create
//                             a new password
//                         </li>
//                     </ol>
//                     <p>
//                         If you don't receive the email, please check your spam
//                         folder or contact support.
//                     </p>
//                 </div>
//             ),
//         },
//         {
//             title: "Can I use the app offline?",
//             icon: <FaqIcon />,
//             content: (
//                 <div>
//                     <p>
//                         Yes, many features of our app work offline. Your data
//                         will automatically sync when you regain internet
//                         connection.
//                     </p>
//                     <p>
//                         However, some features like real-time collaboration
//                         require an active internet connection.
//                     </p>
//                 </div>
//             ),
//         },
//         {
//             title: "How do I cancel my subscription?",
//             icon: <FaqIcon />,
//             content: (
//                 <div>
//                     <p>To cancel your subscription:</p>
//                     <ol>
//                         <li>Go to Account Settings</li>
//                         <li>Select "Subscription"</li>
//                         <li>Click "Cancel Subscription"</li>
//                         <li>Confirm your cancellation</li>
//                     </ol>
//                     <p>
//                         Your subscription will remain active until the end of
//                         the current billing period.
//                     </p>
//                 </div>
//             ),
//         },
//     ];

//     // Handle accordion changes
//     const handleAccordionChange = (openItems) => {
//         setOpenAccordionItems(openItems);
//     };

//     return (
//         <div className="App flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//             <div
//                 style={{
//                     padding: "2rem",
//                     maxWidth: "600px",
//                     backgroundColor: "white",
//                     borderRadius: "0.5rem",
//                     boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
//                 }}
//             >
//                 <h2
//                     style={{
//                         marginBottom: "1.5rem",
//                         fontSize: "1.5rem",
//                         fontWeight: "600",
//                         color: "#374151",
//                     }}
//                 >
//                     UI Components
//                 </h2>

//                 {/* Accordion Section - Settings */}
//                 <div style={{ marginBottom: "2rem" }}>
//                     <h3
//                         style={{
//                             fontSize: "1rem",
//                             fontWeight: "600",
//                             color: "#4b5563",
//                             marginBottom: "1rem",
//                         }}
//                     >
//                         Settings Accordion (Single Open)
//                     </h3>
//                     <Accordion
//                         items={settingsAccordionItems}
//                         allowMultiple={false}
//                         defaultOpen={[0]}
//                         onChange={handleAccordionChange}
//                     />
//                 </div>

//                 {/* Accordion Section - FAQ */}
//                 <div style={{ marginBottom: "2rem" }}>
//                     <h3
//                         style={{
//                             fontSize: "1rem",
//                             fontWeight: "600",
//                             color: "#4b5563",
//                             marginBottom: "1rem",
//                         }}
//                     >
//                         FAQ Accordion (Multiple Open)
//                     </h3>
//                     <Accordion
//                         items={faqAccordionItems}
//                         allowMultiple={true}
//                         defaultOpen={[0]}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// }
