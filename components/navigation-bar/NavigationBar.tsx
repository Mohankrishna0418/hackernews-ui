"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { betterAuthClient } from "@/lib/integrations/better-auth";
import Link from "next/link";

interface NavigationBarProps {
  hideNavItems?: boolean;
}

const navItems = [
  { label: "new", path: "/new" },
  { label: "past", path: "/past" },
  { label: "comments", path: "/comments" },
  { label: "create post", path: "/posts" },
];

const NavigationBar: React.FC<NavigationBarProps> = ({
  hideNavItems = false,
}) => {
  const router = useRouter();
  const { data } = betterAuthClient.useSession();
  const user = data?.user;

  const handleNavigation = (path: string) => {
    router.push(path); // This is the correct way to navigate to a route in Next.js
  };

  const handleSignOut = async () => {
    await betterAuthClient.signOut();
    router.refresh();
    router.push("/"); // Redirect to homepage on sign out
  };

  return (
    <div className="bg-orange-600 text-black text-sm w-[1200px] mx-auto mt-2">
        <div className="max-w-screen-xl mx-auto px-2 py-1 flex justify-between items-center">
          {/* Left side */}
          <div className="flex items-center gap-2">
            <span className="bg-orange-700 text-white font-bold px-1 cursor-pointer">
              {user?.name?.charAt(0).toUpperCase() || "Y"}
            </span>
            <span
              onClick={() => {
                handleNavigation("/");
                router.refresh();
              }}
              className="font-bold cursor-pointer"
            >
              Hacker News
            </span>
            {!hideNavItems && (
              <span className="ml-2 space-x-1">
                {navItems.map((item, index) => (
                  <React.Fragment key={item.label}>
                    <button
                      onClick={() => {
                        handleNavigation(item.path);
                        router.refresh();
                      }}
                      className="cursor-pointer hover:underline"
                    >
                      {item.label}
                    </button>
                    {index < navItems.length - 1 && <span>|</span>}
                  </React.Fragment>
                ))}
              </span>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {!hideNavItems &&
              (user ? (
                <>
                  <Link href="/profile/me" prefetch={false}>
                    <span className="cursor-pointer hover:underline">
                      {user?.name || "Guest"}
                    </span>
                  </Link>
                  <span>|</span>
                  <button
                    onClick={() => {
                      handleSignOut();
                      router.refresh();
                    }}
                    className="hover:underline cursor-pointer"
                  >
                    logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleNavigation("/login");
                    router.refresh();
                  }}
                  className="hover:underline cursor-pointer"
                >
                  login
                </button>
              ))}
          </div>
        </div>
      </div>
  );
};

export default NavigationBar;