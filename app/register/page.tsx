"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    grade: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) return toast.error(data.error);
    toast.success("Registration successful!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2EFE7]">
      <Toaster position="top-right" />
      <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row md:w-[900px]">
        {/* LEFT SIDE: FORM */}
        <div className="flex-1 p-8">
          <h3 className="text-[#48A6A7] font-semibold">Join TutorSewa!</h3>
          <h1 className="text-2xl font-bold text-[#006A6A] mb-6">
            Create Your Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#48A6A7]"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#48A6A7]"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#48A6A7]"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#48A6A7]"
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#48A6A7]"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              type="text"
              placeholder="Grade/Level"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#48A6A7]"
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#006A6A] text-white py-2 rounded-md hover:bg-[#005454] transition"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="text-center mt-4 text-gray-600 text-sm">Or continue with</div>

          <button
            type="button"
            onClick={() => signIn("google")}
            className="w-full border rounded-md py-2 mt-3 flex justify-center items-center gap-2 hover:bg-gray-50 transition"
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            Google
          </button>

          <p className="text-xs text-center text-gray-500 mt-4">
            By signing up, you agree to our{" "}
            <a href="#" className="underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>.
          </p>
        </div>

        {/* RIGHT SIDE: INFO BOX */}
        <div className="hidden md:flex flex-col justify-center bg-[#48A6A7]/20 w-1/2 p-8 text-[#004B4B]">
          <Image
            src="/online-class.jpg"
            alt="Online Learning"
            width={300}
            height={180}
            className="rounded-md mx-auto mb-4"
          />
          <h4 className="font-semibold text-[#006A6A] text-center">
            Start Your Learning Journey
          </h4>
          <ul className="text-sm mt-3 space-y-1 mx-auto">
            <li>✅ Access to 500+ expert tutors</li>
            <li>✅ Flexible scheduling</li>
            <li>✅ Secure payment system</li>
            <li>✅ 24/7 customer support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
