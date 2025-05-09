import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import "./customModalStyles.css";

// usage:
// const App = () => {
//     const [isConfirmOpen, setIsConfirmOpen] = useState(false);
//     const [isFormOpen, setIsFormOpen] = useState(false);
//     const [isDetailsOpen, setIsDetailsOpen] = useState(false);
//     const [isCustomOpen, setIsCustomOpen] = useState(false);

//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [nameError, setNameError] = useState("");
//     const [emailError, setEmailError] = useState("");

//     const validateForm = () => {
//         let isValid = true;

//         if (!name.trim()) {
//             setNameError("Name is required");
//             isValid = false;
//         } else {
//             setNameError("");
//         }

//         if (!email.trim()) {
//             setEmailError("Email is required");
//             isValid = false;
//         } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//             setEmailError("Please enter a valid email address");
//             isValid = false;
//         } else {
//             setEmailError("");
//         }

//         return isValid;
//     };

//     const handleSubmit = () => {
//         if (validateForm()) {
//             alert(`Form submitted with: ${name}, ${email}`);
//             setIsFormOpen(false);
//             // Reset form
//             setName("");
//             setEmail("");
//         }
//     };

//     // Footer elements for different modal types
//     const confirmFooter = (
//         <>
//             <button
//                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
//                 onClick={() => setIsConfirmOpen(false)}
//             >
//                 Cancel
//             </button>
//             <button
//                 className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//                 onClick={() => {
//                     alert("Confirmed deletion!");
//                     setIsConfirmOpen(false);
//                 }}
//             >
//                 Delete
//             </button>
//         </>
//     );

//     const formFooter = (
//         <>
//             <button
//                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
//                 onClick={() => setIsFormOpen(false)}
//             >
//                 Cancel
//             </button>
//             <button
//                 className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
//                 onClick={handleSubmit}
//             >
//                 Submit
//             </button>
//         </>
//     );

//     const detailsFooter = (
//         <button
//             className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
//             onClick={() => setIsDetailsOpen(false)}
//         >
//             Close
//         </button>
//     );

//     return (
//         <div className="p-8 max-w-4xl mx-auto">
//             <h1 className="text-2xl font-bold mb-6">
//                 Modal Component Examples
//             </h1>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                 <button
//                     className="p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//                     onClick={() => setIsConfirmOpen(true)}
//                 >
//                     Open Confirmation Modal
//                 </button>

//                 <button
//                     className="p-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
//                     onClick={() => setIsFormOpen(true)}
//                 >
//                     Open Form Modal
//                 </button>

//                 <button
//                     className="p-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
//                     onClick={() => setIsDetailsOpen(true)}
//                 >
//                     Open Details Modal
//                 </button>

//                 <button
//                     className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
//                     onClick={() => setIsCustomOpen(true)}
//                 >
//                     Open Custom Modal
//                 </button>
//             </div>

//             {/* Confirmation Modal */}
//             <CustomModal
//                 isOpen={isConfirmOpen}
//                 onClose={() => setIsConfirmOpen(false)}
//                 title="Confirm Deletion"
//                 size="small"
//                 footer={confirmFooter}
//             >
//                 <div className="flex items-start space-x-4">
//                     <div className="flex-shrink-0 mt-1">
//                         <AlertCircle className="h-6 w-6 text-red-500" />
//                     </div>
//                     <div>
//                         <p className="text-gray-700 mb-4">
//                             Are you sure you want to delete this item? This
//                             action cannot be undone.
//                         </p>
//                         <p className="text-sm text-gray-500">
//                             All associated data will be permanently removed from
//                             our servers.
//                         </p>
//                     </div>
//                 </div>
//             </CustomModal>

//             {/* Form Modal */}
//             <CustomModal
//                 isOpen={isFormOpen}
//                 onClose={() => setIsFormOpen(false)}
//                 title="User Information"
//                 size="medium"
//                 footer={formFooter}
//             >
//                 <div className="space-y-4">
//                     <p className="text-gray-700 mb-4">
//                         Please fill out the following information:
//                     </p>

//                     <CustomTextInput
//                         label="Full Name"
//                         placeholder="Enter your full name"
//                         value={name}
//                         onChange={setName}
//                         error={nameError}
//                         required={true}
//                     />

//                     <CustomTextInput
//                         label="Email Address"
//                         type="email"
//                         placeholder="Enter your email address"
//                         value={email}
//                         onChange={setEmail}
//                         error={emailError}
//                         required={true}
//                     />
//                 </div>
//             </CustomModal>

//             {/* Details Modal */}
//             <CustomModal
//                 isOpen={isDetailsOpen}
//                 onClose={() => setIsDetailsOpen(false)}
//                 title="Product Details"
//                 size="large"
//                 footer={detailsFooter}
//             >
//                 <div className="space-y-6">
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                         <h3 className="font-medium text-lg text-gray-900 mb-2">
//                             Product Information
//                         </h3>
//                         <p className="text-gray-700">
//                             This is a detailed description of the product. It
//                             contains all the necessary information that a user
//                             might need to know before making a decision.
//                         </p>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="bg-white p-4 border border-gray-200 rounded-lg">
//                             <h4 className="font-medium text-gray-900 mb-2">
//                                 Specifications
//                             </h4>
//                             <ul className="list-disc list-inside text-gray-700 space-y-1">
//                                 <li>Specification 1: Value</li>
//                                 <li>Specification 2: Value</li>
//                                 <li>Specification 3: Value</li>
//                                 <li>Specification 4: Value</li>
//                             </ul>
//                         </div>

