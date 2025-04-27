// app/posts/page.tsx
import NavigationBar from "@/components/navigation-bar/NavigationBar";
import NewPostForm from "./components/NewPostForm";

export default function PostsPage() {
  return (
    <>
      <NavigationBar />
      <NewPostForm />
    </>
  );
}