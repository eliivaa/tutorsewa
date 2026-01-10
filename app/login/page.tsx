// "use client";

// import { useState, useEffect } from "react";
// import { signIn } from "next-auth/react";
// import toast, { Toaster } from "react-hot-toast";
// import Image from "next/image";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function LoginPage() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // 🔥 Remove NextAuth default error message
//   useEffect(() => {
//     if (searchParams.get("error")) {
//       router.replace("/login"); // remove ?error= from URL
//     }
//   }, [searchParams, router]);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     const res = await signIn("credentials", {
//       redirect: false,
//       email: form.email,
//       password: form.password,
//     });

//     setLoading(false);

//     if (res?.error) {
//       toast.error(res.error); // ✅ green toast only
//       return;
//     }

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
//             className="w-full border rounded-md p-2"
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//           />

//           <input
//             type="password"
//             placeholder="Enter your password"
//             className="w-full border rounded-md p-2"
//             onChange={(e) => setForm({ ...form, password: e.target.value })}
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[#006A6A] text-white py-2 rounded-md"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <div className="text-center mt-4 text-gray-600 text-sm">
//           Or continue with
//         </div>

//         <button
//           onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
//           className="w-full border rounded-md py-2 mt-3 flex justify-center items-center gap-2"
//         >
//           <Image src="/google.svg" alt="Google" width={20} height={20} />
//           Google
//         </button>
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

  // 🔥 Remove NextAuth default error message
  useEffect(() => {
    if (searchParams.get("error")) {
      router.replace("/login"); // remove ?error= from URL
    }
  }, [searchParams, router]);

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
      toast.error(res.error);
      return;
    }

    toast.success("Login successful!");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2EFE7]">
      <Toaster position="top-right" />

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

          {/* 🔐 Forgot Password Link */}
          <p className="text-sm text-right">
            <a href="/forgot-password" className="text-[#006A6A] hover:underline">
              Forgot password?
            </a>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#006A6A] text-white py-2 rounded-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-4 text-gray-600 text-sm">
          Or continue with
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full border rounded-md py-2 mt-3 flex justify-center items-center gap-2"
        >
          <Image src="/google.svg" alt="Google" width={20} height={20} />
          Google
        </button>
      </div>
    </div>
  );
}
