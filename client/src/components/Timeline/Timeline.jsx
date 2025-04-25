import React, { useState, useEffect } from "react";
import CustomTextInput from "../CustomTextInput/CustomTextInput";
import "./timelineStyles.css";

const EmployeePhaseTimeline = ({
    employee = {},
    onSavePhase = () => {},
    onCompleteAll = () => {},
    className = "",
    phases,
}) => {
    // State management
    const [formData, setFormData] = useState({ ...employee });
    const [activePhase, setActivePhase] = useState("personal");
    const [expandedPhase, setExpandedPhase] = useState(null);
    const [errors, setErrors] = useState({});
    const [phaseStatus, setPhaseStatus] = useState({
        personal: { status: "pending" },
        employment: { status: "pending" },
        benefits: { status: "pending" },
    });

    // Update phase status based on employee data
    useEffect(() => {
        if (employee) {
            setFormData({ ...employee });

            // Determine phase status
            const newPhaseStatus = { ...phaseStatus };
            let firstIncompleteFound = false;

            phases.forEach((phase) => {
                if (employee[`${phase.id}CompletedDate`]) {
                    newPhaseStatus[phase.id] = {
                        status: "completed",
                        completedDate: employee[`${phase.id}CompletedDate`],
                    };
                } else if (!firstIncompleteFound) {
                    newPhaseStatus[phase.id] = { status: "active" };
                    setActivePhase(phase.id);
                    firstIncompleteFound = true;
                } else {
                    newPhaseStatus[phase.id] = { status: "pending" };
                }
            });

            setPhaseStatus(newPhaseStatus);
        }
    }, [employee]);

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        // Clear error for this field if exists
        if (errors[field]) {
            const newErrors = { ...errors };
            delete newErrors[field];
            setErrors(newErrors);
        }
    };

    // Validate phase
    const validatePhase = (phaseId) => {
        const phase = phases.find((p) => p.id === phaseId);
        const newErrors = {};
        let isValid = true;

        phase.fields.forEach((field) => {
            if (
                field.required &&
                (!formData[field.name] || formData[field.name].trim() === "")
            ) {
                newErrors[field.name] = `${field.label} is required`;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    // Save current phase
    const handleSavePhase = (phaseId) => {
        if (validatePhase(phaseId)) {
            const currentDate = new Date().toISOString();
            const updatedData = {
                ...formData,
                [`${phaseId}CompletedDate`]: currentDate,
            };

            // Update phase status
            const newPhaseStatus = { ...phaseStatus };
            newPhaseStatus[phaseId] = {
                status: "completed",
                completedDate: currentDate,
            };

            // Find next phase
            const currentIndex = phases.findIndex((p) => p.id === phaseId);
            if (currentIndex < phases.length - 1) {
                const nextPhase = phases[currentIndex + 1];
                newPhaseStatus[nextPhase.id] = { status: "active" };
                setActivePhase(nextPhase.id);
            } else {
                // All phases complete
                onCompleteAll(updatedData);
            }

            setPhaseStatus(newPhaseStatus);
            setFormData(updatedData);
            onSavePhase(phaseId, updatedData);
            setExpandedPhase(null);
        }
    };

    // Toggle form visibility
    const togglePhaseForm = (phaseId) => {
        if (expandedPhase === phaseId) {
            setExpandedPhase(null);
        } else {
            setExpandedPhase(phaseId);
        }
    };

    // Check if can edit a phase
    const canEditPhase = (phaseId) => {
        const phaseIndex = phases.findIndex((p) => p.id === phaseId);
        const prevPhase = phaseIndex > 0 ? phases[phaseIndex - 1].id : null;

        return (
            phaseStatus[phaseId].status === "active" ||
            phaseStatus[phaseId].status === "completed" ||
            (prevPhase && phaseStatus[prevPhase].status === "completed")
        );
    };

    // Render phase form
    const renderPhaseForm = (phase) => {
        return (
            <div className="phase-form">
                <div className="form-grid">
                    {phase.fields.map((field) => (
                        <div key={field.name}>
                            <CustomTextInput
                                label={field.label}
                                type={field.type || "text"}
                                value={formData[field.name] || ""}
                                onChange={(value) =>
                                    handleInputChange(field.name, value)
                                }
                                onlyNumbers={field.onlyNumbers}
                                required={field.required}
                                error={errors[field.name]}
                                disabled={
                                    phaseStatus[phase.id].status === "completed"
                                }
                            />
                        </div>
                    ))}
                </div>

                {phaseStatus[phase.id].status !== "completed" && (
                    <div className="form-actions">
                        <button
                            className="phase-action-button secondary"
                            onClick={() => setExpandedPhase(null)}
                        >
                            Cancel
                        </button>
                        <button
                            className="phase-action-button primary"
                            onClick={() => handleSavePhase(phase.id)}
                        >
                            Save & Continue
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // Render progress indicator
    const renderProgressIndicator = () => {
        return (
            <div className="progress-indicator">
                {phases.map((phase, index) => {
                    const status = phaseStatus[phase.id].status;

                    return (
                        <React.Fragment key={phase.id}>
                            <div className={`progress-step ${status}`}>
                                {status === "completed" ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                ) : (
                                    index + 1
                                )}
                                <div className="progress-label">
                                    {phase.title}
                                </div>
                            </div>
                            {/* Line between steps */}
                            {index < phases.length - 1 && (
                                <div
                                    className={`progress-line ${
                                        status === "completed"
                                            ? "completed"
                                            : ""
                                    }`}
                                    style={{
                                        width: `calc(100% / ${
                                            phases.length - 1
                                        })`,
                                    }}
                                ></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        );
    };

    return (
        <div className={`employee-phase-timeline ${className}`}>
            {renderProgressIndicator()}

            <div className="timeline-container vertical">
                <div className="timeline-content">
                    {phases.map((phase) => {
                        const status = phaseStatus[phase.id].status;
                        const isExpanded = expandedPhase === phase.id;

                        return (
                            <div
                                key={phase.id}
                                className={`timeline-item ${status}`}
                            >
                                <div className="timeline-item-connector">
                                    <div className="timeline-item-dot"></div>
                                    <div className="timeline-item-line"></div>
                                </div>

                                <div className="timeline-item-card">
                                    <div className="timeline-item-title">
                                        {phase.title}
                                        <span
                                            className={`phase-status ${status}`}
                                        >
                                            {status === "completed" ? (
                                                <>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                    Completed
                                                </>
                                            ) : status === "active" ? (
                                                <>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <circle
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                        ></circle>
                                                        <polyline points="12 6 12 12 16 14"></polyline>
                                                    </svg>
                                                    In Progress
                                                </>
                                            ) : (
                                                <>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <circle
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                        ></circle>
                                                        <line
                                                            x1="12"
                                                            y1="8"
                                                            x2="12"
                                                            y2="16"
                                                        ></line>
                                                        <line
                                                            x1="8"
                                                            y1="12"
                                                            x2="16"
                                                            y2="12"
                                                        ></line>
                                                    </svg>
                                                    Pending
                                                </>
                                            )}
                                        </span>
                                    </div>

                                    <div className="timeline-item-content">
                                        {phase.description}
                                        {status === "completed" &&
                                            phaseStatus[phase.id]
                                                .completedDate && (
                                                <div className="completed-date">
                                                    Completed on{" "}
                                                    {new Date(
                                                        phaseStatus[
                                                            phase.id
                                                        ].completedDate
                                                    ).toLocaleDateString()}
                                                </div>
                                            )}
                                    </div>

                                    {!isExpanded && (
                                        <div className="phase-actions">
                                            {status === "completed" && (
                                                <button
                                                    className="phase-action-button secondary"
                                                    onClick={() =>
                                                        togglePhaseForm(
                                                            phase.id
                                                        )
                                                    }
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                        <circle
                                                            cx="12"
                                                            cy="12"
                                                            r="3"
                                                        ></circle>
                                                    </svg>
                                                    View Details
                                                </button>
                                            )}

                                            {status === "active" && (
                                                <button
                                                    className="phase-action-button primary"
                                                    onClick={() =>
                                                        togglePhaseForm(
                                                            phase.id
                                                        )
                                                    }
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                    </svg>
                                                    Edit Now
                                                </button>
                                            )}

                                            {status === "pending" &&
                                                canEditPhase(phase.id) && (
                                                    <button
                                                        className="phase-action-button secondary"
                                                        onClick={() =>
                                                            togglePhaseForm(
                                                                phase.id
                                                            )
                                                        }
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="M12 5v14"></path>
                                                            <path d="M5 12h14"></path>
                                                        </svg>
                                                        Start This Phase
                                                    </button>
                                                )}
                                        </div>
                                    )}

                                    {isExpanded && renderPhaseForm(phase)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default EmployeePhaseTimeline;

// Usage:
// import React, { useState } from "react";
// import EmployeePhaseTimeline from "./components/Timeline/Timeline";
// import CustomTextInput from "./components/CustomTextInput/CustomTextInput";
// import "./App.css";

// const EmployeeManagement = () => {
//     // Sample employee data
//     const [employees, setEmployees] = useState([
//         {
//             id: "emp001",
//             firstName: "John",
//             lastName: "Doe",
//             email: "john.doe@example.com",
//             phone: "123-456-7890",
//             department: "Engineering",
//             position: "Software Engineer",
//             employeeId: "E12345",
//             startDate: "2023-06-15",
//             personalCompletedDate: "2023-05-10T14:30:00Z",
//             employmentCompletedDate: "2023-05-12T09:45:00Z",
//             benefitsCompletedDate: "2023-05-12T09:45:00Z",
//         },
//         {
//             id: "emp002",
//             firstName: "Jane",
//             lastName: "Smith",
//             email: "jane.smith@example.com",
//             phone: "098-765-4321",
//             personalCompletedDate: "2023-05-15T10:15:00Z",
//         },
//     ]);

//     const [selectedEmployee, setSelectedEmployee] = useState(null);

//     // Handle saving a phase
//     const handleSavePhase = (phaseId, updatedData) => {
//         console.log(`Phase ${phaseId} saved for employee ${selectedEmployee}`);

//         // Update employee data
//         setEmployees((prev) =>
//             prev.map((emp) =>
//                 emp.id === selectedEmployee ? { ...emp, ...updatedData } : emp
//             )
//         );
//     };

//     // Handle all phases complete
//     const handleCompleteAll = (finalData) => {
//         console.log("All phases completed!", finalData);

//         // Update employee with completed status
//         setEmployees((prev) =>
//             prev.map((emp) =>
//                 emp.id === selectedEmployee
//                     ? { ...emp, ...finalData, onboardingCompleted: true }
//                     : emp
//             )
//         );

//         alert("Employee onboarding process completed successfully!");
//     };

//     // Define the three phases for employee data entry
//     const phases = [
//         {
//             id: "personal",
//             title: "Personal Information",
//             description: "Basic personal details of the employee",
//             fields: [
//                 { name: "firstName", label: "First Name", required: true },
//                 { name: "lastName", label: "Last Name", required: true },
//                 { name: "email", label: "Email Address", required: true },
//                 { name: "phone", label: "Phone Number", required: true },
//                 { name: "dateOfBirth", label: "Date of Birth", type: "date" },
//                 { name: "address", label: "Address" },
//             ],
//         },
//         {
//             id: "employment",
//             title: "Employment Details",
//             description: "Job role and employment information",
//             fields: [
//                 { name: "department", label: "Department", required: true },
//                 { name: "position", label: "Position", required: true },
//                 { name: "employeeId", label: "Employee ID", required: true },
//                 {
//                     name: "startDate",
//                     label: "Start Date",
//                     type: "date",
//                     required: true,
//                 },
//                 { name: "manager", label: "Reporting Manager" },
//                 { name: "salary", label: "Base Salary", onlyNumbers: true },
//             ],
//         },
//         {
//             id: "benefits",
//             title: "Benefits & Documentation",
//             description: "Employee benefits and required documentation",
//             fields: [
//                 {
//                     name: "insurancePlan",
//                     label: "Insurance Plan",
//                     required: true,
//                 },
//                 {
//                     name: "bankAccount",
//                     label: "Bank Account Details",
//                     required: true,
//                 },
//                 { name: "taxNumber", label: "Tax ID Number", required: true },
//                 {
//                     name: "emergencyContact",
//                     label: "Emergency Contact Name",
//                     required: true,
//                 },
//                 {
//                     name: "emergencyPhone",
//                     label: "Emergency Contact Phone",
//                     required: true,
//                 },
//             ],
//         },
//     ];

//     return (
//         <div className="employee-management-container">
//             <div className="header">
//                 <h1>Employee Data Management</h1>
//                 <p>
//                     Add and manage employee information in a structured process
//                 </p>
//             </div>

//             <div className="content-container">
//                 <div className="sidebar">
//                     <h2>Employees</h2>
//                     <div className="employee-list">
//                         {employees.map((emp) => (
//                             <div
//                                 key={emp.id}
//                                 className={`employee-item ${
//                                     selectedEmployee === emp.id
//                                         ? "selected"
//                                         : ""
//                                 }`}
//                                 onClick={() => setSelectedEmployee(emp.id)}
//                             >
//                                 <div className="employee-avatar">
//                                     {emp.firstName?.charAt(0)}
//                                     {emp.lastName?.charAt(0)}
//                                 </div>
//                                 <div className="employee-details">
//                                     <div className="employee-name">
//                                         {emp.firstName} {emp.lastName}
//                                     </div>
//                                     <div className="employee-position">
//                                         {emp.position || "Position not set"}
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}

//                         <button className="add-employee-button">
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="20"
//                                 height="20"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                             >
//                                 <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
//                                 <circle cx="8.5" cy="7" r="4"></circle>
//                                 <line x1="20" y1="8" x2="20" y2="14"></line>
//                                 <line x1="23" y1="11" x2="17" y2="11"></line>
//                             </svg>
//                             Add New Employee
//                         </button>
//                     </div>
//                 </div>

//                 <div className="main-content">
//                     {selectedEmployee ? (
//                         <>
//                             <div className="employee-header">
//                                 <h2>
//                                     {
//                                         employees.find(
//                                             (e) => e.id === selectedEmployee
//                                         )?.firstName
//                                     }{" "}
//                                     {
//                                         employees.find(
//                                             (e) => e.id === selectedEmployee
//                                         )?.lastName
//                                     }
//                                 </h2>
//                                 {employees.find(
//                                     (e) => e.id === selectedEmployee
//                                 )?.onboardingCompleted && (
//                                     <div className="completed-badge">
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             width="16"
//                                             height="16"
//                                             viewBox="0 0 24 24"
//                                             fill="none"
//                                             stroke="currentColor"
//                                             strokeWidth="2"
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                         >
//                                             <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
//                                             <polyline points="22 4 12 14.01 9 11.01"></polyline>
//                                         </svg>
//                                         Fully Onboarded
//                                     </div>
//                                 )}
//                             </div>

//                             <EmployeePhaseTimeline
//                                 employee={employees.find(
//                                     (e) => e.id === selectedEmployee
//                                 )}
//                                 onSavePhase={handleSavePhase}
//                                 onCompleteAll={handleCompleteAll}
//                                 phases={phases}
//                             />
//                         </>
//                     ) : (
//                         <div className="no-selection">
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="64"
//                                 height="64"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="#6b7280"
//                                 strokeWidth="1"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                             >
//                                 <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
//                                 <circle cx="9" cy="7" r="4"></circle>
//                                 <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
//                                 <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
//                             </svg>
//                             <p>
//                                 Select an employee to manage their information
//                             </p>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             <style jsx>{`
//                 .employee-management-container {
//                     font-family: "Inter", -apple-system, BlinkMacSystemFont,
//                         sans-serif;
//                     max-width: 1200px;
//                     margin: 0 auto;
//                     padding: 2rem;
//                 }

//                 .header {
//                     margin-bottom: 2rem;
//                 }

//                 .header h1 {
//                     font-size: 1.75rem;
//                     font-weight: 600;
//                     color: #111827;
//                     margin: 0 0 0.5rem 0;
//                 }

//                 .header p {
//                     font-size: 1rem;
//                     color: #6b7280;
//                     margin: 0;
//                 }

//                 .content-container {
//                     display: flex;
//                     gap: 2rem;
//                     min-height: 600px;
//                 }

//                 .sidebar {
//                     width: 300px;
//                     background-color: #f9fafb;
//                     border-radius: 0.5rem;
//                     padding: 1.5rem;
//                     border: 1px solid #e5e7eb;
//                 }

//                 .sidebar h2 {
//                     font-size: 1.25rem;
//                     font-weight: 600;
//                     color: #111827;
//                     margin: 0 0 1.5rem 0;
//                 }

//                 .employee-list {
//                     display: flex;
//                     flex-direction: column;
//                     gap: 0.75rem;
//                 }

//                 .employee-item {
//                     display: flex;
//                     align-items: center;
//                     padding: 0.75rem;
//                     border-radius: 0.5rem;
//                     background-color: white;
//                     border: 1px solid #e5e7eb;
//                     cursor: pointer;
//                     transition: all 0.2s ease;
//                 }

//                 .employee-item:hover {
//                     border-color: #d1d5db;
//                     box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
//                 }

//                 .employee-item.selected {
//                     border-color: #6366f1;
//                     box-shadow: 0 0 0 1px #6366f1;
//                 }

//                 .employee-avatar {
//                     width: 40px;
//                     height: 40px;
//                     border-radius: 50%;
//                     background-color: #6366f1;
//                     color: white;
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                     font-weight: 600;
//                     margin-right: 0.75rem;
//                 }

//                 .employee-details {
//                     flex: 1;
//                 }

//                 .employee-name {
//                     font-weight: 500;
//                     color: #111827;
//                 }

//                 .employee-position {
//                     font-size: 0.875rem;
//                     color: #6b7280;
//                 }

//                 .add-employee-button {
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                     gap: 0.5rem;
//                     width: 100%;
//                     padding: 0.75rem;
//                     margin-top: 1rem;
//                     background-color: #f3f4f6;
//                     border: 1px dashed #d1d5db;
//                     border-radius: 0.5rem;
//                     color: #4b5563;
//                     font-weight: 500;
//                     cursor: pointer;
//                     transition: all 0.2s ease;
//                 }

//                 .add-employee-button:hover {
//                     background-color: #e5e7eb;
//                     border-color: #9ca3af;
//                 }

//                 .main-content {
//                     flex: 1;
//                     min-height: 600px;
//                     background-color: white;
//                     border-radius: 0.5rem;
//                     padding: 1.5rem;
//                     border: 1px solid #e5e7eb;
//                 }

//                 .employee-header {
//                     display: flex;
//                     align-items: center;
//                     justify-content: space-between;
//                     margin-bottom: 2rem;
//                 }

//                 .employee-header h2 {
//                     font-size: 1.5rem;
//                     font-weight: 600;
//                     color: #111827;
//                     margin: 0;
//                 }

//                 .completed-badge {
//                     display: flex;
//                     align-items: center;
//                     gap: 0.375rem;
//                     padding: 0.375rem 0.75rem;
//                     background-color: #dcfce7;
//                     color: #166534;
//                     font-size: 0.875rem;
//                     font-weight: 500;
//                     border-radius: 9999px;
//                 }

//                 .no-selection {
//                     display: flex;
//                     flex-direction: column;
//                     align-items: center;
//                     justify-content: center;
//                     height: 100%;
//                     color: #6b7280;
//                     padding: 2rem;
//                     text-align: center;
//                 }

//                 .no-selection p {
//                     margin-top: 1rem;
//                     font-size: 1rem;
//                 }

//                 @media (max-width: 768px) {
//                     .content-container {
//                         flex-direction: column;
//                     }

//                     .sidebar {
//                         width: 100%;
//                     }
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default EmployeeManagement;
