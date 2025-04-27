"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavigationBar from "@/components/navigation-bar/NavigationBar";
import LikeButton from "../posts/components/LikeList";
 // 👈 import LikeButton

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  user: {
    username: string;
  };
}

function isDateYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const endOfYesterday = new Date(yesterday);
  endOfYesterday.setHours(23, 59, 59, 999);

  return date >= yesterday && date <= endOfYesterday;
}

const PastPostsPage = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`http://localhost:3000/post`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();
        const postsArray = data.posts ?? data;

        const filteredPosts = postsArray.filter((post: Post) => {
          const postDate = new Date(post.createdAt);
          return isDateYesterday(postDate);
        });

        if (filteredPosts.length === 0) {
          setError("No posts found for yesterday.");
        } else {
          setPosts(filteredPosts);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error fetching posts");
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="text-sm w-[1200px] mx-auto md-2 p-4 bg-[#f1f1db]">
      <NavigationBar />
      <h2 className="text-lg font-bold mb-2">Yesterday's Posts</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="mb-6 border-b border-gray-500 pb-4">
            <h3 className="font-semibold">{post.title}</h3>
            <p>{post.content}</p>
            <span className="text-sm text-gray-500 block">
              By {post.user.username} on {new Date(post.createdAt).toLocaleString()}
            </span>
            <div className="mt-2">
              <LikeButton postId={post.id} /> {/* 👈 Add LikeButton */}
            </div>
          </div>
        ))
      ) : (
        <p>
          No posts found for yesterday.{" "}
          <button
            onClick={() => router.push("/")}
            className="text-blue-400 cursor-pointer underline"
          >
            Check out the new ones!
          </button>
        </p>
      )}
    </div>
  );
};

export default PastPostsPage;
