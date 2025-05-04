// app/page.tsx
"use client";

import React from "react";
import NavigationBar from "@/components/navigation-bar/NavigationBar";
import PostList from "@/app/posts/components/PostList";

export default function Home() {
  return (
    <div className="mb-10">
      <NavigationBar />
      <PostList />
    </div>
  );
}
