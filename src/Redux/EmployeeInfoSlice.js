import { createSlice } from "@reduxjs/toolkit";

const EmployeeInfoSlice = createSlice({
    name: 'employee-info',
    initialState: {
        personal: [],
        address: [],
        employee:[]
    },
    reducers: {
        getPersonalInfo(state, action) {
            console.log(action.payload)
            state.personal = [action.payload]
        },
        getAddressInfo(state, action) {
            state.address = [action.payload]
        },
        getEmployeeInfo(state, action) {
            state.employee = [action.payload]
        }
    }
})
export const InfoActions = EmployeeInfoSlice.actions;
export default EmployeeInfoSlice.reducer;