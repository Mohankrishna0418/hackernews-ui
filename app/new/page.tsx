"use client";

import React from "react";
import PostList from "../posts/components/PostList";
import NavigationBar from "@/components/navigation-bar/NavigationBar";
interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const POSTS_PER_PAGE = 5;

const NewPostsPage: React.FC = () => {
  const filterTodayPosts = (post: Post) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const postDate = new Date(post.createdAt).setHours(0, 0, 0, 0);
    return postDate === today;
  };

  return (
    <div>
      <NavigationBar />
      <PostList
        title="Today's Posts"
        filterFunction={filterTodayPosts}
        POSTS_PER_PAGE={POSTS_PER_PAGE}
      />
    </div>
  );
};

export default NewPostsPage;
