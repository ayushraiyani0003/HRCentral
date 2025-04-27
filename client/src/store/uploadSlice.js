// src/store/uploadSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import uploadService from "../services/UploadService";

// Async thunk for uploading salary slips
export const uploadSalarySlips = createAsyncThunk(
  "upload/salarySlips",
  async (zipFile, { rejectWithValue }) => {
    try {
      const response = await uploadService.uploadSalarySlips(zipFile);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  contacts: [],
  stats: {
    total: 0,
    valid: 0,
    invalid: 0,
  },
  loading: false,
  error: null,
  success: false,
};

// Upload slice
const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    resetUploadState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearContacts: (state) => {
      state.contacts = [];
      state.stats = {
        total: 0,
        valid: 0,
        invalid: 0,
      };
    },
    updateContact: (state, action) => {
      const { index, updates } = action.payload;
      if (index >= 0 && index < state.contacts.length) {
        state.contacts[index] = { ...state.contacts[index], ...updates };
      }
    },
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle upload pending state
      .addCase(uploadSalarySlips.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      // Handle upload success
      .addCase(uploadSalarySlips.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.contacts = action.payload.contacts;
        state.stats = action.payload.stats;
      })
      // Handle upload failure
      .addCase(uploadSalarySlips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

// Export actions and reducer
export const { 
  resetUploadState, 
  clearContacts, 
  updateContact, 
  updateStats 
} = uploadSlice.actions;

export default uploadSlice.reducer;