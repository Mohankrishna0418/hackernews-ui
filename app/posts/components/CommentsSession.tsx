// app/posts/components/CommentsSection.tsx
"use client";

import { betterAuthClient } from "@/lib/integrations/better-auth";
import React, { useState } from "react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    username: string;
    name?: string;
  };
}

interface CommentsSectionProps {
  postId: string;
  comments: Comment[];
  token: string;
  onNewComment: (postId: string, comment: Comment) => void;
  onUpdateComment?: (postId: string, updatedComment: Comment) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  postId,
  comments,
  token,
  onNewComment,
  onUpdateComment,
  onDeleteComment,
}) => {
  const [commentText, setCommentText] = useState("");
  const { data: sessionData } = betterAuthClient.useSession();
  const currentUsername = sessionData?.user?.username || "";
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const handleSubmit = async () => {
    if (!commentText.trim()) return;
    if (!token) {
      alert("You must be logged in to comment.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/comment/on/${postId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({ content: commentText }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit comment");
      }

      const { comment }: { comment: Comment } = await res.json();
      onNewComment(postId, comment);
      setCommentText("");
    } catch (error) {
      alert("Failed to comment: " + (error as Error).message);
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleUpdate = async () => {
    if (!editingContent.trim() || !editingCommentId) return;

    try {
      const res = await fetch(
        `http://localhost:3000/comment/${editingCommentId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify({ content: editingContent }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update comment");
      }

      const { comment }: { comment: Comment } = await res.json();
      onUpdateComment?.(postId, comment);
      setEditingCommentId(null);
      setEditingContent("");
    } catch (error) {
      alert("Failed to update comment: " + (error as Error).message);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`http://localhost:3000/comment/${commentId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          token,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete comment");
      }
      onDeleteComment?.(postId, commentId);
    } catch (error) {
      alert("Failed to delete comment: " + (error as Error).message);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="font-medium mb-1">Comments</h4>
      {comments?.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="text-sm pl-2 border-l mb-2">
            {editingCommentId === comment.id ? (
              <div>
                <textarea
                  className="w-full p-1 border rounded"
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  rows={2}
                />
                <button
                  onClick={handleUpdate}
                  className="text-xs bg-green-600 text-white px-2 py-1 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingCommentId(null)}
                  className="text-xs bg-gray-400 text-white px-2 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <p>{comment.content}</p>
                <span className="text-xs text-gray-500">
                  — {comment.user.username} on{" "}
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
                {/* Only allow edit/delete if the logged-in user matches comment user */}
                {currentUsername === comment.user.username && (
                  <div className="mt-1 flex gap-2">
                    <button
                      onClick={() => handleEdit(comment)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-600">No comments yet.</p>
      )}

      <div className="mt-2">
        <textarea
          className="w-full p-2 border rounded"
          rows={2}
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="mt-1 px-3 py-1 bg-blue-600 text-white rounded text-sm"
        >
          Submit Comment
        </button>
      </div>
    </div>
  );
};

export default CommentsSection;