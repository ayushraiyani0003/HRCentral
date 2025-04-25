import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./MaintenancePage.css";
import maintenanceImage from "../../assets/fetchpik.com-iconscout-d59RgSKncT.png";

const MaintenancePage = ({
    title = "Site Maintenance",
    message = "We're currently performing scheduled maintenance. Please check back soon.",
    eta = null,
    logo = null,
    logoAlt = "Company Logo",
    contactEmail = null,
    contactPhone = null,
    socialLinks = [],
    backgroundImage = null,
    backgroundPattern = "grid",
    autoRefreshInterval = 60, // in seconds, 0 to disable
    primaryColor = "#6366f1", // Match the custom input primary color
    animated = true,
}) => {
    const [countdown, setCountdown] = useState(autoRefreshInterval);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Format ETA time
    const formatEta = (etaDate) => {
        if (!etaDate) return null;

        const date = new Date(etaDate);
        if (isNaN(date.getTime())) return null;

        return new Intl.DateTimeFormat("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            timeZoneName: "short",
        }).format(date);
    };

    // Auto refresh logic
    useEffect(() => {
        if (!autoRefreshInterval) return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    setIsRefreshing(true);
                    window.location.reload();
                    return autoRefreshInterval;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [autoRefreshInterval]);

    // Dynamically set the background style
    const getBackgroundStyle = () => {
        if (backgroundImage) {
            return {
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            };
        }

        // Default pattern is applied via CSS classes
        return {};
    };

    // Image for maintenance animation
    const maintenanceImageUrl =
        maintenanceImage || "https://placehold.co/400x300"; // Default placeholder if no image is provided

    // Create dot animation for loading
    const LoadingDots = () => (
        <div className="loading-dots">
            <div
                className="dot"
                style={{ backgroundColor: primaryColor }}
            ></div>
            <div
                className="dot"
                style={{ backgroundColor: primaryColor }}
            ></div>
            <div
                className="dot"
                style={{ backgroundColor: primaryColor }}
            ></div>
        </div>
    );

    return (
        <div
            className={`maintenance-page ${backgroundPattern}`}
            style={getBackgroundStyle()}
        >
            <div className="maintenance-container">
                {logo && (
                    <div className="logo-container">
                        <img
                            src={logo}
                            alt={logoAlt}
                            className="company-logo"
                        />
                    </div>
                )}

                <div className="maintenance-content">
                    {animated && (
                        <div className="maintenance-icon">
                            <img
                                src={maintenanceImageUrl}
                                alt="Maintenance"
                                className="maintenance-animation"
                            />
                        </div>
                    )}

                    <h1
                        className="maintenance-title"
                        style={{ color: primaryColor }}
                    >
                        {title}
                    </h1>
                    <p className="maintenance-message">{message}</p>

                    {eta && (
                        <div className="eta-container">
                            <p className="eta-label">Expected completion:</p>
                            <p className="eta-time">{formatEta(eta)}</p>
                        </div>
                    )}

                    {(contactEmail || contactPhone) && (
                        <div className="contact-info">
                            <h2 className="contact-title">Need assistance?</h2>
                            {contactEmail && (
                                <a
                                    href={`mailto:${contactEmail}`}
                                    className="contact-link"
                                    style={{ color: primaryColor }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="contact-icon"
                                    >
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                    {contactEmail}
                                </a>
                            )}
                            {contactPhone && (
                                <a
                                    href={`tel:${contactPhone.replace(
                                        /\D/g,
                                        ""
                                    )}`}
                                    className="contact-link"
                                    style={{ color: primaryColor }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="contact-icon"
                                    >
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                    </svg>
                                    {contactPhone}
                                </a>
                            )}
                        </div>
                    )}

                    {autoRefreshInterval > 0 && (
                        <div className="auto-refresh">
                            {isRefreshing ? (
                                <p className="refreshing">
                                    Checking if site is back online...{" "}
                                    <LoadingDots />
                                </p>
                            ) : (
                                <p className="refresh-countdown">
                                    Checking again in{" "}
                                    <span style={{ color: primaryColor }}>
                                        {countdown}
                                    </span>{" "}
                                    {countdown === 1 ? "second" : "seconds"}
                                </p>
                            )}
                            <button
                                className="refresh-button"
                                onClick={() => window.location.reload()}
                                style={{
                                    backgroundColor: primaryColor,
                                    boxShadow: `0 0 0 3px ${primaryColor}25`,
                                }}
                            >
                                Refresh Now
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

MaintenancePage.propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    eta: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    logo: PropTypes.string,
    logoAlt: PropTypes.string,
    contactEmail: PropTypes.string,
    contactPhone: PropTypes.string,
    socialLinks: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
            icon: PropTypes.node.isRequired,
        })
    ),
    backgroundImage: PropTypes.string,
    backgroundPattern: PropTypes.oneOf(["grid", "dots", "diagonal", "none"]),
    autoRefreshInterval: PropTypes.number,
    primaryColor: PropTypes.string,
    animated: PropTypes.bool,
};

export default MaintenancePage;
