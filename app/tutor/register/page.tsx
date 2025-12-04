// "use client";
// import { useState } from "react";
// import Image from "next/image";

// export default function TutorRegistration() {
//   const [photoPreview, setPhotoPreview] = useState<string | null>(null);
//   const [cvName, setCvName] = useState("");
//   const [idName, setIdName] = useState("");
//   const [subjects, setSubjects] = useState<string[]>([]);
// const [subjectValue, setSubjectValue] = useState("");


//   return (
//     <div className="min-h-screen bg-[#F2EFE7] pb-20 pt-10 px-4">
//       <div className="max-w-3xl mx-auto">

//         {/* TITLE */}
//         <h1 className="text-3xl font-bold text-[#004B4B] mb-6 text-center">
//           Tutor Registration
//         </h1>

//         <form className="space-y-6">

//           {/* PERSONAL INFO */}
//           <section className="bg-white p-5 rounded-xl border shadow-sm">
//             <h2 className="text-lg font-semibold text-[#006A6A] border-b pb-2 mb-3">
//               Personal Information
//             </h2>

//             <FormField label="Full Name" required>
//               <input placeholder="Enter your full name" className="input" required />
//             </FormField>

//             <FormField label="Email" required>
//               <input type="email" placeholder="Enter email address" className="input" required />
//             </FormField>

//             <FormField label="Phone Number" required>
//               <input placeholder="Enter phone number" className="input" required />
//             </FormField>

//             <FormField label="Password" required>
//               <input type="password" placeholder="Create a secure password" className="input" required />
//             </FormField>
//           </section>

//           {/* PROFILE */}
//           <section className="bg-white p-5 rounded-xl border shadow-sm">
//             <h2 className="text-lg font-semibold text-[#006A6A] border-b pb-2 mb-3">
//               Tutor Profile
//             </h2>

//             <FormField label="Profile Photo (Optional)">
//               <div className="flex items-center gap-4">
//                 {photoPreview ? (
//                   <Image src={photoPreview} width={64} height={64} className="rounded-full border object-cover" alt="profile" />
//                 ) : (
//                   <div className="w-16 h-16 rounded-full bg-gray-200 border" />
//                 )}

//                 <label className="cursor-pointer bg-[#006A6A] text-white px-4 py-2 rounded-md hover:bg-[#005454] transition text-sm">
//                   Browse Photo
//                   <input
//                     type="file"
//                     accept="image/*"
//                     className="hidden"
//                     onChange={(e) => {
//                       const file = e.target.files?.[0];
//                       if (!file) return;
//                       setPhotoPreview(URL.createObjectURL(file));
//                     }}
//                   />
//                 </label>
//               </div>
//             </FormField>

//             <FormField label="Short Bio" required>
//               <textarea placeholder="Tell students about your teaching style and experience in 2–3 lines..."
//                 className="input h-24 text-sm resize-none"
//                 required />
//             </FormField>

//           </section>

//           {/* TEACHING DETAILS */}
//           <section className="bg-white p-5 rounded-xl border shadow-sm">
//             <h2 className="text-lg font-semibold text-[#006A6A] border-b pb-2 mb-3">
//               Teaching Information
//             </h2>

//             <FormField label="Teaching Level" required>
//               <select className="input text-sm" required>
//                 <option value="">Select your teaching level</option>
//                 <option>Primary</option>
//                 <option>Secondary</option>
//                 <option>High School</option>
//                 <option>College Level</option>
//               </select>
//             </FormField>

//             <FormField label="Experience (years)" required>
//               <input placeholder="e.g. 3" className="input text-sm" required />
//             </FormField>

//             {/* SUBJECTS YOU TEACH - TAG INPUT */}
// <FormField label="Subjects You Teach" required>
//   <div
//     className="input min-h-12 flex flex-wrap items-center gap-2 p-2 cursor-text"
//     onClick={() => document.getElementById('subjectInput')?.focus()}
//   >
//     {subjects.map((subj, idx) => (
//       <span
//         key={idx}
//         className="px-2 py-1 bg-[#E6F4F1] text-[#006A6A] text-xs rounded-full flex items-center gap-1"
//       >
//         {subj}
//         <button
//           type="button"
//           onClick={() =>
//             setSubjects(subjects.filter((_, i) => i !== idx))
//           }
//           className="text-[#006A6A] hover:text-red-500 font-bold text-sm"
//         >
//           ×
//         </button>
//       </span>
//     ))}

