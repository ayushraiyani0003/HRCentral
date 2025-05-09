import { useState, useEffect, useRef } from "react";
import { Header, Sidebar } from "../components";

const MainLayout = ({ children, menuItems }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);
    const mainContentRef = useRef(null);
    
    // Toggle sidebar function
    const toggleSidebar = (e) => {
        // Prevent event from bubbling up to document if event exists
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setSidebarOpen((prevState) => !prevState);
    };
    
    // Add closeSidebar function
    const closeSidebar = () => {
        setSidebarOpen(false);
    };
    
    // Handle clicks outside of sidebar
    useEffect(() => {
        // Only add listener if sidebar is open
        if (!sidebarOpen) return;
        
        const handleClickOutside = (event) => {
            // Store references to elements
            const sidebarElement = sidebarRef.current;
            
            // Find all elements with the data-sidebar-toggle attribute
            const toggleButtons = document.querySelectorAll(
                "[data-sidebar-toggle]"
            );
            
            // Check if click was on any toggle button
            let clickedOnToggle = false;
            toggleButtons.forEach((button) => {
                if (button.contains(event.target)) {
                    clickedOnToggle = true;
                }
            });
            
            // If clicked outside sidebar and not on any toggle button, close sidebar
            if (
                sidebarElement &&
                !sidebarElement.contains(event.target) &&
                !clickedOnToggle
            ) {
                setSidebarOpen(false);
            }
        };
        
        // Add event listener
        document.addEventListener("mousedown", handleClickOutside);
        
        // Clean up event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [sidebarOpen]); // This will run when sidebarOpen changes
    
    return (
        <div className="flex h-auto bg-gray-100 relative">
            {/* Header Component */}
            <Header
                toggleSidebar={toggleSidebar}
                closeSidebar={closeSidebar}
                isSidebarOpen={sidebarOpen}
            />
            
            {/* Sidebar with ref for detecting outside clicks */}
            <div ref={sidebarRef} className="z-20">
                <Sidebar isOpen={sidebarOpen} onCloseSidebar={closeSidebar} menuItems={menuItems} />
            </div>
            
            {/* Main Content Area */}
            <div
                className={`flex-1 transition-all duration-300 ${
                    sidebarOpen ? "filter blur-sm" : ""
                }`}
                ref={mainContentRef}
            >
                {/* Main Content with proper spacing from header */}
                <main className="p-6 mt-16 h-auto overflow-y-auto">
                    {children}
                </main>
            </div>
            
            {/* Overlay when sidebar is open */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-opacity-30 z-10"
                    onClick={closeSidebar}
                ></div>
            )}
        </div>
    );
};

export default MainLayout;