import React, { useEffect } from "react";
import { useReduxDispatch, useReduxSelector } from "src/app/hook";
import {
  fetchPostComments,
  selectComments,
  selectFetchPostCommentsStatus,
} from "src/slices/commentSlice";
import { User } from "react-feather";

type CommentsProps = {
  postId: string;
  handleClose: () => void;
};

const Comments: React.FC<CommentsProps> = ({ postId, handleClose }) => {
  const dispatch = useReduxDispatch();
  const comments = useReduxSelector(selectComments);
  const commentsStatus = useReduxSelector(selectFetchPostCommentsStatus);

  useEffect(() => {
    dispatch(fetchPostComments(postId));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed left-0 top-0 w-screen h-screen"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={handleClose}
    >
      <div className="flex items-center justify-center h-screen">
        <div className="w-10/12 h-5/6 md:w-1/3 md:h-4/5 bg-gray-100 shadow-md rounded-md p-4">
          {commentsStatus !== "loading" ? (
            <>
              {comments.length !== 0 ? (
                comments.map((comment, i) => (
                  <div className="flex items-center mb-4" key={i}>
                    {comment.userPhotoURL ? (
                      <img
                        src={comment.userPhotoURL}
                        alt={`comment user ${i}`}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User className="w-8 h-8 bg-gray-200 p-2 rounded-full" />
                    )}
                    <span className="font-bold ml-2 text-sm">{comment.username}</span>
                    <span className="ml-2">{comment.text}</span>
                  </div>
                ))
              ) : (
                <div>No comments found.</div>
              )}
            </>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comments;
