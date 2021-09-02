import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  personal: {},
  address: {},
  employee: {},
  employee_status: true,
  activeTab: "personal-info",
  submitted: false,
  passwordManagement: {},
  password_status: true
};
const EmployeeInfoSlice = createSlice({
  name: "employee-info",
  initialState,
  reducers: {
    getCompleteInfo(state, action) {
      state.personal = action.payload.personal
      state.address = action.payload.address
      state.employee = action.payload.employee
      state.passwordManagement = action.payload.security
      state.activeTab = action.payload.activeTab;
      state.employee_status = action.payload.employee_status
      state.password_status = action.payload.password_status
    },
    getPersonalInfo(state, action) {
      state.personal = action.payload;
      state.activeTab = "address-info";
    },
    getAddressInfo(state, action) {
      state.address = action.payload;
      state.activeTab = "employee-info";
    },
    resetForm() {
      return { ...initialState, submitted: true };
    },
    getActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    getSubmittedStatus(state) {
      state.submitted = false;
    },
  },
});
export const InfoActions = EmployeeInfoSlice.actions;
export default EmployeeInfoSlice.reducer;
