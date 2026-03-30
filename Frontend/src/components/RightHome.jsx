import React from 'react'
import { motion } from "framer-motion";
import Features from './Features';
import  Scriptsmith  from './Scriptsmith';

const RightHome = () => {
  return (
    <div className='w-full h-fit xl:w-[66.6667vw] rounded-[50px] flex flex-col  gap-4 xl:gap-6 2xl:gap-10'>
        <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="relative overflow-hidden w-full h-[20vh] xl:w-2/3 xl:h-[20vh] lg:w-2/3 lg:h-full rounded-[40px]
               bg-gray/60 backdrop-blur-xl
               border border-white/50
               
                transition-all duration-500
                before:absolute before:inset-0 before:rounded-[50px]
                before:bg-linear-to-br before:from-white/30 before:via-transparent 
               before:to-transparent before:opacity-60 before:pointer-events-none 
               
               after:absolute after:inset-0 after:rounded-[50px] after:bg-linear-to-tl 
               after:from-white/40 after:via-transparent after:to-transparent 
               after:opacity-40 after:pointer-events-none
               
               "
  >
    <Scriptsmith />
  </motion.div>

    
        <motion.div
    initial={{ opacity: 0, x: 60 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, ease: "easeInOut" }}
    className="relative overflow-hidden w-full h-fit rounded-[50px]
               bg-white/10 backdrop-blur-xl
               border border-white/50
               shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_5px_10px_rgba(255,255,255,0.6)]
               
               transition-all duration-500 

               before:absolute before:inset-0 before:rounded-[50px] 
               before:bg-linear-to-br before:from-white/30 before:via-transparent 
               before:to-transparent before:opacity-60 before:pointer-events-none 
               
               after:absolute after:inset-0 after:rounded-[50px] after:bg-linear-to-tl 
               after:from-white/40 after:via-transparent after:to-transparent 
               after:opacity-40 after:pointer-events-none
               
               "
  >
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 xl:gap-5 p-4 xl:p-5 2xl:p-8 2xl:gap-8 ">
        <Features 
        
  icon="🎁" 
  title="100 Free Credits" 
  des="Get started instantly with 100 free credits. Explore the full power risk-free." 
/>

<Features 

  icon="📝" 
  title="Exam-Ready Notes" 
  des="Concise notes designed for fast revision & max exam performance." 
/>

<Features 

  icon="📂" 
  title="Structured Docs" 
  des="Generate clean documentation for assignments, reports, and  projects." 
/>

<Features 

  icon="⚡" 
  title="Fast Generation" 
  des="Create detailed notes in seconds with AI, just instant results when you need them." 
/>

<Features 

  icon="📊" 
  title="Smart Visuals" 
  des="Generate charts, diagrams & flowgraphs to simplify complex concepts." 
/>

<Features 

  icon="🔽" 
  title="PDF Export" 
  des="Download beautifully formatted, print-ready PDFs instantly with a single click." 
/>

    </div>

  
  </motion.div>

  </div>
    
  )
}

export default RightHome