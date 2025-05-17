import React, { useState } from "react";
import {
    SlidingPanel,
    ModernDateRangePicker,
    CustomDropdown,
    CustomTextInput,
    RichTextEditor,
    CustomButton,
    ToggleSwitch,
} from "../../../components";
import { Check, MoreVertical, Edit, Trash2, Plus, X } from "lucide-react";

function TaskPanel({ panels, togglePanel }) {
    // State for task form
    const [selectedValue, setSelectedValue] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState(null);

    // State for validation errors
    const [errors, setErrors] = useState({
        name: false,
        dueDate: false,
        priority: false,
    });

    // State for task list
    const [tasks, setTasks] = useState([
        {
            id: 1,
            name: "Finalize project requirements",
            description:
                "Review and confirm all project requirements with stakeholders",
            priority: {
                label: "High",
                value: "high",
            },
            dueDate: "2025-05-20",
            completed: false,
        },
        {
            id: 2,
            name: "Setup development environment",
            description:
                "Install all necessary tools and configure the development environment",
            priority: {
                label: "Medium",
                value: "medium",
            },
            dueDate: "2025-05-18",
            completed: true,
        },
        {
            id: 3,
            name: "Create wireframes",
            description: "Design initial wireframes for the user interface",
            priority: {
                label: "Low",
                value: "low",
            },
            dueDate: "2025-05-25",
            completed: false,
        },
    ]);

    // State for showing/hiding task form
    const [showForm, setShowForm] = useState(false);

    // State for tracking which task has its menu open
    const [activeMenu, setActiveMenu] = useState(null);

    // State for task being edited
    const [editingTask, setEditingTask] = useState(null);

    // State for compact view
    const [compactView, setCompactView] = useState(true);

    const priorityOptions = [
        { label: "High", value: "high" },
        { label: "Medium", value: "medium" },
        { label: "Low", value: "low" },
    ];

    // Validate form fields
    const validateForm = () => {
        const newErrors = {
            name: !name.trim(),
            dueDate: !dueDate,
            priority: !selectedValue,
        };

        setErrors(newErrors);

        // Return true if no errors (all required fields are filled)
        return !Object.values(newErrors).some((error) => error);
    };

    const handleSubmit = () => {
        // First validate the form
        if (!validateForm()) {
            return; // Stop submission if validation fails
        }

        if (editingTask) {
            // Update existing task
            setTasks(
                tasks.map((task) =>
                    task.id === editingTask.id
                        ? {
                              ...task,
                              name,
                              description,
                              priority: getPriorityObject(selectedValue),
                              dueDate,
                          }
                        : task
                )
            );
            setEditingTask(null);
        } else {
            // Create new task
            const newTask = {
                id: Date.now(),
                name,
                description,
                priority: getPriorityObject(selectedValue),
                dueDate,
                completed: false,
            };
            setTasks([...tasks, newTask]);
        }

        // Reset form
        resetForm();
    };

    // Helper function to convert priority value to priority object
    const getPriorityObject = (priorityValue) => {
        const option = priorityOptions.find(
            (opt) => opt.value === priorityValue
        );
        return option || null;
    };

    const resetForm = () => {
        setName("");
        setDescription("");
        setSelectedValue(null);
        setDueDate(null);
        setShowForm(false);
        // Clear any validation errors
        setErrors({
            name: false,
            dueDate: false,
            priority: false,
        });
    };

    const toggleCompleted = (taskId) => {
        setTasks(
            tasks.map((task) =>
                task.id === taskId
                    ? { ...task, completed: !task.completed }
                    : task
            )
        );
    };

    const deleteTask = (taskId) => {
        setTasks(tasks.filter((task) => task.id !== taskId));
        setActiveMenu(null);
    };

    const editTask = (task) => {
        setName(task.name);
        setDescription(task.description);

        // When editing a task, get the priority value properly
        // This handles both object format {value: 'high'} and string format 'high'
        const priorityValue = task.priority?.value || task.priority;
        setSelectedValue(priorityValue);

        // Set the due date directly
        setDueDate(task.dueDate);

        setEditingTask(task);
        setShowForm(true);
        setActiveMenu(null);
        setErrors({
            name: false,
            dueDate: false,
            priority: false,
        });
    };

    const toggleMenu = (taskId) => {
        setActiveMenu(activeMenu === taskId ? null : taskId);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    // Sort tasks to put incomplete tasks on top
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
    });

    const getPriorityColor = (priority) => {
        if (!priority) return "bg-gray-200 text-gray-800";

        // Handle both object and string priority values
        const priorityValue = priority.value || priority;

        switch (priorityValue) {
            case "high":
                return "bg-red-100 text-red-800";
            case "medium":
                return "bg-yellow-100 text-yellow-800";
            case "low":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-200 text-gray-800";
        }
    };

    const getPriorityLabel = (priority) => {
        if (!priority) return "None";

        // If it's an object with a label property, use that
        if (priority.label) return priority.label;

        // Otherwise, format the string value
        switch (priority) {
            case "high":
                return "High";
            case "medium":
                return "Medium";
            case "low":
                return "Low";
            default:
                return "None";
        }
    };

    // console.log(dueDate); // debug only

    return (
        <SlidingPanel
            isOpen={panels.right}
            onClose={() => togglePanel("right")}
            direction="right"
            title="My Tasks"
            // description="Manage your tasks"
            size="custom"
            customSize="25%"
            backgroundColor="custom"
            customBackgroundColor="#faf9f6"
            closeButton={true}
            headerBorder={true}
        >
            <div className="flex flex-col h-full">
                {/* View Toggle */}
                {!showForm && (
                    <div className="pb-2 flex justify-end border-none border-gray-200">
                        <ToggleSwitch
                            label="Compact View"
                            checked={compactView}
                            onChange={() => setCompactView(!compactView)}
                            size="small"
                            labelPosition="left"
                            className="!m-0"
                        />
                    </div>
                )}

                {/* Task List */}
                {!showForm && (
                    <div className="flex-1 overflow-y-auto pt-4">
                        {tasks.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No tasks yet. Create your first task!
                            </div>
                        ) : compactView ? (
                            // Compact View
                            <div className="task-list custom-scrollbar divide-y divide-gray-200 overflow-y-auto mb-2 flex-grow pr-2">
                                {sortedTasks.map((task) => (
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
                                                        toggleCompleted(task.id)
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
                                        <div
                                            className="flex-grow min-w-0"
                                            onClick={() => editTask(task)}
                                        >
                                            <p
                                                className={`font-medium truncate cursor-pointer ${
                                                    task.completed
                                                        ? "line-through text-gray-500"
                                                        : "text-gray-800"
                                                }`}
                                            >
                                                {task.name}
                                            </p>
                                        </div>

                                        {/* Priority */}
                                        <div className="flex-shrink-0">
                                            <span
                                                className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                                                    task.priority
                                                )}`}
                                            >
                                                {getPriorityLabel(
                                                    task.priority
                                                )}
                                            </span>
                                        </div>

                                        {/* Due Date */}
                                        <div className="flex-shrink-0 text-sm text-gray-500">
                                            {formatDate(task.dueDate)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // Card View
                            <ul className="space-y-3">
                                {sortedTasks.map((task) => (
                                    <li
                                        key={task.id}
                                        className={`relative bg-white rounded-lg shadow-sm border border-gray-100 p-3 transition duration-200 hover:shadow-md group ${
                                            task.completed ? "opacity-70" : ""
                                        }`}
                                    >
                                        <div className="flex items-start">
                                            {/* Checkbox */}
                                            <div className="flex-shrink-0">
                                                <label className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-300 cursor-pointer hover:bg-gray-100">
                                                    <input
                                                        type="checkbox"
                                                        checked={task.completed}
                                                        onChange={() =>
                                                            toggleCompleted(
                                                                task.id
                                                            )
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

                                            {/* Task Content */}
                                            <div className="ml-3 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3
                                                        className={`font-medium text-gray-900 ${
                                                            task.completed
                                                                ? "line-through text-gray-500"
                                                                : ""
                                                        }`}
                                                    >
                                                        {task.name}
                                                    </h3>

                                                    {/* Menu button */}
                                                    <div className="relative">
                                                        <button
                                                            onClick={() =>
                                                                toggleMenu(
                                                                    task.id
                                                                )
                                                            }
                                                            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
                                                        >
                                                            <MoreVertical
                                                                size={16}
                                                                className="text-gray-500"
                                                            />
                                                        </button>

                                                        {/* Dropdown menu */}
                                                        {activeMenu ===
                                                            task.id && (
                                                            <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-100">
                                                                <div className="py-1">
                                                                    <button
                                                                        onClick={() =>
                                                                            editTask(
                                                                                task
                                                                            )
                                                                        }
                                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                                    >
                                                                        <Edit
                                                                            size={
                                                                                14
                                                                            }
                                                                            className="mr-2"
                                                                        />
                                                                        Edit
                                                                        task
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            deleteTask(
                                                                                task.id
                                                                            )
                                                                        }
                                                                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                                                    >
                                                                        <Trash2
                                                                            size={
                                                                                14
                                                                            }
                                                                            className="mr-2"
                                                                        />
                                                                        Delete
                                                                        task
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Task details */}
                                                <div className="mt-1 text-sm text-gray-500 group-hover:block">
                                                    <div
                                                        title={task.description}
                                                        className="line-clamp-1"
                                                    >
                                                        {task.description}
                                                    </div>
                                                </div>

                                                <div className="mt-2 flex items-center text-xs">
                                                    {/* Due date */}
                                                    {task.dueDate && (
                                                        <span className="mr-3 text-gray-500">
                                                            {formatDate(
                                                                task.dueDate
                                                            )}
                                                        </span>
                                                    )}

                                                    {/* Priority tag */}
                                                    {task.priority && (
                                                        <span
                                                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                                                                task.priority
                                                            )}`}
                                                        >
                                                            {getPriorityLabel(
                                                                task.priority
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* Task Form */}
                {showForm && (
                    <div className="flex-1 overflow-y-auto">
                        <div className="flex flex-col gap-4 w-full">
                            {/* Name Input with validation error message */}
                            <div>
                                <CustomTextInput
                                    label="Task Name"
                                    placeholder="Enter task name"
                                    value={name}
                                    onChange={(newValue) => {
                                        setName(newValue);
                                        if (newValue.trim()) {
                                            setErrors({
                                                ...errors,
                                                name: false,
                                            });
                                        }
                                    }}
                                    required={true}
                                    className={`shadow-none !mb-2 rounded-lg border-none`}
                                />
                            </div>

                            {/* Description Input */}
                            <RichTextEditor
                                label="Description"
                                value={description}
                                onChange={setDescription}
                                placeholder="Enter description..."
                                className="shadow-none rounded-lg border border-none"
                            />

                            {/* Date Picker and Dropdown with validation */}
                            <div className="flex flex-col md:flex-row gap-4 w-full">
                                <div className="md:w-1/2 w-full flex flex-col">
                                    <div className="w-full">
                                        <ModernDateRangePicker
                                            initialStartDate={
                                                dueDate
                                                    ? new Date(dueDate)
                                                    : null
                                            }
                                            isRequired={true}
                                            label="Due Date"
                                            isSingle={true}
                                            onChange={(date) => {
                                                setDueDate(date);
                                                if (date) {
                                                    setErrors({
                                                        ...errors,
                                                        dueDate: false,
                                                    });
                                                }
                                            }}
                                            className="shadow-none relative !mb-2 rounded-lg border-none !w-full"
                                        />

                                        {errors.dueDate && (
                                            <p className="text-red-500 text-xs mt-1">
                                                Due date is required
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="md:w-1/2 w-full flex flex-col">
                                    <div className="w-full">
                                        <CustomDropdown
                                            required={true}
                                            label="Priority"
                                            isSearchable={false}
                                            options={priorityOptions}
                                            value={selectedValue}
                                            onChange={(val) => {
                                                setSelectedValue(val);
                                                if (val) {
                                                    setErrors({
                                                        ...errors,
                                                        priority: false,
                                                    });
                                                }
                                            }}
                                            placeholder="Select priority"
                                            mode="single"
                                            className="shadow-none relative !mb-2 rounded-lg border-none !w-full"
                                            style={{ width: "100%" }}
                                            containerStyle={{ width: "100%" }}
                                        />
                                        {errors.priority && (
                                            <p className="text-red-500 text-xs mt-1">
                                                Priority is required
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Buttons */}
                <div className="p-4 border-t border-gray-200">
                    {showForm ? (
                        <div className="flex gap-3">
                            <CustomButton
                                variant="secondary"
                                size="medium"
                                onClick={resetForm}
                                type="button"
                                padding="py-2 px-4"
                                borderRadius="rounded-lg"
                                fontWeight="font-semibold"
                                transition="transition-colors duration-300"
                                ariaLabel="Cancel task form"
                                className="flex-1"
                            >
                                <X size={18} className="mr-1" />
                                Cancel
                            </CustomButton>
                            <CustomButton
                                variant="primary"
                                size="medium"
                                onClick={handleSubmit}
                                type="button"
                                padding="py-2 px-4"
                                borderRadius="rounded-lg"
                                fontWeight="font-semibold"
                                hoverColor="hover:bg-blue-600"
                                transition="transition-colors duration-300"
                                ariaLabel="Submit task form"
                                testId="task-submit-button"
                                className="flex-1"
                            >
                                {editingTask ? "Update" : "Create"} Task
                            </CustomButton>
                        </div>
                    ) : (
                        <CustomButton
                            variant="primary"
                            size="medium"
                            fullWidth={true}
                            onClick={() => setShowForm(true)}
                            type="button"
                            padding="py-2 px-4"
                            borderRadius="rounded-lg"
                            fontWeight="font-semibold"
                            hoverColor="hover:bg-blue-600"
                            transition="transition-colors duration-300"
                            ariaLabel="Add new task"
                            testId="add-task-button"
                            className="flex items-center justify-center"
                        >
                            <Plus size={18} className="mr-1" />
                            Add New Task
                        </CustomButton>
                    )}
                </div>
            </div>
        </SlidingPanel>
    );
}

export default TaskPanel;
