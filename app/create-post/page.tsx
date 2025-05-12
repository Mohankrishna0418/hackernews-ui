import NavigationBar from "@/components/navigation-bar/NavigationBar";
import NewPostForm from "./components/CreatePost";
import { Suspense } from "react";

export default function PostsPage() {
  return (
    <div>
      <Suspense fallback={null}>
        <NavigationBar />
      </Suspense>
      <NewPostForm />
    </div>
  );
}
