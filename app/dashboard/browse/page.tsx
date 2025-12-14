// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { Search } from "lucide-react";

// interface Tutor {
//   id: string;
//   name: string;
//   subjects: string[];
//   photo?: string;
//   bio?: string;
//   experience?: string | null;
//   rate?: number;
//   rating?: number | null;
//   reviewCount?: number;
// }

// export default function BrowseTutors() {
//   const [tutors, setTutors] = useState<Tutor[]>([]);
//   const [filtered, setFiltered] = useState<Tutor[]>([]);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     fetch("/api/tutor/list")
//       .then((res) => res.json())
//       .then((data) => {
//         setTutors(data.tutors || []);
//         setFiltered(data.tutors || []);
//       });
//   }, []);

//   // Search filter
//   useEffect(() => {
//     let list = [...tutors];

//     if (search.trim()) {
//       list = list.filter((t) =>
//         t.name.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     setFiltered(list);
//   }, [search, tutors]);

//   return (
//     <div className="p-6">

//       <h1 className="text-2xl font-bold text-[#004B4B] mb-6">
//         Browse Tutors
//       </h1>

//       {/* Search Box */}
//       <div className="flex items-center gap-2 mb-6 w-full max-w-md bg-white border rounded-xl px-4 py-2 shadow-sm">
//         <Search size={18} className="text-gray-500" />
//         <input
//           type="text"
//           placeholder="Search tutors by name..."
//           className="w-full outline-none text-sm"
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {/* Tutor Cards Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {filtered.map((tutor) => (
//           <div
//             key={tutor.id}
//             className="bg-white border rounded-xl shadow-sm p-5 flex gap-4 hover:shadow-md transition"
//           >
//             {/* Tutor Photo */}
//             <img
//               src={tutor.photo || "/default-user.png"}
//               alt={tutor.name}
//               className="w-16 h-16 rounded-full object-cover border"
//             />

//             <div className="flex-1">
//               {/* Name */}
//               <h2 className="text-lg font-semibold text-[#004B4B]">
//                 {tutor.name}
//               </h2>

//               {/* Subjects */}
//               <p className="text-sm text-gray-500">
//                 {tutor.subjects.length ? tutor.subjects.join(", ") : "No subjects listed"}
//               </p>

//               {/* Rating */}
//               <div className="flex items-center gap-1 mt-1 text-sm text-yellow-600">
//                 ⭐ {tutor.rating ?? "4.5"}{" "}
//                 <span className="text-gray-500">
//                   ({tutor.reviewCount ?? 12} reviews)
//                 </span>
//               </div>

//               {/* Bio */}
//               <p className="text-sm text-gray-600 mt-2 line-clamp-2">
//                 {tutor.bio ?? "Experienced tutor passionate about teaching."}
//               </p>

//               {/* Rate + Button */}
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-[#004B4B] font-semibold">
//                   Rs {tutor.rate ?? 1000}/hr
//                 </span>

//                 <Link href={`/dashboard/tutor/${tutor.id}`}>
//                   <button className="px-4 py-2 rounded-lg border border-[#48A6A7] text-[#006A6A] hover:bg-[#E6F9F5] transition">
//                     View Profile
//                   </button>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

/* ======================
   TYPES
====================== */
interface Tutor {
  id: string;
  name: string;
  subjects: string[];
  photo?: string | null;
  bio?: string | null;
  experience?: string | null;
  rate?: number | null;
  avgRating?: string | null;
  reviewCount?: number;
}

/* ======================
   COMPONENT
====================== */
export default function BrowseTutors() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [filtered, setFiltered] = useState<Tutor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ======================
     FETCH TUTORS
  ====================== */
  useEffect(() => {
    async function loadTutors() {
      try {
        const res = await fetch("/api/tutor/list");
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to load tutors");

        setTutors(data.tutors || []);
        setFiltered(data.tutors || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTutors();
  }, []);

  /* ======================
     SEARCH FILTER
  ====================== */
  useEffect(() => {
    let list = [...tutors];

    if (search.trim()) {
      list = list.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(list);
  }, [search, tutors]);

  /* ======================
     STATES
  ====================== */
  if (loading)
    return <p className="p-6 text-[#004B4B]">Loading tutors...</p>;

  if (error)
    return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold text-[#004B4B] mb-6">
        Browse Tutors
      </h1>

      {/* SEARCH */}
      <div className="flex items-center gap-2 mb-6 w-full max-w-md bg-white border rounded-xl px-4 py-2 shadow-sm">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search tutors by name..."
          className="w-full outline-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* EMPTY */}
      {filtered.length === 0 && (
        <p className="text-gray-600">No tutors found.</p>
      )}

      {/* TUTOR GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((tutor) => (
          <div
            key={tutor.id}
            className="bg-white border rounded-xl shadow-sm p-5 flex gap-4 hover:shadow-md transition"
          >
            {/* PHOTO */}
            {tutor.photo ? (
              <img
                src={tutor.photo}
                alt={tutor.name}
                className="w-16 h-16 rounded-full object-cover border"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#E6F9F5] flex items-center justify-center text-xl font-bold text-[#004B4B]">
                {tutor.name.charAt(0)}
              </div>
            )}

            <div className="flex-1">
              {/* NAME */}
              <h2 className="text-lg font-semibold text-[#004B4B]">
                {tutor.name}
              </h2>

              {/* SUBJECTS */}
              <p className="text-sm text-gray-500">
                {tutor.subjects.length
                  ? tutor.subjects.join(", ")
                  : "No subjects listed"}
              </p>

              {/* RATING */}
              <div className="flex items-center gap-1 mt-1 text-sm text-yellow-600">
                ⭐ {tutor.avgRating ?? "No ratings"}
                <span className="text-gray-500">
                  ({tutor.reviewCount ?? 0} reviews)
                </span>
              </div>

              {/* BIO */}
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {tutor.bio ?? "Experienced tutor passionate about teaching."}
              </p>

              {/* RATE + PROFILE */}
              <div className="flex justify-between items-center mt-4">
                <span className="text-[#004B4B] font-semibold">
                  Rs {tutor.rate ?? "—"}/hr
                </span>

                <Link href={`/dashboard/tutor/${tutor.id}`}>
                  <button className="px-4 py-2 rounded-lg border border-[#48A6A7] text-[#006A6A] hover:bg-[#E6F9F5] transition">
                    View Profile
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
