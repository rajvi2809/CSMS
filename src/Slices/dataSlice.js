import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: null,
};
//to store the result of api response
export const userDetails = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.users = action.payload.data
        },
        removeUser: (state) => {
            state.users = null
        }
    }
})

export const { setUser, removeUser } = userDetails.actions
export default userDetails.reducer;