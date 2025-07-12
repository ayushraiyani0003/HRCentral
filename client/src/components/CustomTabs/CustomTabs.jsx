import React, { useState, useEffect, useRef } from "react";
import "./customTabsStyles.css";

// usage:
// const TabsDemo = () => {
//     const [selectedTab, setSelectedTab] = useState(0);
//     const [vertical1Tab, setVertical1Tab] = useState(0);
//     const [pillsTab, setPillsTab] = useState(0);
//     const [containedTab, setContainedTab] = useState(0);
//     const [indicatorTab, setIndicatorTab] = useState(0);

//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     // Basic tabs example
//     const basicTabs = [
//         {
//             label: "Home",
//             content: (
//                 <div className="p-4">
//                     <h3 className="text-lg font-medium text-gray-900 mb-3">
//                         Home Tab Content
//                     </h3>
//                     <p className="text-gray-700">
//                         This is the content for the Home tab. Basic tabs are
//                         great for simple content separation.
//                     </p>
//                 </div>
//             ),
//         },
//         {
//             label: "Profile",
//             content: (
//                 <div className="p-4">
//                     <h3 className="text-lg font-medium text-gray-900 mb-3">
//                         Profile Tab Content
//                     </h3>
//                     <p className="text-gray-700">
//                         Here you can see your profile information and settings.
//                     </p>
//                 </div>
//             ),
//         },
//         {
//             label: "Settings",
//             content: (
//                 <div className="p-4">
//                     <h3 className="text-lg font-medium text-gray-900 mb-3">
//                         Settings Tab Content
//                     </h3>
//                     <p className="text-gray-700">
//                         Adjust your account settings and preferences here.
//                     </p>
//                 </div>
//             ),
//         },
//     ];

//     // Tabs with icons
//     const iconTabs = [
//         {
//             label: "Home",
//             icon: <Home size={18} />,
//             content: (
//                 <div className="p-4">
//                     <h3 className="text-lg font-medium text-gray-900 mb-3">
//                         Home Dashboard
//                     </h3>
//                     <p className="text-gray-700">
//                         Welcome to your dashboard. Here's an overview of your
//                         recent activity.
//                     </p>
//                 </div>
//             ),
//         },
//         {
//             label: "Profile",
//             icon: <User size={18} />,
//             content: (
//                 <div className="p-4">
//                     <h3 className="text-lg font-medium text-gray-900 mb-3">
//                         User Profile
//                     </h3>
//                     <p className="text-gray-700">
//                         Manage your personal information and profile settings.
//                     </p>
//                 </div>
//             ),
//         },
//         {
//             label: "Settings",
//             icon: <Settings size={18} />,
//             content: (
//                 <div className="p-4">
//                     <h3 className="text-lg font-medium text-gray-900 mb-3">
//                         Account Settings
//                     </h3>
//                     <p className="text-gray-700">
//                         Customize your experience by adjusting these settings.
//                     </p>
//                 </div>
//             ),
//         },
//         {
//             label: "Notifications",
//             icon: <Bell size={18} />,
//             content: (
//                 <div className="p-4">
//                     <h3 className="text-lg font-medium text-gray-900 mb-3">
//                         Notification Preferences
//                     </h3>
//                     <p className="text-gray-700">
//                         Control when and how you receive notifications.
//                     </p>
//                 </div>
//             ),
//         },
//     ];

