"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import NavigationBar from "@/components/navigation-bar/NavigationBar";
import { serverUrl } from "@/lib/environment";

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
  author: {
    name: string;
  };
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
  const decodedSlug = decodeURIComponent(slug);
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
          fetch(`${serverUrl}/posts/by/${slug}`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`${serverUrl}/comments/by/${slug}`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`${serverUrl}/likes/by/${slug}`, {
            method: "GET",
            credentials: "include",
          }),
        ]);

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
    <div className="mb-10 min-h-screen bg-gray-900 text-white">
      <Suspense fallback={null}>
        <NavigationBar />
      </Suspense>
      <div className="p-6 max-w-4xl mx-auto">
        <h2
          onClick={() => router.refresh()}
          className="text-lg font-bold mb-8 cursor-pointer hover:underline decoration-gray-400"
        >
          Profile: {decodedSlug}
        </h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white"></div>
          </div>
        ) : (
          <>
            {/* User's Posts */}
            <section className="mb-12">
              <h3 className="text-md font-semibold mb-6">Posts</h3>
              {userPosts.length === 0 ? (
                <p className="text-gray-400">No posts yet.</p>
              ) : (
                <div className="grid gap-6">
                  {userPosts.map((post) => (
                    <Link
                      href={`/post/${post.id}`}
                      key={post.id}
                      className="bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition block"
                    >
                      <h4 className="text-md font-bold mb-2 text-indigo-400 hover:underline">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-300 mb-4">
                        {post.content.length > 150 ? (
                          <>
                            {post.content.slice(0, 150)}
                            <span className="text-blue-400"> &nbsp; more </span>
                          </>
                        ) : (
                          post.content
                        )}
                      </p>

                      <div className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleString()}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* User's Comments */}
            <section className="mb-12">
              <h3 className="text-md font-semibold mb-6">Comments</h3>
              {userComments.length === 0 ? (
                <p className="text-gray-400">No comments yet.</p>
              ) : (
                <div className="grid gap-6">
                  {userComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition"
                    >
                      <p className="text-gray-200 mb-3">{comment.content}</p>
                      <div className="text-xs text-gray-500">
                        On{" "}
                        <Link
                          href={`/post/${comment.post.id}`}
                          className="text-indigo-400 hover:underline"
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
                <p className="text-gray-400">No likes yet.</p>
              ) : (
                <div className="grid gap-4">
                  {userLikes.map((like) => (
                    <div
                      key={like.id}
                      className="bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition"
                    >
                      <Link
                        href={`/post/${like.post.id}`}
                        className="text-indigo-400 font-semibold hover:underline text-md"
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
