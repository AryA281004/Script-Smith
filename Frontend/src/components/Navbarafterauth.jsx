import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaCoins } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import CreditPopup from "./CreditPopup";
import ProfilePopup from "./ProfilePopup";

const Navbarafterauth = () => {
  const { userData } = useSelector((state) => state.user || {});
  const credits = userData ? userData.credits : 0;
  const [showCredits, setShowCredits] = React.useState(false);
  const name = userData ? userData.name.charAt(0).toUpperCase() : "U";
  const [showProfilePopup, setShowProfilePopup] = React.useState(false);
  const navigate = useNavigate();
  const creditRef = useRef(null);
const profileRef = useRef(null);



  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      creditRef.current &&
      !creditRef.current.contains(event.target)
    ) {
      setShowCredits(false);
    }

    if (
      profileRef.current &&
      !profileRef.current.contains(event.target)
    ) {
      setShowProfilePopup(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  return (
    <div>
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="liquid-glass max-w-[95vw] lg:max-w-[85vw] w-full  rounded-[50px] mx-auto mt-4 md:mt-4 lg:mt-6 xl:mt-8 2xl:mt-8
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
          after:opacity-40 after:pointer-events-none"
    >
      <div className="flex flex-col w-27 items-center sm:w-32 md:w-40 lg:w-48 xl:w-56 2xl:w-64">
        <h1
          className="text-[14px] sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold tracking-wide
               bg-linear-to-r from-indigo-600 via-purple-400 to-pink-600
               bg-size-[200%_200%]
               animate-[gradientMove_4s_ease_infinite]
               bg-clip-text text-transparent
               mb-2"
        >
          Script Smith
        </h1>
        <p className="font-mono font-extralight text-gray-400 text-[7px] sm:text-[9px] md:text-xs lg:text-sm xl:text-base tracking-normal -mt-1 md:-mt-2">
          AI Forges Your Excellence
        </p>
      </div>

      <div className="flex flex-row justify-center gap-3 items-center">

        <motion.div
          onClick={() => {
            setShowCredits(!showCredits)
            setShowProfilePopup(false)

          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="
                    flex items-center justify-center
                    px-3 py-1.5
                    rounded-full
                   bg-white/10
                    backdrop-blur-xl
                    border border-white/20
                   text-white text-[18px] font-semibold
                    shadow-[0_4px_20px_rgba(0,0,0,0.25)]
                   hover:bg-white/20
                    transition-all duration-300
                    gap-2
                    ">
          <span>
            <FaCoins />
          </span>
          <span className="relative z-10">{credits}</span>
          <motion.div
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
            className="w-5 h-5 p-1 rounded-full 
                      flex items-center justify-center 
                      bg-white/10
                      backdrop-blur-xl 
                      border border-white/30"
          >
            <FaPlus  />
          </motion.div>
        </motion.div>

        

        <motion.div
        onClick={() => {
          setShowProfilePopup(!showProfilePopup)
          setShowCredits(false)
        }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="w-10 h-10  rounded-full flex items-center justify-center bg-white/10
          backdrop-blur-xl 
          border border-white/30
          
          before:content-[''] before:absolute before:inset-0 before:rounded-[50px]
          before:bg-linear-to-br before:from-white/0 before:via-transparent before:to-transparent
          before:opacity-60 before:pointer-events-none

          after:content-[''] after:absolute after:inset-0 after:rounded-[50px]
          after:bg-linear-to-tl after:from-white/20 after:via-transparent after:to-transparent
          after:opacity-40 after:pointer-events-none"
        >
          <h6 className="text-white/90 text-[18px] font-bold font-blanka">{name}</h6>
        </motion.div>
      </div>
    </motion.div>
    
    <AnimatePresence>
  {showCredits && (
    <div ref={creditRef}>
      <CreditPopup />
    </div>
  )}
</AnimatePresence>

<AnimatePresence>
  {showProfilePopup && (
    <div ref={profileRef}>
      <ProfilePopup onClose={() => setShowProfilePopup(false)} />
    </div>
  )}
</AnimatePresence>


    </div>
  );
};

export default Navbarafterauth;
