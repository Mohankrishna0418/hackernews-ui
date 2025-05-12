"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Menu, X, LogOutIcon, UserIcon, SearchIcon, CornerDownLeft } from "lucide-react";
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
import { useDebouncedCallback } from "use-debounce";
import { auth } from "@/lib/auth";
import { toast } from "sonner";

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();

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

  const debouncedSearch = useDebouncedCallback((value: string) => {
    if (value.trim()) {
      router.push(`/posts/search?query=${encodeURIComponent(value)}`);
      setSearchOpen(true);
      router.refresh();
    }
  }, 500);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        router.push(`/posts/search?query=${encodeURIComponent(searchQuery)}`);
        setSearchOpen(true);
        router.refresh();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, router]);

  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      setSearchQuery(query);
      setSearchOpen(true);
    }
  }, [searchParams]);


  return (
    <>
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
            {/* Search bar */}
            <div className="relative flex items-center h-8 transition-all duration-300">
              <div
                className={`flex items-center gap-2 bg-gray-800 border border-gray-700 rounded px-2 h-full transition-all duration-300 ${
                  searchOpen ? "w-75" : "w-8"
                } md:w-${searchOpen ? "48" : "8"}`}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (searchOpen && !searchQuery) {
                      setSearchOpen(false);
                    } else {
                      setSearchOpen(true);
                    }
                  }}
                  className="shrink-0"
                  aria-label="Toggle search"
                >
                  <SearchIcon className="w-4 h-4 text-gray-300 hover:cursor-pointer" />
                </button>

                <input
                  type="text"
                  placeholder="Search users and posts..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    debouncedSearch(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (searchQuery.trim()) {
                        router.push(
                          `/posts/search?query=${encodeURIComponent(
                            searchQuery
                          )}`
                        );
                        setSearchOpen(true);
                        router.refresh();
                      }
                    }
                  }}
                  className={`bg-transparent outline-none text-sm text-white transition-all duration-300 w-full ${
                    searchOpen ? "opacity-100 ml-1" : "opacity-0 w-0 ml-0"
                  }`}
                  style={{ transitionProperty: "width, opacity, margin" }}
                />

                {searchOpen && (
                  <button
                    onClick={() => {
                      if (searchQuery.trim()) {
                        router.push(
                          `/posts/search?query=${encodeURIComponent(
                            searchQuery
                          )}`
                        );
                        router.refresh();
                      }
                    }}
                    aria-label="Submit search"
                  >
                    <CornerDownLeft className="w-4 h-4 text-gray-400 hover:text-gray-200 transition" />
                  </button>
                )}
              </div>
            </div>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 p-5 gap-2 hover:cursor-pointer"
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
                        <AvatarFallback className="rounded-lg ">
                          {user.name[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-sm truncate ">{user.name}</span>
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
                      <div className="flex-1">
                        <span className="truncate font-medium">
                          {user.name}
                        </span>
                        <div className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuLabel className="p-0 font-normal">
                    <DropdownMenuItem
                      onClick={() => router.push(`/users/me`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          router.push(`/users/me`);
                        }
                      }}
                      aria-label="Go to profile"
                      className="hover:cursor-pointer"
                    >
                      <UserIcon className="mr-2 h-8 w-8" aria-hidden="true" />
                      Profile
                    </DropdownMenuItem>
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
                      className="hover:cursor-pointer"
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
                    toast.success("Logged out successfully");
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
    </>
  );
};

export default NavigationBar;