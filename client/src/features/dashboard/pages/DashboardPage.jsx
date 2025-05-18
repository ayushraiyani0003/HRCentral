import React, { useState, useRef, useEffect } from "react";
import {
    BarChartCard,
    GoalsCard,
    StatCards,
    TaskCard,
    TaskPanel,
    RecruiteeListCard,
    EmploymentStatusCard,
} from "../components/";
import { CustomBarChart } from "../../../components";

function DashboardPage() {
    const data = [
        {
            date: "26-03-2025",
            todayTotalEmployees: 115,
            newJoined: 1,
            resigned: 0,
            jobApplicants: 10,
        },
        {
            date: "27-03-2025",
            todayTotalEmployees: 116,
            newJoined: 1,
            resigned: 0,
            jobApplicants: 12,
        },
    ];

    const [employeeData] = useState([
        { name: "Jan", payable: 1200, overtime: 300, expense: 250 },
        { name: "Feb", payable: 1500, overtime: 200, expense: 400 },
        { name: "Mar", payable: 1100, overtime: 400, expense: 300 },
        { name: "Apr", payable: 1300, overtime: 150, expense: 350 },
        { name: "May", payable: 1400, overtime: 250, expense: 200 },
        { name: "Jun", payable: 1600, overtime: 100, expense: 500 },
        { name: "Jul", payable: 1250, overtime: 350, expense: 280 },
        { name: "Aug", payable: 1550, overtime: 220, expense: 320 },
        { name: "Sup", payable: 1350, overtime: 180, expense: 400 },
        { name: "Act", payable: 1450, overtime: 270, expense: 330 },
        { name: "Nov", payable: 1200, overtime: 310, expense: 210 },
        { name: "Dec", payable: 1500, overtime: 230, expense: 390 },
    ]);

    // Custom tooltip formatter
    const tooltipFormatter = (value) => {
        switch (unitType) {
            case "currency":
                return `$${value.toLocaleString()}`;
            case "percent":
                return `${value}%`;
            default:
                return value;
        }
    };

    const customColors = [
        "#4A90E2", // calm blue
        "#50E3C2", // soft teal
        "#F5A623", // warm golden orange
    ];

    const depTooltipFormatter = (value) => {
        switch (attnunitType) {
            case "currency":
                return `$${value.toLocaleString()}`;
            case "percent":
                return `${value}%`;
            default:
                return value;
        }
    };

    const [attendanceData] = useState([
        { department: "HR", present: 85 },
        { department: "Engineering", present: 92 },
        { department: "Sales", present: 78 },
        { department: "Marketing", present: 88 },
        { department: "Finance", present: 90 },
        { department: "Legal", present: 83 },
        { department: "Operations", present: 87 },
        { department: "Customer Service", present: 80 },
        { department: "IT Support", present: 91 },
        { department: "R&D", present: 86 },
        { department: "QA", present: 89 },
        { department: "Procurement", present: 82 },
        { department: "Administration", present: 84 },
        { department: "Security", present: 93 },
        { department: "Training", present: 79 },
        { department: "Product", present: 88 },
        { department: "Logistics", present: 81 },
        { department: "Compliance", present: 90 },
        { department: "Strategy", present: 85 },
        { department: "Business Intelligence", present: 94 },
    ]);

    // Example of different unit types
    const [unitType] = useState("currency");
    const [attnunitType] = useState("percent");

    // Legend position state
    const [legendPosition] = useState("topright");

    // Chart orientation
    const [layout] = useState("horizontal");

    // Bar styling
    const [roundedBars] = useState(true);

    // Long press drag and drop state
    const [draggedItem, setDraggedItem] = useState(null);
    const [draggedFromZone, setDraggedFromZone] = useState(null);
    const [isLongPress, setIsLongPress] = useState(false);
    const [pressTimer, setPressTimer] = useState(null);
    const [dragStarted, setDragStarted] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [hoveredZone, setHoveredZone] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // Dashboard layout state - you can customize this initial layout
    const [dashboardLayout, setDashboardLayout] = useState({
        main: ["stats", "attendanceChart", "salaryChart", "recruiteeList"],
        sidebar: ["tasks", "goals", "employmentStatus"],
        bottomZone1: [],
        bottomZone2: [],
        bottomZone3: [],
        bottomZone4: [],
        bottomZone5: [],
        bottomZone6: [],
    });

    // Reference to keep track of which element the drag started from
    const dragHandleRef = useRef(null);

    // Component definitions
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
                    unitType={"percent"}
                    customColors={customColors}
                    legendPosition={legendPosition}
                    layout={layout}
                    roundedBars={roundedBars}
                    tooltipFormatter={depTooltipFormatter}
                    keys={["present", "absent"]}
                    xAxisLabel={"department"}
                    labelKey={"department"}
                    yDomain={[0, 120]}
                    chartTitle={"Attendance"}
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
                    xAxisLabel={"Employees"}
                    labelKey={"name"}
                    yDomain={[0, "auto"]}
                    chartTitle={"Employee Salary"}
                    unitSymbol={"₹"}
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
    };

    // Mouse tracking for drag and drop
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isLongPress) {
                setMousePosition({ x: e.clientX, y: e.clientY });

                // Find the drop zone under the mouse
                const elementUnderMouse = document.elementFromPoint(
                    e.clientX,
                    e.clientY
                );
                const dropZone = elementUnderMouse?.closest("[data-drop-zone]");

                if (dropZone) {
                    const zoneName = dropZone.getAttribute("data-drop-zone");
                    setHoveredZone(zoneName);
                } else {
                    setHoveredZone(null);
                }
            }
        };

        const handleGlobalMouseUp = (e) => {
            // If we're in drag mode and mouse is released, handle the drop
            if (isLongPress && draggedItem && hoveredZone) {
                handleDrop(hoveredZone);
            }

            // Reset all states
            if (pressTimer) {
                clearTimeout(pressTimer);
                setPressTimer(null);
            }

            setIsLongPress(false);
            setDraggedItem(null);
            setDraggedFromZone(null);
            setDragStarted(false);
            setHoveredZone(null);
        };

        if (isLongPress) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleGlobalMouseUp);
            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleGlobalMouseUp);
            };
        } else {
            document.addEventListener("mouseup", handleGlobalMouseUp);
            return () => {
                document.removeEventListener("mouseup", handleGlobalMouseUp);
            };
        }
    }, [isLongPress, draggedItem, hoveredZone, pressTimer]);

    // Long Press Handlers - Now only applied to the drag handles
    const handleDragHandleMouseDown = (e, componentId, fromZone) => {
        if (e.button === 0) {
            // Left click only
            e.preventDefault();
            e.stopPropagation(); // Prevent event from bubbling to component

            // Set the current drag handle ref
            dragHandleRef.current = e.currentTarget;

            // Calculate offset from mouse to component corner
            const componentRect = e.currentTarget
                .closest(".draggable-component")
                .getBoundingClientRect();
            setDragOffset({
                x: e.clientX - componentRect.left,
                y: e.clientY - componentRect.top,
            });

            // Start long press timer
            const timer = setTimeout(() => {
                setIsLongPress(true);
                setDraggedItem(componentId);
                setDraggedFromZone(fromZone);
                setDragStarted(true);
                setMousePosition({ x: e.clientX, y: e.clientY });

                // Add visual feedback for long press activation
                navigator.vibrate && navigator.vibrate(100); // Vibrate on mobile if supported
            }, 1000); // 1 second long press

            setPressTimer(timer);
        }
    };

    const handleDragHandleMouseUp = (e) => {
        // Only handle events from the same element that started the drag
        if (dragHandleRef.current === e.currentTarget) {
            // Clear the timer if mouse is released before long press completes
            if (pressTimer) {
                clearTimeout(pressTimer);
                setPressTimer(null);
            }
        }
    };

    const handleDragHandleMouseLeave = (e) => {
        // Only handle events from the same element that started the drag
        if (dragHandleRef.current === e.currentTarget) {
            // Clear timer if mouse leaves the drag handle
            if (pressTimer) {
                clearTimeout(pressTimer);
                setPressTimer(null);
            }
        }
    };

    const handleDrop = (toZone) => {
        if (!draggedItem || !draggedFromZone || draggedFromZone === toZone)
            return;

        setDashboardLayout((prev) => {
            const newLayout = { ...prev };

            // Remove from original zone
            newLayout[draggedFromZone] = newLayout[draggedFromZone].filter(
                (item) => item !== draggedItem
            );

            // Add to new zone
            newLayout[toZone] = [...newLayout[toZone], draggedItem];

            return newLayout;
        });
    };

    // Prevent text selection while dragging
    useEffect(() => {
        if (isLongPress) {
            document.body.style.userSelect = "none";
            document.body.style.cursor = "grabbing";
        } else {
            document.body.style.userSelect = "";
            document.body.style.cursor = "";
        }

        return () => {
            document.body.style.userSelect = "";
            document.body.style.cursor = "";
        };
    }, [isLongPress]);

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
                    width: "300px", // Fixed width for floating component
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

                {console.log(!children, "zone name", zoneName)}
                {/* Zone content */}
                <div className={isHovered ? "opacity-30" : ""}>
                    {children.length === 0 &&
                    isLongPress &&
                    draggedItem &&
                    !isHovered ? (
                        <div className="flex items-center justify-center h-24 text-blue-600 font-medium">
                            Release to drop component here
                        </div>
                    ) : children.length === 0 || !children ? (
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
                    {/* Stats Area */}
                    <DropZone zoneName="main" className="w-full">
                        {dashboardLayout.main.includes("stats") && (
                            <DraggableWrapper
                                componentId="stats"
                                fromZone="main"
                                className="w-full"
                            >
                                {components["stats"].component}
                            </DraggableWrapper>
                        )}
                    </DropZone>

                    {/* Charts Area */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <DropZone zoneName="main" className="w-full h-full">
                                {dashboardLayout.main.includes(
                                    "attendanceChart"
                                ) && (
                                    <DraggableWrapper
                                        componentId="attendanceChart"
                                        fromZone="main"
                                        className="w-full"
                                    >
                                        {
                                            components["attendanceChart"]
                                                .component
                                        }
                                    </DraggableWrapper>
                                )}
                            </DropZone>
                        </div>

                        <div>
                            <DropZone zoneName="main" className="w-full h-full">
                                {dashboardLayout.main.includes(
                                    "salaryChart"
                                ) && (
                                    <DraggableWrapper
                                        componentId="salaryChart"
                                        fromZone="main"
                                        className="w-full"
                                    >
                                        {components["salaryChart"].component}
                                    </DraggableWrapper>
                                )}
                            </DropZone>
                        </div>

                        <div>
                            <DropZone zoneName="main" className="w-full h-full">
                                {dashboardLayout.main.includes(
                                    "recruiteeList"
                                ) && (
                                    <DraggableWrapper
                                        componentId="recruiteeList"
                                        fromZone="main"
                                        className="w-full"
                                    >
                                        {components["recruiteeList"].component}
                                    </DraggableWrapper>
                                )}
                            </DropZone>
                        </div>
                    </div>
                </div>

                {/* Sidebar Area */}
                <div className="w-full md:w-1/3 lg:w-1/4 mt-3 md:mt-0 overflow-hidden">
                    <div className="flex flex-col gap-3">
                        <DropZone zoneName="sidebar" className="w-full h-full">
                            {dashboardLayout.sidebar.includes(
                                "employmentStatus"
                            ) && (
                                <DraggableWrapper
                                    key={"employmentStatus"}
                                    componentId={"employmentStatus"}
                                    fromZone="sidebar"
                                    className="w-full h-full"
                                >
                                    {components["employmentStatus"].component}
                                </DraggableWrapper>
                            )}
                        </DropZone>
                        <DropZone zoneName="sidebar" className="w-full h-full">
                            {dashboardLayout.sidebar.includes("tasks") && (
                                <DraggableWrapper
                                    key={"tasks"}
                                    componentId={"tasks"}
                                    fromZone="sidebar"
                                    className="w-full h-full"
                                >
                                    {components["tasks"].component}
                                </DraggableWrapper>
                            )}
                        </DropZone>

                        <DropZone zoneName="sidebar" className="w-full h-full">
                            {dashboardLayout.sidebar.includes("goals") && (
                                <DraggableWrapper
                                    key={"goals"}
                                    componentId={"goals"}
                                    fromZone="sidebar"
                                    className="w-full h-full"
                                >
                                    {components["goals"].component}
                                </DraggableWrapper>
                            )}
                        </DropZone>
                    </div>
                </div>
            </div>

            {/* Additional Drop Zones */}
            <div className="w-full space-y-6">
                <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">
                        Additional Widget Areas
                    </h3>

                    {/* Top Row - 3 columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <DropZone zoneName="bottomZone1" className="col-span-1">
                            {dashboardLayout.bottomZone1.map((componentId) => (
                                <DraggableWrapper
                                    key={componentId}
                                    componentId={componentId}
                                    fromZone="bottomZone1"
                                    className="w-full mb-3 last:mb-0"
                                >
                                    {components[componentId].component}
                                </DraggableWrapper>
                            ))}
                        </DropZone>
                        <DropZone zoneName="bottomZone2" className="col-span-1">
                            {dashboardLayout.bottomZone2.map((componentId) => (
                                <DraggableWrapper
                                    key={componentId}
                                    componentId={componentId}
                                    fromZone="bottomZone2"
                                    className="w-full mb-3 last:mb-0"
                                >
                                    {components[componentId].component}
                                </DraggableWrapper>
                            ))}
                        </DropZone>
                        <DropZone zoneName="bottomZone3" className="col-span-1">
                            {dashboardLayout.bottomZone3.map((componentId) => (
                                <DraggableWrapper
                                    key={componentId}
                                    componentId={componentId}
                                    fromZone="bottomZone3"
                                    className="w-full mb-3 last:mb-0"
                                >
                                    {components[componentId].component}
                                </DraggableWrapper>
                            ))}
                        </DropZone>
                    </div>

                    {/* Middle Row - 2 columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <DropZone zoneName="bottomZone4" className="col-span-1">
                            {dashboardLayout.bottomZone4.map((componentId) => (
                                <DraggableWrapper
                                    key={componentId}
                                    componentId={componentId}
                                    fromZone="bottomZone4"
                                    className="w-full mb-3 last:mb-0"
                                >
                                    {components[componentId].component}
                                </DraggableWrapper>
                            ))}
                        </DropZone>
                        <DropZone zoneName="bottomZone5" className="col-span-1">
                            {dashboardLayout.bottomZone5.map((componentId) => (
                                <DraggableWrapper
                                    key={componentId}
                                    componentId={componentId}
                                    fromZone="bottomZone5"
                                    className="w-full mb-3 last:mb-0"
                                >
                                    {components[componentId].component}
                                </DraggableWrapper>
                            ))}
                        </DropZone>
                    </div>

                    {/* Bottom Row - 1 full width column */}
                    <div className="grid grid-cols-1 gap-4">
                        <DropZone zoneName="bottomZone6" className="col-span-1">
                            {dashboardLayout.bottomZone6.map((componentId) => (
                                <DraggableWrapper
                                    key={componentId}
                                    componentId={componentId}
                                    fromZone="bottomZone6"
                                    className="w-full mb-3 last:mb-0"
                                >
                                    {components[componentId].component}
                                </DraggableWrapper>
                            ))}
                        </DropZone>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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
        </div>
    );
}

export default DashboardPage;
