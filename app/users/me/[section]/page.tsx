"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import NavigationBar from "@/components/navigation-bar/NavigationBar";
import { serverUrl } from "@/lib/environment";

interface Post {
  id: string;
  title: string;
  content: string;
}

interface Comment {
  id: string;
  content: string;
  postId: string;
}

interface Like {
  id: string;
  postId: string;
}

interface UserProfile {
  id: string;
  name: string;
  createdAt: string;
  posts: Post[];
  comments: Comment[];
  likes: Like[];
}

const UserProfileSectionPage = () => {
  const router = useRouter();
  const { section } = useParams<{ section: string }>();
  const { data: sessionData } = auth.useSession();
  const token = sessionData?.session?.token ?? "";

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [postMap, setPostMap] = useState<Map<string, Post>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, postsRes] = await Promise.all([
          fetch(`${serverUrl}/users/me`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`${serverUrl}/posts`, {
            method: "GET",
            credentials: "include",
          }),
        ]);

        if (!profileRes.ok || !postsRes.ok) {
          throw new Error("Failed to fetch profile or posts data");
        }

        const profileData = await profileRes.json();
        const postsData = await postsRes.json();

        setProfile(profileData.user);
        setPostMap(new Map(postsData.posts.map((p: Post) => [p.id, p])));
      } catch (err) {
        console.error(err);
        setError("Error loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 bg-gray-900 min-h-screen">
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-center text-gray-400 bg-gray-900 min-h-screen">
        No profile data available.
      </div>
    );
  }

  const { posts, comments, likes } = profile;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <NavigationBar />
      <div className="p-6 max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/users/me")}
          className="mb-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm transition"
        >
          ← Back to Profile
        </button>

        {section === "posts" && (
          <Section
            title="Your Posts"
            items={posts.map((post, index) => (
              <div
                key={post.id}
                onClick={() => router.push(`/post/${post.id}`)}
                className="p-7 rounded hover:bg-gray-800 cursor-pointer"
              >
                <h3 className="font-semibold text-lg text-white mb-1">
                  {index + 1}.{" "}
                  <span className="text-indigo-400 hover:underline hover:text-indigo-300 cursor-pointer">
                    {post.title}
                  </span>
                </h3>
                <p className="text-sm text-gray-300">
                  {post.content.length > 150 ? (
                    <>
                      {post.content.slice(0, 150)}
                      <span className="text-blue-400 hover:cursor-pointer">
                        &nbsp; more
                      </span>
                    </>
                  ) : (
                    post.content
                  )}
                </p>
              </div>
            ))}
          />
        )}

        {section === "comments" && (
          <Section
            title="Your Comments"
            items={comments.map((comment) => {
              const post = postMap.get(comment.postId);
              return (
                <div key={comment.id} className="p-4 border-b border-gray-700">
                  <p className="text-gray-300">
                    Comment on{" "}
                    <strong className="text-gray-100">
                      {post?.title || "Unknown Post"}
                    </strong>
                    : {comment.content}
                  </p>
                </div>
              );
            })}
          />
        )}

        {section === "likes" && (
          <Section
            title="Your Likes"
            items={likes.map((like) => {
              const post = postMap.get(like.postId);
              return (
                <div key={like.id} className="p-4 border-b border-gray-700">
                  <p className="text-gray-300">
                    Liked Post:{" "}
                    <strong
                      className="text-indigo-400 hover:underline hover:cursor-pointer hover:text-indigo-300"
                      onClick={() => router.push(`/post/${like.postId}`)}
                    >
                      {post?.title || "Unknown Post"}
                    </strong>
                  </p>
                </div>
              );
            })}
          />
        )}
      </div>
    </div>
  );
};

const Section = ({
  title,
  items,
}: {
  title: string;
  items: React.ReactNode[];
}) => (
  <div>
    <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>
    {items.length > 0 ? (
      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden divide-y divide-gray-700">
        {items}
      </div>
    ) : (
      <p className="text-gray-400">No items to display.</p>
    )}
  </div>
);

export default UserProfileSectionPage;
