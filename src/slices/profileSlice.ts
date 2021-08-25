import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getErrors } from "./errorSlice";
import type { RootState } from "src/app/store";
import { Profile, ProfileState } from "src/interfaces/Profile";
import { Post } from "src/interfaces/Post";
import { auth, firestore, storage } from "src/firebase";
import { v4 as uuidv4 } from "uuid";

const initialState: ProfileState = {
  fetchProfileStatus: "idle",
  updateProfileStatus: "idle",
  profile: null,
  userPosts: [],
};

export const fetchProfile = createAsyncThunk("profile/fetchProfile", async (_, thunk) => {
  try {
    const currentUser = auth.currentUser;
    const profileDoc = await firestore.collection("profiles").doc(currentUser?.uid).get();
    const postDocs = await firestore
      .collection("posts")
      .where("userId", "==", currentUser?.uid)
      .get();
    const profile = {
      id: profileDoc.id,
      ...profileDoc.data(),
    } as Profile;
    const userPosts = postDocs.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    }) as Post[];
    return {
      profile,
      userPosts,
    };
  } catch (error) {
    thunk.dispatch(getErrors({ id: "FETCH_PROFILE_ERROR", message: error.message }));
    return Promise.reject(error);
  }
});

export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (username: string, thunk) => {
    try {
      const profileDoc = await firestore
        .collection("profiles")
        .where("username", "==", username)
        .limit(1)
        .get();
      const postDocs = await firestore.collection("posts").where("username", "==", username).get();
      if (!profileDoc || !postDocs) {
        return Promise.reject(Error("Can not fetch this user's profile data."));
      }
      const profile = {
        id: profileDoc.docs[0].id,
        ...profileDoc.docs[0].data(),
      } as Profile;
      const userPosts = postDocs.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      }) as Post[];
      return {
        profile,
        userPosts,
      };
    } catch (error) {
      thunk.dispatch(getErrors({ id: "FETCH_PROFILE_ERROR", message: error.message }));
      return Promise.reject(error);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (params: { file: any; username: string }, thunk) => {
    try {
      if (auth.currentUser) {
        if (params.file) {
          const task = storage.ref(`/profiles/${uuidv4()}`).put(params.file);
          task.on(
            "state_changed",
            null,
            (error) => Promise.reject(error),
            async () => {
              const downloadURL = await task.snapshot.ref.getDownloadURL();
              await auth.currentUser!.updateProfile({
                displayName: params.username,
                photoURL: downloadURL,
              });
              await firestore.collection("profiles").doc(auth.currentUser?.uid).update({
                username: params.username,
                userPhotoURL: downloadURL,
              });
            }
          );
        } else {
          await auth.currentUser.updateProfile({
            displayName: params.username,
          });
          await firestore.collection("profiles").doc(auth.currentUser?.uid).update({
            username: params.username,
          });
        }
      }
    } catch (error) {
      thunk.dispatch(getErrors({ id: "UPDATE_PROFILE_ERROR", message: error.message }));
      return Promise.reject(error);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearSuccess: (state) => {
      state.updateProfileStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.pending, (state) => {
      state.fetchProfileStatus = "loading";
    });
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.fetchProfileStatus = "success";
      state.profile = action.payload.profile;
      state.userPosts = action.payload.userPosts;
    });
    builder.addCase(fetchProfile.rejected, (state) => {
      state.fetchProfileStatus = "fail";
    });
    // --------------------------------------------------------------
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.fetchProfileStatus = "loading";
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.fetchProfileStatus = "success";
      state.profile = action.payload.profile;
      state.userPosts = action.payload.userPosts;
    });
    builder.addCase(fetchUserProfile.rejected, (state) => {
      state.fetchProfileStatus = "fail";
    });
    // --------------------------------------------------------------
    builder.addCase(updateProfile.pending, (state) => {
      state.updateProfileStatus = "loading";
    });
    builder.addCase(updateProfile.fulfilled, (state) => {
      state.updateProfileStatus = "success";
    });
    builder.addCase(updateProfile.rejected, (state) => {
      state.updateProfileStatus = "fail";
    });
  },
});

export const { clearSuccess } = profileSlice.actions;

export const selectProfileStatus = (state: RootState) => state.profile.fetchProfileStatus;
export const selectUpdateProfileStatus = (state: RootState) => state.profile.updateProfileStatus;
export const selectProfile = (state: RootState) => state.profile.profile;
export const selectUserPosts = (state: RootState) => state.profile.userPosts;

export default profileSlice.reducer;
