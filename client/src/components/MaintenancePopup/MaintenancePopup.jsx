import React, { useState, useEffect, useCallback, forwardRef } from "react";
import "./maintenancePopupStyles.css";

/**
 * MaintenancePopup - A configurable notification system for maintenance alerts
 *
 * @param {Object} props - Component props
 * @param {string} props.id - Unique identifier for the maintenance notice
 * @param {Date|string} props.startTime - When maintenance begins
 * @param {Date|string} props.endTime - When maintenance ends
 * @param {string} props.title - Main heading for the notice
 * @param {React.ReactNode} props.content - Content for the maintenance notice
 * @param {string} props.severity - Severity level ('info', 'warning', 'critical')
 * @param {string} props.position - Display position ('banner-top', 'banner-bottom', 'popup-center', 'fullscreen')
 * @param {boolean} props.showCountdown - Whether to show a countdown timer
 * @param {boolean} props.allowTemporaryDismiss - Whether users can temporarily dismiss
 * @param {boolean} props.allowPermanentDismiss - Whether users can permanently dismiss
 * @param {Object} props.recurrence - Configuration for recurring notices
 * @param {string} props.recurrence.frequency - 'daily', 'weekly', 'monthly'
 * @param {Array} props.recurrence.daysOfWeek - Days of week for weekly recurrence (0-6, Sunday is 0)
 * @param {number} props.recurrence.dayOfMonth - Day of month for monthly recurrence
 * @param {number} props.autoShowBeforeMinutes - Minutes before start to automatically show the notice
 * @param {boolean} props.showOutsideSchedule - Whether to show outside scheduled times
 * @param {Function} props.onDismiss - Callback when notice is dismissed
 * @param {Function} props.onShow - Callback when notice is shown
 * @param {Function} props.onTimeUpdate - Callback when countdown updates
 * @param {string} props.className - Additional CSS class names
 */
