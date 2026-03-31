import React from 'react'
import { useState  } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { setUserData } from '../redux/userSlice'
import { serverUrl } from "../App";
import axios from "axios";

const inputClasses = `
mt-1 block w-full rounded-xl
bg-white/5
backdrop-blur-2xl
border border-white/30
font-mono text-white placeholder-gray/90
px-4 py-2
shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]
focus:outline-none
focus:ring-2 focus:ring-indigo-400/70
focus:border-indigo-400
transition-all duration-300
`;

const buttonClasses = `
bg-gradient-to-r from-indigo-500 to-purple-600
text-white px-4 py-2 rounded-xl
shadow-lg shadow-indigo-500/30
hover:scale-105
hover:shadow-indigo-500/60
transition-all duration-300
`;

const Register = ({ onSwitch }) => {
  
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const redirect = useNavigate();
  const dispatch = useDispatch();

  const handleRegisterSubmit =  async (e) => {

    e.preventDefault();

    

    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }
    try{
      const response = await axios.post(
        serverUrl + "/api/auth/register-manually",
        { name, email, password },
        { withCredentials: true }
      );

      if (response.status !== 201) {
        throw new Error("Registration failed");
      }

      const data = response.data;
      if (data && data.user) {
        dispatch(setUserData(data.user));
        // ✅ CRITICAL: Store token in localStorage for cross-domain auth
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }
      }
      setMessage("Registration successful!");
      toast.success("Registration successful!");
      redirect("/authcomplete");
     
    } catch (error) {
      console.error("Registration error:", error);
      const errorMsg = error.response?.data?.message || "Registration failed. Please try again.";
      setMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
     <form onSubmit={handleRegisterSubmit} >

      <div>
        <label className="block text-lg font-bold  text-white">Name</label>
        <input
          className={inputClasses}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
        />

      </div>

      <div>
        <label className="block text-lg font-bold  text-white">Email</label>
        <input
          className={inputClasses}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <label className="block text-lg font-bold  text-white">
          Password
        </label>
        <input
          className={inputClasses}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      <div>
        <label className="block text-lg font-bold  text-white">
          Confirm Password
        </label>
        <input
          className={inputClasses}
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      <div className="flex justify-center mt-4 items-center gap-3">
        <button type="submit" className={buttonClasses}>
          Register
        </button>
        <button
          type="button"
          onClick={() => onSwitch("login")}
          className="text-sm text-indigo-300 hover:text-white  transition"
        >
          Already have an account?
        </button>
      </div>

     
    </form>
  );
};

export default Register