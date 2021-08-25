import React, { useEffect } from "react";
import { useReduxDispatch, useReduxSelector } from "src/app/hook";
import { selectPosts, selectPostsStatus } from "src/slices/postSlice";
import { selectError, clearErrors } from "src/slices/errorSlice";
import PostCard from "./PostCard";

const Results = () => {
  const dispatch = useReduxDispatch();
  const posts = useReduxSelector(selectPosts);
  const postsStatus = useReduxSelector(selectPostsStatus);
  const error = useReduxSelector(selectError);

  useEffect(() => {
    return () => {
      dispatch(clearErrors());
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (postsStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (error.id === "FETCH_POSTS_ERROR") {
    <div className="text-red-500 text-md">{error.message}</div>;
  }

  if (postsStatus === "success" && posts.length === 0) {
    return <div>No posts were found.</div>;
  }

  return (
    <>
      {posts.length !== 0 && (
        <div className="flex flex-col space-y-8">
          {posts.map((post, i) => (
            <PostCard post={post} key={i} />
          ))}
        </div>
      )}
    </>
  );
};

export default Results;
