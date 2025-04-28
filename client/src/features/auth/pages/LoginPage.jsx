// src/pages/auth/Login.jsx
import React, { useState } from "react";
import {
    useToast,
    CustomContainer,
    CustomTextInput,
    CustomButton,
} from "../../../components";
import SunchaserLogo from "../../../assets/sunchaser.png";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [error, setError] = useState(null);
    const { addToast } = useToast();

    // Modified handleChange to match how CustomTextInput works
    // The CustomTextInput component passes the value directly, not an event object
    const handleChange = (value, name) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear errors when user starts typing
        if (errorMessage) setErrorMessage("");
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Form validation
        if (!formData.username.trim()) {
            setErrorMessage("Username is required");
            setError(true);
            addToast("Username is required", "error");
            return;
        }

        if (!formData.password) {
            setErrorMessage("Password is required");
            setError(true);
            addToast("Password is required", "error");
            return;
        }

        setLoading(true);
        setErrorMessage("");
        setError(null);

        try {
            // Simulate API call
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simulate random success/failure for demonstration
                    if (Math.random() > 0.3) {
                        resolve();
                    } else {
                        reject(new Error("Authentication failed"));
                    }
                }, 1000);
            });

            // console.log("Login attempt with:", formData);
            // Handle successful login
            addToast("Login successful! Redirecting...", "success");

            // Simulate redirect after successful login (you can replace with actual navigation)
            setTimeout(() => {
                // console.log("Redirecting to dashboard...");
            }, 2000);
        } catch (err) {
            console.error("Login error:", err);
            setErrorMessage(err.message || "Invalid username or password");
            setError(true);
            addToast(err.message || "Invalid username or password", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
            <CustomContainer
                width="w-3xl"
                rounded="large"
                padding="large"
                className="login-container w-full max-w-md space-y-8 bg-white shadow-lg transform transition-transform duration-700 ease-in-out hover:-translate-y-2"
            >
                <div className="text-center">
                    <img
                        src={SunchaserLogo}
                        alt="Logo"
                        className="h-15 mx-auto my-4 "
                    />
                    <h1 className="text-3xl font-bold text-gray-800">
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Sign in to your account
                    </p>
                </div>

                {errorMessage && (
                    <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <CustomTextInput
                            label="Username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={(value) =>
                                handleChange(value, "username")
                            }
                            required
                            placeholder="Enter your username"
                            className="login-input"
                            error={
                                error && !formData.username.trim()
                                    ? "Username is required"
                                    : ""
                            }
                        />

                        <CustomTextInput
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={(value) =>
                                handleChange(value, "password")
                            }
                            required
                            placeholder="Enter your password"
                            className="login-input"
                            error={
                                error && !formData.password
                                    ? "Password is required"
                                    : ""
                            }
                        />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="block ml-2 text-sm text-gray-900"
                                >
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a
                                    href="#"
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                    </div>

                    <CustomButton
                        type="submit"
                        className="login-btn w-full mb-4"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </CustomButton>
                </form>
            </CustomContainer>
        </div>
    );
};

export default LoginPage;
