import React, { useRef, useState, useEffect } from "react";
import { CustomContainer, TextButton } from "../../../components";
import { Ellipsis } from "lucide-react";

const DynamicProgressBar = ({ segments = [], legend = false }) => {
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [animating, setAnimating] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const [initializing, setInitializing] = useState(true);

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

    // Initial loading animation
    useEffect(() => {
        // Show container frame first
        const containerDelay = setTimeout(() => {
            setLoaded(true);
        }, 100);
        
        // After loading, start the continuous animations
        // Use a longer delay to ensure all entrance animations complete first
        const startAnimations = setTimeout(() => {
            setInitializing(false);
        }, 2800);
        
        return () => {
            clearTimeout(containerDelay);
            clearTimeout(startAnimations);
        };
    }, []);

    // Animation control effect
    useEffect(() => {
        // Keep animation going by default, but allow it to be turned off
        const timer = setTimeout(() => {
            setAnimating(prev => prev);
        }, 2000);
        
        return () => clearTimeout(timer);
    }, [animating]);

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
                style={{
                    transform: loaded ? "scaleY(1)" : "scaleY(0.5)",
                    opacity: loaded ? 1 : 0,
                    transition: "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease",
                    transitionDelay: "0.1s",
                    transformOrigin: "bottom"
                }}
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
                                transition: "transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.8s ease",
                                transform: loaded ? "scaleX(1)" : "scaleX(0)",
                                transformOrigin: "left",
                                opacity: loaded ? 1 : 0,
                                transitionDelay: `${index * 0.15}s`,
                                animation: !initializing && animating ? "pulse 2s infinite" : "none"
                            }}
                        >
                            {/* Shimmer animation overlay */}
                            <div 
                                className="absolute inset-0 z-0"
                                style={{
                                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                                    animation: !initializing && animating ? "shimmer 2s infinite" : "none",
                                    backgroundSize: "200% 100%",
                                    opacity: initializing ? 0 : 1,
                                    transition: "opacity 0.5s ease"
                                }}
                            />
                            
                            {/* Container for lines with proper spacing */}
                            <div
                                className="flex items-center gap-0.5 h-5 z-10 relative"
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
                                                animation: !initializing && animating ? 
                                                    `lineAnimation 1.5s infinite ease-in-out ${lineIndex * 0.05}s` : 
                                                    initializing ? `growIn 1.2s forwards ${lineIndex * 0.04 + index * 0.15 + 0.1}s` : "none",
                                                opacity: initializing ? 0 : 0.9,
                                            }}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    );
                })}
                
                {/* Loading bar animation overlaid on segments */}
                <div 
                    className="absolute top-0 left-0 h-full w-full"
                    style={{
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                        backgroundSize: "50% 100%",
                        animation: !initializing && animating ? "progressAnimation 1.5s infinite linear" : "none",
                        zIndex: 5,
                        pointerEvents: "none",
                        opacity: initializing ? 0 : 1,
                        transition: "opacity 0.5s ease"
                    }}
                />
            </div>

            {/* Progress Labels */}
            <div className="flex justify-between text-sm text-gray-600 font-medium"
                style={{
                        opacity: loaded ? 1 : 0,
                        transform: loaded ? "translateY(0)" : "translateY(5px)",
                        transition: "opacity 0.8s ease, transform 0.8s ease",
                        transitionDelay: "0.6s"
                    }}>
                <span>0%</span>
                <span>100%</span>
            </div>

            {/* Segment Labels (Optional) */}
            {segments.length > 0 && legend && (
                <div className="mt-3 flex flex-wrap gap-2"
                    style={{
                        opacity: loaded ? 1 : 0,
                        transform: loaded ? "translateY(0)" : "translateY(10px)",
                        transition: "opacity 0.8s ease, transform 0.8s ease",
                        transitionDelay: "0.5s"
                    }}>
                    {processedSegments.map((segment, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                            <div
                                className="w-3 h-3 rounded-sm"
                                style={{ 
                                    backgroundColor: segment.color,
                                    animation: !initializing && animating ? "pulseSmall 2s infinite" : 
                                        initializing ? "fadeIn 0.5s forwards" : "none",
                                    opacity: initializing ? 0 : 1
                                }}
                            />
                            <span className="text-xs text-gray-600">
                                {segment.label || `Segment ${index + 1}`} (
                                {segment.width}%)
                            </span>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Animation keyframes added as style block */}
            <style jsx>{`
                @keyframes pulse {
                    0% { opacity: 0.9; }
                    50% { opacity: 1; }
                    100% { opacity: 0.9; }
                }
                
                @keyframes pulseSmall {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
                
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                
                @keyframes progressAnimation {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                
                @keyframes lineAnimation {
                    0% { height: 12px; }
                    50% { height: 16px; }
                    100% { height: 12px; }
                }
                
                @keyframes fadeIn {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                
                @keyframes growIn {
                    from { 
                        opacity: 0;
                        height: 0;
                        transform: scaleY(0);
                    }
                    30% {
                        opacity: 0.5;
                    }
                    to { 
                        opacity: 0.9;
                        height: 16px;
                        transform: scaleY(1);
                    }
                }
            `}</style>
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
                        className="!p-0 !w-8 !h-8 !rounded-full flex flex-row !gap-0 items-center !justify-center"
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
