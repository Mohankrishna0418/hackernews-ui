"use client";

import NavigationBar from "@/components/navigation-bar/NavigationBar";
import React, { useEffect, useState } from "react";
import LikeButton from "../posts/components/LikeList";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  user: {
    username: string;
  };
}

function isDateToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

const NewPostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [noNewPosts, setNoNewPosts] = useState(false);
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

        const todaysPostsExist = postsArray.some((post: Post) => {
          const postDate = new Date(post.createdAt);
          return isDateToday(postDate);
        });

        if (!todaysPostsExist) {
          setNoNewPosts(true);
        }

        setPosts(postsArray);
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Error fetching posts");
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="text-sm w-[1200px] mx-auto md-2 p-4 bg-[#f1f1db]">
      <NavigationBar />
      <h2 className="text-lg font-bold mb-2">Today's Posts</h2>
      {error && <p className="text-red-600">{error}</p>}
      {noNewPosts && (
        <p className="text-yellow-500 mb-4">No new posts for today, but here are all posts!</p>
      )}
      {posts.map((post) => (
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
      ))}
    </div>
  );
};

export default NewPostsPage;
