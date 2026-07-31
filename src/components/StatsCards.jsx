import { motion } from 'framer-motion'

const stats = [
  { label: 'Transactions', value: '1.2M+' },
  { label: 'Active Users', value: '72K' },
  { label: 'Smart Contracts', value: '8.5K' },
  { label: 'Assets Secured', value: '$18B' },
]

export default function StatsCards() {
  return (
    <section id="dashboard" className="mx-auto max-w-7xl pb-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 text-slate-100 shadow-[0_20px_80px_-50px_rgba(15,23,42,0.75)]"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <p className="text-3xl font-semibold text-white">{stat.value}</p>
            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-slate-500">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
