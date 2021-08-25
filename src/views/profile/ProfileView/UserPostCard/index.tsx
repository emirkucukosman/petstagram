import React from "react";
import { Heart, MessageCircle } from "react-feather";
import { Post } from "src/interfaces/Post";

type UserPostCardProps = {
  post: Post;
};

const UserPostCard: React.FC<UserPostCardProps> = ({ post }) => {
  return (
    <div className="flex justify-center">
      <div className="relative cursor-pointer user-post-image">
        <img src={post.mediaURL} alt="" className="w-48 h-48 object-contain bg-white" />
        <div className="absolute left-0 top-0 right-0 bottom-0 opacity-0 overlay">
          <div className="flex items-center justify-center h-full text-white">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Heart size="18" /> <span className="ml-1">{post.likes}</span>
              </span>
              <span className="flex items-center">
                <MessageCircle size="18" /> <span className="ml-1">{post.commentCount}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPostCard;
