// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { signIn } from "next-auth/react";
// import toast, { Toaster } from "react-hot-toast";
// import { motion, AnimatePresence } from "framer-motion";

// export default function RegisterPage() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     phone: "",
//     grade: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [agree, setAgree] = useState(false);
//   const [showVerifyModal, setShowVerifyModal] = useState(false);

//   // Handle form submit
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!agree) {
//       toast.error("You must agree to the Terms and Conditions before registering.");
//       return;
//     }

//     setLoading(true);
//     const res = await fetch("/api/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });

//     const data = await res.json();
//     setLoading(false);

//     if (!res.ok) {
//       toast.error(data.error || "Something went wrong!");
//       return;
//     }

//     toast.success("Registration successful!");
//     setShowVerifyModal(true); // Show verification modal
//   };

//   const handleResendVerification = () => {
//     toast.success("Verification email resent!");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#F2EFE7] relative">
//       <Toaster position="top-right" />

//       <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row md:w-[900px] z-10">
//         {/* LEFT SIDE */}
//         <div className="flex-1 p-8">
//           <h3 className="text-[#48A6A7] font-semibold">Join TutorSewa!</h3>
//           <h1 className="text-2xl font-bold text-[#006A6A] mb-6">Create Your Account</h1>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input type="text" placeholder="Full Name" className="w-full border rounded-md p-2 focus:ring-[#48A6A7]"
//               onChange={(e) => setForm({ ...form, name: e.target.value })} required />

//             <input type="email" placeholder="Email" className="w-full border rounded-md p-2 focus:ring-[#48A6A7]"
//               onChange={(e) => setForm({ ...form, email: e.target.value })} required />

//             <input type="password" placeholder="Password" className="w-full border rounded-md p-2 focus:ring-[#48A6A7]"
//               onChange={(e) => setForm({ ...form, password: e.target.value })} required />

//             <input type="password" placeholder="Confirm Password" className="w-full border rounded-md p-2 focus:ring-[#48A6A7]"
//               onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />

//             <input type="text" placeholder="Phone Number" className="w-full border rounded-md p-2 focus:ring-[#48A6A7]"
//               onChange={(e) => setForm({ ...form, phone: e.target.value })} />

//             <input type="text" placeholder="Grade/Level" className="w-full border rounded-md p-2 focus:ring-[#48A6A7]"
//               onChange={(e) => setForm({ ...form, grade: e.target.value })} />

//             {/* Terms */}
//             <div className="flex items-center space-x-2 text-sm">
//               <input type="checkbox" id="terms" checked={agree}
//                 onChange={() => setAgree(!agree)}
//                 className="accent-[#006A6A]" />

//               <label htmlFor="terms" className="text-gray-700">
//                 I accept the{" "}
//                 <a href="/terms" className="text-[#006A6A] underline">terms and conditions</a>
//               </label>
//             </div>

//             <button type="submit" disabled={loading}
//               className="w-full bg-[#006A6A] text-white py-2 rounded-md hover:bg-[#005454] transition">
//               {loading ? "Registering..." : "Register"}
//             </button>
//           </form>

//           <div className="text-center mt-4 text-gray-600 text-sm">Or continue with</div>

//           {/* GOOGLE LOGIN */}
//           <button
//             type="button"
//             onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
//             className="w-full border rounded-md py-2 mt-3 flex justify-center items-center gap-2 hover:bg-gray-50 transition"
//           >
//             <Image src="/google.svg" alt="Google" width={20} height={20} />
//             Google
//           </button>

//           <p className="text-xs text-center text-gray-500 mt-4">
//             By signing up, you agree to our{" "}
//             <a href="#" className="underline">Terms of Service</a> and{" "}
//             <a href="#" className="underline">Privacy Policy</a>.
//           </p>
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="hidden md:flex flex-col justify-center bg-[#48A6A7]/20 w-1/2 p-8 text-[#004B4B]">
//           <Image src="/online-class.jpg" alt="Online Learning" width={300} height={180}
//             className="rounded-md mx-auto mb-4" />

//           <h4 className="font-semibold text-[#006A6A] text-center">Start Your Learning Journey</h4>
//           <ul className="text-sm mt-3 space-y-1 mx-auto">
//             <li>✅ Access to 500+ expert tutors</li>
//             <li>✅ Flexible scheduling</li>
//             <li>✅ Secure payment system</li>
//           </ul>
//         </div>
//       </div>

//       {/* EMAIL VERIFICATION MODAL */}
//       <AnimatePresence>
//         {showVerifyModal && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

//             <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
//               className="bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6 text-center border-t-4 border-[#FFD93D]">

//               <h2 className="text-2xl font-bold text-[#006A6A] mb-3">Verify your email</h2>
//               <p className="text-gray-600 mb-6">
//                 Hi <strong>{form.name || "User"}</strong>, check the link sent to{" "}
//                 <strong className="text-[#48A6A7]">{form.email}</strong>.
//               </p>

//               {/* <button onClick={handleResendVerification}
//                 className="bg-[#006A6A] text-white px-6 py-2 rounded-md hover:bg-[#005454]">
//                 Resend Verification Email
//               </button> */}

//               <button onClick={() => setShowVerifyModal(false)}
//                 className="mt-6 text-sm text-gray-500 underline">
//                 Close
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }



