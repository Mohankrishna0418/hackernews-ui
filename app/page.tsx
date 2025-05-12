"use client";

import React, { Suspense } from "react";
import NavigationBar from "@/components/navigation-bar/NavigationBar";
import PostList from "@/app/posts/components/PostList";

const POSTS_PER_PAGE = 10;

export default function Home() {
  return (
    <div className="mb-10">
      <Suspense fallback={null}>
        <NavigationBar />
      </Suspense>
      <PostList title="Recent Posts" POSTS_PER_PAGE={POSTS_PER_PAGE} />
    </div>
  );
}
