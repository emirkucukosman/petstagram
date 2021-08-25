export interface Comment {
  id: string;
  postId: string;
  text: string;
  username: string;
  userPhotoURL: string;
}

export interface CommentState {
  fetchPostCommentsStatus: "idle" | "loading" | "success" | "fail";
  addCommentStatus: "idle" | "loading" | "success" | "fail";
  comments: Comment[];
}
