// "use client";
// import { useState } from "react";

// export default function TutorLogin() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

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

//     // Login successful
//     window.location.href = "/tutor/dashboard";
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-[#F2EFE7]">
//       <div className="bg-white p-6 rounded-xl shadow-md w-96 border">

//         <h2 className="text-xl font-semibold text-center mb-4 text-[#004B4B]">
//           Tutor Login
//         </h2>

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

//           <input
//             className="input mb-3 w-full"
//             type="password"
//             placeholder="Enter Password"
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//           <button
//             type="submit"
//             className="bg-[#006A6A] w-full text-white py-2 rounded-md hover:bg-[#005454] transition"
//           >
//             Login
//           </button>

//           <p className="text-center text-sm mt-4">
//             Not registered?{" "}
//             <a className="text-[#006A6A]" href="/tutor/register">Register here</a>
//           </p>

//         </form>
//       </div>
//     </div>
//   );
// }


"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // ✅ added

export default function TutorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ added
  const [error, setError] = useState("");

  const loginTutor = async (e: any) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/tutor/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    window.location.href = "/tutor/dashboard";
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#F2EFE7]">
      <div className="bg-white p-6 rounded-xl shadow-md w-96 border">

        <h2 className="text-xl font-semibold text-center mb-4 text-[#004B4B]">
          Tutor Login
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={loginTutor}>

          <input
            className="input mb-3 w-full"
            type="email"
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* 🔥 UPDATED PASSWORD FIELD */}
          <div className="relative mb-3">
            <input
              className="input w-full pr-10"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
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

          <button
            type="submit"
            className="bg-[#006A6A] w-full text-white py-2 rounded-md hover:bg-[#005454] transition"
          >
            Login
          </button>

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
