"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import NavigationBar from "@/components/navigation-bar/NavigationBar";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  post: {
    id: string;
    title: string;
  };
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  likeCount: number;
}

interface Like {
  id: string;
  post: {
    id: string;
    title: string;
  };
}

const UserProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [userLikes, setUserLikes] = useState<Like[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    const fetchProfileData = async () => {
      setLoading(true);

      try {
        const [postsRes, commentsRes, likesRes] = await Promise.all([
          fetch(`http://localhost:3000/posts/by/${slug}`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`http://localhost:3000/comments/by/${slug}`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`http://localhost:3000/likes/by/${slug}`, {
            method: "GET",
            credentials: "include",
          }),          
        ]);

        if (!postsRes.ok || !commentsRes.ok || !likesRes.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const postsData = await postsRes.json();
        const commentsData = await commentsRes.json();
        const likesData = await likesRes.json();

        setUserPosts(postsData.posts || []);
        setUserComments(commentsData.comments || []);
        setUserLikes(likesData.likes || []);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(`Error loading profile: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [slug]);

  return (
    <div className="w-[1200px] bg-[#f1f1db] mx-auto mb-4">
      <NavigationBar />
      <div className="p-6 bg-[#f1f1db]">
        <h2
          onClick={() => router.refresh()}
          className="text-lg font-bold mb-8 cursor-pointer hover:underline decoration-gray-800/70"
        >
          Profile: {slug}
        </h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-gray-900"></div>
          </div>
        ) : (
          <>
            {/* User's Posts */}
            <section className="mb-12">
              <h3 className="text-md font-semibold mb-6">Posts</h3>
              {userPosts.length === 0 ? (
                <p className="text-gray-600">No posts yet.</p>
              ) : (
                <div className="grid gap-6">
                  {userPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
                    >
                      <h4 className="text-md font-bold mb-2">{post.title}</h4>
                      <p className="text-sm text-gray-700 mb-4">
                        {post.content}
                      </p>
                      <div className="text-sm text-gray-500 flex justify-between">
                        <span>{new Date(post.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* User's Comments */}
            <section className="mb-12">
              <h3 className="text-md font-semibold mb-6">Comments</h3>
              {userComments.length === 0 ? (
                <p className="text-gray-600">No comments yet.</p>
              ) : (
                <div className="grid gap-6">
                  {userComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-white p-5 rounded-xl shadow hover:shadow-md transition"
                    >
                      <p className="text-gray-800 mb-3">{comment.content}</p>
                      <div className="text-xs text-gray-500">
                        On{" "}
                        <Link
                          href={`/posts/${comment.post.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {comment.post.title}
                        </Link>{" "}
                        - {new Date(comment.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* User's Likes */}
            <section className="mb-12">
              <h3 className="text-md font-semibold mb-6">Liked Posts</h3>
              {userLikes.length === 0 ? (
                <p className="text-gray-600">No likes yet.</p>
              ) : (
                <div className="grid gap-4">
                  {userLikes.map((like) => (
                    <div
                      key={like.id}
                      className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
                    >
                      <Link
                        href={`/posts/${like.post.id}`}
                        className="text-blue-600 font-semibold hover:underline text-md"
                      >
                        {like.post.title}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
