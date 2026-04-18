// "use client";

// import { useState, useEffect } from "react";
// import { signIn, signOut } from "next-auth/react";
// import toast, { Toaster } from "react-hot-toast";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import dynamic from "next/dynamic";
// import animationData from "@/public/secure-login.json";

// const Lottie = dynamic(() => import("lottie-react"), {
//   ssr: false,
// });

// export default function LoginPage() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);

//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // Remove NextAuth default error message
//   useEffect(() => {
//     if (searchParams?.get("error")) {
//       router.replace("/login");
//     }
//   }, [searchParams, router]);

// const handleLogin = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setLoading(true);

//   const res = await signIn("credentials", {
//     redirect: false,
//     email: form.email,
//     password: form.password,
//   });

//   setLoading(false);

//   if (res?.error) {
//     // 🚨 HANDLE SUSPENDED USER
//    if (res?.error?.toLowerCase().includes("suspended")) {
//   router.push("/account-suspended");
//   return;
// }

//     // other errors
//     toast.error(res.error || "Invalid email or password");
//     return;
//   }

//   toast.success("Login successful!");
//   router.push("/dashboard");
// };

//   // FIX: Always clear old session before Google login
//  const handleGoogleLogin = async () => {
//   await signOut({ redirect: false });

//   await signIn("google", {
//     callbackUrl: "/dashboard",
//     role: "student",
//   },
//   { prompt: "select_account" }
// );
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#F2EFE7] px-4">
//       <Toaster position="top-right" />

//       <div className="bg-white shadow-xl rounded-xl overflow-hidden flex flex-col md:flex-row md:w-[850px] border border-[#48A6A7]/30">

//         {/* LEFT SIDE */}
//         <div className="flex-1 p-8">
//           <h1 className="text-2xl font-bold text-[#006A6A] text-center mb-6">
//             Welcome Back!
//           </h1>

//           <form onSubmit={handleLogin} className="space-y-4">

//             <input
//               type="email"
//               placeholder="Enter your email"
//               className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#48A6A7]"
//               onChange={(e) =>
//                 setForm({ ...form, email: e.target.value })
//               }
//               required
//             />

//             <input
//               type="password"
//               placeholder="Enter your password"
//               className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#48A6A7]"
//               onChange={(e) =>
//                 setForm({ ...form, password: e.target.value })
//               }
//               required
//             />

//             <p className="text-sm text-right">
//               <Link
//                 href="/forgot-password"
//                 className="text-[#006A6A] hover:underline"
//               >
//                 Forgot password?
//               </Link>
//             </p>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-[#006A6A] text-white py-2 rounded-md hover:bg-[#005454] transition"
//             >
//               {loading ? "Logging in..." : "Login"}
//             </button>
//           </form>

//           <p className="text-sm text-center mt-4">
//             Don’t have an account?{" "}
//             <Link
//               href="/register"
//               className="text-[#006A6A] font-medium hover:underline"
//             >
//               Register
//             </Link>
//           </p>

//           <div className="text-center mt-5 text-gray-500 text-sm">
//             Or continue with
//           </div>

//           {/* Google Login */}
//           <button
//             onClick={handleGoogleLogin}
//             className="w-full border rounded-md py-2 mt-3 flex justify-center items-center gap-2 hover:bg-gray-50 transition"
//           >
//             <Image src="/google.svg" alt="Google" width={20} height={20} />
//             Google
//           </button>
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="hidden md:flex flex-col justify-center items-center bg-[#48A6A7]/10 w-1/2 p-8">
//           <Lottie animationData={animationData} loop className="w-64" />

//           <h4 className="text-[#006A6A] font-semibold mt-4 text-center">
//             Secure & Protected Login
//           </h4>

//           <p className="text-sm text-gray-600 text-center mt-2">
//             Your data is encrypted and fully protected.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }



// after suspend


"use client";

import { useState, useEffect } from "react";
import { signIn, signOut } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import animationData from "@/public/secure-login.json";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
  const error = searchParams?.get("error");

  if (!error) return;

  // 🚨 Handle suspended (Google login case)
  if (error === "SUSPENDED") {
    router.push("/account-suspended");
    return;
  }

  // fallback (NextAuth may send this)
  if (error === "AccessDenied") {
    router.push("/account-suspended");
    return;
  }

  // other errors
  toast.error("Login failed. Please try again.");

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
    // 🚨 HANDLE SUSPENDED USER
   if (res?.error?.toLowerCase().includes("suspended")) {
  router.push("/account-suspended");
  return;
}

    // other errors
    toast.error(res.error || "Invalid email or password");
    return;
  }

  toast.success("Login successful!");
  router.push("/dashboard");
};

  // FIX: Always clear old session before Google login
 const handleGoogleLogin = async () => {
  await signOut({ redirect: false });

  await signIn("google", {
    callbackUrl: "/dashboard",
    role: "student",
  },
  { prompt: "select_account" }
);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2EFE7] px-4">
      <Toaster position="top-right" />

      <div className="bg-white shadow-xl rounded-xl overflow-hidden flex flex-col md:flex-row md:w-[850px] border border-[#48A6A7]/30">

        {/* LEFT SIDE */}
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-[#006A6A] text-center mb-6">
            Welcome Back!
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#48A6A7]"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#48A6A7]"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />

            <p className="text-sm text-right">
              <Link
                href="/forgot-password"
                className="text-[#006A6A] hover:underline"
              >
                Forgot password?
              </Link>
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#006A6A] text-white py-2 rounded-md hover:bg-[#005454] transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-[#006A6A] font-medium hover:underline"
            >
              Register
            </Link>
          </p>

          <div className="text-center mt-5 text-gray-500 text-sm">
            Or continue with
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full border rounded-md py-2 mt-3 flex justify-center items-center gap-2 hover:bg-gray-50 transition"
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            Google
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex flex-col justify-center items-center bg-[#48A6A7]/10 w-1/2 p-8">
          <Lottie animationData={animationData} loop className="w-64" />

          <h4 className="text-[#006A6A] font-semibold mt-4 text-center">
            Secure & Protected Login
          </h4>

          <p className="text-sm text-gray-600 text-center mt-2">
            Your data is encrypted and fully protected.
          </p>
        </div>
      </div>
    </div>
  );
}
