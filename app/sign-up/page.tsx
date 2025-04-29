// app/sign-up/page.tsx
"use client";

import { betterAuthClient } from "@/lib/integrations/better-auth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import NavigationBar from "@/components/navigation-bar/NavigationBar";
import Link from "next/link";

const SignUpPage = () => {
  const { data } = betterAuthClient.useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignUp = async () => {
    await betterAuthClient.signUp.email({
      email: formData.email,
      name: formData.name,
      username: formData.username,
      password: formData.password,
    });
    router.push("/");
  };

  return (
    <>
      <NavigationBar hideNavItems />
      {!data?.user && (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
          <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6 text-amber-900">Sign Up</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-gray-700 text-sm mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  placeholder="Choose a username"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  placeholder="Create a password"
                />
              </div>
              <button
                onClick={handleSignUp}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-200"
              >
                Create Account
              </button>
              <div className="flex justify-between mt-4 text-sm">
                <Link
                  href="/login"
                  className="text-blue-500 hover:underline"
                >
                  Already have an account? Log In
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUpPage;
