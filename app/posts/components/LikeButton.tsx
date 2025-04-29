// LikeButton.tsx
"use client";

import React, { useState, useEffect } from "react";

interface LikeButtonProps {
  postId: string;
  likedByUser: boolean;
  likeCount: number;
  token: string;
  onLikeChange: (postId: string, likedByUser: boolean) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  likedByUser,
  likeCount,
  token,
  onLikeChange,
}) => {
  const [isLiked, setIsLiked] = useState(likedByUser);
  const [likes, setLikes] = useState(likeCount);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLiked(likedByUser);
    setLikes(likeCount);
  }, [likedByUser, likeCount]);

  const handleLike = async () => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/likes/on/${postId}`, {
        method: isLiked ? "DELETE" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          token,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to like/unlike post");
      }

      setIsLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1);
      onLikeChange(postId, !isLiked);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(`Error liking/unliking post: ${errorMessage}`);
    }
  };
  

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleLike}
        className={`text-sm ${
          isLiked ? "text-blue-500" : "text-gray-500"
        } hover:underline`}
      >
        {isLiked ? "Unlike" : "Like"}
      </button>
      <span className="text-sm">{likes} likes</span>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};

export default LikeButton;