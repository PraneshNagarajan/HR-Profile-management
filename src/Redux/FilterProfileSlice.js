import { createSlice } from "@reduxjs/toolkit";

const onCatagoryFilterHandler = (dataLists, options) => {
  let datas = options.length > 0 ? {} : dataLists;
  Object.entries(dataLists).map(([key, value]) => {
    options.map(option => {
      if(value.status.slice(0, value.activeStep+1).filter(item => item.title.includes(option)).length > 0) {
        datas[key] = dataLists[key];
      }
    })
  });
  let errors = Object.keys(datas).length === 0 ||  dataLists.length > 0 ? "No match found." : "";
  return {datas, errors}
};

const initialState = {
  result: [],
  errors: "",
  flag: false,
};

const FilterProfileSlice = createSlice({
  name: "FilterProfiles",
  initialState,
  reducers: {
    onSetInitial(state) {
      state.result = [];
      state.errors = "";
      state.flag = false;
    },
    onTextFilterHandler(state, action) {
      state.flag = true;
      let result = {};
      let key;
      Object.keys(action.payload.data).map((item, index) => {
        if (item.includes(action.payload.id)) {
          result[item] = action.payload.data[item];
          key = item;
        }
        if (
          Object.keys(action.payload.data).length - 1 === index 
        ) {
          let sendData =  action.payload.id.length > 0 ?  Object.keys(result).length > 0 ? result
          : [] : action.payload.data
          let output = onCatagoryFilterHandler(
           sendData,
            action.payload.options
          );
          state.result = output.datas
          state.errors = output.errors
        }
      });
    },
  },
});

export const FilterProfileActions = FilterProfileSlice.actions;
export default FilterProfileSlice.reducer;
