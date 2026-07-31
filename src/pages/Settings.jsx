import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Wallet,
  Globe,
  DollarSign,
  Lock,
  Smartphone,
  CheckCircle,
} from "lucide-react";


function Settings() {

  return (

    <div className="min-h-screen bg-slate-950 text-white p-6">


      {/* Header */}

      <motion.div
        initial={{opacity:0,y:-20}}
        animate={{opacity:1,y:0}}
        className="mb-8"
      >

        <h1 className="text-3xl font-bold flex items-center gap-3">

          <SettingsIcon className="text-cyan-400"/>

          Settings

        </h1>


        <p className="text-gray-400 mt-2">
          Manage your account, wallet and security preferences
        </p>


      </motion.div>





      {/* Settings Sections */}

      <div className="grid lg:grid-cols-2 gap-6">


        {/* Account Settings */}

        <SettingCard title="Account Settings">

          <SettingItem
            icon={<Globe/>}
            title="Language"
            value="English"
          />

          <SettingItem
            icon={<DollarSign/>}
            title="Currency"
            value="USD"
          />

          <SettingItem
            icon={<Shield/>}
            title="Profile Visibility"
            value="Public"
          />

        </SettingCard>





        {/* Wallet Settings */}

        <SettingCard title="Wallet Settings">


          <SettingItem
            icon={<Wallet/>}
            title="Network"
            value="Ethereum Mainnet"
          />


          <SettingItem
            icon={<CheckCircle/>}
            title="Wallet Connection"
            value="Auto Connect ON"
          />


        </SettingCard>






        {/* Notification Settings */}

        <SettingCard title="Notification Settings">


          <ToggleItem
            icon={<Bell/>}
            title="Transaction Alerts"
            status="ON"
          />


          <ToggleItem
            icon={<Shield/>}
            title="Security Alerts"
            status="ON"
          />


          <ToggleItem
            icon={<Bell/>}
            title="Market Updates"
            status="OFF"
          />


        </SettingCard>






        {/* Security Preferences */}

        <SettingCard title="Security Preferences">


          <SettingItem
            icon={<Lock/>}
            title="Two Factor Authentication"
            value="Enabled"
          />


          <SettingItem
            icon={<Smartphone/>}
            title="Biometric Login"
            value="Enabled"
          />


        </SettingCard>



      </div>





      {/* Save Button */}

      <motion.button
        whileHover={{scale:1.05}}
        className="
        mt-8
        bg-cyan-500
        text-black
        font-bold
        px-8
        py-3
        rounded-xl
        "
      >

        Save Changes

      </motion.button>



    </div>

  );

}






function SettingCard({title,children}){

return (

<motion.div

whileHover={{scale:1.02}}

className="
bg-white/10
backdrop-blur-xl
rounded-2xl
p-6
"

>


<h2 className="text-xl font-semibold mb-5">

{title}

</h2>


{children}


</motion.div>

);

}






function SettingItem({icon,title,value}){

return (

<div
className="
flex
justify-between
items-center
bg-black/20
rounded-xl
p-4
mb-3
"
>


<div className="flex items-center gap-3">

<div className="text-cyan-400">

{icon}

</div>


<span>

{title}

</span>


</div>



<span className="text-green-400">

{value}

</span>



</div>

);

}






function ToggleItem({icon,title,status}){

return (

<div
className="
flex
justify-between
items-center
bg-black/20
rounded-xl
p-4
mb-3
"
>


<div className="flex items-center gap-3">


<div className="text-cyan-400">

{icon}

</div>


<span>

{title}

</span>


</div>



<div
className={`
px-3
py-1
rounded-full
text-sm
${status==="ON"
?"bg-green-400/20 text-green-400"
:"bg-gray-400/20 text-gray-400"}
`}
>

{status}

</div>



</div>

);

}




export default Settings;