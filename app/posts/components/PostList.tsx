"use client";

import React, { useEffect, useState } from "react";
import { betterAuthClient } from "@/lib/integrations/better-auth";
import { useRouter } from "next/navigation";
import LikeButton from "./LikeList"; // 👈 import LikeButton

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  user: {
    username: string;
    name?: string;
  };
}

const PostList: React.FC = () => {
  const { data: sessionData } = betterAuthClient.useSession();
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:3000/post", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();
        setPosts(data.posts ?? []);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        setError(`Error loading posts: ${errorMessage}`);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="p-4 md-2 w-[1200px] mx-auto bg-[#f1f1db]">
      <h2
        onClick={() => router.refresh()}
        className="text-lg font-bold mb-2 cursor-pointer underline"
      >
        Recent Posts
      </h2>
      {error && <p className="text-red-600">{error}</p>}
      {posts.map((post) => (
        <div key={post.id} className="mb-2 p-4 border-b border-gray-500">
          <h3 className="font-semibold">{post.title}</h3>
          <p>{post.content}</p>
          <span className="text-sm text-gray-500 block">
            By {post.user.username} on {new Date(post.createdAt).toLocaleString()}
          </span>
          <div className="mt-2">
            <LikeButton postId={post.id} /> {/* 👈 Add LikeButton */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
