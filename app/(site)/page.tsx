import Hero from "@/components/Hero";
import LatestPosts from "@/components/home/LatestPosts";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedResources from "@/components/home/FeaturedResources";
import DigestCTA from "@/components/home/DigestCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <LatestPosts />
      <CategoryGrid />
      <FeaturedResources />
      <DigestCTA />
    </>
  );
}
