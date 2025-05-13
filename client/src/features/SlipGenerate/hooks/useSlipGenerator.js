import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import {
  generateSlips,
  resetSlipGeneration,
} from '../../../store/slipGenerateSlice';

export const useSlipGenerator = () => {
  const dispatch = useDispatch();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [isUploadDone, setIsUploadDone] = useState(false);
  
  // Select the entire slipGenerate state from Redux
  const slipState = useSelector((state) => state.slipGenerate);
  const {
    loading, // File upload in progress
    streaming, // SSE streaming in progress
    success, // Operation completed successfully
    error, // Any error that occurred
    completed, // Processing completed flag
    
    // Progress tracking data directly from Redux
    total,
    generated,
    failed,
    pending,
    processed,
    percentage,
    
    // Results data
    tracking, // Individual employee tracking data (replacing rows)
    zipPath, // Path to generated ZIP
    zipFilename, // Filename of the ZIP
    
    // Download status
    downloading,
    downloadSuccess,
    downloadError,
    message // Status message
  } = slipState;

  // File upload handler
  const handleFileUpload = useCallback((files) => {
    setSelectedFiles(files);11.90

  }, []);
  
  // Start generation process
  const startSlipGeneration = useCallback(() => {
    if (!selectedFiles.length) return;
    
    // Set table loading state
    setTableLoading(true);
    setIsUploadDone(true);
    
    const formData = new FormData();
    formData.append('file', selectedFiles[0]);
    
    // Trigger the slip generation action
    dispatch(generateSlips(formData));
  }, [dispatch, selectedFiles]);

  // Reset handler
  const resetGeneration = useCallback(() => {
    dispatch(resetSlipGeneration());
    setSelectedFiles([]);
    setTableLoading(false);
  }, [dispatch]);

  // Reset slip generation when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetSlipGeneration());
    };
  }, [dispatch]);
  
  // Update tableLoading state based on tracking data
  useEffect(() => {
    // If we have tracking data and it's not empty, we can turn off table loading
    if (tracking && tracking.length > 0) {
      setTableLoading(false);
    }
    
    // Also turn off loading when processing is complete or if there's an error
    if (completed || error) {
      setTableLoading(false);
    }
  }, [tracking, completed, error]);

  // Calculate overall processing state
  const isProcessing = loading || streaming;
  
  // Determine if table should show loading state
  const isTableLoading = tableLoading && !error && tracking.length === 0;

  // Stats object for convenience
  const stats = {
    total,
    generated,
    failed,
    pending
  };

  return {
    // File selection
    selectedFiles,
    handleFileUpload,
    
    // Actions
    startSlipGeneration,
    resetGeneration,
    
    // Status flags
    loading,
    streaming,
    isProcessing,
    isTableLoading, // New flag specifically for table loading state
    success,
    completed,
    error,
    message,
    
    // Progress data
    progressPercentage: percentage, // Use the percentage directly from Redux
    slipData: tracking, // Data rows for the table (tracking array)
    
    // Download info
    zipPath,
    zipFilename,
    downloading,
    downloadSuccess,
    downloadError,
    
    // Consolidated stats
    stats,

    // Upload completion state
    isUploadDone
  };
};