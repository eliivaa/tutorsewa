"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [password, setPassword] = useState("");

  const submit = async () => {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error);
      return;
    }

    toast.success("Password updated");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2EFE7]">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <input
          type="password"
          className="input w-full mb-3"
          placeholder="New password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={submit} className="bg-[#006A6A] w-full text-white py-2 rounded">
          Reset Password
        </button>
      </div>
    </div>
  );
}
