"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import TutorVerifyModal from "@/app/components/TutorVerifyModal";

const MAX_SUBJECTS = 5;

export default function TutorRegistration() {

const { data: session } = useSession();

/* ================= FORM STATES ================= */

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [phone,setPhone] = useState("");
const [password,setPassword] = useState("");
const [bio,setBio] = useState("");
const [experience,setExperience] = useState("");
const [rate,setRate] = useState("");

const [photoPreview,setPhotoPreview] = useState<string | null>(null);
const [certificateName,setCertificateName] = useState("");
const [citizenshipName,setCitizenshipName] = useState("");

const [subjects,setSubjects] = useState<string[]>([]);
const [subjectValue,setSubjectValue] = useState("");
const [levelValue,setLevelValue] = useState("");

const [showPassword,setShowPassword] = useState(false);
const [loading,setLoading] = useState(false);

const photoRef = useRef<HTMLInputElement | null>(null);
const certificateRef = useRef<HTMLInputElement | null>(null);
const citizenshipRef = useRef<HTMLInputElement | null>(null);

const [showVerifyModal,setShowVerifyModal] = useState(false);
const [verifyEmail,setVerifyEmail] = useState("");

/* ================= GOOGLE PREFILL ================= */

useEffect(() => {

if(session?.user){

setName(session.user.name || "");
setEmail(session.user.email || "");

if(session.user.image){
setPhotoPreview(session.user.image);
}

}

},[session]);

const handleGooglePrefill = async () => {

await signOut({redirect:false});

await signIn("google", {
  callbackUrl: "/tutor/register?google=true",
role:"tutor"
},
{prompt:"select_account"}
);

};

/* ================= ADD SUBJECT ================= */

const handleAddSubject = () => {

if(!subjectValue.trim() || !levelValue.trim()){
toast.error("Please enter both subject and level.");
return;
}

if(subjects.length >= MAX_SUBJECTS){
toast.error(`Maximum ${MAX_SUBJECTS} subjects allowed.`);
return;
}

const combined = `${subjectValue.trim()}|${levelValue.trim()}`;

if(subjects.includes(combined)){
toast.error("This subject & level already exists.");
return;
}

setSubjects([...subjects,combined]);
setSubjectValue("");
setLevelValue("");

};

/* ================= SUBMIT ================= */

const handleSubmit = async (e:React.FormEvent) => {

e.preventDefault();
setLoading(true);

try{

const nepalPhoneRegex =
/^(984|985|986|974|975|980|981|982|970|961|962)[0-9]{7}$/;

if(!nepalPhoneRegex.test(phone)){
toast.error("Enter a valid Nepal mobile number.");
setLoading(false);
return;
}

if(!/^[A-Za-z\s]+$/.test(name)){
toast.error("Name must contain letters only.");
setLoading(false);
return;
}

if(!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/.test(password)){
toast.error("Password must contain letter, number & symbol.");
setLoading(false);
return;
}

if(!/^\d+$/.test(rate) || Number(rate) <= 0){
toast.error("Please enter a valid hourly rate.");
setLoading(false);
return;
}

if(subjects.length === 0){
toast.error("Please add at least one subject.");
setLoading(false);
return;
}

const formData = new FormData();

formData.append("name",name);
formData.append("email",email);
formData.append("phone",phone);
formData.append("password",password);
formData.append("bio",bio);
formData.append("experience",experience);
formData.append("rate",rate);

subjects.forEach((s)=>formData.append("subjects",s));

if(photoRef.current?.files?.[0])
formData.append("photo",photoRef.current.files[0]);

if(certificateRef.current?.files?.[0])
formData.append("certificate",certificateRef.current.files[0]);

if(citizenshipRef.current?.files?.[0])
formData.append("citizenship",citizenshipRef.current.files[0]);

const res = await fetch("/api/tutor/register",{
method:"POST",
body:formData
});

const data = await res.json();

if(!res.ok) throw new Error(data.error || "Registration failed");

toast.success("Verification code sent to email");

setVerifyEmail(email);
setShowVerifyModal(true);

}catch(err:any){

toast.error(err.message || "Something went wrong");

}finally{

setLoading(false);

}

};

/* ================= UI ================= */

return(

<div className="min-h-screen bg-[#F2EFE7] pb-20 pt-10 px-4">

<div className="max-w-3xl mx-auto">

<h1 className="text-3xl font-bold text-[#004B4B] mb-6 text-center">
Tutor Registration
</h1>

<p className="text-sm text-gray-600 text-center mb-6">
  TutorSewa promotes affordable learning for students. 
  Tutors are encouraged to set fair pricing.
</p>

{/* GOOGLE PREFILL BUTTON */}

{/* <button
type="button"
onClick={handleGooglePrefill}
className="w-full border-2 rounded-md py-2 flex justify-center items-center gap-2 hover:bg-gray-50 mb-6"
>
<Image src="/google.svg" alt="Google" width={20} height={20}/>
Continue with Google
</button> */}

<form className="space-y-6" onSubmit={handleSubmit}>

{/* PERSONAL INFO */}

<Section title="Personal Information">

<FormField label="Full Name" required>
<input
id="name"
className="input"
value={name}
onChange={(e)=>setName(e.target.value)}
required
/>
</FormField>

<FormField label="Email" required>
<input
id="email"
type="email"
className="input"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>
</FormField>

<FormField label="Phone" required>
<input
id="phone"
className="input"
placeholder="98XXXXXXXX"
maxLength={10}
value={phone}
onChange={(e)=>setPhone(e.target.value)}
required
/>
</FormField>

<FormField label="Password" required>

<div className="relative">

<input
id="password"
type={showPassword ? "text" : "password"}
className="input pr-10"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

<button
type="button"
onClick={()=>setShowPassword(!showPassword)}
className="absolute right-3 top-1/2 -translate-y-1/2"
>
{showPassword ? <Eye size={18}/> : <EyeOff size={18}/>}
</button>

</div>

</FormField>

</Section>

{/* PROFILE */}

<Section title="Tutor Profile">

<FormField label="Profile Photo">

<div className="flex items-center gap-4">

{photoPreview ? (

<Image
src={photoPreview}
width={64}
height={64}
className="rounded-full border"
alt="profile"
/>

) : (

<div className="w-16 h-16 rounded-full bg-gray-200 border"/>

)}

<label className="cursor-pointer bg-[#006A6A] text-white px-4 py-2 rounded-md text-sm">

Browse

<input
ref={photoRef}
type="file"
accept="image/*"
className="hidden"
onChange={(e)=>
e.target.files &&
setPhotoPreview(URL.createObjectURL(e.target.files[0]))
}
/>

</label>

</div>

</FormField>

<FormField label="Short Bio" required>

<textarea
id="bio"
className="input h-24 resize-none"
value={bio}
onChange={(e)=>setBio(e.target.value)}
required
/>

</FormField>

</Section>

{/* TEACHING */}

<Section title="Teaching Information">

<FormField label="Experience" required>

<input
id="experience"
className="input"
placeholder="e.g. 2 years"
value={experience}
onChange={(e)=>setExperience(e.target.value)}
required
/>

</FormField>

<FormField label="Subjects & Levels" required>

<div className="flex gap-2 mb-3">

<input
value={subjectValue}
onChange={(e)=>setSubjectValue(e.target.value)}
placeholder="Subject"
className="input flex-1"
/>

<input
value={levelValue}
onChange={(e)=>setLevelValue(e.target.value)}
placeholder="Level"
className="input flex-1"
/>

<button
type="button"
onClick={handleAddSubject}
className="bg-[#006A6A] text-white px-4 rounded-md"
>
Add
</button>

</div>

<div className="flex flex-wrap gap-2">

{subjects.map((item,idx)=>{

const [sub,lvl] = item.split("|");

return(
<span key={idx} className="px-2 py-1 bg-[#E6F4F1] text-[#006A6A] text-xs rounded-full">
{sub} ({lvl})
</span>
)

})}

</div>

</FormField>

<FormField label="Hourly Rate (Rs)" required>

<input
id="rate"
className="input"
placeholder="500"
value={rate}
onChange={(e)=>setRate(e.target.value)}
required
/>

{/* 🔽 ADD THIS EXACTLY HERE */}
<p className="text-xs text-gray-500 mt-1">
  TutorSewa focuses on affordable learning. Lower pricing helps you reach more students.
</p>

<p className="text-xs text-[#004B4B] mt-1">
  You earn <span className="font-semibold">85%</span> of this amount. 
  Platform fee: <span className="font-semibold">15%</span>.
</p>

</FormField>

</Section>

{/* DOCUMENTS */}

<Section title="Academic / Identity Verification">

<FormField label="Upload Teaching Certificate (Image)" required>

<label className="cursor-pointer input flex justify-between">

<span>{certificateName || "Choose Image"}</span>

<input
ref={certificateRef}
type="file"
accept="image/*"
className="hidden"
onChange={(e)=>setCertificateName(e.target.files?.[0]?.name || "")}
required
/>

</label>

</FormField>

<FormField label="Upload Citizenship Card Photo (Image)" required>

<label className="cursor-pointer input flex justify-between">

<span>{citizenshipName || "Choose Image"}</span>

<input
ref={citizenshipRef}
type="file"
accept="image/*"
className="hidden"
onChange={(e)=>setCitizenshipName(e.target.files?.[0]?.name || "")}
required
/>

</label>

</FormField>

</Section>

<button
disabled={loading}
className="bg-[#006A6A] w-full text-white py-3 rounded-xl text-lg font-semibold"
>
{loading ? "Submitting..." : "Submit for Approval"}
</button>

</form>

</div>

{showVerifyModal && (
<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
<TutorVerifyModal email={verifyEmail}/>
</div>
)}

</div>

);

}

function Section({title,children}:any){
return(
<section className="bg-white p-5 rounded-xl border shadow-sm">
<h2 className="text-lg font-semibold text-[#006A6A] border-b pb-2 mb-3">
{title}
</h2>
{children}
</section>
)
}

function FormField({label,required,children}:any){
return(
<div className="mb-4">
<label className="block font-medium text-[#004B4B] mb-1 text-sm">
{label} {required && <span className="text-red-500">*</span>}
</label>
{children}
</div>
)
}

