import { createSlice } from "@reduxjs/toolkit";

const onCatagoryFilterHandler = (dataLists, options) => {
    let datas = options.length > 0 ? [] : dataLists;
    dataLists.map((item, index) => {
      if (options.includes(item.status)) {
        console.log(item.status)
        datas.push(item);
      }
    });
    let errors = datas.length === 0 ? "No match found." : ""
    return {datas, errors}
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
        action.payload.supplyList.map((item, index) => {
          if (item.id.includes(action.payload.id)) {
            result.push(item);
          }
          if (action.payload.supplyList.length - 1 === index) {
            let output = onCatagoryFilterHandler(
                action.payload.id.length > 0 ? result.length > 0 ? result : [] : action.payload.supplyList,
              action.payload.options
            );
            state.result = output.datas
            state.errors = output.errors
          }
        });
    },
}
})

export const FilterDemandActions = FilterDemandSlice.actions;
export default FilterDemandSlice.reducer;