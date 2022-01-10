import { createSlice } from "@reduxjs/toolkit";

const NotificationSlice = createSlice({
    name: "Notification",
    initialState :{
        notification: 0,
        data: {}
    },
    reducers:{
        getNotifications(state, action){
            state.notification = action.payload.count;
            state.data = action.payload.data;
        },
        clearNotification(state) {
            state.data = {}
            state.notification = 0
        }
    }
})

export const NotificationActions = NotificationSlice.actions;
export default NotificationSlice.reducer;