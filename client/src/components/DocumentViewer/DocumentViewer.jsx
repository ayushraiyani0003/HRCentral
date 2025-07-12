import React, { useState, useEffect } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import {
    Search,
    ZoomIn,
    ZoomOut,
    RotateCw,
    Download,
    Info,
    FileText,
    Image,
    File,
    RefreshCw,
    ExternalLink,
    Maximize2,
    Minimize2,
} from "lucide-react";

const DocumentViewer = ({
    documentUrl,
    documentType,
    fileName,
    width = "100%",
    height = "600px",
    showControls = true,
    showSearch = true,
    showInfo = true,
    showDownload = true,
    className = "",
    theme = "light",
    onLoad,
    onError,
    config = {},
}) => {
    // ncaught TypeError: Cannot read properties of undefined (reading 'toLowerCase')
    // at getFileIcon (DocumentViewer.jsx:160:32)
    // at renderControls (DocumentViewer.jsx:175:22)
    // at DocumentViewer (DocumentViewer.jsx:364:30)
    // at react-stack-bottom-frame (react-dom_client.js?v=90220e2d:17424:20)
    // at renderWithHooks (react-dom_client.js?v=90220e2d:4206:24)
    // at updateFunctionComponent (react-dom_client.js?v=90220e2d:6619:21)
    // at beginWork (react-dom_client.js?v=90220e2d:7654:20)
    // at runWithFiberInDEV (react-dom_client.js?v=90220e2d:1485:72)
    // at performUnitOfWork (react-dom_client.js?v=90220e2d:10868:98)
    // at workLoopSync (react-dom_client.js?v=90220e2d:10728:43)
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showInfoPanel, setShowInfoPanel] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [documentInfo, setDocumentInfo] = useState({});
    const [docs, setDocs] = useState([]);

    console.log(documentUrl); ///@fs/home/ayush-rayani/Downloads/example-multipage.pdf

    // Supported file types mapping
    const fileTypeMap = {
        pdf: "application/pdf",
        doc: "application/msword",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        xls: "application/vnd.ms-excel",
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ppt: "application/vnd.ms-powerpoint",
        pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        txt: "text/plain",
        html: "text/html",
        htm: "text/html",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        bmp: "image/bmp",
        webp: "image/webp",
    };

    // Get file extension from URL or fileName
    const getFileExtension = (url, name) => {
        console.log(url, name);

        if (documentType) return documentType.toLowerCase();
        if (name) return name.split(".").pop().toLowerCase();
        return url.split(".").pop().split("?")[0].toLowerCase();
    };

    // Get MIME type based on file extension
    const getMimeType = (extension) => {
        return fileTypeMap[extension] || "application/octet-stream";
    };

    // Initialize document
    useEffect(() => {
        if (documentUrl) {
            const extension = getFileExtension(documentUrl, fileName);
            const mimeType = getMimeType(extension);
            const docName = fileName || `document.${extension}`;

            const docConfig = {
                uri: documentUrl,
                fileName: docName,
                fileType: mimeType,
            };

            setDocs([docConfig]);
            setDocumentInfo({
                name: docName,
                type: extension.toUpperCase(),
                mimeType: mimeType,
                url: documentUrl,
            });
        }
    }, [documentUrl, fileName, documentType]);

    const handleDocLoadSuccess = () => {
        setIsLoading(false);
        setError(null);
        onLoad && onLoad();
    };

    const handleDocLoadError = (error) => {
        setIsLoading(false);
        setError(error?.message || "Failed to load document");
        onError && onError(error);
    };

    const handleDownload = () => {
        try {
            const link = document.createElement("a");
            link.href = documentUrl;
            link.download =
                fileName ||
                `document.${getFileExtension(documentUrl, fileName)}`;
            link.target = "_blank";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Download failed:", err);
            // Fallback: open in new tab
            window.open(documentUrl, "_blank");
        }
    };

    const handleRefresh = () => {
        setIsLoading(true);
        setError(null);
        // Force refresh by updating the docs array
        const extension = getFileExtension(documentUrl, fileName);
        const mimeType = getMimeType(extension);
        const docName = fileName || `document.${extension}`;

        setDocs([
            {
                uri: `${documentUrl}?t=${Date.now()}`, // Add timestamp to force refresh
                fileName: docName,
                fileType: mimeType,
            },
        ]);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const openInNewTab = () => {
        window.open(documentUrl, "_blank");
    };

    const getFileIcon = (type) => {
        console.log(type);

        const lowerType = type.toLowerCase();
        if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(lowerType)) {
            return <Image size={16} />;
        } else if (["pdf"].includes(lowerType)) {
            return <FileText size={16} />;
        } else {
            return <File size={16} />;
        }
    };
    console.log(documentInfo.type);

    const renderControls = () => (
        <div className="flex items-center justify-between p-3 bg-gray-100 border-b">
            <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                    {getFileIcon(documentInfo.type)}
                    <span className="text-sm font-medium text-gray-700">
                        {documentInfo.name}
                    </span>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                        {documentInfo.type}
                    </span>
                </div>

                <div className="h-6 w-px bg-gray-300 mx-2" />

                <button
                    onClick={handleRefresh}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Refresh"
                >
                    <RefreshCw size={18} />
                </button>

                <button
                    onClick={openInNewTab}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Open in New Tab"
                >
                    <ExternalLink size={18} />
                </button>

                <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded hover:bg-gray-200"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                    {isFullscreen ? (
                        <Minimize2 size={18} />
                    ) : (
                        <Maximize2 size={18} />
                    )}
                </button>
            </div>

            <div className="flex items-center space-x-2">
                {showSearch && (
                    <div className="relative">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}

                {showInfo && (
                    <button
                        onClick={() => setShowInfoPanel(!showInfoPanel)}
                        className="p-2 rounded hover:bg-gray-200"
                        title="Document Info"
                    >
                        <Info size={18} />
                    </button>
                )}

                {showDownload && (
                    <button
                        onClick={handleDownload}
                        className="p-2 rounded hover:bg-gray-200"
                        title="Download"
                    >
                        <Download size={18} />
                    </button>
                )}
            </div>
        </div>
    );

    const renderInfoPanel = () => (
        <div className="absolute top-16 right-4 bg-white border rounded-lg shadow-lg p-4 min-w-[250px] z-20">
            <h3 className="font-semibold mb-3 flex items-center">
                {getFileIcon(documentInfo.type)}
                <span className="ml-2">Document Information</span>
            </h3>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <strong>Name:</strong>
                    <span
                        className="text-right max-w-[150px] truncate"
                        title={documentInfo.name}
                    >
                        {documentInfo.name}
                    </span>
                </div>
                <div className="flex justify-between">
                    <strong>Type:</strong>
                    <span>{documentInfo.type}</span>
                </div>
                <div className="flex justify-between">
                    <strong>MIME:</strong>
                    <span className="text-xs text-gray-600">
                        {documentInfo.mimeType}
                    </span>
                </div>
                <div className="pt-2 border-t">
                    <button
                        onClick={() =>
                            navigator.clipboard.writeText(documentInfo.url)
                        }
                        className="text-xs text-blue-600 hover:text-blue-800"
                    >
                        Copy URL
                    </button>
                </div>
            </div>
        </div>
    );

    const renderLoadingState = () => (
        <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading document...</p>
                <p className="text-sm text-gray-500 mt-1">
                    {documentInfo.type} • {documentInfo.name}
                </p>
            </div>
        </div>
    );

    const renderErrorState = () => (
        <div className="flex items-center justify-center h-full bg-red-50">
            <div className="text-center max-w-md">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <p className="text-red-600 font-medium mb-2">
                    Error loading document
                </p>
                <p className="text-red-500 text-sm mb-4">{error}</p>
                <div className="space-x-2">
                    <button
                        onClick={handleRefresh}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={openInNewTab}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                    >
                        Open Original
                    </button>
                </div>
            </div>
        </div>
    );

    // DocViewer configuration
    const docViewerConfig = {
        header: {
            disableHeader: true, // We use our custom header
        },
        csvDelimiter: ",",
        pdfZoom: {
            defaultZoom: 1.1,
            zoomJump: 0.2,
        },
        pdfVerticalScrollByDefault: true,
        ...config,
    };

    const containerStyle = {
        width,
        height: isFullscreen ? "100vh" : height,
        position: isFullscreen ? "fixed" : "relative",
        top: isFullscreen ? 0 : "auto",
        left: isFullscreen ? 0 : "auto",
        zIndex: isFullscreen ? 9999 : "auto",
        backgroundColor: "white",
    };

    return (
        <div
            className={`border rounded-lg overflow-hidden ${className} ${
                isFullscreen ? "fixed inset-0 z-50" : ""
            }`}
            style={containerStyle}
        >
            {showControls && renderControls()}
            {showInfoPanel && renderInfoPanel()}

            <div className="h-full overflow-hidden">
                {isLoading ? (
                    renderLoadingState()
                ) : error ? (
                    renderErrorState()
                ) : (
                    <DocViewer
                        documents={docs}
                        config={docViewerConfig}
                        pluginRenderers={DocViewerRenderers}
                        style={{
                            height: showControls ? "calc(100% - 60px)" : "100%",
                            width: "100%",
                        }}
                        onLoadSuccess={handleDocLoadSuccess}
                        onLoadError={handleDocLoadError}
                        theme={{
                            primary: "#5B9BD5",
                            secondary: "#F0F0F0",
                            tertiary: "#FFFFFF",
                            text_primary: "#333333",
                            text_secondary: "#666666",
                            disableThemeScrollbar: false,
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default DocumentViewer;
