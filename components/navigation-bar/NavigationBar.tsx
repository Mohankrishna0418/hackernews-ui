"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Menu, X, LogOutIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

const navItems = [
  { label: "New", path: "/new" },
  { label: "Past", path: "/past" },
  { label: "Comments", path: "/comments" },
  { label: "Create Post", path: "/create-post" },
];

interface NavigationBarProps {
  hideNavItems?: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  hideNavItems = false,
}) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data } = auth.useSession();
  const user = data?.user;

  const handleNavigation = (path: string) => {
    setMenuOpen(false);
    if (path) {
      router.push(path);
      router.refresh();
      return;
    }
  };

  return (
    <header className="bg-gray-900 text-gray-100 shadow-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto py-3 flex justify-between items-center px-4 md:px-0">
        {/* Logo & Navigation */}
        <div className="flex items-center gap-6">
          <span
            className="text-xl font-semibold text-white cursor-pointer hover:text-indigo-400 transition"
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
                  onClick={() => handleNavigation(item.path)}
                  className="text-sm text-gray-300 hover:text-white transition hover:cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        {!hideNavItems && (
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        )}

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 p-5 gap-2 hover:cursor-pointer "
                  aria-haspopup="menu"
                  aria-label="User menu"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    {user.image ? (
                      <AvatarImage
                        src={user.image}
                        alt={`${user.name}'s avatar`}
                      />
                    ) : (
                      <AvatarFallback className="rounded-lg">
                        {user.name[0]}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="text-sm truncate">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="min-w-56"
                aria-label="User dropdown"
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div
                    className="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
                    role="button"
                    tabIndex={0}
                    onClick={() => router.push(`/users/me`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        router.push(`/users/me`);
                      }
                    }}
                    aria-label="Go to profile"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      {user.image ? (
                        <AvatarImage
                          src={user.image}
                          alt={`${user.name}'s avatar`}
                        />
                      ) : (
                        <AvatarFallback className="rounded-lg">
                          {user.name[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 hover:cursor-pointer">
                      <span className="truncate font-medium underline-offset-2 hover:underline ">
                        {user.name}
                      </span>
                      <div className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={async () => {
                      const response = await auth.signOut();
                      if (response.data) {
                        router.replace("/");
                      }
                    }}
                    aria-label="Sign out"
                  >
                    <LogOutIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !hideNavItems && (
              <button
                onClick={() => {
                  handleNavigation("/log-in");
                  router.refresh();
                }}
                className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded transition hover:cursor-pointer"
              >
                Login
              </button>
            )
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {!hideNavItems && menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.path)}
              className="block w-full text-left text-gray-200 hover:text-white transition"
            >
              {item.label}
            </button>
          ))}
          {user ? (
            <>
              <div className="flex items-center space-x-2 mt-2">
                <Avatar className="h-8 w-8 rounded-lg">
                  {user.image ? (
                    <AvatarImage src={user.image} alt={user.name} />
                  ) : (
                    <AvatarFallback className="rounded-lg">
                      {user.name[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {user.email}
                  </div>
                </div>
              </div>
              <button
                onClick={async () => {
                  const response = await auth.signOut();
                  if (response.data) {
                    router.replace("/");
                  }
                }}
                className="mt-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded transition w-full"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                handleNavigation("/log-in");
                router.refresh();
              }}
              className="mt-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded transition w-full"
            >
              Login
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default NavigationBar;
