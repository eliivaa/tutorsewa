// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react"; // ⭐ ADD THIS

// export default function CompleteProfile() {
//   const router = useRouter();
//   const { update } = useSession(); // ⭐ ADD THIS

//   const [phone, setPhone] = useState("");
//   const [grade, setGrade] = useState("");
//   const [loading, setLoading] = useState(false);

//   const submit = async () => {
//     setLoading(true);

//     const res = await fetch("/api/profile/update", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ phone, grade }),
//     });

//     if (res.ok) {
//       // 🔥 REAL FIX (NextAuth session refresh)
//       await update();

//       // ✅ Now middleware will allow dashboard
//       router.replace("/dashboard");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-6 rounded shadow-md w-96">
//         <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>

//         <input
//           className="border p-2 w-full mb-3"
//           placeholder="Phone Number"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//         />

//         <input
//           className="border p-2 w-full mb-3"
//           placeholder="Grade"
//           value={grade}
//           onChange={(e) => setGrade(e.target.value)}
//         />

//         <button
//           onClick={submit}
//           disabled={loading}
//           className="bg-green-600 text-white w-full py-2 rounded disabled:opacity-50"
//         >
//           {loading ? "Saving..." : "Save"}
//         </button>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import animationData from "@/public/complete.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function CompleteProfile() {

  const router = useRouter();
  const { update } = useSession();

  const [phone, setPhone] = useState("");
  const [grade, setGrade] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nepalPhoneRegex =
    /^(984|985|986|974|975|980|981|982|970|961|962)[0-9]{7}$/;

  const submit = async () => {

    if (!nepalPhoneRegex.test(phone)) {
      setError(
        "Enter a valid Nepal mobile number (984, 985, 986, 974, 975, 980, 981, 982, 970, 961, 962)"
      );
      return;
    }

    if (!grade.trim()) {
      setError("Please enter your grade or level.");
      return;
    }

    setError("");
    setLoading(true);

    const res = await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, grade }),
    });

    if (res.ok) {

      await update();   // refresh NextAuth session

      toast.success("Profile updated successfully!");

      router.replace("/dashboard");
    } else {
      toast.error("Failed to update profile");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2EFE7] px-4">

      <Toaster position="top-right" />

      <div className="bg-white shadow-xl rounded-xl overflow-hidden flex flex-col md:flex-row md:w-[850px] border border-[#48A6A7]/30">

        {/* LEFT FORM */}
        <div className="flex-1 p-8">

          <h1 className="text-2xl font-bold text-[#006A6A] mb-6 text-center">
            Complete Your Profile
          </h1>

          <p className="text-sm text-gray-600 text-center mb-6">
            Please add your phone number and grade to continue using TutorSewa.
          </p>

          <div className="space-y-4">

            {/* PHONE */}
            <div>
              <input
                type="tel"
                placeholder="98XXXXXXXX"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#48A6A7]"
              />

              <p className="text-xs text-gray-500 mt-1">
                Valid prefixes: 984, 985, 986, 974, 975, 980, 981, 982, 970, 961, 962
              </p>
            </div>

            {/* GRADE */}
            <input
              type="text"
              placeholder="Grade / Level (ex: BIT, 11, 12)"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#48A6A7]"
            />

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            {/* SUBMIT */}
            <button
              onClick={submit}
              disabled={loading}
              className="w-full bg-[#006A6A] text-white py-2 rounded-md hover:bg-[#005454] transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save & Continue"}
            </button>

          </div>
        </div>

        {/* RIGHT ANIMATION */}
        <div className="hidden md:flex flex-col justify-center items-center bg-[#48A6A7]/10 w-1/2 p-8">

          <Lottie
            animationData={animationData}
            loop
            className="w-64"
          />

          <h4 className="text-[#006A6A] font-semibold mt-4 text-center">
            One Last Step
          </h4>

          <p className="text-sm text-gray-600 text-center mt-2">
            Completing your profile helps tutors and students connect better.
          </p>

        </div>

      </div>

    </div>
  );
}
