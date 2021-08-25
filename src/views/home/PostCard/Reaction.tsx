import React from "react";
import { useReduxDispatch, useReduxSelector } from "src/app/hook";
import { selectIsAuthenticated, selectUser } from "src/slices/authSlice";
import { likePost, unlikePost, selectReactStatus } from "src/slices/postSlice";
import { Heart } from "react-feather";

type ReactionProps = {
  postId: string;
  likers: string[];
};

const Reaction: React.FC<ReactionProps> = ({ postId, likers }) => {
  const dispatch = useReduxDispatch();
  const isAuthenticated = useReduxSelector(selectIsAuthenticated);
  const user = useReduxSelector(selectUser);
  const reactStatus = useReduxSelector(selectReactStatus);

  const handleReaction = (reaction: "like" | "unlike") => {
    if (!isAuthenticated || !user) return window.alert("Please log in to give reaction.");

    if (reaction === "like") {
      return dispatch(likePost({ postId, userId: user.id }));
    }

    return dispatch(unlikePost({ postId, userId: user.id }));
  };

  return (
    <>
      {user && likers.includes(user.id) ? (
        <Heart
          fill="#ff0000"
          stroke="#ff0000"
          className="cursor-pointer"
          onClick={reactStatus !== "loading" ? () => handleReaction("unlike") : undefined}
        />
      ) : (
        <Heart
          className="cursor-pointer"
          onClick={reactStatus !== "loading" ? () => handleReaction("like") : undefined}
        />
      )}
    </>
  );
};

export default Reaction;
