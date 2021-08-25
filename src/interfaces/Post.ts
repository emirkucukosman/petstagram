export interface Post {
  id: string;
  description: string;
  mediaURL: string;
  likes: number;
  commentCount: number;
  likers: string[];
  savers: string[];
  userId: string;
  userMediaURL: string;
  username: string;
}

export interface PostState {
  postsStatus: "idle" | "loading" | "success" | "fail";
  reactStatus: "idle" | "loading" | "success" | "fail";
  shareStatus: "idle" | "loading" | "success" | "fail";
  posts: Post[];
}
