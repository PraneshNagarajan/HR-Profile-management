import { createSlice } from "@reduxjs/toolkit";

const AuthenticationSlice = createSlice({
    name: 'Auth',
    initialState: {
        id: '',
        email: '',
        msg : false,
        flag: false,
        role: '',
        admin: '',
        name: '',
        photoUrl: '',
        security: false,
        supervisor: "",
        manager:""
    },
    reducers: {
        getMsg(state, action) {
            state.msg = action.payload;
        },
        getAuthStatus(state, action) {
            return action.payload
        },
        getPhoto(state, action) {
            state.photoUrl = action.payload
        },
        getSecurityStatus(state) {
            state.security = true
        }
    }
})

export const AuthActions = AuthenticationSlice.actions;
export default AuthenticationSlice.reducer;