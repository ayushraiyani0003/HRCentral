import InterviewDetailsModelContent from "./InterviewDetailsModelContent";
import EduExpStepModelContent from "./EduExpStepModelContent";

// Enhanced Steps Configuration with Custom Layouts
const steps = [
    {
        id: "personal",
        title: "Personal Information",
        description: "Basic personal details of the candidate",
        layout: {
            type: "section",
            className: "space-y-6",
            sections: [
                {
                    title: "Basic Information",
                    layout: {
                        type: "grid",
                        gridCols: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
                    },
                    fields: [
                        {
                            name: "firstName",
                            label: "First Name",
                            required: true,
                            type: "text",
                        },
                        {
                            name: "fatherName",
                            label: "Father's Name",
                            required: true,
                            type: "text",
                        },
                        {
                            name: "lastName",
                            label: "Surname",
                            required: true,
                            type: "text",
                        },
                    ],
                },
                {
                    // title: "Additional Details",
                    layout: {
                        type: "grid",
                        gridCols: "grid-cols-1 md:grid-cols-2",
                    },
                    fields: [
                        {
                            name: "casteName",
                            label: "Caste Name",
                            required: true,
                            type: "text",
                        },
                        {
                            name: "dateOfBirth",
                            label: "Date of Birth",
                            type: "date",
                        },
                    ],
                },
                {
                    // title: "Additional Details",
                    layout: {
                        type: "grid",
                        gridCols: "grid-cols-1 md:grid-cols-4",
                    },
                    fields: [
                        {
                            name: "gender",
                            label: "Gender",
                            required: true,
                            type: "dropdown",
                            options: [
                                { value: "male", label: "Male" },
                                { value: "female", label: "Female" },
                            ],
                        },
                        {
                            name: "maritalStatus",
                            label: "Marital Status",
                            required: true,
                            type: "dropdown",
                            options: [
                                { value: "single", label: "Single" },
                                { value: "married", label: "Married" },
                            ],
                        },

                        {
                            name: "height",
                            label: "Height",
                            type: "number",
                            required: true,
                        },
                        {
                            name: "weight",
                            label: "weight",
                            type: "number",
                            required: true,
                        },
                    ],
                },
                {
                    layout: {
                        type: "grid",
                        gridCols: "grid-cols-3",
                    },
                    fields: [
                        {
                            name: "position",
                            label: "Position Applied",
                            required: true,
                            type: "text",
                        },
                        {
                            name: "department",
                            label: "Department",
                            required: true,
                            type: "dropdown",
                            options: [
                                { value: "hr", label: "Human Resources" },
                                {
                                    value: "it",
                                    label: "Information Technology",
                                },
                                { value: "finance", label: "Finance" },
                                { value: "marketing", label: "Marketing" },
                                { value: "sales", label: "Sales" },
                            ],
                        },
                        {
                            name: "refEmpId",
                            label: "Reference Employee",
                            required: false,
                            type: "dropdown",
                            options: [
                                { value: "s1", label: "John Doe (HR)" },
                                { value: "k15", label: "Jane Smith (IT)" },
                                {
                                    value: "w9",
                                    label: "Mike Johnson (Finance)",
                                },
                                {
                                    value: "152",
                                    label: "Sarah Wilson (Marketing)",
                                },
                                { value: "s1005", label: "Tom Brown (Sales)" },
                            ],
                        },
                    ],
                },
                {
                    layout: {
                        type: "grid",
                        gridCols: "grid-cols-2",
                    },
                    fields: [
                        {
                            name: "hiringStage",
                            label: "Hiring Stage",
                            required: true,
                            type: "dropdown",
                            options: [
                                { value: "applied", label: "Applied" },
                                {
                                    value: "resume_screening",
                                    label: "Resume Screening",
                                },
                                {
                                    value: "first_interview",
                                    label: "First Interview",
                                },
                                {
                                    value: "second_interview",
                                    label: "Second Interview",
                                },
                                {
                                    value: "final_interview",
                                    label: "Final Interview",
                                },
                                { value: "offer", label: "Offer" },
                                { value: "hired", label: "Hired" },
                                { value: "rejected", label: "Rejected" },
                            ],
                        },
                    ],
                },
            ],
        },
    },
    {
        id: "contact",
        title: "Contact Information",
        description: "Contact details of the candidate",
        layout: {
            type: "section",
            sections: [
                {
                    // title: "Address Information",
                    layout: {
                        type: "grid",
                        gridCols: "grid-cols-1",
                    },
                    fields: [
                        {
                            name: "address",
                            label: "Complete Address",
                            type: "textarea",
                            required: true,
                            minHeight: "100px",
                            maxHeight: "200px",
                        },
                    ],
                },
                {
                    title: "Phone Numbers",
                    layout: {
                        type: "grid",
                        gridCols: "grid-cols-1 md:grid-cols-3",
                    },
                    fields: [
                        {
                            name: "phone1",
                            label: "Mobile no. 1",
                            type: "tel",
                            required: true,
                        },
                        {
                            name: "phone2",
                            label: "Mobile no. 2",
                            type: "tel",
                        },
                        {
                            name: "whatsapp",
                            label: "WhatsApp no.",
                            type: "tel",
                            required: true,
                        },
                    ],
                },
                {
                    // title: "Phone Numbers",
                    layout: {
                        type: "grid",
                        gridCols: "grid-cols-1 md:grid-cols-2",
                    },
                    fields: [
                        {
                            name: "email1",
                            label: "Email",
                            type: "email",
                            required: true,
                        },
                    ],
                },
            ],
        },
    },
    // Replace your existing "educationExperience" step with this:
    {
        id: "educationExperience",
        title: "Education & Experience",
        description: "Education and work experience of the candidate",
        layout: {
            type: "custom",
            render: (fields, formData, handleInputChange, isViewMode) => (
                <EduExpStepModelContent
                    formData={formData}
                    handleInputChange={handleInputChange}
                    isViewMode={isViewMode}
                />
            ),
        },
        fields: [], // Empty since we're using custom render
    },
    {
        id: "InterviewDetails",
        title: "Interview Details",
        description: "Interview schedule and feedback",
        layout: {
            type: "custom",
            render: (fields, formData, handleInputChange, isViewMode) => (
                <InterviewDetailsModelContent
                    formData={formData}
                    isViewMode={isViewMode}
                />
            ),
        },
        fields: [], // Empty since we're using custom render
    },
    {
        id: "offer",
        title: "Offer Details",
        description: "Offer details of the candidate",
        fields: [
            {
                name: "noticePeriod",
                label: "Notice Period",
                type: "number",
            },
            {
                name: "probationPeriod",
                label: "Probation Period",
                type: "number",
            },
            {
                name: "expectedSalary",
                label: "Expected Salary",
                type: "number",
            },
            {
                name: "offeredSalary",
                label: "Offered Salary",
                type: "number",
            },
            {
                name: "joiningDate",
                label: "Joining Date",
                type: "date",
            },
            {
                name: "requisitionId",
                label: "Requisition ID",
                type: "dropdown",
                options: [
                    { value: "1", label: "Requisition 1" },
                    { value: "2", label: "Requisition 2" },
                ],
            },
        ],
    },
];

export default steps;
