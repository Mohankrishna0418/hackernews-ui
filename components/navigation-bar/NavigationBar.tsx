"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { auth } from "@/lib/auth";
import Link from "next/link";

interface NavigationBarProps {
  hideNavItems?: boolean;
}

const navItems = [
  { label: "New", path: "/new" },
  { label: "Past", path: "/past" },
  { label: "Comments", path: "/comments" },
  { label: "Create Post", path: "/posts" },
];

const NavigationBar: React.FC<NavigationBarProps> = ({
  hideNavItems = false,
}) => {
  const router = useRouter();
  const { data } = auth.useSession();
  const user = data?.user;

  const handleNavigation = (path: string) => {
    if (path === "/posts" && !user) {
      router.push("/log-in");
      return;
    }
    router.push(path);
  };

  const handleSignOut = async () => {
    await auth.signOut();
    router.refresh();
    router.push("/");
  };

  return (
    <header className="px-50 mx-auto bg-gray-900 text-gray-100 shadow-md">
      <div className="max-w-[95%] mx-auto py-3 flex justify-between items-center">
        {/* Left - Logo and Navigation */}
        <div className="flex flex-row items-center gap-6">
          <span
            className="text-xl pb-0.5 font-semibold text-white cursor-pointer hover:text-indigo-400 transition"
            onClick={() => {
              handleNavigation("/");
              router.refresh();
            }}
          >
            Hacker News
          </span>

          {!hideNavItems && (
            <nav className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    handleNavigation(item.path);
                    router.refresh();
                  }}
                  className="text-sm text-gray-300 hover:text-white transition"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* Right - Auth Info */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/profile/me" prefetch={false}>
                <div className="flex items-center space-x-2 hover:text-indigo-300 transition cursor-pointer">
                  <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase() || "Y"}
                  </div>
                  <span className="text-sm">{user.name}</span>
                </div>
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            !hideNavItems && (
              <button
                onClick={() => {
                  handleNavigation("/log-in");
                  router.refresh();
                }}
                className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded transition"
              >
                Login
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
