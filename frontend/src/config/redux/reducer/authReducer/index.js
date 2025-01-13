import { createSlice } from "@reduxjs/toolkit"
import { getAboutUser, getAllUsers, getConnetionRequests, getMyConnectionRequests, loginUser, registerUser } from "../../action/authAction"

const initialState = {
    user: undefined,
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message:"",
    isTokenThere: false,
    profileFetched: false,
    connections: [],
    connectionRequest: [],
    all_users: [],
    all_profiles_fetched: false
}

 const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        handleLoginUser: (state) => {
            state.message = "hello"
        },
        emptyMessage: (state) => {
            state.message = ""
        },
        setTokenIsThere: (state) => {
            if(!state.isTokenThere){

            state.isTokenThere = true
            }
        },
        setTokenIsNotThere: (state) => {
            state.isTokenThere = false
        }
    },

    extraReducers: (builder) => {
        builder
        .addCase(loginUser.pending, (state)=> {
            state.isLoading = true
            state.message = {
                message: "knocking the door..."
            }
        })
        .addCase(loginUser.fulfilled, (state, action)=>{
            state.isError =  false,
            state.isSuccess =  true,
            state.isLoading =  false,
            state.loggedIn =  true,
            state.message = {
                message: "Logged in Successfully"
            }
        })
        .addCase(loginUser.rejected, (state, action)=>{
            state.isError =  true,
            state.isLoading =  false,
            state.message = action.payload
        })
        .addCase(registerUser.pending, (state)=>{
            state.isLoading = true,
            state.message = {
                message: "Registering..."
            }
        })
        .addCase(registerUser.fulfilled, (state, action)=>{
            state.isError =  false,
            state.isSuccess =  true,
            state.isLoading =  false,
            state.loggedIn =  true,
            state.message = {
                message: "Registration is Successful, Please Login"
            }
        })
        .addCase(registerUser.rejected, (state, action)=>{
            state.isError =  true,
            state.isLoading =  false,
            state.message = action.payload
        })
        .addCase(getAboutUser.fulfilled, (state, action) => {
            console.log("API Response for getAboutUser:", action.payload)
            state.isLoading = false;
            state.isError = false;
            state.profileFetched = true;
            state.user = action.payload.userProfile

        })
        .addCase(getAllUsers.fulfilled,(state, action)=>{
            state.isLoading = false;
            state.isError = false;
            state.all_profiles_fetched = true
            state.all_users = action.payload.profiles
        })
        .addCase(getConnetionRequests.fulfilled,(state, action)=>{
            state.connections = action.payload
        })
        .addCase(getConnetionRequests.rejected,(state, action)=>{
            state.message = action.payload
        })
        .addCase(getMyConnectionRequests.fulfilled,(state, action)=>{
            state.connectionRequest = action.payload
        })
        .addCase(getMyConnectionRequests.rejected,(state, action)=>{
            state.message = action.payload
        })
    }
})

export default authSlice.reducer

export const {reset, emptyMessage, setTokenIsNotThere, setTokenIsThere} = authSlice.actions;