import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import {
  generateSlips,
  resetSlipGeneration,
} from '../../../store/slipGenerateSlice';

export const useSlipGenerator = () => {
  const dispatch = useDispatch();
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  const slipState = useSelector((state) => state.slipGenerate);
  const { loading, success, error, progress, zipFiles, rows } = slipState;

  const handleFileUpload = (files) => {
    setSelectedFiles(files);
  };

  const startSlipGeneration = useCallback(() => {
    if (!selectedFiles.length) return;

    const formData = new FormData();
    formData.append('file', selectedFiles[0]);

    // This will trigger the generateSlips thunk which handles both file upload
    // and starts the streaming process via startStreamProgress
    dispatch(generateSlips(formData));
    
    // Clear selected files after starting generation
    setSelectedFiles([]);
  }, [dispatch, selectedFiles]);

  // Cleanup function to reset state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetSlipGeneration());
    };
  }, [dispatch]);

  return {
    selectedFiles,
    handleFileUpload,
    startSlipGeneration,
    loading,
    success,
    error,
    progress,
    zipFiles,
    slipData: rows,
  };
};