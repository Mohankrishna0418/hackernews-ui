"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { betterAuthClient } from "@/lib/integrations/better-auth";
import LikeButton from "./LikeList";

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
  likedByUser: boolean;
  likeCount: number;
  comments: Comment[];
  number?: number;
}

const PostList: React.FC = () => {
  const router = useRouter();
  const { data: sessionData } = betterAuthClient.useSession();
  const token = sessionData?.session?.token || "";

  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const POSTS_PER_PAGE = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3000/post?page=${page}&limit=${POSTS_PER_PAGE}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();
        const fetchedPosts: Post[] = data.posts ?? [];

        const postsWithNumber = fetchedPosts.map((post, index) => ({
          ...post,
          number: (page - 1) * POSTS_PER_PAGE + (index + 1),
        }));

        setPosts(postsWithNumber);
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

  const handleDeletePost = async (postId: string) => {
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/post/${postId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          token,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete post");
      }

      // After delete, refetch posts
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      alert(`Error deleting post: ${errorMessage}`);
    }
  };

  const handleLikeChange = async (postId: string, liked: boolean) => {
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const endpoint = `http://localhost:3000/like/on/${postId}`;
      const method = liked ? "DELETE" : "POST";

      const res = await fetch(endpoint, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          token,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to toggle like");
      }

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likedByUser: !liked,
                likeCount: liked ? post.likeCount - 1 : post.likeCount + 1,
              }
            : post
        )
      );
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      alert(`Error toggling like: ${errorMessage}`);
    }
  };

  return (
    <div className="w-[1200px] bg-[#f1f1db] mx-auto mb-4">
      <div className="p-5">
        <h2
          onClick={() => router.refresh()}
          className="text-lg font-bold mb-2 hover:underline decoration-gray-900/50 cursor-pointer"
        >
          Recent Posts
        </h2>

        {error && <p className="text-red-600">{error}</p>}

        {loading ? (
          <div className="flex justify-center items-center my-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        ) : posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="pb-4 mb-6 border-b border-gray-600">
              <h3 className="font-semibold text-md">
                {post.number}. {post.title}
              </h3>
              <p>{post.content}</p>
              <span className="text-xs text-gray-500">
                By{" "}
                <a
                  //href={`/profile/${post.user.username}`}
                  className="text-blue-600 hover:underline"
                >
                  @{post.user.username}
                </a>{" "}
                on {new Date(post.createdAt).toLocaleString()}
              </span>

              <div className="mt-2 flex flex-row items-center gap-5">
                <LikeButton
                  postId={post.id}
                  likedByUser={post.likedByUser}
                  likeCount={post.likeCount}
                  token={token}
                  onLikeChange={handleLikeChange}
                />
                <div>
                  <a
                    href={`/posts/${post.id}/comments`}
                    className="text-blue-500 hover:underline"
                  >
                    View Comments
                  </a>
                </div>
                {sessionData?.user?.username === post.user.username && (
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete Post
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {/* Pagination Buttons */}
        <div className="flex justify-center gap-4 my-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={posts.length < POSTS_PER_PAGE}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostList;