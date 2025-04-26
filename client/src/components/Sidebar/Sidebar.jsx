// Sidebar.jsx
import React, { useState, createElement } from "react";
import { Link } from "react-router-dom";
import SunchaserLogo from "../../assets/sunchaser.png";
import { HomeIcon, DashboardIcon } from "../../utils/SvgIcon";

const Sidebar = ({ isOpen }) => {
    // Example of dynamic sidebar items
    const [menuItems] = useState([
        { id: 1, title: "Dashboard", icon: HomeIcon, path: "/" },
        { id: 2, title: "Analytics", icon: DashboardIcon, path: "/analytics" },
        { id: 3, title: "Projects", icon: DashboardIcon, path: "/projects" },
        { id: 4, title: "Calendar", icon: DashboardIcon, path: "/calendar" },
        { id: 5, title: "Messages", icon: DashboardIcon, path: "/messages" },
        { id: 6, title: "Settings", icon: DashboardIcon, path: "/settings" },
    ]);

    return (
        <aside
            className={`bg-gray-800 text-white fixed h-full overflow-y-auto w-64 transition-transform duration-300 ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            {/* Logo */}
            <div className="flex justify-center items-center py-5">
                {/* You can add your logo here */}
            </div>

            {/* Navigation */}
            <nav className="mt-8">
                <ul className="space-y-2 px-2">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <Link
                                to={item.path}
                                className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <span className="text-xl">
                                    {/* Render the SVG icon as a component */}
                                    {item.icon &&
                                        createElement(item.icon, {
                                            width: 20,
                                            height: 20,
                                        })}
                                </span>
                                <span className="ml-3 transition-opacity duration-200">
                                    {item.title}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
