import React from "react";
import { Outlet } from "react-router-dom";

import Navbarafterauth from "./Navbarafterauth";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen text-white">

      <Navbarafterauth />

      <main className="flex-1 w-full max-w-[95vw] lg:max-w-[85vw] mx-auto mb-4 xl:mb-6 2xl:mb-10">
        <Outlet />
      </main>

      <Footer />

    </div>
  );
};

export default Layout;