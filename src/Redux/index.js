import { configureStore } from "@reduxjs/toolkit";
import AlertReducer from "./AlertSlice";
import AuthReducer from "./AuthenticationSlice";
import DemandPreRequisiteReducer from "./DemandCreationPreRequisite";
import InfoReducer from "./EmployeeInfoSlice";
import FilterDemandReducer from "./FilterDemandSlice";
import FilterProfileReducer from "./FilterProfileSlice";
import PaginationReducer from "./PaginationSlice";
import ProfileReducer from "./ProfileSlice";

const store = configureStore({
    reducer: {
        auth: AuthReducer,
        info: InfoReducer,
        alert: AlertReducer,
        demandPreRequisite: DemandPreRequisiteReducer,
        pagination: PaginationReducer,
        filterDemand: FilterDemandReducer,
        filterProfile: FilterProfileReducer,
        profileInfo : ProfileReducer

    }
})

export default store