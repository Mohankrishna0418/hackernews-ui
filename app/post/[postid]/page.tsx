"use client";

import { Suspense, useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import NavigationBar from "@/components/navigation-bar/NavigationBar";
import { serverUrl } from "@/lib/environment";

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
  const router = useRouter();
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
        const res = await fetch(`${serverUrl}/posts/${postId}`, {
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
        <Suspense fallback={null}>
          <NavigationBar />
        </Suspense>
        <div className="p-8">
          <p className="text-red-400 text-center text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Suspense fallback={null}>
        <NavigationBar />
      </Suspense>
      <div className="p-8 max-w-4xl mx-auto">
        <button
          className="bg-indigo-700 hover:bg-indigo-600 text-white font-semibold py-1 px-2 rounded mb-4 flex items-center"
          onClick={() => router.back()}
        >
          <FaArrowLeft size={12} className="mr-2" />
          Back
        </button>
        <h1
          onClick={() => router.push(`/posts/${post?.id}/comments`)}
          className="text-2xl font-bold mb-6 text-indigo-400 leading-tight cursor-pointer"
        >
          {post?.title}
        </h1>
        <p className="text-sm text-gray-400 mb-10">
          Posted by{" "}
          <a
            href={`/users/${post?.author?.name}`}
            className="text-blue-400 hover:underline"
          >
            @{post?.author?.name}
          </a>{" "}
          on {new Date(post?.createdAt || "").toLocaleDateString()}
        </p>
        <div className="bg-gray-800 p-6 rounded-md text-gray-300 text-justify shadow-md">
          {post?.content}
        </div>
      </div>
    </div>
  );
}
