import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Blocks,
  CreditCard,
  Shield,
  User,
  Settings,
  TerminalSquare,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AnimatedNavFramer } from "./ui/navigation-menu";

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
  },
  {
    name:"Terminal",
    path:"/terminal",
    icon:<TerminalSquare/>
  }
];

function Layout(){
  const { user, logout } = useAuth();


return(

<div className="
min-h-screen
text-white
flex
">


{/* Main */}

<div className="flex-1">


{/* Animated Framer Navbar */}
<AnimatedNavFramer />




<main className="p-6 pt-24">

<Outlet/>

</main>



</div>


</div>

)

}


export default Layout;