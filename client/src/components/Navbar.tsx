"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";

function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full h-16 bg-primary text-primary-foreground shadow-md sticky top-0 z-50 border-b border-primary/20"
    >
      <div className="container mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        {/* Left: Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          {/* Added a subtle white backdrop so the logo pops against the rose background */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            
          >
            <Logo  />
          </motion.div>
        </Link>

        {/* Center: Brand Heading (Hidden on mobile) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="hidden md:flex flex-col items-center select-none"
        >
          <h1 className="text-xl font-bold tracking-tight leading-none">
          Unlock Your City
          </h1>
         
        </motion.div>

        {/* Right: Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/signin">
            <Button
              variant="outline"
              className="hidden sm:flex border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-white hover:text-primary transition-all duration-300"
            >
              Sign In
            </Button>
          </Link>

          <Link href="/signup">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 font-semibold shadow-sm transition-all duration-300"
              >
                Sign Up
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;