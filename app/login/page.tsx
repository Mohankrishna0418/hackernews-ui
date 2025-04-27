// app/login/page.tsx
"use client";

import { betterAuthClient } from "@/lib/integrations/better-auth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import NavigationBar from "@/components/navigation-bar/NavigationBar";
import Link from "next/link";

const LoginPage = () => {
  const { data } = betterAuthClient.useSession();
  const router = useRouter();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    await betterAuthClient.signIn.username({
      username: loginData.username,
      password: loginData.password,
    });
    router.push("/");
  };

  return (
    <>
      <NavigationBar hideNavItems />
      {!data?.user && (
        <div className="max-w-md mx-auto py-10">
          <h3 className="font-bold mb-4">Login</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="w-24">Username:</label>
              <input
                type="text"
                name="username"
                value={loginData.username}
                onChange={handleChange}
                className="border border-gray-400 text-sm p-1 flex-1"
              />
            </div>
            <div className="flex items-center">
              <label className="w-24">Password:</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                className="border border-gray-400 text-sm p-1 flex-1"
              />
            </div>
            <button
              onClick={handleLogin}
              className="mt-2 border px-2 py-1 bg-gray-200 hover:bg-gray-300"
            >
              Login
            </button>

            <div className="mt-4">
              <a
                href="/forgot-password"
                className="text-blue-600 underline inline-block"
              >
                Forgot your password?
              </a>
            </div>

            <div className="mt-2 text-sm">
              Don’t have an account?{" "}
              <Link href="/sign-up" className="text-blue-600 underline">
                Create one
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
 