import { createSlice } from "@reduxjs/toolkit";

const ProfileSlice = createSlice({
  name: "Profile",
  initialState: {
    data: {},
  },
  reducers: {
    handleAdd(state, action) {
      let tmpData = state.data;
      let key = Object.keys(action.payload)[0];
      tmpData[key] = action.payload[key];
      state.data = tmpData;
    },
    handleRemove(state,action){
       let tmpData = state.data
       delete tmpData[action.payload]
       state.data = tmpData
    },
    handleClear(state) {
      state.data = {};
    },
  },
});

export const ProfileActions = ProfileSlice.actions;
export default ProfileSlice.reducer;
