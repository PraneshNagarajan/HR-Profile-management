import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  personal: {},
  address: {},
  employee: {},
  activeTab: "personal-info",
  submitted: false,
  img_uploaded:"",
  security: "",
};
const EmployeeInfoSlice = createSlice({
  name: "employee-info",
  initialState,
  reducers: {
    getCompleteInfo(state, action) {
      state.personal = action.payload.personal
      state.address = action.payload.address
      state.employee = action.payload.employee
      state.security = action.payload.security
      state.activeTab = action.payload.activeTab;
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
    getSecurityFlag(state,action){
      state.security = action.payload
    },
    getImageFlag(state, action){
      state.img_uploaded = action.payload
    }
  },
});
export const InfoActions = EmployeeInfoSlice.actions;
export default EmployeeInfoSlice.reducer;
