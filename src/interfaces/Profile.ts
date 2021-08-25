import { Post } from "src/interfaces/Post";

export interface Profile {
  id: string;
  postCount: number;
  followers: number;
  following: number;
  username: string;
  userPhotoURL: string;
}

export interface ProfileState {
  fetchProfileStatus: "idle" | "loading" | "success" | "fail";
  updateProfileStatus: "idle" | "loading" | "success" | "fail";
  profile: Profile | null;
  userPosts: Post[];
}