//     // Tabs with badges
//     const badgeTabs = [
//         {
//             label: "Inbox",
//             icon: <Mail size={18} />,
//             badge: "3",
//             content: (
//                 <div className="p-4">
//                     <h3 className="text-lg font-medium text-gray-900 mb-3">
//                         Inbox Messages
//                     </h3>
//                     <div className="space-y-3">
//                         <div className="border border-gray-200 rounded-md p-3 bg-white">
//                             <p className="text-sm font-medium text-gray-900">
//                                 New feature announcement
//                             </p>
//                             <p className="text-xs text-gray-500">2 hours ago</p>
//                         </div>
//                         <div className="border border-gray-200 rounded-md p-3 bg-white">
//                             <p className="text-sm font-medium text-gray-900">
//                                 Your account has been updated
//                             </p>
//                             <p className="text-xs text-gray-500">Yesterday</p>
//                         </div>
//                         <div className="border border-gray-200 rounded-md p-3 bg-white">
//                             <p className="text-sm font-medium text-gray-900">
//                                 Privacy policy update
//                             </p>
//                             <p className="text-xs text-gray-500">5 days ago</p>
//                         </div>
//                     </div>
//                 </div>
//             ),
//         },
//         {
//             label: "Favorites",
//             icon: <Heart size={18} />,
//             badge: "12",
//             content: (
//                 <div className="p-4">
//                     <h3 className="text-lg font-medium text-gray-900 mb-3">
//                         Favorite Items
//                     </h3>
//                     <p className="text-gray-700">
//                         You have 12 items in your favorites list.
//                     </p>
//                 </div>
//             ),
//         },
//         {
//             label: "Alerts",
//             icon: <AlertCircle size={18} />,
//             badge: "5",
//             content: (
//                 <div className="p-4">
//                     <h3 className="text-lg font-medium text-gray-900 mb-3">
//                         Important Alerts
//                     </h3>
//                     <p className="text-gray-700">
//                         You have 5 pending alerts that require your attention.
//                     </p>
//                 </div>
//             ),
//         },
//     ];

//     // Tabs with form content
//     const formTabs = [
//         {
//             label: "Personal Info",
//             icon: <User size={18} />,
//             content: (
//                 <div className="p-4 space-y-4">
//                     <h3 className="text-lg font-medium text-gray-900 mb-4">
//                         Personal Information
//                     </h3>
//                     <CustomTextInput
//                         label="Full Name"
//                         placeholder="Enter your full name"
//                         value={name}
//                         onChange={setName}
//                     />
//                     <CustomTextInput
//                         label="Email Address"
//                         type="email"
//                         placeholder="Enter your email address"
//                         value={email}
//                         onChange={setEmail}
//                     />
//                 </div>
//             ),
//         },
//         {
//             label: "Security",
//             icon: <Lock size={18} />,
//             content: (
//                 <div className="p-4 space-y-4">
//                     <h3 className="text-lg font-medium text-gray-900 mb-4">
//                         Security Settings
//                     </h3>
//                     <CustomTextInput
//                         label="Password"
//                         type="password"
//                         placeholder="Enter your password"
//                         value={password}
//                         onChange={setPassword}
//                     />
//                     <div className="flex items-center mt-4">
//                         <input
//                             id="remember-me"
//                             name="remember-me"
//                             type="checkbox"
//                             className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
//                         />
//                         <label
//                             htmlFor="remember-me"
//                             className="ml-2 block text-sm text-gray-700"
//                         >
//                             Enable two-factor authentication
//                         </label>
//                     </div>
//                 </div>
//             ),
//         },
//         {
//             label: "Notifications",
//             icon: <Bell size={18} />,
//             disabled: true,
//             content: (
//                 <div className="p-4">
//                     <h3 className="text-lg font-medium text-gray-900 mb-3">
//                         Notification Settings
//                     </h3>
//                     <p className="text-gray-700">
//                         This tab is disabled and cannot be selected.
//                     </p>
//                 </div>
//             ),
//         },
//     ];

//     return (
//         <div className="p-8 max-w-4xl mx-auto space-y-12">
//             <h1 className="text-2xl font-bold mb-2">Tabs Component Examples</h1>

//             {/* Basic tabs with indicator */}
//             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                 <h2 className="text-xl font-semibold mb-4">
//                     Basic Tabs with Indicator
//                 </h2>
//                 <CustomTabs
//                     tabs={basicTabs}
//                     defaultActiveTab={0}
//                     variant="indicator"
//                     onChange={setSelectedTab}
//                     indicatorColor="#FBA518"
//                 />
//             </div>

//             {/* Tabs with icons */}
//             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                 <h2 className="text-xl font-semibold mb-4">Tabs with Icons</h2>
//                 <CustomTabs tabs={iconTabs} defaultActiveTab={0} size="large" />
//             </div>

//             {/* Tabs with badges */}
//             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                 <h2 className="text-xl font-semibold mb-4">Tabs with Badges</h2>
//                 <CustomTabs tabs={badgeTabs} defaultActiveTab={0} />
//             </div>

//             {/* Pills variant */}
//             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                 <h2 className="text-xl font-semibold mb-4">Pills Variant</h2>
//                 <CustomTabs
//                     tabs={iconTabs}
//                     defaultActiveTab={0}
//                     variant="pills"
//                     onChange={setPillsTab}
//                 />
//             </div>

