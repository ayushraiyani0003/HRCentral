import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

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

// Company organizational data with your specified hierarchy
const companyData = {
    name: "TechCorp Global",
    title: "Technology Corporation",
    level: "Company",
    id: "company",
    color: "#8b5cf6",
    children: [
        {
            name: "TechCorp HQ",
            title: "Headquarters Operations",
            level: "Head Office",
            id: "head_office",
            color: "#3b82f6",
            children: [
                {
                    name: "North America Region",
                    title: "North American Operations",
                    level: "Regional Office",
                    id: "regional_office_na",
                    color: "#10b981",
                    children: [
                        {
                            name: "Engineering Department",
                            title: "Software Engineering Division",
                            level: "Department",
                            id: "dept_engineering",
                            color: "#f59e0b",
                            children: [
                                {
                                    name: "Frontend Development Unit",
                                    title: "User Interface Development Team",
                                    level: "Unit",
                                    id: "unit_frontend",
                                    color: "#ef4444",
                                    children: [
                                        {
                                            name: "React Development Sub Unit",
                                            title: "React.js Specialist Team",
                                            level: "Sub Unit",
                                            id: "subunit_react",
                                            color: "#8b5cf6",
                                        },
                                        {
                                            name: "Vue Development Sub Unit",
                                            title: "Vue.js Specialist Team",
                                            level: "Sub Unit",
                                            id: "subunit_vue",
                                            color: "#06b6d4",
                                        },
                                    ],
                                },
                                {
                                    name: "Backend Development Unit",
                                    title: "Server-side Development Team",
                                    level: "Unit",
                                    id: "unit_backend",
                                    color: "#84cc16",
                                    children: [
                                        {
                                            name: "API Development Sub Unit",
                                            title: "REST & GraphQL API Team",
                                            level: "Sub Unit",
                                            id: "subunit_api",
                                            color: "#f97316",
                                        },
                                        {
                                            name: "Database Sub Unit",
                                            title: "Database Management Team",
                                            level: "Sub Unit",
                                            id: "subunit_database",
                                            color: "#ec4899",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            name: "Product Department",
                            title: "Product Management Division",
                            level: "Department",
                            id: "dept_product",
                            color: "#06b6d4",
                            children: [
                                {
                                    name: "Product Strategy Unit",
                                    title: "Strategic Product Planning Team",
                                    level: "Unit",
                                    id: "unit_strategy",
                                    color: "#8b5cf6",
                                    children: [
                                        {
                                            name: "Market Research Sub Unit",
                                            title: "Market Analysis Specialists",
                                            level: "Sub Unit",
                                            id: "subunit_research",
                                            color: "#10b981",
                                        },
                                    ],
                                },
                                {
                                    name: "UX/UI Design Unit",
                                    title: "User Experience Design Team",
                                    level: "Unit",
                                    id: "unit_design",
                                    color: "#f59e0b",
                                    children: [
                                        {
                                            name: "Visual Design Sub Unit",
                                            title: "Visual Interface Design Team",
                                            level: "Sub Unit",
                                            id: "subunit_visual",
                                            color: "#ef4444",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "Europe Region",
                    title: "European Operations",
                    level: "Regional Office",
                    id: "regional_office_eu",
                    color: "#84cc16",
                    children: [
                        {
                            name: "Sales Department",
                            title: "Sales and Revenue Division",
                            level: "Department",
                            id: "dept_sales_eu",
                            color: "#f97316",
                            children: [
                                {
                                    name: "Enterprise Sales Unit",
                                    title: "Large Enterprise Sales Team",
                                    level: "Unit",
                                    id: "unit_enterprise",
                                    color: "#ec4899",
                                    children: [
                                        {
                                            name: "Key Accounts Sub Unit",
                                            title: "Strategic Account Management",
                                            level: "Sub Unit",
                                            id: "subunit_accounts",
                                            color: "#8b5cf6",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            name: "Marketing Department",
                            title: "Marketing and Communications Division",
                            level: "Department",
                            id: "dept_marketing_eu",
                            color: "#06b6d4",
                            children: [
                                {
                                    name: "Digital Marketing Unit",
                                    title: "Online Marketing Team",
                                    level: "Unit",
                                    id: "unit_digital_marketing",
                                    color: "#10b981",
                                    children: [
                                        {
                                            name: "SEO Sub Unit",
                                            title: "Search Engine Optimization Team",
                                            level: "Sub Unit",
                                            id: "subunit_seo",
                                            color: "#f59e0b",
                                        },
                                        {
                                            name: "Social Media Sub Unit",
                                            title: "Social Media Management Team",
                                            level: "Sub Unit",
                                            id: "subunit_social",
                                            color: "#ef4444",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};

function CompanyGraphTab() {
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous render

        const width = 1400;
        const height = 900;
        const margin = { top: 20, right: 150, bottom: 20, left: 150 };

        svg.attr("width", width).attr("height", height);

        // Create zoom behavior
        const zoom = d3
            .zoom()
            .scaleExtent([0.1, 3]) // Allow zoom from 10% to 300%
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });

        // Apply zoom to SVG
        svg.call(zoom);

        // Create a group for the chart content
        const g = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Create tree layout
        const tree = d3
            .tree()
            .size([
                height - margin.top - margin.bottom,
                width - margin.left - margin.right,
            ]);

        // Create hierarchy
        const root = d3.hierarchy(companyData);

        // Initialize collapsed state
        root.descendants().forEach((d) => {
            if (d.children) {
                d._children = d.children;
                if (d.depth > 2) {
                    // Start with nodes beyond level 2 collapsed
                    d.children = null;
                }
            }
        });

        // Function to collapse/expand nodes
        function toggle(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
        }

        // Function to update the tree
        function update(source) {
            tree(root);

            // Add links
            const link = g
                .selectAll(".link")
                .data(root.links(), (d) => d.target.id);

            link.exit().remove();

            const linkEnter = link
                .enter()
                .append("path")
                .attr("class", "link")
                .attr("fill", "none")
                .attr("stroke", "#ccc")
                .attr("stroke-width", 2);

            link.merge(linkEnter)
                .transition()
                .duration(300)
                .attr(
                    "d",
                    d3
                        .linkHorizontal()
                        .x((d) => d.y)
                        .y((d) => d.x)
                );

            // Add nodes
            const node = g
                .selectAll(".node")
                .data(root.descendants(), (d) => d.id || (d.id = ++i));

            node.exit().remove();

            const nodeEnter = node
                .enter()
                .append("g")
                .attr("class", "node")
                .attr(
                    "transform",
                    (d) => `translate(${source.y0 || d.y},${source.x0 || d.x})`
                )
                .style("cursor", (d) => (d._children ? "pointer" : "default"));

            // Add circles for nodes
            nodeEnter
                .append("circle")
                .attr("r", 1e-6)
                .attr("fill", (d) => d.data.color) // Use color from data
                .attr("stroke", "#fff")
                .attr("stroke-width", 2);

            // Add text labels (name)
            nodeEnter
                .append("text")
                .attr("dy", ".35em")
                .attr("x", (d) => (d.children || d._children ? -15 : 15))
                .style("text-anchor", (d) =>
                    d.children || d._children ? "end" : "start"
                )
                .style("font-size", "12px")
                .style("font-weight", "600")
                .style("fill", "#374151")
                .text((d) => d.data.name);

            // Add title labels
            nodeEnter
                .append("text")
                .attr("dy", "1.5em")
                .attr("x", (d) => (d.children || d._children ? -15 : 15))
                .style("text-anchor", (d) =>
                    d.children || d._children ? "end" : "start"
                )
                .style("font-size", "10px")
                .style("fill", "#6b7280")
                .text((d) => d.data.title);

            // Add level labels
            nodeEnter
                .append("text")
                .attr("dy", "2.7em")
                .attr("x", (d) => (d.children || d._children ? -15 : 15))
                .style("text-anchor", (d) =>
                    d.children || d._children ? "end" : "start"
                )
                .style("font-size", "9px")
                .style("fill", "#9ca3af")
                .style("font-style", "italic")
                .text((d) => d.data.level);

            // Merge enter and update selections
            const nodeUpdate = nodeEnter.merge(node);

            // Transition nodes to their new position
            nodeUpdate
                .transition()
                .duration(300)
                .attr("transform", (d) => `translate(${d.y},${d.x})`);

            // Update circle appearance based on children state
            nodeUpdate
                .select("circle")
                .transition()
                .duration(300)
                .attr("r", 10)
                .attr("fill", (d) => {
                    const baseColor = d.data.color;
                    return d._children
                        ? d3.color(baseColor).darker(0.3)
                        : baseColor;
                })
                .attr("stroke-width", (d) => (d._children ? 3 : 2));

            // Add click event for node expansion/collapse
            nodeUpdate
                .on("click", function (event, d) {
                    // Prevent zoom behavior when clicking on nodes
                    event.stopPropagation();
                    if (d._children || d.children) {
                        toggle(d);
                        update(d);
                    }
                })
                .on("mouseover", function (event, d) {
                    if (!d._children && !d.children) {
                        // Only hover effect for leaf nodes
                        d3.select(this)
                            .select("circle")
                            .transition()
                            .duration(200)
                            .attr("r", 14)
                            .attr("stroke-width", 3);
                    }
                })
                .on("mouseout", function (event, d) {
                    if (!d._children && !d.children) {
                        // Only hover effect for leaf nodes
                        d3.select(this)
                            .select("circle")
                            .transition()
                            .duration(200)
                            .attr("r", 10)
                            .attr("stroke-width", 2);
                    }
                });

            // Store the old positions for transition
            root.descendants().forEach((d) => {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }

        let i = 0;
        update(root);

        // Add reset zoom button functionality
        const resetZoom = () => {
            svg.transition()
                .duration(750)
                .call(
                    zoom.transform,
                    d3.zoomIdentity.translate(margin.left, margin.top)
                );
        };

        // Store reset function for potential external access
        svg.node().resetZoom = resetZoom;
    }, []);

    const handleResetZoom = () => {
        const svg = d3.select(svgRef.current);
        if (svg.node().resetZoom) {
            svg.node().resetZoom();
        }
    };

    // Get unique levels and their colors for legend
    const getLevelsWithColors = (data) => {
        const levels = new Map();

        const traverse = (node) => {
            if (node.level && node.color) {
                levels.set(node.level, node.color);
            }
            if (node.children) {
                node.children.forEach(traverse);
            }
        };

        traverse(data);
        return Array.from(levels.entries());
    };

    const levelColors = getLevelsWithColors(companyData);

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
