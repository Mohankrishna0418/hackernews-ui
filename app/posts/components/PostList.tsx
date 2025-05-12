"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import {useIsMobile} from "@/hooks/use-mobile";
import LikeButton from "./LikeButton";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { serverUrl } from "@/lib/environment";
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
  number?: number;
}
interface PostListComponentProps {
  title: string;
  filterFunction?: (post: Post) => boolean;
  POSTS_PER_PAGE: number;
}
const PostList: React.FC<PostListComponentProps> = ({
  title,
  filterFunction,
  POSTS_PER_PAGE,
}) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { data: sessionData } = auth.useSession();
  const token = sessionData?.session?.token || "";
  const [posts, setPosts] = useState<Post[]>([]);
  const [openPopoverPostId, setOpenPopoverPostId] = useState<string | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const [postsRes, likesRes] = await Promise.all([
          fetch(`${serverUrl}/posts?page=${page}&limit=${POSTS_PER_PAGE}`, {
            method: "GET",
            credentials: "include",
          }),
          token
            ? fetch(`${serverUrl}/likes/me`, {
                method: "GET",
                credentials: "include",
              })
            : Promise.resolve(null),
        ]);
        if (!postsRes.ok) throw new Error("Failed to fetch posts");
        const postData = await postsRes.json();
        const fetchedPosts: Post[] = postData.posts ?? [];
        const userLikes: string[] =
          likesRes && likesRes.ok
            ? (await likesRes.json()).likes.map(
                (like: { postId: string }) => like.postId
              )
            : [];
        const filteredPosts = filterFunction
          ? fetchedPosts.filter(filterFunction)
          : fetchedPosts;
        const postsWithMeta = filteredPosts.map((post, index) => ({
          ...post,
          likedByUser: userLikes.includes(post.id),
          number: (page - 1) * POSTS_PER_PAGE + (index + 1),
        }));
        setPosts(postsWithMeta);
        setHasNextPage(fetchedPosts.length === POSTS_PER_PAGE);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        toast.error(`Failed to load posts: ${errorMessage}`);
        setHasNextPage(false);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page, token, filterFunction, POSTS_PER_PAGE]);
  const handleDeletePost = async (postId: string) => {
    if (!token) {
      router.push("/log-in");
      return;
    }
    try {
      const res = await fetch(`${serverUrl}/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete post");
      }
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      toast.success("Post deleted successfully.");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error(`Error deleting post: ${errorMessage}`);
    }
  };
  const handleLikeChange = (postId: string, likedByUser: boolean) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likedByUser,
            likeCount: likedByUser ? post.likeCount + 1 : post.likeCount - 1,
          };
        }
        return post;
      })
    );
  };
  useEffect(() => {
    const handleScroll = () => {
      if (openPopoverPostId !== null) {
        setOpenPopoverPostId(null);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [openPopoverPostId]);
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="p-5 max-w-4xl mx-auto">
        <h2 className="pl-7 text-left text-xl font-bold mb-4 text-indigo-400 hover:underline cursor-pointer">
          {title}
        </h2>
        {loading ? (
          <div className="flex justify-center items-center my-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>{" "}
          </div>
        ) : posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="pb-4 border-b border-gray-700 px-4 hover:bg-gray-800 transition rounded"
            >
              <div className="p-3 rounded">
                <h3 className="font-semibold text-lg text-white mb-1">
                  {post.number}. <span>{post.title}</span>
                </h3>
                <p className="text-sm text-gray-300">
                  {post.content.length > 150 ? (
                    <>
                      {post.content.slice(0, 150)}
                      {isMobile ? (
                        <span
                          onClick={() => router.push(`/post/${post.id}`)}
                          className="text-blue-400 hover:underline cursor-pointer"
                        >
                          &nbsp;more
                        </span>
                      ) : (
                        <Popover
                          open={openPopoverPostId === post.id}
                          onOpenChange={(open) =>
                            setOpenPopoverPostId(open ? post.id : null)
                          }
                        >
                          <PopoverTrigger
                            onMouseOver={() => setOpenPopoverPostId(post.id)}
                            asChild
                          >
                            <span
                              onClick={() => router.push(`/post/${post.id}`)}
                              className="text-blue-400 hover:cursor-pointer"
                            >
                              {" "}
                              more
                            </span>
                          </PopoverTrigger>
                          <PopoverContent
                            side="right"
                            align="start"
                            className="bg-gray-800 text-white text-justify w-120 max-h-[60vh] overflow-y-auto p-4 rounded shadow-lg z-50"
                          >
                            <h3 className="text-indigo-400 text-lg font-semibold mb-2">
                              {post.title}
                            </h3>
                            <div className="text-gray-300 text-base whitespace-pre-line leading-relaxed">
                              {post.content}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </>
                  ) : (
                    post.content
                  )}
                </p>
              </div>
              <div className="text-xs text-gray-400 px-3">
                By{" "}
                <a
                  href={`/users/${post.user.name}`}
                  className="text-indigo-400 hover:text-indigo-300 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  @{post.user.name}
                </a>{" "}
                on {new Date(post.createdAt).toLocaleString()}
              </div>
              <div className="pl-3 mt-3 flex items-center gap-6 text-sm">
                <div onClick={(e) => e.stopPropagation()}>
                  <LikeButton
                    postId={post.id}
                    likedByUser={post.likedByUser}
                    likeCount={post.likeCount}
                    token={token}
                    onLikeChange={handleLikeChange}
                  />
                </div>
                <a
                  href={`/posts/${post.id}/comments`}
                  className="text-indigo-400 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Comments
                </a>
                {sessionData?.user?.name === post.user.name && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePost(post.id);
                    }}
                    className="text-red-400 font-medium py-1 rounded transition hover:cursor-pointer"
                  >
                    Delete Post
                  </span>
                )}
              </div>
            </div>
          ))
        )}
        <div className="flex justify-center gap-4 my-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => {
              if (!hasNextPage) {
                toast.warning("You are already on the last page.");
                return;
              }
              setPage((prev) => prev + 1);
            }}
            disabled={!hasNextPage}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
export default PostList;