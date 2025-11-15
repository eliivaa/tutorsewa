'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/public/tutorsewa-logo.png';

export default function Navbar() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // const handleRedirect = (path: string) => {
  //   setIsTransitioning(true);
  //   // Add a small delay before navigating for smooth fade
  //   setTimeout(() => {
  //     router.push(path);
  //     // remove overlay after animation
  //     setTimeout(() => setIsTransitioning(false), 2000);
  //   }, 600);
  // };

  const handleRedirect = (path: string) => {
  setIsTransitioning(true);
  // ⏳ Delay navigation to allow the animation to play fully
  setTimeout(() => {
    router.push(path);
    setTimeout(() => setIsTransitioning(false), 3000);
  }, 1500); // stays on screen ~3s total
};


  return (
    <>
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-1 bg-[#F2EFE7] shadow-sm sticky top-0 z-50">
        {/* Logo + Brand */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src={logo}
              alt="TutorSewa Logo"
              width={70}
              height={70}
              className="cursor-pointer"
              priority
            />
          </Link>
          <Link href="/" className="flex items-center gap-1 text-xl font-bold">
            <span className="text-[#48A6A7]">TUTOR</span>
            <span className="text-[#006A6A]">SEWA</span>
          </Link>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-6 text-sm text-[#004B4B] font-medium">
          <Link href="/" className="hover:text-[#006A6A] transition">Home</Link>
          <Link href="/find-tutor" className="hover:text-[#006A6A] transition">Find Tutors</Link>
          <Link href="#how-it-works" className="hover:text-[#006A6A] transition">How It Works</Link>
          <Link href="#about-us" className="hover:text-[#006A6A] transition">About Us</Link>
          <Link href="#contact-us" className="hover:text-[#006A6A] transition">Contact Us</Link>
        </div>

        {/* Buttons */}
        <div className="space-x-2">
          <button
            onClick={() => handleRedirect('/login')}
            className="border border-[#006A6A] text-[#006A6A] px-4 py-1 rounded-md hover:bg-[#006A6A] hover:text-white transition"
          >
            Log In
          </button>
          <button
            onClick={() => handleRedirect('/register')}
            className="bg-[#006A6A] text-white px-4 py-1 rounded-md hover:bg-[#005454] transition"
          >
            Register
          </button>
        </div>
      </nav>

      {/* Animated Overlay Transition */}
      {/* <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-[#F2EFE7]"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <Image
                src="/tutorsewa-logo.png"
                alt="TutorSewa Logo"
                width={90}
                height={90}
                className="drop-shadow-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}

      <AnimatePresence>
  {isTransitioning && (
    <motion.div
      key="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#F2EFE7]"
    >
      {/* Logo Animation */}
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/tutorsewa-logo.png"
          alt="TutorSewa Logo"
          width={100}
          height={100}
          className="drop-shadow-lg"
        />
      </motion.div>

      {/* TUTOR SEWA Text Below Logo */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1.2 }}
        className="mt-4 text-2xl font-bold flex gap-1"
      >
        <span className="text-[#48A6A7]">TUTOR</span>
        <span className="text-[#006A6A]">SEWA</span>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </>
  );
}




// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';
// import Link from 'next/link';
// import { motion, AnimatePresence } from 'framer-motion';
// import logo from '@/public/tutorsewa-logo.png';

// export default function Navbar() {
//   const router = useRouter();
//   const [isTransitioning, setIsTransitioning] = useState(false);

//   const handleRedirect = (path: string) => {
//     setIsTransitioning(true);
//     // Delay navigation slightly for smooth animation
//     setTimeout(() => {
//       router.push(path);
//       // Remove overlay after transition ends
//       setTimeout(() => setIsTransitioning(false), 1000);
//     }, 500);
//   };

//   return (
//     <>
//       {/* NAVBAR */}
//       <nav className="flex justify-between items-center px-6 md:px-12 py-4 bg-[#F2EFE7] shadow-sm sticky top-0 z-50">
//         {/* Logo + Brand */}
//         <div className="flex items-center">
//           <Link href="/">
//             <Image
//               src={logo}
//               alt="TutorSewa Logo"
//               width={70}
//               height={70}
//               className="cursor-pointer"
//               priority
//             />
//           </Link>
//           <Link href="/" className="flex items-center gap-1 text-xl font-bold">
//             <span className="text-[#48A6A7]">TUTOR</span>
//             <span className="text-[#006A6A]">SEWA</span>
//           </Link>
//         </div>

//         {/* Nav Links */}
//         <div className="hidden md:flex space-x-6 text-sm text-[#004B4B] font-medium">
//           <Link href="/" className="hover:text-[#006A6A] transition">Home</Link>
//           <Link href="/find-tutor" className="hover:text-[#006A6A] transition">Find Tutors</Link>
//           <Link href="#how-it-works" className="hover:text-[#006A6A] transition">How It Works</Link>
//           <Link href="#about-us" className="hover:text-[#006A6A] transition">About Us</Link>
//           <Link href="#contact-us" className="hover:text-[#006A6A] transition">Contact Us</Link>
//         </div>

//         {/* Buttons */}
//         <div className="space-x-2">
//           <button
//             onClick={() => handleRedirect('/login')}
//             className="border border-[#006A6A] text-[#006A6A] px-4 py-1 rounded-md hover:bg-[#006A6A] hover:text-white transition"
//           >
//             Log In
//           </button>
//           <button
//             onClick={() => handleRedirect('/register')}
//             className="bg-[#006A6A] text-white px-4 py-1 rounded-md hover:bg-[#005454] transition"
//           >
//             Register
//           </button>
//         </div>
//       </nav>

//       {/* Expanding Circle Ripple Animation */}
//       <AnimatePresence>
//         {isTransitioning && (
//           <motion.div
//             key="overlay"
//             initial={{ scale: 0, opacity: 0 }}
//             animate={{ scale: 50, opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.9, ease: "easeInOut" }}
//             className="fixed inset-0 z-[999] flex items-center justify-center"
//           >
//             <motion.div
//               className="w-16 h-16 rounded-full bg-gradient-to-br from-[#48A6A7] to-[#006A6A] shadow-2xl"
//             />
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }



