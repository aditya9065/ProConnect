
/**
 * Steps for state management
 * 
 * submit action
 * handle action in it's reducer
 * register here -> reducer
 * 
 */

import authReducer from './reducer/authReducer'
import postReducer from './reducer/postReducer'
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        postReducer: postReducer
    }
})