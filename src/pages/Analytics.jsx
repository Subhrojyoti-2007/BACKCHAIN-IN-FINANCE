import { motion } from "framer-motion";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";

const growthData = [
  { month: "Jan", value: 420000 },
  { month: "Feb", value: 480000 },
  { month: "Mar", value: 560000 },
  { month: "Apr", value: 610000 },
  { month: "May", value: 700000 },
  { month: "Jun", value: 742900 },
];

const liquidityData = [
  { time: "00:00", value: 132.5 },
  { time: "04:00", value: 131.2 },
  { time: "08:00", value: 134.8 },
  { time: "12:00", value: 138.1 },
  { time: "16:00", value: 136.9 },
  { time: "20:00", value: 140.5 },
  { time: "24:00", value: 142.8 },
];

const assetData = [
  { name: "Bitcoin", value: 42 },
  { name: "Ethereum", value: 28 },
  { name: "Stablecoins", value: 16 },
  { name: "DeFi", value: 9 },
  { name: "NFTs", value: 5 },
];

const COLORS = [
  "#F7931A",
  "#627EEA",
  "#26A17B",
  "#8247E5",
  "#FF6B9D",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 80, damping: 20 }
  }
};

// Generates slightly offset infinite animations for a more natural feel
const getAntigravity = (durationBase = 6, delay = 0) => ({
  animate: {
    y: [0, -12, 0],
    rotateX: [0, 2, -2, 0],
    rotateY: [0, -1, 1, 0],
    boxShadow: [
      "0 10px 30px -10px rgba(0,0,0,0.5)",
      "0 25px 50px -12px rgba(34,211,238,0.25)",
      "0 10px 30px -10px rgba(0,0,0,0.5)"
    ],
    transition: {
      duration: durationBase,
      delay: delay,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop"
    }
  }
});

