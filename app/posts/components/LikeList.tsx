"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface LikeButtonProps {
  postId: string;
  likedByUser: boolean;
  likeCount: number;
  token: string;
  onLikeChange: (postId: string, liked: boolean) => Promise<void>;
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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    // If no token, redirect to login page
    if (!token || loading) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      // Toggle the like state
      await onLikeChange(postId, isLiked);
      setIsLiked((prev) => !prev);
      setLikes((prev) => (isLiked ? prev - 1 : prev + 1)); // Update the like count based on the current state
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-blue-500 hover:underline disabled:opacity-50 cursor-pointer"
    >
      {isLiked ? "Unlike" : "Like"} ({likes})
    </button>
  );
};

export default LikeButton;