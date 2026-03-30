import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProfileHomeCard from "./ProfileHomeCard";
import ProductHomeCard from "./ProductHomeCard";

const TopGetStartedSection = () => {
  const navigate = useNavigate();

  const handleForgeNotesClick = () => {
    navigate("/forgenotes");
  };

  return (
    <section
      className="w-full xl:w-[60vw] 2xl:w-[65vw] 
   
  rounded-[65px] 
  relative overflow-hidden   px-6 py-6
                       bg-radial backdrop-blur-xl
                       border border-white/40
                       transition-all duration-500 
        
        
                       before:absolute before:inset-0 before:rounded-[50px] 
                       before:bg-linear-to-br before:from-white/50 before:via-transparent 
                       before:to-transparent before:opacity-60 before:pointer-events-none 
                       
                       after:absolute after:inset-0 after:rounded-[50px] after:bg-linear-to-tl 
                       after:from-white/20 after:via-transparent after:to-transparent 
                       after:opacity-40 after:pointer-events-none
 
  flex xl:flex-col gap-10"
    >
      {/* Top Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start">
        {/* Small Left Pill */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformStyle: "preserve-3d" }}
          className=" transform-gpu
      perspective-[1000px]
      flex flex-col
      rounded-full"
        >
          <motion.h2
            className="ai-h2 font-bold tracking-[0.02em] ml-3 mt-3 text-white"
          >
            <span className=" text-3xl  2xl:text-4xl  ">Forge Smart</span>

            <br />

            <span
              className="
   text-4xl xl:text-5xl 2xl:text-6xl
    bg-linear-to-r from-indigo-600 via-purple-500 to-pink-600
    bg-clip-text text-transparent tracking-[-0.02em]
  "
            >
              AI Notes
            </span>
            <br />
            <span className="text-white/60 font-medium text-3xl 2xl:text-4xl">
              in seconds.
            </span>
          </motion.h2>
          <motion.p className="text-white/90 text-lg xl:text-[15px] 2xl:text-lg mt-3 xl:mt-1 2xl:mt-3 ml-3">
            Generate exam focused notes,
            <br /> project documentation, flow diagrams <br className="xl:hidden" /> and
            revision-ready content using AI - <br /> <b>faster</b> ,{" "}
            <b>cleaner</b> and <b>smarter</b>.
          </motion.p>

          <motion.button
            onClick={() => handleForgeNotesClick()}
            whileHover={{ rotateX: 10, rotateY: -10, scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
            style={{ transformStyle: "preserve-3d" }}
            className="ml-4 2xl:ml-6 mt-4 2xl:mt-8 w-fit
                         px-4 2xl:px-6 py-2 rounded-full
                        bg-linear-to-r from-pink-500 via-fuchsia-500 to-purple-500
                         text-white font-semibold tracking-wide
                        shadow-[0_10px_40px_rgba(236,72,153,0.5)]
                        transition-all duration-300
                        hover:scale-[1.03]
                        hover:shadow-[0_15px_60px_rgba(236,72,153,0.8)]
                        active:scale-95
      "
          >
            Forge More Notes
          </motion.button>
        </motion.div>
        <div className="flex flex-col-reverse xl:flex-row 2xl:flex-row gap-8 xl:gap-4 2xl:gap-20">
          <ProductHomeCard />

          {/* Right Big Card */}
          <ProfileHomeCard />
        </div>
      </div>
    </section>
  );
};

export default TopGetStartedSection;
