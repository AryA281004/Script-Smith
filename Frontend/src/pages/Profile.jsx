import React from 'react';
import { useSelector } from 'react-redux';
import Dashboardprofile from '../components/Dashboardprofile';
import NotesList from '../components/NotesList';
import { getTotalNotesNumber } from '../api/api';

const Profile = () => {
  const { userData } = useSelector((state) => state.user || {});
  const [notes, setNotes] = React.useState(1);

  React.useEffect(() => {
    const fetchNotesNumber = async () => {
      try {
        const data = await getTotalNotesNumber();
        setNotes(data.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotesNumber();
    const onNotesChanged = () => {
      fetchNotesNumber();
    };
    window.addEventListener('notes:changed', onNotesChanged);

    return () => {
      window.removeEventListener('notes:changed', onNotesChanged);
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-4 2xl:gap-8 mt-4 2xl:mt-10">

      <div className="w-full flex flex-col xl:flex-row 2xl:flex-row gap-4 2xl:gap-8">
        <Dashboardprofile />

        <div className="flex-1">
          <div className="relative overflow-hidden rounded-[40px] md:rounded-[40px] px-6 py-6 bg-white/5 backdrop-blur-2xl border border-white/20">

            <h2 className="text-2xl font-bold">Profile</h2>
            <p className="text-white/70 mt-2">
              Manage your account details and view usage statistics.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-sm text-white/60">Email</div>
                <div className="font-semibold">{userData?.email ?? "—"}</div>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-sm text-white/60">Credits</div>
                <div className="font-bold text-pink-500">
                  {userData?.credits ?? 0}
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-sm text-white/60">Total Notes</div>
                <div className="font-bold text-pink-500">
                  {notes ?? 0}
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-sm text-white/60">Badges</div>
                <div className="font-semibold text-pink-400/50">
                  Coming soon...
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Notes Section */}

      <div className="relative overflow-hidden rounded-[40px] md:rounded-[40px] px-6 py-6 bg-white/5 backdrop-blur-xl border border-white/20">

        <h2 className="text-2xl font-bold">Your Notes</h2>

        <p className="text-white/70 mt-2">
          All notes you created are shown here. Download or view them.
        </p>

        <NotesList />

      </div>

    </div>
  );
};

export default Profile;