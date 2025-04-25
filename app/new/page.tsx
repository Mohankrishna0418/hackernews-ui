"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const PostPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Extract the post ID from the URL
  const [post, setPost] = useState<{
    title: string;
    content: string;
    url: string;
  } | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      const res = await fetch(`/post/${id}`);
      if (res.ok) {
        const postData = await res.json();
        setPost(postData.post); // Make sure to access the `post` field
      } else {
        alert("Post not found");
      }
    };

    fetchPost();
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <a href={post.url} target="_blank" rel="noopener noreferrer">
        {post.url}
      </a>
    </div>
  );
};

export default PostPage;
