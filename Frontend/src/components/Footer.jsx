import React from 'react'
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  
  transition={{ duration: 0.5 }}
  className="
    relative w-[95vw] xl:w-[85vw] mx-auto mb-8 
    backdrop-blur-xl
    bg-white/5
    border border-white/40
    rounded-[50px]
    px-8 py-6
    overflow-hidden
    before:absolute before:inset-0 before:rounded-[50px] 
                       before:bg-linear-to-br before:from-white/50 before:via-transparent 
                       before:to-transparent before:opacity-60 before:pointer-events-none 
                       
                       after:absolute after:inset-0 after:rounded-[50px] after:bg-linear-to-tl 
                       after:from-white/20 after:via-transparent after:to-transparent 
                       after:opacity-40 after:pointer-events-none
  "
>


  <div className="relative z-10 flex flex-col md:flex-row 
                  items-center justify-between gap-4
                  text-white text-sm">

    {/* Left */}
    <div className="text-white/50">
      © {new Date().getFullYear()} All rights reserved
    </div>

    {/* Center Links */}
    <div className="flex gap-6 2xl:gap-8 text-white/70">
      <a className="hover:text-indigo-400 transition-colors cursor-pointer">
        Task Master
      </a>
      <a className="hover:text-pink-400 transition-colors cursor-pointer">
        Elemental
      </a>
      <a className="hover:text-purple-400 transition-colors cursor-pointer">
        Script Smith
      </a>
    </div>

    {/* Right */}
    <div className="text-white/40">
      Built with precision
    </div>

  </div>
</motion.footer>
  )
}

export default Footer