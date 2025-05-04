// LikeButton.tsx
"use client";

import React, { useState, useEffect } from "react";
import { url } from "@/lib/auth";
import { toast, Toaster } from "sonner";
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
      window.location.href = "/log-in";
      return;
    }

    try {
      const res = await fetch(`${url}/likes/on/${postId}`, {
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

      const newLikeState = !isLiked;
      setIsLiked(newLikeState);
      setLikes(newLikeState ? likes + 1 : likes - 1);
      onLikeChange(postId, newLikeState);

      // Trigger a toast notification for like/unlike action
      toast(newLikeState ? "Post liked!" : "Post unliked!", {
        duration: 3000,
        position: "bottom-right",
        style: {
          background: newLikeState ? "#22c55e" : "#dc2626",
          color: "#ffffff",
        },
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(`Error liking/unliking post: ${errorMessage}`);
      toast.error(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Toaster />
      <button
        onClick={handleLike}
        className={`text-sm transition ${
          isLiked
            ? "text-red-500 hover:text-red-400"
            : "text-gray-400 hover:text-gray-200"
        } hover:cursor-pointer`}
      >
        {isLiked ? "❤️" : "🤍"}
      </button>

      <span className="text-sm">{likes} likes</span>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};

export default LikeButton;
