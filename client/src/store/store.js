// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import uploadReducer from "./uploadSlice";
import whatsappReducer from "./whatsappSlice";
import slipGenerateReducer from "./slipGenerateSlice";
import rolesPermissionsReducer from "./rolesPermissionsSlice";
import companyStructureReducer from "./CompanyStructureSlice";
import countrySlice from "./countrySlice";
import employeeTypeReducer from "./EmployeeTypeSlice";

const store = configureStore({
    reducer: {
        upload: uploadReducer,
        whatsapp: whatsappReducer,
        slipGenerate: slipGenerateReducer,
        rolesPermissions: rolesPermissionsReducer,
        companyStructure: companyStructureReducer,
        country: countrySlice,
        employeeType: employeeTypeReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
