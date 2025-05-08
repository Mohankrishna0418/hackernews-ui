import React from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  return (
    <div
      key={post.id}
      className="pb-10 border-b border-white px-4 hover:bg-gray-800 transition"
    >
      {/* Post Title & Content */}
      <div
        onClick={() => router.push(`/post/${post.id}`)}
        className="p-3 rounded cursor-pointer"
      >
        <h3 className="font-semibold text-xl text-white mb-1">
          {post.number}.{" "}
          <span className="hover:underline decoration-white cursor-pointer">
            {post.title}
          </span>
        </h3>
        <p className="text-sm text-gray-300">
          {post.content.length > 150 ? (
            <>
              {post.content.slice(0, 150)}
              <span className="text-blue-500 hover:underline">&nbsp;more</span>
            </>
          ) : (
            post.content
          )}
        </p>
      </div>

      {/* Metadata */}
      <div className="text-xs text-gray-400 px-3">
        By{" "}
        <a
          href={`/users/${post.user.name}`}
          className="text-indigo-400 hover:text-indigo-300 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          @{post.user.name}
        </a>{" "}
        on {new Date(post.createdAt).toLocaleString()}
      </div>

      {/* Comments */}
      <div className="p-3 mt-4">
        <h4 className="font-semibold text-sm text-white mb-3">Comments:</h4>
        {post.comments.map((comment) => (
          <div
            key={comment.id}
            className="border-t border-gray-700 pt-3 mt-3 text-gray-300"
          >
            <p className="text-sm">{comment.content}</p>
            <div className="flex gap-5 items-center text-xs text-gray-500 mt-1">
              <span>
                By{" "}
                <a
                  href={`/users/${comment.user.name}`}
                  className="text-indigo-400 hover:text-indigo-300 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  @{comment.user.name}
                </a>{" "}
                on {new Date(comment.createdAt).toLocaleString()}
              </span>
              {currentUsername === comment.user.name && (
                <button
                  onClick={() => onDeleteComment(comment.id, post.id)}
                  className="text-red-400 hover:underline"
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
