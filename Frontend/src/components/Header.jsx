import React from 'react'
import { motion } from 'framer-motion'

const Header = () => {


  return (
    <div className=''>
    <motion.header
      initial={false}
      animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        whileHover={{scale:1.015}}
        className="liquid-glass max-w-[100vw] lg:max-w-[85vw] w-full h-15 lg:h-22 rounded-[50px] mx-auto mt-4 md:mt-4 lg:mt-6 xl:mt-6 2xl:mt-10
          relative overflow-hidden text-[clamp(1.5rem,2vw+1rem,2.5rem)] p-2
          bg-white/10
          backdrop-blur-xl
          border border-white/30 
          shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_20px_45px_rgba(255,255,255,0.25)]
          px-4

          flex flex-row items-center justify-between

          before:content-[''] before:absolute before:inset-0 before:rounded-[50px]
          before:bg-linear-to-br before:from-white/0 before:via-transparent before:to-transparent
          before:opacity-60 before:pointer-events-none

          after:content-[''] after:absolute after:inset-0 after:rounded-[50px]
          after:bg-linear-to-tl after:from-white/20 after:via-transparent after:to-transparent
          after:opacity-40 after:pointer-events-none
        "
      >
        <div className="flex flex-col w-27  items-center  sm:w-32 md:w-40 lg:w-48 xl:w-56 2xl:w-64">
          <h1
            className="text-[14px] sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl   font-bold tracking-wide 
               bg-linear-to-r from-indigo-600 via-purple-400 to-pink-600
               bg-size-[200%_200%]
               animate-[gradientMove_4s_ease_infinite]
               bg-clip-text text-transparent
               mb-2"
          >
            Script Smith
          </h1>
          <p className=" ffont-mono font-extralight
                text-gray-400
                text-[7px] sm:text-[9px] md:text-xs lg:text-sm xl:text-base
                tracking-normal
                -mt-1 md:-mt-2">
            AI Forges Your Excellence
          </p>
        </div>
      </motion.header>
    </div>
  )
}

export default React.memo(Header)