//             {/* Contained variant */}
//             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                 <h2 className="text-xl font-semibold mb-4">
//                     Contained Variant
//                 </h2>
//                 <CustomTabs
//                     tabs={iconTabs}
//                     defaultActiveTab={0}
//                     variant="contained"
//                     onChange={setContainedTab}
//                 />
//             </div>

//             {/* Vertical tabs with indicator */}
//             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                 <h2 className="text-xl font-semibold mb-4">
//                     Vertical Tabs with Indicator
//                 </h2>
//                 <CustomTabs
//                     tabs={iconTabs}
//                     defaultActiveTab={0}
//                     orientation="vertical"
//                     variant="indicator"
//                     onChange={setVertical1Tab}
//                 />
//             </div>

//             {/* Vertical pills */}
//             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                 <h2 className="text-xl font-semibold mb-4">Vertical Pills</h2>
//                 <CustomTabs
//                     tabs={iconTabs}
//                     defaultActiveTab={0}
//                     orientation="vertical"
//                     variant="pills"
//                 />
//             </div>

//             {/* Full width tabs with indicator */}
//             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                 <h2 className="text-xl font-semibold mb-4">
//                     Full Width Tabs with Indicator
//                 </h2>
//                 <CustomTabs
//                     tabs={basicTabs}
//                     defaultActiveTab={0}
//                     variant="indicator"
//                     fullWidth={true}
//                     onChange={setIndicatorTab}
//                 />
//             </div>

//             {/* Tabs with form content */}
//             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                 <h2 className="text-xl font-semibold mb-4">
//                     Tabs with Form Content
//                 </h2>
//                 <CustomTabs
//                     tabs={formTabs}
//                     defaultActiveTab={0}
//                     equalContentHeight={true}
//                 />
//             </div>

//             {/* Tabs with custom styling */}
//             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                 <h2 className="text-xl font-semibold mb-4">
//                     Tabs with Custom Styling
//                 </h2>
//                 <CustomTabs
//                     tabs={[
//                         {
//                             label: "Primary",
//                             icon: <Home size={18} />,
//                             content: (
//                                 <div className="p-4">
//                                     <h3 className="text-lg font-medium text-blue-900 mb-3">
//                                         Primary Tab Content
//                                     </h3>
//                                     <p className="text-blue-700">
//                                         This tab uses a custom blue theme with
//                                         customized styling.
//                                     </p>
//                                 </div>
//                             ),
//                             style: { color: "#1e40af" },
//                             activeStyle: { color: "#1e3a8a", fontWeight: 700 },
//                         },
//                         {
//                             label: "Success",
//                             icon: <Check size={18} />,
//                             content: (
//                                 <div className="p-4">
//                                     <h3 className="text-lg font-medium text-green-900 mb-3">
//                                         Success Tab Content
//                                     </h3>
//                                     <p className="text-green-700">
//                                         This tab uses a custom green theme with
//                                         customized styling.
//                                     </p>
//                                 </div>
//                             ),
//                             style: { color: "#15803d" },
//                             activeStyle: { color: "#166534", fontWeight: 700 },
//                             contentStyle: {
//                                 backgroundColor: "#f0fdf4",
//                                 borderRadius: "0.5rem",
//                             },
//                         },
//                         {
//                             label: "Warning",
//                             icon: <AlertCircle size={18} />,
//                             content: (
//                                 <div className="p-4">
//                                     <h3 className="text-lg font-medium text-amber-900 mb-3">
//                                         Warning Tab Content
//                                     </h3>
//                                     <p className="text-amber-700">
//                                         This tab uses a custom amber theme with
//                                         customized styling.
//                                     </p>
//                                 </div>
//                             ),
//                             style: { color: "#b45309" },
//                             activeStyle: { color: "#92400e", fontWeight: 700 },
//                         },
//                     ]}
//                     defaultActiveTab={0}
//                     variant="indicator"
//                     indicatorColor="#FBA518"
//                     tabStyle={{ fontSize: "0.95rem" }}
//                     activeTabStyle={{ fontSize: "1rem" }}
//                 />
//             </div>
//         </div>
//     );
// };