// bubble

// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';
// import Link from 'next/link';
// import { motion, AnimatePresence } from 'framer-motion';
// import logo from '@/public/tutorsewa-logo.png';

// export default function Navbar() {
//   const router = useRouter();
//   const [isTransitioning, setIsTransitioning] = useState(false);

//   const handleRedirect = (path: string) => {
//     setIsTransitioning(true);
//     // Small delay for animation effect
//     setTimeout(() => {
//       router.push(path);
//       // Remove overlay after navigation
//       setTimeout(() => setIsTransitioning(false), 1200);
//     }, 500);
//   };

//   return (
//     <>
//       {/* NAVBAR */}
//       <nav className="flex justify-between items-center px-6 md:px-12 py-4 bg-[#F2EFE7] shadow-sm sticky top-0 z-50">
//         {/* Logo + Brand */}
//         <div className="flex items-center">
//           <Link href="/">
//             <Image
//               src={logo}
//               alt="TutorSewa Logo"
//               width={70}
//               height={70}
//               className="cursor-pointer"
//               priority
//             />
//           </Link>
//           <Link href="/" className="flex items-center gap-1 text-xl font-bold">
//             <span className="text-[#48A6A7]">TUTOR</span>
//             <span className="text-[#006A6A]">SEWA</span>
//           </Link>
//         </div>

//         {/* Nav Links */}
//         <div className="hidden md:flex space-x-6 text-sm text-[#004B4B] font-medium">
//           <Link href="/" className="hover:text-[#006A6A] transition">Home</Link>
//           <Link href="/find-tutor" className="hover:text-[#006A6A] transition">Find Tutors</Link>
//           <Link href="#how-it-works" className="hover:text-[#006A6A] transition">How It Works</Link>
//           <Link href="#about-us" className="hover:text-[#006A6A] transition">About Us</Link>
//           <Link href="#contact-us" className="hover:text-[#006A6A] transition">Contact Us</Link>
//         </div>

//         {/* Buttons */}
//         <div className="space-x-2">
//           <button
//             onClick={() => handleRedirect('/login')}
//             className="border border-[#006A6A] text-[#006A6A] px-4 py-1 rounded-md hover:bg-[#006A6A] hover:text-white transition"
//           >
//             Log In
//           </button>
//           <button
//             onClick={() => handleRedirect('/register')}
//             className="bg-[#006A6A] text-white px-4 py-1 rounded-md hover:bg-[#005454] transition"
//           >
//             Register
//           </button>
//         </div>
//       </nav>

//       {/* 🫧 Floating Bubbles Transition */}
//       <AnimatePresence>
//         {isTransitioning && (
//           <motion.div
//             key="overlay"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.6 }}
//             className="fixed inset-0 z-[999] bg-[#006A6A] flex items-center justify-center overflow-hidden"
//           >
//             {Array.from({ length: 8 }).map((_, i) => (
//               <motion.div
//                 key={i}
//                 initial={{
//                   y: 0,
//                   x: Math.random() * 400 - 200,
//                   opacity: 0.8,
//                   scale: Math.random() * 0.5 + 0.8,
//                 }}
//                 animate={{
//                   y: [0, -300],
//                   opacity: [1, 0],
//                 }}
//                 transition={{
//                   duration: 1.5 + Math.random(),
//                   delay: i * 0.1,
//                   repeat: Infinity,
//                 }}
//                 className="w-4 h-4 bg-white rounded-full"
//               />
//             ))}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }
