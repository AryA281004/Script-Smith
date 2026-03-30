import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { connectGmail, verifyGmail } from "../api/api";
import { toast } from "sonner";
import ReactDOM from "react-dom";

const ProfileHomeCard = () => {
  const { userData } = useSelector((s) => s.user || {});
  const name = userData?.name || "User";
  const initial = name.charAt(0).toUpperCase() || "U";
  const credits = userData?.credits ?? 0;
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState("email"); // 'email' or 'otp'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  // Gmail is connected if either isGoogle is true OR gmailConnected is true
  const [isGmailConnected, setIsGmailConnected] = useState(
    userData?.isGoogle || userData?.gmailConnected || false,
  );

  // Sync with Redux changes
  useEffect(() => {
    // If user is Google authenticated or Gmail is connected, show as connected
    if (userData?.isGoogle || userData?.gmailConnected) {
      setIsGmailConnected(true);
    } else {
      setIsGmailConnected(false);
    }
  }, [userData?.isGoogle, userData?.gmailConnected]);

  const handleViewNotesClick = () => {
    navigate("/profile");
  };

  const handleConnectGmail = () => {
    setShowModal(true);
    setModalStep("email");
    setEmail("");
    setOtp("");
  };

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter an email");
      return;
    }

    setLoading(true);
    try {
      const response = await connectGmail(email);
      if (response.success) {
        toast.success("OTP sent to your email");
        setModalStep("otp");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await verifyGmail(otp);

      if (response?.success === true) {
        setIsGmailConnected(true);
        toast.success("Gmail connected successfully!");
        setTimeout(() => {
          setShowModal(false);
          setEmail("");
          setOtp("");
        }, 500);
      } else {
        toast.error(response?.message || "Failed to verify OTP");
      }
    } catch (error) {
      console.error("Verify error:", error);
      toast.error("Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalStep("email");
    setEmail("");
    setOtp("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="transform-gpu mt-4 
                    w-[82vw] xl:w-[20vw] 2xl:w-[20vw] h-fit
                    relative overflow-hidden rounded-[40px] md:rounded-[40px]
                    px-4 py-5
                     bg-white/10 backdrop-blur-2xl
                    border border-white/20
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_20px_60px_rgba(0,0,0,0.5)]
                    transition-all duration-500

                    before:absolute before:inset-0 before:rounded-[40px]
                    before:bg-linear-to-br before:from-white/30 before:via-transparent before:to-transparent
                    before:opacity-60 before:pointer-events-none

                    flex flex-col items-center text-center
  "
    >
      {/* Avatar */}
      <div
        className="
                        relative w-16 h-16 xl:w-12 xl:h-12  2xl:w-16 2xl:h-16
                        rounded-full
                         bg-white/10 backdrop-blur-xl
                        border border-white/30
                        shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_15px_50px_rgba(0,0,0,0.4)]
                        flex items-center justify-center
                        text-2xl font-bold text-white
    
    "
      >
        {initial}
      </div>

      {/* Name */}
      <h2 className="text-3xl xl:text-2xl 2xl:text-3xl font-bold text-white tracking-wide">{name}</h2>

      {/* Divider Glow */}
      <div className="w-20 h-0.5 bg-linear-to-r from-transparent via-pink-400 to-transparent my-2 opacity-60" />

      {/* Credits */}
      <div className ='flex flex-col xl:flex-row 2xl:flex-col items-center gap-1'>
      <p className="text-lg text-white/70">Credits:</p>
      <p className="text-3xl font-extrabold text-pink-400 mb-1  2xl:mb-3">{credits}</p>
      </div>
      <div className="flex flex-col xl:flex-col 2xl:flex-row items-center gap-1 w-full">
        

        {isGmailConnected ? (
          <motion.div
            
            className="
                          w-full  px-1 py-2 xl:py-0 2xl:py-4 rounded-[50px]
                         border border-white/2
                        font-semibold tracking-wide
                          flex items-center justify-center gap-2
                          relative
                "
          >
            
            <svg
              width="40px"
              height="40px"
              viewBox="0 0 48 48"
              enable-background="new 0 0 48 48"
              id="_x3C_Layer_x3E_"
              version="1.1"
              xml:space="preserve"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              fill="#000000"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <g id="tick_x2C__check_mark">
                  {" "}
                  <circle cx="24" cy="24" fill="#d8fde8" r="21.5"></circle>{" "}
                  <path
                    d="M24,46C11.869,46,2,36.131,2,24S11.869,2,24,2c6.219,0,12.175,2.65,16.342,7.271 c0.186,0.205,0.169,0.521-0.036,0.706c-0.206,0.185-0.522,0.168-0.706-0.036C35.622,5.53,29.937,3,24,3C12.421,3,3,12.42,3,24 s9.421,21,21,21s21-9.42,21-21c0-2.299-0.369-4.56-1.098-6.72c-0.089-0.262,0.052-0.545,0.313-0.633 c0.268-0.088,0.546,0.052,0.634,0.314C45.613,19.224,46,21.592,46,24C46,36.131,36.131,46,24,46z"
                    fill="#43bb02"
                  ></path>{" "}
                  <path
                    d="M24,45C12.421,45,3,35.58,3,24S12.421,3,24,3c5.834,0,11.454,2.458,15.419,6.743 c0.188,0.203,0.175,0.519-0.027,0.707c-0.203,0.187-0.52,0.176-0.707-0.028C34.909,6.341,29.557,4,24,4C12.972,4,4,12.972,4,24 s8.972,20,20,20s20-8.972,20-20c0-2.03-0.303-4.031-0.899-5.948c-0.082-0.264,0.065-0.544,0.329-0.626 c0.263-0.08,0.545,0.066,0.626,0.329C44.683,19.768,45,21.869,45,24C45,35.58,35.579,45,24,45z"
                    fill="#FFFFFF"
                  ></path>{" "}
                  <g>
                    {" "}
                    <g>
                      {" "}
                      <path
                        d="M21.584,33.834c0.892,0.888,2.438,0.888,3.331,0l19.387-19.309c0.931-0.926,0.931-2.433,0-3.359 c-0.892-0.888-2.438-0.888-3.33,0L24.007,28.061c-0.399,0.398-1.116,0.398-1.516,0l-6.463-6.436 c-0.446-0.444-1.037-0.688-1.665-0.688s-1.22,0.244-1.665,0.688c-0.931,0.926-0.931,2.433,0,3.359L21.584,33.834z"
                        fill="#66ff7f"
                      ></path>{" "}
                      <path
                        d="M23.249,35.005c-0.735,0-1.471-0.272-2.018-0.817v0l-8.886-8.85c-0.545-0.542-0.846-1.265-0.846-2.035 c0-0.769,0.301-1.491,0.846-2.033c1.077-1.074,2.954-1.076,4.035,0l6.463,6.436c0.205,0.204,0.606,0.205,0.81,0l16.966-16.896 c1.094-1.089,2.941-1.089,4.035,0c0.545,0.542,0.846,1.265,0.846,2.034c0,0.769-0.301,1.491-0.846,2.033L25.268,34.188 C24.721,34.733,23.984,35.005,23.249,35.005z M14.363,21.437c-0.495,0-0.961,0.193-1.312,0.542 c-0.355,0.354-0.552,0.824-0.552,1.325s0.195,0.972,0.551,1.325l8.886,8.851c0.699,0.695,1.927,0.696,2.626,0L43.949,14.17 c0.354-0.353,0.551-0.824,0.551-1.325s-0.195-0.972-0.551-1.325c-0.699-0.696-1.926-0.697-2.625,0L24.359,28.416 c-0.59,0.59-1.63,0.59-2.222,0l-6.462-6.436C15.324,21.629,14.858,21.437,14.363,21.437z"
                        fill="#43bb02"
                      ></path>{" "}
                    </g>{" "}
                    <path
                      d="M13,23.804c-0.276,0-0.5-0.224-0.5-0.5c0-0.5,0.196-0.971,0.552-1.325c0.351-0.35,0.816-0.542,1.312-0.542 c0.276,0,0.5,0.224,0.5,0.5s-0.224,0.5-0.5,0.5c-0.229,0-0.443,0.089-0.606,0.25c-0.165,0.166-0.257,0.385-0.257,0.617 C13.5,23.581,13.276,23.804,13,23.804z"
                      fill="#FFFFFF"
                    ></path>{" "}
                    <path
                      d="M26.161,27.828c-0.128,0-0.257-0.049-0.354-0.147c-0.194-0.196-0.194-0.512,0.002-0.708l14.07-14.013 c0.195-0.194,0.512-0.195,0.707,0.001c0.194,0.196,0.194,0.512-0.002,0.708l-14.07,14.013 C26.416,27.779,26.289,27.828,26.161,27.828z"
                      fill="#FFFFFF"
                    ></path>{" "}
                  </g>{" "}
                </g>{" "}
              </g>
            </svg>
            <span className="text-green-500 font-bold">Gmail Connected</span>
          </motion.div>
        ) : (
          <motion.button
            onClick={handleConnectGmail}
            whileHover={{ rotateX: 10, rotateY: -10, scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
            style={{ transformStyle: "preserve-3d" }}
            className="
                          w-[50vw] sm:w-2/3 px-1 py-4 rounded-full
                           bg-white/10 backdrop-blur-xl
                          border border-white/30
                           text-white font-semibold tracking-wide
                          shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_30px_rgba(0,0,0,0.3)]
                          transition-all duration-300
                           hover:bg-white/20
                          hover:scale-[1.03]
                          active:scale-95
        "
          >
            Connect Gmail
          </motion.button>
        )}
        <motion.button
          onClick={() => handleViewNotesClick()}
          whileHover={{ rotateX: 10, rotateY: -10, scale: 1.07 }}
          whileTap={{ scale: 0.97 }}
          style={{ transformStyle: "preserve-3d" }}
          className="
                       w-[50vw] xl:w-1/2 2xl:w-1/3 px-2.5 py-4 mr-0 2xl:mr-4 rounded-full
                        bg-linear-to-r from-pink-500 via-fuchsia-500 to-purple-500
                         text-white font-semibold tracking-wide
                        shadow-[0_10px_40px_rgba(236,72,153,0.5)]
                        transition-all duration-300
                        hover:scale-[1.03]
                        hover:shadow-[0_15px_60px_rgba(236,72,153,0.8)]
                        active:scale-95
      "
        >
          Dashboard
        </motion.button>
      </div>

      {/* Buttons */}
      

      {/* Modal Portal - rendered at body level */}
      {showModal &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:w-96 bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-3xl p-6 sm:p-8 relative overflow-hidden"
            >
              {/* Gradient overlay */}
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-pink-500 via-fuchsia-500 to-purple-500" />

              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                ✕
              </button>

              {/* Modal Header */}
              <div className="mb-6 pr-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  Connect Gmail
                </h3>
                <p className="text-white/60 text-sm sm:text-base">
                  {modalStep === "email"
                    ? "Add your Gmail to your profile"
                    : "We sent an OTP to your email"}
                </p>
              </div>

              {/* Email Step */}
              {modalStep === "email" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-pink-500 focus:bg-white/20 transition-all"
                    />
                  </div>
                  <motion.button
                    onClick={handleSendOtp}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl bg-linear-to-r from-pink-500 to-fuchsia-500 text-white font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </motion.button>
                </div>
              )}

              {/* OTP Step */}
              {modalStep === "otp" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      maxLength="6"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-green-500 focus:bg-white/20 transition-all text-center text-3xl tracking-widest font-mono"
                    />
                    <p className="text-white/50 text-xs mt-2">
                      Check your email for the 6-digit code
                    </p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <motion.button
                      onClick={() => setModalStep("email")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      onClick={handleVerifyOtp}
                      disabled={loading || otp.length !== 6}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 rounded-xl bg-linear-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {loading ? "Verifying..." : "Verify"}
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>,
          document.body,
        )}
    </motion.div>
  );
};

export default ProfileHomeCard;
