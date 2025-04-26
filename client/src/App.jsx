// App.jsx
import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import "./App.css";
import { LoginPage } from "./features";
import { ToastProvider } from "./components";
import MainLayout from "./layouts/MainLayout";

// Example page components - replace these with your actual page components
const Dashboard = () => {
    // Create an array with 85 elements (indices 0-84)
    const contentItems = Array.from({ length: 85 }, (_, index) => (
        <div key={index} className="p-2 mb-2 bg-gray-100 rounded shadow">
            Dashboard Content {index + 1}
        </div>
    ));

    return <div className="p-4 w-auto">{contentItems}</div>;
};
const Analytics = () => <div className="p-4">Analytics Content</div>;
const Projects = () => <div className="p-4">Projects Content</div>;
const Settings = () => <div className="p-4">Settings Content</div>;

function App() {
    // State to track authentication
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    // Function to handle successful login
    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

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

                        {/* Protected routes - wrapped in MainLayout */}
                        <Route
                            path="/*"
                            element={
                                isAuthenticated ? (
                                    <MainLayout>
                                        <Routes>
                                            <Route
                                                path="/"
                                                element={<Dashboard />}
                                            />
                                            <Route
                                                path="/analytics"
                                                element={<Analytics />}
                                            />
                                            <Route
                                                path="/projects"
                                                element={<Projects />}
                                            />
                                            <Route
                                                path="/settings"
                                                element={<Settings />}
                                            />
                                        </Routes>
                                    </MainLayout>
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            }
                        />
                    </Routes>
                </Router>
            </ToastProvider>
        </>
    );
}

export default App;
