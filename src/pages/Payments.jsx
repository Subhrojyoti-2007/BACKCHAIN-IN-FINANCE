import { motion } from "framer-motion";
import {
  Send,
  Wallet,
  ShieldCheck,
  Clock,
  CheckCircle,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";


const paymentHistory = [
  {
    type: "Sent",
    asset: "ETH",
    amount: "-0.75 ETH",
    address: "0x91AF...72BC",
    status: "Completed",
    time: "5 min ago",
  },
  {
    type: "Received",
    asset: "USDC",
    amount: "+1200 USDC",
    address: "0x72BC...88EF",
    status: "Completed",
    time: "20 min ago",
  },
  {
    type: "Sent",
    asset: "AAVE",
    amount: "-10 AAVE",
    address: "0x45CD...91AA",
    status: "Pending",
    time: "1 hour ago",
  },
];


const assets = [
  {
    name: "Ethereum",
    symbol: "ETH",
    balance: "12.45 ETH",
  },
  {
    name: "Bitcoin",
    symbol: "BTC",
    balance: "2.18 BTC",
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    balance: "18,500 USDC",
  },
  {
    name: "Aave",
    symbol: "AAVE",
    balance: "85 AAVE",
  },
];


function Payments() {

  return (

    <div className="min-h-screen bg-slate-950 text-white p-6">


      {/* Header */}

      <motion.div
        initial={{opacity:0,y:-20}}
        animate={{opacity:1,y:0}}
        className="mb-8"
      >

        <h1 className="text-3xl font-bold">
          Crypto Payments
        </h1>

        <p className="text-gray-400 mt-2">
          Send, receive and manage blockchain transactions securely
        </p>

      </motion.div>



      {/* Payment Section */}

      <div className="grid lg:grid-cols-2 gap-6 mb-8">


        {/* Send Payment */}

        <motion.div
          whileHover={{scale:1.02}}
          className="
          bg-white/10
          backdrop-blur-xl
          rounded-2xl
          p-6
          "
        >

          <div className="flex items-center gap-3 mb-6">

            <Send className="text-cyan-400"/>

            <h2 className="text-xl font-semibold">
              Send Payment
            </h2>

          </div>



          <label className="text-gray-400">
            Recipient Wallet Address
          </label>

          <input
            placeholder="0x82AF....91EF"
            className="
            w-full
            mt-2
            mb-5
            p-3
            rounded-xl
            bg-black/30
            outline-none
            "
          />



          <label className="text-gray-400">
            Select Asset
          </label>


          <select
            className="
            w-full
            mt-2
            mb-5
            p-3
            rounded-xl
            bg-black/30
            outline-none
            "
          >

            <option>
              Ethereum (ETH)
            </option>

            <option>
              Bitcoin (BTC)
            </option>

            <option>
              USDC
            </option>

            <option>
              AAVE
            </option>

          </select>



          <label className="text-gray-400">
            Amount
          </label>


          <input
            placeholder="1.5 ETH"
            className="
            w-full
            mt-2
            mb-6
            p-3
            rounded-xl
            bg-black/30
            outline-none
            "
          />



          <button
            className="
            w-full
            bg-cyan-500
            text-black
            font-bold
            p-3
            rounded-xl
            hover:bg-cyan-400
            transition
            "
          >

            Send Payment

          </button>


        </motion.div>





        {/* Security Card */}

        <motion.div
          whileHover={{scale:1.02}}
          className="
          bg-white/10
          backdrop-blur-xl
          rounded-2xl
          p-6
          "
        >

          <div className="flex items-center gap-3 mb-6">

            <ShieldCheck className="text-green-400"/>

            <h2 className="text-xl font-semibold">
              Transaction Security
            </h2>

          </div>


          <SecurityItem text="Wallet address verified"/>

          <SecurityItem text="Ethereum network confirmed"/>

          <SecurityItem text="Gas fee optimized"/>

          <SecurityItem text="Smart contract protected"/>


        </motion.div>


      </div>





      {/* Assets */}

      <motion.div
        className="
        bg-white/10
        backdrop-blur-xl
        rounded-2xl
        p-6
        mb-8
        "
      >

        <h2 className="text-xl font-semibold mb-5">
          Supported Assets
        </h2>


        <div className="grid md:grid-cols-4 gap-5">


        {
          assets.map((asset,index)=>(

            <motion.div
              key={index}
              whileHover={{scale:1.05}}
              className="
              bg-black/20
              rounded-xl
              p-5
              "
            >

              <Wallet className="text-cyan-400"/>


              <h3 className="font-bold mt-3">
                {asset.name}
              </h3>


              <p className="text-gray-400">
                {asset.symbol}
              </p>


              <p className="mt-2">
                {asset.balance}
              </p>


            </motion.div>

          ))
        }


        </div>


      </motion.div>





      {/* Payment History */}

      <motion.div
        className="
        bg-white/10
        backdrop-blur-xl
        rounded-2xl
        p-6
        "
      >

        <h2 className="text-xl font-semibold mb-5">
          Payment History
        </h2>


        <div className="space-y-4">


        {
          paymentHistory.map((payment,index)=>(

            <motion.div
              key={index}
              whileHover={{scale:1.02}}
              className="
              bg-black/20
              rounded-xl
              p-4
              flex
              justify-between
              items-center
              "
            >


              <div className="flex items-center gap-4">


              {
                payment.type==="Sent"
                ?
                <ArrowUpRight className="text-red-400"/>
                :
                <ArrowDownLeft className="text-green-400"/>
              }


              <div>

                <h3 className="font-semibold">
                  {payment.type} {payment.asset}
                </h3>

                <p className="text-gray-400 text-sm">
                  {payment.address}
                </p>

              </div>


              </div>




              <div className="text-right">

                <p className="font-bold">
                  {payment.amount}
                </p>

                <p className="text-gray-400 text-sm">
                  {payment.time}
                </p>


              </div>



            </motion.div>


          ))
        }


        </div>


      </motion.div>



    </div>

  );

}



function SecurityItem({text}){

return (

<div className="
flex
items-center
gap-3
bg-black/20
rounded-xl
p-4
mb-3
">

<CheckCircle className="text-green-400"/>

<p>
{text}
</p>

</div>

);

}


export default Payments;