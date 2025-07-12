import React, { useState, useEffect } from "react";
import {
    Users,
    UserPlus,
    UserMinus,
    FileText,
    TrendingUp,
    TrendingDown,
    UserCheck,
} from "lucide-react";
import { CustomContainer } from "../../../components";
import { DashedLine } from "../../../components"; // Import the DashedLine component
import "./StatCards.css";

function StatCards({ employeesTrack = null, yesterdayAttendance,className, ...prop }) {
    const [data, setData] = useState([]);
    const [comparisonIndex, setComparisonIndex] = useState(0);
    const comparisonPeriods = ["yesterday", "last week", "last month"];

    useEffect(() => {
        // Use provided data or generate sample data
        if (
            employeesTrack &&
            Array.isArray(employeesTrack) &&
            employeesTrack.length > 0
        ) {
            setData(employeesTrack);
        }

        // Set up the interval for the sliding animation
        const intervalId = setInterval(() => {
            setComparisonIndex(
                (prevIndex) => (prevIndex + 1) % comparisonPeriods.length
            );
        }, 3000);

        return () => clearInterval(intervalId);
    }, [employeesTrack]);

    // Helper to safely get item by index (or null)
    const getItem = (arr, idx) => (arr && arr.length > idx ? arr[idx] : null);

    // Calculate summary statistics
    const calculateStats = () => {
        // Default empty result for safety
        const defaultResult = {
            todayTotalEmployees: 0,
            todayNew: 0,
            todayResigned: 0,
            todayApplicants: 0,
            changes: {
                yesterday: {
                    todayTotalEmployees: 0,
                    todayNew: 0,
                    todayResigned: 0,
                    todayApplicants: 0,
                },
                lastWeek: {
                    todayTotalEmployees: 0,
                    todayNew: 0,
                    todayResigned: 0,
                    todayApplicants: 0,
                },
                lastMonth: {
                    todayTotalEmployees: 0,
                    todayNew: 0,
                    todayResigned: 0,
                    todayApplicants: 0,
                },
            },
        };

        if (data.length === 0) return defaultResult;

        const today = getItem(data, data.length - 1);
        if (!today) return defaultResult;

        const yesterday = getItem(data, data.length - 2);
        if (!yesterday) return defaultResult;

        // Helper to parse date from our format (dd/mm)
        const parseDate = (dateStr) => {
            const [day, month] = dateStr.split("/").map(Number);
            // Create date object (using current year)
            const currentYear = new Date().getFullYear();
            return new Date(currentYear, month - 1, day);
        };

        // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const getDayOfWeek = (date) => {
            const dateObj = typeof date === "string" ? parseDate(date) : date;
            return dateObj.getDay();
        };

        // Function to get first index of Tuesday in data, starting from a given index and moving backwards
        const findMostRecentTuesdayIndex = (startIdx) => {
            for (let i = startIdx; i >= 0; i--) {
                const dayOfWeek = getDayOfWeek(data[i].date);
                if (dayOfWeek === 2) {
                    // 2 represents Tuesday
                    return i;
                }
            }
            return -1; // No Tuesday found
        };

        // Build week data dynamically based on Tuesday-to-Monday weeks
        const currentWeekStartIdx = findMostRecentTuesdayIndex(data.length - 1);
        let thisWeek = [];
        let lastWeek = [];

        if (currentWeekStartIdx !== -1) {
            // Include today if it's in the current week
            const todayDayOfWeek = getDayOfWeek(today.date);
            const daysFromTuesday = (todayDayOfWeek + 5) % 7; // Convert to days since Tuesday

            // If today is not Tuesday (day 0), get the partial week
            thisWeek = data.slice(currentWeekStartIdx, data.length);

            // Get previous week (full 7 days)
            const previousWeekStartIdx = Math.max(0, currentWeekStartIdx - 7);
            const previousWeekEndIdx = currentWeekStartIdx;
            lastWeek = data.slice(previousWeekStartIdx, previousWeekEndIdx);
        } else {
            // Fallback if we can't find a Tuesday (shouldn't happen with enough data)
            thisWeek = data.slice(-7);
            lastWeek = data.slice(-14, -7);
        }

        // Parse date function needs to handle DD-MM-YYYY format from the dataset

        // Get the current month and year from today's date
        const todayDate = parseDate(today.date);
        const todayMonth = todayDate.getMonth(); // 0-indexed (0 = Jan, 1 = Feb...)
        const todayYear = todayDate.getFullYear();

        // Current month data (all entries in the same month as today)
        const thisMonth = data.filter((item) => {
            const itemDate = parseDate(item.date);
            return (
                itemDate.getMonth() === todayMonth &&
                itemDate.getFullYear() === todayYear
            );
        });

        // Last month data (all entries in the previous month)
        const lastMonthNum = (todayMonth - 1 + 12) % 12; // Previous month, handling January
        const lastMonthYear = todayMonth === 0 ? todayYear - 1 : todayYear;

        const lastMonth = data.filter((item) => {
            const itemDate = parseDate(item.date);
            return (
                itemDate.getMonth() === lastMonthNum &&
                itemDate.getFullYear() === lastMonthYear
            );
        });

        // Utility function to sum values across an array
        const getSum = (arr, key) =>
            arr && arr.length
                ? arr.reduce((sum, d) => sum + (d[key] || 0), 0)
                : 0;

        // Calculate % change safely - FIXED the calculation method
        const calculateChange = (current, previous) => {
            // Convert to numbers and handle potential undefined/null values
            current = Number(current) || 0;
            previous = Number(previous) || 0;

            if (previous === 0) {
                if (current === 0) return 0;
                return current > 0 ? 100 : -100; // +100% for increases, -100% for decreases from zero
            }

            return ((current - previous) / previous) * 100; // FIXED: Use previous directly for percent change
        };

        // For daily comparison
        const yesterdayComparison = {
            todayTotalEmployees: calculateChange(
                today.todayTotalEmployees || 0,
                yesterday.todayTotalEmployees || 0
            ),
            todayNew: calculateChange(
                today.newJoined || 0,
                yesterday.newJoined || 0
            ),
            todayResigned: calculateChange(
                today.resigned || 0,
                yesterday.resigned || 0
            ),
            todayApplicants: calculateChange(
                today.jobApplicants || 0,
                yesterday.jobApplicants || 0
            ),
        };

        // For weekly comparison - compare this week's total to last week's total
        const thisWeekTotalNew = getSum(thisWeek, "newJoined");
        const lastWeekTotalNew = getSum(lastWeek, "newJoined");

        const thisWeekTotalResigned = getSum(thisWeek, "resigned");
        const lastWeekTotalResigned = getSum(lastWeek, "resigned");

        const thisWeekTotalApplicants = getSum(thisWeek, "jobApplicants");
        const lastWeekTotalApplicants = getSum(lastWeek, "jobApplicants");

        // Compare current employee count with last week's equivalent day
        const lastWeekEquivalentDayIndex =
            lastWeek.length > 0 ? lastWeek.length - 1 : -1;
        const lastWeekEquivalentEmployees =
            lastWeekEquivalentDayIndex >= 0
                ? lastWeek[lastWeekEquivalentDayIndex].todayTotalEmployees || 0
                : yesterday.todayTotalEmployees || 0;

        const weeklyComparison = {
            todayTotalEmployees: calculateChange(
                today.todayTotalEmployees || 0,
                lastWeekEquivalentEmployees
            ),
            todayNew: calculateChange(thisWeekTotalNew, lastWeekTotalNew),
            todayResigned: calculateChange(
                thisWeekTotalResigned,
                lastWeekTotalResigned
            ),
            todayApplicants: calculateChange(
                thisWeekTotalApplicants,
                lastWeekTotalApplicants
            ),
        };

        // For monthly comparison - compare this month's accumulated values to last month's
        // Calculate this month's and last month's totals for each metric
        const thisMonthTotalNew = getSum(thisMonth, "newJoined");
        const lastMonthTotalNew = getSum(lastMonth, "newJoined");

        const thisMonthTotalResigned = getSum(thisMonth, "resigned");
        const lastMonthTotalResigned = getSum(lastMonth, "resigned");

        const thisMonthTotalApplicants = getSum(thisMonth, "jobApplicants");
        const lastMonthTotalApplicants = getSum(lastMonth, "jobApplicants");

        // Get equivalent day of last month for employee count comparison
        // If we're on day 15 of this month, we compare with day 15 of last month (or closest available)
        const todayDayOfMonth = todayDate.getDate();

        // Find the closest day in last month to today's day of month
        let closestLastMonthDate = null;
        let minDayDifference = Infinity;

        for (const item of lastMonth) {
            const itemDate = parseDate(item.date);
            const dayDifference = Math.abs(
                itemDate.getDate() - todayDayOfMonth
            );
            if (dayDifference < minDayDifference) {
                minDayDifference = dayDifference;
                closestLastMonthDate = item;
            }
        }

        // Use last month's equivalent day employee count, or fallback to the last day of last month
        const lastMonthEmployees = closestLastMonthDate
            ? closestLastMonthDate.todayTotalEmployees || 0
            : lastMonth.length > 0
            ? lastMonth[lastMonth.length - 1].todayTotalEmployees || 0
            : 0;

        const monthlyComparison = {
            todayTotalEmployees: calculateChange(
                today.todayTotalEmployees || 0,
                lastMonthEmployees
            ),
            todayNew: calculateChange(thisMonthTotalNew, lastMonthTotalNew),
            todayResigned: calculateChange(
                thisMonthTotalResigned,
                lastMonthTotalResigned
            ),
            todayApplicants: calculateChange(
                thisMonthTotalApplicants,
                lastMonthTotalApplicants
            ),
        };

        // Put all comparisons together
        const changes = {
            yesterday: yesterdayComparison,
            lastWeek: weeklyComparison,
            lastMonth: monthlyComparison,
        };

        return {
            todayTotalEmployees: today.todayTotalEmployees || 0,
            todayNew: today.newJoined || 0,
            todayResigned: today.resigned || 0,
            todayApplicants: today.jobApplicants || 0,
            changes,
        };
    };

    const stats = calculateStats();

    const StatCard = ({
        title,
        value,
        icon,
        color,
        metric,
        inverseMetric = false,
        isYesterdayAttendance = false,
    }) => {
        const currentPeriod = comparisonPeriods[comparisonIndex];

        // Map current period string to changes keys
        const changeKey = {
            yesterday: "yesterday",
            "last week": "lastWeek",
            "last month": "lastMonth",
        }[currentPeriod];

        // Dynamically get the right metric key from the change object
        const changeValue = stats.changes[changeKey]?.[metric] ?? 0;

        // Handle NaN values by returning 0
        const validChange = isNaN(changeValue) ? 0 : changeValue;

        const isPositive = inverseMetric ? validChange < 0 : validChange > 0;
        const changeDisplay = Math.abs(validChange).toFixed(1);

        const changeClass = isPositive ? "text-green-500" : "text-red-500";

        return (
            <div className="relative rounded-lg p-2 flex flex-col justify-center">
                {/* Main row content - centered vertically */}
                <div className="flex items-center">
                    <div className={`p-2 rounded-full ${color}`}>{icon}</div>
                    <div className="ml-2 flex-grow">
                        <p className="text-xs text-gray-500">{title}</p>
                        <p className="text-lg font-semibold">{value}</p>
                    </div>
                </div>

                {/* Bottom-right animated stat */}

                {!isYesterdayAttendance && (
                    <div className="absolute bottom-2 right-2">
                        <div
                            className={`animated-stat flex items-end ${changeClass} text-xs animate-fadeIn`}
                        >
                            {isPositive ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            <span>
                                {isPositive ? "+" : "-"}
                                {changeDisplay}% {currentPeriod}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Use CSS color values instead of Tailwind class names for the DashedLine
    const dashLineColor = "#d1d5db"; // Equivalent to gray-300

    return (
        <div>
            <CustomContainer
                elevation="medium"
                border={true}
                rounded="medium"
                backgroundColor="white"
                width="full"
                className={className}
            >
                {/* Single row layout with all cards */}
                <div className="flex flex-wrap lg:flex-nowrap justify-between relative h-full">
                    <div className="w-full lg:w-1/4 px-2">
                        <StatCard
                            title="Total Employees"
                            value={stats.todayTotalEmployees}
                            icon={<Users size={20} className="text-blue-500" />}
                            color="bg-blue-100"
                            metric="todayTotalEmployees"
                        />
                    </div>

                    {/* Vertical dashed line after first card */}
                    <div className="hidden lg:flex h-16 self-center">
                        <DashedLine
                            orientation="vertical"
                            color={dashLineColor}
                            dashWidth={8}
                            dashGap={3}
                            thickness={1}
                            className="h-full"
                        />
                    </div>

                    <div className="w-full lg:w-1/4 px-2">
                        <StatCard
                            title="New Employees"
                            value={stats.todayNew}
                            icon={
                                <UserPlus
                                    size={20}
                                    className="text-green-500"
                                />
                            }
                            color="bg-green-100"
                            metric="todayNew"
                        />
                    </div>

                    {/* Vertical dashed line after second card */}
                    <div className="hidden lg:flex h-16 self-center">
                        <DashedLine
                            orientation="vertical"
                            color={dashLineColor}
                            dashWidth={8}
                            dashGap={3}
                            thickness={1}
                            className="h-full"
                        />
                    </div>

                    <div className="w-full lg:w-1/4 px-2">
                        <StatCard
                            title="Resigned"
                            value={stats.todayResigned}
                            icon={
                                <UserMinus size={20} className="text-red-500" />
                            }
                            color="bg-red-100"
                            metric="todayResigned"
                            inverseMetric={true}
                        />
                    </div>

                    {/* Vertical dashed line after third card */}
                    <div className="hidden lg:flex h-16 self-center">
                        <DashedLine
                            orientation="vertical"
                            color={dashLineColor}
                            dashWidth={8}
                            dashGap={3}
                            thickness={1}
                            className="h-full"
                        />
                    </div>

                    <div className="w-full lg:w-1/4 px-2">
                        <StatCard
                            title="Job Applicants"
                            value={stats.todayApplicants}
                            icon={
                                <FileText
                                    size={20}
                                    className="text-purple-500"
                                />
                            }
                            color="bg-purple-100"
                            metric="todayApplicants"
                        />
                    </div>
                    {/* Vertical dashed line after third card */}
                    <div className="hidden lg:flex h-16 self-center">
                        <DashedLine
                            orientation="vertical"
                            color={dashLineColor}
                            dashWidth={8}
                            dashGap={3}
                            thickness={1}
                            className="h-full"
                        />
                    </div>

                    <div className="w-full lg:w-1/4 px-2">
                        <StatCard
                            isYesterdayAttendance={true}
                            title="Yesterday Attendance"
                            value={yesterdayAttendance}
                            icon={
                                <UserCheck
                                    size={20}
                                    className="text-amber-700"
                                />
                            }
                            color="bg-amber-100"
                            metric="todayApplicants"
                        />
                    </div>
                </div>
            </CustomContainer>
        </div>
    );
}

export default StatCards;
