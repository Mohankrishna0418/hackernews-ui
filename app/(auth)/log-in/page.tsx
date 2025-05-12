import { LogInCard } from "@/app/(auth)/log-in/components/log-in/LogInCard";
import NavigationBar from "@/components/navigation-bar/NavigationBar";
import { Suspense } from "react";

export default function LogInPage() {
  return (
    <div>
      <Suspense fallback={null}>
        <NavigationBar />
      </Suspense>
      <LogInCard />
    </div>
  );
}
