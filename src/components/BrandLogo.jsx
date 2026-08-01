import { Hexagon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BrandLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className="fixed top-6 left-6 lg:left-10 z-[60]"
    >
      <Link to="/" className="flex items-center gap-2 group cursor-pointer text-white decoration-transparent">
        <div className="bg-cyan-500/20 p-2 rounded-xl group-hover:bg-cyan-500/30 transition-all border border-cyan-500/30 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]">
          <Hexagon className="text-cyan-400 group-hover:scale-110 transition-transform duration-300" size={24} />
        </div>
        <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 hidden sm:block">
          ChainVest
        </span>
      </Link>
    </motion.div>
  );
}