// // "use client";

// // import { useState } from "react";
// // import Image from "next/image";
// // import { signIn } from "next-auth/react";
// // import toast, { Toaster } from "react-hot-toast";
// // import { motion, AnimatePresence } from "framer-motion";

// // export default function RegisterPage() {
// //   const [form, setForm] = useState({
// //     name: "",
// //     email: "",
// //     password: "",
// //     confirmPassword: "",
// //     phone: "",
// //     grade: "",
// //   });

// //   const [loading, setLoading] = useState(false);
// //   const [agree, setAgree] = useState(false);
// //   const [showVerifyModal, setShowVerifyModal] = useState(false);

// //   // ------------------------
// //   // SUBMIT HANDLER
// //   // ------------------------
// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();

// //     if (!agree) {
// //       toast.error("Please accept the Terms & Conditions.");
// //       return;
// //     }

// //     setLoading(true);
// //     const res = await fetch("/api/register", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(form),
// //     });

// //     const data = await res.json();
// //     setLoading(false);

// //     if (!res.ok) {
// //       toast.error(data.error || "Registration failed");
// //       return;
// //     }

// //     toast.success("Verification email sent!");
// //     setShowVerifyModal(true);
// //   };

// //   const handleResendVerification = () => {
// //     toast.success("Verification email resent!");
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-[#F2EFE7] relative">
// //       <Toaster position="top-right" />

// //       {/* MAIN CONTAINER */}
// //       <div className="bg-white rounded-xl shadow-md flex flex-col md:flex-row md:w-[900px] overflow-hidden z-10">

// //         {/* LEFT PANEL */}
// //         <div className="flex-1 p-8">
// //           <h3 className="text-[#48A6A7] font-semibold">Join TutorSewa!</h3>
// //           <h1 className="text-2xl font-bold text-[#006A6A] mb-6">Create Your Account</h1>

// //           <form onSubmit={handleSubmit} className="space-y-4">

// //             <input
// //               type="text"
// //               placeholder="Full Name"
// //               className="w-full border rounded-md p-2 focus:ring-[#48A6A7]"
// //               onChange={(e) => setForm({ ...form, name: e.target.value })}
// //               required
// //             />

// //             <input
// //               type="email"
// //               placeholder="Email"
// //               className="w-full border rounded-md p-2 focus:ring-[#48A6A7]"
// //               onChange={(e) => setForm({ ...form, email: e.target.value })}
// //               required
// //             />

// //             <input
// //               type="password"
// //               placeholder="Password"
// //               className="w-full border rounded-md p-2 focus:ring-[#48A6A7]"
// //               onChange={(e) => setForm({ ...form, password: e.target.value })}
// //               required
// //             />

// //             <input
// //               type="password"
// //               placeholder="Confirm Password"
// //               className="w-full border rounded-md p-2 focus:ring-[#48A6A7]"
// //               onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
// //               required
// //             />

// //             <input
// //               type="text"
// //               placeholder="Phone Number"
// //               className="w-full border rounded-md p-2 focus:ring-[#48A6A7]"
// //               onChange={(e) => setForm({ ...form, phone: e.target.value })}
// //             />

// //             <input
// //               type="text"
// //               placeholder="Grade/Level"
// //               className="w-full border rounded-md p-2 focus:ring-[#48A6A7]"
// //               onChange={(e) => setForm({ ...form, grade: e.target.value })}
// //             />

// //             {/* TERMS */}
// //             <div className="flex items-center space-x-2 text-sm">
// //               <input
// //                 type="checkbox"
// //                 checked={agree}
// //                 onChange={() => setAgree(!agree)}
// //                 className="accent-[#006A6A]"
// //               />
// //               <label className="text-gray-700">
// //                 I accept the{" "}
// //                 <a href="/terms" className="underline text-[#006A6A]">
// //                   terms and conditions
// //                 </a>
// //               </label>
// //             </div>

// //             <button
// //               type="submit"
// //               disabled={loading}
// //               className="w-full bg-[#006A6A] text-white py-2 rounded-md hover:bg-[#005454]"
// //             >
// //               {loading ? "Registering..." : "Register"}
// //             </button>
// //           </form>

// //           {/* Divider */}
// //           <div className="text-center mt-4 text-gray-600 text-sm">Or continue with</div>

// //           {/* GOOGLE LOGIN BUTTON */}
// //           <button
// //             onClick={() => signIn("google", { callbackUrl: "/login" })}
// //             className="w-full border rounded-md py-2 mt-3 flex justify-center items-center gap-2 hover:bg-gray-50"
// //           >
// //             <Image src="/google.svg" alt="Google" width={20} height={20} />
// //             Google
// //           </button>
// //         </div>

// //         {/* RIGHT PANEL */}
// //         <div className="hidden md:flex flex-col justify-center bg-[#48A6A7]/20 w-1/2 p-8">
// //           <Image
// //             src="/online-class.jpg"
// //             alt="Online Learning"
// //             width={300}
// //             height={180}
// //             className="rounded-md mx-auto mb-4"
// //           />
// //           <h4 className="font-semibold text-[#006A6A] text-center">
// //             Start Your Learning Journey
// //           </h4>
// //           <ul className="text-sm mt-3 space-y-1 mx-auto">
// //             <li>✅ Access to 500+ expert tutors</li>
// //             <li>✅ Flexible scheduling</li>
// //             <li>✅ Secure payment system</li>
// //           </ul>
// //         </div>
// //       </div>

// //       {/* ------------------------------------------------------
// //             EMAIL VERIFICATION MODAL
// //       ------------------------------------------------------ */}
// //       <AnimatePresence>
// //         {showVerifyModal && (
// //           <motion.div
// //             initial={{ opacity: 0 }}
// //             animate={{ opacity: 1 }}
// //             exit={{ opacity: 0 }}
// //             className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
// //           >
// //             <motion.div
// //               initial={{ scale: 0.8 }}
// //               animate={{ scale: 1 }}
// //               exit={{ scale: 0.8 }}
// //               className="bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6 text-center border-t-4 border-[#FFD93D]"
// //             >
// //               <h2 className="text-2xl font-bold text-[#006A6A] mb-3">
// //                 Verify your email
// //               </h2>

// //               <p className="text-gray-600 mb-6">
// //                 Hi <strong>{form.name || "User"}</strong>, a verification link has been sent to: <br />
// //                 <strong className="text-[#48A6A7]">{form.email}</strong>
// //               </p>

// //               <button
// //                 onClick={handleResendVerification}
// //                 className="bg-[#006A6A] text-white px-6 py-2 rounded-md hover:bg-[#005454]"
// //               >
// //                 Resend Verification Email
// //               </button>

// //               <button
// //                 onClick={() => setShowVerifyModal(false)}
// //                 className="mt-6 text-sm text-gray-500 underline"
// //               >
// //                 Close
// //               </button>
// //             </motion.div>
// //           </motion.div>
// //         )}
// //       </AnimatePresence>
// //     </div>
// //   );
// // }



"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    grade: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  // ----------------------------
  // REAL-TIME VALIDATION HANDLER
  // ----------------------------
  const validateField = (name: string, value: string) => {
    let msg = "";

    switch (name) {
      case "name":
        if (!/^[A-Za-z ]+$/.test(value)) msg = "Name must contain only alphabets.";
        break;

      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          msg = "Invalid email format.";
        break;

      case "phone":
  if (!/^\d+$/.test(value)) msg = "Phone must contain digits only.";
  else if (value.length !== 10) msg = "Phone number must be exactly 10 digits.";
  break;

      case "password":
        if (value.length < 8) msg = "At least 8 characters required.";
        // else if (!/[A-Z]/.test(value)) msg = "One uppercase letter required.";
        else if (!/[a-z]/.test(value)) msg = "One lowercase letter required.";
        else if (!/[0-9]/.test(value)) msg = "One number required.";
        else if (!/[!@#$%^&*]/.test(value))
          msg = "One special character required (!@#$%^&*)";
        break;

      case "confirmPassword":
        if (value !== form.password) msg = "Passwords do not match.";
        break;
    }

    setErrors((prev: any) => ({ ...prev, [name]: msg }));
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  // ----------------------------
  // SUBMIT HANDLER
  // ----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agree) {
      toast.error("You must accept Terms & Conditions.");
      return;
    }

    // check for any existing errors
    for (let key in errors) {
      if (errors[key]) {
        toast.error("Fix the highlighted errors first.");
        return;
      }
    }

    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Registration failed!");
      return;
    }

    toast.success("Account created! Please verify your email.");
    setShowVerifyModal(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2EFE7] relative">
      <Toaster />

      {/* MAIN CARD */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row md:w-[900px] z-10">

        {/* LEFT SIDE */}
        <div className="flex-1 p-8">
          <h3 className="text-[#48A6A7] font-semibold">Join TutorSewa!</h3>
          <h1 className="text-2xl font-bold text-[#006A6A] mb-6">
            Create Your Account
          </h1>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* FULL NAME */}
            <div>
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                className={`w-full border rounded-md p-2 ${
                  errors.name ? "border-red-500" : ""
                }`}
                onChange={handleChange}
                required
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email"
                className={`w-full border rounded-md p-2 ${
                  errors.email ? "border-red-500" : ""
                }`}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD WITH TOGGLE */}
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`w-full border rounded-md p-2 ${
                  errors.password ? "border-red-500" : ""
                }`}
                onChange={handleChange}
                required
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>

              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                className={`w-full border rounded-md p-2 ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
                onChange={handleChange}
                required
              />

              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>

              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <input
                name="phone"
                type="text"
                placeholder="Phone Number"
                className={`w-full border rounded-md p-2 ${
                  errors.phone ? "border-red-500" : ""
                }`}
                onChange={handleChange}
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* GRADE */}
            <input
              name="grade"
              type="text"
              placeholder="Grade/Level"
              className="w-full border rounded-md p-2"
              onChange={handleChange}
            />

            {/* TERMS */}
            <div className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
                className="accent-[#006A6A]"
              />
              <label className="text-gray-700">
                I accept the{" "}
                <a href="/terms" className="text-[#006A6A] underline">
                  Terms and Conditions
                </a>
              </label>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#006A6A] text-white py-2 rounded-md hover:bg-[#005454] transition"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {/* GOOGLE LOGIN */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full border rounded-md py-2 mt-3 flex justify-center items-center gap-2 hover:bg-gray-50 transition"
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            Google
          </button>
        </div>

        {/* RIGHT SIDE IMAGE PANEL */}
        <div className="hidden md:flex flex-col justify-center bg-[#48A6A7]/20 w-1/2 p-8 text-[#004B4B]">
          <Image
            src="/online-class.jpg"
            alt="Online Learning"
            width={300}
            height={180}
            className="rounded-md mx-auto mb-4"
          />
          <h4 className="font-semibold text-[#006A6A] text-center">
            Start Your Learning Journey
          </h4>
          <ul className="text-sm mt-3 space-y-1 mx-auto">
            <li>✅ Access to 500+ expert tutors</li>
            <li>✅ Flexible scheduling</li>
            <li>✅ Secure payment system</li>
          </ul>
        </div>
      </div>

      {/* EMAIL VERIFICATION MODAL */}
      <AnimatePresence>
        {showVerifyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6 text-center border-t-4 border-[#FFD93D]"
            >
              <h2 className="text-2xl font-bold text-[#006A6A] mb-3">
                Verify your email
              </h2>
              <p className="text-gray-600 mb-6">
                A verification link has been sent to:
                <br />
                <strong className="text-[#48A6A7]">{form.email}</strong>
              </p>

              <button
                onClick={() => setShowVerifyModal(false)}
                className="mt-4 text-sm text-gray-500 underline"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
