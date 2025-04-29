"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { betterAuthClient } from "@/lib/integrations/better-auth";
import NavigationBar from "@/components/navigation-bar/NavigationBar";

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  user: {
    username: string;
    name?: string;
  };
};

export default function PostPage() {
  const { postId } = useParams<{ postId: string }>();
  const { data: sessionData } = betterAuthClient.useSession();
  const token = sessionData?.session?.token ?? "";

  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!postId) {
      setError("No post ID provided.");
      return;
    }

    async function fetchPost() {
      try {
        const res = await fetch(`http://localhost:3000/posts/${postId}`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch post");
        }

        const data = await res.json();
        setPost(data.post);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    }

    fetchPost();
  }, [postId, token]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#f1f1db]">
        <NavigationBar />
        <div className="container mx-auto p-8">
          <p className="text-red-600 text-center text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f1f1db]">
        <NavigationBar />
        <div className="container mx-auto p-8">
          <p className="text-center text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto bg-[#f1f1db]">
      <NavigationBar />
      <div className=" max-w-3xl p-8">
        <h1 className="text-4xl font-extrabold mb-6 text-gray-900 leading-tight">
          {post.title}
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          Posted on {new Date(post.createdAt).toLocaleDateString()} by{" "}
          {post.user.username}
        </p>
        <div className="prose prose-lg max-w-none bg-white p-8 rounded-2xl shadow-lg">
          {post.content}
        </div>
      </div>
    </div>
  );
}
