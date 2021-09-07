import { configureStore } from "@reduxjs/toolkit";
import AlertReducer from "./AlertSlice";
import AuthReducer from "./AuthenticationSlice";
import DemandPreRequisiteReducer from "./DemandCreationPreRequisite";
import InfoReducer from "./EmployeeInfoSlice";

const store = configureStore({
    reducer: {
        auth: AuthReducer,
        info: InfoReducer,
        alert: AlertReducer,
        demandPreRequisite: DemandPreRequisiteReducer
    }
})

export default store