import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { logoutCurrentUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Button = ({ handleViewProfile }) => {
  return (
    <StyledWrapper>
      <button onClick={handleViewProfile}>
        <span>View Profile</span>
      </button>
    </StyledWrapper>
  );
};

const ProfilePopup = ({ onClose }) => {
  const { userData } = useSelector((state) => state.user || {});
  const name = userData ? userData.name : "User";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleViewProfile = () => {
    onClose();
    navigate("/profile");
  };

  const handleLogout = async () => {
    const result = await logoutCurrentUser(dispatch);
    onClose(); 
    toast.success(result.message || "Logged out successfully!");
    
    navigate("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 10, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="absolute right-10 md:right-20 lg:right-30 xl:right-40 2xl:right-50 flex flex-col items-center justify-center mt-4 w-64 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] p-4 text-white z-50"
    >
      <h4 className="text-lg font-semibold mb-2">
        Hello, {name}!
      </h4>

      <p className="text-sm mb-4 text-center">
        View Profile Dashboard and created notes!
      </p>

      <div className="flex gap-4">
        <Button handleViewProfile={handleViewProfile} />

        <button
          onClick={handleLogout}
          className="
          flex items-center justify-center
          px-2.5 py-1.5
          rounded-lg
          text-center
          text-black text-[14px] font-semibold
          bg-white
          transition-all duration-300
          hover:bg-red-500
          hover:text-white
          hover:shadow-lg
          active:scale-95
        "
        >
          Logout
        </button>
      </div>
    </motion.div>
  );
};

const StyledWrapper = styled.div`
  button {
    position: relative;
    padding: 4px 8px;
    font-size: 10px;
    font-weight: 200;
    border-radius: 8px;
    cursor: pointer;
    margin: 0 auto;
    transition: all 0.3s ease-in-out;
    color: transparent;
    background: white;
    border: 3px solid transparent;

    background-image: 
      linear-gradient(white, white),
      linear-gradient(90deg, #4f46e5, #a855f7, #c084fc, #db2777);

    background-origin: border-box;
    background-clip: padding-box, border-box;
  }

  button span {
    font-weight: 900;
    font-size: 15px;
    background: linear-gradient(90deg, #4f46e5, #a855f7, #db2777);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  button:hover {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
    color: #fff;
    box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3);
  }
`;

export default ProfilePopup;