const MaintenancePopup = forwardRef(
    (
        {
            id = `maintenance-${Date.now()}`,
            startTime,
            endTime,
            title = "Scheduled Maintenance",
            content,
            severity = "info",
            position = "banner-top",
            showCountdown = true,
            allowTemporaryDismiss = true,
            allowPermanentDismiss = true,
            recurrence = null,
            autoShowBeforeMinutes = 60,
            showOutsideSchedule = false,
            onDismiss = () => {},
            onShow = () => {},
            onTimeUpdate = () => {},
            className = "",
            ...rest
        },
        ref
    ) => {
        // State
        const [isVisible, setIsVisible] = useState(false);
        const [timeRemaining, setTimeRemaining] = useState({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            total: 0,
        });
        const [maintenanceStatus, setMaintenanceStatus] = useState("upcoming"); // 'upcoming', 'in-progress', 'completed'
        const [userDismissed, setUserDismissed] = useState(false);

        // Parse times
        const parsedStartTime =
            startTime instanceof Date ? startTime : new Date(startTime);
        const parsedEndTime =
            endTime instanceof Date ? endTime : new Date(endTime);

        // Format the maintenance schedule as readable text
        const formatSchedule = () => {
            const formatDate = (date) => {
                return new Intl.DateTimeFormat("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                }).format(date);
            };

            return `${formatDate(parsedStartTime)} - ${formatDate(
                parsedEndTime
            )}`;
        };

        // Check if maintenance is currently in progress
        const isMaintenanceInProgress = useCallback(() => {
            const now = new Date();
            return now >= parsedStartTime && now <= parsedEndTime;
        }, [parsedStartTime, parsedEndTime]);

        // Check if maintenance is coming up soon (within autoShowBeforeMinutes)
        const isMaintenanceUpcomingSoon = useCallback(() => {
            const now = new Date();
            const minutesBeforeStart = (parsedStartTime - now) / (1000 * 60);
            return (
                minutesBeforeStart > 0 &&
                minutesBeforeStart <= autoShowBeforeMinutes
            );
        }, [parsedStartTime, autoShowBeforeMinutes]);

        // Check if maintenance has completed
        const isMaintenanceCompleted = useCallback(() => {
            const now = new Date();
            return now > parsedEndTime;
        }, [parsedEndTime]);

        // Calculate time remaining until start or end
        const calculateTimeRemaining = useCallback(() => {
            const now = new Date();

            // Choose target time based on current status
            const targetTime = isMaintenanceInProgress()
                ? parsedEndTime
                : parsedStartTime;
            const difference = targetTime - now;

            if (difference <= 0) {
                return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
            }

            // Calculate components
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
                (difference % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            return {
                days,
                hours,
                minutes,
                seconds,
                total: difference,
            };
        }, [parsedStartTime, parsedEndTime, isMaintenanceInProgress]);

        // Check if the notice should be shown (based on time and user dismissal)
        const shouldShowNotice = useCallback(() => {
            // Don't show if user has permanently dismissed
            if (isPermanentlyDismissed()) {
                return false;
            }

            // Don't show if user has temporarily dismissed (this session)
            if (userDismissed) {
                return false;
            }

            // Always show if maintenance is in progress
            if (isMaintenanceInProgress()) {
                return true;
            }

            // Show if upcoming soon
            if (isMaintenanceUpcomingSoon()) {
                return true;
            }

            // Show outside schedule if configured to do so
            return showOutsideSchedule;
        }, [
            isMaintenanceInProgress,
            isMaintenanceUpcomingSoon,
            userDismissed,
            showOutsideSchedule,
        ]);

        // Check if the notice has been permanently dismissed
        const isPermanentlyDismissed = useCallback(() => {
            if (!allowPermanentDismiss) {
                return false;
            }

            try {
                const dismissedNotices =
                    JSON.parse(
                        localStorage.getItem("dismissedMaintenanceNotices")
                    ) || {};
                return !!dismissedNotices[id];
            } catch (error) {
                console.error("Error checking dismissed notices:", error);
                return false;
            }
        }, [id, allowPermanentDismiss]);

        // Handle permanent dismissal
        const handlePermanentDismiss = () => {
            try {
                const dismissedNotices =
                    JSON.parse(
                        localStorage.getItem("dismissedMaintenanceNotices")
                    ) || {};
                dismissedNotices[id] = new Date().toISOString();
                localStorage.setItem(
                    "dismissedMaintenanceNotices",
                    JSON.stringify(dismissedNotices)
                );

                setIsVisible(false);
                setUserDismissed(true);
                onDismiss("permanent");
            } catch (error) {
                console.error("Error saving dismissed notice:", error);
            }
        };

        // Handle temporary dismissal
        const handleTemporaryDismiss = () => {
            setIsVisible(false);
            setUserDismissed(true);
            onDismiss("temporary");
        };

        // Format time remaining
        const formatTimeRemaining = (timeObj) => {
            const { days, hours, minutes, seconds } = timeObj;

            if (days > 0) {
                return `${days}d ${hours}h ${minutes}m`;
            } else if (hours > 0) {
                return `${hours}h ${minutes}m ${seconds}s`;
            } else {
                return `${minutes}m ${seconds}s`;
            }
        };

        // Update time remaining and visibility
        useEffect(() => {
            const updateStatus = () => {
                if (isMaintenanceCompleted()) {
                    setMaintenanceStatus("completed");
                } else if (isMaintenanceInProgress()) {
                    setMaintenanceStatus("in-progress");
                } else {
                    setMaintenanceStatus("upcoming");
                }
            };

            const updateTime = () => {
                const remaining = calculateTimeRemaining();
                setTimeRemaining(remaining);
                onTimeUpdate(remaining);
            };

            const updateVisibility = () => {
                const shouldShow = shouldShowNotice();
                if (shouldShow !== isVisible) {
                    setIsVisible(shouldShow);
                    if (shouldShow) {
                        onShow();
                    }
                }
            };

            // Initial updates
            updateStatus();
            updateTime();
            updateVisibility();

            // Set up interval for updates
            const intervalId = setInterval(() => {
                updateStatus();
                updateTime();
                updateVisibility();
            }, 1000);

            return () => clearInterval(intervalId);
        }, [
            calculateTimeRemaining,
            isMaintenanceCompleted,
            isMaintenanceInProgress,
            shouldShowNotice,
            isVisible,
            onTimeUpdate,
            onShow,
        ]);

        // Prepare classes
        const popupClasses = [
            "maintenance-popup",
            `maintenance-popup-${severity}`,
            `maintenance-popup-${position}`,
            `maintenance-status-${maintenanceStatus}`,
            isVisible ? "maintenance-popup-visible" : "",
            className,
        ]
            .filter(Boolean)
            .join(" ");

        // If not visible, don't render
        if (!isVisible) {
            return null;
        }

        return (
            <div
                className={popupClasses}
                role="alert"
                aria-live="polite"
                ref={ref}
                {...rest}
            >
                <div className="maintenance-popup-content">
                    <div className="maintenance-popup-header">
                        <h3 className="maintenance-popup-title">{title}</h3>
                        {(allowTemporaryDismiss || allowPermanentDismiss) && (
                            <div className="maintenance-popup-actions">
                                {allowPermanentDismiss && (
                                    <button
                                        className="maintenance-popup-dismiss permanent-dismiss"
                                        onClick={handlePermanentDismiss}
                                        aria-label="Permanently dismiss"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            width="16"
                                            height="16"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                )}
                                {allowTemporaryDismiss &&
                                    !allowPermanentDismiss && (
                                        <button
                                            className="maintenance-popup-dismiss temporary-dismiss"
                                            onClick={handleTemporaryDismiss}
                                            aria-label="Dismiss"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                width="16"
                                                height="16"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    )}
                            </div>
                        )}
                    </div>

                    <div className="maintenance-popup-body">{content}</div>

                    <div className="maintenance-popup-footer">
                        <div className="maintenance-popup-schedule">
                            <span className="maintenance-popup-schedule-label">
                                Schedule:
                            </span>
                            <span className="maintenance-popup-schedule-time">
                                {formatSchedule()}
                            </span>
                        </div>

                        {showCountdown && timeRemaining.total > 0 && (
                            <div className="maintenance-popup-countdown">
                                <span className="maintenance-popup-countdown-label">
                                    {maintenanceStatus === "in-progress"
                                        ? "Ends in:"
                                        : "Starts in:"}
                                </span>
                                <span className="maintenance-popup-countdown-time">
                                    {formatTimeRemaining(timeRemaining)}
                                </span>
                            </div>
                        )}

                        {allowTemporaryDismiss && allowPermanentDismiss && (
                            <button
                                className="maintenance-popup-dismiss-button"
                                onClick={handleTemporaryDismiss}
                            >
                                Dismiss for now
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }
);

// Predefined severity variants
export const InfoMaintenancePopup = (props) => (
    <MaintenancePopup severity="info" {...props} />
);
export const WarningMaintenancePopup = (props) => (
    <MaintenancePopup severity="warning" {...props} />
);
export const CriticalMaintenancePopup = (props) => (
    <MaintenancePopup severity="critical" {...props} />
);

// Predefined position variants
export const BannerTopMaintenancePopup = (props) => (
    <MaintenancePopup position="banner-top" {...props} />
);
export const BannerBottomMaintenancePopup = (props) => (
    <MaintenancePopup position="banner-bottom" {...props} />
);
export const PopupCenterMaintenancePopup = (props) => (
    <MaintenancePopup position="popup-center" {...props} />
);
export const FullscreenMaintenancePopup = (props) => (
    <MaintenancePopup position="fullscreen" {...props} />
);

export default MaintenancePopup;
