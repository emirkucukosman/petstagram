import React, { useEffect } from "react";
import { useReduxDispatch, useReduxSelector } from "src/app/hook";
import {
  fetchUserProfile,
  selectProfileStatus,
  selectProfile,
  selectUserPosts,
} from "src/slices/profileSlice";
import { useParams } from "react-router-dom";
import Page from "src/components/Page";
import { User } from "react-feather";
import UserPostCard from "./UserPostCard";

const UserProfileView = () => {
  const dispatch = useReduxDispatch();
  const profile = useReduxSelector(selectProfile);
  const userPosts = useReduxSelector(selectUserPosts);
  const profileStatus = useReduxSelector(selectProfileStatus);
  const { username } = useParams() as any;

  useEffect(() => {
    dispatch(fetchUserProfile(username));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (profileStatus !== "loading" && !profile) {
    return <div className="md:w-1/2 md:mx-auto">No Profile Found</div>;
  }

  return (
    <Page>
      <div className="md:w-3/4 md:mx-auto">
        {profileStatus !== "loading" ? (
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center">
              {profile?.userPhotoURL ? (
                <img src={profile?.userPhotoURL} alt="profile" className="w-16 h-16 rounded-full" />
              ) : (
                <div className="flex items-center justify-center rounded-full p-6 bg-gray-100">
                  <User className="w-8 h-8" />
                </div>
              )}
              <div className="ml-8 flex flex-col items-start w-full">
                <span>{profile?.username || "No Display Name"}</span>
                <div className="flex items-center mt-4 space-x-8">
                  <span>
                    <strong>{profile?.postCount}</strong> posts
                  </span>
                  <span>
                    <strong>{profile?.followers}</strong> followers
                  </span>
                  <span>
                    <strong>{profile?.following}</strong> following
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
        <hr className="mt-12" />
        {profileStatus !== "loading" && (
          <div className="grid grid-cols-1 gap-y-4 mt-4 md:grid-cols-3 md:gap-x-4">
            {userPosts.map((post, i) => (
              <UserPostCard post={post} key={i} />
            ))}
          </div>
        )}
      </div>
    </Page>
  );
};

export default UserProfileView;
