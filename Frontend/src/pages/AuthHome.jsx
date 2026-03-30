import React from "react";
import Header from "../components/Header";
import Auth from "../components/LeftHome";
import RightHome from "../components/RightHome";




const AuthHome = () => {
 
  return (
    <div
      className="
      min-h-screen 
      w-full
      relative overflow-hidden px-4 lg:px-6"
    >


      
      <Header />
      


      <main className="max-w-[100vw] lg:max-w-[85vw] relative 
      mx-auto 
      flex flex-col  lg:flex lg:flex-row  
       gap-4 lg:gap-4 xl:gap-6 2xl:gap-10
      mt-4 xl:mt-6 2xl:mt-10 
      mb-4 xl:mb-0 ">

  {/* LEFT CONTENT */}
  <Auth />


  {/* RIGHT CONTENT */}
  <RightHome />

</main>


    </div>
  );
};

export default AuthHome;
