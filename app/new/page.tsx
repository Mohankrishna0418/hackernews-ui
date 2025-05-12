"use client";

import React, { Suspense } from "react";
import PostList from "../posts/components/PostList";
import NavigationBar from "@/components/navigation-bar/NavigationBar";
interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const POSTS_PER_PAGE = 10;

const NewPostsPage: React.FC = () => {
  const filterTodayPosts = (post: Post) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const postDate = new Date(post.createdAt).setHours(0, 0, 0, 0);
    return postDate === today;
  };

  return (
    <div>
      <Suspense fallback={null}>
        <NavigationBar />
      </Suspense>
      <PostList
        title="Today's Posts"
        filterFunction={filterTodayPosts}
        POSTS_PER_PAGE={POSTS_PER_PAGE}
      />
    </div>
  );
};

export default NewPostsPage;
