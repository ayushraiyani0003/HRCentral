// Header.jsx
import { useState } from "react";

import SunchaserLogo from "../../assets/sunchaser.png";
import { HamburgerIcon, CloseIcon } from "../../utils/SvgIcon";

const Header = ({ toggleSidebar, closeSidebar, isSidebarOpen }) => {
    const [userData] = useState({
        name: "John Doe",
        role: "Administrator",
        avatar: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    });

    return (
        <header className="bg-white shadow-md h-16 z-50 fixed top-0 right-0 left-0 flex items-center justify-between px-12">
            {/* Left side - Hamburger and Logo */}
            <div className="flex items-center">
                {/* Use conditional rendering based on sidebar state */}
                {isSidebarOpen ? (
                    <button
                        data-sidebar-toggle
                        onClick={closeSidebar}
                        className="text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                        <span className="material-icons-outlined text-5xl">
                            <CloseIcon width={26} />
                        </span>
                    </button>
                ) : (
                    <button
                        data-sidebar-toggle
                        onClick={toggleSidebar}
                        className="text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                        <span className="material-icons-outlined text-5xl">
                            <HamburgerIcon width={26} />
                        </span>
                    </button>
                )}
                <img
                    src={SunchaserLogo}
                    alt="Logo"
                    className="h-8 ml-4 hidden md:block"
                />
            </div>

            {/* Right side - User info */}
            <div className="flex items-center">
                <div className="text-right mr-4 hidden sm:block">
                    <h3 className="font-medium text-gray-800">
                        {userData.name}
                    </h3>
                    <p className="text-sm text-gray-500">{userData.role}</p>
                </div>
                <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img
                        src={userData.avatar}
                        alt="Profile"
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
