"use client";

import React from "react";
import NavigationBar from "@/components/navigation-bar/NavigationBar";
import PostList from "@/app/posts/components/PostList";

const POSTS_PER_PAGE = 10;

export default function Home() {
  return (
    <div className="mb-10">
      <NavigationBar />
      <PostList title="Recent Posts" POSTS_PER_PAGE={POSTS_PER_PAGE} />
    </div>
  );
}
