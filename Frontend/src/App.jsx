import React, { useEffect, useState, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Background from "./components/Background";
import Loader from "./components/Loader";

import { getcurrentUser } from "./api/api";
import { useDispatch, useSelector } from "react-redux";

import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import DetailedNotes from "./pages/DetailedNotes";


const Home = React.lazy(() => import("./pages/Home"));
const AuthHome = React.lazy(() => import("./pages/AuthHome"));
const Authmanual = React.lazy(() => import("./pages/Authmanual"));
const Forgenotes = React.lazy(() => import("./pages/Forgenotes"));
const Pricing = React.lazy(() => import("./pages/Pricing"));
const PaymentSuccess = React.lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailed = React.lazy(() => import("./pages/PaymentFailed"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));



export const serverUrl = import.meta.env.VITE_BACKEND_URL ;
console.log("Backend URL:", serverUrl);

const App = () => {
  const dispatch = useDispatch();
  const { userData, isLoggedOut } = useSelector((state) => state.user);

  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!isLoggedOut) {
        const getState = () => ({ user: { userData, isLoggedOut } });

        try {
          await getcurrentUser(dispatch, getState);
        } catch (e) {
          console.error(e);
        }
      }

      if (mounted) setAuthChecked(true);
    };

    init();

    return () => {
      mounted = false;
    };
  }, [dispatch, isLoggedOut]);

  const isAuthenticated = Boolean(userData && !isLoggedOut);

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
  <>
    {/* 🔥 GLOBAL TOASTER */}
    <Toaster 
      position="top-right"
      toastOptions={{
        duration: 8000,
        style: {
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "12px",
          padding: "12px 16px",
        },
      }}
    />

    {/* BACKGROUND */}
    
      <Background
        enabledWaves={["top", "middle", "bottom", "extra"]}
        lineCount={8}
        lineDistance={5}
        bendRadius={5}
        bendStrength={-0.5}
        interactive={true}
        parallax={true}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0
        }}
      />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
        <Routes>

          <Route path="/" element={isAuthenticated ? <Navigate to="/authcomplete" replace /> : <AuthHome />} />
          <Route path="/auth" element={isAuthenticated ? <Navigate to="/authcomplete" replace /> : <Authmanual />} />

          <Route path="/pricing" element={<Pricing />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/resetpassword" element={isAuthenticated? <ResetPassword /> : <Navigate to="/" replace />} />

          <Route element={<Layout />}>
            <Route path="/authcomplete" element={isAuthenticated ? <Home /> : <Navigate to="/" replace />} />
            <Route path="/forgenotes" element={isAuthenticated ? <Forgenotes /> : <Navigate to="/" replace />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/" replace />} />
            <Route path="/notes/:id" element={isAuthenticated ? <DetailedNotes /> : <Navigate to="/" replace />} />
          </Route>

        </Routes>
      </div>
   
  </>
);
};
  

export default App;