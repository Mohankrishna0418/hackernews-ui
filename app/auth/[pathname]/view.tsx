"use client";

import NavigationBar from "@/components/navigation-bar/NavigationBar";
import { AuthCard } from "@daveyplate/better-auth-ui";

export function AuthView({ pathname }: { pathname: string }) {
  return (
    <>
      <NavigationBar />
      <main className="bg-gray-200 flex flex-col grow p-4 items-center justify-center">
        <AuthCard pathname={pathname} />
      </main>
    </>
  );
}
