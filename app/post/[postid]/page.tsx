"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { auth, url } from "@/lib/auth";
import NavigationBar from "@/components/navigation-bar/NavigationBar";

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    username: string;
    name?: string;
  };
};

export default function PostPage() {
  const { postId } = useParams<{ postId: string }>();
  const { data: sessionData } = auth.useSession();
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
        const res = await fetch(`${url}/posts/${postId}`, {
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
      <div className="min-h-screen bg-gray-900 text-white">
        <NavigationBar />
        <div className="p-8">
          <p className="text-red-400 text-center text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <NavigationBar />
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-white leading-tight">
          {post?.title}
        </h1>
        <p className="text-sm text-gray-400 mb-10">
          Posted by{" "}
          <a
            href={`/profile/${post?.author?.username}`}
            className="text-blue-400 hover:underline"
          >
            @{post?.author?.username}
          </a>{" "}
          on {new Date(post?.createdAt || "").toLocaleDateString()}
        </p>
        <div className="bg-gray-800 p-6 rounded-md text-gray-200 text-justify shadow-md">
          {post?.content}
        </div>
      </div>
    </div>
  );
}
