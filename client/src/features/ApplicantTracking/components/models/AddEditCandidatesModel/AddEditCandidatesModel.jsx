import React from "react";
import {
    CustomModal,
    CustomizableTimeline,
} from "../../../../../components/index.js";
import InterviewDetailsModelContent from "./InterviewDetailsModelContent.jsx";
import EduExpStepModelContent from "./EduExpStepModelContent.jsx";
import CustomRenderStepButtons from "./CustomRenderStepButtons.jsx";
import steps from "./steps.jsx";
import LayoutRenderer from "./LayoutRenderer.jsx";
import FieldRenderer from "./FieldRenderer.jsx";
import useCandidateForm from "../../../hooks/useCandidateForm.js"; // Import the custom hook
function AddEditCandidatesModel({
    openCandidateModal,
    setOpenCandidateModal,
    modalType,
    candidate = null,
}) {
    // Use the custom hook
    const {
        isLoading,
        currentStep,
        completedSteps,
        formData,
        handleInputChange,
        createFieldSetter,
        handleNext,
        handlePrevious,
        handleStepClick,
        handleStepChange,
        handleSubmit,
        handleCancel,
        handleModalClose: closeModal,
        extractFieldsFromLayout,
    } = useCandidateForm({
        candidate,
        modalType,
        openCandidateModal,
        onModalClose: () => setOpenCandidateModal(false),
        steps,
    });

    // Initialize the fields renderer
    const { renderField } = FieldRenderer({
        formData,
        createFieldSetter,
        handleInputChange,
    });

    // Initialize the layout renderer
    const { renderLayout } = LayoutRenderer({
        renderField,
        formData,
        handleInputChange,
    });

    // Timeline theme configuration
    const timelineTheme = {
        colors: {
            completed: "bg-emerald-500 border-emerald-500 text-white",
            active: "bg-blue-500 border-blue-500 text-white",
            pending: "bg-white border-gray-300 text-gray-500",
            disabled: "bg-gray-100 border-gray-200 text-gray-400",
        },
        size: "md",
        animated: true,
        indicatorSize: 36,
        stepSpacing: 32,
        containerStyle: {
            width: "100%",
            padding: "0",
        },
        cardStyle: {
            padding: "24px",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            backgroundColor: "white",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
    };

    // Enhanced Step Content Renderer
    const renderStepContent = (step, stepIndex) => {
        const isActive = stepIndex === currentStep;
        const isCompleted = completedSteps.includes(stepIndex);
        const isViewMode = modalType === "view";

        return (
            <CustomRenderStepButtons
                step={step}
                stepIndex={stepIndex}
                isActive={isActive}
                isCompleted={isCompleted}
                isViewMode={isViewMode}
                handleNext={handleNext}
                handlePrevious={handlePrevious}
                extractFieldsFromLayout={extractFieldsFromLayout}
                renderLayout={renderLayout}
                renderField={renderField}
                formData={formData}
            />
        );
    };

    return (
        <CustomModal
            isOpen={openCandidateModal}
            onClose={closeModal}
            size="large"
            title={`${
                modalType === "view"
                    ? "View"
                    : modalType === "edit"
                    ? "Edit"
                    : "Add"
            } Candidate`}
            className="!max-w-6xl"
            showCloseButton={true}
            closeOnOverlayClick={false}
            closeOnEscape={true}
            bodyClassName="!px-6 !py-3"
        >
            <div className="px-6 py-0">
                {/* Timeline Component */}
                <CustomizableTimeline
                    steps={steps}
                    currentStep={currentStep}
                    orientation="horizontal"
                    theme={timelineTheme}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    onStepClick={handleStepClick}
                    showNavigationButtons={modalType !== "view"}
                    onStepChange={handleStepChange}
                    renderStepContent={renderStepContent}
                    clickableSteps={true}
                    allowSkipSteps={true}
                />
            </div>
        </CustomModal>
    );
}

export default AddEditCandidatesModel;
