import { createSlice } from "@reduxjs/toolkit";

const ProfileSlice = createSlice({
  name: "Profile",
  initialState: {
    added_data : {},
    data: {},
    skills:{}
  },
  reducers: {
    handleAdd(state, action) {
      let tmpData = state.data;
      let key = Object.keys(action.payload)[0];
      tmpData[key] = action.payload[key];
      state.data = tmpData;
    },
    handleRemove(state,action){
       let tmpData = action.payload.flag ? state.added_data : state.data
       delete tmpData[action.payload.index]
       if(action.payload.flag){
        state.added_data = tmpData
       } else {
        state.data = tmpData
       }
    },
    handleClear(state) {
      state.data = {};
      state.added_data = {}
    },
    handleSkills(state,action) {
     state.skills = action.payload
    },
    handleMove(state) {
      let tmpData = state.added_data;
      for (const [key, value] of Object.entries(state.data)) {
        tmpData[value.candidateID] = value;
      }
      state.added_data = tmpData;
      state.data = {}
    },
    handleAddExistingData(state,action) {
      let tmpData = state.added_data;
      let key = Object.keys(action.payload)[0];
      tmpData[key] = action.payload[key];
      state.added_data = tmpData;
    }
  },
});

export const ProfileActions = ProfileSlice.actions;
export default ProfileSlice.reducer;
