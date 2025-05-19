import React from "react";
import {
    BarChartCard,
    GoalsCard,
    StatCards,
    TaskCard,
    TaskPanel,
    RecruiteeListCard,
    EmploymentStatusCard,
    InterviewVsHiredCard,
    HiringStatusCard,
    FloatingActionButton,
} from "../components";
import { CustomBarChart } from "../../../components";
import useEmployeeDashboardData from "../hooks/useDashboardHook";
import useDragComponent from "../hooks/useDragComponentHook";

function DashboardPage() {
    //custom hooks for dashboard data
    const {
        data,
        employeeData,
        attendanceData,
        unitType,
        legendPosition,
        layout,
        roundedBars,
        tooltipFormatter,
        depTooltipFormatter,
        customColors,
        dashboardLayout,
        setDashboardLayout,
    } = useEmployeeDashboardData();

    const {
        draggedItem,
        dragOffset,
        mousePosition,
        isLongPress,
        pressTimer,
        hoveredZone,
        handleDragHandleMouseDown,
        handleDragHandleMouseUp,
        handleDragHandleMouseLeave,
    } = useDragComponent({
        setDashboardLayout,
        data,
        attendanceData,
        employeeData,
        unitType,
        customColors,
        legendPosition,
        layout,
        roundedBars,
        tooltipFormatter,
        depTooltipFormatter,
    });

    const components = {
        stats: {
            id: "stats",
            name: "Statistics Cards",
            component: (
                <StatCards
                    className="w-full h-full !m-0 !shadow-none"
                    employeesTrack={data}
                    yesterdayAttendance={600}
                />
            ),
        },
        attendanceChart: {
            id: "attendance-chart",
            name: "Attendance Chart",
            component: (
                <BarChartCard
                    employeeData={attendanceData}
                    unitType="percent"
                    customColors={customColors}
                    legendPosition={legendPosition}
                    layout={layout}
                    roundedBars={roundedBars}
                    tooltipFormatter={depTooltipFormatter}
                    keys={["present", "absent"]}
                    xAxisLabel="department"
                    labelKey="department"
                    yDomain={[0, 120]}
                    chartTitle="Attendance"
                />
            ),
        },
        salaryChart: {
            id: "salary-chart",
            name: "Salary Chart",
            component: (
                <BarChartCard
                    employeeData={employeeData}
                    unitType={unitType}
                    customColors={customColors}
                    legendPosition={legendPosition}
                    layout={layout}
                    roundedBars={roundedBars}
                    tooltipFormatter={tooltipFormatter}
                    keys={["payable", "overtime", "expense"]}
                    xAxisLabel="Employees"
                    labelKey="name"
                    yDomain={[0, "auto"]}
                    chartTitle="Employee Salary"
                    unitSymbol="₹"
                />
            ),
        },
        tasks: {
            id: "tasks",
            name: "Task Card",
            component: <TaskCard className="w-full h-full" />,
        },
        goals: {
            id: "goals",
            name: "My Goals",
            component: <GoalsCard className="w-full h-full" />,
        },
        recruiteeList: {
            id: "RecruiteeList",
            name: "Recruitee List",
            component: (
                <RecruiteeListCard className="w-full h-full !max-h-[490px]" />
            ),
        },
        employmentStatus: {
            id: "employmentStatus",
            name: "Employment Status",
            component: (
                <EmploymentStatusCard className="w-full h-full !m-0 !max-h-[300px]" />
            ),
        },
        interviewVsHired: {
            id: "interviewVsHired",
            name: "Interview Vs Hired",
            component: (
                <InterviewVsHiredCard className="w-full h-full !m-0 !max-h-[490px]" />
            ),
        },
        hiringStatus: {
            id: "hiringStatus",
            name: "Hiring Status",
            component: (
                <HiringStatusCard className="w-full h-full !m-0 !max-h-[490px]" />
            ),
        },
    };

    // Helper function to get zones to display - ensures minimum number of zones are shown
    const getZonesToDisplay = (prefix, totalCount, minToShow) => {
        const zones = [];

        // First, collect all non-empty zones
        for (let i = 1; i <= totalCount; i++) {
            const zoneName = `${prefix}${i}`;
            if (
                dashboardLayout[zoneName] &&
                dashboardLayout[zoneName].length > 0
            ) {
                zones.push(zoneName);
            }
        }

        // If we have fewer zones than the minimum required, add empty zones
        if (zones.length < minToShow) {
            // Find the next available empty zones
            for (let i = 1; i <= totalCount && zones.length < minToShow; i++) {
                const zoneName = `${prefix}${i}`;
                if (!zones.includes(zoneName)) {
                    zones.push(zoneName);
                }
            }
        }

        // Sort zones to maintain proper order (main1, main2, etc.)
        zones.sort((a, b) => {
            const numA = parseInt(a.replace(prefix, ""));
            const numB = parseInt(b.replace(prefix, ""));
            return numA - numB;
        });

        return zones;
    };

    // Get zones to display with minimum requirements
    const mainZones = getZonesToDisplay("main", 7, 7); // At least 3 main zones
    const sidebarZones = getZonesToDisplay("sidebar", 5, 4); // At least 2 sidebar zones
    const bottomZones = getZonesToDisplay("bottomZone", 6, 3); // No minimum for bottom zones

    // Draggable Component Wrapper
    const DraggableWrapper = ({
        children,
        componentId,
        fromZone,
        className = "",
    }) => (
        <div
            className={`${className} ${
                isLongPress && draggedItem === componentId
                    ? "opacity-30"
                    : "transition-all duration-200"
            } draggable-component select-none relative`}
            style={{
                // Hide the original when dragging
                visibility:
                    isLongPress && draggedItem === componentId
                        ? "hidden"
                        : "visible",
            }}
        >
            {/* Drag handle - only this element triggers the drag events */}
            <div
                className="absolute top-2 right-2 w-6 h-6 bg-gray-300 hover:bg-blue-500 rounded-full 
                          flex items-center justify-center z-10 cursor-move transition-colors opacity-60 hover:opacity-100"
                onMouseDown={(e) =>
                    handleDragHandleMouseDown(e, componentId, fromZone)
                }
                onMouseUp={handleDragHandleMouseUp}
                onMouseLeave={handleDragHandleMouseLeave}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                </svg>
            </div>

            {/* Visual indicator for long press in progress */}
            {pressTimer && draggedItem === componentId && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center z-20">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
            )}

            {/* Actual component content - click events here won't interfere with drag */}
            {children}
        </div>
    );

    // Floating dragged component
    const FloatingComponent = () => {
        if (!isLongPress || !draggedItem) return null;

        return (
            <div
                className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                    left: mousePosition.x - dragOffset.x / 2,
                    top: mousePosition.y - dragOffset.y / 2,
                    width: "500px", // Fixed width for floating component
                    opacity: 0.9,
                }}
            >
                <div className="bg-white rounded-lg shadow-2xl border-2 border-blue-400 p-2 transform scale-75">
                    {React.cloneElement(components[draggedItem].component, {
                        className: "w-full h-full !m-0 !shadow-none",
                    })}
                </div>
            </div>
        );
    };

    // Drop Zone Component with Preview
    const DropZone = ({ zoneName, children, className = "" }) => {
        const isHovered =
            hoveredZone === zoneName && isLongPress && draggedItem;

        // Check if the zone is empty
        const isEmpty =
            !dashboardLayout[zoneName] ||
            dashboardLayout[zoneName].length === 0;

        return (
            <div
                className={`${className} min-h-24 border-2 border-dashed rounded-lg transition-all duration-200 relative ${
                    isHovered
                        ? "border-green-400 bg-green-50 scale-102"
                        : isLongPress && draggedItem
                        ? "border-blue-400 bg-blue-50"
                        : isEmpty
                        ? "border-gray-400 bg-gray-50" // Style for empty zones
                        : "border-gray-300"
                }`}
                data-drop-zone={zoneName}
            >
                {/* Preview of dragged component when hovering */}
                {isHovered && (
                    <div className="absolute inset-2 bg-white rounded border-2 border-green-300 opacity-75 flex items-center justify-center">
                        <div className="transform scale-50 pointer-events-none">
                            {React.cloneElement(
                                components[draggedItem].component,
                                {
                                    className:
                                        "w-full h-full !m-0 !shadow-none",
                                }
                            )}
                        </div>
                        <div className="absolute inset-0 bg-green-100 bg-opacity-50 rounded flex items-center justify-center">
                            <span className="text-green-700 font-bold text-lg">
                                Drop to place here
                            </span>
                        </div>
                    </div>
                )}

                {/* Zone content */}
                <div className={isHovered ? "opacity-30" : ""}>
                    {isEmpty && isLongPress && draggedItem && !isHovered ? (
                        <div className="flex items-center justify-center h-24 text-blue-600 font-medium">
                            Release to drop component here
                        </div>
                    ) : isEmpty ? (
                        <div className="flex items-center justify-center h-24 text-gray-400">
                            <div className="text-center">
                                <div className="text-lg mb-1">📦</div>
                                <div className="text-sm">
                                    Empty zone - Drag components here
                                </div>
                                <div className="text-xs text-gray-300 mt-1">
                                    {zoneName}
                                </div>
                            </div>
                        </div>
                    ) : (
                        children
                    )}
                </div>
            </div>
        );
    };

    // Render components for a specific zone
    const renderZoneComponents = (zoneName) => {
        if (
            !dashboardLayout[zoneName] ||
            dashboardLayout[zoneName].length === 0
        ) {
            return [];
        }

        return dashboardLayout[zoneName].map((componentId) => {
            if (!components[componentId]) return null;

            return (
                <DraggableWrapper
                    key={componentId}
                    componentId={componentId}
                    fromZone={zoneName}
                    className="w-full mb-3 last:mb-0"
                >
                    {components[componentId].component}
                </DraggableWrapper>
            );
        });
    };

    return (
        <div className="w-full p-0">
            {/* Floating component that follows mouse */}
            <FloatingComponent />

            {/* Instructions */}
            {isLongPress && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-40">
                    Drag mode active - Hover over zones to preview, release to
                    drop
                </div>
            )}

            {/* Main Dashboard Area */}
            <div className="w-full flex flex-col md:flex-row gap-3 mb-6">
                <div className="w-full md:w-2/3 lg:w-3/4 gap-3 flex flex-col">
                    {/* Stats Area - Main1 */}
                    <DropZone zoneName="main1" className="w-full">
                        {renderZoneComponents("main1")}
                    </DropZone>

                    {/* Charts Area - Show at least 6 main zones */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {mainZones.slice(1).map((zoneName) => (
                            <div
                                key={zoneName}
                                className="w-full h-full relative"
                            >
                                <DropZone
                                    zoneName={zoneName}
                                    className="w-full h-full"
                                >
                                    {renderZoneComponents(zoneName)}
                                </DropZone>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Area - Show at least 5 sidebar zones */}
                <div className="w-full md:w-1/3 lg:w-1/4 mt-3 md:mt-0 overflow-hidden">
                    <div className="flex flex-col gap-3">
                        {sidebarZones.map((zoneName) => (
                            <DropZone
                                key={zoneName}
                                zoneName={zoneName}
                                className="w-full h-full"
                            >
                                {renderZoneComponents(zoneName)}
                            </DropZone>
                        ))}
                    </div>
                </div>
            </div>

            {/* Additional Drop Zones */}
            {bottomZones.length > 0 && (
                <div className="w-full space-y-6">
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">
                            Additional Widget Areas
                        </h3>

                        {/* Top Row - 3 columns */}
                        {bottomZones.slice(0, 3).length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                {bottomZones.slice(0, 3).map((zoneName) => (
                                    <DropZone
                                        key={zoneName}
                                        zoneName={zoneName}
                                        className="col-span-1"
                                    >
                                        {renderZoneComponents(zoneName)}
                                    </DropZone>
                                ))}
                            </div>
                        )}

                        {/* Middle Row - 2 columns */}
                        {bottomZones.slice(3, 5).length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {bottomZones.slice(3, 5).map((zoneName) => (
                                    <DropZone
                                        key={zoneName}
                                        zoneName={zoneName}
                                        className="col-span-1"
                                    >
                                        {renderZoneComponents(zoneName)}
                                    </DropZone>
                                ))}
                            </div>
                        )}

                        {/* Bottom Row - 1 full width column */}
                        {bottomZones.slice(5, 6).length > 0 && (
                            <div className="grid grid-cols-1 gap-4">
                                {bottomZones.slice(5, 6).map((zoneName) => (
                                    <DropZone
                                        key={zoneName}
                                        zoneName={zoneName}
                                        className="col-span-1"
                                    >
                                        {renderZoneComponents(zoneName)}
                                    </DropZone>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-blue-800 mb-2">
                    How to use:
                </h4>
                <ul className="text-blue-700 text-sm space-y-1">
                    <li>
                        • Look for the drag handle icon (⠇) at the top-right of
                        each component
                    </li>
                    <li>
                        • Press and hold (1 second) on the handle to enter drag
                        mode
                    </li>
                    <li>
                        • The component will follow your mouse cursor as you
                        move
                    </li>
                    <li>
                        • Hover over any drop zone to see a preview of the
                        component placement
                    </li>
                    <li>
                        • Release the mouse button while hovering over a zone to
                        drop the component
                    </li>
                    <li>
                        • Drop zones turn green when hovered during drag mode
                    </li>
                    <li>
                        • Empty zones are clearly marked and ready to receive
                        components
                    </li>
                </ul>
            </div>

            {/* in thid disply the one floating button in the bottom right corner, and open transperent option list bottom to top, and only icon button with rounde circle is disply and on hover that button use can and name is display.  this floating button always top of all elements, and fixed in thair position.*/}
            <FloatingActionButton />
        </div>
    );
}

export default DashboardPage;
