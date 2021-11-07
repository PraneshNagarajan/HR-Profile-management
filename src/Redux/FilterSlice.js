import { createSlice } from "@reduxjs/toolkit";

const onCatagoryFilterHandler =() => {
    let datas = options.length > 0 ? [] : dataLists;
    dataLists.map((item, index) => {
      if (options.includes(item.status)) {
        datas.push(item);
      }
    });
    return datas;
}

const FilterSlice =  createSlice({
name: "Filter",
initialState: {
    result: [],
    errors: ""
},
reducers: {
    onTextFilterHandler(state, action) {
        let result = [];
        action.payload.datas.map((item, index) => {
          if (item.id.includes(formik.values.id)) {
            result.push(item);
          }
          if (data.length - 1 === index && result.length > 0) {
            let output = onCatagoryFilterHandler(
              formik.values.id.length > 0 || options.length > 0 ? result : data,
              options
            );
            result = output;
            setSupplyList(output);
          }
        });
        state.errors = result.length === 0 ? "No match found." : ""
    },
}
})

export const FilterActions = FilterSlice.actions;
export default FilterSlice.reducer;