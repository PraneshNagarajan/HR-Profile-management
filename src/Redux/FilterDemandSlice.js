import { createSlice } from "@reduxjs/toolkit";

const onCatagoryFilterHandler = (dataLists, options) => {
    let datas = options.length > 0 ? [] : dataLists;
    dataLists.map((item, index) => {
      if (options.includes(item.status)) {
        datas.push(item);
      }
    });
    return datas;
}

const initialState = {
    result: [],
    errors: "",
    flag: false
}

const FilterDemandSlice =  createSlice({
name: "FilterDemands",
initialState,
reducers: {
    onSetInitial(state){
        state.result = []
        state.errors = ""
        state.flag = false
    },
    onTextFilterHandler(state, action) {
        state.flag = true
        let result = [];
        action.payload.data.map((item, index) => {
          if (item.id.includes(action.payload.id)) {
            result.push(item);
          }
          if (action.payload.data.length - 1 === index && result.length > 0) {
            let output = onCatagoryFilterHandler(
                action.payload.id.length > 0 || action.payload.length > 0 ? result : action.payload.data,
              action.payload.options
            );
            result = output;
            state.result = output
          }
        });
        state.errors = result.length === 0 ? "No match found." : ""
    },
}
})

export const FilterDemandActions = FilterDemandSlice.actions;
export default FilterDemandSlice.reducer;