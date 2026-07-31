import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="border-t border-slate-800 bg-slate-950/80 py-8 text-slate-400"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 sm:px-10 lg:px-16 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-100">BlockFinance</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            Trusted blockchain finance for teams, traders, and institutions exploring the future of digital assets.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-8">
          <a href="#home" className="transition hover:text-cyan-300">Home</a>
          <a href="#features" className="transition hover:text-cyan-300">Features</a>
          <a href="#contact" className="transition hover:text-cyan-300">Contact</a>
        </div>
      </div>
    </motion.footer>
  )
}
