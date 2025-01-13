import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "../..";


export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async(_, thunkApi) =>{
        try {
            const response = await clientServer.get("/posts")

            return thunkApi.fulfillWithValue(response.data)
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
)

export const createPost = createAsyncThunk(
    "post/createPost",
    async (userData, thunkApi) => {
        const {file, body} = userData;

        try {
            const formData = new FormData();
            formData.append("token",localStorage.getItem('token'));
            formData.append("body", body);
            formData.append('media', file);

            const response = await clientServer.post('/post', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if(response.status === 200){
                return thunkApi.fulfillWithValue("Post Uploaded")
            }else{
                return thunkApi.rejectWithValue("Post Not Uploaded")
            }
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
)

export const deletePost = createAsyncThunk(
    "post/deletePost",
    async (post_id, thunkApi) => {
        try {
            const response = await clientServer.delete("/delete_post",{
                data:{
                    token: localStorage.getItem('token'),
                    post_id: post_id.post_id
                }
            })

            return thunkApi.fulfillWithValue(response.data)
        } catch (error) {
            return thunkApi.rejectWithValue("something went wront")
        }
    }
)

export const IncrementLike = createAsyncThunk(
    "post/incremetLike",
    async (post, thunkApi) => {
        try {
            const response = await clientServer.post('/increment_post_like', {
                post_id: post.post_id
            });
            return thunkApi.fulfillWithValue(response.data)
        } catch (error) {
            return thunkApi.rejectWithValue("something went wront")
        }
    }
)

export const  getAllComments= createAsyncThunk(
    "post/getAllComments",
    async (postData, thunkApi) => {
        try {
            const response = await clientServer.get('/get_comments', {
                params: {
                    post_id: postData.post_id
                }
            });
            return thunkApi.fulfillWithValue({
                commets: response.data,
                post_id: postData.post_id
            })
        } catch (error) {
            return thunkApi.rejectWithValue("something went wront")
        }
    }
)

export const postComment = createAsyncThunk(
    "post/postComment",
    async (commentData, thunkApi) => {
        try {
            const response = await clientServer.post('/comment', {
                token: localStorage.getItem('token'),
                post_id: commentData.post_id,
                commentBody: commentData.body

            });
            return thunkApi.fulfillWithValue(response.data)
        } catch (error) {
            return thunkApi.rejectWithValue("something went wront")
        }
    }
)