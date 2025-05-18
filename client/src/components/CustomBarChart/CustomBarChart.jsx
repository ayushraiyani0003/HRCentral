import React, { useState, useEffect, useRef } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
    LabelList,
} from "recharts";
import _ from "lodash";
import "./CustomBarChart.css";

const DEFAULT_COLORS = ["#4CAF50", "#2196F3", "#FF5722", "#9C27B0", "#FFEB3B"];
const formatters = {
    number: (value) => value,
    percent: (value) => `${value}%`,
    currency: (value, symbol = "$") => `${symbol}${value}`,
};

const CustomBarChart = ({
    // Data
    data = [],
    keys = [], // Keys for different segments in the bar
    compareKey = null, // Optional key to compare against
    labelKey = "name", // X-axis label key

    // Layout and appearance
    layout = "vertical", // 'vertical' or 'horizontal'
    barSize = 20,
    barGap = 2,
    barPadding = 1,
    roundedBars = false,
    barRadius = 5, // Used when roundedBars is true
    isGridDisplay = false,

    // Colors
    colors = DEFAULT_COLORS,
    colorByData = false, // If true, colors bars based on data values
    colorFn = null, // Custom function to determine bar colors

    // Axis configuration
    showXAxis = true,
    showYAxis = true,
    xAxisLabel = "",
    yAxisLabel = "",
    gridLines = true,
    tickRotation = 0,
    xTickFormatter = null,
    yTickFormatter = null,
    yDomain = [0, "auto"], // Can be 'auto' or specific number

    // Units and formatting
    unit = "number", // 'number', 'percent', 'currency'
    unitSymbol = "$",
    customFormatter = null,

    // Labels
    showLabels = false,
    labelPosition = "top", // 'top', 'center', 'bottom'
    labelFormatter = null,

    // Interactive features
    onBarClick = null,
    highlightOnHover = true,

    // Legend
    showLegend = true,
    legendPosition = "bottom", // 'top', 'right', 'bottom', 'left'
    legendLayout = "horizontal", // 'horizontal' or 'vertical'
    customLegend = null,

    // Responsiveness
    height = 400,
    minWidth = 300,
    responsive = true,

    // Tooltip
    tooltipFormatter = null,
    customTooltip = null,

    // Sorting
    sortBy = null, // null, 'value', 'label'
    sortDirection = "asc", // 'asc' or 'desc'

    // Stacking
    stacked = false,

    // Animation
    animationDuration = 300,

    // Thresholds
    thresholds = [],

    // Scrolling behavior
    xScrollable = false,

    // Additional classes and styles
    className = "",
    style = {},

    //Tick
    yTickCount = 5,

    // Reference lines
    referenceLines = [],
}) => {
    const [processedData, setProcessedData] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);

    // Process and prepare data
    useEffect(() => {
        let newData = [...data];

        // Handle sorting if needed
        if (sortBy) {
            if (sortBy === "label") {
                newData = _.orderBy(newData, [labelKey], [sortDirection]);
            } else if (sortBy === "value" && keys.length > 0) {
                newData = _.orderBy(newData, [keys[0]], [sortDirection]);
            } else if (typeof sortBy === "function") {
                newData = _.orderBy(newData, [sortBy], [sortDirection]);
            }
        }

        setProcessedData(newData);
    }, [data, sortBy, sortDirection, labelKey, keys]);

    // Handle container resizing
    useEffect(() => {
        if (!responsive || !containerRef.current) return;

        const handleResize = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.clientWidth);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [responsive]);

    // Format value based on unit type
    const formatValue = (value) => {
        if (customFormatter && typeof customFormatter === "function") {
            return customFormatter(value);
        }

        if (unit === "currency") {
            return formatters[unit](value, unitSymbol);
        }

        if (unit === "percent") {
            // Assuming your percent formatter expects value as decimal (e.g. 0.25 for 25%)
            return formatters[unit](value);
        }

        // For 'number' or any other allowed unit just call the formatter with value
        return formatters[unit](value);
    };

    // Handle bar click events
    const handleBarClick = (data, index) => {
        if (onBarClick && typeof onBarClick === "function") {
            onBarClick(data, index);
        }
    };

    // Handle bar hover
    const handleBarMouseEnter = (_, index) => {
        if (highlightOnHover) {
            setActiveIndex(index);
        }
    };

    const handleBarMouseLeave = () => {
        if (highlightOnHover) {
            setActiveIndex(null);
        }
    };

    // Custom label component
    const CustomLabel = (props) => {
        const { x, y, width, height, value, index } = props;

        // Determine label position
        let labelX = x + width / 2;
        let labelY;

        switch (labelPosition) {
            case "top":
                labelY = y - 10;
                break;
            case "center":
                labelY = y + height / 2;
                break;
            case "bottom":
                labelY = y + height + 10;
                break;
            default:
                labelY = y - 10;
        }

        // Format the label value
        const formattedValue = labelFormatter
            ? labelFormatter(value, processedData[index])
            : formatValue(value);

        return (
            <text
                x={labelX}
                y={labelY}
                fill="#333"
                textAnchor="middle"
                dominantBaseline={
                    labelPosition === "center" ? "middle" : "auto"
                }
                fontSize={12}
            >
                {formattedValue}
            </text>
        );
    };

    // Custom tooltip component
    const CustomTooltipComponent = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null;

        if (customTooltip && typeof customTooltip === "function") {
            return customTooltip({ active, payload, label });
        }

        return (
            <div
                className="custom-tooltip"
                style={{
                    background: "#fff",
                    borderRadius: "8px",
                    padding: "6px 8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    color: "#333",
                    minWidth: "130px",
                    pointerEvents: "none",
                    userSelect: "none",
                }}
            >
                <p
                    className="label"
                    style={{
                        margin: 0,
                        marginBottom: "4px",
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "#222",
                        borderBottom: "1px solid #eee",
                        paddingBottom: "0px",
                    }}
                >
                    {label}
                </p>
                {payload.map((entry, index) => (
                    <p
                        key={index}
                        style={{
                            margin: "0 0",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            color: "#555",
                        }}
                    >
                        <span>{entry.name}</span>
                        <span
                            style={{
                                fontWeight: 500,
                                color: entry.color,
                                marginLeft: "12px",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {tooltipFormatter
                                ? tooltipFormatter(entry.value, entry.payload)
                                : formatValue(entry.value)}
                        </span>
                    </p>
                ))}
            </div>
        );
    };

    // Determine chart orientation and axis setup
    const isHorizontal = layout === "horizontal";

    // Get color for each bar segment
    const getBarColor = (dataKey, dataIndex, value) => {
        if (colorFn && typeof colorFn === "function") {
            return colorFn(processedData[dataIndex], dataKey, value);
        }

        const keyIndex = keys.indexOf(dataKey);
        return colors[keyIndex % colors.length];
    };

    // Calculate chart dimensions
    const chartWidth = xScrollable
        ? Math.max(minWidth, data.length * (barSize + barGap) * keys.length)
        : "100%";

    const generateTicks = (min, max, count) => {
        const step = (max - min) / (count - 1);
        return Array.from({ length: count }, (_, i) =>
            Math.round(min + i * step)
        );
    };
    const [minY, maxY] = yDomain[1] === "auto" ? [0, 100] : yDomain; // fallback example
    const yTicks = generateTicks(minY, maxY, yTickCount); // 8 ticks, adjust as needed

    const GappedBar = (props) => {
        const { x, y, width, height, fill } = props;
        const gap = 2; // Adjust gap between stacked segments

        return (
            <rect
                x={x}
                y={y + gap / 2}
                width={width}
                height={Math.max(0, height - gap)}
                fill={fill}
                rx={roundedBars ? barRadius : 0}
                ry={roundedBars ? barRadius : 0}
            />
        );
    };

    return (
        <div
            ref={containerRef}
            className={`custom-bar-chart-container ${className}`}
            style={{
                width: "100%",
                height: typeof height === "number" ? `${height}px` : height,
                overflow: xScrollable ? "auto" : "hidden",
                ...style,
            }}
        >
            <ResponsiveContainer
                width={responsive ? "100%" : chartWidth}
                height="100%"
            >
                <BarChart
                    data={processedData}
                    layout={layout}
                    margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
                    barGap={barGap}
                    barSize={barSize}
                >
                    {isGridDisplay && (
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    )}
                    {/* Grid Lines */}
                    {gridLines && (
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    )}

                    {/* X-Axis */}
                    {showXAxis && (
                        <XAxis
                            dataKey={labelKey}
                            type={isHorizontal ? "category" : "number"}
                            angle={tickRotation}
                            textAnchor={tickRotation !== 0 ? "end" : "middle"}
                            height={60}
                            label={
                                xAxisLabel
                                    ? {
                                          value: xAxisLabel,
                                          position: "bottom",
                                          offset: -20,
                                      }
                                    : null
                            }
                            tickMargin={8}
                            tickFormatter={xTickFormatter || undefined}
                        />
                    )}

                    {/* Y-Axis */}
                    {showYAxis && (
                        <YAxis
                            type={isHorizontal ? "number" : "category"}
                            domain={yDomain[1] === "auto" ? undefined : yDomain}
                            label={
                                yAxisLabel
                                    ? {
                                          value: yAxisLabel,
                                          angle: -90,
                                          position: "center",
                                          offset: 0, // keep offset at 0 or small
                                          dx: -50, // move label left (-) or right (+)
                                      }
                                    : null
                            }
                            ticks={unit === "percent" ? yTicks : undefined}
                            tickMargin={8}
                            tickFormatter={
                                yTickFormatter ||
                                ((value) => formatValue(value))
                            }
                        />
                    )}

                    {/* Tooltip */}
                    <Tooltip content={<CustomTooltipComponent />} />

                    {/* Legend */}
                    {showLegend && !customLegend && (
                        <Legend
                            layout={legendLayout}
                            verticalAlign={
                                legendPosition.includes("top")
                                    ? "top"
                                    : legendPosition.includes("bottom")
                                    ? "bottom"
                                    : "bottom"
                            }
                            align={
                                legendPosition.includes("left")
                                    ? "left"
                                    : legendPosition.includes("right")
                                    ? "right"
                                    : "center"
                            }
                            wrapperStyle={{
                                paddingTop: legendPosition === "0",
                                top: legendPosition.includes("top")
                                    ? 0
                                    : undefined,
                                left: 60,
                            }}
                        />
                    )}

                    {/* Custom Legend if provided */}
                    {showLegend && customLegend && (
                        <Legend content={customLegend} />
                    )}
                    {/* Bars for each key */}
                    {keys.map((key, keyIndex) => (
                        <Bar
                            key={key}
                            dataKey={key}
                            fill={colors[keyIndex % colors.length]}
                            stackId={stacked ? "stack" : undefined}
                            radius={
                                roundedBars
                                    ? [
                                          barRadius,
                                          barRadius,
                                          barRadius,
                                          barRadius,
                                      ]
                                    : 0
                            }
                            shape={<GappedBar />}
                            onClick={handleBarClick}
                            onMouseEnter={handleBarMouseEnter}
                            onMouseLeave={handleBarMouseLeave}
                            animationDuration={animationDuration}
                            isAnimationActive={animationDuration > 0}
                        >
                            {/* Show labels if enabled */}
                            {showLabels && (
                                <LabelList
                                    dataKey={key}
                                    position={labelPosition}
                                    content={<CustomLabel />}
                                />
                            )}

                            {/* Only add Cells if colorByData is true, otherwise use the color from colors array */}
                            {colorByData
                                ? processedData.map((entry, index) => (
                                      <div className="mb-1">
                                          <Cell
                                              key={`cell-${index}`}
                                              fill={getBarColor(
                                                  key,
                                                  index,
                                                  entry[key]
                                              )}
                                              opacity={
                                                  activeIndex === null ||
                                                  activeIndex === index
                                                      ? 1
                                                      : 0.6
                                              }
                                          />
                                      </div>
                                  ))
                                : null}
                        </Bar>
                    ))}

                    {/* Comparison bar if compareKey is provided */}
                    {compareKey && (
                        <Bar
                            dataKey={compareKey}
                            fill="#ff0000" // Red for comparison
                            radius={
                                roundedBars
                                    ? [
                                          barRadius,
                                          barRadius,
                                          barRadius,
                                          barRadius,
                                      ]
                                    : 0
                            }
                            onClick={handleBarClick}
                            opacity={0.7}
                            animationDuration={animationDuration}
                            isAnimationActive={animationDuration > 0}
                        >
                            {showLabels && (
                                <LabelList
                                    dataKey={compareKey}
                                    position={labelPosition}
                                    content={<CustomLabel />}
                                />
                            )}
                        </Bar>
                    )}

                    {/* Reference Lines for thresholds */}
                    {thresholds.map((threshold, index) => (
                        <ReferenceLine
                            key={`threshold-${index}`}
                            y={isHorizontal ? threshold.value : undefined}
                            x={isHorizontal ? undefined : threshold.value}
                            stroke={threshold.color || "#ff0000"}
                            strokeDasharray={threshold.strokeDasharray || "3 3"}
                            label={threshold.label || ""}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>

            {/* Custom Legend if positioned outside the chart */}
            {showLegend && customLegend && legendPosition === "outside" && (
                <div className="custom-legend-container">{customLegend()}</div>
            )}
        </div>
    );
};

export default CustomBarChart;
