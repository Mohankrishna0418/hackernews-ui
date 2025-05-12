"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import NavigationBar from "@/components/navigation-bar/NavigationBar";
import { auth } from "@/lib/auth";
import Link from "next/link";
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
  email: string;
  about?: string;
  createdAt: string;
  posts: Post[];
  comments: Comment[];
  likes: Like[];
}

const UserProfilePage: React.FC = () => {
  const router = useRouter();
  const { data: sessionData } = auth.useSession();
  const token = sessionData?.session?.token ?? "";

  const [profile, setProfile] = useState<UserProfile | null>();
  const [aboutInput, setAboutInput] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${serverUrl}/users/me`, {
          method: "GET",
          credentials: "include",
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
      const res = await fetch(`${serverUrl}/users/me`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ about: aboutInput }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to save about section");
      }

      const updatedProfile = { ...profile, about: aboutInput };
      setProfile(updatedProfile);
      setEditMode(false);
      router.push(`/users/me`);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(`Error saving profile: ${errorMessage}`);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121212]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Suspense fallback={null}>
        <NavigationBar />
      </Suspense>
      <div className="p-5 pb-10 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 hover:underline decoration-white/50 cursor-pointer">
          My Profile
        </h2>
        {loading ? (
          <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="space-y-6 bg-gray-900 p-6 rounded shadow-md">
            <div>
              <strong>Name:</strong>{" "}
              <span className="text-gray-200">{profile?.name}</span>
            </div>
            <div>
              <strong>Joined:</strong>{" "}
              <span className="text-gray-400">
                {new Date(profile?.createdAt || "").toLocaleDateString()}
              </span>
            </div>

            <div>
              <div className="flex flex-row justify-between">
                <strong>About Me:</strong>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-md text-indigo-400 hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              {editMode ? (
                <div className="flex flex-col gap-4 mt-2">
                  <textarea
                    value={aboutInput}
                    onChange={(e) => setAboutInput(e.target.value)}
                    placeholder="Write something about yourself..."
                    className="p-3 border border-indigo-600 bg-gray-800 text-gray-100 rounded resize-none h-32"
                  />
                  <button
                    onClick={handleSaveAbout}
                    className="bg-green-600 hover:bg-green-500 text-white py-1 px-3 rounded self-start transition"
                    disabled={!aboutInput.trim()}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p className="text-gray-300 mt-2">
                  {profile?.about || "No info provided."}
                </p>
              )}
            </div>

            <div className="flex flex-row gap-4">
              <Link
                href="/users/me/posts"
                className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-500 transition"
              >
                View Posts
              </Link>
              <Link
                href="/users/me/comments"
                className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-500 transition"
              >
                View Comments
              </Link>
              <Link
                href="/users/me/likes"
                className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-500 transition"
              >
                View Likes
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
