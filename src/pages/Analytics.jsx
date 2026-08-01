import { motion } from "framer-motion";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import {
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