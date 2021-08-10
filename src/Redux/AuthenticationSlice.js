import { createSlice } from "@reduxjs/toolkit";

const AuthenticationSlice = createSlice({
    name: 'Auth',
    initialState: {
        msg : false,
        flag: false
    },
    reducers: {
        getMsg(state, action) {
            state.msg = action.payload;
        },
        getAuthStatus(state, action) {
            state.flag = action.payload;
        }
    }
})

export const AuthActions = AuthenticationSlice.actions;
export default AuthenticationSlice.reducer;