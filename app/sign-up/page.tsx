"use client";

import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import NavigationBar from "@/components/navigation-bar/NavigationBar";
import Link from "next/link";
import { Toaster, toast } from "sonner";
const SignUpPage = () => {
  const { data } = auth.useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    console.log(
      "BetterAuth client fetch override check",
      window.fetch.toString()
    );

    try {
      // Using username based signup:
      const { error } = await auth.signUp.email(
        {
          username: formData.username,
          email: formData.email,
          name: formData.name,
          password: formData.password,
          callbackURL: "/",
        },
        {
          onRequest: () => {
            document.cookie = "signup_initiated=true; path=/";
            console.log("Signing up...");
          },
          onSuccess: () => {
            router.push("/");
          },
          onError: (ctx) => {
            alert(ctx.error?.message || "Signup failed. Please try again.");
          },
        }
      );

      // Optionally check the response:
      if (error) {
        console.error("Signup error:", error);
        alert(error.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup exception:", err);
      alert("An error occurred during signup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavigationBar hideNavItems />
      {!data?.user && (
        <div className="container mx-auto min-h-[calc(100vh-3rem)] flex items-center justify-center bg-[#f1f1db]">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center text-amber-900 mb-6">
              Create Account
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <Toaster position="bottom-right" />
              <button
                onClick={() => {
                  handleSignUp();
                  toast.success("Account created successfully");
                }}
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </button>
              <div className="text-center text-sm mt-4">
                Already have an account?{" "}
                <Link href="/log-in" className="text-blue-600 hover:underline">
                  Log In
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
