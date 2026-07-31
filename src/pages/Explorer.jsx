import { motion } from "framer-motion";
import {
  Search,
  Blocks,
  Activity,
  Fuel,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Database,
} from "lucide-react";


const transactions = [
  {
    hash: "0x8a72...91fc",
    from: "0xA34F...82D1",
    to: "0xB91C...77E2",
    amount: "2.5 ETH",
    status: "Success",
    time: "2 min ago",
  },
  {
    hash: "0x91bc...44aa",
    from: "0xC82D...91AF",
    to: "0xF12E...63BC",
    amount: "500 USDC",
    status: "Pending",
    time: "8 min ago",
  },
  {
    hash: "0x72fd...88ab",
    from: "0xE71A...22CD",
    to: "0xA88F...51DE",
    amount: "15 AAVE",
    status: "Success",
    time: "15 min ago",
  },
];


const blocks = [
  {
    number: "22,458,921",
    transactions: 142,
    validator: "0x82AF...91EF",
    time: "10 seconds ago",
  },
  {
    number: "22,458,920",
    transactions: 98,
    validator: "0x73BC...11AA",
    time: "25 seconds ago",
  },
  {
    number: "22,458,919",
    transactions: 120,
    validator: "0x91DA...44FF",
    time: "40 seconds ago",
  },
];


function BlockchainExplorer() {

  return (

    <div className="min-h-screen bg-slate-950 text-white p-6">


      {/* Header */}

      <motion.div
        initial={{opacity:0,y:-20}}
        animate={{opacity:1,y:0}}
        className="mb-8"
      >

        <h1 className="text-3xl font-bold">
          Blockchain Explorer
        </h1>

        <p className="text-gray-400 mt-2">
          Monitor blockchain activity, transactions and network status
        </p>

      </motion.div>



      {/* Search */}

      <motion.div
        whileHover={{scale:1.01}}
        className="
        bg-white/10
        backdrop-blur-xl
        rounded-2xl
        p-4
        flex
        items-center
        gap-3
        mb-8
        "
      >

        <Search className="text-cyan-400"/>

        <input
          placeholder="Search transaction hash or wallet address..."
          className="
          bg-transparent
          outline-none
          w-full
          text-white
          placeholder-gray-400
          "
        />

      </motion.div>




      {/* Network Cards */}

      <div className="grid md:grid-cols-4 gap-6 mb-8">


        <InfoCard
          icon={<Blocks/>}
          title="Block Height"
          value="22,458,921"
        />


        <InfoCard
          icon={<Fuel/>}
          title="Gas Price"
          value="25 Gwei"
        />


        <InfoCard
          icon={<Activity/>}
          title="Network"
          value="Ethereum"
        />


        <InfoCard
          icon={<CheckCircle/>}
          title="Status"
          value="Active"
        />


      </div>




      {/* Transactions */}

      <motion.div
        className="
        bg-white/10
        backdrop-blur-xl
        rounded-2xl
        p-6
        mb-8
        "
      >

        <div className="flex items-center gap-3 mb-5">

          <Database className="text-cyan-400"/>

          <h2 className="text-xl font-semibold">
            Latest Transactions
          </h2>

        </div>



        <div className="overflow-x-auto">

        <table className="w-full text-left">

          <thead>

            <tr className="text-gray-400 border-b border-white/10">

              <th className="p-3">
                Hash
              </th>

              <th className="p-3">
                From
              </th>

              <th className="p-3">
                To
              </th>

              <th className="p-3">
                Amount
              </th>

              <th className="p-3">
                Status
              </th>

              <th className="p-3">
                Time
              </th>

            </tr>

          </thead>


          <tbody>

          {
            transactions.map((tx,index)=>(

              <motion.tr
                key={index}
                initial={{opacity:0}}
                animate={{opacity:1}}
                transition={{delay:index*0.1}}
                className="
                border-b
                border-white/10
                hover:bg-white/5
                "
              >

                <td className="p-3 text-cyan-400">
                  {tx.hash}
                </td>

                <td className="p-3">
                  {tx.from}
                </td>

                <td className="p-3">
                  {tx.to}
                </td>

                <td className="p-3 font-semibold">
                  {tx.amount}
                </td>

                <td className="p-3">

                <span
                className={
                  tx.status==="Success"
                  ?
                  "text-green-400"
                  :
                  "text-yellow-400"
                }
                >
                  {tx.status}
                </span>

                </td>

                <td className="p-3 text-gray-400">
                  {tx.time}
                </td>


              </motion.tr>

            ))
          }


          </tbody>


        </table>

        </div>


      </motion.div>





      {/* Latest Blocks */}


      <motion.div
        className="
        bg-white/10
        backdrop-blur-xl
        rounded-2xl
        p-6
        "
      >

        <h2 className="text-xl font-semibold mb-5">
          Latest Blocks
        </h2>


        <div className="grid md:grid-cols-3 gap-5">


        {
          blocks.map((block,index)=>(

            <motion.div
              key={index}
              whileHover={{scale:1.03}}
              className="
              bg-black/20
              rounded-xl
              p-5
              "
            >

              <div className="flex justify-between">

                <Blocks className="text-cyan-400"/>

                <ArrowUpRight
                className="text-gray-400"
                />

              </div>


              <h3 className="text-xl font-bold mt-4">
                #{block.number}
              </h3>


              <p className="text-gray-400 mt-2">
                Transactions: {block.transactions}
              </p>


              <p className="text-gray-400">
                Validator: {block.validator}
              </p>


              <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">

                <Clock size={15}/>

                {block.time}

              </div>


            </motion.div>

          ))
        }


        </div>


      </motion.div>



    </div>

  );

}



function InfoCard({icon,title,value}){

return (

<motion.div
whileHover={{scale:1.05}}
className="
bg-white/10
backdrop-blur-xl
rounded-2xl
p-5
flex
items-center
gap-4
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



export default BlockchainExplorer;