import { useState, useEffect, useRef } from "react";

const useDragComponent = ({
    setDashboardLayout,
}) => {
    const [draggedItem, setDraggedItem] = useState(null);
    const [draggedFromZone, setDraggedFromZone] = useState(null);
    const [isLongPress, setIsLongPress] = useState(false);
    const [pressTimer, setPressTimer] = useState(null);
    const [dragStarted, setDragStarted] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [hoveredZone, setHoveredZone] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const dragHandleRef = useRef(null);

    

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isLongPress) {
                setMousePosition({ x: e.clientX, y: e.clientY });

                const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY);
                const dropZone = elementUnderMouse?.closest("[data-drop-zone]");
                if (dropZone) {
                    setHoveredZone(dropZone.getAttribute("data-drop-zone"));
                } else {
                    setHoveredZone(null);
                }
            }
        };

        const handleGlobalMouseUp = () => {
            if (isLongPress && draggedItem && hoveredZone) {
                handleDrop(hoveredZone);
            }

            if (pressTimer) {
                clearTimeout(pressTimer);
                setPressTimer(null);
            }

            setIsLongPress(false);
            setDraggedItem(null);
            setDraggedFromZone(null);
            setDragStarted(false);
            setHoveredZone(null);
        };

        if (isLongPress) {
            document.addEventListener("mousemove", handleMouseMove);
        }
        document.addEventListener("mouseup", handleGlobalMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleGlobalMouseUp);
        };
    }, [isLongPress, draggedItem, hoveredZone, pressTimer]);

    const handleDragHandleMouseDown = (e, componentId, fromZone) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();

        dragHandleRef.current = e.currentTarget;

        const componentRect = e.currentTarget.closest(".draggable-component")?.getBoundingClientRect();
        if (!componentRect) return;

        setDragOffset({
            x: e.clientX - componentRect.left,
            y: e.clientY - componentRect.top,
        });

        const timer = setTimeout(() => {
            setIsLongPress(true);
            setDraggedItem(componentId);
            setDraggedFromZone(fromZone);
            setDragStarted(true);
            setMousePosition({ x: e.clientX, y: e.clientY });
            navigator.vibrate?.(100);
        }, 1000);
        setPressTimer(timer);
    };

    const handleDragHandleMouseUp = (e) => {
        if (dragHandleRef.current === e.currentTarget && pressTimer) {
            clearTimeout(pressTimer);
            setPressTimer(null);
        }
    };

    const handleDragHandleMouseLeave = (e) => {
        if (dragHandleRef.current === e.currentTarget && pressTimer) {
            clearTimeout(pressTimer);
            setPressTimer(null);
        }
    };

    const handleDrop = (toZone) => {
        if (!draggedItem || !draggedFromZone || draggedFromZone === toZone) return;

        setDashboardLayout((prev) => {
            const newLayout = { ...prev };
            newLayout[draggedFromZone] = newLayout[draggedFromZone].filter((item) => item !== draggedItem);
            newLayout[toZone] = [...newLayout[toZone], draggedItem];
            return newLayout;
        });
    };

    useEffect(() => {
        document.body.style.userSelect = isLongPress ? "none" : "";
        document.body.style.cursor = isLongPress ? "grabbing" : "";

        return () => {
            document.body.style.userSelect = "";
            document.body.style.cursor = "";
        };
    }, [isLongPress]);

    return {
        dragStarted,
        draggedItem,
        dragOffset,
        mousePosition,
        isLongPress,
        hoveredZone,
        pressTimer,
        handleDragHandleMouseDown,
        handleDragHandleMouseUp,
        handleDragHandleMouseLeave,
    };
};

export default useDragComponent;
