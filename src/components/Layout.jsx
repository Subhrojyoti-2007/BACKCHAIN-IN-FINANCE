import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import { AnimatedNavFramer } from "./ui/navigation-menu";
import Footer from "./Footer";
import DotField from "./ui/DotField";

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative selection:bg-cyan-500 selection:text-slate-950">
      {/* Global 100% Full-Viewport Interactive Dot Field Background */}
      <DotField
        dotRadius={1.5}
        dotSpacing={14}
        bulgeStrength={67}
        glowRadius={180}
        sparkle={false}
        waveAmplitude={0}
      />

      <AnimatedNavFramer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Outlet />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}