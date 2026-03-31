import axios from "axios";
import { serverUrl } from "../App";
import { setUserData, logoutUser, updateCredits } from "../redux/userSlice";

// ✅ CRITICAL: Add token to Authorization header for cross-domain requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const getPdfFilenameFromHeaders = (headers, fallback = "script-smith.pdf") => {
  const disposition = headers?.["content-disposition"] || headers?.["Content-Disposition"];
  if (!disposition || typeof disposition !== "string") return fallback;

  // RFC 5987 format: filename*=UTF-8''my-file.pdf
  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]).replace(/\"/g, "").trim();
    } catch {
      return utf8Match[1].replace(/\"/g, "").trim();
    }
  }

  // Standard format: filename="my-file.pdf"
  const normalMatch = disposition.match(/filename=\"?([^\";]+)\"?/i);
  if (normalMatch?.[1]) {
    return normalMatch[1].trim();
  }

  return fallback;
};

/**
 * user related API calls
 * - getcurrentUser
 * - logoutCurrentUser 
 */
export const getcurrentUser = async (dispatch, getState) => {
  // Check if user has been logged out
  if (getState && getState().user?.isLoggedOut) {
    return null; // Don't fetch if user was explicitly logged out
  }

  // Cookie-based auth only
  try {
    const response = await axios.get(serverUrl + "/api/user/currentuser", {
      withCredentials: true,
   
    });

    dispatch(setUserData(response.data.user));
  } catch (error) {
    console.error("Error fetching current user:", error);
    // If we get 401, the token is invalid so clear user data
    if (error.response?.status === 401) {
      dispatch(setUserData(null));
    }
    return null;
  }
};

export const  logoutCurrentUser = async (dispatch) => {
  try {
    // Clear user data first to prevent access
    dispatch(logoutUser());
    
    // ✅ CRITICAL: Clear token from localStorage
    localStorage.removeItem("authToken");

    // Then call the logout API
    await axios.post(
      serverUrl + "/api/auth/logout",
      {},
      {
        withCredentials: true,
      },
    );

    return { success: true, message: "Logout successful" };
  } catch (error) {
    console.error("Error during logout:", error);
    // Even if API call fails, keep user logged out locally
    return { success: false, message: "Logout completed locally" };
  }
};


/**
 * settings related API calls
 * - changeName
 * - changePassword
 * - forgotPassword
 * - otpForForgotPassword
 * - deleteAccount
 */
export const changeName = async (name) => {
  try {
    const result = await axios.put(serverUrl + "/api/settings/change-name", { name }, {
      withCredentials: true,
    });
    return { success: result.data.success, message: result.data.message };
  }
  catch (error) {
    console.error("Error changing name:", error);
    return { success: false, message: "Failed to change name. Please try again later." };
  }
};

export const changePassword = async ({ currentPassword, newPassword }) => {
  try {
    const res = await axios.put(
      serverUrl + "/api/settings/change-password",
      { currentPassword, newPassword },
      { withCredentials: true }
    );

    return {
      success: true,
      message: res.data.message,
    };

  } catch (err) {
    // Log only the message string to avoid printing the full response object in the browser console
    console.error("Error changing password:", err.response?.data?.message || err.message || "Unknown error");

    return {
      success: err.response?.data?.success === undefined ? false : !!err.response.data.success,
      message: err.response?.data?.message || err.message || "Failed to change password",
    };
  }
};

export const otpForForgotPassword = async (email) => {
  try {
    // Send OTP using the dedicated OTP route
    const result = await axios.post(serverUrl + "/api/settings/otp-for-forgot-password", { email }, {
      withCredentials: true,
    });
    return { success: result.data.success, message: result.data.message };
  }
  catch (error) {
    console.error("Error in OTP for forgot password:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to send OTP. Please try again later."
    };
  }
};

export const verifyForgotPasswordOTP = async (email, otp) => {
  try {
    const result = await axios.post(serverUrl + "/api/settings/verify-forgot-password-otp", { email, otp }, {
      withCredentials: true,
    });
    return { success: result.data.success, message: result.data.message };
  }
  catch (error) {
    console.error("Error verifying forgot password OTP:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to verify OTP. Please try again later."
    };
  }
};

export const resetPasswordAfterOTP = async (email, newPassword) => {
  try {
    const result = await axios.post(serverUrl + "/api/settings/reset-password-after-otp", { email, newPassword }, {
      withCredentials: true,
    });
    return { success: result.data.success, message: result.data.message };
  }
  catch (error) {
    console.error("Error resetting password after OTP:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to reset password. Please try again later."
    };
  }
};

