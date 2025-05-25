import React, { useState } from "react";
import {
    EmailSidebar,
    EmailMainSection,
    EmailComposeModel,
} from "../components";
import {
    CustomContainer,
    CustomTextInput,
    RichTextEditor,
    CustomModal,
} from "../../../components";
function EmailPage() {
    const [activeMenu, setActiveMenu] = useState("inbox");
    const [showComposeModal, setShowComposeModal] = useState(false);
    const [emailContent, setEmailContent] = useState("");
    const [emailSubject, setEmailSubject] = useState("");
    const [emailTo, setEmailTo] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const menuItems = [
        { id: "inbox", label: "Inbox", icon: "📥", count: 12 },
        { id: "sent", label: "Sent", icon: "📤", count: null },
        { id: "draft", label: "Draft", icon: "📝", count: 3 },
    ];

    const bottomMenuItems = [
        { id: "settings", label: "Settings", icon: "⚙️" },
        { id: "help", label: "Help", icon: "❓" },
        { id: "logout", label: "Logout", icon: "🚪" },
    ];

    const handleMenuSelect = (menuId) => {
        setActiveMenu(menuId);
    };

    const handleComposeSubmit = () => {
        // Handle email composition logic here
        console.log("Composing email:", {
            emailTo,
            emailSubject,
            emailContent,
        });
        setShowComposeModal(false);
        // Reset form
        setEmailTo("");
        setEmailSubject("");
        setEmailContent("");
    };

    const handleComposeClear = () => {
        setEmailTo("");
        setEmailSubject("");
        setEmailContent("");
    };

    return (
        <div>
            <CustomContainer containerContentClassName="flex flex-row h-screen gap-3">
                {/* this is used for sidebar */}
                <EmailSidebar
                    onMenuSelect={handleMenuSelect}
                    activeMenu={activeMenu}
                    menuItems={menuItems}
                    bottomMenuItems={bottomMenuItems}
                    setShowComposeModal={setShowComposeModal}
                    searchQuery={searchQuery}
                    setsearchQuery={setSearchQuery}
                />
                <EmailMainSection
                    activeMenu={activeMenu}
                    searchQuery={searchQuery}
                    setShowComposeModal={setShowComposeModal}
                />
            </CustomContainer>
            {/* Compose Email Modal open if  */}
            {showComposeModal && (
                <EmailComposeModel
                    showComposeModal={showComposeModal}
                    setShowComposeModal={setShowComposeModal}
                    emailTo={emailTo}
                    setEmailTo={setEmailTo}
                    emailSubject={emailSubject}
                    setEmailSubject={setEmailSubject}
                    emailContent={emailContent}
                    setEmailContent={setEmailContent}
                    handleComposeClear={handleComposeClear}
                    handleComposeSubmit={handleComposeSubmit}
                />
            )}
        </div>
    );
}

export default EmailPage;

// two section, one is always oipen side bar, and one is main content in right side of the side bar,

//     the look is like gmail

//     in side bar, inbox, sent, draft, sedual, settings, help, logout etc, and in right side main content has the if index then show email List, if any perticular email then the email is disply , and other acoding to MenuSquare,

// Usage:
{
    /* <h2>Rich Text Editor Example</h2>
            
            <RichTextEditor
                label="Comment"
                placeholder="Enter your formatted comment here..."
                value={content}
                onChange={handleChange}
                onClear={handleClear}
                required={true}
                error={error}
                toolbarOptions={["bold", "italic", "underline", "list"]}
                minHeight="150px"
                maxHeight="400px"
            />
            
            <div style={{ marginTop: "2rem" }}>
                <h3>Preview</h3>
                {content ? (
                    <div
                        style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.5rem",
                            padding: "1rem",
                            backgroundColor: "#f9fafb"
                        }}
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                ) : (
                    <p style={{ color: "#9ca3af" }}>No content yet</p>
                )} 
            </div>*/
}

