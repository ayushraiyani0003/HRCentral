import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Protected route component that redirects to login if user is not authenticated
 * @returns {JSX.Element} Protected route component with outlet or redirect
 */
const ProtectedRoute = () => {
    const location = useLocation();
    const { isAuthenticated, loading } = useSelector((state) => state.auth);

    // Show loading state if authentication status is being checked
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        // Save the current location so we can redirect back after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Render child routes if authenticated
    return <Outlet />;
};

export default ProtectedRoute;
