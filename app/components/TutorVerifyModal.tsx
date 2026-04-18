"use client";

import { useState } from "react";

export default function TutorVerifyModal({ email }: any) {

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function verify() {

    setLoading(true);

    const res = await fetch("/api/tutor/verify-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();

    setLoading(false);

    if (data.success) {
      alert("Email verified successfully");
      window.location.href = "/tutor/login";
    } else {
      alert(data.error || "Invalid verification code");
    }

  }

  async function resendCode() {

    setResending(true);

    const res = await fetch("/api/tutor/resend-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    setResending(false);

    if (data.success) {
      alert("New verification code sent to your email.");
    } else {
      alert(data.error || "Failed to resend code");
    }

  }

  return (

    <div className="bg-white p-6 rounded-xl w-96 text-center">

      <h2 className="text-xl font-bold mb-4 text-[#006A6A]">
        Verify Tutor Email
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        Enter the 6 digit code sent to your email
      </p>

      <input
        className="border p-2 w-full mb-4 text-center tracking-widest"
        placeholder="Enter OTP sent to your mail."
        maxLength={6}
        value={code}
        onChange={(e)=>setCode(e.target.value)}
      />

      <button
        onClick={verify}
        disabled={loading}
        className="bg-[#006A6A] text-white w-full py-2 rounded"
      >
        {loading ? "Verifying..." : "Verify Code"}
      </button>

      <button
        onClick={resendCode}
        disabled={resending}
        className="text-sm text-[#006A6A] mt-3 underline"
      >
        {resending ? "Sending..." : "Resend Code"}
      </button>

    </div>

  );

}