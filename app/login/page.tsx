// "use client";

// import { useState } from "react";
// import { signIn } from "next-auth/react";
// import toast, { Toaster } from "react-hot-toast";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     const res = await signIn("credentials", {
//       redirect: false,
//       email: form.email,
//       password: form.password,
//     });

//     setLoading(false);

//     // if (res?.error) return toast.error("Invalid email or password");

//     if (res?.error) {
//   // Show backend error
//   return toast.error(res.error);
// }

//     toast.success("Login successful!");
//     router.push("/dashboard");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#F2EFE7]">
//       <Toaster position="top-right" />

//       <div className="bg-white shadow-md rounded-lg p-8 w-[350px] border border-[#48A6A7]/40">
//         <h1 className="text-2xl font-bold text-[#006A6A] text-center mb-6">
//           Welcome Back!
//         </h1>

//         <form onSubmit={handleLogin} className="space-y-4">
//           <input
//             type="email"
//             placeholder="Enter your email"
//             className="w-full border rounded-md p-2 focus:ring-[#48A6A7]"
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//           />

//           <input
//             type="password"
//             placeholder="Enter your password"
//             className="w-full border rounded-md p-2 focus:ring-[#48A6A7]"
//             onChange={(e) => setForm({ ...form, password: e.target.value })}
//           />

//           <button type="submit" disabled={loading}
//             className="w-full bg-[#006A6A] text-white py-2 rounded-md hover:bg-[#005454] transition">
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <div className="text-center mt-4 text-gray-600 text-sm">Or continue with</div>

//         <button
//           onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
//           className="w-full border rounded-md py-2 mt-3 flex justify-center items-center gap-2 hover:bg-gray-50 transition"
//         >
//           <Image src="/google.svg" alt="Google" width={20} height={20} />
//           Google
//         </button>

//         <p className="text-xs text-center text-gray-500 mt-4">
//           By logging in, you agree to our{" "}
//           <a href="#" className="underline">Terms of Service</a> and{" "}
//           <a href="#" className="underline">Privacy Policy</a>.
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // ⛔ Hide NextAuth white popup & show toast instead
  useEffect(() => {
    const error = searchParams.get("error");

    if (error) {
      toast.error("Please verify your email before logging in.");

      // remove error from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (res?.error) {
      return toast.error(res.error);
    }

    toast.success("Login successful!");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2EFE7]">
      <Toaster position="top-right" />

      {/* Hide NextAuth white popup only on login page */}
      <style jsx global>{`
        div[role="alert"] {
          display: none !important;
        }
      `}</style>

      <div className="bg-white shadow-md rounded-lg p-8 w-[350px] border border-[#48A6A7]/40">
        <h1 className="text-2xl font-bold text-[#006A6A] text-center mb-6">
          Welcome Back!
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border rounded-md p-2"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full border rounded-md p-2"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#006A6A] text-white py-2 rounded-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-4 text-gray-600 text-sm">Or continue with</div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full border rounded-md py-2 mt-3 flex justify-center items-center gap-2 hover:bg-gray-50 transition"
        >
          <Image src="/google.svg" alt="Google" width={20} height={20} />
          Google
        </button>

        <p className="text-xs text-center text-gray-500 mt-4">
          By logging in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
