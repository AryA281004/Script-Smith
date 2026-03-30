import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { serverUrl } from "../App";
import axios from "axios";
import toast from 'react-hot-toast';
import { setUserData } from '../redux/userSlice';
import { otpForForgotPassword, verifyForgotPasswordOTP, resetPasswordAfterOTP } from "../api/api";

const inputClasses = "w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/50 outline-none mb-3";

const Login = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPromptVisible, setForgotPromptVisible] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const redirect = useNavigate();
  const dispatch = useDispatch();

  const handleForgotClick = () => {
    setForgotMode(true);
    setForgotPromptVisible(false);
    setOtpSent(false);
    setOtpVerified(false);
    setOtp("");
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSendOtp = async () => {
    if (!email.trim()) return toast.error("Please enter your email");

    setLoading(true);
    const toastId = toast.loading("Sending OTP...");

    try {
      const res = await otpForForgotPassword(email.trim());
      if (!res || res.success === false) {
        throw new Error(res?.message || "Failed to send OTP");
      }

      toast.success(res.message || "OTP sent to your email", { id: toastId });
      setOtpSent(true);
    } catch (err) {
      console.error("Error sending OTP:", err);
      toast.error(err.message || "Failed to send OTP", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const normalizedOtp = otp.replace(/\D/g, "").trim();
    if (!normalizedOtp) return toast.error("Please enter OTP");
    if (normalizedOtp.length !== 6) return toast.error("Please enter 6-digit OTP");

    setLoading(true);
    const toastId = toast.loading("Verifying OTP...");

    try {
      const res = await verifyForgotPasswordOTP(email.trim(), normalizedOtp);
      if (!res || res.success === false) {
        throw new Error(res?.message || "Failed to verify OTP");
      }

      toast.success(res.message || "OTP verified successfully", { id: toastId });
      setOtpVerified(true);
    } catch (err) {
      console.error("Error verifying OTP:", err);
      toast.error(err.message || "Failed to verify OTP", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      return toast.error("All fields are required");
    }

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    const toastId = toast.loading("Resetting password...");

    try {
      const result = await resetPasswordAfterOTP(email.trim(), newPassword.trim());

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success("Password reset successfully 🔐", { id: toastId });

      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOtp("");
      setOtpVerified(false);
      setOtpSent(false);
      setForgotMode(false);
    } catch (err) {
      console.error(err?.message || err);
      toast.error(err?.message || "Something went wrong", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const loginmanually = async (e) => {
    e.preventDefault();
    if (forgotMode) return;

    if (!email.trim() || !password.trim()) {
      return toast.error("Email and password are required");
    }

    setLoading(true);
    const toastId = toast.loading("Logging in...");

    try {
      const response = await axios.post(
        serverUrl + "/api/auth/login",
        { email: email.trim(), password: password.trim() },
        { withCredentials: true }
      );

      if (response.status !== 200) {
        throw new Error("Login failed");
      }

      const data = response.data;

      if (data && data.user) dispatch(setUserData(data.user));
      setForgotPromptVisible(false);
      toast.success("Login successful!", { id: toastId });
      redirect("/authcomplete");
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg = error.response?.data?.message || "Login failed. Please try again.";

      if (/password|credential|invalid/i.test(errorMsg)) {
        setForgotPromptVisible(true);
      }

      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const resetForgotFlow = () => {
    setForgotMode(false);
    setForgotPromptVisible(false);
    setOtpSent(false);
    setOtpVerified(false);
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <form onSubmit={loginmanually} className="space-y-4">
      <h2 className="text-2xl font-semibold mb-2 text-center text-white">
        {forgotMode ? "Reset Password via Email" : "Login"}
      </h2>

      <p className="text-sm text-white/70 text-center mb-6">
        {forgotMode
          ? (otpVerified
              ? "Set your new password"
              : (otpSent ? "Enter the OTP sent to your email" : "Enter your email to receive an OTP"))
          : "Welcome back! Login to continue."}
      </p>

      {!forgotMode ? (
        <>
          <div>
            <label className="block text-lg font-bold text-white">Email</label>
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
            <label className="block text-lg font-bold text-white">Password</label>
            <input
              className={inputClasses}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {forgotPromptVisible && (
            <div className="mb-4 mt-2 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-center">
              <p className="font-semibold">❌ Invalid password or credentials</p>
              <button
                type="button"
                onClick={handleForgotClick}
                className="mt-2 text-white hover:text-red-400 font-semibold"
              >
                🔑 Forgot Password? Reset via Email
              </button>
            </div>
          )}

          <div className="flex justify-start items-center">
            <button
              type="button"
              onClick={handleForgotClick}
              className="text-sm text-indigo-300 hover:text-white transition"
            >
              Forgot password?
            </button>
          </div>

          <div className="flex justify-center items-center gap-3">
            <button
              type="submit"
              className="w-1/2 py-3 rounded-xl bg-linear-to-r from-pink-500 via-fuchsia-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              onClick={() => onSwitch("register")}
              className="text-sm text-indigo-300 hover:text-white transition"
            >
              Don't have an account?
            </button>
          </div>
        </>
      ) : (
        <>
          {!otpVerified ? (
            <>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/50 outline-none mb-4"
                disabled={otpSent}
              />

              {otpSent && (
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-600/80 focus:outline-none focus:border-green-500 focus:bg-white/20 transition-all text-center text-3xl tracking-widest font-mono"
                />
              )}

              <div className="flex justify-center mt-4 gap-3">
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="flex-1 py-3 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="flex-1 py-3 rounded-xl bg-linear-to-r from-green-500 to-emerald-500 text-white font-semibold hover:opacity-90 transition"
                      disabled={loading}
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp("");
                      }}
                      className="flex-1 py-3 rounded-xl bg-linear-to-r from-gray-600 to-gray-700 text-white font-semibold hover:opacity-90 transition"
                      disabled={loading}
                    >
                      Change Email
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/50 outline-none mb-3"
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/50 outline-none mb-4"
              />

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="flex-1 py-3 rounded-xl bg-linear-to-r from-green-500 to-emerald-500 text-white font-semibold hover:opacity-90 transition"
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtpVerified(false);
                    setOtpSent(false);
                    setOtp("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="flex-1 py-3 rounded-xl bg-linear-to-r from-gray-600 to-gray-700 text-white font-semibold hover:opacity-90 transition"
                  disabled={loading}
                >
                  Back
                </button>
              </div>
            </>
          )}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={resetForgotFlow}
              className="text-sm text-indigo-300 hover:text-white transition"
              disabled={loading}
            >
              Back to Login
            </button>
          </div>
        </>
      )}

     
    </form>
  );
};

export default Login;
