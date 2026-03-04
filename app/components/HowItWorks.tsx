// export default function HowItWorks() {
//   const steps = [
//     { title: "1. Search", desc: "Browse thousands of qualified tutors by subjects, availability and price." },
//     { title: "2. Book & Pay", desc: "Book your preferred tutor and pay securely." },
//     { title: "3. Learn", desc: "Start learning online with interactive sessions." }
//   ];

//   return (
//     <section className="py-12 text-center">
//       <h2 className="font-semibold text-xl underline underline-offset-4 mb-8">How It Works</h2>
//       <div className="flex flex-col md:flex-row justify-center gap-6">
//         {steps.map((step) => (
//           <div key={step.title} className="bg-white p-6 rounded-xl shadow-md w-64">
//             <h3 className="font-semibold mb-2">{step.title}</h3>
//             <p className="text-sm text-gray-600">{step.desc}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }


"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import humanAnimation from "@/public/humanwork.json";
import teachAnimation from "@/public/teach.json";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

export default function HowItWorks() {
  const steps = [
    {
      title: "1. Search",
      desc: "Browse thousands of qualified tutors by subjects, availability and price.",
    },
    {
      title: "2. Book & Pay",
      desc: "Book your preferred tutor and pay securely.",
    },
    {
      title: "3. Learn",
      desc: "Start learning online with interactive sessions.",
    },
  ];

  return (
    <section className="py-14 bg-[#F9F9F9] text-center overflow-hidden">

      <h2 className="font-semibold text-2xl text-[#006A6A] underline underline-offset-4 mb-12">
        How It Works
      </h2>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12">

        {/* LEFT BIG ANIMATION */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="hidden lg:block"
        >
          <Lottie
            animationData={humanAnimation}
            loop
            className="w-80"
          />
        </motion.div>

        {/* STEPS */}
        <div className="flex flex-col md:flex-row gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg w-72 hover:shadow-2xl transition"
            >
              <h3 className="font-semibold text-[#004B4B] mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* RIGHT BIG ANIMATION */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="hidden lg:block"
        >
          <Lottie
            animationData={teachAnimation}
            loop
            className="w-80"
          />
        </motion.div>

      </div>
    </section>
  );
}