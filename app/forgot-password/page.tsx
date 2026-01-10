"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submit = async () => {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      toast.success("If the email exists, reset link sent.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2EFE7]">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        <input
          className="input w-full mb-3"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={submit} className="bg-[#006A6A] w-full text-white py-2 rounded">
          Send Reset Link
        </button>
      </div>
    </div>
  );
}
