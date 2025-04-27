"use client";

import React, { useState, useEffect } from "react";
import { betterAuthClient } from "@/lib/integrations/better-auth";
import { useRouter } from "next/navigation";

interface LikeButtonProps {
  postId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId }) => {
  const { data: sessionData } = betterAuthClient.useSession();
  const router = useRouter();

  const [liked, setLiked] = useState<boolean | undefined>(undefined);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLikes = async () => {
    try {
      if (!sessionData?.user) return;

      const res = await fetch(`http://localhost:3000/like/on/${postId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch like info");

      const data = await res.json();
      setLikesCount(data.totalLikes ?? 0);
      setLiked(data.userHasLiked ?? false);
    } catch (err) {
      console.error(err);
      setError("Error fetching likes.");
    }
  };

  const handleLikeToggle = async () => {
    if (!sessionData?.user) {
      router.push("/login");
      return;
    }

    if (liked === undefined) return;

    setLoading(true);
    setError("");

    try {
      if (liked) {
        // already liked -> delete like
        const res = await fetch(`http://localhost:3000/like/on/${postId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to unlike the post");
        }
        setLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        // not liked -> create like
        const res = await fetch(`http://localhost:3000/like/on/${postId}`, {
          method: "POST",
          credentials: "include",
        });

        if (!res.ok) {
          const data = await res.json();
          if (data.error === "Like already exists") {
            setError("Post already liked.");
          } else {
            throw new Error(data.error || "Failed to like the post");
          }
        } else {
          setLiked(true);
          setLikesCount((prev) => prev + 1);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Error toggling like.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [postId, sessionData]);

  if (!sessionData?.user) {
    return <p className="text-gray-500 text-sm">Login to like this post.</p>;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleLikeToggle}
        disabled={loading}
        className={`px-4 py-2 rounded ${
          liked
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white disabled:bg-gray-400`}
      >
        {loading ? "Processing..." : liked ? "Unlike" : "Like"}
      </button>
      <span className="text-gray-600">
        {likesCount} {likesCount === 1 ? "like" : "likes"}
      </span>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};

export default LikeButton;
