// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import uploadReducer from "./uploadSlice";
import whatsappReducer from "./whatsappSlice";
import slipGenerateReducer from "./slipGenerateSlice";
import rolesPermissionsReducer from "./rolesPermissionsSlice";

const store = configureStore({
    reducer: {
        upload: uploadReducer,
        whatsapp: whatsappReducer,
        slipGenerate: slipGenerateReducer,
        rolesPermissions: rolesPermissionsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
