// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import uploadReducer from './uploadSlice';
import whatsappReducer from './whatsappSlice';

const store = configureStore({
  reducer: {
    upload: uploadReducer,
    whatsapp: whatsappReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;