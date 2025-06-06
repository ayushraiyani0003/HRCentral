import React from "react";
import {
    CustomButton,
    CustomDropdown,
    RichTextEditor,
    CustomTextInput,
    ModernDateRangePicker,
} from "../../../../components";

const FieldRenderer = ({ formData, createFieldSetter, handleInputChange }) => {
    const renderField = (field, isViewMode = false) => {
        const {
            name: fieldKey,
            className: fieldClassName,
            ...fieldProps
        } = field;
        const commonProps = {
            className: `w-full ${fieldClassName || ""}`,
            disabled: isViewMode,
        };

        switch (field.type) {
            case "textarea":
                return (
                    <RichTextEditor
                        key={fieldKey}
                        {...commonProps}
                        label={field.label}
                        value={formData[field.name] || ""}
                        onChange={createFieldSetter(field.name)}
                        placeholder={
                            field.placeholder ||
                            `Enter ${field.label.toLowerCase()}`
                        }
                        required={field.required}
                        readOnly={isViewMode}
                        toolbarOptions={field.toolbarOptions || []}
                        minHeight={field.minHeight || "120px"}
                        maxHeight={field.maxHeight || "300px"}
                        className={`w-full !mb-0 ${fieldClassName || ""}`}
                    />
                );

            case "dropdown":
                return (
                    <CustomDropdown
                        key={fieldKey}
                        className="!w-full"
                        {...commonProps}
                        label={field.label}
                        options={field.options || []}
                        value={formData[field.name] || ""} // Fixed: use field.name instead of field.value
                        onChange={(selectedValues) => {
                            console.log(selectedValues);
                            // Fixed: extract single value for single mode
                            const singleValue = Array.isArray(selectedValues)
                                ? selectedValues[0]
                                : selectedValues;
                            handleInputChange(field.name, singleValue || "");
                        }}
                        placeholder={
                            field.placeholder || `Select ${field.label}`
                        }
                        required={field.required}
                        mode="single"
                        readOnly={isViewMode} // Added readOnly prop for consistency
                    />
                );

            case "date":
                return (
                    <ModernDateRangePicker
                        key={fieldKey}
                        {...commonProps}
                        label={field.label}
                        isSingle={true}
                        selectionMode="single"
                        onChange={(date) => handleInputChange(field.name, date)}
                        initialStartDate={
                            formData[field.name]
                                ? new Date(formData[field.name])
                                : null
                        }
                        placeholder={
                            field.placeholder ||
                            `Select ${field.label.toLowerCase()}`
                        }
                        isRequired={field.required}
                        className="!w-full"
                    />
                );

            case "file":
                return (
                    <div
                        key={fieldKey}
                        className={`w-full ${fieldClassName || ""}`}
                    >
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label}
                            {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                            )}
                        </label>
                        <input
                            type="file"
                            accept={field.accept || "*"}
                            onChange={(e) =>
                                handleInputChange(field.name, e.target.files[0])
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isViewMode}
                        />
                    </div>
                );

            case "custom":
                // For completely custom components
                return field.render ? (
                    <div key={fieldKey}>
                        {field.render(formData, handleInputChange, isViewMode)}
                    </div>
                ) : null;

            default:
                return (
                    <CustomTextInput
                        key={fieldKey}
                        {...commonProps}
                        label={field.label}
                        type={field.type || "text"}
                        value={formData[field.name] || ""}
                        onChange={createFieldSetter(field.name)}
                        required={field.required}
                        placeholder={
                            field.placeholder ||
                            `Enter ${field.label.toLowerCase()}`
                        }
                        onlyNumbers={field.type === "number"}
                        className={`w-full !mb-0 ${fieldClassName || ""}`}
                    />
                );
        }
    };
    return { renderField };
};

export default FieldRenderer;
