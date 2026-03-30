import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { logoutCurrentUser, changeName , changePassword} from '../api/api';
import {useNavigate} from 'react-router-dom';

const AccountModal = ({ isOpen, onClose, initialTab }) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((s) => s.user || {});
  const [active, setActive] = useState('name');
  const [name, setName] = useState(userData?.name || userData?.displayName || '');
  const overlayRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    setName(userData?.name || userData?.displayName || '');
  }, [userData, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (initialTab) setActive(initialTab);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  // 🚀 OPTIMISTIC UPDATE VERSION
  const handleSaveName = async () => {
    if (!name.trim()) return;

    const previousUser = { ...userData };

    // ✅ instant UI update
    dispatch(setUserData({ ...userData, name }));

    // ✅ close instantly
    onClose();

    try {
      await changeName(name); // background call
      toast.success('Name updated successfully!');
    } catch (err) {
      console.error(err);

      // ❗ rollback if failed
      dispatch(setUserData(previousUser));

      toast.error('Failed to update name on server');
    }
  };

  const handleResetPassword = async () => {
    try {
      navigate('/resetpassword') 
      // Assuming this triggers a reset email or similar action 
      toast.success('Redirecting to password reset page...');
      onClose();
      
    } catch (e) {
      toast.error('Reset failed');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account?')) return;

    try {
      await logoutCurrentUser(dispatch);
      toast.success('Account deleted successfully!');
      onClose();
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete account');
    }
  };

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative w-full max-w-2xl mx-4">
        <div className="bg-white/6 backdrop-blur-xl border border-white/20 rounded-[50px] p-6 text-white shadow-lg">
          
          {/* Header */}
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-semibold">Account settings</h3>
            <button onClick={onClose} className="text-white/70">✕</button>
          </div>

          <p className="text-white/70 mt-2">
            Change your display name, reset password, or delete your account.
          </p>

          {/* Tabs */}
          <div className="mt-4 flex gap-3">
            <button onClick={() => setActive('name')}
              className={`px-3 py-1 rounded-[25px] ${active==='name'
                ? 'bg-linear-to-r from-pink-500 via-fuchsia-500 to-purple-500'
                : 'bg-white/3'}`}>
              Change name
            </button>

            <button onClick={() => setActive('password')}
              className={`px-3 py-1 rounded-[25px] ${active==='password'
                ? 'bg-linear-to-r from-pink-500 via-fuchsia-500 to-purple-500'
                : 'bg-white/3'}`}>
              Reset password
            </button>

            <button onClick={() => setActive('delete')}
              className={`px-3 py-1 rounded-[25px] ${active==='delete'
                ? 'bg-red-600 text-white'
                : 'bg-white/3'}`}>
              Delete account
            </button>
          </div>

          {/* Content */}
          <div className="mt-6">

            {/* CHANGE NAME */}
            {active === 'name' && (
              <div >
                <div className="flex flex-col gap-1">
                <label className="text-white/70 text-sm">Display name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-1/2 mt-2 p-3 rounded-[20px] bg-white/5 border border-white/10 text-white"
                />
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={handleSaveName}
                    className="px-4 py-2 rounded bg-linear-to-r from-pink-500 via-fuchsia-500 to-purple-500 text-white"
                  >
                    Save
                  </button>

                  <button onClick={onClose} className="px-4 py-2 rounded bg-white/10">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* RESET PASSWORD */}
            {active === 'password' && (
              <div>
                

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={handleResetPassword}
                    className="px-4 py-2 rounded bg-white/10"
                  >
                    Reset
                  </button>

                  <button onClick={onClose} className="px-4 py-2 rounded bg-white/10">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* DELETE ACCOUNT */}
            {active === 'delete' && (
              <div>
                <p className="text-red-400">
                  Deleting your account is permanent.
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 rounded bg-red-600 text-white"
                  >
                    Delete account
                  </button>

                  <button onClick={onClose} className="px-4 py-2 rounded bg-white/10">
                    Cancel
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;