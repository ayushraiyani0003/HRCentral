import React from "react";
import { CustomButton } from "../../../../components";

const LayoutRenderer = ({ renderField, formData, handleInputChange }) => {
    const renderLayout = (layout, fields, isViewMode = false) => {
        switch (layout.type) {
            case "grid":
                return (
                    <div
                        className={`grid gap-4 ${
                            layout.gridCols || "grid-cols-1 xl:grid-cols-2"
                        } ${layout.className || ""}`}
                    >
                        {fields.map((field) => (
                            <div
                                key={field.name}
                                className={`form-group ${field.colSpan || ""} ${
                                    field.wrapperClass || ""
                                }`}
                            >
                                {renderField(field, isViewMode)}
                            </div>
                        ))}
                    </div>
                );

            case "flex":
                return (
                    <div
                        className={`flex gap-4 ${
                            layout.direction || "flex-col"
                        } ${layout.className || ""}`}
                    >
                        {fields.map((field) => (
                            <div
                                key={field.name}
                                className={`form-group ${
                                    field.flexBasis || "flex-1"
                                } ${field.wrapperClass || ""}`}
                            >
                                {renderField(field, isViewMode)}
                            </div>
                        ))}
                    </div>
                );

            case "section":
                return (
                    <div className={`space-y-6 ${layout.className || ""}`}>
                        {layout.sections.map((section, index) => (
                            <div
                                key={index}
                                className={`${section.className || ""}`}
                            >
                                {section.title && (
                                    <h4 className="text-md font-semibold text-gray-800 mb-3">
                                        {section.title}
                                    </h4>
                                )}
                                {section.description && (
                                    <p className="text-sm text-gray-600 mb-4">
                                        {section.description}
                                    </p>
                                )}
                                {renderLayout(
                                    section.layout,
                                    section.fields,
                                    isViewMode
                                )}
                            </div>
                        ))}
                    </div>
                );

            case "table":
                return (
                    <div
                        className={`overflow-x-auto ${layout.className || ""}`}
                    >
                        <table className="min-w-full border border-gray-200 rounded-lg">
                            <thead className="bg-gray-50">
                                <tr>
                                    {layout.columns.map((col, index) => (
                                        <th
                                            key={index}
                                            className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b"
                                        >
                                            {col.title}
                                        </th>
                                    ))}
                                    {!isViewMode && (
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                                            Actions
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {layout.rows.map((row, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        {layout.columns.map((col, colIndex) => (
                                            <td
                                                key={colIndex}
                                                className="px-4 py-3 text-sm"
                                            >
                                                {col.render
                                                    ? col.render(row, rowIndex)
                                                    : row[col.key]}
                                            </td>
                                        ))}
                                        {!isViewMode && (
                                            <td className="px-4 py-3 text-sm">
                                                <div className="flex gap-2">
                                                    <CustomButton
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            layout.onEdit?.(
                                                                row,
                                                                rowIndex
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </CustomButton>
                                                    <CustomButton
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() =>
                                                            layout.onDelete?.(
                                                                row,
                                                                rowIndex
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </CustomButton>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {!isViewMode && layout.onAdd && (
                            <div className="mt-4">
                                <CustomButton
                                    variant="outline"
                                    onClick={layout.onAdd}
                                    className="w-full"
                                >
                                    + Add New Row
                                </CustomButton>
                            </div>
                        )}
                    </div>
                );

            case "custom":
                return layout.render
                    ? layout.render(
                          fields,
                          formData,
                          handleInputChange,
                          isViewMode
                      )
                    : null;

            default:
                return (
                    <div className="space-y-4">
                        {fields.map((field) => renderField(field, isViewMode))}
                    </div>
                );
        }
    };

    return { renderLayout };
};

export default LayoutRenderer;
