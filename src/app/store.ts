import { configureStore } from "@reduxjs/toolkit";
import authReducer from "src/slices/authSlice";
import postReducer from "src/slices/postSlice";
import commentReducer from "src/slices/commentSlice";
import profileReducer from "src/slices/profileSlice";
import errorReducer from "src/slices/errorSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    comment: commentReducer,
    profile: profileReducer,
    error: errorReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;

export type ReduxDispatch = typeof store.dispatch;

export default store;
