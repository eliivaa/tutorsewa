// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function CompleteProfile() {
//   const router = useRouter();
//   const [phone, setPhone] = useState("");
//   const [grade, setGrade] = useState("");
//   const [loading, setLoading] = useState(false);

//   const submit = async () => {
//     setLoading(true);

//     const res = await fetch("/api/profile/update-missing", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ phone, grade }),
//     });

//     if (res.ok) {
//       // 🔥 force NextAuth to refresh JWT
//       await fetch("/api/auth/session");
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
//           onChange={(e) => setPhone(e.target.value)}
//         />

//         <input
//           className="border p-2 w-full mb-3"
//           placeholder="Grade"
//           onChange={(e) => setGrade(e.target.value)}
//         />

//         <button
//           onClick={submit}
//           className="bg-green-600 text-white w-full py-2 rounded"
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

export default function CompleteProfile() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);

    const res = await fetch("/api/profile/update-missing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, grade }),
    });

    if (res.ok) {
      // 🔥 THIS IS THE KEY LINE
      router.refresh();          // forces JWT refresh
      router.replace("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Phone Number"
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Grade"
          onChange={(e) => setGrade(e.target.value)}
        />

        <button
          onClick={submit}
          className="bg-green-600 text-white w-full py-2 rounded"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
