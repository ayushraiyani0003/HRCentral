import React from "react";

import useCompanyGraphTab from "../../hooks/useCompanyGraphTab";

// Mock CustomContainer component since it's not available
const CustomContainer = ({ children, title, className = "", ...props }) => (
    <div className={` ${className}`} {...props}>
        {title && (
            <div className="px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
        )}
        <div className="p-6">{children}</div>
    </div>
);

function CompanyGraphTab() {
    const { svgRef, levelColors, handleResetZoom } = useCompanyGraphTab();

    return (
        <CustomContainer title="Company Organization Chart" className="w-full">
            <div className="w-full">
                <div className="mb-4 flex flex-wrap gap-4 text-sm">
                    {levelColors.map(([level, color]) => (
                        <div key={level} className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: color }}
                            ></div>
                            <span>{level}</span>
                        </div>
                    ))}
                </div>

                <div className="mb-4">
                    <button
                        onClick={handleResetZoom}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                        Reset Zoom
                    </button>
                </div>

                <div className="w-full overflow-hidden border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <svg
                        ref={svgRef}
                        className="w-full cursor-move"
                        style={{ minWidth: "1400px", minHeight: "900px" }}
                    ></svg>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                    <p>
                        <strong>Instructions:</strong>
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>
                            <strong>Zoom:</strong> Use mouse wheel to zoom
                            in/out (10% - 300%)
                        </li>
                        <li>
                            <strong>Pan:</strong> Click and drag to move around
                            the chart
                        </li>
                        <li>
                            <strong>Reset:</strong> Click "Reset Zoom" button to
                            return to original view
                        </li>
                        <li>
                            <strong>Expand/Collapse:</strong> Click on nodes
                            with children to expand/collapse branches
                        </li>
                        <li>
                            Nodes with collapsed children appear darker with a
                            thicker border
                        </li>
                        <li>
                            Hover over leaf nodes (no children) to see
                            interactive effects
                        </li>
                        <li>
                            Colors are defined individually for each node in the
                            data
                        </li>
                        <li>
                            Hierarchy: Company → Head Office → Regional Office →
                            Department → Unit → Sub Unit
                        </li>
                    </ul>
                </div>
            </div>
        </CustomContainer>
    );
}

export default CompanyGraphTab;
