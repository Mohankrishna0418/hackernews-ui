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
        <div className="flex justify-center items-center min-h-screen w-[1200px] mx-auto ">
          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-center text-amber-900 mb-6">Log In</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={loginData.username}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"              >
                Log In
              </button>

              <div className="text-right mt-2">
                <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot your password?
                </a>
              </div>

              <div className="text-center text-sm mt-4">
                Don’t have an account?{" "}
                <Link href="/sign-up" className="text-blue-600 hover:underline">
                  Create one
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