// const RichTextEditor = forwardRef(
//     (
//         {
//             label,
//             value,
//             onChange,
//             onClear,
//             placeholder,
//             required = false,
//             className = "",
//             error = "",
//             toolbarOptions = ["bold", "italic", "underline", "list"],
//             minHeight = "120px",
//             maxHeight = "300px",
//             ...rest
//         },
//         ref
//     ) => {

//     const CustomTextInput = forwardRef(
//         (
//             {
//                 label,
//                 type = "text",
//                 placeholder,
//                 value,
//                 onChange,
//                 onClear,
//                 onlyNumbers = false,
//                 required = false,
//                 className = "",
//                 error = "",
//                 icon = null,
//                 autoComplete,
//                 maxLength,
//                 minLength,
//                 pattern,
//                 readOnly = false,
//                 disabled = false,
//                 helperText = "",
//                 ...rest
//             },
//             ref
//         ) => {
// usage:
// const InputExamples = () => {
//     // State for various input types
//     const [textValue, setTextValue] = useState("");
//     const [passwordValue, setPasswordValue] = useState("");
//     const [emailValue, setEmailValue] = useState("");
//     const [numberValue, setNumberValue] = useState("");
//     const [searchQuery, setsearchQuery] = useState("");
//     const [phoneValue, setPhoneValue] = useState("");
//     const [creditCardValue, setCreditCardValue] = useState("");
//     const [urlValue, setUrlValue] = useState("");

//     // Function to create custom icons

//     return (
//         <div className="input-examples w-1/4 m-auto">
//             <h2>Input Field Examples</h2>

//             {/* Basic Text Input */}
//             <CustomTextInput
//                 label="Text Input"
//                 placeholder="Enter some text"
//                 value={textValue}
//                 onChange={setTextValue}
//                 required
//                 helperText="This is a standard text input field"
//             />

//             {/* Password Input with Toggle */}
//             <CustomTextInput
//                 label="Password"
//                 type="password"
//                 placeholder="Enter your password"
//                 value={passwordValue}
//                 onChange={setPasswordValue}
//                 helperText="Your password is secure"
//                 required
//             />

// use this with props:
// const CustomContainer = forwardRef(
//     (
//         {
//             children,
//             className = "",
//             title = "",
//             description = "",
//             titleRequired = false,
//             elevation = "low", // "none", "low", "medium", "high"
//             padding = "medium", // "none", "small", "medium", "large"
//             border = true,
//             rounded = "medium", // "none", "small", "medium", "large", "full"
//             backgroundColor = "white", // "white", "light", "dark", "primary", "accent", "custom"
//             customBackgroundColor = "",
//             width = "auto", // "auto", "full", "half", "custom"
//             customWidth = "",
//             minHeight = "",
//             maxHeight = "",
//             withOverflow = false,
//             hasError = false,
//             headerActions = null,
//             footerContent = null,
//             footerBorder = true,
//             headerBorder = true,
//             headerClassName = "",
//             icon = null,
//             titleCssClass = "",
//             overflowContent=false,
//             isFixedFooter,
//             ...rest
//         },
//         ref
//     ) => {

// model use for create new draft email for send open bottom right.
// const CustomModal = ({
//     isOpen,
//     onClose,
//     title,
//     children,
//     size = "full", // small, medium, large, full
//     showCloseButton = true,
//     closeOnOverlayClick = true,
//     closeOnEscape = true,
//     footer = null,
//     className = "",
//     overlayClassName = "",
//     headerClassName = "",
//     bodyClassName = "",
//     footerClassName = "",
//     preventBodyScroll = true,
//     animationDuration = 300, // ms
//     closeButtonPosition = "header", // header, outside
//     customCloseButton = null,
//     ariaLabel = "Modal Dialog",
//     testId = "custom-modal",
// }) => {

// this is alredy i make so dont make only use this.
