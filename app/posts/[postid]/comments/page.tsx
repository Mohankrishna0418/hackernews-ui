"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { betterAuthClient } from "@/lib/integrations/better-auth";
import NavigationBar from "@/components/navigation-bar/NavigationBar";

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
}

const CommentsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const postId = params?.postid as string;

  const { data: sessionData } = betterAuthClient.useSession();
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
          fetch(`http://localhost:3000/post`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`http://localhost:3000/post/${postId}`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`http://localhost:3000/comment/on/${postId}`, {
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
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          token,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete comment");
      }

      // After delete, refetch comments
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
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/comments/on/${postId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to post comment");
      }

      setNewComment("");
      const updatedCommentsRes = await fetch(
        `http://localhost:3000/comments/on/${postId}`,
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

  // Find Post Number only when allPosts is ready
  const postNumber =
    post && allPosts.length > 0
      ? allPosts.findIndex((p) => p.id === post.id) + 1
      : null;

  return (
    <div className="container mx-auto bg-[#f1f1db] min-h-screen">
      <NavigationBar />
      <div className="p-5">
        <button
          onClick={() => router.back()}
          className="text-blue-500 hover:underline mb-4"
        >
          Back to Posts
        </button>

        {error && <p className="text-red-600">{error}</p>}

        {post ? (
          <div>
            <h1 className="text-xl font-semibold mb-2">
              {postNumber ?? "Loading..."}. {post.title}
            </h1>
            <p>{post.content}</p>
            <span className="text-sm text-gray-500">
              By {post.user.username} on{" "}
              {new Date(post.createdAt).toLocaleString()}
            </span>
            <div className="mt-4">
              <h3 className="font-semibold mb-2 text-md">Comments</h3>
              {Array.isArray(comments) && comments.length > 0 ? (
                <div>
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b py-2">
                      <p className="text-md">
                        <strong>{comment.user.username}</strong>:{" "}
                        {comment.content}
                      </p>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                      {sessionData?.user?.username ===
                        comment.user.username && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="ml-2 text-red-500 hover:underline text-xs"
                        >
                          Delete Comment
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No comments yet. Be the first to comment!</p>
              )}
              <form onSubmit={handleCommentSubmit} className="mt-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Add your comment here"
                ></textarea>
                <button
                  type="submit"
                  className="mt-2 bg-blue-500 text-white p-2 rounded-md"
                >
                  Submit Comment
                </button>
              </form>
            </div>
          </div>
        ) : (
          <p>Loading post...</p>
        )}
      </div>
    </div>
  );
};

export default CommentsPage;