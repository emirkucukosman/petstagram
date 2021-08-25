import React from "react";
import { Link } from "react-router-dom";
import { Send, MessageCircle } from "react-feather";
import { Post } from "src/interfaces/Post";
import Reaction from "./Reaction";
import Save from "./Save";
import AddComment from "./AddComment";
import Comments from "./Comments";

type PostCardProps = {
  post: Post;
};

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [openComments, setOpenComments] = React.useState(false);
  const commentInputRef = React.createRef<HTMLInputElement>();

  const handleOpenComments = () => setOpenComments(true);
  const handleCloseComments = () => setOpenComments(false);

  const handleMessageCircleClick = () => {
    commentInputRef.current?.focus();
  };

  return (
    <>
      <div className="flex flex-col border-2 border-gray-200 rounded-sm">
        <div className="flex items-center space-x-4 py-3 px-4">
          <img
            src={post.userMediaURL}
            alt={post.description}
            className="rounded-full w-8 h-8 md:w-12 md:h-12"
          />
          <Link to={`/profile/user/${post.username}`}>
            <span className="hover:underline">{post.username}</span>
          </Link>
        </div>
        <div className="flex items-center justify-center">
          <img src={post.mediaURL} alt={post.description} className="object-fit h-64" />
        </div>
        <div className="flex items-center justify-between py-3 px-4">
          <div className="flex items-center space-x-4">
            <Reaction postId={post.id} likers={post.likers} />
            <MessageCircle className="cursor-pointer" onClick={handleMessageCircleClick} />
            <Send />
          </div>
          <div>
            <Save postId={post.id} savers={post.savers} />
          </div>
        </div>
        <div className="pb-2 px-4">
          <strong>{post.likes} likes</strong>
        </div>
        <div className="pb-1 px-4">
          <Link to={`/profile/user/${post.username}`}>
            <strong className="hover:underline">{post.username}</strong>
          </Link>{" "}
          <span className="break-words">{post.description}</span>
        </div>
        <div className="pb-2 px-4">
          <span
            className="text-gray-400 text-sm cursor-pointer hover:underline"
            onClick={handleOpenComments}
          >
            View all {post.commentCount} comments
          </span>
        </div>
        <div className="py-2 px-4 border-t-2 border-gray-100">
          <AddComment postId={post.id} commentInputRef={commentInputRef} />
        </div>
        {openComments ? <Comments postId={post.id} handleClose={handleCloseComments} /> : null}
      </div>
    </>
  );
};

export default PostCard;