// TabItem component for individual tab
const TabItem = ({
    label,
    icon = null,
    badge = null,
    disabled = false,
    onClick,
    isActive,
    orientation = "horizontal",
    tabIndex,
    className = "",
    style = {},
    activeStyle = {},
}) => {
    const handleClick = () => {
        if (!disabled) {
            onClick();
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className={`custom-tab-item ${
                orientation === "horizontal" ? "horizontal" : "vertical"
            } ${isActive ? "active" : ""} ${
                disabled ? "disabled" : ""
            } ${className}`}
            role="tab"
            aria-selected={isActive}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : isActive ? 0 : tabIndex}
            style={isActive ? { ...style, ...activeStyle } : style}
        >
            {icon && <span className="custom-tab-icon">{icon}</span>}
            <span className="custom-tab-label">{label}</span>
            {badge !== null && (
                <span className="custom-tab-badge">{badge}</span>
            )}
        </button>
    );
};

// TabContent component for tab panel content
const TabContent = ({
    children,
    isActive,
    id,
    labelledBy,
    className = "",
    style = {},
}) => {
    return (
        <div
            role="tabpanel"
            id={id}
            aria-labelledby={labelledBy}
            className={`custom-tab-content ${
                isActive ? "active" : ""
            } ${className}`}
            tabIndex={0}
            style={style}
        >
            {children}
        </div>
    );
};

// Main CustomTabs component
const CustomTabs = ({
    tabs = [],
    defaultActiveTab = 0,
    orientation = "horizontal",
    size = "medium", // small, medium, large
    variant = "indicator", // indicator, contained, pills
    fullWidth = false,
    onChange = () => {},
    className = "",
    tabListClassName = "",
    contentClassName = "",
    animateContent = true,
    allowEmpty = false,
    equalContentHeight = false,
    testId = "custom-tabs",
    style = {},
    tabStyle = {},
    activeTabStyle = {},
    contentStyle = {},
    tabListStyle = {},
    indicatorColor = null, // Custom indicator color (for indicator variant)
}) => {
    const [activeTab, setActiveTab] = useState(defaultActiveTab);
    const tabsRef = useRef([]);
    const tabListRef = useRef(null);

    // CSS variable for custom indicator color
    useEffect(() => {
        if (indicatorColor && tabListRef.current) {
            tabListRef.current.style.setProperty(
                "--tab-indicator-color",
                indicatorColor
            );
        }
    }, [indicatorColor]);

    // Handle tab change
    const handleTabChange = (index) => {
        if (index !== activeTab || allowEmpty) {
            setActiveTab(index);
            onChange(index);
        }
    };

    return (
        <div
            className={`custom-tabs-wrapper ${orientation} ${variant} ${size} ${
                fullWidth ? "full-width" : ""
            } ${className}`}
            data-testid={testId}
            style={style}
        >
            <div
                className={`custom-tabs-list ${tabListClassName}`}
                role="tablist"
                aria-orientation={orientation}
                ref={tabListRef}
                style={tabListStyle}
            >
                {tabs.map((tab, index) => (
                    <TabItem
                        key={`tab-${index}`}
                        label={tab.label}
                        icon={tab.icon}
                        badge={tab.badge}
                        disabled={tab.disabled}
                        isActive={index === activeTab}
                        onClick={() => handleTabChange(index)}
                        orientation={orientation}
                        tabIndex={-1}
                        className={tab.className}
                        ref={(el) => (tabsRef.current[index] = el)}
                        style={{ ...tabStyle, ...(tab.style || {}) }}
                        activeStyle={{
                            ...activeTabStyle,
                            ...(tab.activeStyle || {}),
                        }}
                    />
                ))}
            </div>

            <div
                className={`custom-tabs-content-wrapper ${
                    animateContent ? "animate" : ""
                } ${
                    equalContentHeight ? "equal-height" : ""
                } ${contentClassName}`}
                style={contentStyle}
            >
                {tabs.map((tab, index) => (
                    <TabContent
                        key={`tab-content-${index}`}
                        isActive={index === activeTab}
                        id={`tab-panel-${index}`}
                        labelledBy={`tab-${index}`}
                        className={tab.contentClassName}
                        style={tab.contentStyle || {}}
                    >
                        {tab.content}
                    </TabContent>
                ))}
            </div>
        </div>
    );
};

export default CustomTabs;
export { TabItem, TabContent };
