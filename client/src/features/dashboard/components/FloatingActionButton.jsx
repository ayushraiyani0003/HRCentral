import React, { useState } from "react";
import { Plus, Home, Search, Settings, User, Heart, Share } from "lucide-react";

const FloatingActionButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Option buttons data
    const options = [
        { icon: Home, name: "Home", color: "bg-blue-500" },
        { icon: Search, name: "Search", color: "bg-green-500" },
        { icon: User, name: "Profile", color: "bg-purple-500" },
        { icon: Heart, name: "Favorites", color: "bg-red-500" },
        { icon: Share, name: "Share", color: "bg-orange-500" },
        { icon: Settings, name: "Settings", color: "bg-gray-500" },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Options Menu */}
            <div
                className={`absolute bottom-16 right-0 transition-all duration-300 ${
                    isOpen
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95 pointer-events-none"
                }`}
            >
                <div className="flex flex-col-reverse gap-3">
                    {options.map((option, index) => {
                        const Icon = option.icon;
                        return (
                            <div
                                key={option.name}
                                className="group relative"
                                style={{
                                    transitionDelay: isOpen
                                        ? `${index * 50}ms`
                                        : `${(options.length - index) * 30}ms`,
                                }}
                            >
                                {/* Tooltip */}
                                <div className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-75 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                    {option.name}
                                </div>

                                {/* Option Button */}
                                <button
                                    className={`w-12 h-12 rounded-full ${option.color} text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center`}
                                >
                                    <Icon size={20} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Floating Button */}
            <button
                onClick={toggleMenu}
                className={`w-12 h-12 rounded-[19px] bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center ${
                    isOpen ? "rotate-45" : "rotate-0"
                }`}
            >
                <Plus size={24} />
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-20 -z-10"
                    onClick={toggleMenu}
                />
            )}
        </div>
    );
};

export default FloatingActionButton;
