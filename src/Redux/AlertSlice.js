import { createSlice } from "@reduxjs/toolkit";

const AlertSlice = createSlice({
name: 'Alert',
initialState: {
    show: false,
    msg:'',
    msgFlag: '',
    accept: false
},
reducers: {
    handleShow(state, action) {
        state.show = true
        state.msg = action.payload.msg
        state.msgFlag = action.payload.flag
    },
    handleClose(state) {
        state.show = false
    },
    acceptSubmit(state,action){
        state.accept = action.payload.flag
    }

}
})

export const AlertActions = AlertSlice.actions
export default AlertSlice.reducer