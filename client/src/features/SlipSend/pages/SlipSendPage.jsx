import React, { useState, useEffect } from "react";
import {
    CustomContainer,
    CustomButton,
    CustomModal,
    Tooltip,
    FileUpload,
    CustomTable,
    ConfirmationButton,
} from "../../../components";
import SettingsModal from "../components/SettingsModal";
import { useToast } from "../../../components/Toast/Toast";
import { useUpload } from "../hooks/useUpload";
import { useWhatsapp } from "../hooks/useWhatsapp";
import "./SlipSendPage.css";
import ImagePreview from "../../../components/ImagePreview/ImagePreview";
import previewImage from "../../../assets/slip contact excel formate.png";
import preview2Image from "../../../assets/fetchpik.com-iconscout-d59RgSKncT.png";
import preview3Image from "../../../assets/sunchaser.png";
import SampleExcelFileDownload from "../../../assets/fileupload.zip";

const SlipSendPage = () => {
    // Get toast from context
    const { addToast } = useToast();

    // Use custom hooks
    const upload = useUpload();
    const whatsapp = useWhatsapp();

    // Local state
    const [fileUploaded, setFileUploaded] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [currentBatch, setCurrentBatch] = useState(0);
    const [totalBatches, setTotalBatches] = useState(0);
    const [batchProgress, setBatchProgress] = useState(0);
    const [progress, setProgress] = useState(0);
    const [selectedFiles, setSelectedFiles] = useState([]);
    // Settings
    const [settings, setSettings] = useState({
        batchSize: 100,
        pdfInterval: 10,
        batchInterval: 30,
    });

    // Stats
    const [stats, setStats] = useState({
        total: 0,
        sent: 0,
        failed: 0,
        remaining: 0,
    });

    // Add this useEffect at the top of your other useEffects
    useEffect(() => {
        // Check WhatsApp connection status on page load
        const checkInitialStatus = async () => {
            try {
                const result = await whatsapp.checkStatus();

                // If connected, show a toast message
                if (result.success && result.connected) {
                    displayToast("WhatsApp is already connected", "success");
                }
            } catch (error) {
                console.error(
                    "Failed to check initial WhatsApp status:",
                    error
                );
            }
        };

        checkInitialStatus();

        // Clean up SSE streams when component unmounts
        return () => {
            // This will ensure any active SSE connections are properly closed
            if (whatsapp.statusStreaming || whatsapp.progressStreaming) {
                whatsapp.resetState();
            }
        };
    }, []);

    // Update local stats when upload contacts change
    useEffect(() => {
        if (upload.contacts && upload.contacts.length > 0) {
            setStats({
                total: upload.contacts.length,
                sent: upload.contacts.filter((c) => c.status === "success")
                    .length,
                failed: upload.contacts.filter((c) => c.status === "failed")
                    .length,
                remaining: upload.contacts.filter((c) => c.status === "pending")
                    .length,
            });
            setFileUploaded(true);

            // Calculate batches
            const batchCount = Math.ceil(
                upload.contacts.length / settings.batchSize
            );
            setTotalBatches(batchCount);
        }
    }, [upload.contacts, settings.batchSize]);

    // Update progress data when WhatsApp progress changes
    useEffect(() => {
        if (whatsapp.progress) {
            setProgress(whatsapp.progress.overallProgress || 0);
            setBatchProgress(whatsapp.progress.batchProgress || 0);
            setCurrentBatch(whatsapp.progress.currentBatch || 0);

            // Update stats based on progress
            if (whatsapp.progress.stats) {
                setStats({
                    total: whatsapp.progress.stats.total || 0,
                    sent: whatsapp.progress.stats.sent || 0,
                    failed: whatsapp.progress.stats.failed || 0,
                    remaining:
                        (whatsapp.progress.stats.total || 0) -
                        (whatsapp.progress.stats.sent || 0) -
                        (whatsapp.progress.stats.failed || 0),
                });
            }
        }
    }, [whatsapp.progress]);

    // Close QR modal when connected
    useEffect(() => {
        if (whatsapp.isConnected && showQrModal) {
            setShowQrModal(false);
            displayToast("WhatsApp connected successfully!", "success");
        }
    }, [whatsapp.isConnected, showQrModal]);

    // Handlers
    const handleConnectWhatsApp = async () => {
        try {
            setShowQrModal(true);
            const result = await whatsapp.connect();

            if (!result.success) {
                displayToast(
                    result.message || "Failed to connect to WhatsApp",
                    "error"
                );
                setShowQrModal(false);
            }
        } catch (error) {
            displayToast("Failed to connect to WhatsApp", "error");
            console.error("Error connecting to WhatsApp:", error);
            setShowQrModal(false);
        }
    };

    const handleFileUpload = (files) => {
        // console.log("Files received:", files);
        setSelectedFiles(files);
    };

    const handleStartUpload = async () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            displayToast("No files selected", "error");
            return;
        }

        try {
            const zipFile = selectedFiles[0];
            const result = await upload.handleFileUpload([zipFile]);

            if (result.success) {
                displayToast("Files uploaded successfully!", "success");
                setSelectedFiles([]); // Clear selected files after successful upload
            } else {
                displayToast(
                    result.message || "Failed to upload files",
                    "error"
                );
            }
        } catch (error) {
            console.error("File upload error:", error);
            displayToast(
                "Error uploading files: " + (error.message || "Unknown error"),
                "error"
            );
        }
    };

    const handleStartSending = async () => {
        if (whatsapp.isSending) return;

        try {
            // First, start the progress stream before sending PDFs
            // console.log("Starting progress stream before sending PDFs");
            whatsapp.startProgressStream();

            // Then start sending PDFs
            const result = await whatsapp.startSending(
                upload.contacts,
                settings
            );

            if (result.success) {
                displayToast("Started sending salary slips", "success");

                // Ensure progress stream is active
                if (!whatsapp.progressStreaming) {
                    // console.log(
                    //     "Restarting progress stream after PDF sending initiated"
                    // );
                    setTimeout(() => whatsapp.startProgressStream(), 500);
                }
            } else {
                displayToast(
                    result.message || "Failed to start sending process",
                    "error"
                );
            }
        } catch (error) {
            displayToast("Failed to start sending process", "error");
            console.error("Failed to start sending process:", error);
        }
    };

    const handlePauseSending = async () => {
        try {
            const result = await whatsapp.pauseProcess();

            if (result.success) {
                displayToast("Process paused", "info");
            } else {
                displayToast(
                    result.message || "Failed to pause process",
                    "error"
                );
            }
        } catch (error) {
            displayToast("Failed to pause process", "error");
            console.error("Failed to pause process:", error);
        }
    };

    const handleResumeSending = async () => {
        try {
            const result = await whatsapp.resumeProcess();

            if (result.success) {
                displayToast("Process resumed", "info");
            } else {
                displayToast(
                    result.message || "Failed to resume process",
                    "error"
                );
            }
        } catch (error) {
            displayToast("Failed to resume process", "error");
            console.error("Failed to resume process:", error);
        }
    };

    const handleRetryFailed = async () => {
        try {
            const result = await whatsapp.retryFailedSends();

            if (result.success) {
                displayToast("Retrying failed sends", "info");
            } else {
                displayToast(
                    result.message || "Failed to retry process",
                    "error"
                );
            }
        } catch (error) {
            displayToast("Failed to retry process", "error");
            console.error("Failed to retry process:", error);
        }
    };

    const handleDisconnectSession = async () => {
        try {
            const result = await whatsapp.disconnect();

            if (result.success) {
                setFileUploaded(false);
                displayToast("WhatsApp session disconnected", "info");
            } else {
                displayToast(
                    result.message || "Failed to disconnect session",
                    "error"
                );
            }
        } catch (error) {
            displayToast("Failed to disconnect session", "error");
            console.error("Failed to disconnect session:", error);
        }
    };

    const handleOpenSettings = () => {
        setShowSettingsModal(true);
    };

    const handleSaveSettings = (newSettings) => {
        setSettings(newSettings);
        setShowSettingsModal(false);
        displayToast("Settings saved", "success");
    };

    // Toast display function
    const displayToast = (message, type = "info") => {
        addToast(message, type, 5000, "bottom-right");
    };

    // Get contact data - use whatsapp contacts if available, otherwise use upload contacts
    const getContactData = () => {
        if (whatsapp.contacts && whatsapp.contacts.length > 0) {
            return whatsapp.contacts;
        }
        return upload.contacts || [];
    };

    // Table columns configuration
    const columns = [
        { header: "Sr No", accessor: "srNo" },
        { header: "Punch Code", accessor: "punchCode" },
        { header: "Name", accessor: "name" },
        { header: "Phone No", accessor: "phoneNo" },
        {
            header: "Status",
            accessor: "status",
            cell: (row) => {
                let statusColor = "gray"; // default

                if (row.status === "success") statusColor = "green";
                else if (row.status === "failed") statusColor = "red";
                else if (row.status === "pending") statusColor = "orange";
                else if (row.status === "processing") statusColor = "blue";

                return (
                    <div className="status-cell">
                        <span
                            className={`status-indicator ${statusColor}`}
                        ></span>
                        <span>{row.status}</span>
                        {row.errorMessage && (
                            <Tooltip text={row.errorMessage}>
                                <span className="error-icon">!</span>
                            </Tooltip>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <div className="slip-send-page">
            <CustomContainer title="Salary Slip Distribution">
                <div className="connection-section">
                    <div className="flex items-center gap-2 font-medium">
                        <span>WhatsApp Status: </span>
                        <div className="flex items-center gap-1.5">
                            <span
                                className={`inline-block w-2.5 h-2.5 rounded-full ${
                                    whatsapp.isConnected
                                        ? "bg-green-500"
                                        : whatsapp.isConnecting
                                        ? "bg-orange-500"
                                        : "bg-red-500"
                                }`}
                            ></span>
                            <span>
                                {whatsapp.isConnected
                                    ? "Connected"
                                    : whatsapp.isConnecting
                                    ? "Connecting..."
                                    : "Disconnected"}
                            </span>
                        </div>
                        {whatsapp.statusStreaming && (
                            <span className="text-xs text-green-600 ml-2">
                                (Live Updates)
                            </span>
                        )}
                    </div>

                    <div className="connection-actions">
                        {!whatsapp.isConnected ? (
                            <CustomButton
                                onClick={handleConnectWhatsApp}
                                disabled={
                                    whatsapp.loading || whatsapp.isConnecting
                                }
                                variant="primary"
                            >
                                {whatsapp.isConnecting
                                    ? "Connecting..."
                                    : "Connect WhatsApp"}
                            </CustomButton>
                        ) : (
                            <div>
                                <ConfirmationButton
                                    onConfirm={handleDisconnectSession}
                                    confirmationText="Are you sure you want to disconnect?"
                                    buttonText="Disconnect Session"
                                    variant="danger"
                                    disabled={whatsapp.loading}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {whatsapp.isConnected && (
                    <>
                        <div className="upload-section flex flex-row gap-3">
                                <div className="flex-1">
                                    <FileUpload
                                    height={"285px"}
                                        onFilesSelected={handleFileUpload}
                                        disabled={
                                            !whatsapp.isConnected ||
                                            upload.loading
                                        }
                                        accept=".zip"
                                        multiple={false}
                                        maxFileSize={200 * 1024 * 1024}
                                        maxFiles={1}
                                        buttonText="Choose ZIP File"
                                        dragDropText="Drag & drop ZIP file here"
                                        label="Upload ZIP file (containing PDFs and contact Excel)"
                                        showPreview={true}
                                    />
                                </div>
                                <div className="flex-1">
                                    <ImagePreview
                                        label="Expected Excel File Structure"
                                        className="h-full"
                                        src={previewImage}
                                        // images={[{src:previewImage}, {src: preview2Image},{src: preview3Image}]}
                                        size={"small"}
                                        height={"285px"}
                                        showControls={true}
                                        showInfo={false}
                                        showCaption={true}
                                        showThumbnails={true}
                                        extraFileDownload={SampleExcelFileDownload}
                                        // If you have a specific selector, you can also use:
                                        // siblingSelector=".your-file-upload-selector"
                                    />
                            </div>

                            {selectedFiles && selectedFiles.length > 0 && (
                                <CustomButton
                                    onClick={handleStartUpload}
                                    variant="primary"
                                    disabled={upload.loading}
                                >
                                    {upload.loading
                                        ? "Uploading..."
                                        : "Upload Selected ZIP"}
                                </CustomButton>
                            )}
                        </div>
                        {fileUploaded && (
                            <>
                                {/* Stats Section with Tailwind CSS */}
                                <div className="my-6">
                                    <div className="bg-white rounded-lg shadow-md p-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Stats Cards */}
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Total Card */}
                                                <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center">
                                                    <p className="text-gray-700 font-medium text-sm uppercase">
                                                        Total
                                                    </p>
                                                    <p className="text-blue-600 text-2xl font-bold">
                                                        {stats.total}
                                                    </p>
                                                </div>

                                                {/* Sent Card */}
                                                <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center justify-center">
                                                    <p className="text-gray-700 font-medium text-sm uppercase">
                                                        Sent
                                                    </p>
                                                    <p className="text-green-600 text-2xl font-bold">
                                                        {stats.sent}
                                                    </p>
                                                </div>

                                                {/* Failed Card */}
                                                <div className="bg-red-50 rounded-lg p-4 flex flex-col items-center justify-center">
                                                    <p className="text-gray-700 font-medium text-sm uppercase">
                                                        Failed
                                                    </p>
                                                    <p className="text-red-600 text-2xl font-bold">
                                                        {stats.failed}
                                                    </p>
                                                </div>

                                                {/* Pending Card */}
                                                <div className="bg-yellow-50 rounded-lg p-4 flex flex-col items-center justify-center">
                                                    <p className="text-gray-700 font-medium text-sm uppercase">
                                                        Pending
                                                    </p>
                                                    <p className="text-yellow-600 text-2xl font-bold">
                                                        {stats.remaining}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Status and Actions */}
                                            <div className="flex flex-col justify-between">
                                                {/* Current Status */}
                                                <div className="mb-4">
                                                    <div className="flex items-center mb-2">
                                                        <span className="mr-2 font-medium">
                                                            Status:
                                                        </span>
                                                        <span
                                                            className={`px-3 py-1 text-xs rounded-full ${
                                                                whatsapp.isSending
                                                                    ? "bg-blue-100 text-blue-800"
                                                                    : whatsapp.isPaused
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : whatsapp.isCompleted
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                            }`}
                                                        >
                                                            {whatsapp.isSending
                                                                ? "Sending"
                                                                : whatsapp.isPaused
                                                                ? "Paused"
                                                                : whatsapp.isCompleted
                                                                ? "Completed"
                                                                : "Ready"}
                                                        </span>
                                                        {whatsapp.progressStreaming && (
                                                            <span className="text-xs text-green-600 ml-2">
                                                                (Live Updates)
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* If there are failed messages, show a warning */}
                                                    {stats.failed > 0 && (
                                                        <div className="bg-red-50 text-red-700 p-2 rounded text-sm">
                                                            {stats.failed}{" "}
                                                            message(s) failed to
                                                            send.
                                                            {whatsapp.isCompleted ||
                                                            whatsapp.isPaused
                                                                ? " Use 'Retry Failed' to attempt sending them again."
                                                                : ""}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-wrap gap-2">
                                                    <CustomButton
                                                        onClick={
                                                            handleOpenSettings
                                                        }
                                                        variant="secondary"
                                                        disabled={
                                                            whatsapp.isSending ||
                                                            whatsapp.loading
                                                        }
                                                    >
                                                        Settings
                                                    </CustomButton>

                                                    {!whatsapp.sendingStatus ||
                                                    whatsapp.sendingStatus ===
                                                        "idle" ? (
                                                        <CustomButton
                                                            onClick={
                                                                handleStartSending
                                                            }
                                                            variant="primary"
                                                            disabled={
                                                                !fileUploaded ||
                                                                whatsapp.loading
                                                            }
                                                        >
                                                            Start Sending
                                                        </CustomButton>
                                                    ) : whatsapp.isSending ? (
                                                        <CustomButton
                                                            onClick={
                                                                handlePauseSending
                                                            }
                                                            variant="warning"
                                                            disabled={
                                                                whatsapp.loading
                                                            }
                                                        >
                                                            Pause Sending
                                                        </CustomButton>
                                                    ) : whatsapp.isPaused ? (
                                                        <CustomButton
                                                            onClick={
                                                                handleResumeSending
                                                            }
                                                            variant="primary"
                                                            disabled={
                                                                whatsapp.loading
                                                            }
                                                        >
                                                            Resume Sending
                                                        </CustomButton>
                                                    ) : null}

                                                    {(whatsapp.isCompleted ||
                                                        whatsapp.isPaused) &&
                                                        stats.failed > 0 && (
                                                            <CustomButton
                                                                onClick={
                                                                    handleRetryFailed
                                                                }
                                                                variant="danger"
                                                                disabled={
                                                                    whatsapp.loading
                                                                }
                                                            >
                                                                Retry Failed (
                                                                {stats.failed})
                                                            </CustomButton>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {whatsapp.sendingStatus !== "idle" && (
                                    <div className="bg-white rounded-lg shadow-md p-5 mb-6">
                                        <div className="mb-4">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-gray-700 font-medium">
                                                    Overall Progress:
                                                </span>
                                                <span className="text-gray-700 font-medium">
                                                    {Math.round(progress)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                                <div
                                                    className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-in-out"
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-gray-700 font-medium">
                                                    Batch Progress:{" "}
                                                    {currentBatch}/
                                                    {totalBatches}
                                                </span>
                                                <span className="text-gray-700 font-medium">
                                                    {Math.round(batchProgress)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                                <div
                                                    className="bg-green-500 h-4 rounded-full transition-all duration-300 ease-in-out"
                                                    style={{
                                                        width: `${batchProgress}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="table-section">
                                    <CustomTable
                                        columns={columns}
                                        data={getContactData()} // Use function to get most up-to-date contacts
                                        pagination={true}
                                        itemsPerPage={10}
                                        searchable={true}
                                    />
                                </div>
                            </>
                        )}
                    </>
                )}
            </CustomContainer>

            {/* QR Code Modal */}
            <CustomModal
                isOpen={showQrModal}
                onClose={() => setShowQrModal(false)}
                title="Scan QR Code"
                size="medium"
            >
                <div className="qr-code-container">
                    {whatsapp.qrCode ? (
                        <>
                            {/* Make sure the QR code is displayed correctly */}
                            <img
                                src={
                                    whatsapp.qrCode.startsWith("data:")
                                        ? whatsapp.qrCode // If it already has a data URL prefix, use it as is
                                        : `data:image/png;base64,${whatsapp.qrCode}`
                                } // Otherwise add the prefix
                                alt="WhatsApp QR Code"
                                className="mx-auto max-w-full h-auto"
                            />
                            <p className="text-center mt-4">
                                Scan this QR code with WhatsApp to connect
                            </p>
                            <div className="mt-4 text-center">
                                <CustomButton
                                    onClick={async () => {
                                        try {
                                            const result =
                                                await whatsapp.checkStatus();

                                            if (
                                                result.success &&
                                                result.connected
                                            ) {
                                                setShowQrModal(false);
                                                displayToast(
                                                    "WhatsApp connected successfully!",
                                                    "success"
                                                );
                                            } else {
                                                displayToast(
                                                    result.message ||
                                                        "Please scan the QR code to connect.",
                                                    "info"
                                                );
                                            }
                                        } catch (error) {
                                            displayToast(
                                                "Failed to check connection status",
                                                "error"
                                            );
                                            console.error(error);
                                        }
                                    }}
                                    variant="secondary"
                                    disabled={whatsapp.loading}
                                >
                                    Check My Login
                                </CustomButton>
                            </div>
                        </>
                    ) : (
                        <p className="text-center py-8">
                            Generating QR code...
                        </p>
                    )}
                </div>
            </CustomModal>

            {/* Settings Modal */}
            <SettingsModal
                isOpen={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
                settings={{ ...settings, total: stats.total }}
                onSave={handleSaveSettings}
            />
        </div>
    );
};

export default SlipSendPage;
