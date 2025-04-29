"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { betterAuthClient } from "@/lib/integrations/better-auth";
import { useRouter } from "next/navigation";
import NavigationBar from "@/components/navigation-bar/NavigationBar";

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
  const { data: sessionData } = betterAuthClient.useSession();
  const token = sessionData?.session?.token ?? "";

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [postMap, setPostMap] = useState<Map<string, Post>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, postsRes] = await Promise.all([
          fetch("http://localhost:3000/users/me", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json", token },
          }),
          fetch("http://localhost:3000/posts", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json", token },
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
      <div className="p-6 text-center text-gray-600">Loading user data...</div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  if (!profile) {
    return (
      <div className="p-6 text-center text-gray-600">
        No profile data available.
      </div>
    );
  }

  const { posts, comments, likes } = profile;

  return (
    <div className="container mx-auto  mb-10">
      <NavigationBar />
      <div className="bg-[#f1f1db] p-6">
        <button
          onClick={() => router.push("/profile/me")}
          className="mb-6 px-4 py-2 bg-orange-400 text-white hover:bg-orange-500 rounded text-sm"
        >
          ← Back to Profile
        </button>

        {section === "posts" && (
          <Section
            title="Your Posts"
            items={posts.map((post) => (
              <div key={post.id} className="p-4 border-b">
                <h3 className="font-bold">{post.title}</h3>
                <p>{post.content}</p>
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
                <div key={comment.id} className="p-4 border-b">
                  <p>
                    Comment on <strong>{post?.title || `Unknown Post`}</strong>:{" "}
                    {comment.content}
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
                <div key={like.id} className="p-4 border-b">
                  <p>
                    Liked Post: <strong>{post?.title || `Unknown Post`}</strong>
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
    <h2 className="text-2xl font-bold mb-6">{title}</h2>
    {items.length > 0 ? (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {items}
      </div>
    ) : (
      <p className="text-gray-500">No items to display.</p>
    )}
  </div>
);

export default UserProfileSectionPage;