
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import VideoSection from "./components/VideoSection";
import PopularSubjects from "./components/Subjects";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <HowItWorks />
      <PopularSubjects />
      <AboutUs />
      <ContactUs />
      <CTASection />
       <VideoSection /> 
      <Footer />
    </main>
  );
}
