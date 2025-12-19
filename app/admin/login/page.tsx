"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: any) {
    e.preventDefault();

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      window.location.href = "/admin/dashboard";
    } else {
      alert("Invalid email or password");
    }
  }

  return (
    <div className="min-h-screen bg-[#F2EFE7] flex flex-col items-center justify-center">
      
      <div className="text-center mb-6">
        <div className="text-4xl">⚙️</div>
        <h1 className="text-2xl font-semibold text-[#004B4B] mt-2">
          Admin Portal
        </h1>
        <p className="text-sm text-gray-600">
          Sign in to access the admin dashboard
        </p>
      </div>

      {/* CARD */}
      <form
        onSubmit={handleLogin}
        className="bg-white border shadow-md rounded-xl px-10 py-8 w-[380px]"
      >
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-5 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B4B]"
          placeholder="admin@tutorsewa.com"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B4B]"
          placeholder="********"
        />

        <button
          type="submit"
          className="w-full bg-[#1d7474] hover:bg-[#145d5d] text-white py-2 rounded-md transition font-medium"
        >
          Sign In to Admin Panel
        </button>
      </form>

      <p className="mt-8 text-gray-500 text-sm">
        ©2025 TutorSewa. All rights reserved
      </p>
    </div>
  );
}
