"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const [sliderOpen, setSliderOpen] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="w-[10%]">
      <button className="border-2 border-solid border-fuchsia-300 bg-fuchsia-200 dark:border-purple-600 dark:bg-purple-700 dark:hover:bg-purple-600 w-full h-20 cursor-pointer rounded-md transition-colors text-purple-400 dark:text-purple-200" onClick={()=>setSliderOpen((prev)=>(!prev))} > {(sliderOpen ? "Close X" : "Open ···" )}</button>
      <div className={"h-[calc(100vh-5rem)] bg-cyan-200 dark:bg-blue-800 border-2 border-cyan-300 dark:border-blue-600 shadow-md absolute w-[10%] " + (sliderOpen ? "block": "hidden")}>
        <ul className="w-full space-y-2 pt-2">
          <li><a href="/tasks" className="block w-[90%] text-center p-[5%] ml-[5%] border-2 border-solid border-blue-300 bg-blue-200 dark:border-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-blue-400 dark:text-blue-200 rounded-md shadow-sm hover:bg-blue-300 transition-colors">Tasks</a></li>
          <li><a href="/dashboard" className="block w-[90%] text-center p-[5%] ml-[5%] border-2 border-solid border-blue-300 bg-blue-200 dark:border-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-blue-400 dark:text-blue-200 rounded-md shadow-sm hover:bg-blue-300 transition-colors">Dashboard</a></li>
          <li><a href="#" className="block w-[90%] text-center p-[5%] ml-[5%] border-2 border-solid border-blue-300 bg-blue-200 dark:border-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-blue-400 dark:text-blue-200 rounded-md shadow-sm hover:bg-blue-300 transition-colors">Home3</a></li>
          <li><a href="#" className="block w-[90%] text-center p-[5%] ml-[5%] border-2 border-solid border-blue-300 bg-blue-200 dark:border-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-blue-400 dark:text-blue-200 rounded-md shadow-sm hover:bg-blue-300 transition-colors">Home4</a></li>
          <li><button onClick={handleLogout} className="block w-[90%] text-center p-[5%] ml-[5%] border-2 border-solid border-fuchsia-400 bg-fuchsia-300 dark:border-fuchsia-600 dark:bg-fuchsia-800 dark:hover:bg-fuchsia-700 text-fuchsia-100 dark:text-fuchsia-200 rounded-md shadow-sm hover:bg-fuchsia-400 transition-colors">Logout</button></li>
        </ul>
      </div>
    </div>
  )
}