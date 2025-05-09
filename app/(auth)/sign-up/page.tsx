// app/sign-up/page.tsx

import { SignUpCard } from "@/app/(auth)/sign-up/components/sign-up/SignUpCard";
import NavigationBar from "@/components/navigation-bar/NavigationBar";

export default function SignUpPage() {
  return (
    <div>
      <NavigationBar />
      <SignUpCard />
    </div>
  );
}
