// import { SiFacebook, SiInstagram } from "react-icons/si";

// export default function Footer() {
//   return (
//     <footer className="bg-[#F2EFE7] text-[#004B4B] py-10 px-6 md:px-20">
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
//         {/* Logo & Description */}
//         <div>
//           <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
//             🎓 TutorSewa
//           </h3>
//           <p className="text-[#004B4B]/90 leading-relaxed mb-4">
//             Connecting students with expert tutors for personalized learning experiences.
//           </p>
//           <div className="flex space-x-3">
//             <a
//               href="#"
//               className="hover:text-[#E2F6F6] hover:scale-110 transform transition-all duration-200"
//             >
//               <SiFacebook size={18} />
//             </a>
//             <a
//               href="#"
//               className="hover:text-[#E2F6F6] hover:scale-110 transform transition-all duration-200"
//             >
//               <SiInstagram size={18} />
//             </a>
//           </div>
//         </div>

//         {/* For Students */}
//         <div>
//           <h4 className="font-semibold mb-3 text-[#004B4B]">For Students</h4>
//           <ul className="space-y-2 text-[#004B4B]/90">
//             <li><a href="/find-tutor" className="hover:underline">Find Tutors</a></li>
//             <li><a href="#how-it-works" className="hover:underline">How It Works</a></li>
//             <li><a href="#" className="hover:underline">Pricing</a></li>
//             <li><a href="#" className="hover:underline">Success Stories</a></li>
//           </ul>
//         </div>

//         {/* For Tutors */}
//         <div>
//           <h4 className="font-semibold mb-3 text-[#004B4B]">For Tutors</h4>
//           <ul className="space-y-2 text-[#004B4B]/90">
//             <li><a href="/become-tutor" className="hover:underline">Become a Tutor</a></li>
//             <li><a href="#" className="hover:underline">Tutor Guidelines</a></li>
//             <li><a href="#" className="hover:underline">Earnings</a></li>
//             <li><a href="#" className="hover:underline">Resources</a></li>
//           </ul>
//         </div>

//         {/* Support */}
//         <div>
//           <h4 className="font-semibold mb-3 text-[#004B4B]">Support</h4>
//           <ul className="space-y-2 text-[#004B4B]/90">
//             <li><a href="#" className="hover:underline">Help Center</a></li>
//             <li><a href="#contact-us" className="hover:underline">Contact Us</a></li>
//             <li><a href="#" className="hover:underline">Privacy Policy</a></li>
//             <li><a href="#" className="hover:underline">Terms of Service</a></li>
//           </ul>
//         </div>
//       </div>

//       {/* Divider */}
//       <div className="border-t border-white/30 mt-8 pt-4 text-center text-xs text-[#004B4B]/80">
//         © {new Date().getFullYear()} TutorSewa. All rights reserved.
//       </div>
//     </footer>
//   );
// }

"use client";

import Link from "next/link";
import { SiFacebook, SiInstagram } from "react-icons/si";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#F2EFE7] text-[#004B4B] py-12 px-6 md:px-20">

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">

        {/* BRAND */}
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-3">
  <Image
    src="/tutorsewa-logo.png"
    alt="TutorSewa Logo"
    width={60}
    height={60}
  />
  <span className="text-xl font-bold">TutorSewa</span>
</div>

          <p className="text-[#004B4B]/90 mb-4 max-w-xs">
            Empowering students with affordable, accessible, and interactive
            learning experiences through trusted tutors.
          </p>

          <div className="flex space-x-3">
            <a href="#" className="hover:scale-110 transition">
              <SiFacebook size={18} />
            </a>
            <a href="#" className="hover:scale-110 transition">
              <SiInstagram size={18} />
            </a>
          </div>
        </div>

        {/* STUDENTS */}
        <div>
          <h4 className="font-semibold mb-3">Students</h4>
          <ul className="space-y-2">
            <li><Link href="/find-tutor">Find Tutors</Link></li>
            <li><Link href="/how-it-works">How It Works</Link></li>
            <li><Link href="/register">Get Started</Link></li>
          </ul>
        </div>

        {/* TUTORS */}
        <div>
          <h4 className="font-semibold mb-3">Tutors</h4>
          <ul className="space-y-2">
            <li><Link href="/tutor/auth">Become a Tutor</Link></li>
            <li><Link href="/tutor/login">Tutor Login</Link></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h4 className="font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-[#004B4B]/90">
            <li>
              <Link href="/help" className="hover:underline">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/#contact-us" className="hover:underline">
                Contact Us
              </Link>
            </li>
            <li>
              <span className="opacity-70">Privacy Policy</span>
            </li>
            <li>
              <span className="opacity-70">Terms of Service</span>
            </li>
          </ul>
        </div>

      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="border-t mt-10 pt-4 flex flex-col md:flex-row justify-between items-center text-xs">
        <p>© {new Date().getFullYear()} TutorSewa. All rights reserved.</p>

        <div className="flex gap-4 mt-2 md:mt-0">
          <span className="opacity-70">Privacy</span>
          <span className="opacity-70">Terms</span>
        </div>
      </div>

    </footer>
  );
}