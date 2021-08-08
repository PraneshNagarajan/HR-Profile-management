import { configureStore } from "@reduxjs/toolkit";
import AuthMsgReducer from "./AuthMsgSlice";

const store = configureStore({
    reducer: {
        AuthMsg: AuthMsgReducer
    }
})

export default store