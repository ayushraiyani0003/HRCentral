// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import uploadReducer from './uploadSlice';
import whatsappReducer from './whatsappSlice';
import slipGenerateReducer from './slipGenerateSlice';

const store = configureStore({
  reducer: {
    upload: uploadReducer,
    whatsapp: whatsappReducer,
    slipGenerate: slipGenerateReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;