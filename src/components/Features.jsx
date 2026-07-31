import { motion } from 'framer-motion'

const features = [
  {
    title: 'Secure Transactions',
    description: 'End-to-end encrypted transfers and audit-ready ledger visibility for modern finance.',
  },
  {
    title: 'Smart Contracts',
    description: 'Automate agreements with transparent, tamper-proof contract flows on-chain.',
  },
  {
    title: 'Fast Global Payments',
    description: 'Move capital instantly across borders with low fees and real-time settlement.',
  },
]

export default function Features() {
  return (
    <section id="features" className="pb-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="mx-auto max-w-5xl text-center"
      >
        <p className="text-sm uppercase tracking-[0.4em] text-cyan-300">Why BlockFinance</p>
        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
          Powerful blockchain finance tools built for growth.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-400">
          Unlock business-grade security, automated contracts, and borderless payment rails that scale with your network.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: index * 0.1 }}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_-40px_rgba(7,18,35,0.75)] backdrop-blur-2xl"
          >
            <div className="mb-5 h-14 w-14 rounded-3xl bg-cyan-500/10 text-cyan-300" />
            <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
