// controllers/whatsapp.controller.js
const whatsappService = require('../../services/whatsapp.service');

// Helper function for delay (was missing in original code)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate QR code for WhatsApp authentication
const generateQRCode = async (req, res) => {
  try {
    // Step 1: Check if session exists and disconnect it
    const currentStatus = await whatsappService.getConnectionStatus();

    if (currentStatus && ['connected', 'connecting'].includes(currentStatus.status)) {
      console.log('Existing session detected. Disconnecting...');
      await whatsappService.disconnect();
      await delay(1000); // Give time to cleanup
    }

    // Step 2: Initialize QR generation
    console.log('Initializing QR code generation...');
    whatsappService.getQRCode(); // Just initialize

    const maxWaitTime = 30000; // 30 seconds
    const pollInterval = 500;  // 500ms
    const startTime = Date.now();

    let qrData = null;

    // Step 3: Poll until QR is generated
    while (Date.now() - startTime < maxWaitTime) {
      const result = whatsappService.getQRCode(); // Try fetching QR
      if (result && result.qrCode) {
        qrData = result;
        break;
      }
      console.log('Waiting for QR...');
      await delay(pollInterval);
    }

    if (!qrData) {
      return res.status(400).json({
        success: false,
        message: "Failed to generate QR code. Try again later."
      });
    }

    // Step 4: Successfully send QR
    return res.status(200).json({
      success: true,
      qrCode: qrData.qrCode,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('QR generation error:', error.message || error);

    try {
      await whatsappService.disconnect();
    } catch (cleanupError) {
      console.error('Failed during cleanup after QR error:', cleanupError.message || cleanupError);
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error during QR code generation"
    });
  }
};

// Get current WhatsApp connection status
const getStatus = async (req, res) => {
  try {
    const status = await whatsappService.getConnectionStatus();
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Could not retrieve connection status"
      });
    }
    
    return res.status(200).json({
      success: true,
      ...status
    });
  } catch (error) {
    console.error('Status check error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while checking status"
    });
  }
};

// Disconnect WhatsApp session
const disconnectSession = async (req, res) => {
  try {
    const result = await whatsappService.disconnect();
    
    if (!result || !result.success) {
      return res.status(400).json({
        success: false,
        message: result?.message || "Failed to disconnect session"
      });
    }
    
    return res.status(200).json({
      success: true,
      message: result.message || "Successfully disconnected"
    });
  } catch (error) {
    console.error('Disconnect error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error during disconnect"
    });
  }
};

// Start sending PDFs
const startSendingPDFs = async (req, res) => {
  try {
    const { settings, contacts } = req.body;
    
    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid contacts provided"
      });
    }
    
    if (!settings) {
      return res.status(400).json({
        success: false,
        message: "No settings provided"
      });
    }
    
    // Setup contacts with settings
    const setupResult = await whatsappService.setupContacts(contacts, settings);
    
    if (!setupResult || !setupResult.success) {
      return res.status(400).json({
        success: false,
        message: setupResult?.message || "Failed to setup contacts"
      });
    }
    
    // Start sending process
    const result = await whatsappService.startSending();
    
    if (!result || !result.success) {
      return res.status(400).json({
        success: false,
        message: result?.message || "Failed to start sending process"
      });
    }
    
    // Get initial progress to return to client
    const initialProgress = await whatsappService.getProgress();
    
    return res.status(200).json({
      success: true,
      message: result.message || "Started sending PDFs successfully",
      progress: initialProgress
    });
  } catch (error) {
    console.error('Start sending error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while starting send process"
    });
  }
};

// Pause sending process
const pauseSending = async (req, res) => {
  try {
    const result = await whatsappService.pauseSending();
    
    if (!result || !result.success) {
      return res.status(400).json({
        success: false,
        message: result?.message || "Failed to pause sending"
      });
    }
    
    // Get current progress after pausing
    const currentProgress = await whatsappService.getProgress();
    
    return res.status(200).json({
      success: true,
      message: result.message || "Sending paused successfully",
      progress: currentProgress
    });
  } catch (error) {
    console.error('Pause error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while pausing"
    });
  }
};

// Resume sending process
const resumeSending = async (req, res) => {
  try {
    const result = await whatsappService.resumeSending();
    
    if (!result || !result.success) {
      return res.status(400).json({
        success: false,
        message: result?.message || "Failed to resume sending"
      });
    }
    
    // Get current progress after resuming
    const currentProgress = await whatsappService.getProgress();
    
    return res.status(200).json({
      success: true,
      message: result.message || "Sending resumed successfully",
      progress: currentProgress
    });
  } catch (error) {
    console.error('Resume error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while resuming"
    });
  }
};

// Retry failed sends
const retryFailed = async (req, res) => {
  try {
    const result = await whatsappService.retryFailed();
    
    if (!result || !result.success) {
      return res.status(400).json({
        success: false,
        message: result?.message || "Failed to retry failed sends"
      });
    }
    
    // Get current progress after retrying failed messages
    const currentProgress = await whatsappService.getProgress();
    
    return res.status(200).json({
      success: true,
      message: result.message || "Retrying failed sends",
      progress: currentProgress
    });
  } catch (error) {
    console.error('Retry error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while retrying failed sends"
    });
  }
};

// Get progress of sending process
const getProgress = async (req, res) => {
  try {
    const progress = await whatsappService.getProgress();
    
    if (!progress) {
      return res.status(400).json({
        success: false,
        message: "Could not retrieve progress information"
      });
    }
    
    return res.status(200).json({
      success: true,
      progress
    });
  } catch (error) {
    console.error('Get progress error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while getting progress"
    });
  }
};

module.exports = {
  generateQRCode,
  getStatus,
  disconnectSession,
  startSendingPDFs,
  pauseSending,
  resumeSending,
  retryFailed,
  getProgress
};