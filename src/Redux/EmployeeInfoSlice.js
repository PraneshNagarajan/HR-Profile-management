import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  personal: [],
  address: [],
  employee: [],
  activeTab: "personal-info",
  submitted: false,
};
const EmployeeInfoSlice = createSlice({
  name: "employee-info",
  initialState,
  reducers: {
    getPersonalInfo(state, action) {
      state.personal = [action.payload];
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
