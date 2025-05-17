import React from "react";
import { CustomContainer,CustomBarChart } from "../../../components";
function PayRollChartCard({
    employeeData,
    unitType,
    customColors,
    legendPosition,
    layout,
    roundedBars,
    tooltipFormatter,
    keys,
    xAxisLabel,
    labelKey,
    yDomain,
  }
) {
    return (
        <CustomContainer 
        className={`!m-0 !px-3 !py-0`}
        >
            <CustomBarChart
                data={employeeData}
                keys={keys}
                labelKey={labelKey}
                unit={unitType}
                stacked={true}
                colors={customColors}
                colorByData={false}
                legendPosition={legendPosition}
                layout={layout}
                roundedBars={roundedBars}
                xTickFormatter={(tick) =>
                    tick.length > 10 ? tick.slice(0, 10) + "..." : tick
                } // if need for overflow the text in ... then
                yTickCount={8}
                tooltipFormatter={tooltipFormatter}
                barSize={40}
                isGridDisplay={true}
                responsive={true}
                showLegend={true}
                showLabels={false}
                xAxisLabel={xAxisLabel}
                yAxisLabel={
                    unitType === "currency"
                        ? "Amount ($)"
                        : unitType === "percent"
                        ? "Percentage (%)"
                        : "Value"
                }
                yDomain={yDomain}
                height={430}
            />
        </CustomContainer>
    );
}

export default PayRollChartCard;
