import React, { useState, useEffect } from "react";
import {
    CustomContainer,
    CustomDropdown,
    CustomBarChart,
} from "../../../components";

function InterviewVsHiredCard({ className = "" }) {
    // State for department/designation type
    const [viewType, setViewType] = useState("department");

    // State for time period
    const [timePeriod, setTimePeriod] = useState("thisMonth");

    // Sample data for interviews vs hired - ensure all data points have both properties
    const [employeeData, setEmployeeData] = useState([
        { name: "HR", interviewed: 30, hired: 10 },
        { name: "Engineering", interviewed: 45, hired: 15 },
        { name: "Marketing", interviewed: 25, hired: 8 },
        { name: "Sales", interviewed: 35, hired: 12 },
        { name: "Finance", interviewed: 20, hired: 5 },
    ]);

    // Sample data for designation view - ensure all data points have both properties
    const designationData = [
        { name: "Manager", interviewed: 18, hired: 5 },
        { name: "Developer", interviewed: 40, hired: 12 },
        { name: "Designer", interviewed: 22, hired: 7 },
        { name: "Analyst", interviewed: 25, hired: 8 },
        { name: "Assistant", interviewed: 15, hired: 4 },
    ];

    // Options for view type dropdown
    const viewTypeOptions = [
        { label: "Department", value: "department" },
        { label: "Designation", value: "designation" },
    ];

    // Options for time period dropdown
    const timePeriodOptions = [
        { label: "Today", value: "today" },
        { label: "Yesterday", value: "yesterday" },
        { label: "This Week", value: "thisWeek" },
        { label: "Last Week", value: "lastWeek" },
        { label: "This Month", value: "thisMonth" },
        { label: "Last Month", value: "lastMonth" },
        { label: "This Year", value: "thisYear" },
        { label: "Last Year", value: "lastYear" },
    ];

    // Update data based on view type
    useEffect(() => {
        if (viewType === "department") {
            setEmployeeData([
                { name: "HR", interviewed: 30, hired: 10 },
                { name: "Engineering", interviewed: 45, hired: 15 },
                { name: "Marketing", interviewed: 25, hired: 8 },
                { name: "Sales", interviewed: 35, hired: 12 },
                { name: "Finance", interviewed: 20, hired: 5 },
            ]);
        } else {
            setEmployeeData(designationData);
        }
    }, [viewType]);

    // In a real application, you would fetch data based on timePeriod as well
    useEffect(() => {
        // Simulate data fetch based on time period
        // console.log(`Fetching data for time period: ${timePeriod}`);
        // This would be an API call in a real application
    }, [timePeriod]);

    // Chart configuration
    const unitType = "number";
    const legendPosition = "topright";
    const layout = "horizontal"; // Note: using lowercase to match typical React props convention
    const roundedBars = true;

    const customColors = ["#F79B72", "rgba(42, 71, 89, 0.85)"];

    // Tooltip formatter function
    const tooltipFormatter = (value) => {
        switch (unitType) {
            case "currency":
                return `${value.toLocaleString()}`;
            case "percent":
                return `${value}%`;
            case "number":
                return `${value}`;
            default:
                return value;
        }
    };

    // Explicitly define keys and labelKey
    const keys = ["interviewed", "hired"];
    const labelKey = "name";
    const xAxisLabel = viewType === "department" ? "Department" : "Designation";
    const yDomain = [0, "auto"]; // Using 'auto' for max value

    return (
        <CustomContainer
            className={`!m-0 !px-3 !py-2 h-full relative flex flex-col ${className}`}
            title="Interview vs Hired"
            icon={
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                </svg>
            }
            headerActions={
                <div className="mb-0 flex flex-row gap-2 items-center flex-wrap justify-end">
                    <CustomDropdown
                        options={viewTypeOptions}
                        value={viewType}
                        onChange={(value) => {
                            console.log(`View type selected: ${value}`);
                            setViewType(value);
                        }}
                        isSearchable={false}
                        className="!w-40 !mb-0"
                        placeholder="Select view type"
                    />
                    <CustomDropdown
                        options={timePeriodOptions}
                        value={timePeriod}
                        onChange={(value) => {
                            console.log(`Time period selected: ${value}`);
                            setTimePeriod(value);
                        }}
                        isSearchable={false}
                        className="!w-40 !mb-0"
                        placeholder="Select time period"
                    />
                </div>
            }
            headerClassName="!m-0"
            headerBorder={true}
            elevation="medium"
            rounded="medium"
            padding="none"
            overflowContent={true}
            isFixedFooter={false}
        >
            <div className="p-0 flex-grow">
                <CustomBarChart
                    data={employeeData}
                    keys={keys}
                    labelKey={labelKey}
                    unit={unitType}
                    stacked={true} // Not stacked, show two separate bars per category// and if need two bar on top of each other then set to true
                    colors={customColors}
                    colorByData={false}
                    legendPosition={legendPosition}
                    layout={layout}
                    roundedBars={roundedBars}
                    xTickFormatter={(tick) =>
                        tick.length > 10 ? tick.slice(0, 10) + "..." : tick
                    }
                    yTickCount={8}
                    tooltipFormatter={tooltipFormatter}
                    barSize={20} // Adjusted bar size for better visual
                    isGridDisplay={true}
                    responsive={true}
                    showLegend={true}
                    showLabels={false}
                    xAxisLabel={xAxisLabel}
                    yAxisLabel={
                        unitType === "currency"
                            ? "Amount ($)"
                            : unitType === "percent"
                            ? "Percentage (%)"
                            : "Value"
                    }
                    unitSymbol=""
                    yDomain={yDomain}
                    height={420}
                />
            </div>
        </CustomContainer>
    );
}

export default InterviewVsHiredCard;
