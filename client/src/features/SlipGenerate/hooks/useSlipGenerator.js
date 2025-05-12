import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState, useMemo } from 'react';
import {
  generateSlips,
  resetSlipGeneration,
} from '../../../store/slipGenerateSlice';

export const useSlipGenerator = () => {
  const dispatch = useDispatch();
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  const slipState = useSelector((state) => state.slipGenerate);
  const { 
    loading, 
    streaming, 
    success, 
    error, 
    progress, 
    zipFiles, 
    rows,
    completed 
  } = slipState;

  // New stats calculation for slips
  const [stats, setStats] = useState({
    total: 0,
    generated: 0,
    failed: 0,
    pending: 0,
  });

  const handleFileUpload = useCallback((files) => {
    setSelectedFiles(files);
  }, []);

  const startSlipGeneration = useCallback(() => {
    if (!selectedFiles.length) return;

    const formData = new FormData();
    formData.append('file', selectedFiles[0]);

    // Trigger the slip generation action
    dispatch(generateSlips(formData));
  }, [dispatch, selectedFiles]);

  // Reset slip generation when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetSlipGeneration());
    };
  }, [dispatch]);

  // Calculate overall status for processing state
  const isProcessing = loading || streaming;
  
  // Calculate progress percentage for the progress bar
  const progressPercentage = useMemo(() => {
    if (!progress || !Array.isArray(progress) || progress.length === 0) return 0;

    // If progress items have a status property
    if (progress[0] && 'status' in progress[0]) {
      const total = progress.length;
      const completedCount = progress.filter(
        (item) => item.status === 'completed' || item.status === 'success'
      ).length;
      return Math.round((completedCount / total) * 100);
    }

    // Otherwise, fallback to using the array length
    return progress.length;
  }, [progress]);

  // Update statistics whenever rows data changes
  useEffect(() => {
    if (rows && rows.length > 0) {
      const total = rows.length;
      const generated = rows.filter((d) => d.status === 'success').length;
      const failed = rows.filter((d) => d.status === 'failed').length;
      const pending = rows.filter((d) => d.status === 'pending').length;

      setStats({ total, generated, failed, pending });
    }
  }, [rows]);

  return {
    selectedFiles,
    handleFileUpload,
    startSlipGeneration,
    loading,          // File upload in progress
    streaming,        // SSE streaming in progress
    isProcessing,     // Either loading or streaming
    success,          // Operation completed successfully
    completed,        // Streaming completed (terminal state)
    error,            // Any error that occurred
    progress,         // Progress data array
    progressPercentage, // Calculated progress percentage
    zipFiles,         // Download files
    slipData: rows,   // Data rows for the table
    stats,            // Statistics for total, generated, failed, and pending
  };
};
