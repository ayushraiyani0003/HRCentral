import React from "react";

function CustomRenderStepButtons({
    step,
    isActive,
    isCompleted,
    formData,
    isViewMode,
    renderLayout = () => {},
    renderField = () => {},
    extractFieldsFromLayout,
}) {
    return (
        <div className="step-content">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{step.description}</p>
            </div>

            {/* Active Step Content */}
            {isActive && (
                <div className="min-h-[400px]">
                    {step.layout ? (
                        renderLayout(step.layout, step.fields || [], isViewMode)
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {(step.fields || []).map((field) => (
                                <div key={field.name} className="form-group">
                                    {renderField(field, isViewMode)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Completed Step Summary */}
            {isCompleted && !isActive && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex items-center">
                        <svg
                            className="w-5 h-5 text-green-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            ></path>
                        </svg>
                        <span className="text-sm font-medium text-green-800">
                            Step completed
                        </span>
                    </div>
                    <div className="mt-2 text-sm text-green-700">
                        {
                            extractFieldsFromLayout(step).filter(
                                (f) => formData[f.name]
                            ).length
                        }{" "}
                        of {extractFieldsFromLayout(step).length} fields filled
                    </div>
                </div>
            )}

            {/* Pending Step Info */}
            {!isActive && !isCompleted && (
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                    <div className="text-sm text-gray-600">
                        Complete previous steps to unlock this section
                    </div>
                </div>
            )}
        </div>
    );
}

export default CustomRenderStepButtons;
