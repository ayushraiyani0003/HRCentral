import React, { useState, useEffect } from "react";
import "./paginationStyles.css";

const Pagination = ({
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    pageSize = 10,
    onPageChange,
    showJumpToPage = false,
    maxVisibleButtons = 5,
    showItemsCount = true,
    variant = "default", // default, rounded, bordered, minimal
    size = "medium", // small, medium, large
    className = "",
    disableNavigation = false,
    itemsRangeLabel = "Showing",
    itemsCountLabel = "of",
    previousLabel = "Previous",
    nextLabel = "Next",
    jumpToPageLabel = "Go to page",
}) => {
    const [inputPage, setInputPage] = useState("");
    const [paginationItems, setPaginationItems] = useState([]);

    // Calculate the visible page buttons based on current page and max buttons
    useEffect(() => {
        // Ensure current page is valid
        const validatedCurrentPage = Math.max(
            1,
            Math.min(currentPage, totalPages)
        );

        // Generate pagination items array
        calculatePaginationItems(validatedCurrentPage);
    }, [currentPage, totalPages, maxVisibleButtons]);

    // Calculate the page items to display
    const calculatePaginationItems = (page) => {
        let items = [];

        // Handle case when we have fewer pages than max buttons
        if (totalPages <= maxVisibleButtons) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(i);
            }
        } else {
            // Calculate start and end pages
            let startPage = Math.max(
                1,
                page - Math.floor(maxVisibleButtons / 2)
            );
            let endPage = startPage + maxVisibleButtons - 1;

            // Adjust if we're at the end
            if (endPage > totalPages) {
                endPage = totalPages;
                startPage = Math.max(1, endPage - maxVisibleButtons + 1);
            }

            // Add first page with ellipsis if needed
            if (startPage > 1) {
                items.push(1);
                if (startPage > 2) {
                    items.push("ellipsis-start");
                }
            }

            // Add page numbers
            for (let i = startPage; i <= endPage; i++) {
                items.push(i);
            }

            // Add last page with ellipsis if needed
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    items.push("ellipsis-end");
                }
                items.push(totalPages);
            }
        }

        setPaginationItems(items);
    };

    // Handle page change
    const handlePageChange = (page) => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    // Handle previous page
    const handlePrevious = () => {
        if (currentPage > 1 && !disableNavigation) {
            handlePageChange(currentPage - 1);
        }
    };

    // Handle next page
    const handleNext = () => {
        if (currentPage < totalPages && !disableNavigation) {
            handlePageChange(currentPage + 1);
        }
    };

    // Handle jump to page form submission
    const handleJumpToPageSubmit = (e) => {
        e.preventDefault();
        const pageNumber = parseInt(inputPage, 10);

        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
            handlePageChange(pageNumber);
            setInputPage("");
        } else {
            setInputPage("");
        }
    };

    // Calculate start and end item numbers
    const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endItem = Math.min(startItem + pageSize - 1, totalItems);

    return (
        <div className={`pagination-container ${variant} ${size} ${className}`}>
            {/* Items count display */}
            {showItemsCount && totalItems > 0 && (
                <div className="pagination-items-count">
                    {itemsRangeLabel} {startItem}-{endItem} {itemsCountLabel}{" "}
                    {totalItems}
                </div>
            )}

            <div className="pagination-controls">
                {/* Previous button */}
                <button
                    className={`pagination-button previous ${
                        currentPage <= 1 || disableNavigation ? "disabled" : ""
                    }`}
                    onClick={handlePrevious}
                    disabled={currentPage <= 1 || disableNavigation}
                    aria-label="Go to previous page"
                >
                    <span className="pagination-arrow left-arrow"></span>
                    <span className="pagination-button-text">
                        {previousLabel}
                    </span>
                </button>

                {/* Page buttons */}
                <div className="pagination-pages">
                    {paginationItems.map((item, index) =>
                        typeof item === "number" ? (
                            <button
                                key={index}
                                className={`pagination-page-button ${
                                    item === currentPage ? "active" : ""
                                }`}
                                onClick={() => handlePageChange(item)}
                                aria-label={`Page ${item}`}
                                aria-current={
                                    item === currentPage ? "page" : undefined
                                }
                            >
                                {item}
                            </button>
                        ) : (
                            <span key={index} className="pagination-ellipsis">
                                &hellip;
                            </span>
                        )
                    )}
                </div>

                {/* Next button */}
                <button
                    className={`pagination-button next ${
                        currentPage >= totalPages || disableNavigation
                            ? "disabled"
                            : ""
                    }`}
                    onClick={handleNext}
                    disabled={currentPage >= totalPages || disableNavigation}
                    aria-label="Go to next page"
                >
                    <span className="pagination-button-text">{nextLabel}</span>
                    <span className="pagination-arrow right-arrow"></span>
                </button>
            </div>

            {/* Jump to page form */}
            {showJumpToPage && totalPages > maxVisibleButtons && (
                <form
                    className="pagination-jump-form"
                    onSubmit={handleJumpToPageSubmit}
                >
                    <label
                        htmlFor="jump-to-page"
                        className="pagination-jump-label"
                    >
                        {jumpToPageLabel}
                    </label>
                    <input
                        id="jump-to-page"
                        type="text"
                        className="pagination-jump-input"
                        value={inputPage}
                        onChange={(e) => setInputPage(e.target.value)}
                        aria-label="Jump to page"
                    />
                    <button
                        type="submit"
                        className="pagination-jump-button"
                        aria-label="Go to specified page"
                    >
                        Go
                    </button>
                </form>
            )}
        </div>
    );
};

