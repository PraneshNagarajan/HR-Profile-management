import { createSlice } from "@reduxjs/toolkit";

const EmployeeInfoSlice = createSlice({
    name: 'employee-info',
    initialState: {
        personal: [],
        address: [],
        employee:[],
        activeTab: 'personal-info'
    },
    reducers: {
        getPersonalInfo(state, action) {
            state.personal = [action.payload]
            state.activeTab = 'address-info'
        },
        getAddressInfo(state, action) {
            state.address = [action.payload]
            state.activeTab = 'employee-info'
        },
        getEmployeeInfo(state, action) {
            state.employee = [action.payload]
        },
        getActiveTab(state, action) {
            state.activeTab = action.payload
        },
    }
})
export const InfoActions = EmployeeInfoSlice.actions;
export default EmployeeInfoSlice.reducer;