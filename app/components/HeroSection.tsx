// import Image from 'next/image';
// import Link from 'next/link';
// import heroImage from '@/public/Online-Tutoring.png';

// export default function HeroSection() {
//   return (
//     <section className="flex flex-col md:flex-row justify-between items-center px-12 py-12 bg-[#F6F6F6]">
//       <div>
//         <h1 className="text-3xl font-bold text-[#004B4B] mb-6">
//           Unlock Your Potential <br /> with Expert Tutors!
//         </h1>
//         <div className="space-x-4">
//           <button className="bg-[#006A6A] text-white px-5 py-2 rounded-md hover:bg-[#005454] transition">
//             Get Started as Student
//           </button>

//           {/* <Link href="/tutor/register"> */}
//           <Link href="/tutor/auth">

//             <button className="border border-[#006A6A] text-[#006A6A] px-5 py-2 rounded-md hover:bg-[#006A6A] hover:text-white transition">
//               Become a Tutor
//             </button>
//           </Link>
//         </div>
//       </div>
//       <Image src={heroImage} alt="Online Tutoring" className="w-80 md:w-96 mt-8 md:mt-0 rounded-md" />
//     </section>
//   );
// }


"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import heroImage from "@/public/Online-Tutoring.png";
import animationData from "@/public/Book loading.json";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

export default function HeroSection() {
  return (
   <section className="flex flex-col md:flex-row items-center px-20 py-16 bg-[#F6F6F6]">

  {/* LEFT TEXT */}
  <div className="max-w-lg">
    <h1 className="text-4xl font-bold text-[#004B4B] mb-6 leading-tight">
      Unlock Your Potential <br /> with Expert Tutors!
    </h1>

    <div className="space-x-4">
      <Link href="/register">
  <button className="bg-[#006A6A] text-white px-6 py-3 rounded-md hover:bg-[#005454] transition">
    Get Started as Student
  </button>
</Link>

      <Link href="/tutor/auth">
        <button className="border border-[#006A6A] text-[#006A6A] px-6 py-3 rounded-md hover:bg-[#006A6A] hover:text-white transition">
          Become a Tutor
        </button>
      </Link>
    </div>
  </div>

  {/* SPACER */}
  <div className="flex-1" />

  {/* ANIMATION */}
  <div className="hidden md:block mr-8">
    <Lottie
      animationData={animationData}
      loop
      className="w-64"
    />
  </div>

  {/* IMAGE */}
  <div>
    <Image
      src={heroImage}
      alt="Online Tutoring"
      className="w-[420px] rounded-md"
    />
  </div>

</section>
  );
}