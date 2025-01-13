import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "../..";

export const loginUser = createAsyncThunk(
    "user/login",
    async (user, thunkApi) => {
        try {
            const response = await clientServer.post("/login", {
                email: user.email,
                password: user.password
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }else{
                return thunkApi.rejectWithValue({
                    message: "token not provided"
                })
            }

            return thunkApi.fulfillWithValue(response.data.token)

        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
)

export const registerUser = createAsyncThunk(
    "user/register",
    async (user, thunkApi) => {
        try {
            const response = await clientServer.post("/register", {
                username: user.username,
                password: user.password,
                email: user.email,
                name: user.name
            })
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
)

export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async(user, thunkApi) => {
        try {
            const response = await clientServer.get("/get_user_and_profile", {params: {token: user.token}})

            return thunkApi.fulfillWithValue(response.data)
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
)

export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async (_, thunkApi) => {
        try {
            const response = await clientServer.get("/user/get_all_users")

            return thunkApi.fulfillWithValue(response.data)
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
)

export const sendConnectionRequest = createAsyncThunk(
    "user/sendConnectionRequest",
    async (user, thunkApi) => {
        try {
            const response = await clientServer.post("/user/send_connection_request",{
                token: user.token,
                connectionId: user.user_id
            })

            thunkApi.dispatch(getConnetionRequests({token: user.token}))

            return thunkApi.fulfillWithValue(response.data)
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
)


export const getConnetionRequests = createAsyncThunk(
    "user/getConnetionRequests",
    async (user, thunkApi) => {
        try {
            const response = await clientServer.post("/user/getConnectionRequest",{
                    token: user.token
            })

            return thunkApi.fulfillWithValue(response.data.connections)
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data.message)
        }
    }
)

export const getMyConnectionRequests = createAsyncThunk(
    "user/getMyConnectionRequests",
    async (user, thunkApi) => {
        try {
            const response = await clientServer.get("/user/user_connection_request",{
                params:{token: user.token}
            })

            return thunkApi.fulfillWithValue(response.data)
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
)

export const AcceptConnection = createAsyncThunk(
    "user/AcceptConnection",
    async (user, thunkApi) => {
        try {
            console.log(user, user.token, user.connectionId, user.action)

            const response = await clientServer.post("/user/accept_connection_request",{
                token: user.token,
                requestId: user.connectionId,
                action_type: user.action
            })
            thunkApi.dispatch(getConnetionRequests({token: user.token}))
            thunkApi.dispatch(getMyConnectionRequests({token: user.token}))
            return thunkApi.fulfillWithValue(response.data.connections)
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
)
