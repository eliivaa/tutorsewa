"use client";

import { useState } from "react";

interface VerifyCodeModalProps {
  email: string;
}

export default function VerifyCodeModal({ email }: VerifyCodeModalProps) {

  const [code, setCode] = useState("");

  async function verify() {

    const res = await fetch("/api/verify-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Email verified successfully. Please login.");
      window.location.href = "/login";
    } else {
      alert(data.error || "Invalid code");
    }

  }

  async function resendCode() {

    const res = await fetch("/api/resend-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.success) {
      alert("New verification code sent to your email.");
    } else {
      alert(data.error || "Failed to resend code.");
    }

  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-[380px] text-center">

      <h2 className="text-2xl font-bold text-[#006A6A] mb-2">
        Verify Your Email
      </h2>

      <p className="text-gray-600 text-sm mb-5">
        Enter the verification code sent to your email
      </p>

      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter 6 digit code"
        maxLength={6}
        className="border p-2 w-full rounded-md mb-4 text-center tracking-widest"
      />

      <button
        onClick={verify}
        className="bg-[#006A6A] text-white px-4 py-2 rounded-md w-full"
      >
        Verify Code
      </button>

      <button
        onClick={resendCode}
        className="text-sm text-[#006A6A] mt-3 underline"
      >
        Resend Code
      </button>

    </div>
  );
}