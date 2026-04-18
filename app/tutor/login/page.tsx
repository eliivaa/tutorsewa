"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function TutorLogin() {

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

/* ================= GOOGLE LOGIN ================= */
const handleGoogleLogin = async () => {
  await signIn(
    "google",
    {
      callbackUrl: "http://localhost:3000/api/tutor/google-login"
    },
    { prompt: "select_account" }
  );
};

/* ================= EMAIL LOGIN ================= */

const loginTutor = async (e: React.FormEvent) => {


e.preventDefault();
setError("");
setLoading(true);

try {

  const res = await fetch("/api/tutor/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    setError(data.error || "Login failed");
    setLoading(false);
    return;
  }

  window.location.href = "/tutor/dashboard";

} catch {

  setError("Something went wrong. Please try again.");
  setLoading(false);

}


};

return (


<div className="flex justify-center items-center h-screen bg-[#F2EFE7]">

  <div className="bg-white p-6 rounded-xl shadow-md w-96 border">

    <h2 className="text-xl font-semibold text-center mb-4 text-[#004B4B]">
      Tutor Login
    </h2>

    {/* GOOGLE LOGIN */}

    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full border rounded-md py-2 flex justify-center items-center gap-2 hover:bg-gray-50 mb-4"
    >
      <Image src="/google.svg" alt="Google" width={20} height={20} />
      Continue with Google
    </button>

    {/* DIVIDER */}

    <div className="flex items-center gap-2 mb-4">
      <div className="flex-1 h-px bg-gray-300"></div>
      <span className="text-xs text-gray-500">OR</span>
      <div className="flex-1 h-px bg-gray-300"></div>
    </div>

    {error && (
      <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded mb-3 text-sm">
        {error}
      </div>
    )}

    <form onSubmit={loginTutor}>

      {/* EMAIL */}

      <input
        className="input mb-3 w-full"
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {/* PASSWORD */}

      <div className="relative mb-3">

        <input
          className="input w-full pr-10"
          type={showPassword ? "text" : "password"}
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>

      </div>

      {/* LOGIN BUTTON */}

      <button
        type="submit"
        disabled={loading}
        className="bg-[#006A6A] w-full text-white py-2 rounded-md hover:bg-[#005454] transition"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {/* REGISTER LINK */}

      <p className="text-center text-sm mt-4">
        Not registered?{" "}
        <a className="text-[#006A6A]" href="/tutor/register">
          Register here
        </a>
      </p>

    </form>

  </div>

</div>


);

}


// "use client";

// import { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import { signIn } from "next-auth/react";
// import Image from "next/image";

// export default function TutorLogin() {

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");

//   /* ================= NORMAL LOGIN ================= */

//   const loginTutor = async (e: any) => {
//     e.preventDefault();
//     setError("");

//     const res = await fetch("/api/tutor/login", {
//       method: "POST",
//       body: JSON.stringify({ email, password }),
//       headers: { "Content-Type": "application/json" },
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       setError(data.error);
//       return;
//     }

//     window.location.href = "/tutor/dashboard";
//   };

//   /* ================= GOOGLE LOGIN ================= */

//   const handleGoogleLogin = async () => {

//     await signIn(
//       "google",
//       {
//         callbackUrl: "/tutor/dashboard",
//       },
//       { prompt: "select_account" }
//     );

//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-[#F2EFE7]">

//       <div className="bg-white p-6 rounded-xl shadow-md w-96 border">

//         <h2 className="text-xl font-semibold text-center mb-4 text-[#004B4B]">
//           Tutor Login
//         </h2>

//         {/* GOOGLE BUTTON */}

//         <button
//           type="button"
//           onClick={handleGoogleLogin}
//           className="w-full border rounded-md py-2 flex justify-center items-center gap-2 hover:bg-gray-50 mb-4"
//         >
//           <Image src="/google.svg" alt="Google" width={20} height={20} />
//           Continue with Google
//         </button>

//         {/* DIVIDER */}

//         <div className="flex items-center gap-2 mb-4">
//           <div className="flex-1 h-px bg-gray-300"></div>
//           <span className="text-xs text-gray-500">OR</span>
//           <div className="flex-1 h-px bg-gray-300"></div>
//         </div>

//         {error && (
//           <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded mb-3 text-sm">
//             {error}
//           </div>
//         )}

//         <form onSubmit={loginTutor}>

//           <input
//             className="input mb-3 w-full"
//             type="email"
//             placeholder="Enter Email"
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           {/* PASSWORD FIELD */}

//           <div className="relative mb-3">

//             <input
//               className="input w-full pr-10"
//               type={showPassword ? "text" : "password"}
//               placeholder="Enter Password"
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />

//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//             >
//               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>

//           </div>

//           <button
//             type="submit"
//             className="bg-[#006A6A] w-full text-white py-2 rounded-md hover:bg-[#005454] transition"
//           >
//             Login
//           </button>

//           <p className="text-center text-sm mt-4">
//             Not registered?{" "}
//             <a className="text-[#006A6A]" href="/tutor/register">
//               Register here
//             </a>
//           </p>

//         </form>

//       </div>

//     </div>
//   );
// }