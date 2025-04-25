import React, { useState, useRef, useEffect } from "react";
import "./documentViewerStyles.css";

// Import icons from separate file
import {
    searchIcon,
    zoomInIcon,
    zoomOutIcon,
    resetZoomIcon,
    fitToWidthIcon,
    firstPageIcon,
    prevPageIcon,
    nextPageIcon,
    lastPageIcon,
    downloadIcon,
    printIcon,
    fullscreenIcon,
    exitFullscreenIcon,
    closeIcon,
    errorIcon,
    gridViewIcon,
    addNoteIcon,
    highlightIcon,
    drawIcon,
} from "../../utils/SvgIcon";

// Import PDF.js correctly
import * as pdfjsLib from "pdfjs-dist";

// Set the worker source to fix the "GlobalWorkerOptions.workerSrc" error
// This needs to point to the PDF.js worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const DocumentViewer = ({
    documentUrl,
    documentType = "pdf", // pdf, image, txt, etc.
    width = "100%",
    height = "600px",
    showThumbnails = true,
    showControls = true,
    showSearch = true,
    showAnnotation = false,
    showInfo = true,
    className = "",
    onLoad,
    onError,
    ...rest
}) => {
    // States
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [scale, setScale] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
    const [showSearchPanel, setShowSearchPanel] = useState(false);
    const [pdfDocument, setPdfDocument] = useState(null);
    const [documentInfo, setDocumentInfo] = useState({
        title: "",
        size: "",
        type: documentType,
    });

    // References
    const viewerContainerRef = useRef(null);
    const documentRef = useRef(null);
    const canvasRef = useRef(null);

    // Handle document loading
    useEffect(() => {
        if (!documentUrl) return;

        setIsLoading(true);
        setError(null);
        setTotalPages(0);
        setPdfDocument(null);

        // Function to load image documents
        const loadImage = async () => {
            try {
                const img = new Image();
                img.onload = () => {
                    setIsLoading(false);
                    setTotalPages(1);
                    setDocumentInfo({
                        title: documentUrl.split("/").pop() || "Image",
                        size: "Unknown", // It's difficult to get image file size without server support
                        type: "image",
                    });

                    // Draw image to canvas
                    if (canvasRef.current) {
                        const ctx = canvasRef.current.getContext("2d");
                        const scale = Math.min(
                            canvasRef.current.width / img.width,
                            canvasRef.current.height / img.height
                        );
                        const x =
                            (canvasRef.current.width - img.width * scale) / 2;
                        const y =
                            (canvasRef.current.height - img.height * scale) / 2;

                        ctx.clearRect(
                            0,
                            0,
                            canvasRef.current.width,
                            canvasRef.current.height
                        );
                        ctx.drawImage(
                            img,
                            x,
                            y,
                            img.width * scale,
                            img.height * scale
                        );
                    }

                    if (onLoad) onLoad();
                };

                img.onerror = (err) => {
                    console.error("Image loading error:", err);
                    setIsLoading(false);
                    setError(
                        "Failed to load image. Please check the file path."
                    );
                    if (onError) onError(new Error("Failed to load image"));
                };

                // Set src after defining event handlers
                img.src = documentUrl;
            } catch (err) {
                console.error("Error loading image:", err);
                setIsLoading(false);
                setError("Failed to load image. Please try again.");
                if (onError) onError(err);
            }
        };

        // Function to load PDF documents
        const loadPDF = async () => {
            try {
                console.log("Loading PDF from URL:", documentUrl);

                // Determine if this is a file object, blob URL, or remote URL
                let pdfSource = documentUrl;

                // For imported files (which will be webpack paths or blob URLs)
                if (
                    typeof documentUrl === "object" ||
                    (typeof documentUrl === "string" &&
                        documentUrl.startsWith("blob:"))
                ) {
                    // Already a file object or blob URL, use directly
                    console.log("Using blob URL or file object");
                }
                // For remote URLs
                else if (
                    typeof documentUrl === "string" &&
                    documentUrl.startsWith("http")
                ) {
                    console.log("Using remote URL");
                    // Use with proper CORS headers
                    // pdfSource remains unchanged
                }
                // For relative paths
                else if (typeof documentUrl === "string") {
                    console.log("Converting relative path to absolute");
                    // Might need to convert to absolute path
                    pdfSource = new URL(documentUrl, window.location.origin)
                        .href;
                }

                // Fetch the PDF document
                const loadingTask = pdfjsLib.getDocument(pdfSource);

                loadingTask.promise.then(
                    (pdfDoc) => {
                        console.log("PDF loaded successfully");
                        setPdfDocument(pdfDoc);
                        setTotalPages(pdfDoc.numPages);
                        setIsLoading(false);

                        // Extract document info
                        pdfDoc.getMetadata().then((data) => {
                            setDocumentInfo({
                                title:
                                    data.info?.Title ||
                                    documentUrl.split("/").pop() ||
                                    "Document",
                                size: "Unknown", // PDF.js doesn't provide file size info
                                type: "pdf",
                            });
                        });

                        // Render the first page
                        renderPage(pdfDoc, currentPage);

                        if (onLoad) onLoad();
                    },
                    (error) => {
                        console.error("Error loading PDF:", error);
                        // More specific error logging
                        if (error.name === "MissingPDFException") {
                            console.error("The PDF file could not be found");
                        } else if (error.name === "InvalidPDFException") {
                            console.error(
                                "The PDF file is invalid or corrupted"
                            );
                        } else if (
                            error.name === "UnexpectedResponseException"
                        ) {
                            console.error(
                                "The server returned an unexpected response",
                                error.message
                            );
                        }

                        setIsLoading(false);
                        setError(`Failed to load PDF: ${error.message}`);
                        if (onError) onError(error);
                    }
                );
            } catch (err) {
                console.error("Error in PDF loading process:", err);
                setIsLoading(false);
                setError(`Failed to load PDF: ${err.message}`);
                if (onError) onError(err);
            }
        };

        // Choose the appropriate loader based on document type
        if (documentType === "image") {
            loadImage();
        } else if (documentType === "pdf") {
            loadPDF();
        } else {
            // Handle other document types or show error
            setIsLoading(false);
            setError(`Document type "${documentType}" is not supported.`);
            if (onError)
                onError(
                    new Error(`Unsupported document type: ${documentType}`)
                );
        }

        // Cleanup function
        return () => {
            if (pdfDocument) {
                pdfDocument.destroy();
            }
        };
    }, [documentUrl, documentType, onLoad, onError]);

    // Function to render a PDF page
    const renderPage = async (pdf, pageNum) => {
        if (!pdf) return;

        try {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.0 });

            if (!canvasRef.current) return;

            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            // Set canvas dimensions to match page dimensions
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render the page
            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };

            await page.render(renderContext).promise;
            console.log(`Page ${pageNum} rendered successfully`);
        } catch (err) {
            console.error("Error rendering page:", err);
            setError(`Failed to render page ${pageNum}: ${err.message}`);
        }
    };

    // Effect to re-render when current page changes
    useEffect(() => {
        if (pdfDocument) {
            renderPage(pdfDocument, currentPage);
        }
    }, [currentPage, pdfDocument]);

    // Handle fullscreen
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isDocFullscreen =
                document.fullscreenElement === viewerContainerRef.current;
            setIsFullscreen(isDocFullscreen);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () =>
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );
    }, []);

    // Navigation handlers
    const goToPage = (pageNum) => {
        const page = Math.max(1, Math.min(pageNum, totalPages));
        setCurrentPage(page);
    };

    const goToNextPage = () => goToPage(currentPage + 1);
    const goToPrevPage = () => goToPage(currentPage - 1);
    const goToFirstPage = () => goToPage(1);
    const goToLastPage = () => goToPage(totalPages);

    // Zoom handlers
    const zoomIn = () => setScale((prevScale) => Math.min(prevScale + 0.25, 3));
    const zoomOut = () =>
        setScale((prevScale) => Math.max(prevScale - 0.25, 0.5));
    const resetZoom = () => setScale(1);
    const fitToWidth = () => setScale(1.25); // Mock implementation - would calculate based on container width

    // Fullscreen handlers
    const toggleFullscreen = () => {
        if (isFullscreen) {
            document.exitFullscreen();
        } else if (viewerContainerRef.current) {
            viewerContainerRef.current.requestFullscreen();
        }
    };

    // Search handlers
    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        // This would be a real PDF text search implementation
        // For now we'll mock it
        console.log("Searching for:", searchQuery);

        // Mock search results for demonstration
        const mockResults = [];
        if (searchQuery.trim().length > 0) {
            for (let i = 1; i <= Math.min(totalPages, 5); i++) {
                // Generate some fake results
                mockResults.push({
                    page: i,
                    text: `...context with ${searchQuery} in page ${i}...`,
                });
            }
        }

        setSearchResults(mockResults);
        if (mockResults.length > 0) {
            setCurrentSearchIndex(0);
            setShowSearchPanel(true);
            goToPage(mockResults[0].page);
        }
    };

    const goToNextSearchResult = () => {
        if (searchResults.length === 0) return;

        const newIndex = (currentSearchIndex + 1) % searchResults.length;
        setCurrentSearchIndex(newIndex);

        const result = searchResults[newIndex];
        goToPage(result.page);
    };

    const goToPrevSearchResult = () => {
        if (searchResults.length === 0) return;

        const newIndex =
            (currentSearchIndex - 1 + searchResults.length) %
            searchResults.length;
        setCurrentSearchIndex(newIndex);

        const result = searchResults[newIndex];
        goToPage(result.page);
    };

    // Download handler
    const handleDownload = () => {
        try {
            const link = document.createElement("a");

            // Handle different types of URLs
            if (typeof documentUrl === "string") {
                link.href = documentUrl;
                // If it's a blob URL, use the direct URL
                if (documentUrl.startsWith("blob:")) {
                    console.log("Downloading from blob URL:", documentUrl);
                }
                // For remote URLs, might need additional handling for CORS
                else if (documentUrl.startsWith("http")) {
                    console.log("Downloading from remote URL:", documentUrl);
                }
            } else {
                // For file objects, create a blob URL
                console.log("Creating blob URL for download");
                const blobUrl = URL.createObjectURL(documentUrl);
                link.href = blobUrl;
                // Clean up the blob URL after download
                setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
            }

            // Use the document title as the filename, or fallback to a generic name
            link.download = documentInfo.title || "document";
            link.click();
        } catch (err) {
            console.error("Download error:", err);
            setError("Failed to download document");
        }
    };

    // Print handler
    const handlePrint = () => {
        try {
            // For PDFs and Images, open in a new window and print
            if (documentType === "pdf" || documentType === "image") {
                const printWindow = window.open(documentUrl, "_blank");
                if (printWindow) {
                    printWindow.addEventListener("load", () => {
                        setTimeout(() => {
                            printWindow.print();
                        }, 500);
                    });
                } else {
                    console.warn("Popup blocked. Cannot open print window.");
                    setError("Popup blocked. Please allow popups to print.");
                }
            } else {
                console.warn("Printing not supported for this document type");
                setError("Printing not supported for this document type");
            }
        } catch (err) {
            console.error("Print error:", err);
            setError("Failed to print document");
        }
    };

    // Render thumbnails
    const renderThumbnails = () => {
        if (!showThumbnails) return null;

        return (
            <div className="document-thumbnails">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                        <div
                            key={`thumb-${page}`}
                            className={`document-thumbnail ${
                                page === currentPage ? "active" : ""
                            }`}
                            onClick={() => goToPage(page)}
                        >
                            <div className="document-thumbnail-preview" />
                            <div className="document-thumbnail-label">
                                {page}
                            </div>
                        </div>
                    )
                )}
            </div>
        );
    };

    // Render document content
    const renderDocument = () => {
        if (isLoading) {
            return (
                <div className="document-loading">
                    <div className="document-loading-spinner" />
                    <div className="document-loading-text">
                        Loading document...
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="document-error">
                    <div className="document-error-icon">{errorIcon}</div>
                    <div className="document-error-text">{error}</div>
                </div>
            );
        }

        return (
            <div
                className="document-content"
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top center",
                }}
                ref={documentRef}
            >
                <div className="document-page">
                    <canvas
                        ref={canvasRef}
                        className="document-canvas"
                    ></canvas>
                    {totalPages > 0 && (
                        <div className="document-page-number">
                            Page {currentPage} of {totalPages}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Render search panel
    const renderSearchPanel = () => {
        if (!showSearch || !showSearchPanel) return null;

        return (
            <div className="document-search-panel">
                <div className="document-search-header">
                    <h3>Search Results</h3>
                    <button
                        className="document-button icon-only"
                        onClick={() => setShowSearchPanel(false)}
                        aria-label="Close search panel"
                    >
                        {closeIcon}
                    </button>
                </div>
                <div className="document-search-results">
                    {searchResults.length > 0 ? (
                        searchResults.map((result, index) => (
                            <div
                                key={`result-${index}`}
                                className={`document-search-result ${
                                    index === currentSearchIndex ? "active" : ""
                                }`}
                                onClick={() => {
                                    setCurrentSearchIndex(index);
                                    goToPage(result.page);
                                }}
                            >
                                <span className="document-search-result-page">
                                    Page {result.page}
                                </span>
                                <span className="document-search-result-context">
                                    {result.text}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="document-search-no-results">
                            No results found
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div
            className={`document-viewer-container ${className} ${
                isFullscreen ? "fullscreen" : ""
            }`}
            style={{ width, height }}
            ref={viewerContainerRef}
            {...rest}
        >
            {/* Top toolbar */}
            {showControls && (
                <div className="document-toolbar top">
                    <div className="document-toolbar-section">
                        {/* Navigation controls */}
                        <button
                            className="document-button"
                            onClick={goToFirstPage}
                            disabled={
                                currentPage === 1 ||
                                isLoading ||
                                totalPages <= 1
                            }
                            aria-label="First page"
                        >
                            {firstPageIcon}
                        </button>
                        <button
                            className="document-button"
                            onClick={goToPrevPage}
                            disabled={
                                currentPage === 1 ||
                                isLoading ||
                                totalPages <= 1
                            }
                            aria-label="Previous page"
                        >
                            {prevPageIcon}
                        </button>
                        <div className="document-page-input">
                            <input
                                type="number"
                                min="1"
                                max={totalPages}
                                value={currentPage}
                                onChange={(e) =>
                                    goToPage(parseInt(e.target.value) || 1)
                                }
                                disabled={isLoading || totalPages === 0}
                            />
                            <span>/ {totalPages}</span>
                        </div>
                        <button
                            className="document-button"
                            onClick={goToNextPage}
                            disabled={
                                currentPage === totalPages ||
                                isLoading ||
                                totalPages <= 1
                            }
                            aria-label="Next page"
                        >
                            {nextPageIcon}
                        </button>
                        <button
                            className="document-button"
                            onClick={goToLastPage}
                            disabled={
                                currentPage === totalPages ||
                                isLoading ||
                                totalPages <= 1
                            }
                            aria-label="Last page"
                        >
                            {lastPageIcon}
                        </button>
                    </div>

                    <div className="document-toolbar-section">
                        {/* Zoom controls */}
                        <button
                            className="document-button"
                            onClick={zoomOut}
                            disabled={scale <= 0.5 || isLoading}
                            aria-label="Zoom out"
                        >
                            {zoomOutIcon}
                        </button>
                        <div className="document-zoom-level">
                            {Math.round(scale * 100)}%
                        </div>
                        <button
                            className="document-button"
                            onClick={zoomIn}
                            disabled={scale >= 3 || isLoading}
                            aria-label="Zoom in"
                        >
                            {zoomInIcon}
                        </button>
                        <button
                            className="document-button"
                            onClick={resetZoom}
                            disabled={scale === 1 || isLoading}
                            aria-label="Reset zoom"
                        >
                            {resetZoomIcon}
                        </button>
                        <button
                            className="document-button"
                            onClick={fitToWidth}
                            disabled={isLoading}
                            aria-label="Fit to width"
                        >
                            {fitToWidthIcon}
                        </button>
                    </div>

                    <div className="document-toolbar-section">
                        {/* Action buttons */}
                        {showSearch && (
                            <div className="document-search">
                                <form onSubmit={handleSearch}>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="submit"
                                        className="document-button"
                                        disabled={
                                            !searchQuery.trim() || isLoading
                                        }
                                        aria-label="Search"
                                    >
                                        {searchIcon}
                                    </button>
                                </form>
                                {searchResults.length > 0 && (
                                    <div className="document-search-controls">
                                        <button
                                            className="document-button small"
                                            onClick={goToPrevSearchResult}
                                            disabled={searchResults.length <= 1}
                                            aria-label="Previous search result"
                                        >
                                            {prevPageIcon}
                                        </button>
                                        <span className="document-search-count">
                                            {currentSearchIndex + 1} of{" "}
                                            {searchResults.length}
                                        </span>
                                        <button
                                            className="document-button small"
                                            onClick={goToNextSearchResult}
                                            disabled={searchResults.length <= 1}
                                            aria-label="Next search result"
                                        >
                                            {nextPageIcon}
                                        </button>
                                        <button
                                            className="document-button small"
                                            onClick={() =>
                                                setShowSearchPanel(
                                                    !showSearchPanel
                                                )
                                            }
                                            aria-label="Show search panel"
                                        >
                                            {gridViewIcon}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            className="document-button"
                            onClick={handleDownload}
                            disabled={isLoading || error}
                            aria-label="Download"
                        >
                            {downloadIcon}
                        </button>
                        <button
                            className="document-button"
                            onClick={handlePrint}
                            disabled={isLoading || error}
                            aria-label="Print"
                        >
                            {printIcon}
                        </button>
                        <button
                            className="document-button"
                            onClick={toggleFullscreen}
                            aria-label={
                                isFullscreen
                                    ? "Exit fullscreen"
                                    : "Enter fullscreen"
                            }
                        >
                            {isFullscreen ? exitFullscreenIcon : fullscreenIcon}
                        </button>
                    </div>
                </div>
            )}

            {/* Main content area with thumbnails */}
            <div className="document-main-area">
                {renderThumbnails()}
                <div className="document-content-area">
                    {renderDocument()}
                    {renderSearchPanel()}
                </div>
            </div>

            {/* Bottom toolbar with document info */}
            {showInfo && (
                <div className="document-toolbar bottom">
                    <div className="document-info">
                        <div className="document-title">
                            {documentInfo.title}
                        </div>
                        <div className="document-size">{documentInfo.size}</div>
                        <div className="document-type">
                            {documentInfo.type.toUpperCase()}
                        </div>
                    </div>
                </div>
            )}

            {/* Annotation toolbar */}
            {showAnnotation && (
                <div className="document-annotation-toolbar">
                    <button
                        className="document-button annotation"
                        title="Add note"
                    >
                        {addNoteIcon}
                    </button>
                    <button
                        className="document-button annotation"
                        title="Highlight text"
                    >
                        {highlightIcon}
                    </button>
                    <button className="document-button annotation" title="Draw">
                        {drawIcon}
                    </button>
                </div>
            )}
        </div>
    );
};

export default DocumentViewer;