//     <input
//       id="subjectInput"
//       type="text"
//       value={subjectValue}
//       onChange={(e) => setSubjectValue(e.target.value)}
//       onKeyDown={(e) => {
//         if (e.key === "Enter" && subjectValue.trim()) {
//           e.preventDefault();
//           if (!subjects.includes(subjectValue.trim())) {
//             setSubjects([...subjects, subjectValue.trim()]);
//           }
//           setSubjectValue("");
//         }
//       }}
//       placeholder="Type a subject"
//       className="outline-none flex-1 text-sm"
//     />
//   </div>

//   <p className="text-xs text-gray-500 mt-1">
//     Add subjects(e.g., “Math”, “Physics”, “Artificial Inteligence”).
//   </p>
// </FormField>

//           </section>

//           {/* DOCUMENT UPLOADS */}
//           <section className="bg-white p-5 rounded-xl border shadow-sm">
//             <h2 className="text-lg font-semibold text-[#006A6A] border-b pb-2 mb-3">
//               Academic Verification
//             </h2>

//             <FormField label="Upload CV (PDF)" required>
//               <label className="cursor-pointer input flex justify-between items-center text-sm">
//                 <span>{cvName || "Choose file"}</span>
//                 <input
//                   type="file"
//                   className="hidden"
//                   accept=".pdf"
//                   onChange={(e) => setCvName(e.target.files?.[0]?.name || "")}
//                   required
//                 />
//               </label>
//             </FormField>

//             <h2 className="text-lg font-semibold text-[#006A6A] border-b pb-2 mt-6 mb-3">
//               Identity Verification
//             </h2>

//             <FormField label="Upload Government ID" required>
//               <label className="cursor-pointer input flex justify-between items-center text-sm">
//                 <span>{idName || "Choose file"}</span>
//                 <input
//                   type="file"
//                   className="hidden"
//                   accept="image/*,.pdf"
//                   onChange={(e) => setIdName(e.target.files?.[0]?.name || "")}
//                   required
//                 />
//               </label>
//             </FormField>
//           </section>

//           {/* SUBMIT BUTTON */}
//           <button
//             className="bg-[#006A6A] w-full text-white py-3 rounded-xl hover:bg-[#005454] transition text-lg font-semibold mt-4"
//           >
//             Submit for Approval
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// }

// /* ---------------------- FIELD WRAPPER ---------------------- */
// function FormField({ label, required, children }: any) {
//   return (
//     <div className="mb-4">
//       <label className="block font-medium text-[#004B4B] mb-1 text-sm">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       {children}
//     </div>
//   );
// }



"use client";
import { useState, useRef } from "react";
import Image from "next/image";

