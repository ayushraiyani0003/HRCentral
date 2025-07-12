import React, { useState, useEffect } from "react";

const FlexibleDragZones = ({ components, onLayoutChange }) => {
  // Available zone widths
  const zoneWidths = {
    "xs": "w-full sm:w-1/4", 
    "sm": "w-full sm:w-1/3",
    "md": "w-full sm:w-1/2",
    "lg": "w-full sm:w-2/3",
    "xl": "w-full sm:w-3/4",
    "full": "w-full"
  };

  // Initial empty zones setup
  const initialZones = [
    { id: "zone-1", width: "md", components: [] },
    { id: "zone-2", width: "md", components: [] },
    { id: "zone-3", width: "full", components: [] },
    { id: "zone-4", width: "xs", components: [] },
    { id: "zone-5", width: "lg", components: [] },
    { id: "zone-6", width: "sm", components: [] }
  ];

  const [zones, setZones] = useState(initialZones);
  const [draggedItem, setDraggedItem] = useState(null);
  const [hoveredZone, setHoveredZone] = useState(null);
  const [dragSource, setDragSource] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggedItem) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      if (draggedItem && hoveredZone) {
        moveComponent(draggedItem, dragSource, hoveredZone);
      }
      setDraggedItem(null);
      setHoveredZone(null);
      setDragSource(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggedItem, hoveredZone, dragSource]);

  // Move component between zones
  const moveComponent = (componentId, sourceZoneId, targetZoneId) => {
    if (sourceZoneId === targetZoneId) return;
    
    setZones(prevZones => {
      const newZones = [...prevZones];
      
      // Find source and target zones
      const sourceZone = newZones.find(zone => zone.id === sourceZoneId);
      const targetZone = newZones.find(zone => zone.id === targetZoneId);
      
      // Remove component from source zone
      if (sourceZone) {
        sourceZone.components = sourceZone.components.filter(id => id !== componentId);
      }
      
      // Add component to target zone
      if (targetZone) {
        targetZone.components = [...targetZone.components, componentId];
      }
      
      // Notify parent component about layout change
      if (onLayoutChange) {
        const newLayout = {};
        newZones.forEach(zone => {
          newLayout[zone.id] = zone.components;
        });
        onLayoutChange(newLayout);
      }
      
      return newZones;
    });
  };

  // Handle drag start
  const handleDragStart = (e, componentId, zoneId) => {
    setDraggedItem(componentId);
    setDragSource(zoneId);
    
    // Calculate offset from mouse position to element
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    e.preventDefault();
  };

  // Handle zone hover
  const handleZoneHover = (zoneId) => {
    if (draggedItem) {
      setHoveredZone(zoneId);
    }
  };

  // Handle zone leave
  const handleZoneLeave = () => {
    setHoveredZone(null);
  };

  // Find component details
  const getComponent = (componentId) => {
    return components[componentId] || null;
  };

  // Add a new empty zone
  const addEmptyZone = (width = "md") => {
    const newZoneId = `zone-${zones.length + 1}`;
    setZones([...zones, {
      id: newZoneId,
      width,
      components: []
    }]);
  };

  // Remove a zone
  const removeZone = (zoneId) => {
    setZones(prevZones => {
      // Find the zone to remove
      const zoneToRemove = prevZones.find(zone => zone.id === zoneId);
      
      // If zone has components, move them to the first zone
      if (zoneToRemove && zoneToRemove.components.length > 0) {
        const firstZone = prevZones.find(zone => zone.id !== zoneId);
        if (firstZone) {
          firstZone.components = [...firstZone.components, ...zoneToRemove.components];
        }
      }
      
      return prevZones.filter(zone => zone.id !== zoneId);
    });
  };

  // Change zone width
  const changeZoneWidth = (zoneId, newWidth) => {
    setZones(prevZones => 
      prevZones.map(zone => 
        zone.id === zoneId ? { ...zone, width: newWidth } : zone
      )
    );
  };

  // Floating component that follows cursor during drag
  const FloatingComponent = () => {
    if (!draggedItem) return null;
    
    const component = getComponent(draggedItem);
    if (!component) return null;
    
    return (
      <div 
        className="fixed pointer-events-none z-50"
        style={{
          left: mousePosition.x - dragOffset.x,
          top: mousePosition.y - dragOffset.y,
          opacity: 0.7
        }}
      >
        <div className="border-2 border-blue-400 bg-white rounded-lg shadow-lg p-2">
          {React.cloneElement(component.component, {
            className: "w-64 h-32"
          })}
        </div>
      </div>
    );
  };

  // Render all zones
  return (
    <div className="flex flex-col gap-4">
      {/* Floating component that follows cursor */}
      <FloatingComponent />
      
      {/* Control panel */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-2">Layout Controls</h3>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => addEmptyZone("xs")}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Add Extra Small Zone
          </button>
          <button 
            onClick={() => addEmptyZone("sm")}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Add Small Zone
          </button>
          <button 
            onClick={() => addEmptyZone("md")}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Add Medium Zone
          </button>
          <button 
            onClick={() => addEmptyZone("lg")}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Add Large Zone
          </button>
          <button 
            onClick={() => addEmptyZone("xl")}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Add Extra Large Zone
          </button>
          <button 
            onClick={() => addEmptyZone("full")}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Add Full Width Zone
          </button>
        </div>
      </div>
      
      {/* Flexible zone layout */}
      <div className="flex flex-wrap gap-4">
        {zones.map(zone => (
          <div 
            key={zone.id}
            className={`${zoneWidths[zone.width]} border-2 border-dashed rounded-lg transition-all duration-200 relative
              ${hoveredZone === zone.id && draggedItem ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
            onMouseOver={() => handleZoneHover(zone.id)}
            onMouseLeave={handleZoneLeave}
            data-zone-id={zone.id}
          >
            {/* Zone header with controls */}
            <div className="bg-gray-100 p-2 flex justify-between items-center border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{zone.id}</span>
                <select
                  value={zone.width}
                  onChange={(e) => changeZoneWidth(zone.id, e.target.value)}
                  className="text-xs border rounded px-1 py-0.5"
                >
                  <option value="xs">Extra Small</option>
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                  <option value="xl">Extra Large</option>
                  <option value="full">Full Width</option>
                </select>
              </div>
              <button
                onClick={() => removeZone(zone.id)}
                className="text-xs bg-red-500 text-white px-2 py-0.5 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
            
            {/* Zone content - empty or with components */}
            <div className="p-4 min-h-32">
              {zone.components.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-32 text-gray-400 text-sm">
                  Empty zone - Drag components here
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {zone.components.map(componentId => {
                    const component = getComponent(componentId);
                    if (!component) return null;
                    
                    return (
                      <div 
                        key={componentId}
                        className="relative border border-gray-200 rounded-lg bg-white shadow-sm"
                      >
                        <div 
                          className="absolute top-2 right-2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center cursor-move z-10 hover:bg-blue-500 hover:text-white"
                          onMouseDown={(e) => handleDragStart(e, componentId, zone.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                          </svg>
                        </div>
                        {React.cloneElement(component.component, {
                          className: "w-full h-full !m-0"
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <h4 className="font-semibold text-blue-800 mb-2">
          How to use:
        </h4>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Use the buttons above to add empty zones of different widths</li>
          <li>• Click and drag any component using the drag handle (circle in the top-right)</li>
          <li>• Drop components into empty zones to arrange your dashboard</li>
          <li>• Change zone width using the dropdown in each zone header</li>
          <li>• Remove zones using the "Remove" button (components will be moved to another zone)</li>
          <li>• Zones will stack vertically on mobile and arrange horizontally on larger screens</li>
        </ul>
      </div>
    </div>
  );
};

export default FlexibleDragZones;