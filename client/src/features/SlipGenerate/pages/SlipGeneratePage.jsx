import React, { useState, useEffect } from "react";
import {
    CustomContainer,
    FileUpload,
    ImagePreview,
    CustomTable,
} from "../../../components";
import { colorMap } from "../../../utils/colorPalatte";
import { useSlipGenerator } from "../hooks/useSlipGenerator";
import previewImage from "../../../assets/images/slipGenerate/baseDataNeed.png";
import SampleExcelFileDownload from "../../../assets/images/slipGenerate/baseDataNeed.xlsx";

function SlipGeneratePage() {
    const {
        selectedFiles,
        handleFileUpload,
        startSlipGeneration,
        loading,
        streaming,
        isProcessing,
        isTableLoading, // Use the new flag for table loading
        success,
        completed,
        error,
        message,
        progressPercentage,
        slipData,
        stats: slipStats, // Use the consolidated stats from the hook
        isUploadDone,
    } = useSlipGenerator();

    // Initialize table data
    const [tableData, setTableData] = useState([]);

    const columns = [
        { header: "Sr No", accessor: "srNo", key: "srNo" },
        { header: "Punch Code", accessor: "punchCode", key: "punchCode" },
        {
            header: "Name",
            accessor: "employeeName", // Updated to match the Redux state key
            key: "employeeName",
        },
        { header: "Phone No", accessor: "phoneNo", key: "phoneNo" },
        {
            key: "status",
            header: "Status",
            accessor: "status",
            cell: (row) => {
                let statusColor = "gray";
                if (row.status === "success") statusColor = "green";
                else if (row.status === "failed") statusColor = "red";
                else if (row.status === "pending") statusColor = "orange";
                else if (row.status === "processing") statusColor = "blue";

                // Handle the case when status might be an object
                const statusValue =
                    typeof row.status === "object"
                        ? JSON.stringify(row.status)
                        : row.status;

                return (
                    <div className="status-cell !justify-normal gap-2">
                        <span
                            className={`status-indicator ${statusColor}`}
                        ></span>
                        <span>{statusValue}</span>
                    </div>
                );
            },
        },
        {
            key: "reason", // Updated to match the Redux state key
            header: "Reason",
            accessor: "reason",
            cell: (row) => {
                // Handle the case when reason might be an object
                const reasonValue =
                    typeof row.reason === "object" && row.reason !== null
                        ? JSON.stringify(row.reason)
                        : row.reason || "--";

                return (
                    <div className="whitespace-pre-wrap text-sm text-gray-700">
                        {reasonValue}
                    </div>
                );
            },
        },
    ];

    // Process the incoming slipData to format it for the table
    useEffect(() => {
        if (slipData && slipData.length > 0) {
            // Map the data to match our table columns and ensure all values are render-safe
            const formattedData = slipData.map((item, index) => {
                // Create a safe copy of the item
                const safeCopy = { ...item };

                // Check for objects in the data and convert them to strings
                Object.keys(safeCopy).forEach((key) => {
                    if (
                        typeof safeCopy[key] === "object" &&
                        safeCopy[key] !== null
                    ) {
                        // Convert objects (like formula objects) to strings
                        safeCopy[key] = JSON.stringify(safeCopy[key]);
                    }
                });

                return {
                    srNo: index + 1,
                    ...safeCopy,
                };
            });

            setTableData(formattedData);
        }
    }, [slipData]);

    const StatCard = ({ title, value, color = "green", icon }) => {
        const styles = colorMap[color] || colorMap.green; // fallback to green
      
        return (
          <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${styles.border} flex items-center`}>
            <div className={`${styles.bg} p-3 rounded-full mr-4`}>
              <span className={styles.text}>{icon}</span>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
          </div>
        );
      };
      

    return (
        <CustomContainer title="Slip Generate" className="h-full">
            <div className="flex flex-col space-y-4">
                <div className="upload-section flex flex-row gap-3">
                    <div className="flex-1">
                        <FileUpload
                            onFilesSelected={handleFileUpload}
                            accept=".excel,.xls,.xlsx"
                            multiple={false}
                            maxFileSize={200 * 1024 * 1024}
                            maxFiles={1}
                            buttonText="Choose Excel File"
                            dragDropText="Drag & drop Excel file here"
                            label="Upload Excel file (containing all details to generate the slip)"
                            showPreview={true}
                        />
                    </div>
                    <div className="flex-1">
                        <ImagePreview
                            label="Expected Excel File Structure"
                            className="h-full"
                            src={previewImage}
                            size="small"
                            height="285px"
                            showControls={true}
                            showInfo={false}
                            showCaption={true}
                            showThumbnails={true}
                            extraFileDownload={SampleExcelFileDownload}
                        />
                    </div>
                </div>

                {selectedFiles && selectedFiles.length > 0 && (
                    <div className="flex justify-center mt-4">
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                            onClick={startSlipGeneration}
                            disabled={isProcessing}
                        >
                            {loading
                                ? "Uploading..."
                                : streaming
                                ? "Processing..."
                                : "Upload"}
                        </button>
                    </div>
                )}
            </div>

            <div className="my-6 border-t border-gray-200"></div>

            {/* Show message/error if any */}
            {message && !completed && !success && (
                <div
                    className={`${
                        error
                            ? "bg-red-100 border-red-400 text-red-700"
                            : "bg-blue-100 border-blue-400 text-blue-700"
                    } px-4 py-3 rounded mb-4 border`}
                    role="alert"
                >
                    <strong className="font-bold">
                        {error ? "Error: " : "Status: "}
                    </strong>
                    <span className="block sm:inline">{message}</span>
                </div>
            )}
            {/* Show message/error if any */}
            {message && completed && (
                <div
                    className={`${
                        error
                            ? "bg-green-100 border-green-400 text-green-700"
                            : "bg-blue-100 border-blue-400 text-blue-700"
                    } px-4 py-3 rounded mb-4 border`}
                    role="alert"
                >
                    <strong className="font-bold">
                        {!completed ? "Error: " : "Status: "}
                    </strong>
                    <span className="block sm:inline">{message}</span>
                    <span className="block sm:inline">{completed}</span>
                </div>
            )}
            {isUploadDone && (
                <>
                    {/* Progress bar */}
                    <div className="w-full mt-4 flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                            File Generate Progress
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-[9px] shadow-inner overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-blue-700 h-[9px] transition-all duration-500 ease-in-out"
                                style={{
                                    width: `${progressPercentage}%`,
                                }}
                            ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                            {progressPercentage}%
                        </span>
                    </div>

                    <div className="my-6 border-t border-gray-200"></div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-[16%]">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                Slip Statistics
                            </h2>
                            <div className="flex flex-col gap-4">
                                <StatCard
                                    title="Total Slips"
                                    value={slipStats.total || 0}
                                    color="blue"
                                    icon={
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                    }
                                />
                                <StatCard
                                    title="Generated"
                                    value={slipStats.generated || 0}
                                    color="green"
                                    icon={
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    }
                                />
                                <StatCard
                                    title="Failed"
                                    value={slipStats.failed || 0}
                                    color="red"
                                    icon={
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    }
                                />
                                <StatCard
                                    title="Pending"
                                    value={slipStats.pending || 0}
                                    color="amber"
                                    icon={
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    }
                                />
                            </div>
                        </div>

                        <div className="lg:w-[100%]">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                Slip Generation Status
                            </h2>
                            <CustomTable
                                columns={columns}
                                data={tableData}
                                pagination={true}
                                itemsPerPage={10}
                                searchable={true}
                                filterableColumns={["status", "reason"]}
                                loading={isTableLoading} // Use the new isTableLoading flag here
                            />
                        </div>
                    </div>
                </>
            )}
        </CustomContainer>
    );
}

export default SlipGeneratePage;
