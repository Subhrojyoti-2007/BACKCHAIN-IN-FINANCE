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

function Analytics() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">
          Portfolio Analytics
        </h1>

        <p className="text-gray-400 mt-2">
          Track your blockchain assets and investment performance
        </p>
      </motion.div>


      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">

        <Card
          icon={<TrendingUp />}
          title="Growth"
          value="+18.6%"
        />

        <Card
          icon={<BarChart3 />}
          title="Portfolio Value"
          value="$742,900"
        />

        <Card
          icon={<PieChart />}
          title="Assets"
          value="24"
        />

        <Card
          icon={<Activity />}
          title="Performance"
          value="Excellent"
        />

      </div>


      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">


        {/* Growth Chart */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6"
        >

          <h2 className="text-xl font-semibold mb-5">
            Portfolio Growth
          </h2>


          <ResponsiveContainer width="100%" height={300}>

            <LineChart data={growthData}>

              <XAxis dataKey="month" stroke="gray"/>
              <YAxis stroke="gray"/>

              <Tooltip />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#38bdf8"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </motion.div>



        {/* Allocation Chart */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6"
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
              >

                {assetData.map((entry,index)=>(
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}

              </Pie>

              <Tooltip />

            </RePieChart>

          </ResponsiveContainer>


        </motion.div>

      </div>


      {/* Bar Chart */}

      <motion.div
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mt-6"
      >

        <h2 className="text-xl font-semibold mb-5">
          Monthly Performance
        </h2>


        <ResponsiveContainer width="100%" height={300}>

          <BarChart data={growthData}>

            <XAxis dataKey="month" stroke="gray"/>
            <YAxis stroke="gray"/>

            <Tooltip/>

            <Bar
              dataKey="value"
              fill="#22c55e"
            />

          </BarChart>

        </ResponsiveContainer>

      </motion.div>


    </div>
  );
}


function Card({icon,title,value}){

  return (

    <motion.div
      whileHover={{scale:1.05}}
      className="
      bg-white/10 
      backdrop-blur-xl
      rounded-2xl
      p-5
      flex
      gap-4
      items-center
      "
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