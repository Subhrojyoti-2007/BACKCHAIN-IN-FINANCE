import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section id="home" className="pt-10 pb-16 sm:pb-20 lg:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="mx-auto max-w-5xl text-center"
      >
        <p className="mb-4 inline-flex rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Blockchain Finance
        </p>
        <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          Secure. Transparent. Decentralized Finance.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
          Build trust in every transaction with blockchain-native financial services for payments, asset management, and global liquidity.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
            Connect Wallet
          </button>
          <a
            href="#dashboard"
            className="inline-flex items-center justify-center rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-300"
          >
            Explore Dashboard
          </a>
        </div>
      </motion.div>
    </section>
  )
}
