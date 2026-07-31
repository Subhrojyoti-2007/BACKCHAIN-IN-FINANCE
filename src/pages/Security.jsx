import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  AlertTriangle,
  CheckCircle,
  Activity,
  Eye,
  KeyRound,
} from "lucide-react";


const securityChecks = [
  {
    title: "Two-Factor Authentication",
    status: "Enabled",
    icon: <KeyRound />,
  },
  {
    title: "Smart Contract Verification",
    status: "Completed",
    icon: <ShieldCheck />,
  },
  {
    title: "Suspicious Activity Monitoring",
    status: "Active",
    icon: <Eye />,
  },
  {
    title: "Transaction Risk Analysis",
    status: "Enabled",
    icon: <Activity />,
  },
];


const securityEvents = [
  {
    event: "Wallet connection approved",
    time: "5 minutes ago",
    status: "Safe",
  },
  {
    event: "Transaction verification completed",
    time: "20 minutes ago",
    status: "Safe",
  },
  {
    event: "New device login detected",
    time: "1 hour ago",
    status: "Reviewed",
  },
];


function SecurityCenter() {

  return (

    <div className="min-h-screen bg-slate-950 text-white p-6">


      {/* Header */}

      <motion.div
        initial={{opacity:0,y:-20}}
        animate={{opacity:1,y:0}}
        className="mb-8"
      >

        <h1 className="text-3xl font-bold">
          Security Center
        </h1>

        <p className="text-gray-400 mt-2">
          Protect your blockchain assets with advanced security monitoring
        </p>

      </motion.div>





      {/* Security Score */}

      <motion.div
        whileHover={{scale:1.02}}
        className="
        bg-white/10
        backdrop-blur-xl
        rounded-2xl
        p-8
        mb-8
        "
      >

        <div className="flex items-center gap-4">

          <ShieldCheck
            size={50}
            className="text-green-400"
          />

          <div>

            <h2 className="text-xl font-semibold">
              Wallet Security Score
            </h2>

            <p className="text-5xl font-bold mt-3">
              92<span className="text-gray-400 text-2xl">/100</span>
            </p>

            <p className="text-green-400 mt-2">
              Excellent Protection
            </p>

          </div>

        </div>


        <div className="mt-6 bg-black/30 rounded-full h-3">

          <div
            className="
            bg-green-400
            h-3
            rounded-full
            "
            style={{width:"92%"}}
          />

        </div>


      </motion.div>





      {/* Security Cards */}

      <div className="grid md:grid-cols-4 gap-6 mb-8">


      {
        securityChecks.map((item,index)=>(

          <motion.div
            key={index}
            whileHover={{scale:1.05}}
            className="
            bg-white/10
            backdrop-blur-xl
            rounded-2xl
            p-5
            "
          >

            <div className="text-cyan-400">
              {item.icon}
            </div>


            <h3 className="font-semibold mt-4">
              {item.title}
            </h3>


            <div className="flex items-center gap-2 mt-3 text-green-400">

              <CheckCircle size={18}/>

              {item.status}

            </div>


          </motion.div>

        ))
      }


      </div>






      {/* Risk Monitoring */}

      <div className="grid lg:grid-cols-3 gap-6 mb-8">


        <RiskCard
          title="Transaction Risk"
          value="Low"
          icon={<Activity/>}
        />


        <RiskCard
          title="Network Threats"
          value="None Detected"
          icon={<Lock/>}
        />


        <RiskCard
          title="Contract Safety"
          value="Verified"
          icon={<ShieldCheck/>}
        />


      </div>






      {/* Security Events */}

      <motion.div
        className="
        bg-white/10
        backdrop-blur-xl
        rounded-2xl
        p-6
        "
      >

        <h2 className="text-xl font-semibold mb-5">
          Recent Security Events
        </h2>


        <div className="space-y-4">


        {
          securityEvents.map((event,index)=>(

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

              <div className="flex items-center gap-3">

                <CheckCircle
                  className="text-green-400"
                />

                <div>

                  <h3 className="font-semibold">
                    {event.event}
                  </h3>

                  <p className="text-gray-400 text-sm">
                    {event.time}
                  </p>

                </div>

              </div>


              <span className="text-green-400">
                {event.status}
              </span>


            </motion.div>

          ))
        }


        </div>


      </motion.div>


    </div>

  );

}




function RiskCard({title,value,icon}){

return (

<motion.div
whileHover={{scale:1.05}}
className="
bg-white/10
backdrop-blur-xl
rounded-2xl
p-6
"
>

<div className="text-cyan-400">
{icon}
</div>


<h3 className="text-gray-400 mt-4">
{title}
</h3>


<p className="text-2xl font-bold mt-2">
{value}
</p>


</motion.div>

);

}



export default SecurityCenter;