import React from "react";
import { useReduxDispatch, useReduxSelector } from "src/app/hook";
import { selectIsAuthenticated, selectUser } from "src/slices/authSlice";
import { savePost, unsavePost, selectReactStatus } from "src/slices/postSlice";
import { Bookmark } from "react-feather";

type SaveProps = {
  postId: string;
  savers: string[];
};

const Save: React.FC<SaveProps> = ({ postId, savers }) => {
  const dispatch = useReduxDispatch();
  const user = useReduxSelector(selectUser);
  const isAuthenticated = useReduxSelector(selectIsAuthenticated);
  const reactStatus = useReduxSelector(selectReactStatus);

  const handleSave = (type: "save" | "unsave") => {
    if (!isAuthenticated || !user) return window.alert("Please log in to give reaction.");

    if (type === "save") {
      return dispatch(savePost({ postId, userId: user.id }));
    }

    return dispatch(unsavePost({ postId, userId: user.id }));
  };

  return (
    <>
      {user && savers.includes(user.id) ? (
        <Bookmark
          fill="#000"
          className="cursor-pointer"
          onClick={reactStatus !== "loading" ? () => handleSave("unsave") : undefined}
        />
      ) : (
        <Bookmark
          className="cursor-pointer"
          onClick={reactStatus !== "loading" ? () => handleSave("save") : undefined}
        />
      )}
    </>
  );
};

export default Save;
