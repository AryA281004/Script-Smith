import React from 'react'
import { motion } from "framer-motion";

const ProductHomeCard = () => {
  return (
    <div className="flex flex-col w-[18vw] 2xl:flex-col gap-8 xl:gap-4 2xl:gap-8">
        <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
  whileHover={{ scale: 1.03, y: -8 }}
  transition={{ type: "spring", stiffness: 200 }}
  className="w-[82vw] xl:w-[18vw] 2xl:w-[20vw] 
  group relative overflow-hidden rounded-[50px] xl:rounded-[30px] 2xl:rounded-[50px] h-[18vh] xl:h-[16vh] 2xl:h-[18vh]
             backdrop-blur-xl
             bg-white/5
             border border-white/20
             shadow-xl "
>
  <a
    href="https://task-master-bay-eight.vercel.app/"
    className="flex flex-col absolute inset-0 items-center justify-center
               text-white tracking-wide rounded-[50px]"
  >
    <span className="text-sm xl:text-[13px] 2xl:text-sm uppercase tracking-[3px] opacity-70">
      Explore
    </span>

    <h2 className="font-blanka text-5xl xl:text-3xl 2xl:text-5xl font-extrabold
                   text-gray-300
                   group-hover:opacity-100 opacity-90
                   transition-all duration-300">
      Task Master
    </h2>
  </a>
</motion.div>
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
  whileHover={{ scale: 1.06, y: -10 }}
  transition={{ type: "spring", stiffness: 200 }}
  className="w-[82vw] xl:w-[18vw] 2xl:w-[20vw] 
  group relative overflow-hidden rounded-[50px] xl:rounded-[30px] 2xl:rounded-[50px] h-[20vh] xl:h-[18vh] 2xl:h-[20vh]
             backdrop-blur-xl
             
             border border-pink-400/40
             shadow-2xl"
>
  {/* Shine Effect */}
  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent
                  -translate-x-full group-hover:translate-x-full
                  transition-transform duration-1000" />

  {/* NEW Badge */}
  <span className="absolute w-fit top-4 right-6 xl:top-1 xl:right-3 2xl:top-4 2xl:right-6 text-xs px-3 py-1 xl:px-1 2xl:px-3 
                   rounded-full  bg-pink-500 text-white font-semibold shadow-md">
    In Dev
  </span>

  <a
    href="https://your-elemental-link.vercel.app/"
    className="flex flex-col absolute inset-0 items-center justify-center
               text-white tracking-wide rounded-[50px] "
  >
    <span className="text-sm xl:text-[13px] 2xl:text-sm uppercase tracking-[3px] opacity-80">
      Explore
    </span>

    <h2 className="font-blanka text-5xl xl:text-3xl 2xl:text-6xl font-extrabold
                   text-gray-300
                   drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]
                   transition-all duration-300">
      Elemental
    </h2>

    <span className="text-sm  mt-2 opacity-70">
      Master the Elements
    </span>
  </a>
</motion.div>
            </div>
  )
}

export default ProductHomeCard