export default Pagination;

//Usage:
// import React, { useState } from "react";
// import Pagination from "./components/Pagination/Pagination";
// import "./components/Pagination/paginationStyles.css";

// const PaginationExample = () => {
//     // Sample data state
//     const [currentPage, setCurrentPage] = useState(1);
//     const totalItems = 256; // Total number of items in your dataset
//     const pageSize = 10; // Number of items per page
//     const totalPages = Math.ceil(totalItems / pageSize);

//     // Style options for the demo
//     const [variant, setVariant] = useState("default");
//     const [size, setSize] = useState("medium");
//     const [showJumpToPage, setShowJumpToPage] = useState(true);
//     const [maxVisibleButtons, setMaxVisibleButtons] = useState(5);

//     // Handle page change
//     const handlePageChange = (page) => {
//         setCurrentPage(page);
//         console.log(`Page changed to ${page}`);
//         // Here you would typically fetch data for the new page
//     };

//     return (
//         <div className="pagination-demo-container">
//             <h1>Pagination Component Demo</h1>

//             {/* Controls for the demo */}
//             <div className="pagination-demo-controls">
//                 <div className="control-group">
//                     <label>Variant:</label>
//                     <select
//                         value={variant}
//                         onChange={(e) => setVariant(e.target.value)}
//                     >
//                         <option value="default">Default</option>
//                         <option value="rounded">Rounded</option>
//                         <option value="bordered">Bordered</option>
//                         <option value="minimal">Minimal</option>
//                     </select>
//                 </div>

//                 <div className="control-group">
//                     <label>Size:</label>
//                     <select
//                         value={size}
//                         onChange={(e) => setSize(e.target.value)}
//                     >
//                         <option value="small">Small</option>
//                         <option value="medium">Medium</option>
//                         <option value="large">Large</option>
//                     </select>
//                 </div>

//                 <div className="control-group">
//                     <label>
//                         <input
//                             type="checkbox"
//                             checked={showJumpToPage}
//                             onChange={(e) =>
//                                 setShowJumpToPage(e.target.checked)
//                             }
//                         />
//                         Show Jump To Page
//                     </label>
//                 </div>

