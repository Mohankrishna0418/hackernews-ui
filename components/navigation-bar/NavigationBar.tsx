"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { betterAuthClient } from "@/lib/integrations/better-auth";

interface NavigationBarProps {
  hideNavItems?: boolean;
}

const navItems = [
  { label: "new", path: "/new" },
  { label: "past", path: "/past" },
  { label: "comments", path: "/comments" },
  { label: "ask", path: "/ask" },
  { label: "show", path: "/show" },
  { label: "jobs", path: "/jobs" },
  { label: "submit", path: "/submit" },
];

const NavigationBar: React.FC<NavigationBarProps> = ({
  hideNavItems = false,
}) => {
  const router = useRouter();
  const { data } = betterAuthClient.useSession();
  const user = data?.user;

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleSignOut = async () => {
    await betterAuthClient.signOut();
    router.push("/");
  };

  return (
    <div className="bg-orange-600 text-black text-sm w-[1200px] mx-auto my-2">
      <div className="max-w-screen-xl mx-auto px-2 py-1 flex justify-between items-center">
        {/* Left side */}
        <div className="flex items-center gap-2">
          <span className="bg-orange-700 text-white font-bold px-1 cursor-pointer">
            {user?.name?.charAt(0).toUpperCase() || "Y"}
          </span>
          <span
            onClick={() => handleNavigation("/")}
            className="font-bold cursor-pointer"
          >
            Hacker News
          </span>
          {!hideNavItems && (
            <span className="ml-2 space-x-1">
              {navItems.map((item, index) => (
                <React.Fragment key={item.label}>
                  <button
                    onClick={() => handleNavigation(item.path)}
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
                <span>{user.name} (1)</span>
                <span>|</span>
                <button
                  onClick={handleSignOut}
                  className="hover:underline cursor-pointer"
                >
                  logout
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavigation("/login")}
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
