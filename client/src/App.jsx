// App.jsx
import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import "./App.css";
import {LoginPage, PassWordResetPage, SlipSendPage, MainLayout, FlexibleDashboardPage, EmployeePage, CheckListPage, RolesPermissions, ErrorPage, SlipGeneratePage, HomeIcon, DashboardIcon, ToastProvider} from "./index"

const Analytics = () => <div className="p-4">Analytics Content</div>;
const Projects = () => <div className="p-4">Projects Content</div>;
const Settings = () => <div className="p-4">Settings Content</div>;

// Create a wrapper component to access useLocation inside Router
const ProtectedRoutes = ({ isAuthenticated, menuItems }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    return isAuthenticated ? (
        <MainLayout menuItems={menuItems} selected={currentPath}>
            <Routes>
                <Route path="/" element={<FlexibleDashboardPage />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route
                    path="/analytics/reports"
                    element={<div className="p-4">Analytics Reports</div>}
                />
                <Route
                    path="/analytics/realtime"
                    element={<div className="p-4">Real-time Analytics</div>}
                />
                <Route path="/projects" element={<Projects />} />
                <Route
                    path="/calendar"
                    element={<div className="p-4">Calendar Content</div>}
                />
                <Route
                    path="/messages"
                    element={<div className="p-4">Messages Content</div>}
                />
                <Route path="/settings" element={<Settings />} />
                <Route path="/slip-send" element={<SlipSendPage />} />
                <Route path="/roles" element={<RolesPermissions />} />
                <Route path="/slip-generate" element={<SlipGeneratePage />} />
                <Route path="/employees" element={<EmployeePage />} />
                <Route
                    path="/employees/checklist"
                    element={<CheckListPage />}
                />
                {/* Catch-all route for unmatched paths */}
                <Route path="*" element={<ErrorPage errorCode={404} />} />
            </Routes>
        </MainLayout>
    ) : (
        <Navigate to="/login" replace />
    );
};

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const [menuItems] = useState([
        { id: "1", title: "Dashboard", icon: HomeIcon, path: "/" },
        {
            id: "2",
            title: "Analytics",
            icon: DashboardIcon,
            subMenu: [
                {
                    id: "2_1",
                    title: "Reports",
                    icon: DashboardIcon,
                    path: "/analytics/reports",
                },
                {
                    id: "2_2",
                    title: "Real-time",
                    icon: DashboardIcon,
                    path: "/analytics/realtime",
                },
            ],
        },
        { id: "3", title: "Projects", icon: DashboardIcon, path: "/projects" },
        { id: "4", title: "Calendar", icon: DashboardIcon, path: "/calendar" },
        { id: "5", title: "Messages", icon: DashboardIcon, path: "/messages" },
        { id: "6", title: "Settings", icon: DashboardIcon, path: "/settings" },
        {
            id: "7",
            title: "Slip Send",
            icon: DashboardIcon,
            path: "/slip-send",
        },
        {
            id: "8",
            title: "Roles & Permissions",
            icon: DashboardIcon,
            path: "/roles",
        },
        {
            id: "9",
            title: "Slip generate",
            icon: DashboardIcon,
            path: "/slip-generate",
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
        { id: "11", title: "Logout", icon: DashboardIcon, path: "/logout" },
    ]);

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
