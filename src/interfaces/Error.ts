export type ErrorId =
  | "LOGIN_ERROR"
  | "LOGOUT_ERROR"
  | "FETCH_POSTS_ERROR"
  | "FETCH_POST_COMMENTS_ERROR"
  | "SHARE_POST_ERROR"
  | "FETCH_PROFILE_ERROR"
  | "UPDATE_PROFILE_ERROR"
  | "ADD_COMMENT_ERROR"
  | "LIKE_POST_ERROR"
  | "UNLIKE_POST_ERROR"
  | "SAVE_POST_ERROR"
  | "UNSAVE_POST_ERROR";

export interface ErrorState {
  id: ErrorId | null;
  message: string | null;
}
