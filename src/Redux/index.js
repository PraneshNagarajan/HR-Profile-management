import { configureStore } from "@reduxjs/toolkit";
import AlertReducer from "./AlertSlice";
import AuthReducer from "./AuthenticationSlice";
import DemandPreRequisiteReducer from "./DemandCreationPreRequisite";
import InfoReducer from "./EmployeeInfoSlice";
import FilterDemandReducer from "./FilterDemandSlice";
import PaginationRedcer from "./PaginationSlice";

const store = configureStore({
    reducer: {
        auth: AuthReducer,
        info: InfoReducer,
        alert: AlertReducer,
        demandPreRequisite: DemandPreRequisiteReducer,
        pagination: PaginationRedcer,
        filterDemand: FilterDemandReducer
    }
})

export default store