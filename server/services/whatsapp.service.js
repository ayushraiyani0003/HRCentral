// services/whatsapp.service.js
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');
const { createNaturalDelay } = require('../utils/functions.utils');

// Store client and session state
let whatsappClient = null;
let qrCodeData = null;
let sessionState = {
  status: 'disconnected',
  processingState: 'idle', // idle, processing, paused, completed
  contacts: [],
  currentIndex: 0,
  batchSize: 100,
  pdfInterval: 15,
  batchInterval: 60,
  overallProgress: 0,
  batchProgress: 0,
  currentBatch: 0,
  totalBatches: 0,
  stats: {
    total: 0,
    sent: 0,
    failed: 0
  },
  processingActive: false
};

// Initialize WhatsApp client
const initializeClient = () => {
  // Clear previous client if exists
  if (whatsappClient) {
    try {
      whatsappClient.destroy();
    } catch (error) {
      console.error('Error destroying previous client:', error);
    }
    whatsappClient = null;
  }
  
  // Reset session state
  sessionState.status = 'disconnected';
  qrCodeData = null;
  
  // Create new client
  whatsappClient = new Client({
    authStrategy: new LocalAuth({ clientId: 'salary-slip-sender' }),
    puppeteer: {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
  });
  
  // Register event handlers
  whatsappClient.on('qr', async (qr) => {
    try {
      // Generate QR code as data URL
      qrCodeData = await qrcode.toDataURL(qr);
      sessionState.status = 'connecting';
      console.log('QR Code generated');
    } catch (error) {
      console.error('QR Code generation error:', error);
    }
  });
  
  whatsappClient.on('ready', () => {
    sessionState.status = 'connected';
    console.log('WhatsApp client is ready');
  });
  
  whatsappClient.on('authenticated', () => {
    console.log('Client authenticated');
  });
  
  whatsappClient.on('auth_failure', (msg) => {
    sessionState.status = 'disconnected';
    console.error('Authentication failure:', msg);
  });
  
  whatsappClient.on('disconnected', (reason) => {
    sessionState.status = 'disconnected';
    console.log('Client disconnected:', reason);
  });
  
  // Initialize the client
  whatsappClient.initialize();
};

// Get QR code for authentication
const getQRCode = () => {
  if (!whatsappClient) {
    initializeClient();
  }
  
  return { qrCode: qrCodeData };
};

// Get current connection status
const getConnectionStatus = () => {
  return { status: sessionState.status };
};

// Disconnect session
const disconnect = async () => {
  if (whatsappClient) {
    try {
      // Stop any ongoing process
      sessionState.processingActive = false;
      
      // Logout and destroy client
      await whatsappClient.logout();
      await whatsappClient.destroy();
      
      // Reset client and state
      whatsappClient = null;
      sessionState.status = 'disconnected';
      sessionState.processingState = 'idle';
      sessionState.contacts = [];
      resetProgress();
      
      return { success: true, message: 'WhatsApp session disconnected' };
    } catch (error) {
      console.error('Disconnect error:', error);
      return { success: false, message: 'Error disconnecting: ' + error.message };
    }
  } else {
    return { success: true, message: 'No active session to disconnect' };
  }
};

// Reset progress tracking
const resetProgress = () => {
  sessionState.currentIndex = 0;
  sessionState.overallProgress = 0;
  sessionState.batchProgress = 0;
  sessionState.currentBatch = 0;
  sessionState.processingActive = false;
  sessionState.stats = {
    total: 0,
    sent: 0,
    failed: 0
  };
};

// Set up contacts for sending
const setupContacts = (contacts, settings) => {
  // Update sessionState with new contacts and settings
  sessionState.contacts = [...contacts];
  sessionState.batchSize = settings.batchSize || 100;
  sessionState.pdfInterval = settings.pdfInterval || 10;
  sessionState.batchInterval = settings.batchInterval || 30;
  
  // Calculate batches
  sessionState.totalBatches = Math.ceil(contacts.length / sessionState.batchSize);
  
  // Reset progress
  resetProgress();
  
  // Update stats
  sessionState.stats = {
    total: contacts.length,
    sent: 0,
    failed: 0
  };
  
  return { success: true, message: 'Contacts set up for sending' };
};

// Start sending PDFs
const startSending = async () => {
  if (sessionState.status !== 'connected') {
    return { success: false, message: 'WhatsApp not connected' };
  }
  
  if (sessionState.contacts.length === 0) {
    return { success: false, message: 'No contacts to send to' };
  }
  
  if (sessionState.processingActive) {
    return { success: false, message: 'Sending process already active' };
  }
  
  // Set processing state
  sessionState.processingState = 'processing';
  sessionState.processingActive = true;
  
  // Start processing in background
  processBatches();
  
  return { success: true, message: 'Started sending PDFs' };
};

// Pause sending process
const pauseSending = () => {
  if (sessionState.processingState !== 'processing') {
    return { success: false, message: 'No active sending process to pause' };
  }
  
  sessionState.processingActive = false;
  sessionState.processingState = 'paused';
  return { success: true, message: 'Sending process paused' };
};

// Resume sending process
const resumeSending = () => {
  if (sessionState.processingState !== 'paused') {
    return { success: false, message: 'No paused process to resume' };
  }
  
  sessionState.processingActive = true;
  sessionState.processingState = 'processing';
  
  // Resume processing in background
  processBatches();
  
  return { success: true, message: 'Sending process resumed' };
};

// Retry failed sends
const retryFailed = () => {
  // Mark failed contacts as pending again
  sessionState.contacts = sessionState.contacts.map(contact => {
    if (contact.status === 'failed') {
      return {
        ...contact,
        status: 'pending',
        errorMessage: null
      };
    }
    return contact;
  });
  
  // Update stats
  const failedCount = sessionState.stats.failed;
  sessionState.stats.failed = 0;
  
  // Start processing if not active
  if (!sessionState.processingActive) {
    sessionState.processingActive = true;
    sessionState.processingState = 'processing';
    processBatches();
  }
  
  return { success: true, message: 'Retrying failed sends' };
};

// Get current progress
const getProgress = () => {
  return {
    status: sessionState.processingState,
    overallProgress: sessionState.overallProgress,
    batchProgress: sessionState.batchProgress,
    currentBatch: sessionState.currentBatch,
    totalBatches: sessionState.totalBatches,
    stats: sessionState.stats,
    contacts: sessionState.contacts
  };
};

// Process batches of contacts
const processBatches = async () => {
  // Get current index and calculate current batch
  const index = sessionState.currentIndex;
  const currentBatch = Math.floor(index / sessionState.batchSize) + 1;
  
  if (currentBatch > sessionState.totalBatches || !sessionState.processingActive) {
    return;
  }
  
  sessionState.currentBatch = currentBatch;
  
  // Calculate batch limits
  const batchStart = (currentBatch - 1) * sessionState.batchSize;
  const batchEnd = Math.min(batchStart + sessionState.batchSize, sessionState.contacts.length);
  
  // Process current batch
  for (let i = index; i < batchEnd; i++) {
    // Check if processing is still active
    if (!sessionState.processingActive) {
      return;
    }
    
    const contact = sessionState.contacts[i];
    
    // Skip already processed contacts
    if (contact.status !== 'pending') {
      continue;
    }
    
    // Update contact status to processing
    sessionState.contacts[i] = {
      ...contact,
      status: 'processing'
    };
    
    try {
      // Try to send the PDF
      await sendPDF(contact);
      
      // Mark as success
      sessionState.contacts[i] = {
        ...contact,
        status: 'success',
        errorMessage: null
      };
      
      // Update stats
      sessionState.stats.sent++;
    } catch (error) {
      console.error(`Error sending to ${contact.phoneNo}:`, error);
      
      // Mark as failed
      sessionState.contacts[i] = {
        ...contact,
        status: 'failed',
        errorMessage: error.message
      };
      
      // Update stats
      sessionState.stats.failed++;
    }
    
    // Update progress indicators
    sessionState.currentIndex = i + 1;
    sessionState.overallProgress = Math.round((sessionState.currentIndex / sessionState.contacts.length) * 100);
    sessionState.batchProgress = Math.round(((i - batchStart + 1) / (batchEnd - batchStart)) * 100);
    
    // Random delay between PDF sends (pdfInterval ± 2 seconds)
    const naturalDelay = createNaturalDelay(sessionState.pdfInterval);
    // console.log(`Sent to ${contact.phoneNo} in ${naturalDelay / 1000} seconds`);
    
    await new Promise(resolve => setTimeout(resolve, naturalDelay));
  }
  
  // Check if all contacts are processed
  if (sessionState.currentIndex >= sessionState.contacts.length) {
    sessionState.processingState = 'completed';
    sessionState.processingActive = false;
    return;
  }
  
  // Wait between batches with random delay
  const randomBatchDelay = createNaturalDelay(sessionState.batchInterval, 'batch');
  
  await new Promise(resolve => setTimeout(resolve, randomBatchDelay));
  
  // Continue with next batch if still active
  if (sessionState.processingActive) {
    processBatches();
  }
};

// Send PDF to a contact
const sendPDF = async (contact) => {
  if (!whatsappClient || sessionState.status !== 'connected') {
    throw new Error('WhatsApp client not connected');
  }
  
  if (!contact.pdfFile || !fs.existsSync(contact.pdfFile)) {
    throw new Error('PDF file not found');
  }
  
  try {
    // Format phone number (remove any non-digits and ensure it starts with +91)
    const cleanNumber = contact.phoneNo.toString().replace(/\D/g, '');
    
    // Remove any existing country code if present and add +91
    const phoneNumber = cleanNumber.replace(/^91/, '');
    
    // Create caption text
    const caption = `Salary Slip for ${contact.name}`;
    
    // Send the document with +91 prefix for WhatsApp API
    const media = MessageMedia.fromFilePath(contact.pdfFile);
    await whatsappClient.sendMessage(`91${phoneNumber}@c.us`, media, {
      caption: caption
    });
    
    return true;
  } catch (error) {
    console.error('Error sending PDF:', error);
    throw new Error(`Failed to send PDF: ${error.message}`);
  }
};

module.exports = {
  initializeClient,
  getQRCode,
  getConnectionStatus,
  disconnect,
  setupContacts,
  startSending,
  pauseSending,
  resumeSending,
  retryFailed,
  getProgress
};