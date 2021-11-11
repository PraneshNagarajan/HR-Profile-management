import { createSlice } from "@reduxjs/toolkit";

const onCatagoryFilterHandler = (dataLists, options, key) => {
  let datas = options.length > 0 ? {} : dataLists;
  Object.entries(dataLists).map(([key, value]) => {
    if (options.includes(value.current_status)) {
      datas[key] = dataLists[key];
    }
  });
  return datas;
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
          Object.keys(action.payload.data).length - 1 === index &&
          Object.keys(result).length > 0
        ) {
          let output = onCatagoryFilterHandler(
            action.payload.id.length > 0 || action.payload.length > 0
              ? result
              : action.payload.data,
            action.payload.options,
            key
          );
          result = output;
          state.result = output;
        }
      });
      state.errors = Object.keys(result).length === 0 ? "No match found." : "";
    },
  },
});

export const FilterProfileActions = FilterProfileSlice.actions;
export default FilterProfileSlice.reducer;
