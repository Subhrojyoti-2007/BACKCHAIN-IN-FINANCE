import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Blocks,
  CreditCard,
  Shield,
  User,
  Settings,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";


const menu = [
  {
    name:"Dashboard",
    path:"/dashboard",
    icon:<LayoutDashboard/>
  },
  {
    name:"Analytics",
    path:"/analytics",
    icon:<BarChart3/>
  },
  {
    name:"Explorer",
    path:"/explorer",
    icon:<Blocks/>
  },
  {
    name:"Payments",
    path:"/payments",
    icon:<CreditCard/>
  },
  {
    name:"Security",
    path:"/security",
    icon:<Shield/>
  },
  {
    name:"Profile",
    path:"/profile",
    icon:<User/>
  },
  {
    name:"Settings",
    path:"/settings",
    icon:<Settings/>
  }
];


function Layout(){

return(

<div className="
min-h-screen
bg-gradient-to-br from-slate-950 via-slate-900 to-black
text-white
flex
">


{/* Sidebar */}

<motion.aside

initial={{x:-100}}
animate={{x:0}}

className="
hidden
md:flex
w-72
bg-white/10
backdrop-blur-2xl
border
border-white/10
shadow-xl
backdrop-blur-xl
border-r
border-white/10
flex-col
p-6
"

>


<h1 className="
text-2xl
font-bold
text-cyan-400
mb-10
">

BlockFinance

</h1>



<nav className="space-y-3">


{
menu.map((item,index)=>(

<NavLink
key={index}
to={item.path}

className={({isActive})=>

`
flex
items-center
gap-3
p-3
rounded-xl
transition

${
isActive
?
"bg-cyan-400 text-black"
:
"hover:bg-white/10"
}

`

}

>

{item.icon}

{item.name}

</NavLink>

))
}



</nav>


</motion.aside>






{/* Main */}

<div className="flex-1">


{/* Navbar */}

<div className="
h-20
border-b
border-white/10
flex
items-center
justify-between
px-6
bg-white/5
backdrop-blur-xl
">


<h2 className="text-xl font-semibold">
Web3 Finance Dashboard
</h2>



<button
className="
bg-cyan-400
text-black
px-5
py-2
rounded-xl
font-semibold
"
>

Connect Wallet

</button>


</div>




<main className="p-6">

<Outlet/>

</main>



</div>


</div>

)

}


export default Layout;