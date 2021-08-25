import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getErrors } from "./errorSlice";
import type { RootState } from "src/app/store";
import { auth, firestore } from "src/firebase";
import { User, AuthState } from "src/interfaces/Auth";

const initialState: AuthState = {
  isInitialised: false,
  isAuthenticated: false,
  user: null,
  loginStatus: "idle",
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, thunk) => {
    try {
      const { user } = await auth.signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      );
      if (!user) {
        return Promise.reject("Can not fetch user data");
      }
      return {
        id: user.uid,
        email: user.email,
        username: user.displayName,
        photoURL: user.photoURL,
      };
    } catch (error) {
      thunk.dispatch(getErrors({ id: "LOGIN_ERROR", message: error.message }));
      return Promise.reject(error);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (credentials: { email: string; password: string }, thunk) => {
    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        credentials.email,
        credentials.password
      );
      if (!user) {
        return Promise.reject("Can not register at the moment");
      }
      await firestore.collection("profiles").doc(user.uid).set({
        postCount: 0,
        followers: 0,
        following: 0,
        username: "",
        userPhotoURL: "",
      });
      return {
        id: user.uid,
        email: user.email,
        username: user.displayName,
        photoURL: user.photoURL,
      };
    } catch (error) {
      thunk.dispatch(getErrors({ id: "LOGIN_ERROR", message: error.message }));
      return Promise.reject(error);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunk) => {
  try {
    await auth.signOut();
  } catch (error) {
    thunk.dispatch(getErrors({ id: "LOGOUT_ERROR", message: error.message }));
    return Promise.reject(error);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStateChanged: (
      state,
      action: PayloadAction<{ isAuthenticated: boolean; user: User | null }>
    ) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.isInitialised = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loginStatus = "loading";
    });
    builder.addCase(login.fulfilled, (state) => {
      state.loginStatus = "success";
    });
    builder.addCase(login.rejected, (state) => {
      state.loginStatus = "fail";
    });
    // ------------------------------------------
    builder.addCase(register.pending, (state) => {
      state.loginStatus = "loading";
    });
    builder.addCase(register.fulfilled, (state) => {
      state.loginStatus = "success";
    });
    builder.addCase(register.rejected, (state) => {
      state.loginStatus = "fail";
    });
    // ------------------------------------------
    builder.addCase(logout.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
    });
  },
});

export const { authStateChanged } = authSlice.actions;

export const selectLoginStatus = (state: RootState) => state.auth.loginStatus;
export const selectIsInitialised = (state: RootState) => state.auth.isInitialised;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