function Analytics() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-6 perspective-1000">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">
          Portfolio Analytics
        </h1>

        <p className="text-gray-400 mt-2">
          Track your blockchain assets and investment performance
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <motion.div variants={itemVariants}>
            <Card
              icon={<TrendingUp />}
              title="Growth"
              value="+18.6%"
              delay={0}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card
              icon={<BarChart3 />}
              title="Portfolio Value"
              value="$742,900"
              delay={0.2}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card
              icon={<PieChart />}
              title="Assets"
              value="24"
              delay={0.4}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card
              icon={<Activity />}
              title="Performance"
              value="Excellent"
              delay={0.6}
            />
          </motion.div>

        </div>


        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Growth Chart */}
          <motion.div variants={itemVariants}>
            <motion.div
              {...getAntigravity(7, 0)}
              whileHover={{ 
                scale: 1.02, 
                y: -15, 
                boxShadow: "0 30px 60px -15px rgba(34,211,238,0.4)",
                transition: { duration: 0.3 }
              }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 transform-gpu"
            >
              <h2 className="text-xl font-semibold mb-5">
                Portfolio Growth
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData}>
                  <XAxis dataKey="month" stroke="gray"/>
                  <YAxis stroke="gray"/>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#38bdf8"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#38bdf8' }}
                    activeDot={{ r: 6 }}
                    isAnimationActive={true}
                    animationDuration={2500}
                    animationEasing="ease-in-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </motion.div>

          {/* Allocation Chart */}
          <motion.div variants={itemVariants}>
            <motion.div
              {...getAntigravity(6.5, 0.3)}
              whileHover={{ 
                scale: 1.02, 
                y: -15, 
                boxShadow: "0 30px 60px -15px rgba(34,211,238,0.4)",
                transition: { duration: 0.3 }
              }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 transform-gpu"
            >
              <h2 className="text-xl font-semibold mb-5">
                Asset Allocation
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={assetData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    isAnimationActive={true}
                    animationDuration={2000}
                    animationEasing="ease-out"
                  >
                    {assetData.map((entry,index)=>(
                      <Cell
                        key={index}
                        fill={COLORS[index]}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                </RePieChart>
              </ResponsiveContainer>
            </motion.div>
          </motion.div>

        </div>


        {/* EXTRA ANALYSIS COMPONENTS FROM HTML */}
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
            {/* Macro Overview Chart (Span 8) */}
            <motion.section 
              variants={itemVariants}
              {...getAntigravity(7.5, 0.2)}
              whileHover={{ 
                scale: 1.02, 
                y: -15, 
                boxShadow: "0 30px 60px -15px rgba(34,211,238,0.4)",
                transition: { duration: 0.3 }
              }}
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 col-span-1 md:col-span-8 row-span-2 flex flex-col relative overflow-hidden group transform-gpu"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
              <div className="flex justify-between items-center mb-6 z-10">
                <div>
                  <h2 className="text-xl font-semibold text-white">Global Liquidity Index</h2>
                  <p className="text-sm text-gray-400">Aggregated TVL across Tier 1 chains</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 text-sm border border-cyan-500/20">1D</span>
                  <span className="px-2 py-1 rounded bg-transparent text-gray-400 hover:text-white text-sm cursor-pointer">1W</span>
                  <span className="px-2 py-1 rounded bg-transparent text-gray-400 hover:text-white text-sm cursor-pointer">1M</span>
                </div>
              </div>
              <div className="flex items-baseline gap-4 mb-4 z-10">
                <span className="text-4xl font-bold text-white">$142.8B</span>
                <span className="text-lg text-cyan-400 flex items-center bg-cyan-500/10 px-2 py-0.5 rounded">
                  <TrendingUp className="w-4 h-4 mr-1" /> +2.4%
                </span>
              </div>
              
              <div className="flex-1 w-full mt-4 relative z-10 -ml-4">
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={liquidityData}>
                    <defs>
                      <linearGradient id="colorLiquidity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="gray" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} stroke="gray" fontSize={12} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}B`} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} formatter={(value) => [`$${value}B`, "Liquidity"]} />
                    <Area type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorLiquidity)" isAnimationActive={true} animationDuration={2000} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.section>

            {/* Forecast Engine (Span 4) */}
            <motion.section 
              variants={itemVariants}
              {...getAntigravity(6, 0.4)}
              whileHover={{ 
                scale: 1.02, 
                y: -15, 
                boxShadow: "0 30px 60px -15px rgba(34,211,238,0.4)",
                transition: { duration: 0.3 }
              }}
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 col-span-1 md:col-span-4 row-span-1 flex flex-col relative overflow-hidden group transform-gpu"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="flex items-center gap-3 mb-4 z-10">
                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 border border-purple-500/30">
                  <Activity className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-white">Forecast Engine</h2>
              </div>
              <div className="flex flex-col gap-4 z-10">
                <div className="flex justify-between items-end border-b border-white/5 pb-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-1 tracking-widest font-bold">PROJECTED 7D YIELD (ETH)</div>
                    <div className="text-lg text-white font-medium">4.2% - 5.8% APY</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-cyan-400 mb-1 tracking-widest font-bold">CONFIDENCE</span>
                    <span className="text-sm text-white bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">92%</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-2 tracking-widest font-bold">AI SENTIMENT SIGNAL</div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                    <div className="bg-red-400 w-1/4 h-full"></div>
                    <div className="bg-gray-500 w-1/4 h-full"></div>
                    <div className="bg-cyan-400 w-1/2 h-full shadow-[0_0_10px_rgba(34,211,238,0.8)] relative">
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-white"></div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                    <span>Bearish</span>
                    <span>Neutral</span>
                    <span className="text-cyan-400">Strong Bullish</span>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Sector Allocation (Span 4) */}
            <motion.section 
              variants={itemVariants}
              {...getAntigravity(8.5, 0.5)}
              whileHover={{ 
                scale: 1.02, 
                y: -15, 
                boxShadow: "0 30px 60px -15px rgba(34,211,238,0.4)",
                transition: { duration: 0.3 }
              }}
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 col-span-1 md:col-span-4 row-span-1 flex flex-col justify-between transform-gpu"
            >
              <h2 className="text-xl font-semibold text-white mb-2">Sector Allocation</h2>
              <div className="flex items-center justify-between flex-1">
                {/* Faux Donut Chart */}
                <div className="relative w-32 h-32 flex-shrink-0">
                  <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" fill="transparent" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="12"></circle>
                    <circle className="text-blue-400" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="100 151" strokeDashoffset="0" strokeWidth="12"></circle>
                    <circle className="text-cyan-400" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="75 176" strokeDashoffset="-100" strokeWidth="12"></circle>
                    <circle className="text-purple-400" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="50 201" strokeDashoffset="-175" strokeWidth="12"></circle>
                    <circle className="text-gray-500" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="26 225" strokeDashoffset="-225" strokeWidth="12"></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[10px] text-gray-400">TOTAL</span>
                    <span className="text-lg text-white font-medium">14</span>
                  </div>
                </div>
                {/* Legend */}
                <div className="flex flex-col gap-2 w-full pl-6">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400"></span><span className="text-xs font-bold tracking-widest text-white">DeFi</span></div>
                    <span className="text-sm text-gray-400">40%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-400"></span><span className="text-xs font-bold tracking-widest text-white">L1/L2</span></div>
                    <span className="text-sm text-gray-400">30%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-400"></span><span className="text-xs font-bold tracking-widest text-white">Infra</span></div>
                    <span className="text-sm text-gray-400">20%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-500"></span><span className="text-xs font-bold tracking-widest text-white">NFT</span></div>
                    <span className="text-sm text-gray-400">10%</span>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* DeFi Heatmap (Span 6) */}
            <motion.section 
              variants={itemVariants}
              {...getAntigravity(7, 0.7)}
              whileHover={{ 
                scale: 1.02, 
                y: -15, 
                boxShadow: "0 30px 60px -15px rgba(34,211,238,0.4)",
                transition: { duration: 0.3 }
              }}
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 col-span-1 md:col-span-6 row-span-2 flex flex-col transform-gpu"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Protocol Heatmap</h2>
              </div>
              <div className="grid grid-cols-3 gap-2 flex-1">
                <div className="bg-cyan-500/20 border border-cyan-500/40 rounded-lg p-3 flex flex-col justify-between hover:bg-cyan-500/30 transition-colors cursor-pointer shadow-[inset_0_0_20px_rgba(34,211,238,0.1)]">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold tracking-widest text-white">AAVE</span>
                    <TrendingUp className="text-cyan-400 w-4 h-4" />
                  </div>
                  <div className="text-right mt-2">
                    <div className="text-lg text-cyan-400">+4.2%</div>
                    <div className="text-[10px] text-gray-400">TVL: $8.4B</div>
                  </div>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-3 flex flex-col justify-between hover:bg-blue-500/30 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold tracking-widest text-white">UNI</span>
                    <TrendingUp className="text-blue-400 w-4 h-4" />
                  </div>
                  <div className="text-right mt-2">
                    <div className="text-lg text-blue-400">+2.1%</div>
                    <div className="text-[10px] text-gray-400">Vol: $1.2B</div>
                  </div>
                </div>
                <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-3 flex flex-col justify-between hover:bg-red-500/30 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold tracking-widest text-white">CRV</span>
                    <TrendingUp className="text-red-400 w-4 h-4 rotate-180" />
                  </div>
                  <div className="text-right mt-2">
                    <div className="text-lg text-red-400">-1.5%</div>
                    <div className="text-[10px] text-gray-400">TVL: $2.1B</div>
                  </div>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 flex flex-col justify-between hover:bg-cyan-500/20 transition-colors cursor-pointer col-span-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold tracking-widest text-white">LDO</span>
                    <TrendingUp className="text-cyan-400 w-4 h-4" />
                  </div>
                  <div className="text-right mt-2 flex justify-between items-end">
                    <div className="text-[10px] text-gray-400">Staked: 9.8M ETH</div>
                    <div className="text-lg text-cyan-400">+1.8%</div>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex flex-col justify-between hover:bg-white/10 transition-colors cursor-pointer text-gray-400">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold tracking-widest text-white">MKR</span>
                    <div className="w-3 h-0.5 bg-gray-400 mt-2"></div>
                  </div>
                  <div className="text-right mt-2">
                    <div className="text-lg">0.0%</div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Transaction Cluster (Span 6) */}
            <motion.section 
              variants={itemVariants}
              {...getAntigravity(6.5, 0.9)}
              whileHover={{ 
                scale: 1.02, 
                y: -15, 
                boxShadow: "0 30px 60px -15px rgba(34,211,238,0.4)",
                transition: { duration: 0.3 }
              }}
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 col-span-1 md:col-span-6 row-span-2 flex flex-col relative overflow-hidden transform-gpu"
            >
              <h2 className="text-xl font-semibold text-white mb-1">Live Institutional Flow</h2>
              <p className="text-sm text-gray-400 mb-4">Tracking volume clusters &gt; $1M</p>
              {/* Faux Visualization Area */}
              <div className="flex-1 bg-black/20 rounded-lg border border-white/5 relative overflow-hidden flex items-center justify-center">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #475569 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                {/* Central Node */}
                <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-blue-400 z-10 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)] relative">
                  <Activity className="text-blue-400 w-8 h-8" />
                  {/* Pulsing ring */}
                  <div className="absolute inset-0 rounded-full border border-blue-400/50 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                </div>
                {/* Nodes & Connections (CSS drawn for simplicity) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" z-index="0">
                  <line className="animate-[dash_20s_linear_infinite]" stroke="rgba(34,211,238,0.3)" strokeDasharray="4 4" strokeWidth="2" x1="50%" x2="20%" y1="50%" y2="30%"></line>
                  <line stroke="rgba(168,85,247,0.3)" strokeWidth="1" x1="50%" x2="80%" y1="50%" y2="20%"></line>
                  <line stroke="rgba(59,130,246,0.5)" strokeWidth="3" x1="50%" x2="70%" y1="50%" y2="80%"></line>
                  <line stroke="rgba(248,113,113,0.4)" strokeWidth="2" x1="50%" x2="25%" y1="50%" y2="75%"></line>
                </svg>
                {/* Satellite Nodes */}
                <div className="absolute top-[25%] left-[15%] w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                  <span className="text-[8px] text-cyan-400">IN</span>
                </div>
                <div className="absolute top-[15%] right-[15%] w-6 h-6 rounded-full bg-purple-500/20 border border-purple-400 flex items-center justify-center z-10"></div>
                <div className="absolute bottom-[15%] right-[25%] w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400 flex flex-col items-center justify-center z-10">
                  <span className="text-[10px] text-blue-400">OUT</span>
                  <span className="text-[8px] text-gray-400">4.2M</span>
                </div>
                <div className="absolute bottom-[20%] left-[20%] w-10 h-10 rounded-full bg-red-500/20 border border-red-400 flex items-center justify-center z-10"></div>
              </div>
              {/* Overlay Data */}
              <div className="absolute bottom-6 right-6 bg-slate-800/80 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10">
                <div className="text-[10px] text-gray-400 font-bold tracking-widest mb-1">NETWORK LOAD</div>
                <div className="text-sm text-cyan-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  Moderate (45 TPS)
                </div>
              </div>
            </motion.section>
          </div>
        </div>

        {/* Bar Chart */}
        <motion.div variants={itemVariants}>
          <motion.div
            {...getAntigravity(8, 0.6)}
            whileHover={{ 
                scale: 1.02, 
                y: -15, 
                boxShadow: "0 30px 60px -15px rgba(34,211,238,0.4)",
                transition: { duration: 0.3 }
            }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mt-6 transform-gpu"
          >
            <h2 className="text-xl font-semibold mb-5">
              Monthly Performance
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={growthData}>
                <XAxis dataKey="month" stroke="gray"/>
                <YAxis stroke="gray"/>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                <Bar
                  dataKey="value"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={true}
                  animationDuration={2000}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}


function Card({icon, title, value, delay = 0}){
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
        rotateX: [0, 2, -2, 0],
        rotateY: [0, -1, 1, 0],
        boxShadow: [
          "0 10px 30px -10px rgba(0,0,0,0.5)",
          "0 20px 40px -10px rgba(34,211,238,0.25)",
          "0 10px 30px -10px rgba(0,0,0,0.5)"
        ]
      }}
      transition={{
        duration: 5 + delay,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop"
      }}
      whileHover={{ 
        scale:1.05, 
        y: -15, 
        boxShadow: "0 25px 50px -12px rgba(34,211,238,0.4)",
        transition: { duration: 0.3 }
      }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 flex gap-4 items-center transform-gpu cursor-pointer"
    >
      <div className="text-cyan-400">
        {icon}
      </div>
      <div>
        <p className="text-gray-400">
          {title}
        </p>
        <h3 className="text-xl font-bold">
          {value}
        </h3>
      </div>
    </motion.div>
  );
}

export default Analytics;