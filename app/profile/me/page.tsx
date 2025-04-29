"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // We need to use `useRouter` for navigation
import NavigationBar from "@/components/navigation-bar/NavigationBar";
import { betterAuthClient } from "@/lib/integrations/better-auth";
import Link from "next/link";

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
  email: string;
  about?: string;
  createdAt: string;
  posts: Post[];
  comments: Comment[];
  likes: Like[];
}

const UserProfilePage: React.FC = () => {
  const router = useRouter();
  const { data: sessionData } = betterAuthClient.useSession();
  const token = sessionData?.session?.token ?? "";

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [aboutInput, setAboutInput] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:3000/users/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            token,
          },
        });

        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || "Failed to fetch profile");
        }

        const data = await res.json();
        setProfile({
          id: data.user.id,
          name: data.user.name || "Unnamed",
          email: data.user.email,
          about: data.user.about || "",
          createdAt: data.user.createdAt,
          posts: data.user.posts || [],
          comments: data.user.comments || [],
          likes: data.user.likes || [],
        });
        setAboutInput(data.user.about || "");
        setLoading(false);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(`Error loading profile: ${errorMessage}`);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleSaveAbout = async () => {
    if (!profile) return;

    try {
      const res = await fetch("http://localhost:3000/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({ about: aboutInput }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to save about section");
      }

      const updatedProfile = { ...profile, about: aboutInput };
      setProfile(updatedProfile);

      // Optionally, navigate to the profile overview after saving the update
      router.push(`/profile/me`);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(`Error saving profile: ${errorMessage}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No profile found.</p>
      </div>
    );
  }

  return (
    <div className="w-[1200px] bg-[#f1f1db] mx-auto mb-4">
      <NavigationBar />
      <div className="p-5 pb-10">
        <h2 className="text-2xl font-bold mb-6 hover:underline decoration-gray-900/50 cursor-pointer">
          My Profile
        </h2>

        <div className="space-y-6 bg-white p-6 rounded shadow-md">
          <div>
            <strong>Name:</strong> {profile.name}
          </div>
          <div>
            <strong>Joined:</strong>{" "}
            {new Date(profile.createdAt).toLocaleDateString()}
          </div>

          <div>
            <strong>About Me:</strong>
            <div className="flex flex-col gap-2 mt-2">
              <textarea
                value={aboutInput}
                onChange={(e) => setAboutInput(e.target.value)}
                placeholder="Write something about yourself..."
                className="p-3 border rounded resize-none h-32"
              />
              <button
                onClick={handleSaveAbout}
                className="bg-green-600 hover:bg-blue-700 text-white py-2 px-4 rounded self-start"
                disabled={!aboutInput.trim()}
              >
                Save
              </button>
            </div>
          </div>

          <div className="flex flex-row gap-2">
            <Link
              href="/profile/me/posts"
              className="bg-blue-500  text-white py-2 pr-4 pl-4 rounded hover:cursor-pointer hover:underline hover:bg-blue-600"
            >
              View Posts
            </Link>
            <Link
              href="/profile/me/comments"
              className="bg-blue-500  text-white py-2 pr-4 pl-4 rounded hover:cursor-pointer hover:underline hover:bg-blue-600"
            >
              View Comments
            </Link>
            <Link
              href="/profile/me/likes"
              className="bg-blue-500  text-white py-2 pr-4 pl-4 rounded hover:cursor-pointer hover:underline hover:bg-blue-600"
            >
              View Likes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
