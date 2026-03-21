import { Suspense } from "react";
import Hero from "./components/home/Hero/Hero";
import FeaturedProjects from "./components/home/featured/FeaturedProjects";
import HomeServices from "./components/home/services/HomeServices";
import AISection from "./components/home/ai/AISection";
import Testimonials from "./components/home/testimonials/Testimonials";


export default function HomePage() {
  const loadingProjectsTSX = <p className="loading">Loading projects...</p>;
  const loadingServicesTSX = <p className="loading">Loading services...</p>;
  const loadingTestimonialsTSX = (
    <p className="loading">Loading testimonials...</p>
  );

  return (
    <div>
      <Hero />
      <Suspense fallback={loadingProjectsTSX}>
        <FeaturedProjects />
      </Suspense>
      <Suspense fallback={loadingServicesTSX}>
        <HomeServices />
      </Suspense>
      <AISection />
      <Suspense fallback={loadingTestimonialsTSX}>
        <Testimonials />
      </Suspense>
    </div>
  );
}
