// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { Search } from "lucide-react";

// /* ======================
//    TYPES
// ====================== */
// interface Tutor {
//   id: string;
//   name: string;
//   subjects: string[];
//   photo?: string | null;
//   bio?: string | null;
//   experience?: string | null;
//   rate?: number | null;
//   avgRating?: string | null;
//   reviewCount?: number;
// }

// /* ======================
//    COMPONENT
// ====================== */
// export default function BrowseTutors() {
//   const [tutors, setTutors] = useState<Tutor[]>([]);
//   const [filtered, setFiltered] = useState<Tutor[]>([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   /* ======================
//      FETCH TUTORS
//   ====================== */
//   useEffect(() => {
//     async function loadTutors() {
//       try {
//         const res = await fetch("/api/tutor/list");
//         const data = await res.json();

//         if (!res.ok) throw new Error(data.error || "Failed to load tutors");

//         setTutors(data.tutors || []);
//         setFiltered(data.tutors || []);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadTutors();
//   }, []);

//   /* ======================
//      SEARCH FILTER (NAME + SUBJECT)
//   ====================== */
//   useEffect(() => {
//     let list = [...tutors];

//     if (search.trim()) {
//       const q = search.toLowerCase();

//       list = list.filter((t) => {
//         const nameMatch = t.name.toLowerCase().includes(q);

//         const subjectMatch = t.subjects.some((s) =>
//           s.split("|")[0].toLowerCase().includes(q)
//         );

//         return nameMatch || subjectMatch;
//       });
//     }

//     setFiltered(list);
//   }, [search, tutors]);

//   /* ======================
//      STATES
//   ====================== */
//   if (loading)
//     return <p className="p-6 text-[#004B4B]">Loading tutors...</p>;

//   if (error)
//     return <p className="p-6 text-red-600">{error}</p>;

//   return (
//     <div className="max-w-6xl mx-auto px-6 pb-10">
//       <h1 className="text-2xl font-bold text-[#004B4B] mb-6">
//         Browse Tutors
//       </h1>

//       {/* SEARCH */}
//       <div className="flex items-center gap-3 mb-6">
//         <div className="flex items-center gap-2 w-full max-w-sm bg-white border rounded-lg px-4 py-2 shadow-sm">
//           <Search size={18} className="text-gray-500" />
//           <input
//             type="text"
//             placeholder="Search by tutor or subject"
//             className="w-full outline-none text-sm"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         {/* placeholders (unchanged) */}
//         <select className="border rounded-md px-3 py-2 text-sm bg-white">
//           <option>Subject</option>
//         </select>

//         <select className="border rounded-md px-3 py-2 text-sm bg-white">
//           <option>Level</option>
//         </select>
//       </div>

//       {/* EMPTY STATE */}
//       {filtered.length === 0 && (
//         <p className="text-gray-600">No tutors found.</p>
//       )}

//       {/* GRID */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filtered.map((tutor) => (
//           <div
//             key={tutor.id}
//             className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
//           >
//             {/* TOP */}
//             <div className="flex gap-3">
//               {tutor.photo ? (
//                 <img
//                   src={tutor.photo}
//                   alt={tutor.name}
//                   className="w-12 h-12 rounded-full object-cover border"
//                 />
//               ) : (
//                 <div className="w-12 h-12 rounded-full bg-[#E6F9F5] flex items-center justify-center font-bold text-[#004B4B]">
//                   {tutor.name.charAt(0)}
//                 </div>
//               )}

//               <div>
//                 <h2 className="text-sm font-semibold text-[#004B4B]">
//                   {tutor.name}
//                 </h2>

//                 {/* SUBJECTS ONLY */}
//                 <p className="text-xs text-gray-500">
//                   {tutor.subjects
//                     .map((s) => s.split("|")[0])
//                     .join(", ")}
//                 </p>

//                 <p className="text-xs text-yellow-600 mt-1">
//                   ⭐ {tutor.avgRating ?? "4.5"}{" "}
//                   <span className="text-gray-400">
//                     ({tutor.reviewCount ?? 55} reviews)
//                   </span>
//                 </p>
//               </div>
//             </div>

//             {/* BIO */}
//             <p className="text-xs text-gray-600 mt-3 line-clamp-3">
//               {tutor.bio ??
//                 "Experienced tutor passionate about making complex subjects easy to understand."}
//             </p>

//             {/* FOOTER */}
//             <div className="flex items-center justify-between mt-4">
//               <span className="text-sm font-semibold text-[#004B4B]">
//                 Rs {tutor.rate ?? null}/hr
//               </span>

//               <Link href={`/dashboard/tutor/${tutor.id}`}>
//                 <button className="text-sm px-3 py-1.5 border rounded-lg border-[#48A6A7] text-[#006A6A] hover:bg-[#E6F9F5] transition">
//                   View Profile
//                 </button>
//               </Link>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
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
      const q = search.toLowerCase();
      list = list.filter((t) => {
        const nameMatch = t.name.toLowerCase().includes(q);
        const subjectMatch = t.subjects.some((s) =>
          s.split("|")[0].toLowerCase().includes(q)
        );
        return nameMatch || subjectMatch;
      });
    }

    setFiltered(list);
  }, [search, tutors]);

  if (loading) return <p className="p-6 text-[#004B4B]">Loading tutors...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 pb-10">
      <h1 className="text-2xl font-bold text-[#004B4B] mb-6">
        Browse Tutors
      </h1>

      {/* ✅ SEARCH ONLY */}
      <div className="flex mb-6">
        <div className="flex items-center gap-2 w-full max-w-md bg-white border rounded-lg px-4 py-2 shadow-sm">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by tutor or subject"
            className="w-full outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <p className="text-gray-600">No tutors found.</p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tutor) => (
          <div
            key={tutor.id}
            className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            {/* TOP */}
            <div className="flex gap-3">
              {tutor.photo ? (
                <img
                  src={tutor.photo}
                  alt={tutor.name}
                  className="w-12 h-12 rounded-full object-cover border"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#E6F9F5] flex items-center justify-center font-bold text-[#004B4B]">
                  {tutor.name.charAt(0)}
                </div>
              )}

              <div>
                <h2 className="text-sm font-semibold text-[#004B4B]">
                  {tutor.name}
                </h2>

                <p className="text-xs text-gray-500">
                  {tutor.subjects.map((s) => s.split("|")[0]).join(", ")}
                </p>

                <p className="text-xs text-yellow-600 mt-1">
                  ⭐ {tutor.avgRating ?? "4.5"}{" "}
                  <span className="text-gray-400">
                    ({tutor.reviewCount ?? 55} reviews)
                  </span>
                </p>
              </div>
            </div>

            {/* BIO */}
            <p className="text-xs text-gray-600 mt-3 line-clamp-3">
              {tutor.bio ??
                "Experienced tutor passionate about making complex subjects easy to understand."}
            </p>

            {/* RATE ONLY (NO BUTTON) */}
            <div className="mt-4 text-sm font-semibold text-[#004B4B]">
              Rs {tutor.rate ?? "—"}/hr
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
