import { useState } from "react";
import { ArrowRight, Clock, CheckCircle } from "lucide-react";
import { CustomContainer, TextButton } from "../../../components";

// This is the GoalCard component that displays goals with progress bars
const GoalsCard = ({ containerClassName = "!m-0" }) => {
    // Example goals data - replace with your actual data source
    const [goals, setGoals] = useState([
        {
            id: 1,
            title: "Complete Project Documentation",
            description: "Finish all technical documentation for Q2",
            progress: 75,
        },
        {
            id: 2,
            title: "Learn React Hooks",
            description: "Master useState, useEffect and custom hooks",
            progress: 60,
        },
    ]);

    // Function to toggle the panel state
    const togglePanel = (direction) => {
        // console.log("Toggle panel:", direction);
        setPanels((prev) => ({
            ...prev,
            [direction]: !prev[direction],
        }));
    };

    // Mock panels state for the component example
    const [panels, setPanels] = useState({
        right: false,
        left: false,
        top: false,
        bottom: false,
    });

    // Helper function to get the color for progress bar based on completion percentage
    const getProgressColor = (progress) => {
        if (progress < 30) return "bg-red-500";
        if (progress < 70) return "bg-yellow-500";
        return "bg-green-500";
    };

    return (
        <CustomContainer
            className={containerClassName}
            title="My Goals"
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
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
                {/* Goals List with fixed height and proper overflow */}
                <div className="goals-list custom-scrollbar divide-y divide-gray-200 overflow-y-auto mb-2 flex-grow max-h-96 pr-2">
                    {goals.map((goal) => (
                        <div
                            key={goal.id}
                            className="goal-item py-3 flex flex-col hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-1">
                                {/* Goal Title and Description */}
                                <div className="flex-grow min-w-0 mr-3">
                                    <p className="font-medium text-gray-800 text-sm">
                                        {goal.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {goal.description}
                                    </p>
                                </div>

                                {/* Progress Bar and Percentage side by side */}
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                    {/* Progress Bar */}
                                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                        <div
                                            className={`${getProgressColor(
                                                goal.progress
                                            )} h-1.5 rounded-full`}
                                            style={{
                                                width: `${goal.progress}%`,
                                            }}
                                        ></div>
                                    </div>

                                    {/* Progress Percentage */}
                                    <div className="flex-shrink-0">
                                        <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                                            {goal.progress}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </CustomContainer>
    );
};

export default GoalsCard;
