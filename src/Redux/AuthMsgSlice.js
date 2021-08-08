import { createSlice } from "@reduxjs/toolkit";

const AuthMsgSlice = createSlice({
    name: 'AuthMsgSlice',
    initialState: {
        flag : false
    },
    reducers: {
        getMsg(state, action) {
            state.flag = action.payload;
        }
    }
})

export const AuthMsgActions = AuthMsgSlice.actions;
export default AuthMsgSlice.reducer;