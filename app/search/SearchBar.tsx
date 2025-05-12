"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { serverUrl } from "@/lib/environment";
import NavigationBar from "@/components/navigation-bar/NavigationBar";
import { Suspense } from "react";
interface SearchResult {
  posts: Array<{ id: string; title: string; content: string }>;
  users: Array<{ id: string; name: string | null; email: string }>;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query") || "";
  const initialUserPage = parseInt(searchParams.get("userPage") || "1", 10);
  const initialPostPage = parseInt(searchParams.get("postPage") || "1", 10);
  const limit = 5;

  const [data, setData] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPage, setUserPage] = useState(initialUserPage);
  const [postPage, setPostPage] = useState(initialPostPage);

  useEffect(() => {
    if (!query.trim()) {
      setData(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${serverUrl}/posts/search?query=${encodeURIComponent(
            query
          )}&postPage=${postPage}&userPage=${userPage}&limit=${limit}`,
          { method: "GET", credentials: "include" }
        );

        if (!res.ok) {
          setData(null);
        } else {
          const result = await res.json();
          setData(result);
        }
      } catch (error) {
        console.error("Search fetch failed", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, userPage, postPage]);

  const updateURL = (key: string, value: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value.toString());
    window.history.pushState({}, "", url.toString());
  };

  const handleUserPagination = (newPage: number) => {
    setUserPage(newPage);
    updateURL("userPage", newPage);
  };

  const handlePostPagination = (newPage: number) => {
    setPostPage(newPage);
    updateURL("postPage", newPage);
  };

  return (
    <>
      <Suspense fallback={null}>
        <NavigationBar />
      </Suspense>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
        </div>
      ) : !data ? (
        <div className="flex flex-col p-10 justify-center items-center text-gray-400">
          <h1 className="text-xl font-semibold mb-4">
            Search Results for “{query}”
          </h1>
          <div>No Posts or Users Found</div>
        </div>
      ) : (
        <main className="max-w-3xl mx-auto py-8 px-4">
          <h1 className="text-xl font-semibold mb-4">
            Search Results for “{query}”
          </h1>

          {/* Users Section */}
          <section>
            <h2 className="p-4 text-lg font-medium">Users</h2>
            {data.users.length > 0 ? (
              <ul>
                {data.users.map((user) => (
                  <li
                    key={user.id}
                    className="p-4 rounded hover:bg-gray-800 transition cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/users/${user.name}`);
                    }}
                  >
                    <a
                      href={`/users/${user.name}`}
                      className="text-indigo-400 font-medium"
                    >
                      {user.name}
                    </a>
                    <p className="text-sm text-gray-300 mt-1">{user.email}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 text-gray-500">No users found.</p>
            )}
            <div className="flex justify-center space-x-2 mt-4">
              {userPage > 1 && (
                <button
                  onClick={() => handleUserPagination(userPage - 1)}
                  className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-500"
                >
                  Previous
                </button>
              )}
              <button
                onClick={() => handleUserPagination(userPage + 1)}
                className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-500"
              >
                Next
              </button>
            </div>
          </section>

          {/* Posts Section */}
          <section className="my-8">
            <h2 className="p-4 text-lg font-medium">Posts</h2>
            {data.posts.length > 0 ? (
              <ul>
                {data.posts.map((post) => (
                  <li
                    key={post.id}
                    className="py-4 border-b border-gray-700 px-4 hover:bg-gray-800 transition rounded"
                  >
                    <a
                      href={`/posts/${post.id}/comments`}
                      className="text-indigo-400 font-medium"
                    >
                      {post.title}
                    </a>
                    <p className="text-sm text-gray-300">
                      {post.content.length > 150 ? (
                        <>
                          {post.content.slice(0, 150)}
                          <span
                            onClick={() => router.push(`/post/${post.id}`)}
                            className="text-blue-400 hover:cursor-pointer"
                          >
                            &nbsp; more
                          </span>
                        </>
                      ) : (
                        post.content
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 text-gray-300">No posts found.</p>
            )}
            <div className="flex justify-center space-x-2 mt-4">
              {postPage > 1 && (
                <button
                  onClick={() => handlePostPagination(postPage - 1)}
                  className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-500"
                >
                  Previous
                </button>
              )}
              <button
                onClick={() => handlePostPagination(postPage + 1)}
                className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-500"
              >
                Next
              </button>
            </div>
          </section>
        </main>
      )}
    </>
  );
}
