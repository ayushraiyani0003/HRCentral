import React from "react";
/**
 * DashedLine - A reusable component for rendering customizable dashed lines
 *
 * @param {Object} props
 * @param {string} props.orientation - "horizontal" or "vertical"
 * @param {string} props.color - CSS color value (e.g., "#d1d5db" for gray-300)
 * @param {number} props.dashWidth - Width of each dash in pixels
 * @param {number} props.dashGap - Gap between dashes in pixels
 * @param {number} props.thickness - Line thickness in pixels
 * @param {string} props.className - Additional classes
 * @param {boolean} props.debug - Enable debug mode with visible borders
 */
const DashedLine = ({
  orientation = "horizontal",
  color = "#d1d5db", // Direct CSS color value
  dashWidth = 4,
  dashGap = 2,
  thickness = 1,
  className = "",
  debug = false,
}) => {
  const isHorizontal = orientation === "horizontal";
  // Ensure values are treated as numbers
  const dashWidthNum = Number(dashWidth);
  const dashGapNum = Number(dashGap);
  const thicknessNum = Number(thickness);
  
  return (
    <div
      className={`
        ${isHorizontal ? "w-full" : "h-full"}
        ${debug ? "border border-red-500" : ""}
        ${className}
      `}
      style={{
        backgroundImage: `
          repeating-linear-gradient(
            ${isHorizontal ? "to right" : "to bottom"},
            transparent,
            transparent ${dashGapNum}px,
            ${color} ${dashGapNum}px,
            ${color} ${dashGapNum + dashWidthNum}px
          )
        `,
        height: isHorizontal ? `${thicknessNum}px` : "100%",
        width: isHorizontal ? "100%" : `${thicknessNum}px`,
        display: "inline-block",
        alignSelf: "stretch",
      }}
    />
  );
};

export default DashedLine;