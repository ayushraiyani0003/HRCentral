import React, { useRef, useState, useEffect } from "react";
import { CustomContainer, TextButton } from "../../../components";
import { Ellipsis } from "lucide-react";

const DynamicProgressBar = ({ segments = [], legend = false }) => {
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);

    // Update containerWidth on mount and window resize
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    // Calculate cumulative percentages for positioning
    let cumulativePercentage = 0;
    const processedSegments = segments.map((segment) => {
        const start = cumulativePercentage;
        const width = segment.percentage;
        cumulativePercentage += width;
        return {
            ...segment,
            start,
            width,
            end: cumulativePercentage,
        };
    });

    return (
        <div className="w-full">
            {/* Progress Bar */}
            <div
                ref={containerRef}
                className="relative h-6 mb-2 bg-gray-50 rounded-lg overflow-hidden"
            >
                {processedSegments.map((segment, index) => {
                    // Calculate segment width in pixels
                    const segmentPixelWidth =
                        (segment.width / 100) * containerWidth;

                    // Calculate number of lines based on available space
                    // Each line is 3px wide with 2px gaps between them
                    const lineWidth = 2;
                    const gapWidth = 2;
                    const availableWidth = segmentPixelWidth - 4; // 2px padding on each side

                    // Calculate how many lines can fit
                    let lineCount = 0;
                    if (availableWidth > 0) {
                        lineCount = Math.max(
                            1,
                            Math.floor(
                                (availableWidth + gapWidth) /
                                    (lineWidth + gapWidth)
                            )
                        );
                    }

                    return (
                        <div
                            key={index}
                            className="absolute h-full flex items-center justify-center"
                            style={{
                                left: `${segment.start}%`,
                                width: `${segment.width}%`,
                                backgroundColor: `${segment.color}20`, // Light background
                            }}
                        >
                            {/* Container for lines with proper spacing */}
                            <div
                                className="flex items-center gap-0.5 h-5"
                                style={{
                                    width: `${Math.min(
                                        segmentPixelWidth - 4,
                                        lineCount * lineWidth +
                                            (lineCount - 1) * gapWidth
                                    )}px`,
                                }}
                            >
                                {Array.from({ length: lineCount }).map(
                                    (_, lineIndex) => (
                                        <div
                                            key={lineIndex}
                                            className="rounded-sm flex-shrink-0"
                                            style={{
                                                width: `${lineWidth}px`,
                                                height: "16px",
                                                backgroundColor: segment.color,
                                            }}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Progress Labels */}
            <div className="flex justify-between text-sm text-gray-600 font-medium">
                <span>0%</span>
                <span>100%</span>
            </div>

            {/* Segment Labels (Optional) */}
            {segments.length > 0 && legend && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {processedSegments.map((segment, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                            <div
                                className="w-3 h-3 rounded-sm"
                                style={{ backgroundColor: segment.color }}
                            />
                            <span className="text-xs text-gray-600">
                                {segment.label || `Segment ${index + 1}`} (
                                {segment.width}%)
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

function EmploymentStatusCard({ className = "" }) {
    // Example data - can be dynamic
    const employmentData = [
        {
            type: "Permanent",
            value: 232,
            percentage: 49,
            color: "#3B82F6", // Blue
            indicator: "#3B82F6",
        },
        {
            type: "Contract",
            value: 156,
            percentage: 33,
            color: "#10B981", // Green
            indicator: "#10B981",
        },
        {
            type: "Probation",
            value: 85,
            percentage: 18,
            color: "#F59E0B", // Yellow
            indicator: "#F59E0B",
        },
    ];

    return (
        <CustomContainer
            className={className}
            title="Employment Status"
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
                <div className="mb-0 flex flex-row gap-0 items-center">
                    <TextButton
                        text=""
                        // onClick={() => console.log("View Recruitee List")}
                        icon={<Ellipsis size={16} />}
                        iconEnd={true}
                        textClassName="hidden"
                        className="!p-0 !w-8 !h-8 !rounded-full"
                    />
                </div>
            }
            headerBorder={true}
            elevation="medium"
            rounded="medium"
            overflowContent={true}
            isFixedFooter={false}
            headerClassName={"!mb-2"}
        >
            {/* Dynamic Progress Bar */}
            <div className="mb-2">
                <DynamicProgressBar segments={employmentData} />
            </div>

            {/* Status Cards Row */}
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                {employmentData.map((item, index) => (
                    <React.Fragment key={index}>
                        <div className="flex-1 px-4 py-2 text-left">
                            {/* Color Indicator and Text */}
                            <div className="flex items-center justify-start gap-2 mb-2">
                                <div
                                    className="w-3 h-3 rounded-sm"
                                    style={{
                                        backgroundColor: item.indicator,
                                    }}
                                />
                                <span className="text-sm text-gray-600">
                                    {item.type}
                                </span>
                            </div>

                            {/* Count */}
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                {item.value}
                            </div>

                            {/* Percentage */}
                            <div className="text-[15px] text-gray-500">
                                {item.percentage}%
                            </div>
                        </div>

                        {/* Divider */}
                        {index < employmentData.length - 1 && (
                            <div className="w-px bg-gray-200" />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </CustomContainer>
    );
}

export default EmploymentStatusCard;
