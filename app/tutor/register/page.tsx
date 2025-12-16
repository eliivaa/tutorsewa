// "use client";

// import { useState, useRef } from "react";
// import Image from "next/image";
// import toast from "react-hot-toast";

// const MAX_SUBJECTS = 5;

// export default function TutorRegistration() {
//   const [photoPreview, setPhotoPreview] = useState<string | null>(null);
//   const [cvName, setCvName] = useState("");
//   const [idName, setIdName] = useState("");

//   const [subjects, setSubjects] = useState<string[]>([]);
//   const [subjectValue, setSubjectValue] = useState("");
//   const [levelValue, setLevelValue] = useState("");

//   const [loading, setLoading] = useState(false);

//   // File refs
//   const photoRef = useRef<HTMLInputElement | null>(null);
//   const cvRef = useRef<HTMLInputElement | null>(null);
//   const idRef = useRef<HTMLInputElement | null>(null);

//   // ✅ ADD SUBJECT + LEVEL
//   const handleAddSubject = () => {
//     if (!subjectValue.trim() || !levelValue.trim()) {
//       toast.error("Please enter both subject and level.");
//       return;
//     }

//     if (subjects.length >= MAX_SUBJECTS) {
//       toast.error(`You can add only ${MAX_SUBJECTS} subject-level combinations.`);
//       return;
//     }

//     const combined = `${subjectValue.trim()}|${levelValue.trim()}`;

//     if (subjects.includes(combined)) {
//       toast.error("This subject & level already exists.");
//       return;
//     }

//     setSubjects([...subjects, combined]);
//     setSubjectValue("");
//     setLevelValue("");
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const formData = new FormData();

//       formData.append("name", (document.getElementById("name") as HTMLInputElement).value);
//       formData.append("email", (document.getElementById("email") as HTMLInputElement).value);
//       formData.append("phone", (document.getElementById("phone") as HTMLInputElement).value);
//       formData.append("password", (document.getElementById("password") as HTMLInputElement).value);
//       formData.append("bio", (document.getElementById("bio") as HTMLTextAreaElement).value);
//       formData.append("experience", (document.getElementById("experience") as HTMLInputElement).value);

//       subjects.forEach((s) => formData.append("subjects", s));

//       if (photoRef.current?.files?.[0]) formData.append("photo", photoRef.current.files[0]);
//       if (cvRef.current?.files?.[0]) formData.append("cv", cvRef.current.files[0]);
//       if (idRef.current?.files?.[0]) formData.append("id", idRef.current.files[0]);

//       const res = await fetch("/api/tutor/register", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Registration failed");

//       toast.success(data.message || "Registration submitted successfully");
//     } catch (err: any) {
//       toast.error(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F2EFE7] pb-20 pt-10 px-4">
//       <div className="max-w-3xl mx-auto">

//         <h1 className="text-3xl font-bold text-[#004B4B] mb-6 text-center">
//           Tutor Registration
//         </h1>

//         <form className="space-y-6" onSubmit={handleSubmit}>

//           {/* PERSONAL INFO */}
//           <Section title="Personal Information">
//             <FormField label="Full Name" required>
//               <input id="name" className="input" required />
//             </FormField>

//             <FormField label="Email" required>
//               <input id="email" type="email" className="input" required />
//             </FormField>

//             <FormField label="Phone" required>
//               <input id="phone" className="input" required />
//             </FormField>

//             <FormField label="Password" required>
//               <input id="password" type="password" className="input" required />
//             </FormField>
//           </Section>

//           {/* PROFILE */}
//           <Section title="Tutor Profile">
//             <FormField label="Profile Photo">
//               <div className="flex items-center gap-4">
//                 {photoPreview ? (
//                   <Image
//                     src={photoPreview}
//                     width={64}
//                     height={64}
//                     className="rounded-full border object-cover"
//                     alt="profile"
//                   />
//                 ) : (
//                   <div className="w-16 h-16 rounded-full bg-gray-200 border" />
//                 )}

//                 <label className="cursor-pointer bg-[#006A6A] text-white px-4 py-2 rounded-md text-sm">
//                   Browse
//                   <input
//                     ref={photoRef}
//                     type="file"
//                     accept="image/*"
//                     className="hidden"
//                     onChange={(e) =>
//                       e.target.files && setPhotoPreview(URL.createObjectURL(e.target.files[0]))
//                     }
//                   />
//                 </label>
//               </div>
//             </FormField>

//             <FormField label="Short Bio" required>
//               <textarea id="bio" className="input h-24 resize-none" required />
//             </FormField>
//           </Section>

//           {/* TEACHING */}
//           <Section title="Teaching Information">

//             <FormField label="Experience (years)" required>
//               <input id="experience" className="input" required />
//             </FormField>

