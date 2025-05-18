import React, { useState } from "react";
import { ArrowRight, CheckCircle, Clock } from "lucide-react"; // or any other icon lib
import { TextButton, CustomContainer } from "../../../components";
import { TaskPanel } from "../components";
import "./TaskCard.css";

function TaskCard({ className = "" }) {
    const [panels, setPanels] = useState({
        right: false,
        left: false,
        top: false,
        bottom: false,
    });

    const togglePanel = (direction) => {
        console.log("Toggle panel:", direction);
        setPanels((prev) => ({
            ...prev,
            [direction]: !prev[direction],
        }));
    };

    const [tasks, setTasks] = useState([
        {
            id: 1,
            title: "Complete project proposal",
            completed: false,
            priority: "High",
            dueDate: "2025-05-20",
        },
        {
            id: 2,
            title: "Review team presentations",
            completed: false,
            priority: "Medium",
            dueDate: "2025-05-18",
        },
        {
            id: 3,
            title: "Schedule client meeting",
            completed: true,
            priority: "High",
            dueDate: "2025-05-15",
        },
        {
            id: 4,
            title: "Update documentation",
            completed: false,
            priority: "Low",
            dueDate: "2025-05-25",
        },
        {
            id: 5,
            title: "Prepare quarterly report",
            completed: true,
            priority: "Medium",
            dueDate: "2025-05-14",
        },
        {
            id: 6,
            title: "Organize team building event",
            completed: false,
            priority: "Low",
            dueDate: "2025-06-01",
        },
        {
            id: 7,
            title: "Analyze market trends",
            completed: false,
            priority: "High",
            dueDate: "2025-05-22",
        },
        {
            id: 8,
            title: "Update software licenses",
            completed: false,
            priority: "Medium",
            dueDate: "2025-05-30",
        },
        {
            id: 9,
            title: "Conduct performance reviews",
            completed: false,
            priority: "High",
            dueDate: "2025-05-28",
        },
        {
            id: 10,
            title: "Plan marketing campaign",
            completed: true,
            priority: "Medium",
            dueDate: "2025-05-10",
        },
        {
            id: 11,
            title: "Review financial statements",
            completed: false,
            priority: "High",
            dueDate: "2025-05-26",
        },
        {
            id: 12,
            title: "Fix website bugs",
            completed: false,
            priority: "Medium",
            dueDate: "2025-05-21",
        },
        {
            id: 13,
            title: "Prepare training materials",
            completed: false,
            priority: "Low",
            dueDate: "2025-06-05",
        },
        {
            id: 14,
            title: "Client feedback follow-up",
            completed: true,
            priority: "High",
            dueDate: "2025-05-12",
        },
        {
            id: 15,
            title: "Update security protocols",
            completed: false,
            priority: "Medium",
            dueDate: "2025-05-27",
        },
        {
            id: 16,
            title: "Backup server data",
            completed: true,
            priority: "Low",
            dueDate: "2025-05-13",
        },
        {
            id: 17,
            title: "Conduct competitor analysis",
            completed: false,
            priority: "High",
            dueDate: "2025-05-24",
        },
        {
            id: 18,
            title: "Draft press release",
            completed: false,
            priority: "Medium",
            dueDate: "2025-05-29",
        },
        {
            id: 19,
            title: "Update employee handbook",
            completed: false,
            priority: "Low",
            dueDate: "2025-06-03",
        },
        {
            id: 20,
            title: "Plan office renovation",
            completed: false,
            priority: "Medium",
            dueDate: "2025-06-10",
        },
    ]);

    const handleTaskToggle = (id) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case "high":
                return "bg-red-100 text-red-700";
            case "medium":
                return "bg-yellow-100 text-yellow-700";
            case "low":
                return "bg-green-100 text-green-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Date().toDateString() === date.toDateString()
            ? "Today"
            : date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
              });
    };

    const pendingTasks = tasks.filter((task) => !task.completed);
    const completedTasks = tasks.filter((task) => task.completed);

    const containerClassName =
        (className ? className + " " : "") + "max-h-[100%] relative h-full !m-0";
    return (
        <>
            <CustomContainer
                className={containerClassName}
                title="My Tasks"
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
                    <TextButton
                        text="View"
                        onClick={() => togglePanel("right")}
                        icon={<ArrowRight size={16} />}
                        iconEnd={true}
                    />
                }
                headerBorder={true}
                elevation="medium"
                rounded="medium"
                padding="medium"
                overflowContent={false}
                isFixedFooter={false}
            >
                <div className="flex flex-col">
                    {/* Task List with fixed height and proper overflow */}
                    <div className="task-list custom-scrollbar divide-y divide-gray-200 overflow-y-auto mb-2 flex-grow max-h-96 pr-2">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className={`task-item py-3 flex items-center gap-3 ${
                                    task.completed ? "opacity-60" : ""
                                }`}
                            >
                                {/* Checkbox */}
                                <div className="flex-shrink-0">
                                    <label className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-300 cursor-pointer hover:bg-gray-100">
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() =>
                                                handleTaskToggle(task.id)
                                            }
                                            className="sr-only"
                                        />
                                        {task.completed && (
                                            <svg
                                                className="w-4 h-4 text-blue-500"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        )}
                                    </label>
                                </div>

                                {/* Task Title */}
                                <div className="flex-grow min-w-0">
                                    <p
                                        className={`font-medium truncate ${
                                            task.completed
                                                ? "line-through text-gray-500"
                                                : "text-gray-800"
                                        }`}
                                    >
                                        {task.title}
                                    </p>
                                </div>

                                {/* Priority */}
                                <div className="flex-shrink-0">
                                    <span
                                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                                            task.priority
                                        )}`}
                                    >
                                        {task.priority}
                                    </span>
                                </div>

                                {/* Due Date */}
                                <div className="flex-shrink-0 text-sm text-gray-500">
                                    {formatDate(task.dueDate)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Stats section - now properly positioned relative to the container */}
                    <div className="mt-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Pending Tasks Card */}
                            <div className="bg-blue-50 rounded-md p-3 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-300 transition-shadow duration-200">
                                <div className="flex items-center space-x-2">
                                    <div className="bg-blue-100 p-1.5 rounded-full">
                                        <Clock className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <span className="text-md font-semibold text-blue-600">
                                            {pendingTasks.length}
                                        </span>
                                        <p className="text-xs text-blue-700">
                                            Pending Tasks
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Completed Tasks Card */}
                            <div className="bg-green-50 rounded-md p-3 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-green-300 transition-shadow duration-200">
                                <div className="flex items-center space-x-2">
                                    <div className="bg-green-100 p-1.5 rounded-full">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                        <span className="text-md font-semibold text-green-600">
                                            {completedTasks.length}
                                        </span>
                                        <p className="text-xs text-green-700">
                                            Completed Tasks
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CustomContainer>
            <TaskPanel panels={panels} togglePanel={togglePanel} />
        </>
    );
}

export default TaskCard;
