// "use client";

// import { Search } from "lucide-react";
// import Image from "next/image";

// export default function BrowseTutorsPage() {
//   const dummyTutors = [
//     {
//       name: "Jammy Adhikari",
//       subject: "Mathematics, Physics",
//       rating: "4.5 (55 reviews)",
//       price: "Rs 1200/hr",
//       grade: "Grade - 12",
//       desc: "Experienced tutor passionate about making complex subject easy to understand. Specializes in math and physics in highschool.",
//       img: "/assets/tutor1.png",
//     },
//     {
//       name: "Utsav Thapa",
//       subject: "Physics",
//       rating: "4 (40 reviews)",
//       price: "Rs 1200/hr",
//       grade: "Grade - 11",
//       desc: "Experienced tutor passionate about making complex subject easy to understand. Specializes in math and physics in highschool.",
//       img: "/assets/tutor2.png",
//     },
//     {
//       name: "Suraj Jha",
//       subject: "History, Science",
//       rating: "4.5 (55 reviews)",
//       price: "Rs 1300/hr",
//       grade: "Grade - 10",
//       desc: "Experienced tutor passionate about making complex subject easy to understand. Specializes in math and physics in highschool.",
//       img: "/assets/tutor3.png",
//     },
//     {
//       name: "Rejina Rai",
//       subject: "Computer, English",
//       rating: "4.5 (55 reviews)",
//       price: "Rs 1000/hr",
//       grade: "Grade - 9",
//       desc: "Experienced tutor passionate about making complex subject easy to understand. Specializes in math and physics in highschool.",
//       img: "/assets/tutor4.png",
//     },
//   ];

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-[700] text-[#1f3d3d] mb-4">
//         Browse Tutors
//       </h1>

//       {/* Search + Filters */}
//       <div className="flex items-center gap-3 mb-6">
//         <div className="flex items-center w-[260px] border rounded-lg px-2 bg-white shadow-sm">
//           <Search size={16} className="text-gray-500" />
//           <input
//             type="text"
//             placeholder="Search for tutors"
//             className="p-2 w-full text-sm focus:outline-none"
//           />
//         </div>

//         <select className="border bg-white px-2 py-2 rounded-lg text-sm shadow-sm">
//           <option>Subject</option>
//           <option>Math</option>
//           <option>Physics</option>
//           <option>English</option>
//         </select>

//         <select className="border bg-white px-2 py-2 rounded-lg text-sm shadow-sm">
//           <option>Level</option>
//           <option>Grade 9</option>
//           <option>Grade 10</option>
//           <option>Grade 11</option>
//           <option>Grade 12</option>
//         </select>
//       </div>

//       {/* Cards */}
//       <div className="grid grid-cols-2 gap-6">
//         {dummyTutors.map((tutor, idx) => (
//           <div
//             key={idx}
//             className="bg-white shadow-sm border border-gray-200 p-4 rounded-lg hover:shadow-md transition"
//           >
//             <div className="flex gap-3 items-start">
              
//               {/* Avatar image small */}
//               <Image
//                 src={tutor.img}
//                 alt="Tutor"
//                 width={45}
//                 height={45}
//                 className="rounded-full object-cover border"
//               />

//               <div className="leading-tight">
//                 <p className="font-[700] text-[#1f3d3d] text-[15px]">{tutor.name}</p>
//                 <p className="text-[#48A6A7] text-xs font-medium">
//                   {tutor.subject}
//                 </p>
//                 <p className="text-[#F5A623] text-xs font-medium">
//                   ★ {tutor.rating}
//                 </p>
//               </div>
//             </div>

//             <p className="text-sm text-gray-700 mt-3 mb-3">{tutor.desc}</p>

//             <div className="flex justify-between items-center">
//               <p className="text-[13px] font-bold text-black">{tutor.price}</p>
//               <button className="bg-white border border-[#48A6A7] text-[#006A6A] px-3 py-1 rounded-full text-sm hover:bg-[#e0f4f4]">
//                 View Profile
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }




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
//   rate?: number | null;
//   experience?: string | null;
//   avgRating?: number | null;
//   reviewCount?: number;
// }

