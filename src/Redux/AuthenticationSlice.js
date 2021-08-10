import { createSlice } from "@reduxjs/toolkit";

const AuthenticationSlice = createSlice({
    name: 'Auth',
    initialState: {
        msg : false,
        flag: false,
        role: '',
        admin: ''
    },
    reducers: {
        getMsg(state, action) {
            state.msg = action.payload;
        },
        getAuthStatus(state, action) {
            state.flag = action.payload.flag;
            state.role = action.payload.role;
            state.admin = action.payload.admin;
        }
    }
})

export const AuthActions = AuthenticationSlice.actions;
export default AuthenticationSlice.reducer;