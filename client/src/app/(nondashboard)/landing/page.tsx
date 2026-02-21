'use client'

import { motion } from "framer-motion";
import FeaturedProperties from "./FeaturedProperties"
import HeroSection from "./HeroSection"
import HowItWorks from "./HowItWorks"


function Landing() {
  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    >
      <HeroSection />
      <FeaturedProperties />
      <HowItWorks />
    </motion.div>
  );
}

export default Landing
