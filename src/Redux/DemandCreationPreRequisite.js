import { createSlice } from "@reduxjs/toolkit";

const DemandCreationPreRequisite= createSlice({
    name: 'PreRequisite',
    initialState: {
        users: [],
        technologies: [],
        clients:[]
    },
    reducers: {
        getUsers(state, action) {
            state.users = action.payload
        },
        getTechnology(state, action) {
            state.technologies = action.payload
        },
        getClients(state, action) {
            state.clients = action.payload
        },
    }

})
export const DemandPreRequisiteActions = DemandCreationPreRequisite.actions;
export default DemandCreationPreRequisite.reducer;