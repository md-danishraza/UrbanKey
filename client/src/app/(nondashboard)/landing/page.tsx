'use client'

import { motion } from "framer-motion";
import FeaturedProperties from "./FeaturedProperties"
import HeroSection from "./HeroSection"
import HowItWorks from "./HowItWorks"
import { AntigravityBackground } from "@/components/common/AntigravityBackground";
import Testimonials from "./Testimonials";


function Landing() {
  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    >
      <AntigravityBackground/>
      <HeroSection />
      <FeaturedProperties />
      <HowItWorks />
      <Testimonials/>
    </motion.div>
  );
}

export default Landing
