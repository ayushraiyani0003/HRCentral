import React, { createElement, useState } from "react";
import { Link } from "react-router-dom";
import SunchaserLogo from "../../assets/sunchaser.png";

const Sidebar = ({ isOpen, onCloseSidebar, menuItems, selected }) => {
    const [expandedMenus, setExpandedMenus] = useState(new Set());

    // Handle main menu item click
    const handleMenuClick = (item) => {
        if (item.subMenu && item.subMenu.length > 0) {
            // Toggle submenu expansion
            const newExpandedMenus = new Set(expandedMenus);
            if (expandedMenus.has(item.id)) {
                newExpandedMenus.delete(item.id);
            } else {
                newExpandedMenus.add(item.id);
            }
            setExpandedMenus(newExpandedMenus);
        } else if (item.path) {
            // Close sidebar on menu item click
            if (onCloseSidebar) {
                onCloseSidebar();
            }
        }
    };

    // Handle submenu item click
    const handleSubMenuClick = () => {
        if (onCloseSidebar) {
            onCloseSidebar();
        }
    };

    // Check if item is selected
    const isSelected = (item) => {
        return selected === item.id || selected === item.path;
    };
    const renderMenuItem = (item, isSubItem = false) => {
        const hasSubMenu = item.subMenu && item.subMenu.length > 0;
        const isExpanded = expandedMenus.has(item.id);
        const itemSelected = isSelected(item);

        return (
            <div key={item.id} className="w-full">
                {hasSubMenu ? (
                    // Main menu item with submenu
                    <button
                        onClick={() => handleMenuClick(item)}
                        className={`
                            w-full flex items-center justify-between px-2 py-1.5 
                            text-gray-300 hover:text-white 
                            transition-colors duration-200 rounded text-left
                            ${isSubItem ? "pl-6 py-1 text-sm" : ""}
                            ${itemSelected ? "bg-blue-600 text-white" : ""}
                        `}
                    >
                        <div className="flex items-center space-x-2">
                            {item.icon && (
                                <div className="flex-shrink-0">
                                    {createElement(item.icon, {
                                        width: 18,
                                        height: 18,
                                        className:
                                            "transition-colors duration-200",
                                    })}
                                </div>
                            )}
                            <span className="font-medium truncate">
                                {item.title}
                            </span>
                        </div>
                        <svg
                            className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
                                isExpanded ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="m19 9-7 7-7-7"
                            />
                        </svg>
                    </button>
                ) : (
                    // Regular menu item or submenu item
                    <Link
                        to={item.path || "#"}
                        onClick={
                            isSubItem
                                ? handleSubMenuClick
                                : () => handleMenuClick(item)
                        }
                        className={`
                            flex items-center space-x-2 px-2 py-1.5 
                            text-gray-300 hover:text-white 
                            transition-colors duration-200 rounded
                            ${isSubItem ? "pl-6 py-1 text-sm" : ""}
                        `}
                        style={{
                            color: itemSelected
                                ? "rgba(253, 224, 71, 1)"
                                : undefined, // amber-300
                            backgroundColor: itemSelected
                                ? "rgba(253, 224, 71, 0.1)"
                                : undefined, // amber-300 @ 10% opacity
                        }}
                    >
                        {item.icon && (
                            <div className="flex-shrink-0">
                                {createElement(item.icon, {
                                    width: isSubItem ? 16 : 18,
                                    height: isSubItem ? 16 : 18,
                                    className: "transition-colors duration-200",
                                })}
                            </div>
                        )}
                        <span className="font-medium truncate">
                            {item.title}
                        </span>
                    </Link>
                )}

                {/* Submenu items */}
                {hasSubMenu && (
                    <div
                        className={`
                            overflow-hidden transition-all duration-300 ease-in-out
                            ${
                                isExpanded
                                    ? "max-h-96 opacity-100"
                                    : "max-h-0 opacity-0"
                            }
                        `}
                    >
                        <div className="mt-0.5 space-y-0.5 pb-1">
                            {item.subMenu.map((subItem) =>
                                renderMenuItem(subItem, true)
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Don't render anything if sidebar is closed
    if (!isOpen) return null;

    return (
        <>
            {/* Sidebar */}
            <div
                className={`
                    fixed inset-y-0 left-0 z-50 w-64 h-full bg-gray-800 
                    transform transition-transform duration-300 ease-in-out
                    animate-in slide-in-from-left-0
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Header with logo and close button */}
                    <div className="flex items-center justify-between h-14 px-3 bg-gray-900 border-b border-gray-700">
                        <div className="flex items-center">
                            <img
                                src={SunchaserLogo}
                                alt="Sunchaser"
                                className="h-7 w-auto"
                            />
                        </div>
                        {/* Close button */}
                        <button
                            onClick={onCloseSidebar}
                            className="p-1.5 text-gray-400 hover:text-white rounded transition-colors duration-200"
                            aria-label="Close sidebar"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pt-4">
                        {menuItems && menuItems.length > 0 ? (
                            menuItems.map((item) => renderMenuItem(item))
                        ) : (
                            <div className="text-gray-400 text-center py-4">
                                No menu items available
                            </div>
                        )}
                    </nav>

                    {/* Footer (Optional) */}
                    <div className="p-2 bg-gray-900 border-t border-gray-700">
                        <div className="text-xs text-gray-400 text-center">
                            © 2024 Sunchaser
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
