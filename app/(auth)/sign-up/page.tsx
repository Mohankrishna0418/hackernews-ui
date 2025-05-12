// app/sign-up/page.tsx

import { SignUpCard } from "@/app/(auth)/sign-up/components/sign-up/SignUpCard";
import NavigationBar from "@/components/navigation-bar/NavigationBar";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <div>
      <Suspense fallback={null}>
        <NavigationBar />
      </Suspense>
      <SignUpCard />
    </div>
  );
}
