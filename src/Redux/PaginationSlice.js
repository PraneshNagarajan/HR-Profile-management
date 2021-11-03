import { createSlice } from "@reduxjs/toolkit";
let start;
let last;

const PaginationSlice = createSlice({
    name: 'Pagination',
    initialState: {
        size: 0,
        begin: 1,
        end: 0,
        total: 0,
        current: 1
    },
    reducers: {
       initial(state, action){
           start = state.current - 4 >= 1 ? state.current - 4 : 1;
           last = state.current < 5 ? 5 : state.current;
           state.current = action.payload.current;
           state.size = action.payload.size;
           state.total = Math.ceil(state.size / action.payload.count)
           state.begin = start > state.total ? state.total : start;
           state.end = last > state.total ? state.total : last;
       },

       first(state) {
           state.current = 1;
           state.begin = 1;
           state.end = state.total > 5 ? 5 : state.total;
       },
       last(state){
        state.current = state.total;
           state.begin = state.total - 4 > 1 ? state.total - 4 : 1;
           state.end = state.total;
       },
       previous(state){
           if(state.current > 5) {
               state.begin--;
               state.end--;
           }
           state.current--;
       },
       next(state){
        if(state.current >= 5) {
            state.begin++;
            state.end++;
        }
        state.current++;
    },
    current(state,action){
        start = state.current - 4 >= 1 ? state.current - 4 : 1;
        last = state.current < 5 ? 5 : state.current;
        state.current = action.payload.current;
        state.begin = start > state.total ? state.total : start;
        state.end = last > state.total ? state.total : last
    }

    }
    })
    
    export const PaginationActions = PaginationSlice.actions
    export default PaginationSlice.reducer