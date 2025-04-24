"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const NavigationBar = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto px-6 py-4 bg-amber-50 rounded-xl shadow-sm">
      <div className="flex justify-between items-center border-b-2 border-amber-800 pb-4 mb-4">
        <Link
          href="/"
          className="text-2xl font-extrabold text-amber-900 tracking-wide"
        >
          Hacker News
        </Link>
        <button
          onClick={() => router.push("/auth/sign-in")}
          className="bg-amber-900 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition"
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;
