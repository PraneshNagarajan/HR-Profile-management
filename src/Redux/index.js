import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./AuthenticationSlice";
import InfoReducer from "./EmployeeInfoSlice";

const store = configureStore({
    reducer: {
        auth: AuthReducer,
        info: InfoReducer
    }
})

export default store