// export default function BrowseTutors() {
//   const [tutors, setTutors] = useState<Tutor[]>([]);
//   const [filtered, setFiltered] = useState<Tutor[]>([]);
//   const [search, setSearch] = useState("");
//   const [subjectFilter, setSubjectFilter] = useState("All");
//   const [levelFilter, setLevelFilter] = useState("All");

//   // ================================================================
//   // FETCH TUTORS FROM API
//   // ================================================================
//   useEffect(() => {
//     async function load() {
//       try {
//         const res = await fetch("/api/tutor/list");
//         const data = await res.json();

//         const list = data?.tutors || [];

//         setTutors(list);
//         setFiltered(list);
//       } catch (err) {
//         console.error("Failed to load tutors", err);
//       }
//     }
//     load();
//   }, []);

//   // ================================================================
//   // FILTERING LOGIC
//   // ================================================================
//   useEffect(() => {
//     let list = [...tutors];

//     // Search filter
//     if (search.trim()) {
//       list = list.filter((t) =>
//         t.name.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     // Subject filter
//     if (subjectFilter !== "All") {
//       list = list.filter((t) => t.subjects.includes(subjectFilter));
//     }

//     // Level filter (if using experience field)
//     if (levelFilter !== "All") {
//       list = list.filter((t) => t.experience === levelFilter);
//     }

//     setFiltered(list);
//   }, [search, subjectFilter, levelFilter, tutors]);

//   // ================================================================
//   // UI RENDERING
//   // ================================================================
//   return (
//     <div className="p-6">

//       <h1 className="text-2xl font-semibold text-[#004B4B] mb-6">
//         Browse Tutors
//       </h1>

//       {/* SEARCH + FILTER BAR */}
//       <div className="flex items-center gap-4 mb-6">
        
//         {/* SEARCH BAR */}
//         <div className="flex items-center border rounded-lg px-3 py-2 bg-white w-1/3 shadow-sm">
//           <Search size={18} className="text-gray-500" />
//           <input
//             type="text"
//             placeholder="Search for tutors"
//             className="ml-2 w-full outline-none text-sm"
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         {/* SUBJECT FILTER */}
//         <select
//           className="border rounded-lg px-4 py-2 bg-white shadow-sm"
//           onChange={(e) => setSubjectFilter(e.target.value)}
//         >
//           <option>All</option>
//           <option>Math</option>
//           <option>Physics</option>
//           <option>Computer</option>
//           <option>English</option>
//           <option>Science</option>
//         </select>

//         {/* LEVEL FILTER */}
//         <select
//           className="border rounded-lg px-4 py-2 bg-white shadow-sm"
//           onChange={(e) => setLevelFilter(e.target.value)}
//         >
//           <option>All</option>
//           <option value="Beginner">Beginner</option>
//           <option value="Intermediate">Intermediate</option>
//           <option value="Advanced">Advanced</option>
//         </select>
//       </div>

//       {/* TUTOR GRID */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//         {filtered?.length === 0 && (
//           <p className="text-gray-500 col-span-2 text-center mt-10">
//             No tutors found.
//           </p>
//         )}

//         {filtered?.map((tutor) => (
//           <div
//             key={tutor.id}
//             className="bg-white p-5 rounded-xl shadow-sm border flex gap-4"
//           >
//             {/* Profile Image */}
//             <img
//               src={tutor.photo || "/default-user.png"}
//               className="w-16 h-16 rounded-full object-cover"
//             />

//             <div className="flex-1">
//               <h2 className="text-lg font-semibold text-[#004B4B]">
//                 {tutor.name}
//               </h2>

//               {/* Subjects */}
//               <p className="text-sm text-gray-500">
//                 {tutor.subjects.join(", ")}
//               </p>

//               {/* Rating */}
//               {tutor.avgRating !== null && (
//                 <p className="text-yellow-600 text-sm">
//                   ⭐ {tutor.avgRating} ({tutor.reviewCount} reviews)
//                 </p>
//               )}

//               {/* BIO */}
//               <p className="text-sm text-gray-600 mt-2 line-clamp-3">
//                 {tutor.bio ??
//                   "Experienced tutor passionate about helping students succeed."}
//               </p>

