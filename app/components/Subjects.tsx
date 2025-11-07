"use client";
import { Book, FlaskConical, Globe, Laptop, Sigma,Brain,PenTool} from "lucide-react";

export default function Subjects() {
  const subjects = [
    { name: "Physics", icon: <Sigma size={30} /> },
    { name: "Chemistry", icon: <FlaskConical size={30} /> },
    { name: "History", icon: <Globe size={30} /> },
     { name: "Web Development", icon: <Laptop size={30} /> },
    { name: "Computer.S", icon: <Laptop size={30} /> },
     { name: "Graphic Design", icon: <PenTool size={30} /> },
    { name: "Mathematics", icon: <Book size={30} /> },
    { name: "Biology", icon: <FlaskConical size={30} /> },
    { name: "Economics", icon: <Globe size={30} /> },
    { name: "Artificial Intelligence", icon: <Brain size={30} /> },
     { name: "Nepali", icon: <Book size={30} /> },
  ];

  return (
    <section className="py-12 bg-[#F6F6F6] text-center overflow-hidden">
      <h2 className="font-semibold text-xl underline underline-offset-4 mb-8">
        Popular Subjects
      </h2>

      <div className="relative w-full overflow-hidden">
        <div className="flex animate-scroll gap-12 whitespace-nowrap">
          {[...subjects, ...subjects].map((sub, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center min-w-[120px] text-[#004B4B]"
            >
              <div className="mb-2">{sub.icon}</div>
              <p className="text-sm font-medium">{sub.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
