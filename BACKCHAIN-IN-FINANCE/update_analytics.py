import os

file_path = "src/pages/Analytics.jsx"

new_content = """import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { fetchHistoricalData } from '../services/api';

const COLORS = ["#F7931A", "#627EEA", "#26A17B", "#8247E5", "#FF6B9D"];

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

function Analytics() {
  const [btcHistory, setBtcHistory] = useState([]);
  const [ethHistory, setEthHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const btc = await fetchHistoricalData('bitcoin', 30);
        const eth = await fetchHistoricalData('ethereum', 30);
        
        // Format for recharts Area and Bar charts (we'll just use a subset to avoid crowding)
        const formatHistory = (historyData, stepSize) => {
           const formatted = [];
           const step = Math.floor(historyData.length / stepSize);
           for(let i=0; i<stepSize; i++) {
               if(historyData[i * step]) {
                   // Create a simple date label (e.g. Day 1, Day 2)
                   formatted.push({
                       time: `Day ${i+1}`, 
                       value: historyData[i * step].value
                   });
               }
           }
           return formatted;
        };

        setBtcHistory(formatHistory(btc, 15)); // 15 points for BTC
        setEthHistory(formatHistory(eth, 15)); // 15 points for ETH
        
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    const interval = setInterval(loadData, 60000); // 1 minute
    return () => clearInterval(interval);
  }, []);

  const assetData = [
    { name: "Bitcoin", value: 42 },
    { name: "Ethereum", value: 28 },
    { name: "Solana", value: 16 },
    { name: "USDC", value: 9 },
    { name: "Others", value: 5 },
  ];

  return (
    <div className="min-h-screen bg-transparent text-white p-6 perspective-1000">
      
      {/* Header */}
      <motion.div
        initial={{opacity:0,y:-20}}
        animate={{opacity:1,y:0}}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">Analytics & Metrics</h1>
        <p className="text-gray-400 mt-2">Deep dive into live market performance</p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid lg:grid-cols-2 gap-8 mb-8"
      >
        {/* Market Cap Trend (Area Chart) */}
        <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">Bitcoin 30-Day Trend (Live)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              {loading ? (
                <div className="flex items-center justify-center h-full text-gray-400">Loading live data...</div>
              ) : (
                <AreaChart data={btcHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBtc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F7931A" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#F7931A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                    itemStyle={{ color: '#F7931A' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#F7931A" fillOpacity={1} fill="url(#colorBtc)" strokeWidth={3} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Network Volume (Bar Chart) */}
        <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">Ethereum 30-Day Trend (Live)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              {loading ? (
                <div className="flex items-center justify-center h-full text-gray-400">Loading live data...</div>
              ) : (
                <BarChart data={ethHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="time" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickFormatter={(value) => `$${value.toFixed(0)}`} />
                  <Tooltip 
                    cursor={{fill: '#1f2937'}}
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                    itemStyle={{ color: '#627EEA' }}
                  />
                  <Bar dataKey="value" fill="#627EEA" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid lg:grid-cols-3 gap-8"
      >
        {/* Asset Distribution (Pie Chart) */}
        <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-6">Global Allocation</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {assetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '8px' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Detailed Metrics Table */}
        <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 lg:col-span-2 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-6">Performance Metrics</h2>
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="pb-3 font-medium">Metric</th>
                <th className="pb-3 font-medium">Value</th>
                <th className="pb-3 font-medium">24h Change</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                <td className="py-4">Network TVL</td>
                <td className="py-4 font-semibold">$1.42B</td>
                <td className="py-4 text-emerald-400">+2.4%</td>
                <td className="py-4"><span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md text-xs">Healthy</span></td>
              </tr>
              <tr className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                <td className="py-4">Active Wallets</td>
                <td className="py-4 font-semibold">142,593</td>
                <td className="py-4 text-emerald-400">+5.1%</td>
                <td className="py-4"><span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md text-xs">Growing</span></td>
              </tr>
              <tr className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                <td className="py-4">Avg Gas Price</td>
                <td className="py-4 font-semibold">18 Gwei</td>
                <td className="py-4 text-rose-400">-12.5%</td>
                <td className="py-4"><span className="bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded-md text-xs">Optimal</span></td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-4">Smart Contracts</td>
                <td className="py-4 font-semibold">8,204</td>
                <td className="py-4 text-emerald-400">+1.2%</td>
                <td className="py-4"><span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md text-xs">Active</span></td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Analytics;
"""

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)
    
print("Analytics.jsx updated successfully!")
