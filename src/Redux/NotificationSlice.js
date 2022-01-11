import { createSlice } from "@reduxjs/toolkit";

const NotificationSlice = createSlice({
    name: "Notification",
    initialState :{
        count : 0,
        data: {}
    },
    reducers:{
        getNotifications(state, action){
            state.count = action.payload.key;
            state.data = action.payload.data;
        },
        changeStatus(state,action) {
            let datas = state.data
            if(action.payload.status === "delete"){
                delete datas[action.payload.key];
            } else if(datas[action.payload.key].status === "marked") {
                datas[action.payload.key].status = "read"
            } else {
                datas[action.payload.key].status = action.payload.status
            }
            state.count = state.count - 1;
            state.data = datas
        },
        clearNotification(state) {
            state.count = 0
        }
    }
})

export const NotificationActions = NotificationSlice.actions;
export default NotificationSlice.reducer;