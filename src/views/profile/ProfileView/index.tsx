import React, { useEffect } from "react";
import { useReduxDispatch, useReduxSelector } from "src/app/hook";
import { selectUser } from "src/slices/authSlice";
import {
  fetchProfile,
  selectProfileStatus,
  selectUpdateProfileStatus,
  selectProfile,
  selectUserPosts,
  clearSuccess,
} from "src/slices/profileSlice";
import Page from "src/components/Page";
import { User, Edit } from "react-feather";
import UserPostCard from "./UserPostCard";
import EditProfile from "./EditProfile";

const ProfileView = () => {
  const dispatch = useReduxDispatch();
  const user = useReduxSelector(selectUser);
  const profile = useReduxSelector(selectProfile);
  const userPosts = useReduxSelector(selectUserPosts);
  const profileStatus = useReduxSelector(selectProfileStatus);
  const updateProfileStatus = useReduxSelector(selectUpdateProfileStatus);
  const [editProfileOpen, setEditProfileOpen] = React.useState(false);

  const handleEditProfileOpen = () => setEditProfileOpen(true);
  const handleEditProfileClose = () => setEditProfileOpen(false);

  useEffect(() => {
    if (updateProfileStatus === "success") {
      dispatch(fetchProfile());
      dispatch(clearSuccess());
      setEditProfileOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateProfileStatus]);

  useEffect(() => {
    dispatch(fetchProfile());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page>
      <div className="md:w-3/4 md:mx-auto">
        {profileStatus !== "loading" ? (
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center">
              {user?.photoURL ? (
                <img src={user?.photoURL} alt="profile" className="w-16 h-16 rounded-full" />
              ) : (
                <div className="flex items-center justify-center rounded-full p-6 bg-gray-100">
                  <User className="w-8 h-8" />
                </div>
              )}
              <div className="ml-8 flex flex-col items-start w-full">
                <div className="flex items-center justify-between w-full">
                  <span>{user?.username || "No Display Name"}</span>
                  <Edit size="18" className="cursor-pointer" onClick={handleEditProfileOpen} />
                </div>
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
      {editProfileOpen ? <EditProfile handleClose={handleEditProfileClose} /> : null}
    </Page>
  );
};

export default ProfileView;
