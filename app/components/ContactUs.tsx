// export default function ContactUs() {
//   return (
//     <section id="contact-us" className="py-16 px-6 md:px-12 bg-[#F6F6F6] text-center">
//       <h2 className="text-xl font-semibold text-[#004B4B] underline underline-offset-4 mb-6">
//         Contact Us
//       </h2>
//       <p className="text-gray-700 mb-8">
//         Have questions? Reach out to our team — we’d love to hear from you!
//       </p>

//       <div className="flex flex-col md:flex-row justify-center gap-6 text-sm">
//         <div>
//           <h3 className="font-semibold mb-2 text-[#006A6A]">📧 Email</h3>
//           <p>support@tutorsewa.com</p>
//         </div>
//         <div>
//           <h3 className="font-semibold mb-2 text-[#006A6A]">📞 Phone</h3>
//           <p>+977-9800000000</p>
//         </div>
//       </div>
//     </section>
//   );
// }



"use client";

import dynamic from "next/dynamic";
import contactAnimation from "@/public/contact.json";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

export default function ContactUs() {
  return (
    <section
      id="contact-us"
     className="py-8 px-6 md:px-12 bg-[#F6F6F6]"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-0">

        {/* LEFT SIDE - CONTACT INFO */}
        <div className="md:w-1/2">

          <h2 className="text-2xl font-semibold text-[#004B4B] mb-4">
            Contact Us
          </h2>

          <p className="text-gray-700 mb-8 text-sm">
            Have questions? Reach out to our team — we’d love to hear from you!
          </p>

          <div className="space-y-4">

            {/* Email Card */}
            <div className="bg-white px-6 py-4 rounded-lg shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-[#006A6A] text-base">
                📧 Email
              </h3>
              <p className="text-gray-600 text-sm">
                support@tutorsewa.com
              </p>
            </div>

            {/* Phone Card */}
            <div className="bg-white px-6 py-4 rounded-lg shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-[#006A6A] text-base">
                📞 Phone
              </h3>
              <p className="text-gray-600 text-sm">
                +977-9800000000
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE - BIGGER LOTTIE */}
        <div className="md:w-1/2 flex justify-center">
          <Lottie
  animationData={contactAnimation}
  loop
  className="w-[500px] max-h-[350px]"
/>
        </div>

      </div>
    </section>
  );
}