// export default function CTASection() {
//   return (
//     <section className="bg-[#006A6A] text-center text-white py-10">
//       <h2 className="text-lg font-semibold mb-2">Ready to Start Your Learning Journey?</h2>
//       <p className="text-sm mb-6">Join thousands of students who are already improving their skills with TutorSewa.</p>
//       <div className="space-x-4">
//         <button className="bg-white text-[#006A6A] px-5 py-2 rounded-md hover:bg-gray-100 transition">
//           Get Started as Student
//         </button>
//         <button className="border border-white px-5 py-2 rounded-md hover:bg-white hover:text-[#006A6A] transition">
//           Become a Tutor
//         </button>
//       </div>
//     </section>
//   );
// }


"use client";

import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative bg-gradient-to-r from-[#009999] to-[#004B4B] text-white py-24 overflow-hidden">

      {/* 🌊 WAVE LAYER 1 */}
      <div className="absolute bottom-0 left-0 w-[200%] animate-waveSlow">
        <svg viewBox="0 0 1440 320" className="w-full">
          <path
  fill="#004B4B"
  fillOpacity="0.6"
  d="M0,256L80,272C160,288,320,320,480,304C640,288,800,224,960,202.7C1120,181,1280,203,1360,213.3L1440,224L1440,320L0,320Z"
/>
        </svg>
      </div>

      {/* 🌊 WAVE LAYER 2 */}
      <div className="absolute bottom-0 left-0 w-[200%] animate-waveMedium">
        <svg viewBox="0 0 1440 320" className="w-full">
         <path
  fill="#006A6A"
  fillOpacity="0.45"
  d="M0,240L80,250C160,260,320,280,480,270C640,260,800,220,960,210C1120,200,1280,230,1360,245L1440,260L1440,320L0,320Z"
/>
        </svg>
      </div>

      {/* 🌊 WAVE LAYER 3 */}
      <div className="absolute bottom-0 left-0 w-[200%] animate-waveFast">
        <svg viewBox="0 0 1440 320" className="w-full">
          <path
  fill="#008C8C"
  fillOpacity="0.35"
  d="M0,220L80,230C160,240,320,250,480,240C640,230,800,210,960,205C1120,200,1280,215,1360,225L1440,240L1440,320L0,320Z"
/>
        </svg>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold mb-4">
          Ready to Start Your Learning Journey?
        </h2>

        <p className="text-sm mb-8 text-white/90">
          Join thousands of students improving their skills with TutorSewa.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/register"
            className="bg-white text-[#006A6A] px-6 py-3 rounded-md hover:bg-gray-100 transition font-medium"
          >
            Get Started as Student
          </Link>

          <Link
            href="/tutor/auth"
            className="border border-white px-6 py-3 rounded-md hover:bg-white hover:text-[#006A6A] transition font-medium"
          >
            Become a Tutor
          </Link>
        </div>
      </div>

      {/* 🌊 ANIMATION SPEEDS */}
      <style jsx>{`
        .animate-waveSlow {
          animation: waveMove 22s linear infinite;
        }

        .animate-waveMedium {
          animation: waveMove 15s linear infinite reverse;
        }

        .animate-waveFast {
          animation: waveMove 10s linear infinite;
        }

        @keyframes waveMove {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}