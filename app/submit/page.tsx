"use client";

import { betterAuthClient } from "@/lib/integrations/better-auth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import NavigationBar from "@/components/navigation-bar/NavigationBar";

const SubmitPage = () => {
  const { data } = betterAuthClient.useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    text: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    const res = await fetch("/post", {
      method: "POST",
      body: JSON.stringify({
        title: formData.title,
        content: formData.text, // Renaming content to match the API
        userId: data?.user?.id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const newPost = await res.json();  // Get the post object with the ID
      // Redirect to the newly created post page
      router.push(`/post/${newPost.post.id}`);
    } else {
      alert("Failed to submit post.");
    }
  };

  return (
    <>
      <NavigationBar />
      {!data?.user ? (
        <div className="text-center mt-20 text-xl text-red-600 font-semibold">
          Please log in to submit a post.
        </div>
      ) : (
        <div className="flex justify-start w-[1200px] mx-auto pt-6">
          <div className="w-full max-w-3xl px-4">
            <form className="mt-4 space-y-3 text-sm">
              {/* Title Field */}
              <div className="flex items-center text-left">
                <label htmlFor="title" className="mr-2 mb-1 w-20">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="border border-gray-400 p-1 text-sm flex-grow"
                />
              </div>

              {/* URL Field */}
              <div className="flex items-center text-left">
                <label htmlFor="url" className="mr-2 mb-1 w-20">
                  URL
                </label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  className="border border-gray-400 p-1 text-sm flex-grow"
                />
              </div>

              {/* Description Field */}
              <div className="flex items-center text-left">
                <label htmlFor="text" className="mr-2 mb-1 w-20">
                  Description
                </label>
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  className="border border-gray-400 p-1 text-sm flex-grow"
                  rows={6}
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="border border-gray-400 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SubmitPage;
