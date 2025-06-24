// App.jsx
import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import "./App.css";
import {
    LoginPage,
    PassWordResetPage,
    SlipSendPage,
    MainLayout,
    FlexibleDashboardPage,
    EmployeePage,
    CheckListPage,
    RolesPermissions,
    ErrorPage,
    SlipGeneratePage,
    HomeIcon,
    DashboardIcon,
    ToastProvider,
    LeavesPage,
    EmailPage,
    CompanyStructurePage,
    HiringRequestsPage,
    RecruitmentSetupPage,
    ApplicantTrackingPage,
    SetupPage,
} from "./index";

// Route components mapping
const routeComponents = {
    "/": FlexibleDashboardPage,
    "/company-structure": CompanyStructurePage,
    "/hiring-requests": HiringRequestsPage,
    "/applicant-tracking": ApplicantTrackingPage,
    "/recruitment-setup": RecruitmentSetupPage,
    "/messages": () => <div className="p-4">Messages Content</div>,
    "/leaves": LeavesPage,
    "/settings": () => <div className="p-4">Settings Content</div>,
    "/slip-send": SlipSendPage,
    "/slip-generate": SlipGeneratePage,
    "/roles": RolesPermissions,
    "/employees": EmployeePage,
    "/employees/checklist": CheckListPage,
    "/missing": () => <div className="p-4">Settings Content</div>,
    "/email": EmailPage,
    "/setup": SetupPage,
};

// Helper function to extract all valid paths from menu items
const getAllValidPaths = (menuItems) => {
    const paths = new Set();

    const extractPaths = (items) => {
        items.forEach((item) => {
            if (item.path && item.path !== "/logout") {
                paths.add(item.path);
            }
            if (item.subMenu) {
                extractPaths(item.subMenu);
            }
        });
    };

    extractPaths(menuItems);
    return Array.from(paths);
};

// Create a wrapper component to access useLocation inside Router
const ProtectedRoutes = ({ isAuthenticated, menuItems }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Get all valid paths from menu items
    const validPaths = getAllValidPaths(menuItems);

    // Check if current path is valid (allow root path by default)
    const isValidPath = validPaths.includes(currentPath) || currentPath === "/";

    // Redirect invalid paths to error page
    if (!isValidPath) {
        return (
            <Navigate
                to="/error"
                replace
                state={{
                    errorCode: 403,
                    message: "Access to this page is not authorized",
                    from: currentPath,
                }}
            />
        );
    }

    return (
        <MainLayout menuItems={menuItems} selected={currentPath}>
            <Routes>
                {/* Generate routes dynamically from menu items */}
                {validPaths.map((path) => {
                    const Component = routeComponents[path];
                    return Component ? (
                        <Route key={path} path={path} element={<Component />} />
                    ) : null;
                })}

                {/* Catch-all route for unmatched paths */}
                <Route path="*" element={<ErrorPage errorCode={404} />} />
            </Routes>
        </MainLayout>
    );
};

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [menuItems, setMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    // Simulate fetching menu items from server
    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                // Replace this with your actual API call
                // const response = await fetch('/api/menu-items');
                // const serverMenuItems = await response.json();

                // For now, using the static menu items
                const serverMenuItems = [
                    { id: "1", title: "Dashboard", icon: HomeIcon, path: "/" },
                    {
                        id: "2",
                        title: "Admin",
                        icon: DashboardIcon,
                        subMenu: [
                            {
                                id: "2_1",
                                title: "Company Structure",
                                icon: DashboardIcon,
                                path: "/company-structure",
                            },
                            {
                                id: "2_2",
                                title: "setup",
                                icon: DashboardIcon,
                                path: "/setup",
                            },
                        ],
                    },
                    {
                        id: "3",
                        title: "Recruitment",
                        icon: DashboardIcon,
                        subMenu: [
                            {
                                id: "3_1",
                                title: "Manpower Requisition",
                                icon: DashboardIcon,
                                path: "/hiring-requests",
                            },
                            {
                                id: "3_2",
                                title: "Applicant Tracking",
                                icon: DashboardIcon,
                                path: "/applicant-tracking",
                            },
                            {
                                id: "3_4",
                                title: "Recruitment Setup",
                                icon: DashboardIcon,
                                path: "/recruitment-setup",
                            },
                        ],
                    },
                    {
                        id: "4",
                        title: "Calendar",
                        icon: DashboardIcon,
                        path: "/calendar",
                    },
                    {
                        id: "5",
                        title: "Manage",
                        icon: DashboardIcon,
                        subMenu: [
                            {
                                id: "5_1",
                                title: "Leaves",
                                icon: DashboardIcon,
                                path: "/leaves",
                            },
                        ],
                    },
                    {
                        id: "6",
                        title: "Settings",
                        icon: DashboardIcon,
                        path: "/settings",
                    },
                    {
                        id: "7",
                        title: "Pay Roll",
                        icon: DashboardIcon,
                        subMenu: [
                            {
                                id: "7_1",
                                title: "Slip Send",
                                icon: DashboardIcon,
                                path: "/slip-send",
                            },
                            {
                                id: "7_2",
                                title: "Slip Generate",
                                icon: DashboardIcon,
                                path: "/slip-generate",
                            },
                        ],
                    },
                    {
                        id: "8",
                        title: "Roles & Permissions",
                        icon: DashboardIcon,
                        path: "/roles",
                    },
                    {
                        id: "10",
                        title: "Employees",
                        icon: DashboardIcon,
                        subMenu: [
                            {
                                id: "10_1",
                                title: "Employees",
                                icon: DashboardIcon,
                                path: "/employees",
                            },
                            {
                                id: "10_2",
                                title: "Check-List",
                                icon: DashboardIcon,
                                path: "/employees/checklist",
                            },
                        ],
                    },
                    {
                        id: "9",
                        title: "Email",
                        icon: DashboardIcon,
                        path: "/email",
                    },
                    {
                        id: "11",
                        title: "Logout",
                        icon: DashboardIcon,
                        path: "/missing",
                    },
                    // { id: "12", title: "missing", icon: DashboardIcon, path: "/missing" },
                ];

                setMenuItems(serverMenuItems);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch menu items:", error);
                setIsLoading(false);
                // Handle error - maybe redirect to error page or show default menu
            }
        };

        if (isAuthenticated) {
            fetchMenuItems();
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    // Show loading while fetching menu items
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <>
            <ToastProvider>
                <Router>
                    <Routes>
                        {/* Login route - accessible when not authenticated */}
                        <Route
                            path="/login"
                            element={
                                !isAuthenticated ? (
                                    <LoginPage
                                        onLoginSuccess={handleLoginSuccess}
                                    />
                                ) : (
                                    <Navigate to="/" replace />
                                )
                            }
                        />

                        {/* Password reset route */}
                        <Route
                            path="/password-reset"
                            element={
                                !isAuthenticated ? (
                                    <PassWordResetPage />
                                ) : (
                                    <Navigate to="/" replace />
                                )
                            }
                        />

                        {/* Error route - accessible directly */}
                        <Route path="/error" element={<ErrorPage />} />

                        {/* Protected routes - wrapped in MainLayout */}
                        <Route
                            path="/*"
                            element={
                                <ProtectedRoutes
                                    isAuthenticated={isAuthenticated}
                                    menuItems={menuItems}
                                />
                            }
                        />
                    </Routes>
                </Router>
            </ToastProvider>
        </>
    );
}

export default App;
