// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import uploadReducer from "./uploadSlice";
import whatsappReducer from "./whatsappSlice";
import slipGenerateReducer from "./slipGenerateSlice";
import rolesPermissionsReducer from "./rolesPermissionsSlice";
import companyStructureReducer from "./CompanyStructureSlice";
import countrySlice from "./countrySlice";
import employeeTypeReducer from "./EmployeeTypeSlice";
import bankReducer from "./BankListSlice";
import salutationReducer from "./SalutationSlice";
import designationsReducer from "./DesignationsSlice";
import educationLevelsReducer from "./EducationLevelsSlice";
import experienceLevelReducer from "./ExperienceLevelsSlice";
import hiringSourceReducer from "./HiringSourceSlice";
import jobLocationReducer from "./JobLocationTypeSlice";
import skillsReducer from "./SkillsSlice";
import workShiftReducer from "./WorkShiftSlice";

const store = configureStore({
    reducer: {
        upload: uploadReducer,
        whatsapp: whatsappReducer,
        slipGenerate: slipGenerateReducer,
        rolesPermissions: rolesPermissionsReducer,
        companyStructure: companyStructureReducer,
        country: countrySlice,
        employeeType: employeeTypeReducer,
        banks: bankReducer,
        salutations: salutationReducer,
        designations: designationsReducer,
        educationLevels: educationLevelsReducer,
        employeeTypes: employeeTypeReducer,
        experienceLevels: experienceLevelReducer,
        hiringSource: hiringSourceReducer,
        jobLocationTypes: jobLocationReducer,
        skills: skillsReducer,
        workShifts: workShiftReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
