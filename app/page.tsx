import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import PopularSubjects from "./components/Subjects";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <PopularSubjects />
      <AboutUs />
      <ContactUs />
      <CTASection />
      <Footer />
    </main>
  );
}
