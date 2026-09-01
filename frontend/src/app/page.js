import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Tracking from "@/components/Tracking";
import CTA from "@/components/CTA";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Stats />
      <Services />
      <About />
      <Testimonials />
      <Tracking />
      <CTA />
      <Contact />
      <Footer />
    </main>
  );
}
