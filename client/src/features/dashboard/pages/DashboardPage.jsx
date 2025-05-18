import React from "react";
import {
    BarChartCard,
    GoalsCard,
    StatCards,
    TaskCard,
    TaskPanel,
    RecruiteeListCard,
    EmploymentStatusCard,
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
            component: <RecruiteeListCard className="w-full h-full !max-h-[490px]" />,
        },
        employmentStatus: {
            id: "employmentStatus",
            name: "Employment Status",
            component: <EmploymentStatusCard className="w-full h-full !m-0 !max-h-[300px]" />,
        },
    };

    // Helper function to get all non-empty zones in order
    const getNonEmptyZones = (prefix, count) => {
        const zones = [];
        for (let i = 1; i <= count; i++) {
            const zoneName = `${prefix}${i}`;
            if (dashboardLayout[zoneName] && dashboardLayout[zoneName].length > 0) {
                zones.push(zoneName);
            }
        }
        return zones;
    };

    // Get occupied zones
    const mainZones = getNonEmptyZones("main", 6);
    const sidebarZones = getNonEmptyZones("sidebar", 5);
    const bottomZones = getNonEmptyZones("bottomZone", 6);

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

        return (
            <div
                className={`${className} min-h-24 border-2 border-dashed rounded-lg transition-all duration-200 relative ${
                    isHovered
                        ? "border-green-400 bg-green-50 scale-102"
                        : isLongPress && draggedItem
                        ? "border-blue-400 bg-blue-50"
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
                    {children.length === 0 &&
                    isLongPress &&
                    draggedItem &&
                    !isHovered ? (
                        <div className="flex items-center justify-center h-24 text-blue-600 font-medium">
                            Release to drop component here
                        </div>
                    ) : children.length === 0 ? (
                        <div className="flex items-center justify-center h-24 text-gray-400">
                            Empty zone - Use drag handle to move components here
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
        if (!dashboardLayout[zoneName] || dashboardLayout[zoneName].length === 0) {
            return null;
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
                    {mainZones.includes("main1") && (
                        <DropZone zoneName="main1" className="w-full">
                            {renderZoneComponents("main1")}
                        </DropZone>
                    )}

                    {/* Charts Area */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* First Chart - Main2 */}
                        {mainZones.includes("main2") && (
                            <div>
                                <DropZone zoneName="main2" className="w-full h-full">
                                    {renderZoneComponents("main2")}
                                </DropZone>
                            </div>
                        )}

                        {/* Second Chart - Main3 */}
                        {mainZones.includes("main3") && (
                            <div>
                                <DropZone zoneName="main3" className="w-full h-full">
                                    {renderZoneComponents("main3")}
                                </DropZone>
                            </div>
                        )}

                        {/* Third Chart - Main4 */}
                        {mainZones.includes("main4") && (
                            <div>
                                <DropZone zoneName="main4" className="w-full h-full">
                                    {renderZoneComponents("main4")}
                                </DropZone>
                            </div>
                        )}

                        {/* Fourth Chart - Main5 */}
                        {mainZones.includes("main5") && (
                            <div>
                                <DropZone zoneName="main5" className="w-full h-full">
                                    {renderZoneComponents("main5")}
                                </DropZone>
                            </div>
                        )}

                        {/* Fifth Chart - Main6 */}
                        {mainZones.includes("main6") && (
                            <div>
                                <DropZone zoneName="main6" className="w-full h-full">
                                    {renderZoneComponents("main6")}
                                </DropZone>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Area */}
                <div className="w-full md:w-1/3 lg:w-1/4 mt-3 md:mt-0 overflow-hidden">
                    <div className="flex flex-col gap-3">
                        {/* Sidebar1 */}
                        {sidebarZones.includes("sidebar1") && (
                            <DropZone zoneName="sidebar1" className="w-full h-full">
                                {renderZoneComponents("sidebar1")}
                            </DropZone>
                        )}
                        
                        {/* Sidebar2 */}
                        {sidebarZones.includes("sidebar2") && (
                            <DropZone zoneName="sidebar2" className="w-full h-full">
                                {renderZoneComponents("sidebar2")}
                            </DropZone>
                        )}
                        
                        {/* Sidebar3 */}
                        {sidebarZones.includes("sidebar3") && (
                            <DropZone zoneName="sidebar3" className="w-full h-full">
                                {renderZoneComponents("sidebar3")}
                            </DropZone>
                        )}
                        
                        {/* Sidebar4 */}
                        {sidebarZones.includes("sidebar4") && (
                            <DropZone zoneName="sidebar4" className="w-full h-full">
                                {renderZoneComponents("sidebar4")}
                            </DropZone>
                        )}
                        
                        {/* Sidebar5 */}
                        {sidebarZones.includes("sidebar5") && (
                            <DropZone zoneName="sidebar5" className="w-full h-full">
                                {renderZoneComponents("sidebar5")}
                            </DropZone>
                        )}
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {/* BottomZone1 */}
                            {bottomZones.includes("bottomZone1") && (
                                <DropZone zoneName="bottomZone1" className="col-span-1">
                                    {renderZoneComponents("bottomZone1")}
                                </DropZone>
                            )}
                            
                            {/* BottomZone2 */}
                            {bottomZones.includes("bottomZone2") && (
                                <DropZone zoneName="bottomZone2" className="col-span-1">
                                    {renderZoneComponents("bottomZone2")}
                                </DropZone>
                            )}
                            
                            {/* BottomZone3 */}
                            {bottomZones.includes("bottomZone3") && (
                                <DropZone zoneName="bottomZone3" className="col-span-1">
                                    {renderZoneComponents("bottomZone3")}
                                </DropZone>
                            )}
                        </div>

                        {/* Middle Row - 2 columns */}
                        {(bottomZones.includes("bottomZone4") || bottomZones.includes("bottomZone5")) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {/* BottomZone4 */}
                                {bottomZones.includes("bottomZone4") && (
                                    <DropZone zoneName="bottomZone4" className="col-span-1">
                                        {renderZoneComponents("bottomZone4")}
                                    </DropZone>
                                )}
                                
                                {/* BottomZone5 */}
                                {bottomZones.includes("bottomZone5") && (
                                    <DropZone zoneName="bottomZone5" className="col-span-1">
                                        {renderZoneComponents("bottomZone5")}
                                    </DropZone>
                                )}
                            </div>
                        )}

                        {/* Bottom Row - 1 full width column */}
                        {bottomZones.includes("bottomZone6") && (
                            <div className="grid grid-cols-1 gap-4">
                                <DropZone zoneName="bottomZone6" className="col-span-1">
                                    {renderZoneComponents("bottomZone6")}
                                </DropZone>
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
                        • Look for the drag handle icon (⠇) at the top-right
                        of each component
                    </li>
                    <li>
                        • Press and hold (1 second) on the handle to enter
                        drag mode
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
                        • Release the mouse button while hovering over a
                        zone to drop the component
                    </li>
                    <li>
                        • Drop zones turn green when hovered during drag
                        mode
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default DashboardPage;