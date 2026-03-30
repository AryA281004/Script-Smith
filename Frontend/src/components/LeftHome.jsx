import React from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { IoSettings } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { auth, provider } from "../utils/firebase";
import axios from "axios"
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";



const LeftHome = () => {


  const navigate = useNavigate();
  const [authMessage, setAuthMessage] = useState("");
  const dispatch = useDispatch();

  const handleManualContinue = () => {
    navigate("/auth");
  };

  const googleContinue = async () => {
  try {
    setAuthMessage("");

    const response = await signInWithPopup(auth, provider);
    const user = response.user;

    const idToken = await user.getIdToken();

    const result= await axios.post(
      `${serverUrl}/api/auth/register-google`,
      {
        name: user.displayName,
        email: user.email,
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        withCredentials: true,
      }
    );

    const data = result.data;
   
    if (data && data.user) dispatch(setUserData(data.user));
     setAuthMessage("Google sign-in successful!");
     navigate("/authcomplete");

   


} catch (error) {
    console.error("Google sign-in error:", error);

    if (error.code === "auth/popup-closed-by-user") {
      setAuthMessage("Popup was closed. Try again.");
    } else if (error.code === "auth/popup-blocked") {
      setAuthMessage("Enable popups for this site.");
    } else {
      setAuthMessage("Google sign-in failed.");
    }
  }
};

  


  return (
    <div className=" w-full h-[75vh] xl:w-[33.3333vw] rounded-[50px] flex flex-col  gap-4 xl:gap-6 2xl:gap-10">
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      style={{preserve: '3d'}}
      className="relative overflow-hidden   h-[50vh] xl:h-[80%] rounded-[50px]
               bg-radial backdrop-blur-xl
               border border-white/50
               shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_5px_10px_rgba(255,255,255,0.6)]
               transition-all duration-500 


               before:absolute before:inset-0 before:rounded-[50px] 
               before:bg-linear-to-br before:from-white/50 before:via-transparent 
               before:to-transparent before:opacity-60 before:pointer-events-none 
               
               after:absolute after:inset-0 after:rounded-[50px] after:bg-linear-to-tl 
               after:from-white/20 after:via-transparent after:to-transparent 
               after:opacity-40 after:pointer-events-none
               
               "
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 0.3 }}
        className="absolute inset-0 flex flex-col   pl-1 pt-1 lg:pl-2 lg:pt-2"
      >
        <div className="flex flex-row  ">
          <h2
            className="ai-h2 mt-4 ml-6 lg:mt-2 lg:ml-3 2xl:mt-4 2xl:ml-6  text-5xl font-mono lg:text-2xl xl:text-4xl  2xl:text-6xl font-extrabold lg:font-extrabold 
                        bg-linear-to-br from-indigo-700 via-purple-500 to-pink-600 bg-clip-text text-transparent"
          >
            Unlock
          </h2>
          <h1
            className="mt-2 ml-2 lg:-mt-3 xl:-mt-1 2xl:mt-1.5 text-6xl font-mono lg:text-5xl xl:text-5xl 2xl:text-7xl tracking-wide lg:tracking-widest"
            style={{ WebkitTextStroke: "1px white", color: "transparent" }}
          >
            AI
          </h1>
        </div>

        <h2
          className="ai-h2 mt-4 ml-6 lg:mt-2 lg:ml-3 xl:mt-0.5 2xl:mt-4 2xl:ml-6 text-2xl lg:text-2xl xl:text-[25px] 2xl:text-4xl font-bold 
                    bg-linear-to-br from-white/90 via-white/60 to-white/90 bg-clip-text text-transparent"
        >
          Forge Smart Notes
        </h2>

        <p
          className="ai-h2 mt-2 ml-4 lg:mt-1 lg:ml-2 xl:mt-1.25 xl:ml-4 2xl:mt-4 2xl:ml-6
                    text-sm lg:text-sm xl:text-[16px] 2xl:text-lg
                    tracking-normal leading-relaxed xl:leading-5 2xl:leading-relaxed
                  text-white/60 max-w-md"
        >
          You get <span className="font-extrabold">100 FREE credits</span>
          <br />
          to forge Exam notes, Project notes <br /> with Charts/Graphs and download
          clean <br />PDFs instantly using{" "}
          <span className="font-extrabold">Script Smith's AI</span>.
        </p>

        <div className="flex flex-col items-start mt-3 lg:mt-1 xl:mt-4 2xl:mt-3  w-[70%] lg:w-[80%]">
          <motion.button
            whileTap={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 150, damping: 18 }}
            onClick={handleManualContinue}
            className="relative inline-flex 
            mt-2 ml-4 lg:mt-1 lg:ml-2 xl:-mt-2 xl:ml-4 2xl:mt-4 2xl:ml-6 px-6 py-3  xl:px-4 xl:py-1.75 2xl:px-8 2xl:py-3 
            border border-white/50 
            bg-white/10 
            text-white/80 xl:text-sm 2xl:text-lg font-bold xl:font-medium 2xl:font-bold  rounded-full shadow-lg hover:shadow-xl 

                       before:absolute before:inset-0 before:rounded-[50px] 
                       before:bg-linear-to-br before:from-white/50 before:via-transparent 
                       before:to-transparent before:opacity-60 before:pointer-events-none 
               
                       after:absolute after:inset-0 after:rounded-[50px] after:bg-linear-to-tl 
                       after:from-white/20 after:via-transparent after:to-transparent 
                       after:opacity-40 after:pointer-events-none
        "
          >
            <IoSettings size={22} />
            <span>Continue Manually</span>
          </motion.button>
          
          <div className="flex justify-center items-center mt-2 ml-4 lg:mt-1 lg:ml-2 xl:mt-px xl:ml-4 2xl:mt-4 2xl:ml-6  mx-4 w-[90%] lg:w-[66%] ">
            <hr className="grow border-white/30 w-2" />
            <span className="mx-4 text-white/90">or</span>
            <hr className="grow border-white/30 w-2" />
          </div>

          <motion.button
            transition={{ type: "spring", stiffness: 150, damping: 18 }}
            whileTap={{ scale: 0.95 }}
            whileHover={{ x:0 , y : 6 , scale: 1.05  }}
            onClick={googleContinue}
            className="inline-flex items-center gap-2 mt-2 ml-4 lg:mt-1 lg:ml-2 xl:mt-px xl:ml-4 2xl:mt-4 2xl:ml-6 px-4 py-3 xl:px-2 xl:py-1.75 2xl:px-4 2xl:py-3
                       border border-white/50 
                       xl:text-sm 2xl:text-lg
                       bg-linear-to-r from-black/90 via-black/40 to-black/90 
                       text-white/80 font-bold xl:font-medium 2xl:font-bold  rounded-full 
                       shadow-lg hover:shadow-xl"
          >
            <FcGoogle size={23} />
            <span>Continue with Google</span>
          </motion.button>
          
        </div>
      </motion.div>

    

    </motion.div>
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="relative overflow-hidden   h-[20vh] 2xl:h-[20vh] rounded-[50px]
               bg-radial backdrop-blur-xl
               border border-white/50
               shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_5px_10px_rgba(255,255,255,0.6)]
               transition-all duration-500 


               before:absolute before:inset-0 before:rounded-[50px] 
               before:bg-linear-to-br before:from-white/50 before:via-transparent 
               before:to-transparent before:opacity-60 before:pointer-events-none 
               
               after:absolute after:inset-0 after:rounded-[50px] after:bg-linear-to-tl 
               after:from-white/50 after:via-transparent after:to-transparent 
               after:opacity-40 after:pointer-events-none
               
               "
    >
        <a href="https://task-master-bay-eight.vercel.app/" className="
        flex flex-col
        absolute inset-0 items-center justify-center text-white font-bold text-lg lg:text-xl tracking-wide rounded-[50px]
        bg-linear-to-br from-white/20 via-transparent to-transparent  transition-opacity duration-300">
            Explore 
          
          <h1 className="font-blanka h-15 text-4xl sm:text-5xl font-extrabold bg-linear-to-r from-indigo-700 via-purple-500 to-pink-600 bg-clip-text text-transparent opacity-90 hover:opacity-100 transition-opacity duration-300">
        Task Master
      </h1>

        </a>

    </motion.div>
    </div>
  );
};

export default LeftHome;