export const deleteAccount = async (dispatch) => {
  try {
    const result = await axios.delete(serverUrl + "/api/settings/delete-account", {
      withCredentials: true,
    });
    if (result.data.success) {
      dispatch(logoutUser());
    }
    return { success: result.data.success, message: result.data.message };
  }
  catch (error) {
    console.error("Error deleting account:", error);
    return { success: false, message: "Failed to delete account. Please try again later." };
  }
};


/**
 * Gmail connection API calls
 * - connectGmail
 * - verifyGmail
 */
export const connectGmail = async (email) => {
  try {
    const result = await axios.post(serverUrl + "/api/connectgmail/connect-gmail", { email }, {
      withCredentials: true,
    });
    return { success: result.data.success, message: result.data.message };
  }
  catch (error) {
    console.error("Error connecting Gmail:", error);
    return { success: false, message: error.response?.data?.message || "Failed to send verification email. Please try again later." };
  }
};

export const verifyGmail = async (otp) => {
  try {
    const result = await axios.post(
      serverUrl + "/api/connectgmail/verify-gmail",
      { otp },
      { withCredentials: true }
    );

    return { success: result.data.success, message: result.data.message };

  } catch (error) {
    console.error("Error verifying Gmail:", error);

    return {
      success: false,
      message: error.response?.data?.message || "Failed to verify OTP"
    };
  }
};


/**
 * notes related API calls
 * - forgeNotes
 * - downloadPDF
 * - getNote
 * - getAllNotes
 * - deleteNote
 * - getTotalNotesNumber
 */
export const forgeNotes = async (payload, dispatch) => {
  try {
    const result = await axios.post(serverUrl + "/api/note/forge-note", payload, {
      withCredentials: true,
    });

    if (dispatch && result?.data?.creditLeft !== undefined) {
      try {
        dispatch(updateCredits(result.data.creditLeft));
      } catch (err) {
        void err;
      }
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error forging notes:", error);
    return { success: false, message: "Failed to forge notes. Please try again later." };
  }
}

export async function downloadPDF(result) {
  if (!result) throw new Error('Missing result');
  // ensure full server URL is used (avoid dev server 404) and include credentials
  const url = serverUrl ? `${serverUrl}/api/note/download-pdf` : '/api/note/download-pdf';
  try {
    const res = await axios.post(url, { result }, { responseType: 'blob', withCredentials: true });
    const blob = new Blob([res.data], { type: 'application/pdf' });
    const url_download = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url_download;
    a.download = getPdfFilenameFromHeaders(res.headers, `${(result.topic||'script-smith')}.pdf`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url_download);
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('Gmail account not connected. Please connect your Gmail account in Settings to download PDFs.');
    }
    throw error;
  }
}

export const downloadPDFByNoteId = async (noteId, topic) => {
  if (!noteId) throw new Error('Missing noteId');
  const url = serverUrl ? `${serverUrl}/api/note/download-pdf/${noteId}` : `/api/note/download-pdf/${noteId}`;
  try {
    const res = await axios.get(url, { responseType: 'blob', withCredentials: true });
    const blob = new Blob([res.data], { type: 'application/pdf' });
    const url_download = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url_download;
    a.download = getPdfFilenameFromHeaders(res.headers, `${(topic || 'script-smith')}.pdf`);
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url_download);
  } catch (error) {
    if (error.response?.status === 403) {

      throw new Error('Gmail account not connected. Please connect your Gmail account in Settings to download PDFs.');
    }
    throw error;
  }
}


export const getNote = async (noteId) => {
  try {
    const result = await axios.get(serverUrl + `/api/notes/my-notes/${noteId}`, {
      withCredentials: true,
    });
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error fetching note:', error);
    return { success: false, message: 'Failed to fetch note' };
  }
}

export const getAllNotes = async (dispatch) => {
  try {
    const result = await axios.get(serverUrl + "/api/notes/my-notes", {
      withCredentials: true,
    });
    return { success: true, data: result.data.notes , totalNotes: result.data.totalNotes};
  }
  catch (error) {
    console.error("Error fetching notes:", error);
    return { success: false, message: "Failed to fetch notes. Please try again later." };
  }
}

export const deleteNote = async (noteId) => {
  try {
    const result = await axios.delete(serverUrl + `/api/notes/my-notes/${noteId}`, {
      withCredentials: true,
    });
    return { success: true, message: result.data.message };
  }
  catch (error) {
    console.error("Error deleting note:", error);
    return { success: false, message: "Failed to delete note. Please try again later." };
  }
}

export const getTotalNotesNumber = async (dispatch) => {
  try {
    const result = await axios.get(serverUrl + "/api/notes/total-notes", {
      withCredentials: true,
    });
    return { success: true, data: result.data.totalNotes };
  }
  catch (error) {
    console.error("Error fetching total notes number:", error);
    return { success: false, message: "Failed to fetch total notes number. Please try again later." };
  }
}

export default function handler(req, res) {
  res.status(200).json({ message: "Hello" });
}


