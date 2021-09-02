import { createSlice } from "@reduxjs/toolkit";

const AlertSlice = createSlice({
name: 'Alert',
initialState: {
    show: false,
    msg:'',
    msgFlag: ''
},
reducers: {
    handleShow(state, action) {
        state.show = true
        state.msg = action.payload.msg
        state.msgFlag = action.payload.flag
    },
    handleClose(state) {
        state.show = false
    }
}
})

export const AlertActions = AlertSlice.actions
export default AlertSlice.reducer