//             <FormField label="Subjects & Levels" required>
//               <div className="flex gap-2 mb-3">
//                 <input
//                   value={subjectValue}
//                   onChange={(e) => setSubjectValue(e.target.value)}
//                   placeholder="Subject (e.g. Math)"
//                   className="input flex-1"
//                 />

//                 <input
//                   value={levelValue}
//                   onChange={(e) => setLevelValue(e.target.value)}
//                   placeholder="Level (e.g. Grade 5, BIT, Bachelor)"
//                   className="input flex-1"
//                 />

//                 <button
//                   type="button"
//                   onClick={handleAddSubject}
//                   className="bg-[#006A6A] text-white px-4 rounded-md"
//                 >
//                   Add
//                 </button>
//               </div>

//               <div className="flex flex-wrap gap-2">
//                 {subjects.map((item, idx) => {
//                   const [sub, lvl] = item.split("|");
//                   return (
//                     <span
//                       key={idx}
//                       className="px-2 py-1 bg-[#E6F4F1] text-[#006A6A] text-xs rounded-full flex items-center gap-1"
//                     >
//                       {sub} ({lvl})
//                       <button
//                         type="button"
//                         onClick={() => setSubjects(subjects.filter((_, i) => i !== idx))}
//                       >
//                         ×
//                       </button>
//                     </span>
//                   );
//                 })}
//               </div>

//               <p className="text-xs text-gray-500 mt-2">
//                 Maximum {MAX_SUBJECTS} subject–level combinations allowed.
//               </p>
//             </FormField>

//           </Section>

//           {/* DOCUMENTS */}
//           <Section title="Academic Verification">
//             <FormField label="Upload CV (PDF)" required>
//               <label className="cursor-pointer input flex justify-between items-center">
//                 <span>{cvName || "Choose file"}</span>
//                 <input
//                   ref={cvRef}
//                   type="file"
//                   accept=".pdf"
//                   className="hidden"
//                   onChange={(e) => setCvName(e.target.files?.[0]?.name || "")}
//                   required
//                 />
//               </label>
//             </FormField>

//             <FormField label="Upload Government ID" required>
//               <label className="cursor-pointer input flex justify-between items-center">
//                 <span>{idName || "Choose file"}</span>
//                 <input
//                   ref={idRef}
//                   type="file"
//                   accept="image/*,.pdf"
//                   className="hidden"
//                   onChange={(e) => setIdName(e.target.files?.[0]?.name || "")}
//                   required
//                 />
//               </label>
//             </FormField>
//           </Section>

//           <button
//             disabled={loading}
//             className="bg-[#006A6A] w-full text-white py-3 rounded-xl hover:bg-[#005454] transition text-lg font-semibold disabled:opacity-60"
//           >
//             {loading ? "Submitting..." : "Submit for Approval"}
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// }

// function Section({ title, children }: any) {
//   return (
//     <section className="bg-white p-5 rounded-xl border shadow-sm">
//       <h2 className="text-lg font-semibold text-[#006A6A] border-b pb-2 mb-3">
//         {title}
//       </h2>
//       {children}
//     </section>
//   );
// }

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
import toast from "react-hot-toast";

const MAX_SUBJECTS = 5;

