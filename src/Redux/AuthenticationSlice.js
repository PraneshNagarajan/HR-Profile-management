import { createSlice } from "@reduxjs/toolkit";

const AuthenticationSlice = createSlice({
    name: 'Auth',
    initialState: {
        msg : false,
        flag: false,
        role: '',
        admin: '',
        name: '',
        photoUrl: ''
    },
    reducers: {
        getMsg(state, action) {
            state.msg = action.payload;
        },
        getAuthStatus(state, action) {
            state.flag = action.payload.flag;
            state.role = action.payload.role;
            state.admin = action.payload.admin;
            state.name = action.payload.name;
            state.photoUrl = action.payload.photoUrl
        }
    }
})

export const AuthActions = AuthenticationSlice.actions;
export default AuthenticationSlice.reducer;