//                         <div className="bg-white p-4 border border-gray-200 rounded-lg">
//                             <h4 className="font-medium text-gray-900 mb-2">
//                                 Features
//                             </h4>
//                             <ul className="list-disc list-inside text-gray-700 space-y-1">
//                                 <li>Feature 1: Description</li>
//                                 <li>Feature 2: Description</li>
//                                 <li>Feature 3: Description</li>
//                                 <li>Feature 4: Description</li>
//                             </ul>
//                         </div>
//                     </div>

//                     <div className="bg-blue-50 p-4 rounded-lg">
//                         <h3 className="font-medium text-lg text-blue-900 mb-2">
//                             Additional Information
//                         </h3>
//                         <p className="text-blue-700">
//                             This modal demonstrates how you can display complex
//                             and detailed information in a focused interface,
//                             allowing users to review all necessary details
//                             without leaving the current page.
//                         </p>
//                     </div>
//                 </div>
//             </CustomModal>

//             {/* Custom Modal */}
//             <CustomModal
//                 isOpen={isCustomOpen}
//                 onClose={() => setIsCustomOpen(false)}
//                 size="medium"
//                 showCloseButton={true}
//                 closeButtonPosition="outside"
//                 className="bg-gray-900 text-white"
//                 headerClassName="border-gray-700"
//                 bodyClassName="bg-gray-300"
//                 footerClassName="border-gray-700"
//             >
//                 <div className="text-center py-8">
//                     <div className="mx-auto mb-4 bg-indigo-500 w-16 h-16 rounded-full flex items-center justify-center">
//                         <Check className="h-8 w-8 text-black" />
//                     </div>
//                     <h2 className="text-2xl font-bold mb-2">
//                         Custom Styled Modal
//                     </h2>
//                     <p className="mb-6 text-gray-800">
//                         This modal demonstrates custom styling capabilities with
//                         a dark theme.
//                     </p>
//                     <button
//                         className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//                         onClick={() => setIsCustomOpen(false)}
//                     >
//                         Awesome!
//                     </button>
//                 </div>
//             </CustomModal>
//         </div>
//     );
// };

const CustomModal = ({
    isOpen,
    onClose,
    title,
    children,
    size = "full", // small, medium, large, full
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    footer = null,
    className = "",
    overlayClassName = "",
    headerClassName = "",
    bodyClassName = "",
    footerClassName = "",
    preventBodyScroll = true,
    animationDuration = 300, // ms
    closeButtonPosition = "header", // header, outside
    customCloseButton = null,
    ariaLabel = "Modal Dialog",
    testId = "custom-modal",
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const modalRef = useRef(null);
    const previousActiveElement = useRef(null);

    // Handle opening and closing animations
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setIsAnimatingOut(false);

            // Store the currently focused element to restore focus when modal closes
            previousActiveElement.current = document.activeElement;

            // Prevent body scrolling when modal is open
            if (preventBodyScroll) {
                document.body.style.overflow = "hidden";
            }

            // Focus the modal for accessibility
            setTimeout(() => {
                if (modalRef.current) {
                    modalRef.current.focus();
                }
            }, 10);
        } else {
            if (isVisible) {
                setIsAnimatingOut(true);

                // Delay the actual closing to allow for animation
                setTimeout(() => {
                    setIsVisible(false);
                    setIsAnimatingOut(false);

                    // Restore body scrolling
                    if (preventBodyScroll) {
                        document.body.style.overflow = "";
                    }

                    // Restore focus to the previously active element
                    if (previousActiveElement.current) {
                        previousActiveElement.current.focus();
                    }
                }, animationDuration);
            }
        }

        // Clean up when component unmounts
        return () => {
            if (preventBodyScroll) {
                document.body.style.overflow = "";
            }
        };
    }, [isOpen, preventBodyScroll, animationDuration]);

    // Handle ESC key press to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen && closeOnEscape) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, closeOnEscape]);

    // Handle modal close
    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    // Handle overlay click
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && closeOnOverlayClick) {
            handleClose();
        }
    };

    // If not visible at all, don't render anything
    if (!isVisible) {
        return null;
    }

    return (
        <div
            className={`custom-modal-overlay ${
                isAnimatingOut ? "closing" : ""
            } ${overlayClassName}`}
            onClick={handleOverlayClick}
            data-testid={`${testId}-overlay`}
            style={{ animationDuration: `${animationDuration}ms` }}
        >
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel}
                tabIndex={-1}
                className={`custom-modal ${size} ${
                    isAnimatingOut ? "closing" : ""
                } ${className}`}
                data-testid={testId}
                style={{ animationDuration: `${animationDuration}ms` }}
            >
                {/* Close button outside the modal (if enabled) */}
                {showCloseButton &&
                    closeButtonPosition === "outside" &&
                    (customCloseButton || (
                        <button
                            type="button"
                            className="custom-modal-close-outside"
                            onClick={handleClose}
                            aria-label="Close dialog"
                            data-testid={`${testId}-close-button`}
                        >
                            <X size={24} />
                        </button>
                    ))}

                {/* Modal header */}
                {(title ||
                    (showCloseButton && closeButtonPosition === "header")) && (
                    <div className={`custom-modal-header ${headerClassName}`}>
                        {title && (
                            <h2 className="custom-modal-title">{title}</h2>
                        )}
                        {showCloseButton &&
                            closeButtonPosition === "header" &&
                            (customCloseButton || (
                                <button
                                    type="button"
                                    className="custom-modal-close"
                                    onClick={handleClose}
                                    aria-label="Close dialog"
                                    data-testid={`${testId}-close-button`}
                                >
                                    <X size={20} />
                                </button>
                            ))}
                    </div>
                )}

                {/* Modal body */}
                <div className={`custom-modal-body ${bodyClassName}`}>
                    {children}
                </div>

                {/* Modal footer */}
                {footer && (
                    <div className={`custom-modal-footer ${footerClassName}`}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomModal;