export default function TutorRegistration() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [cvName, setCvName] = useState("");
  const [idName, setIdName] = useState("");

  const [subjects, setSubjects] = useState<string[]>([]);
  const [subjectValue, setSubjectValue] = useState("");
  const [levelValue, setLevelValue] = useState("");

  const [loading, setLoading] = useState(false);

  const photoRef = useRef<HTMLInputElement | null>(null);
  const cvRef = useRef<HTMLInputElement | null>(null);
  const idRef = useRef<HTMLInputElement | null>(null);

  /* ================= ADD SUBJECT ================= */
  const handleAddSubject = () => {
    if (!subjectValue.trim() || !levelValue.trim()) {
      toast.error("Please enter both subject and level.");
      return;
    }

    if (subjects.length >= MAX_SUBJECTS) {
      toast.error(`Maximum ${MAX_SUBJECTS} subjects allowed.`);
      return;
    }

    const combined = `${subjectValue.trim()}|${levelValue.trim()}`;

    if (subjects.includes(combined)) {
      toast.error("This subject & level already exists.");
      return;
    }

    setSubjects([...subjects, combined]);
    setSubjectValue("");
    setLevelValue("");
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const name = (document.getElementById("name") as HTMLInputElement).value;
      const email = (document.getElementById("email") as HTMLInputElement).value;
      const phone = (document.getElementById("phone") as HTMLInputElement).value;
      const password = (document.getElementById("password") as HTMLInputElement).value;
      const bio = (document.getElementById("bio") as HTMLTextAreaElement).value;
      const experience = (document.getElementById("experience") as HTMLInputElement).value;

      /* -------- VALIDATIONS -------- */
      if (!/^[A-Za-z\s]+$/.test(name)) {
        toast.error("Name must contain letters only.");
        return;
      }

      if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/.test(password)) {
        toast.error("Password must contain letter, number & symbol.");
        return;
      }

      // if (isNaN(Number(experience))) {
      //   toast.error("Experience must be a number.");
      //   return;
      // }

      if (subjects.length === 0) {
        toast.error("Please add at least one subject.");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("bio", bio);
      formData.append("experience", experience);

      subjects.forEach((s) => formData.append("subjects", s));

      if (photoRef.current?.files?.[0]) {
        formData.append("photo", photoRef.current.files[0]);
      }
      if (cvRef.current?.files?.[0]) {
        formData.append("cv", cvRef.current.files[0]);
      }
      if (idRef.current?.files?.[0]) {
        formData.append("id", idRef.current.files[0]);
      }

      const res = await fetch("/api/tutor/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      toast.success("Registration submitted for approval!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#F2EFE7] pb-20 pt-10 px-4">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold text-[#004B4B] mb-6 text-center">
          Tutor Registration
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* PERSONAL INFO */}
          <Section title="Personal Information">
            <FormField label="Full Name" required>
              <input id="name" className="input" required />
            </FormField>

            <FormField label="Email" required>
              <input id="email" type="email" className="input" required />
            </FormField>

            <FormField label="Phone" required>
              <input id="phone" className="input" required />
            </FormField>

            <FormField label="Password" required>
              <input id="password" type="password" className="input" required />
            </FormField>
          </Section>

          {/* PROFILE */}
          <Section title="Tutor Profile">
            <FormField label="Profile Photo">
              <div className="flex items-center gap-4">
                {photoPreview ? (
                  <Image src={photoPreview} width={64} height={64} className="rounded-full border" alt="profile" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 border" />
                )}

                <label className="cursor-pointer bg-[#006A6A] text-white px-4 py-2 rounded-md text-sm">
                  Browse
                  <input
                    ref={photoRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files && setPhotoPreview(URL.createObjectURL(e.target.files[0]))
                    }
                  />
                </label>
              </div>
            </FormField>

            <FormField label="Short Bio" required>
              <textarea id="bio" className="input h-24 resize-none" required />
            </FormField>
          </Section>

          {/* TEACHING */}
          <Section title="Teaching Information">
            <FormField label="Experience (years)" required>
              <input
  id="experience"
  type="text"
  className="input"
  placeholder="e.g. 2 years, 6 months, Fresh graduate"
  required
/>

            </FormField>

            <FormField label="Subjects & Levels" required>
              <div className="flex gap-2 mb-3">
                <input
                  value={subjectValue}
                  onChange={(e) => setSubjectValue(e.target.value)}
                  placeholder="Subject (e.g. Math)"
                  className="input flex-1"
                />
                <input
                  value={levelValue}
                  onChange={(e) => setLevelValue(e.target.value)}
                  placeholder="Level (e.g. Grade 5, BIT)"
                  className="input flex-1"
                />
                <button type="button" onClick={handleAddSubject} className="bg-[#006A6A] text-white px-4 rounded-md">
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {subjects.map((item, idx) => {
                  const [sub, lvl] = item.split("|");
                  return (
                    <span key={idx} className="px-2 py-1 bg-[#E6F4F1] text-[#006A6A] text-xs rounded-full">
                      {sub} ({lvl})
                      <button type="button" onClick={() => setSubjects(subjects.filter((_, i) => i !== idx))}> × </button>
                    </span>
                  );
                })}
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Maximum {MAX_SUBJECTS} subject–level combinations allowed.
              </p>
            </FormField>
          </Section>

          {/* DOCUMENTS */}
          <Section title="Academic Verification">
            <FormField label="Upload CV (PDF)" required>
              <label className="cursor-pointer input flex justify-between">
                <span>{cvName || "Choose file"}</span>
                <input ref={cvRef} type="file" accept=".pdf" className="hidden" onChange={(e) => setCvName(e.target.files?.[0]?.name || "")} required />
              </label>
            </FormField>

            <FormField label="Upload Government ID" required>
              <label className="cursor-pointer input flex justify-between">
                <span>{idName || "Choose file"}</span>
                <input ref={idRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setIdName(e.target.files?.[0]?.name || "")} required />
              </label>
            </FormField>
          </Section>

          <button disabled={loading} className="bg-[#006A6A] w-full text-white py-3 rounded-xl text-lg font-semibold disabled:opacity-60">
            {loading ? "Submitting..." : "Submit for Approval"}
          </button>

        </form>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */
function Section({ title, children }: any) {
  return (
    <section className="bg-white p-5 rounded-xl border shadow-sm">
      <h2 className="text-lg font-semibold text-[#006A6A] border-b pb-2 mb-3">
        {title}
      </h2>
      {children}
    </section>
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
