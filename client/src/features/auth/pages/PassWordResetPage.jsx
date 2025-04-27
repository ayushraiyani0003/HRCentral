// src/pages/auth/PasswordReset.jsx
import React, { useState } from "react";
import {
    useToast,
    CustomContainer,
    CustomTextInput,
    CustomButton,
} from "../../../components";
import SunchaserLogo from "../../../assets/sunchaser.png";

const PasswordResetPage = () => {
    const [formData, setFormData] = useState({
        mobileNumber: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [error, setError] = useState(null);
    const { addToast } = useToast();

    // Handle form input changes
    const handleChange = (value, name) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear errors when user starts typing
        if (errorMessage) setErrorMessage("");
        if (error) setError(null);
    };

    const validateForm = () => {
        if (!formData.mobileNumber.trim()) {
            setErrorMessage("Mobile number is required");
            setError(true);
            addToast("Mobile number is required", "error");
            return false;
        }

        // Validate mobile number format (assuming 10 digits)
        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(formData.mobileNumber.trim())) {
            setErrorMessage("Please enter a valid 10-digit mobile number");
            setError(true);
            addToast("Invalid mobile number format", "error");
            return false;
        }

        if (!formData.newPassword) {
            setErrorMessage("New password is required");
            setError(true);
            addToast("New password is required", "error");
            return false;
        }

        if (formData.newPassword.length < 8) {
            setErrorMessage("Password must be at least 8 characters long");
            setError(true);
            addToast("Password too short", "error");
            return false;
        }

        if (!formData.confirmPassword) {
            setErrorMessage("Please confirm your password");
            setError(true);
            addToast("Confirm password is required", "error");
            return false;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match");
            setError(true);
            addToast("Passwords do not match", "error");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Form validation
        if (!validateForm()) return;

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
                        reject(new Error("Password reset failed"));
                    }
                }, 1000);
            });

            console.log("Password reset attempt with:", {
                mobileNumber: formData.mobileNumber,
                passwordLength: formData.newPassword.length,
            });

            // Handle successful password reset
            addToast(
                "Password reset successful! Redirecting to login...",
                "success"
            );

            // Simulate redirect after successful reset (you can replace with actual navigation)
            setTimeout(() => {
                console.log("Redirecting to login page...");
            }, 2000);
        } catch (err) {
            console.error("Password reset error:", err);
            setErrorMessage(err.message || "Password reset failed");
            setError(true);
            addToast(err.message || "Password reset failed", "error");
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
                className="password-reset-container w-full max-w-md space-y-8 bg-white shadow-lg transform transition-transform duration-700 ease-in-out hover:-translate-y-2"
            >
                <div className="text-center">
                    <img
                        src={SunchaserLogo}
                        alt="Logo"
                        className="h-15 mx-auto my-4 "
                    />
                    <h1 className="text-3xl font-bold text-gray-800">
                        Reset Password
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Enter your mobile number and new password
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <CustomTextInput
                            label="Mobile Number"
                            name="mobileNumber"
                            type="tel"
                            value={formData.mobileNumber}
                            onChange={(value) =>
                                handleChange(value, "mobileNumber")
                            }
                            required
                            placeholder="Enter your 10-digit mobile number"
                            className="password-reset-input"
                            error={
                                error && !formData.mobileNumber.trim()
                                    ? "Mobile number is required"
                                    : ""
                            }
                        />

                        <CustomTextInput
                            label="New Password"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={(value) =>
                                handleChange(value, "newPassword")
                            }
                            required
                            placeholder="Enter your new password"
                            className="password-reset-input"
                            error={
                                error && !formData.newPassword
                                    ? "New password is required"
                                    : ""
                            }
                        />

                        <CustomTextInput
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(value) =>
                                handleChange(value, "confirmPassword")
                            }
                            required
                            placeholder="Confirm your new password"
                            className="password-reset-input"
                            error={
                                error && !formData.confirmPassword
                                    ? "Please confirm your password"
                                    : error &&
                                      formData.newPassword !==
                                          formData.confirmPassword
                                    ? "Passwords do not match"
                                    : ""
                            }
                        />
                    </div>

                    {errorMessage && (
                        <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md">
                            {errorMessage}
                        </div>
                    )}

                    <CustomButton
                        type="submit"
                        className="reset-password-btn w-full mb-4"
                        disabled={loading}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </CustomButton>

                    <div className="text-center">
                        <a
                            href="/login"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Back to Login
                        </a>
                    </div>
                </form>
            </CustomContainer>
        </div>
    );
};

export default PasswordResetPage;