export default function TutorRegistration() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [cvName, setCvName] = useState("");
  const [idName, setIdName] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [subjectValue, setSubjectValue] = useState("");

  // file refs
  const photoRef = useRef<HTMLInputElement | null>(null);
  const cvRef = useRef<HTMLInputElement | null>(null);
  const idRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", (document.getElementById("name") as any).value);
    formData.append("email", (document.getElementById("email") as any).value);
    formData.append("phone", (document.getElementById("phone") as any).value);
    formData.append("password", (document.getElementById("password") as any).value);
    formData.append("bio", (document.getElementById("bio") as any).value);
    formData.append("level", (document.getElementById("level") as any).value);
    formData.append("experience", (document.getElementById("experience") as any).value);

    subjects.forEach((s) => formData.append("subjects", s));

    if (photoRef.current?.files?.[0]) formData.append("photo", photoRef.current.files[0]);
    if (cvRef.current?.files?.[0]) formData.append("cv", cvRef.current.files[0]);
    if (idRef.current?.files?.[0]) formData.append("id", idRef.current.files[0]);

    const res = await fetch("/api/tutor/register", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="min-h-screen bg-[#F2EFE7] pb-20 pt-10 px-4">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold text-[#004B4B] mb-6 text-center">
          Tutor Registration
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>

          <section className="bg-white p-5 rounded-xl border shadow-sm">
            <h2 className="text-lg font-semibold text-[#006A6A] border-b pb-2 mb-3">
              Personal Information
            </h2>

            <FormField label="Full Name" required>
              <input id="name" placeholder="Enter your full name" className="input" required />
            </FormField>

            <FormField label="Email" required>
              <input id="email" type="email" placeholder="Enter email address" className="input" required />
            </FormField>

            <FormField label="Phone Number" required>
              <input id="phone" placeholder="Enter phone number" className="input" required />
            </FormField>

            <FormField label="Password" required>
              <input id="password" type="password" placeholder="Create a secure password" className="input" required />
            </FormField>
          </section>

          <section className="bg-white p-5 rounded-xl border shadow-sm">
            <h2 className="text-lg font-semibold text-[#006A6A] border-b pb-2 mb-3">
              Tutor Profile
            </h2>

            <FormField label="Profile Photo (Optional)">
              <div className="flex items-center gap-4">
                {photoPreview ? (
                  <Image src={photoPreview} width={64} height={64} className="rounded-full border object-cover" alt="profile" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 border" />
                )}

                <label className="cursor-pointer bg-[#006A6A] text-white px-4 py-2 rounded-md hover:bg-[#005454] transition text-sm">
                  Browse Photo
                  <input
                    ref={photoRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setPhotoPreview(URL.createObjectURL(file));
                    }}
                  />
                </label>
              </div>
            </FormField>

            <FormField label="Short Bio" required>
              <textarea
                id="bio"
                placeholder="Tell students about your experience..."
                className="input h-24 text-sm resize-none"
                required
              />
            </FormField>
          </section>

          <section className="bg-white p-5 rounded-xl border shadow-sm">
            <h2 className="text-lg font-semibold text-[#006A6A] border-b pb-2 mb-3">
              Teaching Information
            </h2>

            <FormField label="Teaching Level" required>
              <select id="level" className="input text-sm" required>
                <option value="">Select your teaching level</option>
                <option>Primary</option>
                <option>Secondary</option>
                <option>High School</option>
                <option>College Level</option>
              </select>
            </FormField>

            <FormField label="Experience (years)" required>
              <input id="experience" placeholder="e.g. 3" className="input text-sm" required />
            </FormField>

            <FormField label="Subjects You Teach" required>
              <div
                className="input min-h-12 flex flex-wrap items-center gap-2 p-2 cursor-text"
                onClick={() => document.getElementById("subjectInput")?.focus()}
              >
                {subjects.map((subj, idx) => (
                  <span key={idx} className="px-2 py-1 bg-[#E6F4F1] text-[#006A6A] text-xs rounded-full flex items-center gap-1">
                    {subj}
                    <button
                      type="button"
                      onClick={() => setSubjects(subjects.filter((_, i) => i !== idx))}
                      className="text-[#006A6A] hover:text-red-500 font-bold text-sm"
                    >
                      ×
                    </button>
                  </span>
                ))}

                <input
                  id="subjectInput"
                  type="text"
                  value={subjectValue}
                  onChange={(e) => setSubjectValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && subjectValue.trim()) {
                      e.preventDefault();
                      if (!subjects.includes(subjectValue.trim())) {
                        setSubjects([...subjects, subjectValue.trim()]);
                      }
                      setSubjectValue("");
                    }
                  }}
                  placeholder="Type a subject"
                  className="outline-none flex-1 text-sm"
                />
              </div>
            </FormField>
          </section>

          <section className="bg-white p-5 rounded-xl border shadow-sm">
            <h2 className="text-lg font-semibold text-[#006A6A] border-b pb-2 mb-3">
              Academic Verification
            </h2>

            <FormField label="Upload CV (PDF)" required>
              <label className="cursor-pointer input flex justify-between items-center text-sm">
                <span>{cvName || "Choose file"}</span>
                <input
                  ref={cvRef}
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => setCvName(e.target.files?.[0]?.name || "")}
                  required
                />
              </label>
            </FormField>

            <FormField label="Upload Government ID" required>
              <label className="cursor-pointer input flex justify-between items-center text-sm">
                <span>{idName || "Choose file"}</span>
                <input
                  ref={idRef}
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={(e) => setIdName(e.target.files?.[0]?.name || "")}
                  required
                />
              </label>
            </FormField>
          </section>

          <button className="bg-[#006A6A] w-full text-white py-3 rounded-xl hover:bg-[#005454] transition text-lg font-semibold mt-4">
            Submit for Approval
          </button>

        </form>
      </div>
    </div>
  );
}

function FormField({ label, required, children }: any) {
  return (
    <div className="mb-4">
      <label className="block font-medium text-[#004B4B] mb-1 text-sm">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
