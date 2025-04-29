import React from "react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    username: string;
    name?: string;
  };
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  user: {
    username: string;
    name?: string;
  };
  comments: Comment[];
  number?: number;
}

interface PostCardProps {
  post: Post;
  currentUsername: string | undefined;
  onDeleteComment: (commentId: string, postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUsername,
  onDeleteComment,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h3 className="font-bold text-lg mb-2">
        {post.number}. {post.title}
      </h3>
      <p className="mb-2">{post.content}</p>
      <div className="text-xs text-gray-500 mb-4">
        By {post.user.username} on {new Date(post.createdAt).toLocaleString()}
      </div>

      <div className="mt-4">
        <h4 className="font-semibold text-md mb-3">Comments:</h4>
        {post.comments.map((comment) => (
          <div key={comment.id} className="border-t border-gray-200 pt-3 mt-3">
            <p className="text-sm">{comment.content}</p>
            <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
              <span>
                By {comment.user.username} on{" "}
                {new Date(comment.createdAt).toLocaleString()}
              </span>
              {currentUsername === comment.user.username && (
                <button
                  onClick={() => onDeleteComment(comment.id, post.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostCard;