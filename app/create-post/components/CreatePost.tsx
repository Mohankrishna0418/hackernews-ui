"use client";

import React, { useState } from "react";
import { auth } from "@/lib/auth";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { serverUrl } from "@/lib/environment";

const NewPostForm: React.FC = () => {
  const router = useRouter();
  const { data: sessionData } = auth.useSession();
  const token = sessionData?.session?.token;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("You must be logged in to create a post.");
      return;
    }

    toast.promise(
      fetch(`${serverUrl}/posts`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ title, content }),
      }).then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Unknown error");
        }
      }),
      {
        loading: "Creating post...",
        success: () => {
          setTitle("");
          setContent("");
          router.push("/");
          return {
            message: "Post created successfully!",
            duration: 5000,
          };
        },
        error: (err: unknown) => ({
          message:
            err instanceof Error
              ? `Error: ${err.message}`
              : "An unknown error occurred",
          duration: 5000,
        }),
      }
    );
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="min-h-screen flex bg-gray-900 text-gray-100 px-4 justify-center">
        <div className="min-w-8/12 h-full bg-gray-900 text-white rounded-2xl shadow-lg p-10">
          {token ? (
            <>
              <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a title"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write something..."
                    rows={10}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white px-6 py-2 rounded-sm font-medium"
                >
                  Post
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-bold mb-4">
                Please log in to create a post
              </h2>
              <button
                onClick={() => router.push("/log-in")}
                className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white px-6 py-2 rounded-sm font-medium"
              >
                Log In
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NewPostForm;
