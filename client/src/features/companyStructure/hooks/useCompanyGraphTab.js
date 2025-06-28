import { useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as d3 from "d3";
import { useToast } from "../../../components";
import {
    fetchAllCompanyStructures,
    selectCompanyStructures,
    selectLoading,
    selectErrors,
    selectPagination,
    selectFilters,
} from "../../../store/CompanyStructureSlice";

import {
    fetchCountries,
    selectCountries,
    selectLoading as selectCountriesLoading,
    selectError as selectCountriesError,
} from "../../../store/countrySlice";

const useCompanyGraphTab = () => {
    const svgRef = useRef();
    const dispatch = useDispatch();
    const { addToast } = useToast();

    // Redux state selectors
    const companyStructureData = useSelector(selectCompanyStructures);
    const loading = useSelector(selectLoading);
    const errors = useSelector(selectErrors);
    const pagination = useSelector(selectPagination);
    const filters = useSelector(selectFilters);

    // Countries data
    const countries = useSelector(selectCountries);
    const countriesLoading = useSelector(selectCountriesLoading);
    const countriesError = useSelector(selectCountriesError);

    // Process countries data
    const processedCountries = useMemo(() => {
        try {
            // selectCountries already returns an array, so we can use it directly
            return Array.isArray(countries) ? countries : [];
        } catch (error) {
            console.warn("Error accessing countries:", error);
            return [];
        }
    }, [countries]);

    // Create a map of country ID to country data for quick lookup
    const countryMap = useMemo(() => {
        const map = {};
        processedCountries.forEach((country) => {
            const id = country.id || country.uuid || country.countryId;
            if (id) {
                map[id] = {
                    name: country.name,
                    code: country.code || country.countryCode,
                    phoneCode: country.phone_code,
                    region: country.region,
                    ...country,
                };
            }
        });
        return map;
    }, [processedCountries]);

    // Function to assign colors based on level/type
    const getColorByLevel = (level) => {
        const colorMap = {
            company: "#8b5cf6",
            "head office": "#3b82f6",
            "regional office": "#3b82f6",
            department: "#f59e0b",
            unit: "#ef4444",
            "sub unit": "#06b6d4",
            branch: "#84cc16",
            division: "#f97316",
            section: "#ec4899",
            team: "#6366f1",
            group: "#14b8a6",
            "unknown level": "#6b7280",
        };

        return colorMap[level.toLowerCase()] || colorMap["Unknown Level"];
    };

    // Transform flat company structure data into hierarchical tree structure
    const companyData = useMemo(() => {
        if (!companyStructureData || companyStructureData.length === 0) {
            return null;
        }

        // Create a map for quick lookup
        const structureMap = {};
        const enhancedData = companyStructureData.map((item) => {
            const countryId =
                item.countryId || item.country_id || item.countryID;
            const countryInfo = countryMap[countryId];

            const enhanced = {
                ...item,
                id: item.id || item.uuid || item.structureId,
                name: item.name || "Unnamed Structure",
                // title:
                //     item.description ||
                //     item.title ||
                //     item.type ||
                //     "No Description",
                level: item.type || item.level || "Unknown Level",
                color: getColorByLevel(
                    item.type || item.level || "Unknown Level"
                ),
                countryName:
                    countryInfo?.name || item.country || "Unknown Country",
                parentId:
                    item.parentId || item.parent_id || item.parentID || null,
                children: [],
            };

            structureMap[enhanced.id] = enhanced;
            return enhanced;
        });

        // Build the hierarchy
        const rootNodes = [];

        enhancedData.forEach((item) => {
            if (item.parentId && structureMap[item.parentId]) {
                // Add to parent's children
                structureMap[item.parentId].children.push(item);
            } else {
                // This is a root node
                rootNodes.push(item);
            }
        });

        // If we have multiple root nodes, create a virtual root
        if (rootNodes.length > 1) {
            return {
                id: "virtual-root",
                name: "Company Structure",
                title: "Organizational Hierarchy",
                level: "Root",
                color: "#8b5cf6",
                children: rootNodes,
            };
        } else if (rootNodes.length === 1) {
            return rootNodes[0];
        }

        // Fallback: create a simple structure if no hierarchy is found
        return {
            id: "fallback-root",
            name: "Company Structure",
            title: "Organizational Hierarchy",
            level: "Root",
            color: "#8b5cf6",
            children: enhancedData.map((item) => ({
                ...item,
                children: [],
            })),
        };
    }, [companyStructureData, countryMap]);

    // Function to get unique levels and their colors for legend
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

        if (data) {
            traverse(data);
        }
        return Array.from(levels.entries());
    };

    const levelColors = getLevelsWithColors(companyData);

    // Error handling
    useEffect(() => {
        if (errors) {
            if (errors.fetch) {
                const errorMsg =
                    errors.fetch.message || "Failed to load company structures";
                const errorCode =
                    errors.fetch.code || errors.fetch.status || "";
                addToast(
                    `${errorCode ? `Error ${errorCode}: ` : ""}${errorMsg}`,
                    "error",
                    8000
                );
            }
        }
    }, [errors, addToast]);

    // Fetch company structures on component mount
    useEffect(() => {
        if (companyStructureData.length === 0 && !loading.entities) {
            dispatch(
                fetchAllCompanyStructures({
                    page: pagination.currentPage,
                    pageSize: pagination.pageSize,
                    ...filters,
                })
            ).catch((error) => {
                const errorMsg =
                    error.message || "Failed to load company structures";
                addToast(errorMsg, "error", 8000);
            });
        }
    }, [
        dispatch,
        companyStructureData.length,
        loading.entities,
        pagination.currentPage,
        pagination.pageSize,
        filters,
        addToast,
    ]);
    useEffect(() => {
        if (countriesError) {
            const errorMsg = countriesError || "Failed to load countries";
            addToast(`Country Error: ${errorMsg}`, "warning", 6000);
        }
    }, [countriesError, addToast]);
    // Fetch countries when we have company structure data
    useEffect(() => {
        if (
            companyStructureData.length > 0 &&
            processedCountries.length === 0 &&
            !countriesLoading?.fetch // Updated to use the correct loading property
        ) {
            dispatch(fetchCountries())
                .unwrap() // Use unwrap() for better error handling
                .then(() => {
                    console.log("Countries fetched successfully");
                })
                .catch((error) => {
                    const errorMsg = error || "Failed to load country data";
                    addToast(`Country Error: ${errorMsg}`, "warning", 6000);
                });
        }
    }, [
        dispatch,
        companyStructureData.length,
        processedCountries.length,
        countriesLoading?.fetch, // Updated property access
        addToast,
    ]);

    // Function to handle zoom reset
    const handleResetZoom = () => {
        const svg = d3.select(svgRef.current);
        if (svg.node().resetZoom) {
            svg.node().resetZoom();
        }
    };

    // Function to refresh data
    const handleRefreshData = () => {
        dispatch(
            fetchAllCompanyStructures({
                page: pagination.currentPage,
                pageSize: pagination.pageSize,
                ...filters,
            })
        )
            .then((result) => {
                if (result.type.endsWith("/fulfilled")) {
                    addToast(
                        "Company structure data refreshed successfully!",
                        "success",
                        4000
                    );
                }
            })
            .catch((error) => {
                const errorMsg = error.message || "Failed to refresh data";
                addToast(errorMsg, "error", 6000);
            });
    };

    // Main D3 effect for rendering the graph
    useEffect(() => {
        if (!companyData) {
            return; // Don't render if no data
        }

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous render

        const width = 1400;
        const height = 900;
        const margin = { top: 20, right: 150, bottom: 20, left: 150 };

        svg.attr("width", width).attr("height", height);

        // Create zoom behavior
        const zoom = d3
            .zoom()
            .scaleExtent([0.1, 3])
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
                .attr("fill", (d) => d.data.color)
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
                .attr("dy", "1.85em")
                .attr("x", (d) => (d.children || d._children ? -15 : 15))
                .style("text-anchor", (d) =>
                    d.children || d._children ? "end" : "start"
                )
                .style("font-size", "10px")
                .style("fill", "#6b7280")
                .text((d) => d.data.level);

            // Add level labels
            // nodeEnter
            //     .append("text")
            //     .attr("dy", "2.7em")
            //     .attr("x", (d) => (d.children || d._children ? -15 : 15))
            //     .style("text-anchor", (d) =>
            //         d.children || d._children ? "end" : "start"
            //     )
            //     .style("font-size", "10px")
            //     .style("fill", "#9ca3af")
            //     .style("font-style", "italic")
            //     .text((d) => d.data.level);

            // Add country labels if available
            nodeEnter
                .append("text")
                .attr("dy", "3.9em")
                .attr("x", (d) => (d.children || d._children ? -15 : 15))
                .style("text-anchor", (d) =>
                    d.children || d._children ? "end" : "start"
                )
                .style("font-size", "8px")
                .style("fill", "#9ca3af")
                .style("font-style", "italic")
                .text((d) =>
                    d.data.countryName &&
                    d.data.countryName !== "Unknown Country"
                        ? d.data.countryName
                        : ""
                );

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
                    event.stopPropagation();
                    if (d._children || d.children) {
                        toggle(d);
                        update(d);
                    }
                })
                .on("mouseover", function (event, d) {
                    if (!d._children && !d.children) {
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
    }, [companyData]);

    return {
        svgRef,
        levelColors,
        handleResetZoom,
        handleRefreshData,
        companyData,
        loading: loading?.entities || false,
        errors,
        hasData: companyData !== null,
        dataCount: companyStructureData?.length || 0,
        // Add country-related returns if needed
        countriesLoading: countriesLoading?.fetch || false,
        countriesError,
    };
};

export default useCompanyGraphTab;
