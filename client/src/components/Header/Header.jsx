// Header.jsx
import { useState, useEffect, useRef } from "react";

import SunchaserLogo from "../../assets/sunchaser.png";
import {
    HamburgerIcon,
    CloseIcon,
    ChevronDownIcon,
    ProfileIcon,
    SettingIcon,
    SignOutIcon,
    NotificationIcon,
} from "../../utils/SvgIcon";
import "./headerStyles.css";

const Header = ({
    toggleSidebar,
    closeSidebar,
    isSidebarOpen,
    notificationCount = 0,
}) => {
    const [userData] = useState({
        name: "John Doe",
        role: "Administrator",
        avatar: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    });

    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
    };

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close the dropdown if clicked outside dropdown and outside button
            if (
                profileDropdownOpen &&
                dropdownRef.current &&
                buttonRef.current &&
                !dropdownRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setProfileDropdownOpen(false);
            }
        };

        // Add event listener when dropdown is open
        if (profileDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        // Cleanup the event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [profileDropdownOpen]);

    return (
        <header className="bg-white shadow-md h-16 z-50 fixed top-0 right-0 left-0 flex items-center justify-between px-4 md:px-12">
            {/* Left side - Hamburger and Logo */}
            <div className="flex items-center">
                <button
                    data-sidebar-toggle
                    onClick={isSidebarOpen ? closeSidebar : toggleSidebar}
                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    aria-label={
                        isSidebarOpen ? "Close sidebar" : "Open sidebar"
                    }
                >
                    <span className="flex items-center justify-center">
                        {isSidebarOpen ? (
                            <CloseIcon width={24} className="text-gray-700" />
                        ) : (
                            <HamburgerIcon
                                width={24}
                                className="text-gray-700"
                            />
                        )}
                    </span>
                </button>
                <div className="flex items-center ml-3 md:ml-4">
                    <img
                        src={SunchaserLogo}
                        alt="Sunchaser"
                        className="h-8 hidden md:block transition-transform hover:scale-105 duration-300"
                    />
                </div>
            </div>

            {/* Right side - User info */}
            <div className="relative flex items-center">
                {/* Notification icon with small badge */}
                <div className="relative mr-4 cursor-pointer">
                    {/* Bell icon - you can replace this with your own NotificationIcon component */}
                    <div
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title={notificationCount}
                    >
                        <NotificationIcon />

                        {/* Notification badge - red dot indicating unread notifications */}
                        {/* You can make this conditional based on whether there are notifications */}
                        <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                    </div>
                </div>

                {/* Small vertical divider line */}
                <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>

                {/* Profile dropdown button */}
                <button
                    ref={buttonRef}
                    onClick={toggleProfileDropdown}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 border border-transparent"
                    aria-expanded={profileDropdownOpen}
                    aria-haspopup="true"
                >
                    {/* User avatar with ring effect */}
                    <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-indigo-100 shadow-sm user-avatar">
                        <img
                            src={userData.avatar}
                            alt="Profile"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* User name and role - hidden on small screens */}
                    <div className="text-right mr-1 hidden sm:block">
                        <h3 className="text-sm font-semibold text-gray-700">
                            {userData.name}
                        </h3>
                        <p className="text-xs text-gray-500">{userData.role}</p>
                    </div>

                    {/* Dropdown chevron with rotation animation */}
                    <div
                        className={`transition-transform duration-200 ${
                            profileDropdownOpen ? "rotate-180" : ""
                        }`}
                    >
                        <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                    </div>
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                    <div
                        ref={dropdownRef}
                        className={`profile-dropdown absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 top-16 transition-all duration-300 ease-out ${
                            profileDropdownOpen
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 -translate-y-2 pointer-events-none"
                        }`}
                    >
                        <ul>
                            {/* Profile menu item */}
                            <li>
                                <a
                                    href="/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <ProfileIcon className="w-4 h-4" />
                                        Profile
                                    </span>
                                </a>
                            </li>

                            {/* Settings menu item */}
                            <li>
                                <a
                                    href="/settings"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <SettingIcon className="w-4 h-4" />
                                        Settings
                                    </span>
                                </a>
                            </li>

                            {/* Sign out menu item with top border */}
                            <li className="border-t border-gray-100 mt-1 pt-1">
                                <a
                                    href="/logout"
                                    className="block px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <SignOutIcon className="w-4 h-4" />
                                        Sign out
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
