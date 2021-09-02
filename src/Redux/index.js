import { configureStore } from "@reduxjs/toolkit";
import AlertReducer from "./AlertSlice";
import AuthReducer from "./AuthenticationSlice";
import InfoReducer from "./EmployeeInfoSlice";

const store = configureStore({
    reducer: {
        auth: AuthReducer,
        info: InfoReducer,
        alert: AlertReducer
    }
})

export default store