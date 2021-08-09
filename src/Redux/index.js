import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./AuthenticationSlice";

const store = configureStore({
    reducer: {
        auth: AuthReducer
    }
})

export default store