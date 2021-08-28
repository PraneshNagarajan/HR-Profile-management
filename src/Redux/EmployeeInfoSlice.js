import { createSlice } from "@reduxjs/toolkit";

const EmployeeInfoSlice = createSlice({
    name: 'employee-info',
    initialState: {
        personal: [],
        address: [],
        employee:[]
    },
    reducers: {
        getPersonalInfo(state, payload) {
            state.personal = [payload]
        },
        getAddressInfo(state, payload) {
            state.address = [payload]
        },
        getEmployeeInfo(state, payload) {
            state.employee = [payload]
        }
    }
})
export const InfoActions = EmployeeInfoSlice.actions;
export default EmployeeInfoSlice.reducer;