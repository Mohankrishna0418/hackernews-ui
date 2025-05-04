// app/login/page.tsx
"use client";

import { auth, url } from "@/lib/auth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import NavigationBar from "@/components/navigation-bar/NavigationBar";
import Link from "next/link";

const LoginPage = () => {
  const { data } = auth.useSession();
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
    await auth.signIn.username({
      username: loginData.username,
      password: loginData.password,
    });
    router.push("/");
  };

  return (
    <>
      <NavigationBar hideNavItems />
      {!data?.user && (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
          <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={loginData.username}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  placeholder="Enter your password"
                />
              </div>
              <button
                onClick={handleLogin}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Login
              </button>

              <div className="flex justify-between mt-4 text-sm">
                <Link
                  href="/forgot-password"
                  className="text-blue-500 hover:underline"
                >
                  Forgot password?
                </Link>
                <Link
                  href="/sign-up"
                  className="text-blue-500 hover:underline"
                >
                  Create account
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
