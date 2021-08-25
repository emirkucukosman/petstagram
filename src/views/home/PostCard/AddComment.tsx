import React, { useEffect } from "react";
import { useReduxDispatch, useReduxSelector } from "src/app/hook";
import { addComment, clearSuccess, selectAddCommentStatus } from "src/slices/commentSlice";
import { selectError, clearErrors } from "src/slices/errorSlice";
import { selectIsAuthenticated, selectUser } from "src/slices/authSlice";

type AddCommentProps = {
  postId: string;
  commentInputRef: React.RefObject<HTMLInputElement>;
};

const AddComment: React.FC<AddCommentProps> = ({ postId, commentInputRef }) => {
  const dispatch = useReduxDispatch();
  const addCommentStatus = useReduxSelector(selectAddCommentStatus);
  const isAuthenticated = useReduxSelector(selectIsAuthenticated);
  const user = useReduxSelector(selectUser);
  const error = useReduxSelector(selectError);
  const [comment, setComment] = React.useState("");

  useEffect(() => {
    if (error.id === "ADD_COMMENT_ERROR") {
      window.alert(error.message);
      dispatch(clearErrors());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (addCommentStatus === "success") {
      setComment("");
      dispatch(clearSuccess());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addCommentStatus]);

  const handlePostCommentClick = () => {
    if (!isAuthenticated || !user) return window.alert("Please log in to leave a comment.");
    if (!user.username) return window.alert("Please set your username before leaving a comment.");

    dispatch(
      addComment({
        postId,
        text: comment,
        username: user.username,
        userPhotoURL: user.photoURL || "",
      })
    );
  };

  const postCommentDisabled = comment === "" || addCommentStatus === "loading";

  return (
    <div className="flex items-center">
      <input
        type="text"
        placeholder="Add Comment..."
        className="w-full bg-transparent outline-none p-1"
        maxLength={120}
        value={comment}
        ref={commentInputRef}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        type="button"
        className={postCommentDisabled ? "text-gray-300" : "text-blue-500"}
        disabled={postCommentDisabled}
        onClick={handlePostCommentClick}
      >
        Post
      </button>
    </div>
  );
};

export default AddComment;
