"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import NavigationBar from "@/components/navigation-bar/NavigationBar";
import PostCard from "./components/PostCard";
import { serverUrl } from "@/lib/environment";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    username: string;
    name?: string;
  };
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  user: {
    username: string;
    name?: string;
  };
  comments: Comment[];
  number?: number;
}

const CommentsPage: React.FC = () => {
  const router = useRouter();
  const { data: sessionData } = auth.useSession();
  const token = sessionData?.session?.token || "";

  const [postsWithComments, setPostsWithComments] = useState<Post[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const POSTS_PER_PAGE = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${serverUrl}/posts?page=${page}&limit=${POSTS_PER_PAGE}`,
          { method: "GET", credentials: "include" }
        );

        if (!res.ok) throw new Error("Failed to fetch posts");

        const postData = await res.json();
        const posts: Post[] = postData.posts ?? [];

        const postsWithCommentsOnly: Post[] = [];

        const updatedPosts = await Promise.all(
          posts.map(async (post) => {
            const commentRes = await fetch(
              `${serverUrl}/comments/on/${post.id}`,
              {
                method: "GET",
                credentials: "include",
              }
            );

            const commentData = await commentRes.json();
            if (commentData.comments && commentData.comments.length > 0) {
              return {
                ...post,
                comments: commentData.comments,
              };
            }
          })
        );

        const postsWithNumber = postsWithCommentsOnly.map((post, index) => ({
          ...post,
          number: (page - 1) * POSTS_PER_PAGE + (index + 1),
        }));

        setPostsWithComments(postsWithNumber);

        updatedPosts.forEach((post) => {
          if (post && post.comments.length > 0) {
            postsWithCommentsOnly.push(post);
          }
        });

        const postsWithNumberFixed = postsWithCommentsOnly.map(
          (post, index) => ({
            ...post,
            number: (page - 1) * POSTS_PER_PAGE + (index + 1),
          })
        );

        setPostsWithComments(postsWithNumberFixed);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(`Error loading posts: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  const handleDeleteComment = async (commentId: string, postId: string) => {
    if (!token) {
      router.push("/log-in");
      return;
    }

    try {
      const res = await fetch(`${serverUrl}/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete comment");
      }

      setPostsWithComments((prevPosts) =>
        prevPosts
          .map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: post.comments.filter(
                    (comment) => comment.id !== commentId
                  ),
                }
              : post
          )
          .filter((post) => post.comments.length > 0)
      );
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      alert(`Error deleting comment: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Suspense fallback={null}>
        <NavigationBar />
      </Suspense>
      <div className="p-5 max-w-4xl mx-auto">
        <h2
          onClick={() => router.refresh()}
          className="pl-7 text-left text-xl font-bold mb-4 text-indigo-400 hover:underline cursor-pointer"
        >
          Posts with Comments
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <div className="flex justify-center items-center my-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
          </div>
        ) : postsWithComments.length === 0 ? (
          <p className="text-gray-400 text-center">
            No posts with comments available.
          </p>
        ) : (
          postsWithComments.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUsername={sessionData?.user?.name || undefined}
              onDeleteComment={handleDeleteComment}
            />
          ))
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={postsWithComments.length < POSTS_PER_PAGE}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsPage;
