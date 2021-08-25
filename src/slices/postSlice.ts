import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getErrors } from "./errorSlice";
import type { RootState } from "src/app/store";
import { Post, PostState } from "src/interfaces/Post";
import firebase, { auth, firestore, storage } from "src/firebase";
import { v4 as uuidv4 } from "uuid";

const initialState: PostState = {
  postsStatus: "idle",
  reactStatus: "idle",
  shareStatus: "idle",
  posts: [],
};

export const fetchPosts = createAsyncThunk("post/fetchPosts", async (_, thunk) => {
  try {
    const snapshot = await firestore.collection("posts").get();
    return snapshot.docs.map((doc) => {
      const result = {
        id: doc.id,
        ...doc.data(),
      } as Post;
      return result;
    });
  } catch (error) {
    thunk.dispatch(getErrors({ id: "FETCH_POSTS_ERROR", message: error.message }));
    return Promise.reject(error);
  }
});

export const likePost = createAsyncThunk(
  "post/likePost",
  async (params: { postId: string; userId: string }, thunk) => {
    try {
      const { postId, userId } = params;
      await firestore
        .collection("posts")
        .doc(postId)
        .update({
          likes: firebase.firestore.FieldValue.increment(1),
          likers: firebase.firestore.FieldValue.arrayUnion(userId),
        });
      return params;
    } catch (error) {
      thunk.dispatch(getErrors({ id: "LIKE_POST_ERROR", message: error.message }));
      return Promise.reject(error);
    }
  }
);

export const unlikePost = createAsyncThunk(
  "post/unlikePost",
  async (params: { postId: string; userId: string }, thunk) => {
    try {
      const { postId, userId } = params;
      await firestore
        .collection("posts")
        .doc(postId)
        .update({
          likes: firebase.firestore.FieldValue.increment(-1),
          likers: firebase.firestore.FieldValue.arrayRemove(userId),
        });
      return params;
    } catch (error) {
      thunk.dispatch(getErrors({ id: "UNLIKE_POST_ERROR", message: error.message }));
      return Promise.reject(error);
    }
  }
);

export const savePost = createAsyncThunk(
  "post/savePost",
  async (params: { postId: string; userId: string }, thunk) => {
    try {
      const { postId, userId } = params;
      await firestore
        .collection("saves")
        .doc(postId + userId)
        .set({
          postId,
          userId,
        });
      await firestore
        .collection("posts")
        .doc(postId)
        .update({
          savers: firebase.firestore.FieldValue.arrayUnion(userId),
        });
      return params;
    } catch (error) {
      thunk.dispatch(getErrors({ id: "SAVE_POST_ERROR", message: error.message }));
      return Promise.reject(error);
    }
  }
);

export const unsavePost = createAsyncThunk(
  "post/unsavePost",
  async (params: { postId: string; userId: string }, thunk) => {
    try {
      const { postId, userId } = params;
      await firestore
        .collection("saves")
        .doc(postId + userId)
        .delete();
      await firestore
        .collection("posts")
        .doc(postId)
        .update({
          savers: firebase.firestore.FieldValue.arrayRemove(userId),
        });
      return params;
    } catch (error) {
      thunk.dispatch(getErrors({ id: "UNSAVE_POST_ERROR", message: error.message }));
      return Promise.reject(error);
    }
  }
);

export const sharePost = createAsyncThunk(
  "post/sharePost",
  async (params: { file: any; description: string }, thunk) => {
    try {
      const { file, description } = params;
      const task = storage.ref().child(`/posts/${uuidv4()}`).put(file);
      task.on(
        "state_change",
        null,
        (error) => Promise.reject(error),
        async () => {
          const mediaURL = await task.snapshot.ref.getDownloadURL();
          const currentUser = auth.currentUser;
          await firestore.collection("posts").add({
            commentCount: 0,
            likes: 0,
            description,
            likers: [],
            mediaURL,
            savers: [],
            userId: currentUser?.uid,
            userMediaURL: currentUser?.photoURL,
            username: currentUser?.displayName,
          });
          await firestore
            .collection("profiles")
            .doc(currentUser?.uid)
            .update({
              postCount: firebase.firestore.FieldValue.increment(1),
            });
        }
      );
    } catch (error) {
      thunk.dispatch(getErrors({ id: "SHARE_POST_ERROR", message: error.message }));
      return Promise.reject(error);
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    clearSuccess: (state) => {
      state.shareStatus = "idle";
    },
    incrementCommentCount: (state, action: PayloadAction<{ postId: string }>) => {
      const index = state.posts.findIndex((p) => p.id === action.payload.postId);
      state.posts[index].commentCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state) => {
      state.postsStatus = "loading";
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.postsStatus = "success";
      state.posts = action.payload;
    });
    builder.addCase(fetchPosts.rejected, (state) => {
      state.postsStatus = "fail";
    });
    // -----------------------------------------------------------
    builder.addCase(likePost.pending, (state) => {
      state.reactStatus = "loading";
    });
    builder.addCase(likePost.fulfilled, (state, action) => {
      const index = state.posts.findIndex((p) => p.id === action.payload.postId);
      state.posts[index].likes += 1;
      state.posts[index].likers.push(action.payload.userId);
      state.reactStatus = "success";
    });
    builder.addCase(likePost.rejected, (state) => {
      state.reactStatus = "fail";
    });
    // -----------------------------------------------------------
    builder.addCase(unlikePost.pending, (state) => {
      state.reactStatus = "loading";
    });
    builder.addCase(unlikePost.fulfilled, (state, action) => {
      const index = state.posts.findIndex((p) => p.id === action.payload.postId);
      state.posts[index].likes -= 1;
      state.posts[index].likers = state.posts[index].likers.filter(
        (l) => l !== action.payload.userId
      );
      state.reactStatus = "success";
    });
    builder.addCase(unlikePost.rejected, (state) => {
      state.reactStatus = "fail";
    });
    // -----------------------------------------------------------
    builder.addCase(savePost.pending, (state) => {
      state.reactStatus = "loading";
    });
    builder.addCase(savePost.fulfilled, (state, action) => {
      const index = state.posts.findIndex((p) => p.id === action.payload.postId);
      state.posts[index].savers.push(action.payload.userId);
      state.reactStatus = "success";
    });
    builder.addCase(savePost.rejected, (state) => {
      state.reactStatus = "fail";
    });
    // -----------------------------------------------------------
    builder.addCase(unsavePost.pending, (state) => {
      state.reactStatus = "loading";
    });
    builder.addCase(unsavePost.fulfilled, (state, action) => {
      const index = state.posts.findIndex((p) => p.id === action.payload.postId);
      state.posts[index].savers = state.posts[index].savers.filter(
        (s) => s !== action.payload.userId
      );
      state.reactStatus = "success";
    });
    builder.addCase(unsavePost.rejected, (state) => {
      state.reactStatus = "fail";
    });
    // -----------------------------------------------------------
    builder.addCase(sharePost.pending, (state) => {
      state.shareStatus = "loading";
    });
    builder.addCase(sharePost.fulfilled, (state, action) => {
      state.shareStatus = "success";
    });
    builder.addCase(sharePost.rejected, (state) => {
      state.shareStatus = "fail";
    });
  },
});

export const { incrementCommentCount, clearSuccess } = postSlice.actions;

export const selectPostsStatus = (state: RootState) => state.post.postsStatus;
export const selectReactStatus = (state: RootState) => state.post.reactStatus;
export const selectShareStatus = (state: RootState) => state.post.shareStatus;
export const selectPosts = (state: RootState) => state.post.posts;

export default postSlice.reducer;
