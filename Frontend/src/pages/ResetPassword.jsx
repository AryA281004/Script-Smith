import React, { useState } from "react";
import toast from "react-hot-toast";
import { changePassword, otpForForgotPassword, verifyForgotPasswordOTP, resetPasswordAfterOTP } from "../api/api";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    email: "",
  });
    const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [forgotPromptVisible, setForgotPromptVisible] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");

  const handleForgotClick = () => {
    // enter forgot flow (show email input)
    setForgotMode(true);
    setForgotPromptVisible(false);
    setOtpSent(false);
    setOtpVerified(false);
    setOtp("");
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "", email: "" });
  };

  const handleSendOtp = async () => {
    const email = form.email || "";
    if (!email) return toast.error("Please enter your email");

    setLoading(true);
    const toastId = toast.loading("Sending OTP...");
    try {
      const res = await otpForForgotPassword( email );
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
    const email = form.email || "";
    if (!otp) return toast.error("Please enter OTP");

    setLoading(true);
    const toastId = toast.loading("Verifying OTP...");
    try {
      const res = await verifyForgotPasswordOTP(email, otp);
      if (!res || res.success === false) {
        throw new Error(res?.message || "Failed to verify OTP");
      }
      toast.success(res.message || "OTP verified successfully", { id: toastId });
      // OTP verified - show password reset fields
      setOtpVerified(true);
    } catch (err) {
      console.error("Error verifying OTP:", err);
      toast.error(err.message || "Failed to verify OTP", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const { newPassword, confirmPassword } = form;

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
      // Call backend to complete password reset with verified email
      const result = await resetPasswordAfterOTP(form.email, newPassword);

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success("Password reset successfully 🔐", { id: toastId });
      navigate("/profile");

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        email: "",
      });
      setOtpVerified(false);
      setOtpSent(false);
      setForgotMode(false);
      setOtp("");

    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
  const { currentPassword, newPassword, confirmPassword } = form;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return toast.error("All fields are required");
  }

  if (newPassword.length < 6) {
    return toast.error("Password must be at least 6 characters");
  }

  if (newPassword !== confirmPassword) {
    return toast.error("Passwords do not match");
  }

  setLoading(true);
  const toastId = toast.loading("Updating password...");

  try {
    const result = await changePassword({ currentPassword: currentPassword.trim(), newPassword: newPassword.trim() });

    if (!result.success) {
      // 🔥 NOW this will work correctly
      if (result.message === "Current password is incorrect") {
        setForgotPromptVisible(true);
        toast.error("Wrong current password", { id: toastId });
        return;
      }

      throw new Error(result.message);
    }

    toast.success("Password updated successfully 🔐", { id: toastId });
    navigate(-1);

    setForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      email: "",
    });

  } catch (err) {
    console.error(err?.message || err);
    toast.error(err?.message || "Something went wrong", { id: toastId });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-6 rounded-[50px] bg-white/5 backdrop-blur-xl border border-white/20 text-white shadow-lg">
        
        <div className="flex items-center gap-2 ">
        <button 
               onClick={() => navigate(-1)}
               className="group flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 px-3 py-6 rounded-lg hover:bg-white/10"
            >
               <span className="p-1.5 rounded-full bg-white/5 group-hover:bg-white/15 transition-all duration-300 group-hover:scale-110">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
               </span>
               <span className="text-lg font-semibold hidden sm:inline \">Back</span>
            </button>

        <h2 className="text-2xl font-semibold mb-2 text-center">
          {forgotMode ? "Reset Password via Email" : "Change Password"}
        </h2>
    </div>

        <p className="text-sm text-white/70 text-center mb-6">
          {forgotMode ? (otpVerified ? "Set your new password" : (otpSent ? "Enter the OTP sent to your email" : "Enter your email to receive an OTP")) : "Update your account password securely"}
        </p>

        {/* Show forgot password error prompt */}
        

        {/* Show password change inputs or email input based on forgotMode */}
        {!forgotMode ? (
          <>
            {/* Current Password */}
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/50 outline-none mb-3"
            />

            {/* New Password */}
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/50 outline-none mb-3"
            />

            {/* Confirm Password */}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/50 outline-none mb-4"
            />
            {forgotPromptVisible && !forgotMode && (
          <div className="mb-4 mt-4 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-center ">
            <p className="font-semibold">❌ Current password is incorrect</p>
            <button
              onClick={handleForgotClick}
              className="mt-2 text-white hover:text-red-400 font-semibold "
            >
              🔑 Forgot Password? Reset via Email
            </button>
          </div>
        )}

            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-1/2 py-3 rounded-xl bg-linear-to-r from-pink-500 via-fuchsia-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
            
          </>
        ) : (
          <>
            {!otpVerified ? (
              <>
                {/* Email input for forgot password flow */}
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email || ""}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/50 outline-none mb-4"
                  disabled={otpSent}
                />

                {otpSent && (
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-600/80 focus:outline-none focus:border-green-500 focus:bg-white/20 transition-all text-center text-3xl tracking-widest font-mono"
                  />
                )}

                <div className="flex justify-center mt-4 gap-3">
                  {!otpSent ? (
                    <button
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="flex-1 py-3 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition"
                    >
                      {loading ? "Sending..." : "Send OTP"}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleVerifyOtp}
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl bg-linear-to-r from-green-500 to-emerald-500 text-white font-semibold hover:opacity-90 transition"
                      >
                        {loading ? "Verifying..." : "Verify OTP"}
                      </button>
                      <button
                        onClick={() => {
                          setOtpSent(false);
                          setOtp("");
                        }}
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl bg-linear-to-r from-gray-600 to-gray-700 text-white font-semibold hover:opacity-90 transition"
                      >
                        Change Email
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* New Password */}
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/50 outline-none mb-3"
                />

                {/* Confirm Password */}
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/50 outline-none mb-4"
                />

                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleResetPassword}
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl bg-linear-to-r from-green-500 to-emerald-500 text-white font-semibold hover:opacity-90 transition"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                  <button
                    onClick={() => {
                      setOtpVerified(false);
                      setOtpSent(false);
                      setOtp("");
                      setForm({ ...form, newPassword: "", confirmPassword: "" });
                    }}
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl bg-linear-to-r from-gray-600 to-gray-700 text-white font-semibold hover:opacity-90 transition"
                  >
                    Back
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;