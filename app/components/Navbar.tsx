'use client';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/tutorsewa-logo.png'; 

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 md:px-12 py-4 bg-[#F2EFE7] shadow-sm sticky top-0 z-50">
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

      {/* Nav Links (hidden on mobile) */}
      <div className="hidden md:flex space-x-6 text-sm text-[#004B4B] font-medium">
        <Link href="/" className="hover:text-[#006A6A] transition">Home</Link>
        <Link href="/find-tutor" className="hover:text-[#006A6A] transition">Find Tutors</Link>
        <Link href="#how-it-works" className="hover:text-[#006A6A] transition">How It Works</Link>
        <Link href="#about-us" className="hover:text-[#006A6A] transition">About Us</Link>
        <Link href="#contact-us" className="hover:text-[#006A6A] transition">Contact Us</Link>
      </div>

      {/* Buttons */}
      <div className="space-x-2">
        <button className="border border-[#006A6A] text-[#006A6A] px-4 py-1 rounded-md hover:bg-[#006A6A] hover:text-white transition">
          Log In
        </button>
        <button className="bg-[#006A6A] text-white px-4 py-1 rounded-md hover:bg-[#005454] transition">
          Register
        </button>
      </div>
    </nav>
  );
}
