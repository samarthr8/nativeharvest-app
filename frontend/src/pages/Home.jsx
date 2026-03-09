import HeroSection from "../components/home/HeroSection";
import TrustHighlights from "../components/home/TrustHighlights";
import FeaturedProducts from "../components/home/FeaturedProducts";
import BrandStory from "../components/home/BrandStory";
import Newsletter from "../components/home/Newsletter";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustHighlights />
      <FeaturedProducts />
      <BrandStory />
      <Newsletter />
    </>
  );
}