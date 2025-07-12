import React from "react";
import {
    CustomContainer,
    CustomTextInput,
    RichTextEditor,
    CustomModal,
} from "../../../components";

function EmailSidebar({
    onMenuSelect = () => {},
    activeMenu = "inbox",
    menuItems,
    bottomMenuItems,
    setShowComposeModal = () => {},
    searchQuery = "",
    setSearchQuery = () => {},
}) {
    const handleMenuClick = (menuId) => {
        onMenuSelect(menuId);
    };

    return (
        <>
            <CustomContainer
                className="h-full flex flex-col"
                backgroundColor="light"
                padding="small"
                border={true}
                rounded="none"
                width="custom"
                customWidth="280px"
                minHeight="100vh"
            >
                {/* Header Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">
                        📧 Email
                    </h2>

                    {/* Search Bar */}
                    <CustomTextInput
                        placeholder="Search emails..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                        icon="🔍"
                        className="mb-4"
                    />

                    {/* Compose Button */}
                    <button
                        onClick={() => setShowComposeModal(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        ✍️ Compose
                    </button>
                </div>

                {/* Main Navigation */}
                <nav className="flex-1">
                    <ul className="space-y-1">
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => handleMenuClick(item.id)}
                                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-between group ${
                                        activeMenu === item.id
                                            ? "bg-blue-100 text-blue-700 font-medium"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">
                                            {item.icon}
                                        </span>
                                        <span className="text-sm font-medium">
                                            {item.label}
                                        </span>
                                    </div>
                                    {item.count && (
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${
                                                activeMenu === item.id
                                                    ? "bg-blue-200 text-blue-800"
                                                    : "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
                                            }`}
                                        >
                                            {item.count}
                                        </span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Bottom Navigation */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                    <ul className="space-y-1">
                        {bottomMenuItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => handleMenuClick(item.id)}
                                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors duration-200 flex items-center gap-3 ${
                                        activeMenu === item.id
                                            ? "bg-blue-100 text-blue-700 font-medium"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span className="text-sm font-medium">
                                        {item.label}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </CustomContainer>
        </>
    );
}

export default EmailSidebar;
