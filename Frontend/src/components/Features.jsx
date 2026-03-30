import React from 'react'
import { motion , useMotionValue, useTransform } from "framer-motion";

const Features =({icon, title ,des ,style }) => {

   const x = useMotionValue(0)
const y = useMotionValue(0)

const rotateX = useTransform(y, [-100, 100], [5, -5])
const rotateY = useTransform(x, [-100, 100], [-5, 5])

  return (
    <motion.div
    style={{
    rotateX,
    rotateY,
    transformStyle: "preserve-3d",
    willChange: "transform",
    ...style
  }}
  onMouseMove={(e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - rect.left - rect.width / 2)
    y.set(e.clientY - rect.top - rect.height / 2)
  }}
  onMouseLeave={() => {
    x.set(0)
    y.set(0)
  }}
    layout={false}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}

  transition={{ duration: 0.4, ease: "easeInOut" }}
 
  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(168,85,247,0.95)" }}
  className="relative rounded-4xl p-px xl:p-2 2xl:p-4 h-45 xl:h-32 2xl:h-50
  bg-white/10 backdrop-blur-xl
  border border-white/10
  text-white
  transition-all duration-300
  "
>

        <div className="absolute inset-0 rounded-4xl 
            bg-linear-to-br from-white/20 via-transparent to-transparent 
    opacity-40 pointer-events-none " style={{ transformStyle: "preserve-3d" }} />

  {/* Content */}
  <div className="relative z-10  transition-transform duration-300 
     mb-2" style={{ transform: "translateZ(30px)" }}>

    <div className="text-4xl xl:text-2xl 3xl:text-4xl mb-1.5 xl:-mb-1.5 2xl:mb-1.5 text-center ">
      {icon}
    </div>

    <h3 className="pl-1 text-[16px] font-semibold leading-5 xl:leading-10 tracking-light xl:text-[16px] xl:font-semibold 2xl:text-[25px] 2xl:font-bold mb-1.5 xl:-mb-2.5 2xl:mb-1.5 " >
      {title}
    </h3>

    <p className="ai-h2 pl-1 text-[16px] lg:text-[12px] xl:text-[14px] 2xl:text-[18px] text-white/80 leading-tight">
      {des}
    </p>

  </div>
       
      
    </motion.div>
  )
}

export default Features