//                 <div className="control-group">
//                     <label>Max Visible Buttons:</label>
//                     <input
//                         type="range"
//                         min="3"
//                         max="10"
//                         value={maxVisibleButtons}
//                         onChange={(e) =>
//                             setMaxVisibleButtons(parseInt(e.target.value))
//                         }
//                     />
//                     <span>{maxVisibleButtons}</span>
//                 </div>
//             </div>

//             {/* Current state display */}
//             <div className="pagination-demo-status">
//                 <p>
//                     Viewing page {currentPage} of {totalPages}
//                     (Items {(currentPage - 1) * pageSize + 1}-
//                     {Math.min(currentPage * pageSize, totalItems)}
//                     of {totalItems})
//                 </p>
//             </div>

//             {/* Mock content area */}
//             <div className="pagination-demo-content">
//                 <h2>Page {currentPage} Content</h2>
//                 <div className="mock-data">
//                     {Array.from({ length: pageSize }, (_, index) => {
//                         const itemNumber =
//                             (currentPage - 1) * pageSize + index + 1;
//                         if (itemNumber <= totalItems) {
//                             return (
//                                 <div className="mock-item" key={index}>
//                                     Item #{itemNumber}
//                                 </div>
//                             );
//                         }
//                         return null;
//                     })}
//                 </div>
//             </div>

//             {/* Pagination component */}
//             <div className="pagination-demo-component">
//                 <Pagination
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     totalItems={totalItems}
//                     pageSize={pageSize}
//                     onPageChange={handlePageChange}
//                     showJumpToPage={showJumpToPage}
//                     maxVisibleButtons={maxVisibleButtons}
//                     variant={variant}
//                     size={size}
//                 />
//             </div>

//             {/* Demo styles */}
//             <style jsx>{`
//                 .pagination-demo-container {
//                     font-family: "Inter", -apple-system, BlinkMacSystemFont,
//                         sans-serif;
//                     max-width: 1200px;
//                     margin: 0 auto;
//                     padding: 2rem;
//                 }

//                 h1 {
//                     color: #111827;
//                     margin-bottom: 2rem;
//                     text-align: center;
//                 }

//                 .pagination-demo-controls {
//                     display: flex;
//                     flex-wrap: wrap;
//                     gap: 1.5rem;
//                     margin-bottom: 2rem;
//                     padding: 1.5rem;
//                     background-color: #f9fafb;
//                     border-radius: 0.5rem;
//                 }

//                 .control-group {
//                     display: flex;
//                     align-items: center;
//                     gap: 0.5rem;
//                 }

//                 .control-group select,
//                 .control-group input[type="range"] {
//                     padding: 0.5rem;
//                     border: 1px solid #e5e7eb;
//                     border-radius: 0.375rem;
//                 }

//                 .pagination-demo-status {
//                     margin-bottom: 1.5rem;
//                     padding: 1rem;
//                     background-color: #f3f4f6;
//                     border-radius: 0.5rem;
//                     text-align: center;
//                 }

//                 .pagination-demo-content {
//                     margin-bottom: 2rem;
//                 }

//                 h2 {
//                     color: #374151;
//                     margin-bottom: 1rem;
//                 }

//                 .mock-data {
//                     display: grid;
//                     grid-template-columns: repeat(
//                         auto-fill,
//                         minmax(200px, 1fr)
//                     );
//                     gap: 1rem;
//                 }

//                 .mock-item {
//                     padding: 1.5rem;
//                     background-color: #fff;
//                     border: 1px solid #e5e7eb;
//                     border-radius: 0.5rem;
//                     text-align: center;
//                     box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
//                 }

//                 .pagination-demo-component {
//                     margin-top: 2rem;
//                     padding-top: 1.5rem;
//                     border-top: 1px solid #e5e7eb;
//                 }

//                 @media (max-width: 768px) {
//                     .pagination-demo-controls {
//                         flex-direction: column;
//                         align-items: flex-start;
//                     }
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default PaginationExample;
