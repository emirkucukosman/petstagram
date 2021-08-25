import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getErrors } from "./errorSlice";
import { incrementCommentCount } from "./postSlice";
import type { RootState } from "src/app/store";
import { Comment, CommentState } from "src/interfaces/Comment";
import firebase, { firestore } from "src/firebase";

const initialState: CommentState = {
  fetchPostCommentsStatus: "idle",
  addCommentStatus: "idle",
  comments: [],
};

export const fetchPostComments = createAsyncThunk(
  "comment/fetchPostComments",
  async (postId: string, thunk) => {
    try {
      const snapshot = await firestore
        .collection("comments")
        .where("postId", "==", String(postId))
        .get();
      console.log(snapshot.docs);
      return snapshot.docs.map((doc) => {
        const comment = {
          id: doc.id,
          ...doc.data(),
        } as Comment;
        return comment;
      });
    } catch (error) {
      thunk.dispatch(getErrors({ id: "FETCH_POST_COMMENTS_ERROR", message: error.message }));
      return Promise.reject(error);
    }
  }
);

export const addComment = createAsyncThunk(
  "comment/addComment",
  async (
    params: { postId: string; text: string; username: string; userPhotoURL: string },
    thunk
  ) => {
    try {
      await firestore.collection("comments").add(params);
      await firestore
        .collection("posts")
        .doc(params.postId)
        .update({
          commentCount: firebase.firestore.FieldValue.increment(1),
        });
      thunk.dispatch(incrementCommentCount({ postId: params.postId }));
    } catch (error) {
      thunk.dispatch(getErrors({ id: "ADD_COMMENT_ERROR", message: error.message }));
      return Promise.reject(error);
    }
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    clearSuccess: (state) => {
      state.addCommentStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPostComments.pending, (state) => {
      state.fetchPostCommentsStatus = "loading";
    });
    builder.addCase(fetchPostComments.fulfilled, (state, action) => {
      state.fetchPostCommentsStatus = "success";
      state.comments = action.payload;
    });
    builder.addCase(fetchPostComments.rejected, (state) => {
      state.fetchPostCommentsStatus = "fail";
    });
    // --------------------------------------------------------------
    builder.addCase(addComment.pending, (state) => {
      state.addCommentStatus = "loading";
    });
    builder.addCase(addComment.fulfilled, (state) => {
      state.addCommentStatus = "success";
    });
  },
});

export const { clearSuccess } = commentSlice.actions;

export const selectFetchPostCommentsStatus = (state: RootState) => {
  return state.comment.fetchPostCommentsStatus;
};

export const selectAddCommentStatus = (state: RootState) => {
  return state.comment.addCommentStatus;
};

export const selectComments = (state: RootState) => {
  return state.comment.comments;
};

export default commentSlice.reducer;
