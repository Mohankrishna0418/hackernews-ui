"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import NavigationBar from "@/components/navigation-bar/NavigationBar";
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
  author: {
    username: string;
    name?: string;
  };
  likedByUser: boolean;
  likeCount: number;
  comments: Comment[];
}

const CommentsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const postId = params?.postid as string;

  const { data: sessionData } = auth.useSession();
  const token = sessionData?.session?.token || "";

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!postId) return;

    const fetchEverything = async () => {
      try {
        const [postsRes, postRes, commentsRes] = await Promise.all([
          fetch(`${serverUrl}/posts`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`${serverUrl}/posts/${postId}`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`${serverUrl}/comments/on/${postId}`, {
            method: "GET",
            credentials: "include",
          }),
        ]);

        const postsData = await postsRes.json();
        const postData = await postRes.json();
        const commentsData = await commentsRes.json();

        setAllPosts(postsData?.posts ?? []);
        setPost(postData?.post ?? null);
        setComments(commentsData?.comments ?? []);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      }
    };

    fetchEverything();
  }, [postId]);

  const handleDeleteComment = async (commentId: string) => {
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

      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      alert(`Error deleting comment: ${errorMessage}`);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return alert("Please write a comment first!");

    if (!token) {
      router.push("/log-in");
      return;
    }

    try {
      const res = await fetch(`${serverUrl}/comments/on/${postId}`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ content: newComment }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to post comment");
      }

      setNewComment("");
      const updatedCommentsRes = await fetch(
        `${serverUrl}/comments/on/${postId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const updatedCommentsData = await updatedCommentsRes.json();
      setComments(updatedCommentsData?.comments ?? []);
    } catch (err) {
      setError("Failed to post comment.");
      console.error(err);
    }
  };

  const postNumber =
    post && allPosts.length > 0
      ? allPosts.findIndex((p) => p.id === post.id) + 1
      : null;

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <Suspense fallback={null}>
        <NavigationBar />
      </Suspense>
      <div className="p-5 max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="pl-3 text-indigo-400 hover:underline mb-4"
        >
          Back to Posts
        </button>

        {error && <p className="text-red-600">{error}</p>}

        {post ? (
          <div className="p-7 rounded-lg bg-gray-800 shadow-md">
            <div
              className="flex flex-row justify-between"
              onClick={() => router.push(`/post/${post.id}`)}
            >
              <h1 className="text-2xl font-semibold mb-3">
                {postNumber ?? "Loading..."}.
                <span className="hover:underline decoration-gray-300 cursor-pointer">
                  {post.title}
                </span>
              </h1>
            </div>
            <p className="text-sm text-gray-300">
              {post.content.length > 150 ? (
                <>
                  {post.content.slice(0, 150)}
                  <span
                    className="text-blue-400 hover:cursor-pointer"
                    onClick={() => router.push(`/post/${post.id}`)}
                  >
                    &nbsp; more
                  </span>
                </>
              ) : (
                post.content
              )}
            </p>
            <span className="text-sm text-gray-500">
              By {post.author?.name} on{" "}
              {new Date(post.createdAt).toLocaleString()}
            </span>

            <div className="mt-6">
              <h3 className="font-semibold mb-3 text-xl">Comments</h3>
              {Array.isArray(comments) && comments.length > 0 ? (
                <div>
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b py-3">
                      <p className="text-md">
                        <strong>{comment.user.name}</strong>: {comment.content}
                      </p>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                      {sessionData?.user?.name === comment.user.name && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="ml-2 text-red-400 hover:underline text-xs"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">
                  No comments yet. Be the first to comment!
                </p>
              )}

              <form onSubmit={handleCommentSubmit} className="mt-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Add your comment here"
                ></textarea>
                <button
                  type="submit"
                  className="mt-3 bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Submit Comment
                </button>
              </form>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Loading post...</p>
        )}
      </div>
    </div>
  );
};

export default CommentsPage;
