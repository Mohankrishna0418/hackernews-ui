// app/posts/components/NewPostForm.tsx
"use client";

import React, { useState } from "react";
import { betterAuthClient } from "@/lib/integrations/better-auth";

const NewPostForm: React.FC = () => {
  const { data: sessionData } = betterAuthClient.useSession();
  const token = sessionData?.session?.token;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setMessage("Error: You must be logged in to create a post.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3000/posts",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify({ title, content }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Unknown error");
      }

      setMessage("Post created successfully!");
      setTitle("");
      setContent("");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setMessage(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="w-[1200px] bg-[#f1f1db] mx-auto mb-4">
      <div className="p-5">
        <form onSubmit={handleSubmit} className="p-4 border rounded mb-4">
          <h2 className="text-lg font-semibold mb-2">Create a New Post</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="block w-full p-2 mb-2 border border-black"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            className="block w-full p-2 mb-2 border border-black"
            required
          />
          <button
            type="submit"
            className="bg-orange-600 text-white px-4 py-2 rounded"
          >
            Post
          </button>
          {message && <p className="mt-2">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default NewPostForm;