//               {/* RATE + BUTTON */}
//               <div className="flex justify-between items-center mt-4">
//                 <span className="font-semibold text-[#004B4B]">
//                   Rs {tutor.rate ?? 1000}/hr
//                 </span>

//                 <Link href={`/dashboard/tutor/${tutor.id}`}>
//                   <button className="px-4 py-2 rounded border border-[#006A6A] text-[#006A6A] hover:bg-[#E6F9F5] transition">
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

interface Tutor {
  id: string;             // Prisma id is String (cuid()), not number
  name: string;
  subjects: string[];
  photo?: string;
  bio?: string;
  rate?: number;
  experience?: string | null;
  rating?: number | null;
  reviewCount?: number;
}

export default function BrowseTutors() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [filtered, setFiltered] = useState<Tutor[]>([]);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");

  // FETCH TUTORS
  useEffect(() => {
    fetch("/api/tutor/list")
      .then((res) => res.json())
      .then((data) => {
        setTutors(data.tutors || []);
        setFiltered(data.tutors || []);
      })
      .catch((err) => console.error("BROWSE TUTORS ERROR:", err));
  }, []);

  // HANDLE FILTERS + SEARCH
  useEffect(() => {
    let list = [...tutors];

    if (search.trim()) {
      list = list.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (subjectFilter !== "All") {
      list = list.filter((t) => t.subjects?.includes(subjectFilter));
    }

    // (Optional) level filter – if you decide how you store level
    if (levelFilter !== "All") {
      // Example: match by experience string containing levelFilter
      list = list.filter((t) =>
        (t.experience || "").toLowerCase().includes(levelFilter.toLowerCase())
      );
    }

    setFiltered(list);
  }, [search, subjectFilter, levelFilter, tutors]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-[#004B4B] mb-6">
        Browse Tutors
      </h1>

      {/* SEARCH BAR + FILTERS */}
      <div className="flex items-center gap-4 mb-6">
        {/* Search */}
        <div className="flex items-center border rounded-lg px-3 py-2 bg-white w-1/3 shadow-sm">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search for tutors"
            className="ml-2 w-full outline-none text-sm"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Subject Filter */}
        <select
          className="border rounded-lg px-4 py-2 bg-white shadow-sm"
          onChange={(e) => setSubjectFilter(e.target.value)}
        >
          <option>All</option>
          <option>Math</option>
          <option>Physics</option>
          <option>Computer</option>
          <option>English</option>
          <option>Science</option>
        </select>

        {/* Level Filter (you can customize later) */}
        <select
          className="border rounded-lg px-4 py-2 bg-white shadow-sm"
          onChange={(e) => setLevelFilter(e.target.value)}
        >
          <option>All</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>

      {/* TUTOR GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((tutor) => (
          <div
            key={tutor.id}
            className="bg-white p-5 rounded-xl shadow-sm border flex gap-4"
          >
            {/* Profile Image */}
            <img
              src={tutor.photo || "/default-user.png"}
              className="w-16 h-16 rounded-full object-cover"
              alt={tutor.name}
            />

            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[#004B4B]">
                {tutor.name}
              </h2>

              {/* Subjects */}
              <p className="text-sm text-gray-500">
                {tutor.subjects?.length ? tutor.subjects.join(", ") : "No subjects listed"}
              </p>

              {/* Rating */}
              {tutor.rating != null && (
                <p className="text-yellow-600 text-sm">
                  ⭐ {tutor.rating} ({tutor.reviewCount ?? 0} reviews)
                </p>
              )}

              {/* Bio */}
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                {tutor.bio ?? "Experienced tutor specializing in multiple subjects."}
              </p>

              {/* Rate + Button */}
              <div className="flex justify-between items-center mt-4">
                <span className="font-semibold text-[#004B4B]">
                  Rs {tutor.rate ?? 1000}/hr
                </span>

                <Link href={`/dashboard/tutor/${tutor.id}`}>
                  <button className="px-4 py-2 rounded border border-[#006A6A] text-[#006A6A] hover:bg-[#E6F9F5] transition">
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
