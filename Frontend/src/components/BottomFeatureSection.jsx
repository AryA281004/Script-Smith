import React from 'react'
import { motion } from "framer-motion";
import Features from "./Features";


const BottomFeatureSection = () => {

 
  return (
    
    <div>
        <section className="w-full max-w-[95vw] md:max-w-[85vw]
        relative overflow-hidden  rounded-[50px] px-2.5 py-7.5
                       bg-radial backdrop-blur-xl
                       border border-white/40
                       transition-all duration-500 
        
        
                       before:absolute before:inset-0 before:rounded-[50px] 
                       before:bg-linear-to-br before:from-white/50 before:via-transparent 
                       before:to-transparent before:opacity-60 before:pointer-events-none 
                       
                       after:absolute after:inset-0 after:rounded-[50px] after:bg-linear-to-tl 
                       after:from-white/20 after:via-transparent after:to-transparent 
                       after:opacity-40 after:pointer-events-none">
                <div className="grid grid-cols-2  md:grid-cols-4 gap-5 mx-2 sm:mx-5">
    
                    

  <Features 
    icon={"🤖"} 
    title={"AI Note Generation"} 
    des={"Instantly transform raw content into structured, exam-ready notes "} 
  />



  <Features 
    icon={"🧠"} 
    title={"Smart Summaries"} 
    des={"Convert lengthy chapters into concise, high-retention summaries in seconds."} 
  />



  <Features 
    icon={"🎓"} 
    title={"Exam Optimized"} 
    des={"Notes structured with key points and highlight sections for maximum score impact."} 
  />



 

  <Features 
    icon={"💳"} 
    title={"Credit System"} 
    des={"Transparent credit tracking with controlled AI usage for maximum efficiency."} 
  />

    
              </div>
      </section>
    </div>
  )
}

export default BottomFeatureSection