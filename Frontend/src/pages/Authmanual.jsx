import React, { useState } from "react";
import { Link } from "react-router-dom";
import Login from "../components/Login";
import Register from "../components/Register";






/* =========================
   Auth Container
========================= */
const Authmanual = () => {
  const [view, setView] = useState("login");

  return (
    <div
      className="
      min-h-screen flex items-center justify-center 
      
      relative overflow-hidden px-4
    "
    >

      
     

      {/* Liquid Glass Card */}
      <div
        className="
        relative z-10 w-full max-w-md p-8 rounded-[50px]
        bg-gray/0
        backdrop-blur-xl
        border border-white/50
        shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_25px_80px_rgba(0,0,0,0.45)]
        transition-all duration-500
        animate-float

        before:absolute before:inset-0 before:rounded-[50px]
        before:bg-linear-to-br before:from-white/40 before:via-transparent before:to-transparent
        before:opacity-60 before:pointer-events-none

        after:absolute after:inset-0 after:rounded-[50px]
        after:bg-linear-to-tl after:from-white/20 after:via-transparent after:to-transparent
        after:opacity-40 after:pointer-events-none
      "
      >
        <div className="flex flex-col items-center mb-6">
         <h1 className="text-3xl lg:text-5xl h-14 font-bold tracking-widest  
               bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400
               bg-size-[200%_200%]
               animate-[gradientMove_4s_ease_infinite]
               bg-clip-text text-transparent
               mb-2">
               Script Smith
        </h1>


         <div className="relative flex w-full bg-white/5 rounded-xl p-1 backdrop-blur-xl border border-white/20">

  {/* Sliding Glass Indicator */}
  <div
    className={`absolute top-1 bottom-1 w-1/2 rounded-lg 
    bg-white/20 border border-white/30 backdrop-blur-xl
    shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]
    transition-all duration-500 ease-in-out
    ${view === "login" ? "left-1" : "left-1/2"}`}
  />

  <Link
    onClick={() => setView("login")}
    className={`relative z-10 w-1/2 h-12 font-bold text-2xl flex items-center justify-center text-center rounded-lg transition-all duration-300
    ${view === "login" ? "text-white" : "text-gray-400 hover:text-white"}`}
  >
    Login
  </Link>

  <Link
    onClick={() => setView("register")}
    className={`relative z-10 w-1/2 h-12 font-bold text-2xl flex items-center justify-center text-center rounded-lg transition-all duration-300
    ${view === "register" ? "text-white" : "text-gray-400 hover:text-white"}`}
  >
    Register
  </Link>

</div>

        </div>

        {view === "login" ? (
          <Login onSwitch={setView} />
        ) : (
          <Register onSwitch={setView} />
        )}
      </div>

      <hr />
    </div>
  );
};

export default Authmanual;
